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
  const variantStyles: Record<KpiVariant, { card: string; iconBg: string; valueColor: string }> = {
    neutral: {
      card: 'border-[#E7E4DB] hover:border-[#829B86]',
      iconBg: 'bg-[#F7F5EF] text-[#193B2A]',
      valueColor: 'text-[#252D27]',
    },
    primary: {
      card: 'border-[#829B86]/40 hover:border-[#193B2A] bg-[#F7F5EF]/60',
      iconBg: 'bg-[#193B2A]/10 text-[#193B2A]',
      valueColor: 'text-[#193B2A]',
    },
    danger: {
      card: 'border-[#B94F45]/30 hover:border-[#B94F45] bg-[#FFF8F8]',
      iconBg: 'bg-[#B94F45]/10 text-[#B94F45]',
      valueColor: 'text-[#B94F45]',
    },
    success: {
      card: 'border-[#4F8064]/30 hover:border-[#4F8064] bg-[#F8FAF9]',
      iconBg: 'bg-[#4F8064]/10 text-[#4F8064]',
      valueColor: 'text-[#4F8064]',
    },
    warning: {
      card: 'border-[#C58B3B]/30 hover:border-[#C58B3B] bg-[#FFFBF5]',
      iconBg: 'bg-[#C58B3B]/10 text-[#C58B3B]',
      valueColor: 'text-[#C58B3B]',
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
      className={`bg-white border rounded-xl p-4 sm:p-5 flex items-start gap-3.5 transition-all duration-150 ${
        style.card
      } ${
        onClick
          ? 'cursor-pointer hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-[#193B2A] focus:ring-offset-1'
          : 'shadow-2xs'
      }`}
    >
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 border border-black/5 ${style.iconBg}`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <span className="text-[11px] font-semibold text-[#737A72] block tracking-wide truncate">
          {title}
        </span>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span
            className={`text-[28px] sm:text-[30px] font-bold tracking-tight font-sans tabular-nums leading-none ${style.valueColor}`}
          >
            {value}
          </span>
        </div>
        {context && (
          <p className="text-[11px] text-[#737A72] mt-1 line-clamp-1 truncate">
            {context}
          </p>
        )}
      </div>
    </div>
  );
};
