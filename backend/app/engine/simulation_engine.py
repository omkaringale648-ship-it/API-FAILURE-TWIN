import uuid
from typing import Dict, List, Any, Optional
from backend.app.engine.graph_engine import GraphEngine
from backend.app.engine.impact_engine import ImpactEngine
from backend.app.engine.mitigation_engine import MitigationEngine
from backend.app.engine.timeline_engine import TimelineEngine
from backend.app.models.requests import FailureRequest, MitigationRequest
from backend.app.models.responses import (
    SimulationResult, MitigationResult, Mitigation, GraphResponse, GraphNode, GraphEdge, Feature, ServiceState
)

class SimulationEngine:
    def __init__(self):
        self.ge = GraphEngine()
        self.ie = ImpactEngine(self.ge)
        self.me = MitigationEngine(self.ge)
        self.active_simulations: Dict[str, Dict[str, Any]] = {}
        self.latest_simulation_id: Optional[str] = None

    def get_system_topology(self) -> Dict[str, Any]:
        return self.ge.raw_data

    def get_graph_state(self, simulation_id: Optional[str] = None) -> GraphResponse:
        """
        Returns nodes, edges, and feature states for visualization.
        If simulation_id is provided or active, reflects failure or mitigation state.
        """
        sim_data = self.active_simulations.get(simulation_id) if simulation_id else None
        if not sim_data and self.latest_simulation_id:
            sim_data = self.active_simulations.get(self.latest_simulation_id)

        service_states: Dict[str, ServiceState] = {}
        feature_states: Dict[str, ServiceState] = {}
        propagating_edges: set = set()

        if sim_data:
            # Check if mitigation was applied
            if "mitigation_result" in sim_data:
                after_states = sim_data["mitigation_result"].after_states
                for s in self.ge.get_services():
                    service_states[s["id"]] = after_states.get(s["id"], "HEALTHY")
                for f in self.ge.get_features():
                    feature_states[f["id"]] = after_states.get(f["id"], "HEALTHY")
            else:
                service_states = sim_data["service_states"]
                feature_states = sim_data["feature_states"]

            # Highlight propagation edges
            target = sim_data["target_service"]
            affected = set(sim_data["affected_services"] + [target])
            for dep in self.ge.get_dependencies():
                if dep["source"] in affected and dep["target"] in affected:
                    propagating_edges.add((dep["source"], dep["target"]))
        else:
            for s in self.ge.get_services():
                service_states[s["id"]] = s.get("initialState", "HEALTHY")
            for f in self.ge.get_features():
                feature_states[f["id"]] = "HEALTHY"

        nodes: List[GraphNode] = []
        for s in self.ge.get_services():
            s_id = s["id"]
            # NetworkX degree
            in_deg = self.ge.dependency_graph.in_degree(s_id) if s_id in self.ge.dependency_graph else 0
            out_deg = self.ge.dependency_graph.out_degree(s_id) if s_id in self.ge.dependency_graph else 0

            nodes.append(GraphNode(
                id=s_id,
                name=s["name"],
                type=s["type"],
                criticality=s["criticality"],
                state=service_states.get(s_id, "HEALTHY"),
                tier=s.get("tier", 0),
                description=s.get("description", ""),
                incoming_dependencies=in_deg,
                outgoing_dependencies=out_deg
            ))

        edges: List[GraphEdge] = []
        for dep in self.ge.get_dependencies():
            src = dep["source"]
            tgt = dep["target"]
            is_prop = (src, tgt) in propagating_edges or (tgt, src) in propagating_edges
            edges.append(GraphEdge(
                id=f"{src}->{tgt}",
                source=src,
                target=tgt,
                critical=dep.get("critical", True),
                protocol=dep.get("protocol", "HTTP"),
                is_propagating=is_prop
            ))

        features: List[Feature] = []
        for f in self.ge.get_features():
            features.append(Feature(
                id=f["id"],
                name=f["name"],
                criticality=f["criticality"],
                dependsOn=f["dependsOn"],
                description=f.get("description", ""),
                state=feature_states.get(f["id"], "HEALTHY")
            ))

        system_status = "Healthy"
        if sim_data:
            has_failed = any(st == "FAILED" for st in service_states.values())
            has_degraded = any(st in ["AFFECTED", "DEGRADED"] for st in service_states.values())
            if has_failed:
                system_status = "Critical (Fault Injected)"
            elif has_degraded:
                system_status = "Degraded (Mitigated / Recovering)"

        return GraphResponse(
            nodes=nodes,
            edges=edges,
            features=features,
            system_status=system_status
        )

    def simulate_failure(self, request: FailureRequest) -> SimulationResult:
        sim_id = f"sim-{uuid.uuid4().hex[:8]}"

        # Calculate deterministic impact
        impact, service_states, feature_states = self.ie.calculate_impact(
            target_service=request.target_service,
            failure_type=request.failure_type,
            severity=request.severity
        )

        # Generate deterministic explanation
        explanation = self._generate_explanation(
            target_service=request.target_service,
            failure_type=request.failure_type,
            affected_services=impact.affected_services,
            affected_features=impact.affected_features,
            depth=impact.dependency_depth
        )

        # Matched mitigations
        mitigations: List[Mitigation] = []
        for m in self.ge.get_mitigations():
            if m.get("failureType") == request.failure_type:
                mitigations.append(Mitigation(**m))
        if not mitigations:
            # Fallback to first 2 mitigations
            for m in self.ge.get_mitigations()[:2]:
                mitigations.append(Mitigation(**m))

        # Incident timeline
        timeline = TimelineEngine.generate_failure_timeline(
            target_service=request.target_service,
            failure_type=request.failure_type,
            affected_services=impact.affected_services,
            affected_features=impact.affected_features,
            service_states=service_states,
            ge=self.ge
        )

        result = SimulationResult(
            simulation_id=sim_id,
            failed_service=request.target_service,
            failure_type=request.failure_type,
            duration=request.duration,
            severity=request.severity,
            affected_services=impact.affected_services,
            affected_features=impact.affected_features,
            dependency_depth=impact.dependency_depth,
            risk_level=impact.risk_level,
            propagation_path=impact.propagation_path,
            service_states=service_states,
            feature_states=feature_states,
            explanation=explanation,
            mitigations=mitigations,
            timeline=timeline,
            impact=impact
        )

        # Store in-memory
        self.active_simulations[sim_id] = {
            "simulation_result": result,
            "target_service": request.target_service,
            "failure_type": request.failure_type,
            "severity": request.severity,
            "duration": request.duration,
            "service_states": service_states,
            "feature_states": feature_states,
            "affected_services": impact.affected_services,
            "affected_features": impact.affected_features,
            "impact": impact,
            "mitigations": mitigations
        }
        self.latest_simulation_id = sim_id

        return result

    def apply_mitigation(self, request: MitigationRequest) -> MitigationResult:
        sim_data = self.active_simulations.get(request.simulation_id)
        if not sim_data:
            # Check latest
            if self.latest_simulation_id and self.latest_simulation_id in self.active_simulations:
                sim_data = self.active_simulations[self.latest_simulation_id]
            else:
                raise ValueError(f"Simulation '{request.simulation_id}' not found. Please run a simulation first.")

        sim_res: SimulationResult = sim_data["simulation_result"]

        mitigation_result = self.me.apply_mitigation(
            simulation_id=request.simulation_id,
            mitigation_id=request.mitigation_id,
            target_service=sim_data["target_service"],
            failure_type=sim_data["failure_type"],
            before_service_states=sim_data["service_states"],
            before_feature_states=sim_data["feature_states"],
            before_risk_level=sim_res.risk_level
        )

        sim_data["mitigation_result"] = mitigation_result
        return mitigation_result

    def reset_simulation(self) -> Dict[str, Any]:
        self.active_simulations.clear()
        self.latest_simulation_id = None
        self.ge = GraphEngine()
        self.ie = ImpactEngine(self.ge)
        self.me = MitigationEngine(self.ge)
        return {
            "status": "reset",
            "environment": "simulation",
            "system_status": "Healthy",
            "active_simulations": 0
        }

    def _generate_explanation(
        self,
        target_service: str,
        failure_type: str,
        affected_services: List[str],
        affected_features: List[str],
        depth: int
    ) -> str:
        target_name = (self.ge.get_service_by_id(target_service) or {}).get("name", target_service)
        
        parts: List[str] = [
            f"Fault injection of {failure_type} into {target_name} halted normal contract responses."
        ]

        if affected_services:
            svc_names = [(self.ge.get_service_by_id(s) or {}).get("name", s) for s in affected_services]
            parts.append(
                f"Failure propagated {depth} tier{'s' if depth != 1 else ''} upstream, "
                f"directly degrading {', '.join(svc_names)} due to synchronous dependency couplings."
            )
        else:
            parts.append("Failure remained isolated at the leaf level with no upstream dependents impacted.")

        if affected_features:
            feat_objs = {f["id"]: f for f in self.ge.get_features()}
            feat_explanations = []
            for f_id in affected_features[:2]:
                f_obj = feat_objs.get(f_id, {})
                f_name = f_obj.get("name", f_id)
                # Trace dependent service linking to target
                deps = f_obj.get("dependsOn", [])
                linking_dep = next((d for d in deps if d in affected_services or d == target_service), None)
                if linking_dep:
                    dep_name = (self.ge.get_service_by_id(linking_dep) or {}).get("name", linking_dep)
                    feat_explanations.append(f"{f_name} depends on {dep_name}, which depends on {target_name}")
                else:
                    feat_explanations.append(f"{f_name} depends on upstream services in the blast radius")
            
            parts.append(f"Downstream features impacted: {'; '.join(feat_explanations)}.")

        return " ".join(parts)
