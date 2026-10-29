import React from 'react';

export type KpiVariant = 'neutral' | 'primary' | 'danger' | 'success' | 'warning';

interface KpiCardProps {
  title: string;
  value: number | string;
  context?: string;
  icon: React.ReactNode;
  variant?: KpiVariant;
  onClick?: () => void;
  ariaLabel?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  context,
  icon,
  variant = 'neutral',
  onClick,
  ariaLabel,
}) => {
  const variantStyles = {
    neutral: {
      card: 'border-[#E6E1D8] hover:border-[#CBD5E1]',
      iconBg: 'bg-[#F4F1EA] text-[#1F2421]',
      valueColor: 'text-[#1F2421]',
    },
    primary: {
      card: 'border-[#BFDBFE] hover:border-[#93C5FD] bg-[#F8FAFF]',
      iconBg: 'bg-[#EFF6FF] text-[#1D4ED8]',
      valueColor: 'text-[#1D4ED8]',
    },
    danger: {
      card: 'border-[#FECACA] hover:border-[#F87171] bg-[#FFFBFB]',
      iconBg: 'bg-[#FEF2F2] text-[#DC2626]',
      valueColor: 'text-[#DC2626]',
    },
    success: {
      card: 'border-[#BBF7D0] hover:border-[#86EFAC] bg-[#FBFDFB]',
      iconBg: 'bg-[#F0FDF4] text-[#16A34A]',
      valueColor: 'text-[#16A34A]',
    },
    warning: {
      card: 'border-[#FDE68A] hover:border-[#FCD34D] bg-[#FFFDF7]',
      iconBg: 'bg-[#FFFBEB] text-[#D97706]',
      valueColor: 'text-[#D97706]',
    },
  };

  const style = variantStyles[variant];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel || `${title}: ${value}${context ? ` (${context})` : ''}`}
      className={`bg-white border rounded-lg p-5 flex items-start gap-4 transition-all duration-150 ${
        style.card
      } ${
        onClick
          ? 'cursor-pointer hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#1B4532] focus:ring-offset-1'
          : 'shadow-xs'
      }`}
    >
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border border-black/5 ${style.iconBg}`}
      >
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold text-[#5C6460] uppercase tracking-wider block">
          {title}
        </span>
        <div className="mt-1 flex items-baseline gap-2">
          <span
            className={`text-3xl font-bold font-sans tracking-tight tabular-nums ${style.valueColor}`}
          >
            {value}
          </span>
        </div>
        {context && (
          <p className="text-xs text-[#718096] mt-1 font-medium leading-tight">
            {context}
          </p>
        )}
      </div>
    </div>
  );
};
