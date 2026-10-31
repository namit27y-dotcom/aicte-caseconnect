import React from 'react';
import { ComplaintStatus, ComplaintPriority, UserRole } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'forest' | 'amber' | 'rust' | 'blue' | 'purple';
  status?: ComplaintStatus;
  priority?: ComplaintPriority;
  role?: UserRole;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  priority,
  role,
  className = '',
}) => {
  let effectiveVariant = variant || 'neutral';

  if (status) {
    switch (status) {
      case 'SUBMITTED':
        effectiveVariant = 'neutral';
        break;
      case 'UNDER_PROCESS':
        effectiveVariant = 'forest';
        break;
      case 'COORDINATION':
        effectiveVariant = 'amber';
        break;
      case 'RESOLUTION_REVIEW':
        effectiveVariant = 'forest';
        break;
      case 'CLOSED':
        effectiveVariant = 'neutral';
        break;
      case 'OVERDUE':
        effectiveVariant = 'rust';
        break;
    }
  } else if (priority) {
    switch (priority) {
      case 'CRITICAL':
        effectiveVariant = 'rust';
        break;
      case 'HIGH':
        effectiveVariant = 'amber';
        break;
      case 'MEDIUM':
        effectiveVariant = 'forest';
        break;
      case 'LOW':
        effectiveVariant = 'neutral';
        break;
    }
  } else if (role) {
    switch (role) {
      case 'APEX_ADMIN':
        effectiveVariant = 'rust';
        break;
      case 'BUREAU_HEAD':
        effectiveVariant = 'forest';
        break;
      case 'BUREAU_OFFICER':
        effectiveVariant = 'amber';
        break;
      case 'COMPLAINANT':
        effectiveVariant = 'neutral';
        break;
    }
  }

  const variantClasses = {
    neutral: 'bg-[#F7F5EF] text-[#252D27] border-[#E7E4DB]',
    forest: 'bg-[#193B2A]/10 text-[#193B2A] border-[#193B2A]/25',
    amber: 'bg-[#C58B3B]/10 text-[#C58B3B] border-[#C58B3B]/30',
    rust: 'bg-[#B94F45]/10 text-[#B94F45] border-[#B94F45]/30',
    blue: 'bg-[#193B2A]/10 text-[#193B2A] border-[#193B2A]/25', // No blue
    purple: 'bg-[#C5A568]/15 text-[#142B21] border-[#C5A568]/40', // Gold accent
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border font-sans select-none ${variantClasses[effectiveVariant]} ${className}`}
    >
      {children}
    </span>
  );
};
