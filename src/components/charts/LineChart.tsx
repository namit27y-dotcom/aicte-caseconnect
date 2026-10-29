import React, { useState } from 'react';
import { EmptyState } from '../ui/EmptyState';
import { TrendingUp } from 'lucide-react';

export interface TrendDataPoint {
  label: string; // e.g. "Sep 2026", "Oct 2026"
  intake: number;
  resolved: number;
}

interface LineChartProps {
  data: TrendDataPoint[];
  height?: number;
  className?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 220,
  className = '',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // When fewer than 2 buckets exist, show truthful empty state
  if (!data || data.length < 2) {
    return (
      <EmptyState
        icon={<TrendingUp size={28} className="text-[#94A3B8]" />}
        title="Insufficient Historical Data"
        description="At least two consecutive calendar periods are required to compute truthful intake versus resolution trends."
        className="py-8"
      />
    );
  }

  const maxVal = Math.max(...data.map((d) => Math.max(d.intake, d.resolved)), 5);
  const paddingX = 45;
  const paddingY = 30;
  const chartWidth = 500;
  const chartHeight = height;

  const innerWidth = chartWidth - paddingX * 2;
  const innerHeight = chartHeight - paddingY * 2;

  const pointsIntake = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * innerWidth;
    const y = paddingY + innerHeight - (d.intake / maxVal) * innerHeight;
    return { x, y, val: d.intake, label: d.label };
  });

  const pointsResolved = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * innerWidth;
    const y = paddingY + innerHeight - (d.resolved / maxVal) * innerHeight;
    return { x, y, val: d.resolved, label: d.label };
  });

  const linePathIntake = pointsIntake.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
    ''
  );

  const linePathResolved = pointsResolved.reduce(
    (acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`,
    ''
  );

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-xs mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#2563EB] inline-block" />
          <span className="text-[#4B5563] font-medium">New Intake</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#16A34A] inline-block" />
          <span className="text-[#4B5563] font-medium">Disposed / Closed</span>
        </div>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label={`Trend chart showing complaint intake versus disposal across ${data.length} periods`}
        >
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingY + innerHeight * (1 - ratio);
            const val = Math.round(maxVal * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="#F3F4F6"
                  strokeWidth={1}
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="10"
                  fill="#9CA3AF"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Lines */}
          <path
            d={linePathIntake}
            fill="none"
            stroke="#2563EB"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={linePathResolved}
            fill="none"
            stroke="#16A34A"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Intake Points */}
          {pointsIntake.map((p, i) => (
            <circle
              key={`in-${i}`}
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? 5 : 3.5}
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}

          {/* Resolved Points */}
          {pointsResolved.map((p, i) => (
            <circle
              key={`res-${i}`}
              cx={p.x}
              cy={p.y}
              r={hoveredIdx === i ? 5 : 3.5}
              fill="#16A34A"
              stroke="#FFFFFF"
              strokeWidth={1.5}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            />
          ))}

          {/* X Axis labels */}
          {data.map((d, i) => {
            const x = paddingX + (i / (data.length - 1)) * innerWidth;
            return (
              <text
                key={i}
                x={x}
                y={chartHeight - 8}
                textAnchor="middle"
                fontSize="10"
                fill="#6B7280"
                className="font-medium"
              >
                {d.label}
              </text>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredIdx !== null && (
          <div className="mt-2 p-2 bg-[#1F2421] text-white rounded-md text-xs flex items-center justify-between font-mono">
            <span className="font-sans font-semibold">{data[hoveredIdx].label}:</span>
            <div className="flex gap-4">
              <span className="text-[#93C5FD]">Intake: {data[hoveredIdx].intake}</span>
              <span className="text-[#86EFAC]">Closed: {data[hoveredIdx].resolved}</span>
            </div>
          </div>
        )}
      </div>

      {/* Screen Reader Table */}
      <div className="sr-only">
        <table>
          <caption>Monthly Intake versus Resolution History</caption>
          <thead>
            <tr>
              <th>Period</th>
              <th>New Intake</th>
              <th>Closed Cases</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label}>
                <td>{d.label}</td>
                <td>{d.intake}</td>
                <td>{d.resolved}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

