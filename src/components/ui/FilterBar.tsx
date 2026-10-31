import React from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from './Button';

interface FilterBarProps {
  children: React.ReactNode;
  activeFilterCount?: number;
  onClearAll?: () => void;
  resultSummary?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  children,
  activeFilterCount = 0,
  onClearAll,
  resultSummary,
  className = '',
}) => {
  return (
    <div
      role="region"
      aria-label="Filter toolbar"
      className={`bg-white border border-[#E7E4DB] p-3.5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs shadow-2xs ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 font-semibold text-[#4A5568] mr-1">
          <Filter size={14} className="text-[#193B2A]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-[#193B2A] text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>

        {children}

        {activeFilterCount > 0 && onClearAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            icon={<X size={12} />}
            className="text-[11px] py-1 text-[#DC2626] border-[#FECACA] hover:bg-[#FEF2F2]"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {resultSummary && (
        <div className="text-xs text-[#737A72] md:text-right shrink-0">
          {resultSummary}
        </div>
      )}
    </div>
  );
};

