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
  // Determine variant based on semantic prop if provided
  let effectiveVariant = variant || 'neutral';

  if (status) {
    switch (status) {
      case 'SUBMITTED':
        effectiveVariant = 'neutral';
        break;
      case 'UNDER_PROCESS':
        effectiveVariant = 'blue';
        break;
      case 'COORDINATION':
        effectiveVariant = 'purple';
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
        effectiveVariant = 'blue';
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
        effectiveVariant = 'purple';
        break;
      case 'BUREAU_OFFICER':
        effectiveVariant = 'forest';
        break;
      case 'COMPLAINANT':
        effectiveVariant = 'neutral';
        break;
    }
  }

  const variantClasses = {
    neutral: 'bg-[#F2EFE9] text-[#4A5568] border-[#E2DDD3]',
    forest: 'bg-[#EBF3EE] text-[#1B4532] border-[#CDE1D5]',
    amber: 'bg-[#FDF6ED] text-[#9A621D] border-[#F2DEBF]',
    rust: 'bg-[#FDF0F0] text-[#9B2226] border-[#F5C2C4]',
    blue: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    purple: 'bg-[#F5F3FF] text-[#6D28D9] border-[#DDD6FE]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium border rounded-sm tracking-wide ${variantClasses[effectiveVariant]} ${className}`}
    >
      {children}
    </span>
  );
};
