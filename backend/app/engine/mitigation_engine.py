from typing import Dict, List, Any, Optional
from backend.app.engine.graph_engine import GraphEngine
from backend.app.engine.timeline_engine import TimelineEngine
from backend.app.models.responses import (
    MitigationResult, StateDiffItem, ServiceState, RiskLevel, Mitigation
)

class MitigationEngine:
    def __init__(self, graph_engine: GraphEngine):
        self.ge = graph_engine

    def apply_mitigation(
        self,
        simulation_id: str,
        mitigation_id: str,
        target_service: str,
        failure_type: str,
        before_service_states: Dict[str, ServiceState],
        before_feature_states: Dict[str, ServiceState],
        before_risk_level: RiskLevel
    ) -> MitigationResult:
        # Find mitigation definition
        mitigation_info: Optional[Dict[str, Any]] = None
        for m in self.ge.get_mitigations():
            if m["id"] == mitigation_id:
                mitigation_info = m
                break

        if not mitigation_info:
            # Fallback default mitigation if ID mismatch
            mitigation_info = {
                "id": mitigation_id,
                "name": "Generic Fallback & Circuit Breaker",
                "strategy": "Trip breaker and route to graceful fallback",
                "description": "Isolates upstream failure and serves cached/degraded fallback response.",
                "recoversFeatures": ["checkout", "order-placement"],
                "recoversServices": ["order-service", "api-gateway", "user"],
                "degradedServices": ["payment-service"]
            }

        recovers_features_cfg = set(mitigation_info.get("recoversFeatures", []))
        recovers_services_cfg = set(mitigation_info.get("recoversServices", []))
        degraded_services_cfg = set(mitigation_info.get("degradedServices", []))

        after_service_states: Dict[str, ServiceState] = dict(before_service_states)
        after_feature_states: Dict[str, ServiceState] = dict(before_feature_states)

        recovered_services: List[str] = []
        recovered_features: List[str] = []
        remaining_affected: List[str] = []

        # 1. Update service states
        # Notice: The original external component (e.g. payment-api) remains FAILED/DEGRADED,
        # but internal services recover or enter DEGRADED mode!
        for svc_id, state in before_service_states.items():
            if svc_id == target_service:
                # Target failure persists or enters degraded mode
                after_service_states[svc_id] = "FAILED" if failure_type != "HIGH LATENCY" else "DEGRADED"
            elif svc_id in recovers_services_cfg and state in ["FAILED", "AFFECTED", "DEGRADED"]:
                if svc_id in degraded_services_cfg:
                    after_service_states[svc_id] = "DEGRADED"
                else:
                    after_service_states[svc_id] = "HEALTHY"
                    recovered_services.append(svc_id)
            elif svc_id in degraded_services_cfg:
                after_service_states[svc_id] = "DEGRADED"
            else:
                after_service_states[svc_id] = state

            if after_service_states[svc_id] in ["FAILED", "AFFECTED", "DEGRADED"] and svc_id != target_service:
                remaining_affected.append(svc_id)

        # 2. Update feature states
        for feat_id, state in before_feature_states.items():
            if feat_id in recovers_features_cfg and state != "HEALTHY":
                after_feature_states[feat_id] = "HEALTHY"
                recovered_features.append(feat_id)
            else:
                # Re-verify based on updated dependent services
                feat_cfg = next((f for f in self.ge.get_features() if f["id"] == feat_id), None)
                if feat_cfg:
                    deps = feat_cfg.get("dependsOn", [])
                    has_failed = any(after_service_states.get(d) == "FAILED" for d in deps)
                    has_degraded = any(after_service_states.get(d) in ["AFFECTED", "DEGRADED"] for d in deps)
                    if not has_failed and not has_degraded:
                        after_feature_states[feat_id] = "HEALTHY"
                        if state != "HEALTHY":
                            recovered_features.append(feat_id)

        # 3. Recalculate After Risk Level
        has_critical_feature_unrecovered = any(
            after_feature_states.get(f["id"]) != "HEALTHY"
            for f in self.ge.get_features()
            if f.get("criticality") == "critical"
        )
        if has_critical_feature_unrecovered:
            after_risk: RiskLevel = "HIGH"
        elif len(remaining_affected) > 0 or after_service_states.get(target_service) == "FAILED":
            after_risk = "LOW" if len(remaining_affected) <= 1 else "MEDIUM"
        else:
            after_risk = "LOW"

        # 4. Generate State Diff Items
        diff: List[StateDiffItem] = []
        for svc in self.ge.get_services():
            s_id = svc["id"]
            b_st = before_service_states.get(s_id, "HEALTHY")
            a_st = after_service_states.get(s_id, "HEALTHY")
            if s_id == target_service:
                status = "persisted_failure"
                note = f"Simulated failure remains injected at source ({s_id})"
            elif b_st != "HEALTHY" and a_st == "HEALTHY":
                status = "recovered"
                note = f"Recovered to healthy via {mitigation_info['name']}"
            elif a_st == "DEGRADED":
                status = "degraded"
                note = "Operating in resilient degraded mode (fallback active)"
            elif b_st == "HEALTHY" and a_st == "HEALTHY":
                status = "unaffected"
                note = "Remained unaffected throughout simulation"
            else:
                status = "persisted_failure"
                note = "Upstream degradation persists"

            diff.append(StateDiffItem(
                id=s_id,
                name=svc["name"],
                type="service",
                before_state=b_st,
                after_state=a_st,
                status=status,
                note=note
            ))

        for feat in self.ge.get_features():
            f_id = feat["id"]
            b_st = before_feature_states.get(f_id, "HEALTHY")
            a_st = after_feature_states.get(f_id, "HEALTHY")
            if b_st != "HEALTHY" and a_st == "HEALTHY":
                status = "recovered"
                note = "Feature recovered to fully operational state"
            elif a_st == "DEGRADED":
                status = "degraded"
                note = "Feature operating under partial service fallback"
            elif b_st == "HEALTHY" and a_st == "HEALTHY":
                status = "unaffected"
                note = "Feature unaffected by upstream fault"
            else:
                status = "persisted_failure"
                note = "Dependent services remain compromised"

            diff.append(StateDiffItem(
                id=f_id,
                name=feat["name"],
                type="feature",
                before_state=b_st,
                after_state=a_st,
                status=status,
                note=note
            ))

        # 5. Timeline & Explanation
        timeline = TimelineEngine.generate_mitigation_timeline(
            mitigation_name=mitigation_info["name"],
            recovered_services=recovered_services,
            recovered_features=recovered_features,
            remaining_affected=remaining_affected
        )

        all_states_combined: Dict[str, ServiceState] = {}
        all_states_combined.update(after_service_states)
        all_states_combined.update(after_feature_states)

        before_states_combined: Dict[str, ServiceState] = {}
        before_states_combined.update(before_service_states)
        before_states_combined.update(before_feature_states)

        explanation = (
            f"Applying '{mitigation_info['name']}' successfully arrested failure propagation from {target_service}. "
            f"Risk was reduced from {before_risk_level} to {after_risk}. "
            f"{len(recovered_features)} user features restored to operational status."
        )

        return MitigationResult(
            simulation_id=simulation_id,
            mitigation_id=mitigation_id,
            mitigation_name=mitigation_info["name"],
            mitigation_strategy=mitigation_info["strategy"],
            before_risk_level=before_risk_level,
            after_risk_level=after_risk,
            before_states=before_states_combined,
            after_states=all_states_combined,
            recovered_services=recovered_services,
            recovered_features=recovered_features,
            remaining_affected_services=remaining_affected,
            diff=diff,
            explanation=explanation,
            timeline=timeline
        )
