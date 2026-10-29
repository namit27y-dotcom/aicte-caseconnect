import React, { useState } from 'react';

export interface StackedBarItem {
  key: string;
  label: string;
  total: number;
  segments: {
    key: string;
    label: string;
    count: number;
    color: string;
  }[];
}

interface StackedBarChartProps {
  items: StackedBarItem[];
  className?: string;
}

export const StackedBarChart: React.FC<StackedBarChartProps> = ({
  items,
  className = '',
}) => {
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null);

  const highest = Math.max(...items.map((i) => i.total), 1);

  return (
    <div className={`space-y-3 select-none ${className}`}>
      {items.map((item) => {
        const barWidthPercent = (item.total / highest) * 100;

        return (
          <div key={item.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-[#1F2421] truncate pr-2">
                {item.label}
              </span>
              <span className="font-mono text-[11px] font-bold text-[#1F2421]">
                {item.total} total
              </span>
            </div>

            {/* Segmented bar */}
            <div className="w-full bg-[#F4F1EA] h-4 rounded-full overflow-hidden flex">
              <div
                className="h-full rounded-full flex overflow-hidden transition-all duration-300"
                style={{ width: `${Math.max(barWidthPercent, 4)}%` }}
              >
                {item.segments.map((seg) => {
                  if (seg.count === 0) return null;
                  const segWidth = item.total > 0 ? (seg.count / item.total) * 100 : 0;
                  return (
                    <div
                      key={seg.key}
                      style={{ width: `${segWidth}%`, backgroundColor: seg.color }}
                      className="h-full transition-opacity cursor-pointer hover:opacity-85"
                      title={`${item.label} - ${seg.label}: ${seg.count}`}
                      onMouseEnter={() =>
                        setHoveredInfo(`${item.label} · ${seg.label}: ${seg.count} cases (${Math.round(segWidth)}%)`)
                      }
                      onMouseLeave={() => setHoveredInfo(null)}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {hoveredInfo && (
        <div className="text-xs font-mono text-[#1B4532] bg-[#EBF3EE] p-1.5 rounded text-center">
          {hoveredInfo}
        </div>
      )}

      {/* Screen Reader Accessible Table */}
      <div className="sr-only">
        <table>
          <caption>Cross-Bureau Breakdown by Category</caption>
          <thead>
            <tr>
              <th>Group</th>
              <th>Total</th>
              <th>Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.key}>
                <td>{item.label}</td>
                <td>{item.total}</td>
                <td>
                  {item.segments
                    .map((s) => `${s.label}: ${s.count}`)
                    .join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
