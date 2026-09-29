import React from 'react';
import { AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">
      <div className="space-y-2 pb-4 border-b border-sim-border">
        <div className="flex items-center gap-2 text-blue-400 font-mono text-xs">
          <AlertCircle className="w-4 h-4" />
          <span>PROTOTYPE TERMS OF USE</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Terms & Conditions
        </h1>
        <p className="text-xs text-sim-dim font-mono">
          Last Updated: Hackathon MVP Release
        </p>
      </div>

      <div className="space-y-6 text-xs text-sim-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono uppercase">
            1. Simulation Scope & Disclaimers
          </h2>
          <p>
            API Failure Twin is provided strictly as a technical hackathon prototype and proof-of-concept. It models deterministic relationships within synthetic software architecture graphs.
          </p>
          <p className="p-3 rounded bg-sim-card border border-sim-border font-mono text-white text-[11px]">
            IMPORTANT: Results produced by this simulation tool do not constitute a guarantee, warranty, or formal uptime prediction for real-world distributed architectures.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono uppercase">
            2. Permitted Use
          </h2>
          <p>
            You are free to explore, simulate, and demonstrate the software architecture models for educational, evaluation, and hackathon presentation purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono uppercase">
            3. Limitation of Liability
          </h2>
          <p>
            Under no circumstances shall the creators be liable for decisions made or engineering systems deployed based on synthetic simulation results.
          </p>
        </section>
      </div>
    </div>
  );
};
