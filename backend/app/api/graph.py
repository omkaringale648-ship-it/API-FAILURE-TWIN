from typing import Optional
from fastapi import APIRouter, Depends, Query
from backend.app.models.responses import GraphResponse

router = APIRouter()

def get_engine():
    from backend.app.main import simulation_engine
    return simulation_engine

@router.get("/graph", response_model=GraphResponse)
def get_graph_state(
    simulation_id: Optional[str] = Query(default=None),
    engine = Depends(get_engine)
):
    """Returns nodes, edges, features, and active health states for graph visualization."""
    return engine.get_graph_state(simulation_id=simulation_id)
