from typing import List
from backend.app.engine.graph_engine import GraphEngine
from backend.app.models.responses import RiskLevel

class RiskEngine:
    @staticmethod
    def calculate_risk(
        target_service: str,
        failure_type: str,
        severity: str,
        affected_services_count: int,
        affected_features: List[str],
        depth: int,
        ge: GraphEngine
    ) -> RiskLevel:
        """
        Deterministic Risk Calculation Engine:
        Evaluates blast radius scale, component criticality, feature impact, and configured severity.
        """
        target_info = ge.get_service_by_id(target_service)
        is_target_critical = target_info.get("criticality") == "critical" if target_info else False

        # Identify critical features affected
        all_features = {f["id"]: f for f in ge.get_features()}
        has_critical_feature_impact = any(
            all_features.get(f_id, {}).get("criticality") == "critical"
            for f_id in affected_features
        )

        # Rule 1: CRITICAL
        # - Explicit CRITICAL severity with multiple affected services
        # - Target is critical AND critical feature (e.g. checkout, payment-processing) degraded
        # - Deep blast radius (depth >= 3) with >= 3 affected services
        if severity == "CRITICAL" and (affected_services_count >= 2 or has_critical_feature_impact):
            return "CRITICAL"
        if is_target_critical and has_critical_feature_impact and affected_services_count >= 2:
            return "CRITICAL"
        if depth >= 3 and affected_services_count >= 4:
            return "CRITICAL"

        # Rule 2: HIGH
        # - Severity HIGH with at least 1 affected service or critical feature
        # - Any critical feature degraded with depth >= 2
        # - Affected services >= 2 with severity >= MEDIUM
        if severity in ["CRITICAL", "HIGH"] and (affected_services_count >= 1 or has_critical_feature_impact):
            return "HIGH"
        if has_critical_feature_impact:
            return "HIGH"
        if affected_services_count >= 2 and severity != "LOW":
            return "HIGH"

        # Rule 3: MEDIUM
        # - At least 1 service affected, or non-critical features affected
        if affected_services_count >= 1 or len(affected_features) >= 1:
            return "MEDIUM"

        # Rule 4: LOW
        # - Isolated leaf node or no downstream impact
        return "LOW"
