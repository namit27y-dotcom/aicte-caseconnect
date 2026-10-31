import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  children,
  className = '',
}) => {
  return (
    <div
      className={`bg-white border border-[#E7E4DB] rounded-xl p-5 shadow-2xs flex flex-col justify-between ${className}`}
    >
      <div className="flex items-start justify-between gap-4 pb-3 mb-3 border-b border-[#F7F5EF]">
        <div>
          <h2 className="text-[17px] font-semibold text-[#252D27] tracking-tight font-heading">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[12px] text-[#737A72] mt-0.5 font-sans">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>

      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
};
