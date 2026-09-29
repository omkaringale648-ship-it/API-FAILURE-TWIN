import json
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional
import networkx as nx
from backend.app.config import SYSTEM_FILE

class GraphEngine:
    def __init__(self, system_path: Optional[Path] = None):
        self.system_path = system_path or SYSTEM_FILE
        self.raw_data = self._load_data()
        self.dependency_graph = nx.DiGraph()
        self.propagation_graph = nx.DiGraph()
        self._build_graphs()

    def _load_data(self) -> Dict[str, Any]:
        with open(self.system_path, "r", encoding="utf-8") as f:
            return json.load(f)

    def _build_graphs(self):
        self.dependency_graph.clear()
        self.propagation_graph.clear()

        # Add nodes with metadata
        for svc in self.raw_data.get("services", []):
            node_id = svc["id"]
            self.dependency_graph.add_node(
                node_id,
                name=svc["name"],
                type=svc["type"],
                criticality=svc["criticality"],
                initialState=svc["initialState"],
                tier=svc.get("tier", 0),
                description=svc.get("description", "")
            )
            self.propagation_graph.add_node(
                node_id,
                name=svc["name"],
                type=svc["type"],
                criticality=svc["criticality"],
                initialState=svc["initialState"],
                tier=svc.get("tier", 0),
                description=svc.get("description", "")
            )

        # Add edges: source depends on target
        # In dependency_graph: source -> target
        # In propagation_graph: target -> source (failure flows from target to dependent source)
        for dep in self.raw_data.get("dependencies", []):
            src = dep["source"]
            tgt = dep["target"]
            is_critical = dep.get("critical", True)
            protocol = dep.get("protocol", "HTTP")

            self.dependency_graph.add_edge(
                src, tgt, critical=is_critical, protocol=protocol
            )
            self.propagation_graph.add_edge(
                tgt, src, critical=is_critical, protocol=protocol
            )

    def get_services(self) -> List[Dict[str, Any]]:
        return self.raw_data.get("services", [])

    def get_service_by_id(self, service_id: str) -> Optional[Dict[str, Any]]:
        for svc in self.raw_data.get("services", []):
            if svc["id"] == service_id:
                return svc
        return None

    def get_dependencies(self) -> List[Dict[str, Any]]:
        return self.raw_data.get("dependencies", [])

    def get_features(self) -> List[Dict[str, Any]]:
        return self.raw_data.get("features", [])

    def get_failure_types(self) -> List[Dict[str, Any]]:
        return self.raw_data.get("failureTypes", [])

    def get_mitigations(self) -> List[Dict[str, Any]]:
        return self.raw_data.get("mitigations", [])

    def get_descendants(self, target_service: str) -> List[str]:
        """Returns all services that transitively depend on the target service."""
        if target_service not in self.propagation_graph:
            return []
        return list(nx.descendants(self.propagation_graph, target_service))

    def get_propagation_paths(self, target_service: str) -> List[List[str]]:
        """Returns paths from target_service to all upstream dependents."""
        if target_service not in self.propagation_graph:
            return []
        
        dependents = self.get_descendants(target_service)
        paths = []
        for dep in dependents:
            try:
                for path in nx.all_simple_paths(self.propagation_graph, target_service, dep):
                    paths.append(path)
            except nx.NetworkXNoPath:
                continue
        return paths

    def get_dependency_depth(self, target_service: str) -> int:
        """Calculates maximum distance from target_service in propagation graph."""
        if target_service not in self.propagation_graph:
            return 0
        dependents = self.get_descendants(target_service)
        if not dependents:
            return 0
        
        max_depth = 0
        for dep in dependents:
            try:
                length = nx.shortest_path_length(self.propagation_graph, target_service, dep)
                if length > max_depth:
                    max_depth = length
            except nx.NetworkXNoPath:
                pass
        return max_depth
