import React from 'react';
import {
  AlertTriangle,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { SimulationResult, Service, Feature, RiskLevel } from '../../types';

interface ImpactPanelProps {
  simulation: SimulationResult | null;
  services: Service[];
  features: Feature[];
}

export const ImpactPanel: React.FC<ImpactPanelProps> = ({
  simulation,
  services,
  features
}) => {
  if (!simulation) {
    return (
      <div className="rounded-sm border border-sim-border bg-sim-panel p-5 text-center">
        <div className="w-10 h-10 rounded-sm bg-sim-card border border-sim-border flex items-center justify-center mx-auto text-sim-dim mb-3">
          <Layers className="w-5 h-5" />
        </div>
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-sim-muted mb-1">
          AWAITING SIMULATION
        </h3>
        <p className="text-xs text-sim-dim max-w-sm mx-auto leading-relaxed">
          Select a service and failure type on the simulator panel, or run the primary demo to observe deterministic dependency propagation.
        </p>
      </div>
    );
  }

  const {
    failed_service,
    failure_type,
    affected_services,
    affected_features,
    dependency_depth,
    risk_level,
    explanation,
    service_states,
    feature_states,
    impact
  } = simulation;

  const targetServiceObj = services.find((s) => s.id === failed_service);
  const targetName = targetServiceObj?.name || failed_service;

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'CRITICAL':
        return 'border-rose-500/50 bg-rose-500/15 text-rose-300';
      case 'HIGH':
        return 'border-amber-500/50 bg-amber-500/15 text-amber-300';
      case 'MEDIUM':
        return 'border-yellow-500/50 bg-yellow-500/15 text-yellow-300';
      default:
        return 'border-emerald-500/50 bg-emerald-500/15 text-emerald-300';
    }
  };

  return (
    <div className="rounded-sm border border-sim-border bg-sim-panel p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-sim-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            IMPACT & BLAST RADIUS
          </h2>
        </div>
        <div
          className={`px-2.5 py-0.5 rounded-sm font-mono text-xs font-bold border uppercase tracking-wider ${getRiskBadge(
            risk_level
          )}`}
        >
          RISK: {risk_level}
        </div>
      </div>

      {/* Target Component Callout */}
      <div className="p-3 rounded-sm border border-rose-500/30 bg-rose-950/20 flex items-start justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono text-rose-400 uppercase tracking-wider block font-semibold">
            Injected Target Component
          </span>
          <span className="font-bold text-sm text-white block mt-0.5">
            {targetName}
          </span>
          <span className="text-xs font-mono text-sim-muted mt-1 block">
            Fault: <span className="text-rose-300 font-semibold">{failure_type}</span> ({targetServiceObj?.type})
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-sm text-[10px] font-mono font-bold bg-rose-500 text-white uppercase">
          FAILED
        </span>
      </div>

      {/* Numerical Metrics Bar (Deterministic calculations only) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-2.5 rounded-sm border border-sim-border bg-sim-card">
          <span className="text-[10px] font-mono text-sim-dim uppercase block">Affected Services</span>
          <span className="font-mono text-base font-bold text-white mt-0.5 block">
            {affected_services.length}
          </span>
        </div>
        <div className="p-2.5 rounded-sm border border-sim-border bg-sim-card">
          <span className="text-[10px] font-mono text-sim-dim uppercase block">Affected Features</span>
          <span className="font-mono text-base font-bold text-white mt-0.5 block">
            {affected_features.length}
          </span>
        </div>
        <div className="p-2.5 rounded-sm border border-sim-border bg-sim-card">
          <span className="text-[10px] font-mono text-sim-dim uppercase block">Dependency Depth</span>
          <span className="font-mono text-base font-bold text-white mt-0.5 block">
            {dependency_depth} Tiers
          </span>
        </div>
      </div>

      {/* Explainable Reasoning */}
      <div className="p-3.5 rounded-sm border border-blue-500/25 bg-blue-950/15">
        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-400 uppercase tracking-wider mb-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Explainable Graph Root Cause</span>
        </div>
        <p className="text-xs text-sim-text leading-relaxed font-sans">
          {explanation}
        </p>
      </div>

      {/* Affected Services List */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-amber-400" />
            Affected Services in Blast Radius
          </span>
          <span className="text-[10px] font-mono text-sim-dim">{affected_services.length} Total</span>
        </h3>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {affected_services.map((svcId) => {
            const svc = services.find((s) => s.id === svcId);
            const state = service_states[svcId] || 'AFFECTED';
            return (
              <div
                key={svcId}
                className="flex items-center justify-between px-3 py-2 rounded-sm border border-sim-border bg-sim-card text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sim-dim text-[10px]">T{svc?.tier ?? 0}</span>
                  <span className="font-medium text-white">{svc?.name || svcId}</span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                    state === 'FAILED'
                      ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                      : state === 'DEGRADED'
                      ? 'border-yellow-500/40 bg-yellow-500/20 text-yellow-300'
                      : 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {state}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Affected Features List */}
      <div>
        <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            Degraded User-Facing Features
          </span>
          <span className="text-[10px] font-mono text-sim-dim">{affected_features.length} Degraded</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {affected_features.map((featId) => {
            const feat = features.find((f) => f.id === featId);
            return (
              <div
                key={featId}
                className="p-2.5 rounded-sm border border-amber-500/30 bg-amber-950/20 text-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-white">{feat?.name || featId}</span>
                  <span className="text-[9px] font-mono font-bold text-amber-300 bg-amber-500/20 px-1 py-0.2 rounded border border-amber-500/30">
                    DEGRADED
                  </span>
                </div>
                <div className="text-[10px] text-sim-dim truncate">
                  Depends on: {feat?.dependsOn.join(', ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Unaffected Summary (Proving containment) */}
      <div className="pt-2 border-t border-sim-border flex items-center justify-between text-[11px] font-mono text-sim-dim">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Contained Boundary:</span>
        </span>
        <span className="text-emerald-400">
          {impact.unaffected_services.length} services & {impact.unaffected_features.length} features unaffected
        </span>
      </div>
    </div>
  );
};
