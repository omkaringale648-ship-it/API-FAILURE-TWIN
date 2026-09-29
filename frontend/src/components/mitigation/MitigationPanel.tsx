import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  Wrench,
  ArrowRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Mitigation, MitigationResult } from '../../types';

interface MitigationPanelProps {
  mitigations: Mitigation[];
  simulationId: string | null;
  onApplyMitigation: (mitigationId: string) => void;
  isLoading: boolean;
  activeMitigationResult: MitigationResult | null;
}

export const MitigationPanel: React.FC<MitigationPanelProps> = ({
  mitigations,
  simulationId,
  onApplyMitigation,
  isLoading,
  activeMitigationResult
}) => {
  const [selectedMitigationId, setSelectedMitigationId] = useState<string>(
    mitigations[0]?.id || ''
  );

  // Sync default selection if mitigations change
  React.useEffect(() => {
    if (mitigations.length > 0 && !selectedMitigationId) {
      setSelectedMitigationId(mitigations[0].id);
    }
  }, [mitigations, selectedMitigationId]);

  if (!simulationId || mitigations.length === 0) {
    return null;
  }

  const selectedMitigation =
    mitigations.find((m) => m.id === selectedMitigationId) || mitigations[0];

  return (
    <div className="rounded-sm border border-sim-border bg-sim-panel p-5 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-sim-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            SIMULATION MITIGATION ENGINE
          </h2>
        </div>
        <span className="text-[10px] font-mono text-emerald-400">
          RECOMMENDED STRATEGIES
        </span>
      </div>

      {/* Mitigation Selection Cards */}
      <div className="space-y-2">
        {mitigations.map((mit) => {
          const isSelected = selectedMitigation?.id === mit.id;
          const isApplied = activeMitigationResult?.mitigation_id === mit.id;

          return (
            <div
              key={mit.id}
              onClick={() => setSelectedMitigationId(mit.id)}
              className={`p-3 rounded-sm border cursor-pointer transition-all ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/20 shadow-sm'
                  : 'border-sim-border bg-sim-card hover:border-sim-borderLight'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-white">{mit.name}</span>
                  {isApplied && (
                    <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/20 border border-emerald-500/40 px-1.5 py-0.2 rounded uppercase">
                      ACTIVE APPLIED
                    </span>
                  )}
                </div>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-sim-panel text-sim-dim border border-sim-border">
                  Effect: {mit.effectiveness}
                </span>
              </div>

              <p className="text-xs text-sim-muted leading-relaxed font-sans mb-2">
                {mit.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-sim-dim pt-1 border-t border-sim-border/60">
                <span className="text-emerald-400">
                  Recovers: {mit.recoversFeatures.length} features
                </span>
                <span>&bull;</span>
                <span className="text-sim-muted">
                  Strategy: {mit.strategy}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => onApplyMitigation(selectedMitigationId || mitigations[0].id)}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-sm bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              <span>Applying Resiliency Strategy...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>APPLY MITIGATION STRATEGY</span>
            </>
          )}
        </button>
      </div>

      {/* Active Mitigation Result Note */}
      {activeMitigationResult && (
        <div className="p-3 rounded-sm border border-emerald-500/30 bg-emerald-950/20">
          <div className="flex items-center justify-between mb-1.5 text-xs font-mono">
            <span className="text-emerald-400 font-bold uppercase">
              Mitigation Evaluated
            </span>
            <span className="text-sim-text">
              Risk: <span className="line-through text-rose-400">{activeMitigationResult.before_risk_level}</span> &rarr;{' '}
              <span className="text-emerald-400 font-bold">{activeMitigationResult.after_risk_level}</span>
            </span>
          </div>
          <p className="text-xs text-sim-text leading-relaxed">
            {activeMitigationResult.explanation}
          </p>
        </div>
      )}
    </div>
  );
};
