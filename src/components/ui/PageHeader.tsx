import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7E4DB]">
      <div>
        <h1 className="text-[26px] sm:text-[28px] font-semibold tracking-tight text-[#252D27] font-heading leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[13px] text-[#737A72] mt-1 font-sans">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
};
