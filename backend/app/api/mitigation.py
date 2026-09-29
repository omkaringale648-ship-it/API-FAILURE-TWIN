from fastapi import APIRouter, Depends, HTTPException
from backend.app.models.requests import MitigationRequest
from backend.app.models.responses import MitigationResult

router = APIRouter()

def get_engine():
    from backend.app.main import simulation_engine
    return simulation_engine

@router.post("/mitigate", response_model=MitigationResult)
def apply_mitigation(request: MitigationRequest, engine = Depends(get_engine)):
    """Applies mitigation strategy to active simulation and returns simulated after state."""
    try:
        result = engine.apply_mitigation(request)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply mitigation: {str(e)}")
