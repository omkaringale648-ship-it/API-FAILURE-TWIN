import React, { useState, useEffect } from 'react';
import { fetchSystem, fetchGraph } from '../lib/api';
import { SystemTopologyResponse, GraphResponse, Service, Feature } from '../types';
import { DependencyGraph } from '../components/graph/DependencyGraph';
import { Network, Server, Database, Globe, Radio, Layers, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const GraphPage: React.FC = () => {
  const [topology, setTopology] = useState<SystemTopologyResponse | null>(null);
  const [graphData, setGraphData] = useState<GraphResponse | null>(null);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('payment-service');

  useEffect(() => {
    Promise.all([fetchSystem(), fetchGraph()]).then(([sys, graph]) => {
      setTopology(sys);
      setGraphData(graph);
    });
  }, []);

  const selectedService: Service | undefined = topology?.services.find(
    (s) => s.id === selectedServiceId
  );

  // Features that depend on this service
  const connectedFeatures: Feature[] = (topology?.features || []).filter((f) =>
    f.dependsOn.includes(selectedServiceId)
  );

  // Direct dependencies (what this service depends on)
  const outgoingDeps = (topology?.dependencies || []).filter(
    (d) => d.source === selectedServiceId
  );

  // Direct dependents (what depends on this service)
  const incomingDeps = (topology?.dependencies || []).filter(
    (d) => d.target === selectedServiceId
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-sim-border gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-mono font-bold uppercase tracking-tight text-white">
              SYSTEM TOPOLOGY & DEPENDENCY GRAPH
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sim-panel border border-sim-border text-sim-dim uppercase">
              10 Directed Nodes
            </span>
          </div>
          <p className="text-xs text-sim-muted font-sans">
            Directed dependency relationships: <code className="text-blue-400">source depends on target</code>.
            Select any node to inspect incoming and outgoing couplings.
          </p>
        </div>

        <Link
          to="/simulator"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm"
        >
          <span>Open in Simulator</span>
        </Link>
      </div>

      {/* Main Layout: Graph (8 Cols), Node Inspector (4 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <DependencyGraph
            nodes={graphData?.nodes || []}
            edges={graphData?.edges || []}
            onSelectService={(id) => setSelectedServiceId(id)}
            selectedServiceId={selectedServiceId}
            height="620px"
          />
        </div>

        {/* Node Inspector Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {selectedService ? (
            <div className="rounded-sm border border-sim-border bg-sim-panel p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-sim-border">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">
                  COMPONENT INSPECTOR
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sim-card border border-sim-border text-sim-dim">
                  Tier {selectedService.tier ?? 0}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-white mb-1">
                  {selectedService.name}
                </h3>
                <span className="font-mono text-xs text-sim-dim block">
                  ID: <code className="text-blue-400">{selectedService.id}</code>
                </span>
                <p className="text-xs text-sim-muted mt-2 leading-relaxed">
                  {selectedService.description}
                </p>
              </div>

              {/* Attributes */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-sim-card border border-sim-border">
                  <span className="text-[10px] text-sim-dim uppercase block">Type</span>
                  <span className="text-white font-medium capitalize mt-0.5 block">
                    {selectedService.type.replace('-', ' ')}
                  </span>
                </div>
                <div className="p-2 rounded bg-sim-card border border-sim-border">
                  <span className="text-[10px] text-sim-dim uppercase block">Criticality</span>
                  <span
                    className={`font-bold uppercase mt-0.5 block ${
                      selectedService.criticality === 'critical'
                        ? 'text-rose-400'
                        : selectedService.criticality === 'high'
                        ? 'text-amber-400'
                        : 'text-sim-muted'
                    }`}
                  >
                    {selectedService.criticality}
                  </span>
                </div>
              </div>

              {/* Connected Features */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sim-muted block mb-1.5 font-semibold">
                  Downstream Features Depending on Component:
                </span>
                {connectedFeatures.length > 0 ? (
                  <div className="space-y-1">
                    {connectedFeatures.map((feat) => (
                      <div
                        key={feat.id}
                        className="px-2.5 py-1.5 rounded-sm border border-sim-border bg-sim-card text-xs flex items-center justify-between"
                      >
                        <span className="text-white font-medium">{feat.name}</span>
                        <span className="text-[9px] font-mono text-sim-dim uppercase">
                          {feat.criticality}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-sim-dim font-mono italic p-2 rounded bg-sim-card">
                    No direct features registered.
                  </div>
                )}
              </div>

              {/* Upstream Dependents */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sim-muted block mb-1.5 font-semibold">
                  Upstream Services That Depend On This (Blast Path):
                </span>
                {incomingDeps.length > 0 ? (
                  <div className="space-y-1">
                    {incomingDeps.map((dep) => (
                      <div
                        key={dep.source}
                        className="px-2.5 py-1.5 rounded-sm border border-sim-border bg-sim-card text-xs flex items-center justify-between font-mono"
                      >
                        <span className="text-white">{dep.source}</span>
                        <span className="text-[10px] text-sim-dim">{dep.protocol}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-sim-dim font-mono italic p-2 rounded bg-sim-card">
                    Top-level entrypoint (No upstream callers).
                  </div>
                )}
              </div>

              {/* Downstream Dependencies */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-sim-muted block mb-1.5 font-semibold">
                  Downstream Dependencies (What This Calls):
                </span>
                {outgoingDeps.length > 0 ? (
                  <div className="space-y-1">
                    {outgoingDeps.map((dep) => (
                      <div
                        key={dep.target}
                        className="px-2.5 py-1.5 rounded-sm border border-sim-border bg-sim-card text-xs flex items-center justify-between font-mono"
                      >
                        <span className="text-white">{dep.target}</span>
                        <span className="text-[10px] text-sim-dim">{dep.protocol}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-sim-dim font-mono italic p-2 rounded bg-sim-card">
                    Leaf node / independent API.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-sm border border-sim-border bg-sim-panel p-5 text-center text-xs text-sim-dim">
              Click any node in the graph to inspect its dependency structure.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
