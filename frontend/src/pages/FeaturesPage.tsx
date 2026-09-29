import React from 'react';
import {
  AlertOctagon,
  Network,
  Cpu,
  Layers,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left pb-6 border-b border-sim-border">
        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
          Platform Architecture & Capabilities
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Core Features of API Failure Twin
        </h1>
        <p className="text-xs sm:text-sm text-sim-muted max-w-2xl leading-relaxed">
          Engineered for deterministic dependency graph failure propagation, blast radius quantification, and mitigation strategy verification.
        </p>
      </div>

      {/* Feature 1: Five Deterministic Failure Types */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-4">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertOctagon className="w-5 h-5" />
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            1. Five Deterministic Failure Modes
          </h2>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          Rather than relying on random chaos monkeys or non-reproducible testing, the twin implements 5 explicit, deterministic failure primitives:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-sm border border-sim-border bg-sim-card text-xs">
            <span className="font-mono font-bold text-rose-400 block mb-1">HTTP 500 Server Crash</span>
            <span className="text-sim-muted leading-snug block">Upstream crash returns 500 error code, halting synchronous dependents.</span>
          </div>
          <div className="p-3 rounded-sm border border-sim-border bg-sim-card text-xs">
            <span className="font-mono font-bold text-amber-400 block mb-1">HTTP 429 Rate Limit</span>
            <span className="text-sim-muted leading-snug block">Rate quota breach causing client rejection and request queuing.</span>
          </div>
          <div className="p-3 rounded-sm border border-sim-border bg-sim-card text-xs">
            <span className="font-mono font-bold text-yellow-400 block mb-1">TIMEOUT Deadline</span>
            <span className="text-sim-muted leading-snug block">Socket deadline exceeded (&gt;30s), tying up connection pools.</span>
          </div>
          <div className="p-3 rounded-sm border border-sim-border bg-sim-card text-xs">
            <span className="font-mono font-bold text-blue-400 block mb-1">HIGH LATENCY Spikes</span>
            <span className="text-sim-muted leading-snug block">Severe roundtrip delay (&gt;5000ms) saturating upstream caller queues.</span>
          </div>
          <div className="p-3 rounded-sm border border-sim-border bg-sim-card text-xs">
            <span className="font-mono font-bold text-purple-400 block mb-1">SCHEMA MISMATCH Drift</span>
            <span className="text-sim-muted leading-snug block">Unannounced breaking payload schema causing deserialization panics.</span>
          </div>
        </div>
      </div>

      {/* Feature 2: Directed Dependency Graph Traversal */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-4">
        <div className="flex items-center gap-2 text-blue-400">
          <Network className="w-5 h-5" />
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            2. NetworkX Directed Graph Traversal
          </h2>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          The backend maintains an explicit directed graph where edges model <code className="text-blue-300">source depends on target</code> relationships. When a target fails, the propagation engine reverses the dependency vectors and computes:
        </p>
        <ul className="list-disc list-inside text-xs text-sim-muted space-y-1 pl-2">
          <li>Transitive upstream descendants in the propagation graph</li>
          <li>Exact simple propagation paths from the root failure to user endpoints</li>
          <li>Dependency depth distance (shortest path length)</li>
          <li>Critical dependency edge crossings</li>
        </ul>
      </div>

      {/* Feature 3: Business Feature Impact Mapping */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Layers className="w-5 h-5" />
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            3. Business Feature Impact Mapping
          </h2>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          Technical service downtime is mapped directly to synthetic user-facing capabilities such as <strong className="text-white">Checkout Flow</strong>, <strong className="text-white">Payment Processing</strong>, and <strong className="text-white">Order Tracking</strong>. Engineers can immediately communicate operational risk in terms of application degradation.
        </p>
      </div>

      {/* Feature 4: Mitigation Strategy Testing */}
      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-4">
        <div className="flex items-center gap-2 text-emerald-400">
          <Wrench className="w-5 h-5" />
          <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
            4. Mitigation Strategy Testing & State Diffing
          </h2>
        </div>
        <p className="text-xs text-sim-muted leading-relaxed">
          Test resilience patterns like fallback secondary providers, exponential backoff retries, and stale-while-revalidate caching. The platform recalculates the dependency graph and provides a side-by-side Before/After diff proving whether the mitigation successfully contained the blast radius.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/simulator"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-md"
        >
          <span>Test Features in Failure Simulator</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
