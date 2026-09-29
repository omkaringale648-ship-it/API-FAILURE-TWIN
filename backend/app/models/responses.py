from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field

ServiceState = Literal["HEALTHY", "FAILED", "AFFECTED", "DEGRADED"]
RiskLevel = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

class Service(BaseModel):
    id: str
    name: str
    type: str
    criticality: str
    initialState: ServiceState
    tier: Optional[int] = 0
    description: Optional[str] = ""
    currentState: Optional[ServiceState] = "HEALTHY"

class Dependency(BaseModel):
    source: str
    target: str
    critical: bool
    protocol: Optional[str] = "HTTP"

class Feature(BaseModel):
    id: str
    name: str
    criticality: str
    dependsOn: List[str]
    description: Optional[str] = ""
    state: Optional[ServiceState] = "HEALTHY"

class FailureType(BaseModel):
    id: str
    name: str
    category: str
    code: str
    description: str

class Mitigation(BaseModel):
    id: str
    failureType: str
    name: str
    strategy: str
    description: str
    effectiveness: str
    recoversFeatures: List[str]
    recoversServices: List[str]
    degradedServices: List[str]

class TimelineEvent(BaseModel):
    timestamp_offset: int
    step: int
    component: str
    event: str
    state: ServiceState
    detail: str

class GraphNode(BaseModel):
    id: str
    name: str
    type: str
    criticality: str
    state: ServiceState
    tier: int
    description: str
    incoming_dependencies: int
    outgoing_dependencies: int

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    critical: bool
    protocol: str
    is_propagating: bool = False

class GraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]
    features: List[Feature]
    system_status: str

class ImpactAnalysis(BaseModel):
    failed_service: str
    failure_type: str
    affected_services: List[str]
    affected_features: List[str]
    dependency_depth: int
    critical_dependency_count: int
    risk_level: RiskLevel
    propagation_path: List[List[str]]
    unaffected_services: List[str]
    unaffected_features: List[str]

class StateDiffItem(BaseModel):
    id: str
    name: str
    type: Literal["service", "feature"]
    before_state: ServiceState
    after_state: ServiceState
    status: Literal["recovered", "degraded", "persisted_failure", "unaffected"]
    note: str

class MitigationResult(BaseModel):
    simulation_id: str
    mitigation_id: str
    mitigation_name: str
    mitigation_strategy: str
    before_risk_level: RiskLevel
    after_risk_level: RiskLevel
    before_states: Dict[str, ServiceState]
    after_states: Dict[str, ServiceState]
    recovered_services: List[str]
    recovered_features: List[str]
    remaining_affected_services: List[str]
    diff: List[StateDiffItem]
    explanation: str
    timeline: List[TimelineEvent]

class SimulationResult(BaseModel):
    simulation_id: str
    failed_service: str
    failure_type: str
    duration: int
    severity: str
    affected_services: List[str]
    affected_features: List[str]
    dependency_depth: int
    risk_level: RiskLevel
    propagation_path: List[List[str]]
    service_states: Dict[str, ServiceState]
    feature_states: Dict[str, ServiceState]
    explanation: str
    mitigations: List[Mitigation]
    timeline: List[TimelineEvent]
    impact: ImpactAnalysis

class SystemTopologyResponse(BaseModel):
    system: Dict[str, str]
    services: List[Service]
    dependencies: List[Dependency]
    features: List[Feature]
    failureTypes: List[FailureType]
    mitigations: List[Mitigation]

class Scenario(BaseModel):
    id: str
    name: str
    description: str
    targetService: str
    failureType: str
    severity: str
    duration: int
    recommendedMitigationId: str
