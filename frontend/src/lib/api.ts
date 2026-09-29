import {
  SystemTopologyResponse,
  GraphResponse,
  SimulationResult,
  MitigationResult,
  Scenario
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let errorMsg = `API request failed with status ${res.status}`;
    try {
      const errorData = await res.json();
      if (errorData.detail) {
        errorMsg = typeof errorData.detail === 'string' ? errorData.detail : JSON.stringify(errorData.detail);
      }
    } catch {
      // Use fallback errorMsg
    }
    throw new Error(errorMsg);
  }
  return res.json() as Promise<T>;
}

export async function fetchSystem(): Promise<SystemTopologyResponse> {
  const res = await fetch(`${API_BASE}/system`);
  return handleResponse<SystemTopologyResponse>(res);
}

export async function fetchGraph(simulationId?: string): Promise<GraphResponse> {
  const url = simulationId
    ? `${API_BASE}/graph?simulation_id=${encodeURIComponent(simulationId)}`
    : `${API_BASE}/graph`;
  const res = await fetch(url);
  return handleResponse<GraphResponse>(res);
}

export async function simulateFailure(payload: {
  target_service: string;
  failure_type: string;
  duration?: number;
  severity?: string;
}): Promise<{ success: boolean; simulation: SimulationResult }> {
  const res = await fetch(`${API_BASE}/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      target_service: payload.target_service,
      failure_type: payload.failure_type,
      duration: payload.duration ?? 10,
      severity: payload.severity ?? 'HIGH'
    })
  });
  return handleResponse<{ success: boolean; simulation: SimulationResult }>(res);
}

export async function applyMitigation(
  simulationId: string,
  mitigationId: string
): Promise<MitigationResult> {
  const res = await fetch(`${API_BASE}/mitigate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      simulation_id: simulationId,
      mitigation_id: mitigationId
    })
  });
  return handleResponse<MitigationResult>(res);
}

export async function resetSimulation(): Promise<{ success: boolean; message: string; state: any }> {
  const res = await fetch(`${API_BASE}/reset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse<{ success: boolean; message: string; state: any }>(res);
}

export async function fetchScenarios(): Promise<Scenario[]> {
  const res = await fetch(`${API_BASE}/scenarios`);
  return handleResponse<Scenario[]>(res);
}

export async function runScenario(scenarioId: string): Promise<{ success: boolean; scenario: Scenario; simulation: SimulationResult }> {
  const res = await fetch(`${API_BASE}/scenarios/${encodeURIComponent(scenarioId)}/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  return handleResponse<{ success: boolean; scenario: Scenario; simulation: SimulationResult }>(res);
}

export async function fetchHealth(): Promise<{ status: string; environment: string; system_status: string }> {
  const res = await fetch(`${API_BASE}/health`);
  return handleResponse<{ status: string; environment: string; system_status: string }>(res);
}
