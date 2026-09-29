import React from 'react';
import { Network, ArrowDown, ShieldCheck, CheckCircle2, Play, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HowItWorksPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left pb-6 border-b border-sim-border">
        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
          Under the Hood
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          How API Failure Twin Works
        </h1>
        <p className="text-xs sm:text-sm text-sim-muted max-w-2xl leading-relaxed">
          Deterministic failure simulation built on graph theory, NetworkX traversal algorithms, and explicit state transition rules.
        </p>
      </div>

      {/* Step 1: Graph Topology Configuration */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-400 font-mono text-xs font-bold flex items-center justify-center">
            1
          </span>
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Canonical Directed Dependency Graph
          </h2>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          The synthetic topology is represented as a directed graph in Python via NetworkX. Nodes represent clients, reverse proxies, internal microservices, and external API gateways. Edges represent directional call dependencies:
        </p>
        <div className="p-3 rounded-sm bg-sim-card border border-sim-border font-mono text-xs text-sim-text space-y-1">
          <div><code className="text-blue-400">Payment Service</code> &rarr; <code className="text-sim-muted">depends on</code> &rarr; <code className="text-rose-400">Payment API</code> (Critical: true)</div>
          <div><code className="text-blue-400">Order Service</code> &rarr; <code className="text-sim-muted">depends on</code> &rarr; <code className="text-blue-400">Payment Service</code> (Critical: true)</div>
          <div><code className="text-blue-400">API Gateway</code> &rarr; <code className="text-sim-muted">depends on</code> &rarr; <code className="text-blue-400">Order Service</code> (Critical: true)</div>
        </div>
      </div>

      {/* Step 2: Fault Injection & Inverted Propagation */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-rose-600/20 border border-rose-500/40 text-rose-400 font-mono text-xs font-bold flex items-center justify-center">
            2
          </span>
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Deterministic Blast Radius Propagation
          </h2>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          When a failure (e.g. HTTP 500) is injected into <code className="text-rose-300">Payment API</code>, the engine traverses the reverse graph to find all upstream callers:
        </p>
        <div className="p-3 rounded-sm bg-sim-card border border-sim-border font-mono text-xs text-sim-text space-y-1.5">
          <div className="text-rose-400 font-bold">1. Target: Payment API &rarr; FAILED (HTTP 500)</div>
          <div className="pl-4 text-amber-300">&darr; Payment Service &rarr; FAILED (Direct critical dependency)</div>
          <div className="pl-8 text-amber-300">&darr; Order Service &rarr; AFFECTED (Tier 2 cascading dependent)</div>
          <div className="pl-12 text-yellow-300">&darr; API Gateway &rarr; DEGRADED (Tier 1 ingress proxy)</div>
          <div className="pl-16 text-yellow-300">&darr; User Client &rarr; DEGRADED (End client checkout stalls)</div>
        </div>
      </div>

      {/* Step 3: Feature Impact & Explainable Reasoning */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-amber-600/20 border border-amber-500/40 text-amber-400 font-mono text-xs font-bold flex items-center justify-center">
            3
          </span>
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Feature Mapping & Deterministic Explanation
          </h2>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          User-facing features inspect their prerequisite dependencies. If any prerequisite is non-healthy, the feature transitions to DEGRADED. The engine automatically outputs a human-readable explanation derived directly from the graph path:
        </p>
        <blockquote className="p-3 rounded-sm bg-sim-card border-l-2 border-blue-400 text-xs text-sim-text italic font-mono">
          &ldquo;Checkout Flow is affected because Checkout Flow depends on Order Service, which depends on Payment API.&rdquo;
        </blockquote>
      </div>

      {/* Step 4: Mitigation & State Transition */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-3">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold flex items-center justify-center">
            4
          </span>
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
            Mitigation Application & Resiliency Verification
          </h2>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          When a mitigation rule is deployed (such as activating a secondary payment provider fallback), the engine adjusts node operational capabilities, recovers non-faulty upstream services, and diffs Before vs After states.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
        >
          <span>Try the Simulation Flow</span>
          <Play className="w-4 h-4 fill-current" />
        </Link>
      </div>
    </div>
  );
};
