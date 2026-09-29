import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchScenarios, runScenario } from '../lib/api';
import { Scenario, SimulationResult } from '../types';
import { Sparkles, Play, AlertOctagon, Clock, Gauge, ArrowRight, CheckCircle2 } from 'lucide-react';

export const IncidentsPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [recentRuns, setRecentRuns] = useState<{ scenario: Scenario; result: SimulationResult }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchScenarios().then(setScenarios).catch(console.error);
  }, []);

  const handleRun = async (scenario: Scenario) => {
    try {
      setRunningId(scenario.id);
      const res = await runScenario(scenario.id);
      setRecentRuns((prev) => [
        { scenario, result: res.simulation },
        ...prev.filter((r) => r.scenario.id !== scenario.id)
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setRunningId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-sim-border">
        <h1 className="text-lg font-mono font-bold uppercase tracking-tight text-white mb-1">
          PRECONFIGURED SCENARIOS & INCIDENT RUN LOG
        </h1>
        <p className="text-xs text-sim-muted font-sans">
          One-click deterministic incident scenarios to verify propagation, blast radius, and mitigation rules across different failure categories.
        </p>
      </div>

      {/* Scenario Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sim-muted">
            AVAILABLE DEMO SCENARIOS
          </span>
          <span className="text-[10px] font-mono text-sim-dim">
            {scenarios.length} Predefined Scenarios
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((sc) => {
            const isRunning = runningId === sc.id;
            const isPrimary = sc.id === 'scenario-payment-500';

            return (
              <div
                key={sc.id}
                className={`p-5 rounded-sm border transition-all ${
                  isPrimary
                    ? 'border-blue-500/50 bg-blue-950/15'
                    : 'border-sim-border bg-sim-panel hover:border-sim-borderLight'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    {isPrimary && (
                      <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                        PRIMARY HACKATHON DEMO
                      </span>
                    )}
                    <span className="font-mono text-xs font-bold text-white">
                      {sc.name}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${
                      sc.severity === 'CRITICAL'
                        ? 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                        : 'border-amber-500/40 bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {sc.severity}
                  </span>
                </div>

                <p className="text-xs text-sim-muted leading-relaxed font-sans mb-3">
                  {sc.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-sim-dim py-2 border-t border-sim-border/60 mb-3">
                  <div>
                    <span className="text-sim-dim">Target: </span>
                    <span className="text-sim-text font-semibold">{sc.targetService}</span>
                  </div>
                  <div>
                    <span className="text-sim-dim">Fault: </span>
                    <span className="text-rose-400 font-semibold">{sc.failureType}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleRun(sc)}
                    disabled={isRunning}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>{isRunning ? 'Simulating...' : 'Run Scenario'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate('/simulator')}
                    className="text-xs font-mono text-sim-dim hover:text-white flex items-center gap-1"
                  >
                    <span>Open in Simulator</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Simulation Executions */}
      {recentRuns.length > 0 && (
        <div className="space-y-3 pt-6 border-t border-sim-border">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-sim-muted block">
            RECENT LOCAL SIMULATION RUNS
          </span>

          <div className="space-y-2">
            {recentRuns.map(({ scenario, result }, idx) => (
              <div
                key={idx}
                className="p-4 rounded-sm border border-sim-border bg-sim-panel flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-white font-mono">{scenario.name}</span>
                    <span className="text-[10px] font-mono text-sim-dim">
                      ID: {result.simulation_id}
                    </span>
                  </div>
                  <div className="text-[11px] text-sim-muted">
                    {result.explanation}
                  </div>
                </div>

                <div className="flex items-center gap-3 font-mono text-xs flex-shrink-0">
                  <span className="text-rose-400">
                    {result.affected_services.length} services affected
                  </span>
                  <span className="text-sim-dim">&bull;</span>
                  <span className="text-amber-400">
                    {result.affected_features.length} features degraded
                  </span>
                  <button
                    onClick={() => navigate('/simulator')}
                    className="px-2.5 py-1 rounded-sm border border-sim-border bg-sim-card hover:bg-sim-cardHover text-white text-[11px]"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
