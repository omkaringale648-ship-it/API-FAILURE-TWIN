export type ServiceState = 'HEALTHY' | 'FAILED' | 'AFFECTED' | 'DEGRADED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type FailureTypeId =
  | 'HTTP 500'
  | 'HTTP 429'
  | 'TIMEOUT'
  | 'HIGH LATENCY'
  | 'SCHEMA MISMATCH';

export interface Service {
  id: string;
  name: string;
  type: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  initialState: ServiceState;
  tier?: number;
  description?: string;
  currentState?: ServiceState;
}

export interface Dependency {
  source: string;
  target: string;
  critical: boolean;
  protocol?: string;
}

export interface Feature {
  id: string;
  name: string;
  criticality: 'critical' | 'high' | 'medium' | 'low';
  dependsOn: string[];
  description?: string;
  state?: ServiceState;
}

export interface FailureType {
  id: FailureTypeId;
  name: string;
  category: string;
  code: string;
  description: string;
}

export interface Mitigation {
  id: string;
  failureType: string;
  name: string;
  strategy: string;
  description: string;
  effectiveness: 'high' | 'medium' | 'low';
  recoversFeatures: string[];
  recoversServices: string[];
  degradedServices: string[];
}

export interface TimelineEvent {
  timestamp_offset: number;
  step: number;
  component: string;
  event: string;
  state: ServiceState;
  detail: string;
}

export interface GraphNode {
  id: string;
  name: string;
  type: string;
  criticality: string;
  state: ServiceState;
  tier: number;
  description: string;
  incoming_dependencies: number;
  outgoing_dependencies: number;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  critical: boolean;
  protocol: string;
  is_propagating: boolean;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
  features: Feature[];
  system_status: string;
}

export interface ImpactAnalysis {
  failed_service: string;
  failure_type: string;
  affected_services: string[];
  affected_features: string[];
  dependency_depth: number;
  critical_dependency_count: number;
  risk_level: RiskLevel;
  propagation_path: string[][];
  unaffected_services: string[];
  unaffected_features: string[];
}

export interface StateDiffItem {
  id: string;
  name: string;
  type: 'service' | 'feature';
  before_state: ServiceState;
  after_state: ServiceState;
  status: 'recovered' | 'degraded' | 'persisted_failure' | 'unaffected';
  note: string;
}

export interface MitigationResult {
  simulation_id: string;
  mitigation_id: string;
  mitigation_name: string;
  mitigation_strategy: string;
  before_risk_level: RiskLevel;
  after_risk_level: RiskLevel;
  before_states: Record<string, ServiceState>;
  after_states: Record<string, ServiceState>;
  recovered_services: string[];
  recovered_features: string[];
  remaining_affected_services: string[];
  diff: StateDiffItem[];
  explanation: string;
  timeline: TimelineEvent[];
}

export interface SimulationResult {
  simulation_id: string;
  failed_service: string;
  failure_type: FailureTypeId;
  duration: number;
  severity: SeverityLevel;
  affected_services: string[];
  affected_features: string[];
  dependency_depth: number;
  risk_level: RiskLevel;
  propagation_path: string[][];
  service_states: Record<string, ServiceState>;
  feature_states: Record<string, ServiceState>;
  explanation: string;
  mitigations: Mitigation[];
  timeline: TimelineEvent[];
  impact: ImpactAnalysis;
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  targetService: string;
  failureType: FailureTypeId;
  severity: SeverityLevel;
  duration: number;
  recommendedMitigationId: string;
}

export interface SystemTopologyResponse {
  system: {
    name: string;
    environment: string;
    version: string;
    description: string;
  };
  services: Service[];
  dependencies: Dependency[];
  features: Feature[];
  failureTypes: FailureType[];
  mitigations: Mitigation[];
}
