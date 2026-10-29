import React from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  legend?: React.ReactNode;
  children: React.ReactNode;
  srTable?: React.ReactNode; // Visually hidden data table for screen readers
  className?: string;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  action,
  legend,
  children,
  srTable,
  className = '',
}) => {
  return (
    <div className={`bg-white border border-[#E6E1D8] rounded-lg p-5 shadow-2xs flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 pb-3 border-b border-[#F4F1EA]">
          <div>
            <h3 className="text-sm font-bold text-[#1F2421] tracking-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-[#5C6460] mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>

        {legend && <div className="pt-3 pb-1">{legend}</div>}

        <div className="pt-3">{children}</div>
      </div>

      {/* Screen reader accessible data presentation */}
      {srTable && (
        <div className="sr-only" aria-live="polite">
          {srTable}
        </div>
      )}
    </div>
  );
};

