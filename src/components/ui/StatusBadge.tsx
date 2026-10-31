import React from 'react';
import { 
  Clock, 
  GitMerge, 
  CheckCircle2, 
  AlertCircle, 
  FileText
} from 'lucide-react';
import { ComplaintStatus } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configMap: Record<
    string,
    { label: string; icon: React.ReactNode; bg: string; text: string; border: string; dot: string }
  > = {
    SUBMITTED: {
      label: 'Awaiting Review',
      icon: <FileText size={12} className="shrink-0" />,
      bg: 'bg-[#F7F5EF]',
      text: 'text-[#193B2A]',
      border: 'border-[#829B86]/40',
      dot: 'bg-[#829B86]',
    },
    ASSIGNED: {
      label: 'Assigned',
      icon: <Clock size={12} className="shrink-0" />,
      bg: 'bg-[#F7F5EF]',
      text: 'text-[#193B2A]',
      border: 'border-[#829B86]/50',
      dot: 'bg-[#193B2A]',
    },
    UNDER_PROCESS: {
      label: 'In Progress',
      icon: <Clock size={12} className="shrink-0" />,
      bg: 'bg-[#193B2A]/10',
      text: 'text-[#193B2A]',
      border: 'border-[#193B2A]/20',
      dot: 'bg-[#193B2A]',
    },
    COORDINATION: {
      label: 'Coordination',
      icon: <GitMerge size={12} className="shrink-0" />,
      bg: 'bg-[#C5A568]/15',
      text: 'text-[#142B21]',
      border: 'border-[#C5A568]/40',
      dot: 'bg-[#C5A568]',
    },
    RESOLUTION_REVIEW: {
      label: 'Resolution Review',
      icon: <AlertCircle size={12} className="shrink-0" />,
      bg: 'bg-[#C58B3B]/10',
      text: 'text-[#C58B3B]',
      border: 'border-[#C58B3B]/30',
      dot: 'bg-[#C58B3B]',
    },
    CLOSED: {
      label: 'Disposed',
      icon: <CheckCircle2 size={12} className="shrink-0" />,
      bg: 'bg-[#4F8064]/10',
      text: 'text-[#4F8064]',
      border: 'border-[#4F8064]/30',
      dot: 'bg-[#4F8064]',
    },
    OVERDUE: {
      label: 'Overdue SLA',
      icon: <AlertCircle size={12} className="shrink-0" />,
      bg: 'bg-[#B94F45]/10',
      text: 'text-[#B94F45]',
      border: 'border-[#B94F45]/30',
      dot: 'bg-[#B94F45]',
    },
  };

  const config = configMap[status] || {
    label: status,
    icon: <FileText size={12} className="shrink-0" />,
    bg: 'bg-[#F7F5EF]',
    text: 'text-[#252D27]',
    border: 'border-[#E7E4DB]',
    dot: 'bg-[#737A72]',
  };

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1.5'
      : 'px-2.5 py-1 text-xs gap-1.5 font-medium';

  return (
    <span
      className={`inline-flex items-center rounded-md border font-sans select-none ${sizeClasses} ${config.bg} ${config.text} ${config.border}`}
      title={`Case Status: ${config.label}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dot}`} aria-hidden="true" />
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};
