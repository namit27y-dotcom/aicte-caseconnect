import React, { useState } from 'react';

export interface BarChartItem {
  key: string;
  label: string;
  value: number;
  subtext?: string;
  color?: string;
}

interface BarChartProps {
  items: BarChartItem[];
  height?: number;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  items,
  height = 180,
  className = '',
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const maxVal = Math.max(...items.map((i) => i.value), 1);

  return (
    <div className={`w-full select-none ${className}`}>
      <div
        className="flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-[#E6E1D8]"
        style={{ height }}
      >
        {items.map((item) => {
          const barHeightPercent = maxVal > 0 ? (item.value / maxVal) * 100 : 0;
          const isHovered = hoveredKey === item.key;
          const barColor = item.color || '#1B4532';

          return (
            <div
              key={item.key}
              className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
              onMouseEnter={() => setHoveredKey(item.key)}
              onMouseLeave={() => setHoveredKey(null)}
            >
              {/* Value label on top of bar */}
              <span
                className={`text-[11px] font-mono font-bold mb-1 transition-colors ${
                  isHovered ? 'text-[#1B4532]' : 'text-[#718096]'
                }`}
              >
                {item.value}
              </span>

              {/* Bar */}
              <div className="w-full max-w-[42px] bg-[#F4F1EA] rounded-t-sm h-full flex items-end">
                <div
                  className="w-full rounded-t-sm transition-all duration-300"
                  style={{
                    height: `${Math.max(barHeightPercent, 4)}%`,
                    backgroundColor: isHovered ? '#154636' : barColor,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* X axis labels */}
      <div className="flex items-start justify-between gap-3 pt-2 px-2 text-center">
        {items.map((item) => (
          <div key={item.key} className="flex-1 min-w-0">
            <span className="text-[11px] font-semibold text-[#1F2421] block truncate">
              {item.label}
            </span>
            {item.subtext && (
              <span className="text-[10px] text-[#718096] block truncate">
                {item.subtext}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Screen reader table */}
      <div className="sr-only">
        <table>
          <caption>Grievance Distribution Data</caption>
          <thead>
            <tr>
              <th>Bucket / Category</th>
              <th>Count</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i) => (
              <tr key={i.key}>
                <td>{i.label}</td>
                <td>{i.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

