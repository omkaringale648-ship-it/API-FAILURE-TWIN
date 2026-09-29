import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GitBranch, Play, Network, History, Shield, Info, RotateCcw } from 'lucide-react';
import { EnvironmentBadge } from './EnvironmentBadge';
import { SystemStatusBadge } from './SystemStatusBadge';

interface NavbarProps {
  systemStatus?: string;
  onReset?: () => void;
  isResetting?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  systemStatus = 'Healthy',
  onReset,
  isResetting = false
}) => {
  const location = useLocation();

  const navLinks = [
    { to: '/simulator', label: 'Simulator', icon: Play },
    { to: '/graph', label: 'Topology Graph', icon: Network },
    { to: '/incidents', label: 'Scenarios & History', icon: History },
    { to: '/features', label: 'Features', icon: GitBranch },
    { to: '/how-it-works', label: 'How It Works', icon: Info },
    { to: '/security', label: 'Security', icon: Shield },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-sim-border bg-sim-panel/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-sm bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:border-blue-400 transition-colors">
                <GitBranch className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono font-bold tracking-tight text-white text-base block leading-none">
                  API FAILURE TWIN
                </span>
                <span className="text-[10px] text-sim-dim font-mono tracking-wider uppercase block mt-1">
                  Dependency Simulator
                </span>
              </div>
            </Link>

            <div className="hidden lg:flex items-center gap-2 ml-3 pl-3 border-l border-sim-border">
              <EnvironmentBadge size="sm" />
              <SystemStatusBadge status={systemStatus} size="sm" />
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                      : 'text-sim-muted hover:text-white hover:bg-sim-card'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Header Action: Reset button */}
          <div className="flex items-center gap-2.5">
            {onReset && (
              <button
                onClick={onReset}
                disabled={isResetting}
                title="Reset simulation to healthy baseline"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded-sm border border-sim-border hover:border-sim-borderLight bg-sim-card hover:bg-sim-cardHover text-sim-text disabled:opacity-50 transition-colors"
              >
                <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <Link
              to="/simulator"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-sm bg-blue-600 hover:bg-blue-500 text-white transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch Twin</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
