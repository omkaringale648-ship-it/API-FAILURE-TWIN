import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from backend.app.config import SCENARIOS_FILE
from backend.app.models.responses import Scenario
from backend.app.models.requests import FailureRequest

router = APIRouter()

def get_engine():
    from backend.app.main import simulation_engine
    return simulation_engine

def load_scenarios() -> List[dict]:
    with open(SCENARIOS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("/scenarios", response_model=List[Scenario])
def list_scenarios():
    """Returns curated demo scenarios for testing deterministic failure propagation."""
    scenarios = load_scenarios()
    return scenarios

@router.post("/scenarios/{scenario_id}/run")
def run_scenario(scenario_id: str, engine = Depends(get_engine)):
    """Executes a predefined scenario directly."""
    scenarios = load_scenarios()
    matched = next((s for s in scenarios if s["id"] == scenario_id), None)
    if not matched:
        raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found.")

    req = FailureRequest(
        target_service=matched["targetService"],
        failure_type=matched["failureType"],
        duration=matched.get("duration", 10),
        severity=matched.get("severity", "HIGH")
    )
    result = engine.simulate_failure(req)
    return {
        "success": True,
        "scenario": matched,
        "simulation": result
    }
