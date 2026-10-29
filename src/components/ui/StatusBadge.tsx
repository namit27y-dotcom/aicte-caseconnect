import React from 'react';
import { ComplaintStatus } from '../../types';
import { 
  FileText, 
  Clock, 
  GitMerge, 
  Search, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  const configs: Record<
    ComplaintStatus,
    { label: string; bg: string; text: string; border: string; dot: string; icon: React.ReactNode }
  > = {
    SUBMITTED: {
      label: 'Submitted',
      bg: 'bg-[#EFF6FF]',
      text: 'text-[#1D4ED8]',
      border: 'border-[#BFDBFE]',
      dot: 'bg-[#3B82F6]',
      icon: <FileText size={11} className="shrink-0" />,
    },
    UNDER_PROCESS: {
      label: 'Under Process',
      bg: 'bg-[#F0F9FF]',
      text: 'text-[#0369A1]',
      border: 'border-[#BAE6FD]',
      dot: 'bg-[#0284C7]',
      icon: <Clock size={11} className="shrink-0" />,
    },
    COORDINATION: {
      label: 'In Coordination',
      bg: 'bg-[#F5F3FF]',
      text: 'text-[#6D28D9]',
      border: 'border-[#DDD6FE]',
      dot: 'bg-[#7C3AED]',
      icon: <GitMerge size={11} className="shrink-0" />,
    },
    RESOLUTION_REVIEW: {
      label: 'Resolution Review',
      bg: 'bg-[#FFFBEB]',
      text: 'text-[#B45309]',
      border: 'border-[#FDE68A]',
      dot: 'bg-[#D97706]',
      icon: <Search size={11} className="shrink-0" />,
    },
    CLOSED: {
      label: 'Closed / Disposed',
      bg: 'bg-[#F0FDF4]',
      text: 'text-[#15803D]',
      border: 'border-[#BBF7D0]',
      dot: 'bg-[#16A34A]',
      icon: <CheckCircle2 size={11} className="shrink-0" />,
    },
    OVERDUE: {
      label: 'Overdue (SLA Breached)',
      bg: 'bg-[#FEF2F2]',
      text: 'text-[#B91C1C]',
      border: 'border-[#FECACA]',
      dot: 'bg-[#DC2626]',
      icon: <AlertTriangle size={11} className="shrink-0" />,
    },
  };

  const config = configs[status] || configs.UNDER_PROCESS;
  const padding = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md tracking-normal ${config.bg} ${config.text} ${config.border} ${padding} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} shrink-0`} aria-hidden="true" />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
