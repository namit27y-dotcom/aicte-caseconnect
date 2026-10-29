import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

export interface HorizontalBarItem {
  key: string;
  label: string;
  total: number;
  open: number;
  overdue: number;
  resolved: number;
}

interface HorizontalBarChartProps {
  items: HorizontalBarItem[];
  maxVal?: number;
  onSelectBar?: (key: string) => void;
  className?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  items,
  maxVal,
  onSelectBar,
  className = '',
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const highest = maxVal || Math.max(...items.map((i) => i.total), 1);

  return (
    <div className={`space-y-3 select-none ${className}`}>
      {items.map((item) => {
        const widthPercent = (item.total / highest) * 100;
        const openPercent = item.total > 0 ? (item.open / item.total) * 100 : 0;
        const overduePercent = item.total > 0 ? (item.overdue / item.total) * 100 : 0;
        const isHovered = hoveredKey === item.key;

        return (
          <div
            key={item.key}
            role={onSelectBar ? 'button' : undefined}
            tabIndex={onSelectBar ? 0 : undefined}
            onClick={() => onSelectBar && onSelectBar(item.key)}
            onKeyDown={(e) => {
              if (onSelectBar && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                onSelectBar(item.key);
              }
            }}
            onMouseEnter={() => setHoveredKey(item.key)}
            onMouseLeave={() => setHoveredKey(null)}
            className={`p-2.5 rounded-lg border transition-all ${
              isHovered
                ? 'bg-[#FAF8F5] border-[#1B4532] shadow-xs'
                : 'bg-white border-[#E6E1D8] hover:border-[#CBD5E1]'
            } ${onSelectBar ? 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1B4532]' : ''}`}
            aria-label={`${item.label}: ${item.total} total cases, ${item.open} open, ${item.overdue} overdue, ${item.resolved} resolved`}
          >
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-[#1F2421] truncate pr-2">
                {item.label}
              </span>
              <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                <span className="text-[#1F2421] font-bold">{item.total} total</span>
                <span className="text-[#718096]">({item.open} open)</span>
                {item.overdue > 0 && (
                  <span className="text-[#DC2626] font-semibold flex items-center gap-0.5 bg-[#FEF2F2] px-1.5 py-0.2 rounded border border-[#FECACA]">
                    <AlertTriangle size={10} />
                    {item.overdue} overdue
                  </span>
                )}
              </div>
            </div>

            {/* Proportion Bar */}
            <div className="w-full bg-[#F4F1EA] h-3.5 rounded-full overflow-hidden flex">
              {item.total > 0 ? (
                <div
                  className="h-full rounded-full flex overflow-hidden transition-all duration-300"
                  style={{ width: `${Math.max(widthPercent, 4)}%` }}
                >
                  {/* Resolved segment */}
                  {item.resolved > 0 && (
                    <div
                      className="bg-[#16A34A] h-full"
                      style={{ width: `${(item.resolved / item.total) * 100}%` }}
                      title={`Resolved: ${item.resolved}`}
                    />
                  )}
                  {/* Open on-schedule segment */}
                  {item.open - item.overdue > 0 && (
                    <div
                      className="bg-[#2563EB] h-full"
                      style={{ width: `${((item.open - item.overdue) / item.total) * 100}%` }}
                      title={`Active: ${item.open - item.overdue}`}
                    />
                  )}
                  {/* Overdue segment */}
                  {item.overdue > 0 && (
                    <div
                      className="bg-[#DC2626] h-full"
                      style={{ width: `${(item.overdue / item.total) * 100}%` }}
                      title={`Overdue: ${item.overdue}`}
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-[#F4F1EA]" />
              )}
            </div>
          </div>
        );
      })}

      {/* Screen Reader Table */}
      <div className="sr-only">
        <table>
          <caption>Bureau Workload and Overdue Statistics</caption>
          <thead>
            <tr>
              <th>Bureau</th>
              <th>Total Assigned</th>
              <th>Open</th>
              <th>Overdue</th>
              <th>Resolved</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.key}>
                <td>{i.label}</td>
                <td>{i.total}</td>
                <td>{i.open}</td>
                <td>{i.overdue}</td>
                <td>{i.resolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

