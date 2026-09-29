import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, CheckCircle2, AlertOctagon } from 'lucide-react';
import { EnvironmentBadge } from '../components/layout/EnvironmentBadge';

export const SecurityPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left pb-6 border-b border-sim-border">
        <div className="flex items-center gap-2">
          <EnvironmentBadge />
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
            Zero-Production Footprint
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Security & Simulation Architecture
        </h1>
        <p className="text-xs sm:text-sm text-sim-muted max-w-2xl leading-relaxed">
          API Failure Twin is architected from the ground up as a safe, isolated simulation environment. It does not touch production systems, customer databases, or live third-party APIs.
        </p>
      </div>

      {/* Absolute Safety Guarantees */}
      <div className="p-6 rounded-sm border border-emerald-500/30 bg-emerald-950/15 space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm font-bold uppercase tracking-wider">
          <ShieldCheck className="w-5 h-5" />
          <span>Core Safety Guarantees</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
          <div className="p-3.5 rounded-sm bg-sim-card border border-sim-border space-y-1">
            <span className="font-mono font-bold text-white block">No Live API Calls</span>
            <p className="text-sim-muted leading-relaxed">
              The platform executes zero outbound HTTP/gRPC requests to live external providers. All network calls are modeled inside the in-memory NetworkX directed graph.
            </p>
          </div>

          <div className="p-3.5 rounded-sm bg-sim-card border border-sim-border space-y-1">
            <span className="font-mono font-bold text-white block">No Customer or Production Data</span>
            <p className="text-sim-muted leading-relaxed">
              No real credentials, API tokens, user PII, or financial records are stored or processed. The system uses 100% synthetic topology data.
            </p>
          </div>

          <div className="p-3.5 rounded-sm bg-sim-card border border-sim-border space-y-1">
            <span className="font-mono font-bold text-white block">Zero Destructive Testing</span>
            <p className="text-sim-muted leading-relaxed">
              Unlike live chaos engineering frameworks that kill real containers or introduce real packet loss, API Failure Twin is purely mathematical and deterministic.
            </p>
          </div>

          <div className="p-3.5 rounded-sm bg-sim-card border border-sim-border space-y-1">
            <span className="font-mono font-bold text-white block">Offline Capable</span>
            <p className="text-sim-muted leading-relaxed">
              The entire core simulation runs entirely locally on your machine without requiring internet access or third-party AI APIs.
            </p>
          </div>
        </div>
      </div>

      {/* Strict Engineering Boundaries */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-mono text-sm font-bold uppercase tracking-wider">
          <Lock className="w-5 h-5" />
          <span>Engineering Integrity & Boundaries</span>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          In adherence to rigorous hackathon engineering standards, API Failure Twin strictly abides by the following rules:
        </p>
        <ul className="space-y-2 text-xs text-sim-text font-mono">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Never claims to predict real-world production incidents or guaranteed customer impact.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Never presents synthetic simulation values as real production statistics.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>Does not invent fake uptime percentages, fake revenue loss, or fake customer logos.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>All calculations are deterministic, reproducible, and explainable directly from the configured graph topology.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
