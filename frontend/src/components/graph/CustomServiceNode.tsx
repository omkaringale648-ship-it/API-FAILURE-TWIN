import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import {
  Server,
  Database,
  Globe,
  Radio,
  User,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';
import { ServiceState } from '../../types';

interface ServiceNodeData {
  id: string;
  name: string;
  type: string;
  criticality: string;
  state: ServiceState;
  tier: number;
  description?: string;
  incoming_dependencies?: number;
  outgoing_dependencies?: number;
  isSelected?: boolean;
}

export const CustomServiceNode = memo(({ data, selected }: NodeProps<ServiceNodeData>) => {
  const { id, name, type, criticality, state = 'HEALTHY', tier } = data;

  const getIcon = () => {
    switch (type) {
      case 'client':
        return <User className="w-3.5 h-3.5" />;
      case 'gateway':
        return <Radio className="w-3.5 h-3.5" />;
      case 'database':
        return <Database className="w-3.5 h-3.5" />;
      case 'external-api':
        return <Globe className="w-3.5 h-3.5" />;
      default:
        return <Server className="w-3.5 h-3.5" />;
    }
  };

  const getStateStyle = () => {
    switch (state) {
      case 'FAILED':
        return {
          border: 'border-rose-500 ring-2 ring-rose-500/20 shadow-lg shadow-rose-950/40 bg-rose-950/40',
          badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
          label: 'FAILED',
        };
      case 'AFFECTED':
        return {
          border: 'border-amber-500 ring-1 ring-amber-500/20 shadow-md shadow-amber-950/40 bg-amber-950/30',
          badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
          label: 'AFFECTED',
        };
      case 'DEGRADED':
        return {
          border: 'border-yellow-500 ring-1 ring-yellow-500/20 bg-yellow-950/20',
          badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40',
          icon: <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />,
          label: 'DEGRADED',
        };
      default:
        return {
          border: 'border-sim-border hover:border-sim-borderLight bg-sim-card hover:bg-sim-cardHover',
          badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'HEALTHY',
        };
    }
  };

  const style = getStateStyle();

  return (
    <div
      className={`relative min-w-[210px] rounded-sm p-3.5 border transition-all cursor-pointer ${style.border} ${
        selected ? 'ring-2 ring-blue-500 border-blue-400' : ''
      }`}
    >
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-sim-border !border-sim-borderLight" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-sim-border !border-sim-borderLight" />
      <Handle type="target" position={Position.Left} id="left" className="!w-2 !h-2 !bg-sim-border" />
      <Handle type="source" position={Position.Right} id="right" className="!w-2 !h-2 !bg-sim-border" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 text-sim-muted font-mono text-[10px] uppercase">
          {getIcon()}
          <span>{type.replace('-', ' ')}</span>
        </div>
        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sim-panel text-sim-dim border border-sim-border">
          T{tier}
        </span>
      </div>

      {/* Title */}
      <div className="font-semibold text-xs text-white mb-2 tracking-tight">
        {name}
      </div>

      {/* Footer Info & State */}
      <div className="flex items-center justify-between pt-2 border-t border-sim-border/60">
        <div className="flex items-center gap-1">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm font-mono text-[9px] font-bold border uppercase tracking-wider ${style.badge}`}
          >
            {style.icon}
            <span>{style.label}</span>
          </span>
        </div>

        <span
          className={`font-mono text-[9px] uppercase px-1 py-0.5 rounded ${
            criticality === 'critical'
              ? 'text-rose-400 bg-rose-950/40 border border-rose-900/40'
              : criticality === 'high'
              ? 'text-amber-400 bg-amber-950/40 border border-amber-900/40'
              : 'text-sim-dim bg-sim-panel'
          }`}
        >
          {criticality}
        </span>
      </div>
    </div>
  );
});

CustomServiceNode.displayName = 'CustomServiceNode';
