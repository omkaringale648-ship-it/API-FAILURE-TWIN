from typing import List, Dict
from backend.app.models.responses import TimelineEvent, ServiceState

class TimelineEngine:
    @staticmethod
    def generate_failure_timeline(
        target_service: str,
        failure_type: str,
        affected_services: List[str],
        affected_features: List[str],
        service_states: Dict[str, ServiceState],
        ge: any
    ) -> List[TimelineEvent]:
        timeline: List[TimelineEvent] = []
        step = 1

        target_info = ge.get_service_by_id(target_service)
        target_name = target_info["name"] if target_info else target_service

        # Event 1: Injection
        timeline.append(TimelineEvent(
            timestamp_offset=0,
            step=step,
            component=target_name,
            event=f"Simulated {failure_type} Fault Injected",
            state=service_states.get(target_service, "FAILED"),
            detail=f"Deterministic failure injection of {failure_type} triggered on {target_name}."
        ))
        step += 1

        # Event 2..N: Propagation through affected services
        time_offsets = [150, 420, 780, 1100, 1450, 1800]
        for idx, svc_id in enumerate(affected_services):
            svc_info = ge.get_service_by_id(svc_id)
            svc_name = svc_info["name"] if svc_info else svc_id
            st = service_states.get(svc_id, "AFFECTED")
            offset = time_offsets[min(idx, len(time_offsets) - 1)]

            timeline.append(TimelineEvent(
                timestamp_offset=offset,
                step=step,
                component=svc_name,
                event=f"Dependency Upstream Fault Propagated ({st})",
                state=st,
                detail=f"{svc_name} entered {st} state due to upstream dependency link with {target_name}."
            ))
            step += 1

        # Final Event: User-facing feature degradation
        if affected_features:
            feat_names = [f.replace("-", " ").title() for f in affected_features]
            timeline.append(TimelineEvent(
                timestamp_offset=1850,
                step=step,
                component="User-Facing Features",
                event="Feature Degradation Flagged",
                state="DEGRADED",
                detail=f"Downstream degradation observed across {', '.join(feat_names[:3])}."
            ))

        return timeline

    @staticmethod
    def generate_mitigation_timeline(
        mitigation_name: str,
        recovered_services: List[str],
        recovered_features: List[str],
        remaining_affected: List[str]
    ) -> List[TimelineEvent]:
        timeline: List[TimelineEvent] = []
        step = 1

        timeline.append(TimelineEvent(
            timestamp_offset=0,
            step=step,
            component="Mitigation Engine",
            event="Mitigation Strategy Deployed",
            state="AFFECTED",
            detail=f"Applied mitigation strategy: '{mitigation_name}' to simulated dependency graph."
        ))
        step += 1

        if recovered_services:
            timeline.append(TimelineEvent(
                timestamp_offset=250,
                step=step,
                component="Internal Services",
                event="Service Recovery Transition",
                state="HEALTHY",
                detail=f"Services restored to resilient operational state: {', '.join(recovered_services)}."
            ))
            step += 1

        if recovered_features:
            timeline.append(TimelineEvent(
                timestamp_offset=600,
                step=step,
                component="User-Facing Features",
                event="Feature Health Restored",
                state="HEALTHY",
                detail=f"Recovered user capabilities: {', '.join(recovered_features)}."
            ))
            step += 1

        if remaining_affected:
            timeline.append(TimelineEvent(
                timestamp_offset=900,
                step=step,
                component="Degraded Boundary",
                event="Isolated Degraded Mode Maintained",
                state="DEGRADED",
                detail=f"Contained degradation remains safely isolated on: {', '.join(remaining_affected)}."
            ))

        return timeline
