from typing import Literal
from pydantic import BaseModel, Field

class FailureRequest(BaseModel):
    target_service: str = Field(..., description="ID of the target service to inject failure into")
    failure_type: Literal["HTTP 500", "HTTP 429", "TIMEOUT", "HIGH LATENCY", "SCHEMA MISMATCH"] = Field(
        ..., description="Deterministic failure injection type"
    )
    duration: int = Field(default=10, ge=5, le=60, description="Simulation duration metadata in seconds (5, 10, 30, 60)")
    severity: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"] = Field(
        default="HIGH", description="Simulation severity level"
    )

class MitigationRequest(BaseModel):
    simulation_id: str = Field(..., description="Simulation ID from prior simulation execution")
    mitigation_id: str = Field(..., description="Mitigation ID to apply to the simulated failure")
