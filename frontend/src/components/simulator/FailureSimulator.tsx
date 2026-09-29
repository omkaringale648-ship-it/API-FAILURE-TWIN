import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  AlertOctagon,
  Clock,
  Gauge,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Service, FailureTypeId, SeverityLevel } from '../../types';

interface FailureSimulatorProps {
  services: Service[];
  selectedServiceId: string;
  onSelectService: (serviceId: string) => void;
  onSimulate: (payload: {
    target_service: string;
    failure_type: FailureTypeId;
    duration: number;
    severity: SeverityLevel;
  }) => void;
  onReset: () => void;
  onRunPrimaryDemo: () => void;
  isLoading: boolean;
  hasActiveSimulation: boolean;
}

const FAILURE_TYPES: { id: FailureTypeId; label: string; desc: string }[] = [
  { id: 'HTTP 500', label: 'HTTP 500 Internal Error', desc: 'Upstream server crash / 500 response' },
  { id: 'HTTP 429', label: 'HTTP 429 Too Many Requests', desc: 'Rate quota breach and client rejection' },
  { id: 'TIMEOUT', label: 'TIMEOUT (Socket Deadline)', desc: 'Upstream gateway deadline exceeded (>30s)' },
  { id: 'HIGH LATENCY', label: 'HIGH LATENCY (>5000ms)', desc: 'Severe connection pool queue saturation' },
  { id: 'SCHEMA MISMATCH', label: 'SCHEMA MISMATCH', desc: 'Breaking contract drift / missing keys' },
];

const DURATIONS = [5, 10, 30, 60];
const SEVERITIES: SeverityLevel[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

export const FailureSimulator: React.FC<FailureSimulatorProps> = ({
  services,
  selectedServiceId,
  onSelectService,
  onSimulate,
  onReset,
  onRunPrimaryDemo,
  isLoading,
  hasActiveSimulation
}) => {
  const [failureType, setFailureType] = useState<FailureTypeId>('HTTP 500');
  const [duration, setDuration] = useState<number>(10);
  const [severity, setSeverity] = useState<SeverityLevel>('HIGH');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedServiceId) return;
    onSimulate({
      target_service: selectedServiceId,
      failure_type: failureType,
      duration,
      severity
    });
  };

  return (
    <div className="rounded-sm border border-sim-border bg-sim-panel p-5">
      <div className="flex items-center justify-between pb-4 border-b border-sim-border mb-5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-sm bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <AlertOctagon className="w-3.5 h-3.5" />
          </div>
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
            FAILURE SIMULATOR
          </h2>
        </div>
        <span className="text-[10px] font-mono text-sim-dim">
          DETERMINISTIC FAULT INJECTION
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Service Selector */}
        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Target API / Service
            </span>
            <span className="text-[10px] text-sim-dim font-normal">Click node or select</span>
          </label>
          <div className="relative">
            <select
              value={selectedServiceId}
              onChange={(e) => onSelectService(e.target.value)}
              className="w-full appearance-none rounded-sm border border-sim-border bg-sim-card px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
            >
              {services.map((svc) => (
                <option key={svc.id} value={svc.id} className="bg-sim-panel">
                  {svc.name} ({svc.type} &bull; Tier {svc.tier ?? 0})
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-sim-dim pointer-events-none" />
          </div>

          {/* Quick preset targets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {[
              { id: 'payment-api', label: 'Payment API (Acquirer)' },
              { id: 'maps-api', label: 'Maps API' },
              { id: 'database', label: 'Database' },
              { id: 'auth-service', label: 'Auth Service' }
            ].map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectService(preset.id)}
                className={`text-[10px] font-mono px-2 py-1 rounded-sm border transition-colors ${
                  selectedServiceId === preset.id
                    ? 'border-blue-500 bg-blue-500/15 text-blue-300'
                    : 'border-sim-border bg-sim-card text-sim-muted hover:border-sim-borderLight'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Failure Type */}
        <div>
          <label className="block text-xs font-mono font-semibold uppercase tracking-wider text-sim-muted mb-1.5 flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-400" />
            Failure Type
          </label>
          <div className="relative">
            <select
              value={failureType}
              onChange={(e) => setFailureType(e.target.value as FailureTypeId)}
              className="w-full appearance-none rounded-sm border border-sim-border bg-sim-card px-3 py-2.5 text-xs text-white focus:border-blue-500 focus:outline-none font-mono"
            >
              {FAILURE_TYPES.map((ft) => (
                <option key={ft.id} value={ft.id} className="bg-sim-panel">
                  {ft.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 w-3.5 h-3.5 text-sim-dim pointer-events-none" />
          </div>
        </div>

        {/* Duration & Severity row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Duration */}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-sim-muted mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-sim-dim" />
              Duration
            </label>
            <div className="grid grid-cols-4 gap-1">
              {DURATIONS.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={`text-[11px] font-mono py-1.5 rounded-sm border text-center transition-colors ${
                    duration === dur
                      ? 'border-blue-500 bg-blue-500/15 text-blue-300 font-bold'
                      : 'border-sim-border bg-sim-card text-sim-muted hover:border-sim-borderLight'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-[11px] font-mono font-semibold uppercase tracking-wider text-sim-muted mb-1.5 flex items-center gap-1">
              <Gauge className="w-3 h-3 text-sim-dim" />
              Severity
            </label>
            <div className="grid grid-cols-2 gap-1">
              {SEVERITIES.map((sev) => {
                const isSelected = severity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`text-[10px] font-mono py-1 rounded-sm border text-center uppercase tracking-wider transition-colors ${
                      isSelected
                        ? sev === 'CRITICAL'
                          ? 'border-rose-500 bg-rose-500/20 text-rose-300 font-bold'
                          : sev === 'HIGH'
                          ? 'border-amber-500 bg-amber-500/20 text-amber-300 font-bold'
                          : 'border-blue-500 bg-blue-500/20 text-blue-300 font-bold'
                        : 'border-sim-border bg-sim-card text-sim-muted hover:border-sim-borderLight'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-2 space-y-2">
          <button
            type="submit"
            disabled={isLoading || !selectedServiceId}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-sm bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Simulating Graph Propagation...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>SIMULATE FAILURE</span>
              </>
            )}
          </button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={onRunPrimaryDemo}
              disabled={isLoading}
              title="Quickly run Payment API HTTP 500 primary hackathon demo"
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-sm border border-sim-border hover:border-blue-500/50 bg-sim-card hover:bg-sim-cardHover text-[11px] font-mono text-blue-400 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-blue-400" />
              <span>Primary Demo</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              disabled={isLoading || !hasActiveSimulation}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-sm border border-sim-border hover:border-sim-borderLight bg-sim-card hover:bg-sim-cardHover text-[11px] font-mono text-sim-muted transition-colors disabled:opacity-40"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
