import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const EnvironmentBadge: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 border border-amber-500/30 bg-amber-500/10 text-amber-400 font-mono font-medium uppercase tracking-wider rounded-sm ${size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
      <ShieldCheck className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>Environment: Simulation</span>
    </div>
  );
};
