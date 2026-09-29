import React from 'react';
import { GitBranch, ShieldCheck, Cpu, Code2, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left pb-6 border-b border-sim-border">
        <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold block">
          Project Background
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          About API Failure Twin
        </h1>
        <p className="text-xs sm:text-sm text-sim-muted max-w-2xl leading-relaxed">
          Built for engineers who need to anticipate how microservice breakdowns propagate upstream before they hit customer-facing workflows.
        </p>
      </div>

      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-4">
        <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
          The Problem We Solve
        </h2>
        <p className="text-xs text-sim-muted leading-relaxed font-sans">
          In microservice architectures, dependency failures rarely remain isolated. A 500 error on a third-party payment gateway doesn't just stop payments—it creates thread pool exhaustion in the payment service, connection timeouts in the order orchestration service, and 504 Gateway Timeouts at the user's mobile client.
        </p>
        <p className="text-xs text-sim-muted leading-relaxed font-sans">
          API Failure Twin gives infrastructure leads and developers a controlled, synthetic environment to model these cascading failures, measure the depth of blast radius, and test mitigations (like fallback providers, exponential retries, and cache buffers) with mathematical determinism.
        </p>
      </div>

      <div className="p-6 rounded-sm border border-sim-border bg-sim-panel space-y-4">
        <h2 className="text-base font-bold text-white font-mono uppercase tracking-wider">
          Engineering Stack & Principles
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-sm bg-sim-card border border-sim-border space-y-1">
            <span className="text-blue-400 font-bold block">Backend: FastAPI & NetworkX</span>
            <p className="text-sim-muted font-sans leading-relaxed">
              Python 3.13 backend utilizing NetworkX directed graph algorithms to evaluate dependency trees and blast radius in microseconds.
            </p>
          </div>
          <div className="p-3.5 rounded-sm bg-sim-card border border-sim-border space-y-1">
            <span className="text-emerald-400 font-bold block">Frontend: React & React Flow</span>
            <p className="text-sim-muted font-sans leading-relaxed">
              Interactive high-performance graph canvas with live state transitions, customizable zoom, and animated propagation lines.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link
          to="/simulator"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
        >
          <span>Open Twin Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
