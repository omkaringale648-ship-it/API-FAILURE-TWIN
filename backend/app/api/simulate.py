from fastapi import APIRouter, Depends, HTTPException
from backend.app.models.requests import FailureRequest
from backend.app.models.responses import SimulationResult

router = APIRouter()

def get_engine():
    from backend.app.main import simulation_engine
    return simulation_engine

@router.post("/simulate")
def simulate_failure(request: FailureRequest, engine = Depends(get_engine)):
    """Runs deterministic dependency graph failure simulation."""
    # Verify service exists
    svc = engine.ge.get_service_by_id(request.target_service)
    if not svc:
        raise HTTPException(
            status_code=404,
            detail=f"Target service '{request.target_service}' not found in system topology."
        )

    result = engine.simulate_failure(request)
    return {
        "success": True,
        "simulation": result
    }

@router.post("/reset")
def reset_simulation(engine = Depends(get_engine)):
    """Resets simulation environment and returns healthy baseline state."""
    reset_data = engine.reset_simulation()
    return {
        "success": True,
        "message": "Simulation reset successfully to healthy baseline.",
        "state": reset_data
    }
