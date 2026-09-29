import React from 'react';
import { Activity, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

interface SystemStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const SystemStatusBadge: React.FC<SystemStatusBadgeProps> = ({ status, size = 'md' }) => {
  const isHealthy = status.toLowerCase().includes('healthy');
  const isCritical = status.toLowerCase().includes('critical') || status.toLowerCase().includes('fault');
  const isDegraded = status.toLowerCase().includes('degraded') || status.toLowerCase().includes('mitigat');

  let badgeColor = 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400';
  let dotColor = 'bg-emerald-400';
  let Icon = CheckCircle;

  if (isCritical) {
    badgeColor = 'border-rose-500/30 bg-rose-500/10 text-rose-400';
    dotColor = 'bg-rose-400 animate-ping';
    Icon = ShieldAlert;
  } else if (isDegraded) {
    badgeColor = 'border-amber-500/30 bg-amber-500/10 text-amber-400';
    dotColor = 'bg-amber-400';
    Icon = AlertTriangle;
  }

  return (
    <div
      className={`inline-flex items-center gap-2 border font-mono font-medium rounded-sm uppercase tracking-wider ${badgeColor} ${
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className="relative flex h-2 w-2">
        {isCritical && <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor}`} />}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isCritical ? 'bg-rose-500' : isDegraded ? 'bg-amber-500' : 'bg-emerald-500'}`} />
      </span>
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>Status: {status}</span>
    </div>
  );
};
