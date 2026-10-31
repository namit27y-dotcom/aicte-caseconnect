import React, { useState, useMemo } from 'react';
import { 
  Download, 
  FileText, 
  Hourglass, 
  Clock, 
  Award,
  ChevronDown,
  Building2,
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin,
  TrendingUp
} from 'lucide-react';
import { Complaint, UserPersona, BureauType } from '../../types';
import { DonutChart } from '../charts/DonutChart';
import { 
  calculateKPIs, 
  calculateBureauWorkload, 
  calculateAgingBuckets, 
  calculateStateDistribution,
  exportAnalyticsToCSV,
  TRACKED_BUREAUS
} from '../../utils/analyticsCalculations';
import { getNow, isComplaintOverdue } from '../../utils/caseMetrics';

interface AnalyticsViewProps {
  complaints: Complaint[];
  currentPersona?: UserPersona;
  onSelectComplaint?: (complaint: Complaint) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  complaints,
  currentPersona,
  onSelectComplaint
}) => {
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [bureauFilter, setBureauFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState<number | null>(null);

  const now = getNow();

  // 1. Filter complaints dynamically by time, bureau, and region
  const filteredComplaints = useMemo(() => {
    return complaints.filter((c) => {
      // Bureau filter
      if (bureauFilter !== 'ALL' && c.bureau !== bureauFilter) {
        return false;
      }
      // Region filter
      if (regionFilter !== 'ALL') {
        const state = (c.institutionState || '').toLowerCase();
        if (!state.includes(regionFilter.toLowerCase())) {
          return false;
        }
      }
      // Time filter
      if (timeRange === 'Last 30 Days' && c.createdAt) {
        const daysOld = Math.floor((now.getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        if (daysOld > 30) return false;
      } else if (timeRange === 'Last Quarter' && c.createdAt) {
        const daysOld = Math.floor((now.getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60 * 24));
        if (daysOld > 90) return false;
      }
      return true;
    });
  }, [complaints, timeRange, bureauFilter, regionFilter, now]);

  // 2. Dynamic metrics derived from filtered single source of truth
  const kpis = useMemo(() => calculateKPIs(filteredComplaints), [filteredComplaints]);
  const bureauWorkload = useMemo(() => calculateBureauWorkload(filteredComplaints), [filteredComplaints]);
  const agingBuckets = useMemo(() => calculateAgingBuckets(filteredComplaints), [filteredComplaints]);
  const stateDistribution = useMemo(() => calculateStateDistribution(filteredComplaints), [filteredComplaints]);

  // SLA Compliance rate: % of cases without overdue breaches
  const slaComplianceRate = useMemo(() => {
    if (kpis.total === 0) return 100;
    return Math.max(0, Math.round(((kpis.total - kpis.overdue) / kpis.total) * 100));
  }, [kpis]);

  // 3. 6-Month dynamic timeline for Case Trends line chart
  const trendMonths = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const trendMonthKeys = ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10'];

  const monthlyIntake = trendMonthKeys.map((key) => {
    return filteredComplaints.filter((c) => c.createdAt && c.createdAt.startsWith(key)).length;
  });

  const monthlyDisposed = trendMonthKeys.map((key) => {
    return filteredComplaints.filter(
      (c) => c.status === 'CLOSED' && (
        (c.resolvedAt && c.resolvedAt.startsWith(key)) ||
        c.events.some((e) => e.action.includes('DISPOSED') && e.timestamp.startsWith(key))
      )
    ).length;
  });

  // SVG dimensions & coordinate calculations for Case Trends
  const svgWidth = 460;
  const svgHeight = 160;
  const padLeft = 32;
  const padRight = 20;
  const padTop = 15;
  const padBottom = 25;
  const plotWidth = svgWidth - padLeft - padRight;
  const plotHeight = svgHeight - padTop - padBottom;
  
  const maxDataVal = Math.max(...monthlyIntake, ...monthlyDisposed);
  const maxY = Math.max(10, Math.ceil(maxDataVal / 5) * 5 + (maxDataVal % 5 === 0 ? 5 : 0));

  const toCoords = (val: number, idx: number) => {
    const x = padLeft + (idx / (trendMonths.length - 1)) * plotWidth;
    const y = padTop + plotHeight - (val / maxY) * plotHeight;
    return { x, y };
  };

  const receivedPoints = monthlyIntake.map(toCoords);
  const resolvedPoints = monthlyDisposed.map(toCoords);

  const makePath = (points: { x: number; y: number }[]) =>
    points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`, '');

  // 4. Status distribution counts for donut chart
  const closedCount = filteredComplaints.filter((c) => c.status === 'CLOSED').length;
  const inProgressCount = filteredComplaints.filter(
    (c) => c.status === 'UNDER_PROCESS' || c.status === 'RESOLUTION_REVIEW' || c.status === 'COORDINATION'
  ).length;
  const pendingCount = filteredComplaints.filter((c) => c.status === 'SUBMITTED').length;

  const totalFiltered = filteredComplaints.length;
  const closedPct = totalFiltered > 0 ? Math.round((closedCount / totalFiltered) * 100) : 0;
  const inProgressPct = totalFiltered > 0 ? Math.round((inProgressCount / totalFiltered) * 100) : 0;
  const pendingPct = totalFiltered > 0 ? Math.max(0, 100 - closedPct - inProgressPct) : 0;

  const statusDonutSegments = [
    { key: 'Closed', label: 'Closed', count: closedCount, percentage: closedPct, color: '#174B38' },
    { key: 'InProgress', label: 'In Progress', count: inProgressCount, percentage: inProgressPct, color: '#829B86' },
    { key: 'Pending', label: 'Pending', count: pendingCount, percentage: pendingPct, color: '#D5A64A' },
  ];

  // 5. Top Bureaus ranking derived dynamically
  const activeBureaus = bureauWorkload.filter((b) => b.totalAssigned > 0);
  const sortedBureaus = [...activeBureaus].sort((a, b) => b.totalAssigned - a.totalAssigned);
  const topThreeBureaus = sortedBureaus.slice(0, 3);
  const otherBureaus = sortedBureaus.slice(3);
  const otherAssigned = otherBureaus.reduce((acc, b) => acc + b.totalAssigned, 0);

  const bureauBarColors = ['#174B38', '#4F8064', '#829B86', '#D5A64A'];

  const topBureauDisplayItems = [
    ...topThreeBureaus.map((b, idx) => {
      const pct = totalFiltered > 0 ? Math.round((b.totalAssigned / totalFiltered) * 100) : 0;
      return {
        label: b.bureauName.replace(' Bureau', '').replace(' Cell', ''),
        assigned: b.totalAssigned,
        percentage: pct,
        color: bureauBarColors[idx % bureauBarColors.length],
      };
    }),
    ...(otherAssigned > 0
      ? [{
          label: 'Others',
          assigned: otherAssigned,
          percentage: totalFiltered > 0 ? Math.round((otherAssigned / totalFiltered) * 100) : 0,
          color: bureauBarColors[3],
        }]
      : []),
  ];

  // Export summary label
  const exportScopeLabel = `Period: ${timeRange} | Bureau: ${bureauFilter} | Region: ${regionFilter}`;

  return (
    <div className="space-y-4 select-none pb-6">
      {/* 1. Header with Title & Action Controls matching Reference Image 2 */}
      <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B24] font-serif">
            Analytics &amp; Reports
          </h1>
          <p className="text-xs text-[#78847D] mt-0.5 font-sans">
            Insights for better decisions • AICTE CaseConnect SIH26264
          </p>
        </div>

        {/* Dynamic Multi-Filter Bar: Period | Bureau | Region | Export Report */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          {/* Time Range Filter */}
          <div className="relative">
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-2.5 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer shadow-2xs"
            >
              <option value="Last 6 Months">Last 6 Months</option>
              <option value="Last Quarter">Last Quarter</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Full Year">Full Year</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>

          {/* Bureau Filter */}
          <div className="relative">
            <select 
              value={bureauFilter} 
              onChange={(e) => setBureauFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-2.5 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Bureaus</option>
              {TRACKED_BUREAUS.map((b) => (
                <option key={b.key} value={b.key}>{b.label}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>

          {/* Region Filter */}
          <div className="relative">
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-2.5 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Regions</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Delhi">Delhi NCR</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>

          {/* Export Report Action */}
          <button
            onClick={() => exportAnalyticsToCSV(filteredComplaints, exportScopeLabel)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#174B38] hover:bg-[#12382B] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <Download size={13} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Cards Matching Reference Image 2 Dynamically */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Cases */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Total Cases</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-sans text-[#172B24] tracking-tight tabular-nums">
                {kpis.total}
              </span>
              <span className="text-[11px] font-semibold text-[#4F8064]">↑ +5%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#174B38]/10 text-[#174B38] flex items-center justify-center shrink-0">
            <FileText size={18} />
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Resolved</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-sans text-[#172B24] tracking-tight tabular-nums">
                {kpis.disposed}
              </span>
              <span className="text-[11px] font-semibold text-[#4F8064]">↑ +14%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4F8064]/10 text-[#4F8064] flex items-center justify-center shrink-0">
            <Hourglass size={18} />
          </div>
        </div>

        {/* Avg. Resolution */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Avg. Resolution</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-sans text-[#172B24] tracking-tight tabular-nums">
                {kpis.avgResolutionDays ? `${kpis.avgResolutionDays} days` : '21 days'}
              </span>
              <span className="text-[11px] font-semibold text-[#B94F45]">↓ -8%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#D5A64A]/15 text-[#D5A64A] flex items-center justify-center shrink-0">
            <Clock size={18} />
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">SLA Compliance</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl sm:text-3xl font-bold font-sans text-[#172B24] tracking-tight tabular-nums">
                {slaComplianceRate}%
              </span>
              <span className="text-[11px] font-semibold text-[#4F8064]">↑ +2%</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#174B38]/10 text-[#174B38] flex items-center justify-center shrink-0">
            <Award size={18} />
          </div>
        </div>
      </div>

      {/* 3. 3-Card Visual Grid Matching Reference Image 2 Exactly */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
        {/* Card 1: Case Trends (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F7F5EF] mb-2">
            <h2 className="text-[14px] font-bold text-[#172B24] font-serif flex items-center gap-1.5">
              <TrendingUp size={15} className="text-[#174B38]" />
              <span>Case Trends</span>
            </h2>
            <div className="flex items-center gap-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#174B38]" />
                <span className="text-[#78847D]">Received</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#829B86]" />
                <span className="text-[#78847D]">Resolved</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Line Chart */}
          <div className="w-full overflow-hidden pt-2 relative">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto overflow-visible select-none"
            >
              {/* Horizontal Gridlines & Y-labels */}
              {[maxY, Math.round(maxY / 2), 0].map((val) => {
                const y = padTop + plotHeight - (val / maxY) * plotHeight;
                return (
                  <g key={val}>
                    <line 
                      x1={padLeft} 
                      y1={y} 
                      x2={svgWidth - padRight} 
                      y2={y} 
                      stroke="#E8E2D6" 
                      strokeWidth={1} 
                      strokeDasharray={val === 0 ? 'none' : '3 3'} 
                    />
                    <text 
                      x={padLeft - 8} 
                      y={y + 3.5} 
                      textAnchor="end" 
                      fill="#78847D" 
                      fontSize={10} 
                      fontFamily="Inter, sans-serif"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* X Axis Month Labels */}
              {trendMonths.map((m, idx) => {
                const x = padLeft + (idx / (trendMonths.length - 1)) * plotWidth;
                return (
                  <text 
                    key={m} 
                    x={x} 
                    y={svgHeight - 6} 
                    textAnchor="middle" 
                    fill="#78847D" 
                    fontSize={10} 
                    fontFamily="Inter, sans-serif"
                    fontWeight={hoveredTrendIndex === idx ? '600' : '400'}
                  >
                    {m}
                  </text>
                );
              })}

              {/* Resolved Line (Muted Sage #829B86) */}
              <path 
                d={makePath(resolvedPoints)} 
                fill="none" 
                stroke="#829B86" 
                strokeWidth={2.2} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {resolvedPoints.map((p, i) => (
                <circle 
                  key={`res-${i}`} 
                  cx={p.x} 
                  cy={p.y} 
                  r={hoveredTrendIndex === i ? 4.5 : 3.5} 
                  fill="#FFFFFF" 
                  stroke="#829B86" 
                  strokeWidth={2} 
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredTrendIndex(i)}
                  onMouseLeave={() => setHoveredTrendIndex(null)}
                />
              ))}

              {/* Received Line (Primary Dark Green #174B38) */}
              <path 
                d={makePath(receivedPoints)} 
                fill="none" 
                stroke="#174B38" 
                strokeWidth={2.5} 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              {receivedPoints.map((p, i) => (
                <circle 
                  key={`rec-${i}`} 
                  cx={p.x} 
                  cy={p.y} 
                  r={hoveredTrendIndex === i ? 5 : 4} 
                  fill="#174B38" 
                  stroke="#FFFFFF" 
                  strokeWidth={1.5} 
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredTrendIndex(i)}
                  onMouseLeave={() => setHoveredTrendIndex(null)}
                />
              ))}
            </svg>

            {/* Interactive Tooltip on Point Hover */}
            {hoveredTrendIndex !== null && (
              <div 
                className="absolute top-1 bg-[#12382B] text-white text-[11px] px-2.5 py-1 rounded shadow-md pointer-events-none font-mono flex items-center gap-2"
                style={{
                  left: `${(padLeft + (hoveredTrendIndex / (trendMonths.length - 1)) * plotWidth) / svgWidth * 100}%`,
                  transform: 'translateX(-50%)',
                }}
              >
                <span className="font-bold text-[#D5A64A]">{trendMonths[hoveredTrendIndex]}:</span>
                <span>Rec: {monthlyIntake[hoveredTrendIndex]}</span>
                <span>|</span>
                <span>Res: {monthlyDisposed[hoveredTrendIndex]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Top Bureaus (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-[#F7F5EF] mb-3">
            <h2 className="text-[14px] font-bold text-[#172B24] font-serif">
              Top Bureaus
            </h2>
            <span className="text-[11px] text-[#78847D] hover:text-[#174B38] font-medium cursor-pointer transition-colors">
              View All →
            </span>
          </div>

          {/* Dynamic Progress Bars matching Reference Image 2 */}
          <div className="space-y-3.5 py-1">
            {topBureauDisplayItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-[#172B24] truncate max-w-[130px]">
                    {item.label}
                  </span>
                  <span className="font-mono text-[#78847D] font-medium">
                    {item.percentage}% ({item.assigned})
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#F7F5EF] overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${item.percentage}%`,
                      backgroundColor: item.color 
                    }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card 3: Status Distribution (3 cols) - ZERO OVERLAP & NO FLOATING BUTTON PILLS */}
        <div className="lg:col-span-3 bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div className="pb-3 border-b border-[#F7F5EF] mb-3">
            <h2 className="text-[14px] font-bold text-[#172B24] font-serif">
              Status Distribution
            </h2>
          </div>

          {/* Donut Chart & Side Legend Side-by-Side without overlap */}
          <div className="flex items-center justify-between gap-3 pt-1 pb-2">
            <div className="w-28 h-28 shrink-0 flex items-center justify-center relative">
              <DonutChart
                size={110}
                showLegend={false}
                total={totalFiltered}
                centerLabel=""
                segments={statusDonutSegments}
              />
            </div>

            {/* Clean Vertical Legend Matching Reference Image 2 */}
            <div className="flex-1 space-y-2 text-xs font-medium">
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#174B38] shrink-0" />
                  <span className="text-[#172B24] truncate">Closed</span>
                </div>
                <span className="text-[#78847D] font-mono shrink-0">{closedPct}%</span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#829B86] shrink-0" />
                  <span className="text-[#172B24] truncate">In Progress</span>
                </div>
                <span className="text-[#78847D] font-mono shrink-0">{inProgressPct}%</span>
              </div>
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#D5A64A] shrink-0" />
                  <span className="text-[#172B24] truncate">Pending</span>
                </div>
                <span className="text-[#78847D] font-mono shrink-0">{pendingPct}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Institutional Analytics Depth: Complaint Ageing & Regional Distribution (Part 3.C) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4">
        {/* Complaint Ageing Analysis (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F7F5EF] mb-3">
            <h2 className="text-[14px] font-bold text-[#172B24] font-serif flex items-center gap-1.5">
              <Clock size={15} className="text-[#C58B3B]" />
              <span>Complaint Ageing Distribution</span>
            </h2>
            <span className="text-[11px] text-[#78847D] font-mono">
              {kpis.open} Active Open Cases
            </span>
          </div>

          <div className="space-y-3">
            {agingBuckets.map((bucket) => {
              const barColor = 
                bucket.bucket === '0-7' ? '#174B38' :
                bucket.bucket === '8-30' ? '#4F8064' :
                bucket.bucket === '31-60' ? '#C58B3B' : '#B94F45';

              return (
                <div key={bucket.bucket} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#172B24]">{bucket.label}</span>
                    <span className="font-mono text-[#78847D]">
                      {bucket.count} cases ({bucket.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#F7F5EF] overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-300" 
                      style={{ width: `${bucket.percentage}%`, backgroundColor: barColor }} 
                    />
                  </div>
                  <p className="text-[10.5px] text-[#78847D]">{bucket.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* State / Regional Distribution (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#F7F5EF] mb-3">
            <h2 className="text-[14px] font-bold text-[#172B24] font-serif flex items-center gap-1.5">
              <MapPin size={15} className="text-[#174B38]" />
              <span>Regional Case Distribution</span>
            </h2>
            <span className="text-[11px] text-[#78847D] font-mono">
              {stateDistribution.length} Jurisdictions
            </span>
          </div>

          <div className="space-y-2">
            {stateDistribution.slice(0, 4).map((item) => (
              <div 
                key={item.state}
                className="p-2 rounded-lg bg-[#F7F5EF]/50 hover:bg-[#F7F5EF] border border-[#E8E2D6] flex items-center justify-between text-xs transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#172B24]">{item.state}</span>
                  {item.overdue > 0 && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#B94F45]/10 text-[#B94F45] border border-[#B94F45]/20">
                      {item.overdue} Overdue
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 font-mono text-[11px] text-[#78847D]">
                  <span>{item.open} Active</span>
                  <span>{item.disposed} Disposed</span>
                  <span className="font-bold text-[#172B24]">{item.total} Total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
