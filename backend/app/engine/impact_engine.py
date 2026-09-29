from typing import Dict, List, Any, Set, Tuple
from backend.app.engine.graph_engine import GraphEngine
from backend.app.models.responses import ServiceState, ImpactAnalysis

class ImpactEngine:
    def __init__(self, graph_engine: GraphEngine):
        self.ge = graph_engine

    def calculate_impact(
        self,
        target_service: str,
        failure_type: str,
        severity: str
    ) -> Tuple[ImpactAnalysis, Dict[str, ServiceState], Dict[str, ServiceState]]:
        """
        Calculates deterministic propagation, affected services, affected features,
        and individual component states.
        """
        all_services = self.ge.get_services()
        all_features = self.ge.get_features()
        dependencies = self.ge.get_dependencies()

        service_states: Dict[str, ServiceState] = {
            s["id"]: "HEALTHY" for s in all_services
        }
        feature_states: Dict[str, ServiceState] = {
            f["id"]: "HEALTHY" for f in all_features
        }

        # 1. Target component state
        if failure_type == "HIGH LATENCY":
            service_states[target_service] = "DEGRADED"
        else:
            service_states[target_service] = "FAILED"

        # 2. Identify dependents in propagation graph
        dependents = self.ge.get_descendants(target_service)
        
        # Sort dependents by distance from target
        dep_distances: Dict[str, int] = {}
        for dep in dependents:
            try:
                import networkx as nx
                dist = nx.shortest_path_length(self.ge.propagation_graph, target_service, dep)
                dep_distances[dep] = dist
            except Exception:
                dep_distances[dep] = 1

        sorted_dependents = sorted(dependents, key=lambda d: dep_distances[d])

        # 3. Propagate states through dependency chain
        critical_deps_count = 0
        for dep in sorted_dependents:
            # Check edge criticality between this service and its target dependency
            is_critical = True
            for edge in dependencies:
                if edge["source"] == dep and edge["target"] in service_states:
                    target_state = service_states[edge["target"]]
                    if target_state in ["FAILED", "DEGRADED", "AFFECTED"]:
                        if edge.get("critical", True):
                            critical_deps_count += 1
                        else:
                            is_critical = False

            # Assign state based on distance and criticality
            dist = dep_distances.get(dep, 1)
            if dist == 1:
                # Direct dependent
                if failure_type in ["HTTP 500", "SCHEMA MISMATCH"]:
                    service_states[dep] = "FAILED" if is_critical else "DEGRADED"
                else:
                    service_states[dep] = "AFFECTED" if is_critical else "DEGRADED"
            else:
                # Upstream cascading dependent
                if is_critical:
                    service_states[dep] = "AFFECTED" if dist == 2 else "DEGRADED"
                else:
                    service_states[dep] = "DEGRADED"

        # 4. Evaluate Feature Impact
        affected_features: List[str] = []
        unaffected_features: List[str] = []

        for feat in all_features:
            feat_id = feat["id"]
            feat_deps = feat.get("dependsOn", [])
            
            # Check if any depended service is non-healthy
            failed_deps = [d for d in feat_deps if service_states.get(d) == "FAILED"]
            affected_deps = [d for d in feat_deps if service_states.get(d) in ["AFFECTED", "DEGRADED"]]

            if failed_deps:
                feature_states[feat_id] = "DEGRADED"
                affected_features.append(feat_id)
            elif affected_deps:
                feature_states[feat_id] = "DEGRADED"
                affected_features.append(feat_id)
            else:
                feature_states[feat_id] = "HEALTHY"
                unaffected_features.append(feat_id)

        # 5. Compile lists of affected and unaffected services
        affected_services = [
            s_id for s_id in sorted_dependents
            if service_states[s_id] != "HEALTHY"
        ]
        unaffected_services = [
            s["id"] for s in all_services
            if s["id"] != target_service and service_states[s["id"]] == "HEALTHY"
        ]

        propagation_paths = self.ge.get_propagation_paths(target_service)
        depth = self.ge.get_dependency_depth(target_service)

        # 6. Risk Level
        from backend.app.engine.risk_engine import RiskEngine
        risk_level = RiskEngine.calculate_risk(
            target_service=target_service,
            failure_type=failure_type,
            severity=severity,
            affected_services_count=len(affected_services),
            affected_features=affected_features,
            depth=depth,
            ge=self.ge
        )

        impact_analysis = ImpactAnalysis(
            failed_service=target_service,
            failure_type=failure_type,
            affected_services=affected_services,
            affected_features=affected_features,
            dependency_depth=depth,
            critical_dependency_count=critical_deps_count,
            risk_level=risk_level,
            propagation_path=propagation_paths,
            unaffected_services=unaffected_services,
            unaffected_features=unaffected_features
        )

        return impact_analysis, service_states, feature_states
