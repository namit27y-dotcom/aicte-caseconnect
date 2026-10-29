import React, { useState } from 'react';

export interface DonutSegment {
  key: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  total: number;
  centerLabel?: string;
  onSelectSegment?: (key: string) => void;
  size?: number;
  className?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({
  segments,
  total,
  centerLabel = 'Total Cases',
  onSelectSegment,
  size = 200,
  className = '',
}) => {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const radius = 64;
  const strokeWidth = 24;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Build strokeDasharray and strokeDashoffset for each segment
  let accumulatedPercent = 0;
  const renderedSegments = segments.map((seg) => {
    const fraction = total > 0 ? seg.count / total : 0;
    const strokeDasharray = `${fraction * circumference} ${circumference}`;
    const strokeDashoffset = -(accumulatedPercent * circumference);
    accumulatedPercent += fraction;

    const isHovered = hoveredKey === seg.key;
    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset,
      isHovered,
    };
  });

  const activeSegment = hoveredKey ? segments.find((s) => s.key === hoveredKey) : null;

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* SVG Donut */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
          role="img"
          aria-label={`Donut chart showing ${segments.map((s) => `${s.label}: ${s.count} (${s.percentage}%)`).join(', ')}`}
        >
          {/* Base track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke="#F4F1EA"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {renderedSegments.map((seg) => {
            if (seg.count === 0) return null;
            return (
              <circle
                key={seg.key}
                cx={center}
                cy={center}
                r={radius}
                fill="transparent"
                stroke={seg.color}
                strokeWidth={seg.isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                className="transition-all duration-200 cursor-pointer focus:outline-none"
                tabIndex={onSelectSegment ? 0 : undefined}
                onMouseEnter={() => setHoveredKey(seg.key)}
                onMouseLeave={() => setHoveredKey(null)}
                onFocus={() => setHoveredKey(seg.key)}
                onBlur={() => setHoveredKey(null)}
                onClick={() => onSelectSegment && onSelectSegment(seg.key)}
                onKeyDown={(e) => {
                  if (onSelectSegment && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    onSelectSegment(seg.key);
                  }
                }}
              />
            );
          })}
        </svg>

        {/* Center Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-2xl font-bold font-sans text-[#1F2421] tabular-nums tracking-tight">
            {activeSegment ? activeSegment.count : total}
          </span>
          <span className="text-[10px] font-semibold text-[#718096] uppercase tracking-wider px-2 line-clamp-1">
            {activeSegment ? activeSegment.label : centerLabel}
          </span>
          {activeSegment && (
            <span className="text-[11px] font-medium text-[#1B4532]">
              {activeSegment.percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 w-full">
        {segments.map((seg) => (
          <button
            key={seg.key}
            type="button"
            onClick={() => onSelectSegment && onSelectSegment(seg.key)}
            onMouseEnter={() => setHoveredKey(seg.key)}
            onMouseLeave={() => setHoveredKey(null)}
            className={`flex items-center justify-between p-2 rounded-md border text-left text-xs transition-colors cursor-pointer ${
              hoveredKey === seg.key
                ? 'bg-[#FAF8F5] border-[#1B4532]'
                : 'bg-white border-[#E6E1D8] hover:bg-[#FAF8F5]'
            }`}
          >
            <div className="flex items-center gap-1.5 min-w-0 pr-1">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: seg.color }}
              />
              <span className="text-[11px] text-[#5C6460] font-medium truncate">
                {seg.label}
              </span>
            </div>
            <div className="text-[11px] font-mono font-semibold text-[#1F2421] shrink-0">
              {seg.count}{' '}
              <span className="text-[10px] font-normal text-[#94A3B8]">
                ({seg.percentage}%)
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Screen Reader Table */}
      <div className="sr-only">
        <table>
          <caption>Status Distribution Breakdown</caption>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((s) => (
              <tr key={s.key}>
                <td>{s.label}</td>
                <td>{s.count}</td>
                <td>{s.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

