from fastapi import APIRouter, Depends
from backend.app.models.responses import SystemTopologyResponse

router = APIRouter()

def get_engine():
    from backend.app.main import simulation_engine
    return simulation_engine

@router.get("/system", response_model=SystemTopologyResponse)
def get_system_topology(engine = Depends(get_engine)):
    """Returns canonical synthetic system topology configuration."""
    raw = engine.get_system_topology()
    return SystemTopologyResponse(**raw)
