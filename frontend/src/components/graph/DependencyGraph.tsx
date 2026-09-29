import React, { useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType,
  BackgroundVariant
} from 'reactflow';
import 'reactflow/dist/style.css';
import { CustomServiceNode } from './CustomServiceNode';
import { GraphNode as ApiGraphNode, GraphEdge as ApiGraphEdge } from '../../types';

interface DependencyGraphProps {
  nodes: ApiGraphNode[];
  edges: ApiGraphEdge[];
  onSelectService?: (serviceId: string) => void;
  selectedServiceId?: string;
  height?: string;
}

const nodeTypes = {
  serviceNode: CustomServiceNode,
};

// Deterministic layout coordinates based on architectural tier
const TIER_LAYOUT: Record<string, { x: number; y: number }> = {
  'user': { x: 380, y: 30 },
  'api-gateway': { x: 380, y: 160 },
  'auth-service': { x: 120, y: 300 },
  'order-service': { x: 380, y: 300 },
  'location-service': { x: 650, y: 300 },
  'database': { x: 120, y: 460 },
  'payment-service': { x: 380, y: 460 },
  'notification-service': { x: 570, y: 460 },
  'maps-api': { x: 760, y: 460 },
  'payment-api': { x: 380, y: 610 }
};

export const DependencyGraph: React.FC<DependencyGraphProps> = ({
  nodes: apiNodes,
  edges: apiEdges,
  onSelectService,
  selectedServiceId,
  height = '560px'
}) => {
  // Transform API nodes to ReactFlow nodes
  const flowNodes: Node[] = useMemo(() => {
    return apiNodes.map((n) => {
      const position = TIER_LAYOUT[n.id] || { x: n.tier * 220 + 50, y: 100 };
      return {
        id: n.id,
        type: 'serviceNode',
        position,
        data: {
          ...n,
          isSelected: n.id === selectedServiceId
        },
        selected: n.id === selectedServiceId
      };
    });
  }, [apiNodes, selectedServiceId]);

  // Transform API edges to ReactFlow edges
  const flowEdges: Edge[] = useMemo(() => {
    return apiEdges.map((e) => {
      const isPropagating = e.is_propagating;
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'smoothstep',
        animated: isPropagating,
        className: isPropagating ? 'edge-propagating' : '',
        label: e.protocol,
        labelStyle: {
          fill: '#64748B',
          fontFamily: 'monospace',
          fontSize: 9,
          fontWeight: 500
        },
        labelBgStyle: {
          fill: '#0B0F17',
          fillOpacity: 0.85,
          rx: 2,
          stroke: '#1F2E45',
          strokeWidth: 0.5
        },
        style: {
          stroke: isPropagating ? '#EF4444' : e.critical ? '#334155' : '#1E293B',
          strokeWidth: isPropagating ? 2.5 : e.critical ? 1.5 : 1,
          strokeDasharray: isPropagating ? '6 3' : e.critical ? undefined : '3 3'
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isPropagating ? '#EF4444' : '#475569',
          width: 14,
          height: 14
        }
      };
    });
  }, [apiEdges]);

  return (
    <div className="relative w-full rounded-sm border border-sim-border bg-sim-bg overflow-hidden" style={{ height }}>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        onNodeClick={(_, node) => {
          if (onSelectService) {
            onSelectService(node.id);
          }
        }}
        nodesConnectable={false}
        nodesDraggable={true}
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#1E293B" />
        <Controls position="top-right" showInteractive={false} />
        <MiniMap
          nodeStrokeWidth={3}
          zoomable
          pannable
          position="bottom-right"
          nodeColor={(n) => {
            const state = n.data?.state;
            if (state === 'FAILED') return '#EF4444';
            if (state === 'AFFECTED') return '#F59E0B';
            if (state === 'DEGRADED') return '#EAB308';
            return '#10B981';
          }}
          maskColor="rgba(11, 15, 23, 0.75)"
        />
      </ReactFlow>

      {/* Graph Legend Bar */}
      <div className="absolute bottom-2 left-3 z-10 flex flex-wrap items-center gap-3 px-3 py-1.5 rounded-sm bg-sim-panel/90 border border-sim-border text-[10px] font-mono backdrop-blur">
        <span className="text-sim-dim uppercase font-semibold">Legend:</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          <span className="text-sim-muted">Healthy</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
          <span className="text-sim-muted">Failed Target</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="text-sim-muted">Affected Upstream</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="text-sim-muted">Degraded</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-sim-border">
          <span className="w-4 h-0.5 bg-rose-500" />
          <span className="text-rose-400">Propagation Path</span>
        </div>
      </div>
    </div>
  );
};
