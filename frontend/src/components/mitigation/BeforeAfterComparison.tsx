import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Layers, RefreshCw } from 'lucide-react';
import { MitigationResult, StateDiffItem, ServiceState } from '../../types';

interface BeforeAfterComparisonProps {
  mitigationResult: MitigationResult | null;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  mitigationResult
}) => {
  if (!mitigationResult) {
    return null;
  }

  const { diff, mitigation_name, before_risk_level, after_risk_level, recovered_features } =
    mitigationResult;

  const renderStateBadge = (state: ServiceState) => {
    switch (state) {
      case 'FAILED':
        return (
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
            FAILED
          </span>
        );
      case 'AFFECTED':
        return (
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
            AFFECTED
          </span>
        );
      case 'DEGRADED':
        return (
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 uppercase">
            DEGRADED
          </span>
        );
      default:
        return (
          <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
            HEALTHY
          </span>
        );
    }
  };

  const renderStatusBadge = (status: StateDiffItem['status']) => {
    switch (status) {
      case 'recovered':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
            <CheckCircle2 className="w-3 h-3" />
            RECOVERED
          </span>
        );
      case 'degraded':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 uppercase">
            <AlertTriangle className="w-3 h-3" />
            RESILIENT DEGRADED
          </span>
        );
      case 'persisted_failure':
        return (
          <span className="inline-flex items-center gap-1 font-mono text-[9px] font-bold px-2 py-0.5 rounded bg-sim-panel text-sim-dim border border-sim-border uppercase">
            SOURCE FAULT (ISOLATED)
          </span>
        );
      default:
        return (
          <span className="font-mono text-[9px] text-sim-dim uppercase">
            UNAFFECTED
          </span>
        );
    }
  };

  // Group diff into Services and Features
  const serviceDiffs = diff.filter((d) => d.type === 'service');
  const featureDiffs = diff.filter((d) => d.type === 'feature');

  return (
    <div className="rounded-sm border border-sim-border bg-sim-panel p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-sim-border gap-2">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <RefreshCw className="w-3.5 h-3.5" />
          </div>
          <div>
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              BEFORE & AFTER MITIGATION COMPARISON
            </h2>
            <span className="text-[10px] font-mono text-sim-dim">
              Strategy: {mitigation_name}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <div className="px-2 py-0.5 rounded-sm border border-rose-500/30 bg-rose-950/20 text-rose-300">
            Before: {before_risk_level}
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-sim-dim" />
          <div className="px-2 py-0.5 rounded-sm border border-emerald-500/30 bg-emerald-950/20 text-emerald-300 font-bold">
            After: {after_risk_level}
          </div>
        </div>
      </div>

      {/* User-facing Features Diff Table */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-2 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          User-Facing Features Resiliency Diff ({recovered_features.length} Recovered)
        </h3>
        <div className="overflow-x-auto rounded-sm border border-sim-border bg-sim-card">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sim-panel border-b border-sim-border text-[10px] font-mono uppercase text-sim-dim">
              <tr>
                <th className="py-2 px-3">Feature Name</th>
                <th className="py-2 px-3 text-center">Before State</th>
                <th className="py-2 px-3 text-center">After State</th>
                <th className="py-2 px-3">Status Diff</th>
                <th className="py-2 px-3">Simulation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sim-border">
              {featureDiffs.map((item) => (
                <tr key={item.id} className="hover:bg-sim-cardHover/50 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {renderStateBadge(item.before_state)}
                  </td>
                  <td className="py-2.5 px-3 text-center whitespace-nowrap">
                    {renderStateBadge(item.after_state)}
                  </td>
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className="py-2.5 px-3 text-[11px] text-sim-muted font-sans">
                    {item.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Services Diff Table */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-2">
          Internal Services State Transition
        </h3>
        <div className="overflow-x-auto rounded-sm border border-sim-border bg-sim-card">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-sim-panel border-b border-sim-border text-[10px] font-mono uppercase text-sim-dim">
              <tr>
                <th className="py-2 px-3">Service Name</th>
                <th className="py-2 px-3 text-center">Before State</th>
                <th className="py-2 px-3 text-center">After State</th>
                <th className="py-2 px-3">Status Diff</th>
                <th className="py-2 px-3">Simulation Rationale</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sim-border">
              {serviceDiffs.map((item) => (
                <tr key={item.id} className="hover:bg-sim-cardHover/50 transition-colors">
                  <td className="py-2 px-3 font-medium text-white whitespace-nowrap">
                    {item.name}
                  </td>
                  <td className="py-2 px-3 text-center whitespace-nowrap">
                    {renderStateBadge(item.before_state)}
                  </td>
                  <td className="py-2 px-3 text-center whitespace-nowrap">
                    {renderStateBadge(item.after_state)}
                  </td>
                  <td className="py-2 px-3 whitespace-nowrap">
                    {renderStatusBadge(item.status)}
                  </td>
                  <td className="py-2 px-3 text-[11px] text-sim-muted font-sans">
                    {item.note}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
