import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertTriangle, AlertCircle, ArrowDown } from 'lucide-react';
import { TimelineEvent, ServiceState } from '../../types';

interface IncidentTimelineProps {
  timeline: TimelineEvent[];
  title?: string;
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({
  timeline,
  title = 'DETERMINISTIC PROPAGATION TIMELINE'
}) => {
  if (!timeline || timeline.length === 0) {
    return null;
  }

  const renderStateIcon = (state: ServiceState) => {
    switch (state) {
      case 'FAILED':
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'AFFECTED':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case 'DEGRADED':
        return <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getStateBadge = (state: ServiceState) => {
    switch (state) {
      case 'FAILED':
        return 'border-rose-500/30 bg-rose-500/15 text-rose-300';
      case 'AFFECTED':
        return 'border-amber-500/30 bg-amber-500/15 text-amber-300';
      case 'DEGRADED':
        return 'border-yellow-500/30 bg-yellow-500/15 text-yellow-300';
      default:
        return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300';
    }
  };

  return (
    <div className="rounded-sm border border-sim-border bg-sim-panel p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-sim-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            {title}
          </h2>
        </div>
        <span className="text-[10px] font-mono text-sim-dim">
          {timeline.length} SEQUENTIAL EVENTS
        </span>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sim-border">
        {timeline.map((evt, idx) => (
          <div key={idx} className="relative group">
            {/* Step circle marker */}
            <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full border border-sim-border bg-sim-panel flex items-center justify-center text-[10px] font-mono font-bold text-sim-muted group-hover:border-blue-400 transition-colors">
              {evt.step}
            </div>

            {/* Event Content Card */}
            <div className="p-3 rounded-sm border border-sim-border bg-sim-card hover:border-sim-borderLight transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-white">
                    {evt.component}
                  </span>
                  <span className="text-xs text-sim-muted font-mono font-medium">
                    &bull; {evt.event}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px]">
                  <span className="text-sim-dim">
                    T+{evt.timestamp_offset}ms
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded border uppercase font-bold ${getStateBadge(
                      evt.state
                    )}`}
                  >
                    {renderStateIcon(evt.state)}
                    <span>{evt.state}</span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-sim-muted leading-relaxed font-sans">
                {evt.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
