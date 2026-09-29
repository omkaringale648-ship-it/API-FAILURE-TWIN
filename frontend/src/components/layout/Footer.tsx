import React from 'react';
import { Link } from 'react-router-dom';
import { GitBranch, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-sim-border bg-sim-panel mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Disclaimer */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-sm bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                <GitBranch className="w-3.5 h-3.5" />
              </div>
              <span className="font-mono font-bold text-sm tracking-tight text-white">
                API FAILURE TWIN
              </span>
            </div>
            <p className="text-xs text-sim-muted max-w-md leading-relaxed">
              Deterministic visual dependency simulator for software systems. Model blast radius, evaluate
              cascading failure propagation, and test mitigation strategies in a safe, synthetic environment.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-sim-dim font-mono pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Safe by design: No live production traffic, no destructive tests.</span>
            </div>
          </div>

          {/* Col 2: Simulator & Product */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-sim-text mb-3">
              Application
            </h4>
            <ul className="space-y-2 text-xs text-sim-muted">
              <li>
                <Link to="/simulator" className="hover:text-blue-400 transition-colors">
                  Failure Simulator
                </Link>
              </li>
              <li>
                <Link to="/graph" className="hover:text-blue-400 transition-colors">
                  Topology Graph
                </Link>
              </li>
              <li>
                <Link to="/incidents" className="hover:text-blue-400 transition-colors">
                  Predefined Scenarios
                </Link>
              </li>
              <li>
                <Link to="/features" className="hover:text-blue-400 transition-colors">
                  Core Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Governance & Legal */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-sim-text mb-3">
              Governance & Architecture
            </h4>
            <ul className="space-y-2 text-xs text-sim-muted">
              <li>
                <Link to="/how-it-works" className="hover:text-blue-400 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-blue-400 transition-colors">
                  Security Architecture
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors">
                  About Prototype
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blue-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blue-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-sim-border flex flex-col sm:flex-row items-center justify-between text-[11px] text-sim-dim font-mono gap-3">
          <div>
            API Failure Twin &bull; Hackathon MVP Build &bull; Deterministic NetworkX Simulation Engine
          </div>
          <div>
            Environment: <span className="text-amber-400">Simulation Only</span> &bull; Zero Production Interference
          </div>
        </div>
      </div>
    </footer>
  );
};
