import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">
      <div className="space-y-2 pb-4 border-b border-sim-border">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
          <ShieldCheck className="w-4 h-4" />
          <span>ZERO DATA COLLECTION POLICY</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-sim-dim font-mono">
          Last Updated: Hackathon MVP Release
        </p>
      </div>

      <div className="space-y-6 text-xs text-sim-muted leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono uppercase">
            1. Nature of the Application
          </h2>
          <p>
            API Failure Twin is a standalone synthetic simulation application designed to demonstrate dependency graph failure propagation in software systems. It does not collect, harvest, monetize, or transmit personal data or real production credentials.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono uppercase">
            2. Local & In-Memory Data Storage
          </h2>
          <p>
            All simulation states, graph node modifications, and mitigation calculations are generated and maintained in-memory on the local backend instance. No tracking cookies or advertising pixels are implemented.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white font-mono uppercase">
            3. Third-Party Integrations
          </h2>
          <p>
            The core MVP operates without external API dependencies. No external telemetry or cloud loggers are linked to user activity.
          </p>
        </section>
      </div>
    </div>
  );
};
