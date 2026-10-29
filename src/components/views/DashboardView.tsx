import React from 'react';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowRight, 
  Calendar, 
  Users, 
  PieChart, 
  FolderKanban,
  Check,
  Building,
  GraduationCap,
  Scale,
  ReceiptText
} from 'lucide-react';
import { SYNTHETIC_DASHBOARD_METRICS, SYNTHETIC_COMPLAINTS } from '../../data/syntheticData';
import { Complaint, UserPersona } from '../../types';

interface DashboardViewProps {
  currentPersona: UserPersona;
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateTab: (tab: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentPersona,
  onSelectComplaint,
  onNavigateTab,
}) => {
  const metrics = SYNTHETIC_DASHBOARD_METRICS;
  const recentComplaints = SYNTHETIC_COMPLAINTS.slice(0, 5);

  // Donut chart geometry calculations for 100 total
  // Radius = 62, Circumference = 2 * PI * 62 = ~389.56
  const radius = 62;
  const circumference = 2 * Math.PI * radius;

  // Exact angles/offsets for the 6 segments in order:
  // Submitted: 28% (#3B82F6)
  // Under Process: 26% (#06B6D4)
  // Coordination: 12% (#8B5CF6)
  // Resolution Review: 8% (#F59E0B)
  // Closed: 14% (#10B981)
  // Overdue: 12% (#EF4444)
  const segments = [
    { label: 'Submitted', count: 28, percentage: 28, color: '#3B82F6' },
    { label: 'Under Process', count: 26, percentage: 26, color: '#06B6D4' },
    { label: 'Coordination', count: 12, percentage: 12, color: '#8B5CF6' },
    { label: 'Resolution Review', count: 8, percentage: 8, color: '#F59E0B' },
    { label: 'Closed', count: 14, percentage: 14, color: '#10B981' },
    { label: 'Overdue', count: 12, percentage: 12, color: '#EF4444' },
  ];

  let cumulativePercent = 0;
  const chartSegments = segments.map((seg) => {
    const strokeDasharray = `${(seg.percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -((cumulativePercent / 100) * circumference);
    cumulativePercent += seg.percentage;
    return {
      ...seg,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  return (
    <div className="space-y-5 select-none">
      {/* 1. Welcome Section & Today Date Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-xs font-medium text-[#475569]">Welcome back,</span>
          </div>
          <h2 className="text-[25px] font-bold tracking-tight text-[#0F172A] mt-0.5 font-sans">
            {currentPersona.name}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Here's what's happening with institution-related complaints today.
          </p>
        </div>

        {/* Date / Time Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0 shadow-2xs">
          <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#475569] border border-[#EDF2F7]">
            <Calendar size={17} strokeWidth={1.8} />
          </div>
          <div className="leading-tight">
            <span className="text-[11px] text-[#64748B] block">Today</span>
            <span className="text-xs font-semibold text-[#0F172A]">
              29 Oct 2026, 11:42 AM
            </span>
          </div>
        </div>
      </div>

      {/* 2. Four Metric Cards in One Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Complaints */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-4 hover:border-[#CBD5E1] transition-all cursor-pointer shadow-2xs"
        >
          <div className="w-12 h-12 rounded-full bg-[#EAF7EE] border border-[#CFEBD6] flex items-center justify-center text-[#155836] shrink-0">
            <FileText size={20} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-[#475569] block">
              Total Complaints
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-sans text-[#0F172A] tabular-nums tracking-tight">
                100
              </span>
              <span className="text-[11px] font-semibold text-[#16A34A] flex items-center">
                <ArrowUpRight size={13} /> +5% vs last month
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] block mt-1">
              Across all bureaus & cells
            </span>
          </div>
        </div>

        {/* Card 2: Open Complaints */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-4 hover:border-[#CBD5E1] transition-all cursor-pointer shadow-2xs"
        >
          <div className="w-12 h-12 rounded-full bg-[#3B82F6] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Clock size={20} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-[#475569] block">
              Open Complaints
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-sans text-[#0F172A] tabular-nums tracking-tight">
                68
              </span>
              <span className="text-[11px] font-semibold text-[#16A34A] flex items-center">
                <ArrowUpRight size={13} /> +3%
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] block mt-1">
              Under investigation or coordination
            </span>
          </div>
        </div>

        {/* Card 3: Overdue Complaints (Red accent & border) */}
        <div
          onClick={() => onNavigateTab('deadlines')}
          className="bg-white border border-[#FECACA] rounded-xl p-5 flex items-start gap-4 hover:border-[#F87171] transition-all cursor-pointer shadow-2xs"
        >
          <div className="w-12 h-12 rounded-full bg-[#DC2626] flex items-center justify-center text-white shrink-0 shadow-xs">
            <AlertTriangle size={20} strokeWidth={1.8} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-[#475569] block">
              Overdue Complaints
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-sans text-[#DC2626] tabular-nums tracking-tight">
                12
              </span>
              <span className="text-[11px] font-semibold text-[#DC2626] flex items-center">
                <span className="mr-0.5">ㅜ</span> +2%
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] block mt-1">
              SLA exceeded / at risk
            </span>
          </div>
        </div>

        {/* Card 4: Disposed Cases */}
        <div
          onClick={() => onNavigateTab('complaints')}
          className="bg-white border border-[#E5E7EB] rounded-xl p-5 flex items-start gap-4 hover:border-[#CBD5E1] transition-all cursor-pointer shadow-2xs"
        >
          <div className="w-12 h-12 rounded-full bg-[#154636] flex items-center justify-center text-white shrink-0 shadow-xs">
            <Check size={20} strokeWidth={2.4} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs font-medium text-[#475569] block">
              Disposed Cases
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-3xl font-bold font-sans text-[#0F172A] tabular-nums tracking-tight">
                32
              </span>
              <span className="text-[11px] font-semibold text-[#16A34A] flex items-center">
                <ArrowUpRight size={13} /> +8%
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] block mt-1">
              Compliance verified & closed
            </span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Two-Column Grid: Left (~60%) / Right (~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN (7 cols: ~58-60%) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Card: Complaints by Status */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2.5">
                <FolderKanban size={18} className="text-[#334155]" strokeWidth={1.8} />
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] leading-tight">
                    Complaints by Status
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Workflow distribution across lifecycle stages
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigateTab('complaints')}
                className="text-xs font-medium text-[#0F766E] hover:text-[#115E59] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Donut Chart and Legend */}
            <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Donut SVG */}
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                  {chartSegments.map((seg, idx) => (
                    <circle
                      key={idx}
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="transparent"
                      stroke={seg.color}
                      strokeWidth="18"
                      strokeDasharray={seg.strokeDasharray}
                      strokeDashoffset={seg.strokeDashoffset}
                      className="transition-all duration-500 ease-out"
                    />
                  ))}
                </svg>

                {/* Inner cutout text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-bold font-sans text-[#0F172A] leading-none">
                    100
                  </span>
                  <span className="text-[10px] text-[#64748B] font-medium mt-1">
                    Total Cases
                  </span>
                </div>
              </div>

              {/* 2-Column Legend Rows */}
              <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-3.5 text-xs w-full">
                {/* Column 1 items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shrink-0" />
                      <span className="text-[#334155] font-medium text-[11.5px]">Submitted</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#0F172A]">28</span>
                      <span className="text-[#64748B] text-[11px]">28%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4] shrink-0" />
                      <span className="text-[#334155] font-medium text-[11.5px]">Under Process</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#0F172A]">26</span>
                      <span className="text-[#64748B] text-[11px]">26%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8B5CF6] shrink-0" />
                      <span className="text-[#334155] font-medium text-[11.5px]">Coordination</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#0F172A]">12</span>
                      <span className="text-[#64748B] text-[11px]">12%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] shrink-0" />
                      <span className="text-[#334155] font-medium text-[11.5px]">Resolution Review</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#0F172A]">8</span>
                      <span className="text-[#64748B] text-[11px]">8%</span>
                    </div>
                  </div>
                </div>

                {/* Column 2 items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488] shrink-0" />
                      <span className="text-[#334155] font-medium text-[11.5px]">Final Review</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#0F172A]">8</span>
                      <span className="text-[#64748B] text-[11px]">8%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0" />
                      <span className="text-[#334155] font-medium text-[11.5px]">Closed</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#0F172A]">14</span>
                      <span className="text-[#64748B] text-[11px]">14%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shrink-0" />
                      <span className="text-[#334155] font-medium text-[11.5px]">Overdue</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#0F172A]">12</span>
                      <span className="text-[#64748B] text-[11px]">12%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card: Recent Complaints */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs">
            {/* Card Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <FileText size={17} className="text-[#334155]" strokeWidth={1.8} />
                <h3 className="text-sm font-bold text-[#0F172A]">Recent Complaints</h3>
              </div>
              <button
                onClick={() => onNavigateTab('complaints')}
                className="text-xs font-medium text-[#0F766E] hover:text-[#115E59] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto pt-1">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="text-[#64748B] text-[11px] font-medium border-b border-[#F1F5F9]">
                    <th className="py-2.5 pr-3 font-medium">Tracking No.</th>
                    <th className="py-2.5 px-3 font-medium">Institution</th>
                    <th className="py-2.5 px-3 font-medium">Category</th>
                    <th className="py-2.5 px-3 font-medium">Status</th>
                    <th className="py-2.5 px-3 font-medium">Bureau</th>
                    <th className="py-2.5 pl-3 font-medium text-right">Received</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F8FAFC]">
                  {/* Row 1: CC-2026-000123 */}
                  <tr
                    onClick={() => onSelectComplaint(recentComplaints[0])}
                    className="hover:bg-[#F9FAF8] transition-colors cursor-pointer"
                  >
                    <td className="py-3 pr-3 font-mono text-[#0284C7] font-medium">
                      CC-2026-000123
                    </td>
                    <td className="py-3 px-3 text-[#1E293B] font-medium truncate max-w-[150px]">
                      Western Tech Institute
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Approval
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-[#E0F2FE] text-[#0369A1] text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-block">
                        Under Process
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Approval
                    </td>
                    <td className="py-3 pl-3 text-right text-[#64748B] whitespace-nowrap">
                      28 Oct 2026
                    </td>
                  </tr>

                  {/* Row 2: CC-2026-000087 */}
                  <tr
                    onClick={() => onSelectComplaint(recentComplaints[1])}
                    className="hover:bg-[#F9FAF8] transition-colors cursor-pointer"
                  >
                    <td className="py-3 pr-3 font-mono text-[#0284C7] font-medium">
                      CC-2026-000087
                    </td>
                    <td className="py-3 px-3 text-[#1E293B] font-medium truncate max-w-[150px]">
                      Sunrise Engineering College
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Infrastructure
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-[#FEF3C7] text-[#B45309] text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-block">
                        Under Triage
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Grievance
                    </td>
                    <td className="py-3 pl-3 text-right text-[#64748B] whitespace-nowrap">
                      27 Oct 2026
                    </td>
                  </tr>

                  {/* Row 3: CC-2026-000151 */}
                  <tr
                    onClick={() => onSelectComplaint(recentComplaints[2])}
                    className="hover:bg-[#F9FAF8] transition-colors cursor-pointer"
                  >
                    <td className="py-3 pr-3 font-mono text-[#0284C7] font-medium">
                      CC-2026-000151
                    </td>
                    <td className="py-3 px-3 text-[#1E293B] font-medium truncate max-w-[150px]">
                      Global Institute of Tech
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Fee-related
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-[#DCFCE7] text-[#15803D] text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-block">
                        Assigned
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Finance
                    </td>
                    <td className="py-3 pl-3 text-right text-[#64748B] whitespace-nowrap">
                      26 Oct 2026
                    </td>
                  </tr>

                  {/* Row 4: CC-2026-000098 */}
                  <tr
                    onClick={() => onSelectComplaint(recentComplaints[3])}
                    className="hover:bg-[#F9FAF8] transition-colors cursor-pointer"
                  >
                    <td className="py-3 pr-3 font-mono text-[#0284C7] font-medium">
                      CC-2026-000098
                    </td>
                    <td className="py-3 px-3 text-[#1E293B] font-medium truncate max-w-[150px]">
                      National Polytechnic
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Faculty
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-block">
                        Overdue
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Policy & Academic
                    </td>
                    <td className="py-3 pl-3 text-right text-[#64748B] whitespace-nowrap">
                      25 Oct 2026
                    </td>
                  </tr>

                  {/* Row 5: CC-2026-000076 */}
                  <tr
                    onClick={() => onSelectComplaint(recentComplaints[4])}
                    className="hover:bg-[#F9FAF8] transition-colors cursor-pointer"
                  >
                    <td className="py-3 pr-3 font-mono text-[#0284C7] font-medium">
                      CC-2026-000076
                    </td>
                    <td className="py-3 px-3 text-[#1E293B] font-medium truncate max-w-[150px]">
                      Eastern College of Engineering
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Exam
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-[#E0F2FE] text-[#0369A1] text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-block">
                        Under Process
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#475569]">
                      Academic
                    </td>
                    <td className="py-3 pl-3 text-right text-[#64748B] whitespace-nowrap">
                      24 Oct 2026
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (5 cols: ~40-42%) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Bureau Active Workload */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <Users size={17} className="text-[#334155]" strokeWidth={1.8} />
                <div>
                  <h3 className="text-sm font-bold text-[#0F172A] leading-tight">
                    Bureau Active Workload
                  </h3>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Open case density vs allocation capacity
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="text-xs font-medium text-[#0F766E] hover:text-[#115E59] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Details</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Bureau Rows */}
            <div className="pt-4 space-y-4">
              {metrics.bureauWorkload.map((b, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#F1F5F2] flex items-center justify-center text-[#475569] text-[11px]">
                        {idx === 0 && <Users size={13} />}
                        {idx === 1 && <ReceiptText size={13} />}
                        {idx === 2 && <Building size={13} />}
                        {idx === 3 && <GraduationCap size={13} />}
                        {idx === 4 && <Scale size={13} />}
                      </div>
                      <span className="font-medium text-[#1E293B] text-[12px]">
                        {b.bureau}
                      </span>
                    </div>

                    <span className="text-[#64748B] font-mono text-[11.5px]">
                      {b.activeCount} / {b.maxCapacity} ({b.percentage}%)
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#134E3F] rounded-full transition-all duration-500"
                      style={{ width: `${b.percentage}%` }}
                    />
                  </div>

                  {/* Warning notice if present */}
                  {b.handoffNotice && (
                    <div className="text-[10px] text-[#D97706] font-medium flex items-center gap-1 pt-0.5">
                      <AlertTriangle size={11} className="shrink-0" />
                      <span>{b.handoffNotice}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Card: Top Categories */}
          <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-2xs">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F1F5F9]">
              <div className="flex items-center gap-2">
                <PieChart size={17} className="text-[#334155]" strokeWidth={1.8} />
                <h3 className="text-sm font-bold text-[#0F172A]">Top Categories</h3>
              </div>
              <button
                onClick={() => onNavigateTab('analytics')}
                className="text-xs font-medium text-[#0F766E] hover:text-[#115E59] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>View Analytics</span>
                <ArrowRight size={13} />
              </button>
            </div>

            {/* Horizontal progress bars with percentage */}
            <div className="pt-4 space-y-3.5">
              {metrics.categoryBreakdown.map((cat, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#334155] text-[12px] font-medium">
                      {cat.label}
                    </span>
                    <span className="text-[#475569] font-mono font-medium text-[11.5px]">
                      {cat.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#134E3F] rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
