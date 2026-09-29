import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchSystem,
  fetchGraph,
  simulateFailure,
  applyMitigation,
  resetSimulation,
  runScenario
} from '../lib/api';
import {
  SystemTopologyResponse,
  GraphResponse,
  SimulationResult,
  MitigationResult,
  Service,
  Feature,
  FailureTypeId,
  SeverityLevel
} from '../types';
import { DependencyGraph } from '../components/graph/DependencyGraph';
import { FailureSimulator } from '../components/simulator/FailureSimulator';
import { ImpactPanel } from '../components/impact/ImpactPanel';
import { MitigationPanel } from '../components/mitigation/MitigationPanel';
import { BeforeAfterComparison } from '../components/mitigation/BeforeAfterComparison';
import { IncidentTimeline } from '../components/timeline/IncidentTimeline';
import { EnvironmentBadge } from '../components/layout/EnvironmentBadge';
import { SystemStatusBadge } from '../components/layout/SystemStatusBadge';
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react';

export const SimulatorPage: React.FC = () => {
  const [topology, setTopology] = useState<SystemTopologyResponse | null>(null);
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('payment-api');
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [mitigationResult, setMitigationResult] = useState<MitigationResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load initial topology and graph
  const loadInitialData = useCallback(async () => {
    try {
      setErrorMessage(null);
      const [sys, graph] = await Promise.all([fetchSystem(), fetchGraph()]);
      setTopology(sys);
      setGraphData(graph);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to simulation backend.');
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle Failure Simulation
  const handleSimulate = async (payload: {
    target_service: string;
    failure_type: FailureTypeId;
    duration: number;
    severity: SeverityLevel;
  }) => {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      setMitigationResult(null); // Clear previous mitigation

      const res = await simulateFailure(payload);
      setSimulationResult(res.simulation);

      // Refresh graph with failure state
      const updatedGraph = await fetchGraph(res.simulation.simulation_id);
      setGraphData(updatedGraph);
    } catch (err: any) {
      setErrorMessage(err.message || 'Simulation execution failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Apply Mitigation
  const handleApplyMitigation = async (mitigationId: string) => {
    if (!simulationResult) return;
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await applyMitigation(simulationResult.simulation_id, mitigationId);
      setMitigationResult(res);

      // Refresh graph to show mitigated state
      const updatedGraph = await fetchGraph(simulationResult.simulation_id);
      setGraphData(updatedGraph);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to apply mitigation.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Reset Simulation
  const handleReset = async () => {
    try {
      setIsResetting(true);
      setErrorMessage(null);
      await resetSimulation();
      setSimulationResult(null);
      setMitigationResult(null);
      setSelectedServiceId('payment-api');

      const graph = await fetchGraph();
      setGraphData(graph);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to reset simulation.');
    } finally {
      setIsResetting(false);
    }
  };

  // Handle Primary Demo Scenario (Payment API HTTP 500)
  const handleRunPrimaryDemo = async () => {
    setSelectedServiceId('payment-api');
    await handleSimulate({
      target_service: 'payment-api',
      failure_type: 'HTTP 500',
      duration: 10,
      severity: 'CRITICAL'
    });
  };

  const services: Service[] = topology?.services || [];
  const features: Feature[] = topology?.features || [];
  const systemStatus = graphData?.system_status || 'Healthy';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Banner / Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sim-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-mono font-bold uppercase tracking-tight text-white">
              FAILURE TWIN CONTROL DASHBOARD
            </h1>
            <EnvironmentBadge size="sm" />
          </div>
          <p className="text-xs text-sim-muted font-sans">
            Interactive visual dependency simulator &bull; Deterministic blast radius and mitigation analysis
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <SystemStatusBadge status={systemStatus} />

          <button
            onClick={handleRunPrimaryDemo}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Primary Demo</span>
          </button>

          <button
            onClick={handleReset}
            disabled={isResetting || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-sim-border hover:border-sim-borderLight bg-sim-card hover:bg-sim-cardHover text-sim-text font-mono text-xs transition-colors disabled:opacity-50"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="p-3 rounded-sm border border-rose-500/40 bg-rose-950/30 flex items-center justify-between text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-[10px] font-mono text-sim-dim hover:text-white"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Grid: Left Graph, Right Simulator & Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Graph (7 Cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-sim-muted">
              LIVE SYSTEM TOPOLOGY GRAPH
            </span>
            <span className="text-[10px] font-mono text-sim-dim">
              Click node to target &bull; Drag to inspect
            </span>
          </div>

          <DependencyGraph
            nodes={graphData?.nodes || []}
            edges={graphData?.edges || []}
            onSelectService={(id) => setSelectedServiceId(id)}
            selectedServiceId={selectedServiceId}
            height="580px"
          />
        </div>

        {/* Right Column: Simulator Form + Impact Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <FailureSimulator
            services={services}
            selectedServiceId={selectedServiceId}
            onSelectService={(id) => setSelectedServiceId(id)}
            onSimulate={handleSimulate}
            onReset={handleReset}
            onRunPrimaryDemo={handleRunPrimaryDemo}
            isLoading={isLoading}
            hasActiveSimulation={!!simulationResult}
          />

          <ImpactPanel
            simulation={simulationResult}
            services={services}
            features={features}
          />
        </div>
      </div>

      {/* Bottom Section: Mitigation & Before/After Comparison */}
      {simulationResult && (
        <div className="space-y-6 pt-4 border-t border-sim-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <MitigationPanel
                mitigations={simulationResult.mitigations}
                simulationId={simulationResult.simulation_id}
                onApplyMitigation={handleApplyMitigation}
                isLoading={isLoading}
                activeMitigationResult={mitigationResult}
              />
            </div>

            <div className="lg:col-span-7">
              <IncidentTimeline
                timeline={
                  mitigationResult
                    ? mitigationResult.timeline
                    : simulationResult.timeline
                }
                title={
                  mitigationResult
                    ? 'MITIGATION RECOVERY TIMELINE'
                    : 'FAILURE PROPAGATION TIMELINE'
                }
              />
            </div>
          </div>

          {/* Before & After State Comparison View */}
          <BeforeAfterComparison mitigationResult={mitigationResult} />
        </div>
      )}
    </div>
  );
};
