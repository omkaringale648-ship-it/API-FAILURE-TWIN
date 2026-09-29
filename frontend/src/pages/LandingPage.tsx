import React from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Network,
  AlertOctagon,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  GitBranch,
  Layers,
  Wrench,
  Clock,
  Sparkles
} from 'lucide-react';
import { EnvironmentBadge } from '../components/layout/EnvironmentBadge';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-16 py-10">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="flex items-center justify-center gap-2">
          <EnvironmentBadge />
          <span className="text-xs font-mono px-2 py-0.5 rounded-sm border border-sim-border bg-sim-panel text-sim-dim uppercase">
            Deterministic Engine
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white font-sans leading-tight">
          Simulate API failures <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-amber-400">
            before they become incidents.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-sim-muted max-w-2xl mx-auto leading-relaxed">
          API Failure Twin models software dependencies, calculates cascading blast radius, and verifies
          mitigation strategies in a safe, synthetic simulation environment.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/simulator"
            className="flex items-center gap-2 px-5 py-3 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-blue-900/30"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Failure Simulator</span>
          </Link>

          <Link
            to="/graph"
            className="flex items-center gap-2 px-5 py-3 rounded-sm border border-sim-border hover:border-sim-borderLight bg-sim-panel hover:bg-sim-card text-sim-text font-mono font-medium text-xs uppercase tracking-wider transition-colors"
          >
            <Network className="w-4 h-4 text-sim-dim" />
            <span>Explore Topology Graph</span>
          </Link>
        </div>

        {/* Core Value Chain Diagram */}
        <div className="pt-8">
          <div className="p-4 rounded-sm border border-sim-border bg-sim-panel max-w-4xl mx-auto">
            <span className="text-[10px] font-mono uppercase tracking-wider text-sim-dim block mb-3 text-left">
              Deterministic Simulation Chain:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-center text-[11px] font-mono">
              <div className="p-2 rounded bg-rose-950/30 border border-rose-500/30 text-rose-300">
                Failed Component
              </div>
              <div className="p-2 rounded bg-sim-card border border-sim-border text-sim-muted">
                Dependency Propagation
              </div>
              <div className="p-2 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300">
                Affected Services
              </div>
              <div className="p-2 rounded bg-yellow-950/30 border border-yellow-500/30 text-yellow-300">
                Degraded Features
              </div>
              <div className="p-2 rounded bg-sim-card border border-sim-border text-sim-muted">
                Explainable Root Cause
              </div>
              <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                Mitigation Strategy
              </div>
              <div className="p-2 rounded bg-blue-950/30 border border-blue-500/30 text-blue-300">
                Before / After Diff
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Differentiation & Philosophy */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-sm border border-sim-border bg-sim-panel p-8">
          <div className="max-w-3xl space-y-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
              Architectural Reliability
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              An engineering control environment for dependency resilience
            </h2>
            <p className="text-xs sm:text-sm text-sim-muted leading-relaxed">
              Modern distributed systems depend on dozens of internal microservices and third-party APIs.
              When an upstream gateway throws HTTP 500 or exceeds latency quotas, standard observability only
              notifies you after customers are impacted.
            </p>
            <p className="text-xs sm:text-sm text-sim-muted leading-relaxed">
              API Failure Twin connects technical service dependencies directly to user-facing application features
              and simulates cascading blast radius deterministically. Test fallback providers, circuit breakers, and
              caching layers before deploying to production.
            </p>
          </div>

          {/* Key Feature Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-sim-border">
            <div className="p-4 rounded-sm border border-sim-border bg-sim-card space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase">
                <AlertOctagon className="w-4 h-4" />
                <span>5 Failure Types</span>
              </div>
              <p className="text-xs text-sim-muted leading-relaxed">
                Deterministic fault injection for HTTP 500, HTTP 429 rate limiting, socket timeouts, high latency spikes, and schema drift.
              </p>
            </div>

            <div className="p-4 rounded-sm border border-sim-border bg-sim-card space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase">
                <Network className="w-4 h-4" />
                <span>NetworkX Graph Traversal</span>
              </div>
              <p className="text-xs text-sim-muted leading-relaxed">
                Directed graph dependency analysis computes upstream paths, dependency depths, and feature degradation in sub-millisecond execution.
              </p>
            </div>

            <div className="p-4 rounded-sm border border-sim-border bg-sim-card space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase">
                <Wrench className="w-4 h-4" />
                <span>Mitigation Verification</span>
              </div>
              <p className="text-xs text-sim-muted leading-relaxed">
                Apply resilience policies and inspect side-by-side before and after diffs to prove failure containment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Primary Hackathon Demo Callout */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="p-6 rounded-sm border border-blue-500/30 bg-blue-950/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-left">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-[10px] font-mono text-blue-400 uppercase font-bold tracking-wider">
                Recommended Hackathon Presentation Flow
              </span>
            </div>
            <h3 className="text-base font-bold text-white">
              Primary Scenario: Payment Acquirer Gateway HTTP 500 Crash
            </h3>
            <p className="text-xs text-sim-muted max-w-xl">
              Experience the canonical demo: Inject HTTP 500 into Payment API &rarr; observe Payment Service and Order Service degradation &rarr; observe Checkout Flow failure &rarr; apply Fallback Secondary Provider mitigation &rarr; verify feature recovery.
            </p>
          </div>

          <Link
            to="/simulator"
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors"
          >
            <span>Run Primary Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
