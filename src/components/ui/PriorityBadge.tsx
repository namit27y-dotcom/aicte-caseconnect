import React from 'react';
import { ComplaintPriority } from '../../types';
import { Flame, AlertCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface PriorityBadgeProps {
  priority: ComplaintPriority;
  size?: 'sm' | 'md';
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  className = '',
}) => {
  const configs: Record<
    ComplaintPriority,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    CRITICAL: {
      label: 'Critical Priority',
      bg: 'bg-[#FEF2F2]',
      text: 'text-[#991B1B]',
      border: 'border-[#FCA5A5]',
      icon: <Flame size={12} className="text-[#DC2626] shrink-0" />,
    },
    HIGH: {
      label: 'High Priority',
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#92400E]',
      border: 'border-[#FCD34D]',
      icon: <AlertCircle size={12} className="text-[#D97706] shrink-0" />,
    },
    MEDIUM: {
      label: 'Medium Priority',
      bg: 'bg-[#EFF6FF]',
      text: 'text-[#1E40AF]',
      border: 'border-[#BFDBFE]',
      icon: <ArrowUp size={12} className="text-[#2563EB] shrink-0" />,
    },
    LOW: {
      label: 'Low Priority',
      bg: 'bg-[#F3F4F6]',
      text: 'text-[#374151]',
      border: 'border-[#E5E7EB]',
      icon: <ArrowDown size={12} className="text-[#6B7280] shrink-0" />,
    },
  };

  const config = configs[priority] || configs.MEDIUM;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${config.bg} ${config.text} ${config.border} ${padding} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
