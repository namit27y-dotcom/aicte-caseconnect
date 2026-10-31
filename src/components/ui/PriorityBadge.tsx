import React from 'react';
import { AlertTriangle, AlertCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ComplaintPriority } from '../../types';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const configMap: Record<
    ComplaintPriority,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string }
  > = {
    CRITICAL: {
      label: 'Critical',
      icon: <AlertTriangle size={12} className="shrink-0" />,
      bg: 'bg-[#B94F45]/10',
      text: 'text-[#B94F45]',
      border: 'border-[#B94F45]/30',
    },
    HIGH: {
      label: 'High',
      icon: <ArrowUpRight size={12} className="shrink-0" />,
      bg: 'bg-[#C58B3B]/10',
      text: 'text-[#C58B3B]',
      border: 'border-[#C58B3B]/30',
    },
    MEDIUM: {
      label: 'Medium',
      icon: <AlertCircle size={12} className="shrink-0" />,
      bg: 'bg-[#C5A568]/15',
      text: 'text-[#142B21]',
      border: 'border-[#C5A568]/40',
    },
    LOW: {
      label: 'Low',
      icon: <ArrowDownRight size={12} className="shrink-0" />,
      bg: 'bg-[#829B86]/15',
      text: 'text-[#193B2A]',
      border: 'border-[#829B86]/40',
    },
  };

  const config = configMap[priority] || {
    label: priority,
    icon: <AlertCircle size={12} />,
    bg: 'bg-[#F7F5EF]',
    text: 'text-[#252D27]',
    border: 'border-[#E7E4DB]',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1'
      : 'px-2.5 py-1 text-xs gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-md border font-sans select-none ${sizeClasses} ${config.bg} ${config.text} ${config.border}`}
      title={`Priority Level: ${config.label}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
