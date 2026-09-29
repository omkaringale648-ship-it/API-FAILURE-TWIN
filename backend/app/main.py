from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.config import APP_ENV, CORS_ORIGINS
from backend.app.engine.simulation_engine import SimulationEngine
from backend.app.api import system, graph, simulate, mitigation, scenarios

app = FastAPI(
    title="API Failure Twin - Simulation Engine",
    description="Deterministic dependency graph failure simulation and mitigation engine.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Initialize single global simulation engine instance
simulation_engine = SimulationEngine()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(system.router, prefix="/api", tags=["System Topology"])
app.include_router(graph.router, prefix="/api", tags=["Dependency Graph"])
app.include_router(simulate.router, prefix="/api", tags=["Failure Simulation"])
app.include_router(mitigation.router, prefix="/api", tags=["Mitigation Engine"])
app.include_router(scenarios.router, prefix="/api", tags=["Demo Scenarios"])

@app.get("/api/health")
def health_check():
    """Health status endpoint."""
    return {
        "status": "ok",
        "environment": APP_ENV,
        "engine": "deterministic-networkx",
        "system_status": "Healthy" if not simulation_engine.latest_simulation_id else "Simulating"
    }

@app.get("/")
def root():
    return {
        "product": "API Failure Twin",
        "tagline": "Simulate API failures before they become incidents.",
        "environment": APP_ENV,
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    from backend.app.config import API_HOST, API_PORT
    uvicorn.run("backend.app.main:app", host=API_HOST, port=API_PORT, reload=True)
