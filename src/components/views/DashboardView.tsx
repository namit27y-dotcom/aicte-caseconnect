import React from 'react';
import { 
  FileText, 
  Hourglass, 
  Settings, 
  AlertTriangle, 
  CheckCircle2, 
  Share2, 
  Users,
  ChevronRight,
  ShieldCheck,
  Building2,
  Plus,
  Download
} from 'lucide-react';
import { Complaint, UserPersona, DeadlineRule, OverlapCandidate } from '../../types';
import { 
  deriveCaseKPIs, 
  deriveStatusDistribution, 
  deriveBureauWorkload, 
  deriveInstitutionMetrics,
  getNow,
  isComplaintOverdue,
  isComplaintDueSoon
} from '../../utils/caseMetrics';
import { SYNTHETIC_INSTITUTIONS } from '../../data/syntheticData';
import { DonutChart } from '../charts/DonutChart';

interface DashboardViewProps {
  currentPersona: UserPersona;
  complaints: Complaint[];
  deadlineRules: DeadlineRule[];
  overlapCandidates: OverlapCandidate[];
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateTab: (tab: any) => void;
  onFilterComplaints: (filter: { status?: string; bureau?: string }) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentPersona,
  complaints,
  deadlineRules,
  overlapCandidates,
  onSelectComplaint,
  onNavigateTab,
  onFilterComplaints,
}) => {
  const now = getNow();
  const kpis = deriveCaseKPIs(complaints, deadlineRules, now);
  const statusSegments = deriveStatusDistribution(complaints);
  const bureauItems = deriveBureauWorkload(complaints, now);

  const overdueCases = complaints.filter((c) => isComplaintOverdue(c, now));
  const dueSoonCases = complaints.filter((c) => isComplaintDueSoon(c, deadlineRules, now));
  const pendingOverlaps = overlapCandidates.filter((o) => o.reviewStatus === 'PENDING_REVIEW');

  // Top attention cases derived directly from overdue and due soon complaints
  const attentionCases = [
    ...overdueCases.map((c) => ({
      complaint: c,
      badge: 'Overdue',
      badgeClass: 'bg-[#B94F45]/10 text-[#B94F45] border border-[#B94F45]/20',
      timeText: 'Overdue SLA',
    })),
    ...dueSoonCases.map((c) => ({
      complaint: c,
      badge: 'Due Soon',
      badgeClass: 'bg-[#C58B3B]/10 text-[#C58B3B] border border-[#C58B3B]/20',
      timeText: 'Action Required',
    })),
  ].slice(0, 3);

  // KPI cards dynamically derived from single source of truth (complaints)
  const kpiCards = [
    {
      title: 'Total Cases',
      value: kpis.total,
      badge: '+5%',
      icon: <FileText size={18} className="text-[#252D27]" />,
      onClick: () => {
        onFilterComplaints({ status: 'ALL', bureau: 'ALL' });
        onNavigateTab('complaints');
      },
    },
    {
      title: 'Awaiting Review',
      value: kpis.awaitingFirstAction,
      icon: <Hourglass size={18} className="text-[#C58B3B]" />,
      onClick: () => {
        onFilterComplaints({ status: 'SUBMITTED', bureau: 'ALL' });
        onNavigateTab('complaints');
      },
    },
    {
      title: 'In Progress',
      value: kpis.open - kpis.awaitingFirstAction,
      icon: <Settings size={18} className="text-[#193B2A]" />,
      onClick: () => {
        onFilterComplaints({ status: 'UNDER_PROCESS', bureau: 'ALL' });
        onNavigateTab('complaints');
      },
    },
    {
      title: 'Overdue',
      value: kpis.overdue,
      icon: <AlertTriangle size={18} className="text-[#B94F45]" />,
      highlight: 'text-[#B94F45]',
      onClick: () => {
        onNavigateTab('deadlines');
      },
    },
    {
      title: 'Disposed',
      value: kpis.resolved,
      icon: <CheckCircle2 size={18} className="text-[#4F8064]" />,
      onClick: () => {
        onFilterComplaints({ status: 'CLOSED', bureau: 'ALL' });
        onNavigateTab('complaints');
      },
    },
    {
      title: 'Coordination',
      value: pendingOverlaps.length,
      icon: <Users size={18} className="text-[#252D27]" />,
      onClick: () => {
        onNavigateTab('coordination');
      },
    },
  ];

  return (
    <div className="space-y-3.5 select-none pb-6">
      {/* 1. Hero Photograph Banner exactly as Reference Image 1 */}
      <div className="relative rounded-xl overflow-hidden shadow-2xs border border-[#E7E4DB] bg-white h-44 sm:h-48 flex items-center">
        {/* Background building photo */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/hero-building.jpg"
            alt="AICTE Institutional Headquarters"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle ivory gradient on the left so typography is crisp */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F7F5EF] via-[#F7F5EF]/85 to-transparent max-w-lg" />
        </div>

        {/* Hero Left Content */}
        <div className="relative z-10 p-6 sm:p-7 max-w-md">
          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#172B24] font-serif leading-tight">
            Case Overview
          </h1>
          <p className="text-xs text-[#78847D] font-sans mt-0.5 font-medium">
            AICTE CaseConnect
          </p>
        </div>

        {/* Top-Right Action Buttons from Reference Image 1: [+ Register Complaint] [Export Report] */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button 
            onClick={() => onNavigateTab('complaints')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#193B2A] hover:bg-[#142B21] text-white rounded-md text-xs font-medium cursor-pointer shadow-2xs transition-colors"
          >
            <Plus size={13} />
            <span>Register Complaint</span>
          </button>
          <button 
            onClick={() => onNavigateTab('analytics')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 hover:bg-white text-[#252D27] border border-[#E7E4DB] rounded-md text-xs font-medium cursor-pointer shadow-2xs transition-colors"
          >
            <Download size={13} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 2. Central Standing Committee & Governance Strip from Image 1 */}
      <div className="bg-[#142B21] text-[#F7F5EF] rounded-lg px-4 py-2 flex items-center justify-between text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Users size={14} className="text-[#C5A568]" />
          <span className="text-[12px] font-medium text-white tracking-wide">
            Central Standing Committee &amp; Inter-Bureau Coordination Council
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-[#829B86]">
          <span className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-2 h-2 rounded-full bg-[#4F8064] animate-pulse" />
            SIMULATION • DEMO ENVIRONMENT
          </span>
          <span className="text-[#829B86]/60">|</span>
          <span className="font-mono text-[11px]">Updated: 29 Oct 2026, 11:42 AM</span>
        </div>
      </div>

      {/* 3. 6 KPI Cards Grid from Image 1: Total Cases | Awaiting Review | In Progress | Overdue | Disposed | Coordination */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {kpiCards.map((kpi, idx) => (
          <div
            key={idx}
            onClick={kpi.onClick}
            className="bg-white border border-[#E7E4DB] rounded-xl p-3 flex flex-col justify-between hover:border-[#829B86] hover:shadow-2xs transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-[#737A72]">
              <span className="text-[11px] font-medium truncate max-w-[95px] leading-tight">
                {kpi.title}
              </span>
              {kpi.icon}
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className={`text-[24px] font-bold font-sans tabular-nums leading-none ${kpi.highlight || 'text-[#252D27]'}`}>
                {kpi.value}
              </span>
              {kpi.badge && (
                <span className="text-[10px] text-[#4F8064] font-semibold font-mono">
                  {kpi.badge}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 4. Main 2x2 Grid from Reference Image 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Top-Left: Case Status Donut (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-3">
            <h2 className="text-[13.5px] font-semibold text-[#252D27] font-serif flex items-center gap-1.5">
              <span>Case Status</span>
            </h2>
            <button 
              onClick={() => onNavigateTab('complaints')}
              className="text-[11px] text-[#737A72] hover:text-[#193B2A] cursor-pointer"
            >
              View Details →
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-36 h-36 shrink-0 relative flex items-center justify-center">
              <DonutChart
                size={135}
                showLegend={false}
                total={kpis.total}
                centerLabel="Cases"
                segments={statusSegments.map((s) => ({
                  key: s.status,
                  label: s.label,
                  count: s.count,
                  percentage: Math.round(s.percentage),
                  color: s.color,
                }))}
                onSelectSegment={(statusKey) => {
                  onFilterComplaints({ status: statusKey, bureau: 'ALL' });
                  onNavigateTab('complaints');
                }}
              />
            </div>

            {/* Dynamic Status Legend */}
            <div className="flex-1 w-full space-y-1 text-xs">
              {statusSegments.map((seg) => (
                <div 
                  key={seg.status}
                  onClick={() => {
                    onFilterComplaints({ status: seg.status, bureau: 'ALL' });
                    onNavigateTab('complaints');
                  }}
                  className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-[#F7F5EF] cursor-pointer transition-colors"
                >
                  <span className="flex items-center gap-2 text-[#737A72] text-[11.5px]">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                    <span className="font-medium text-[#252D27]">{seg.label}</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#737A72] font-mono">{Math.round(seg.percentage)}%</span>
                    <span className="font-mono text-[#252D27] text-[11.5px] font-bold min-w-4 text-right">{seg.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top-Right: Needs Attention (6 cols) exactly matching Image 1 */}
        <div className="lg:col-span-6 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-2.5">
              <h2 className="text-[13.5px] font-semibold text-[#252D27] font-serif flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-[#C58B3B]" />
                <span>Needs Attention</span>
              </h2>
              <button
                onClick={() => onNavigateTab('deadlines')}
                className="text-[11px] text-[#B94F45] hover:underline cursor-pointer font-medium"
              >
                View All →
              </button>
            </div>

            {/* Dynamic Attention rows derived from overdue & due soon complaints */}
            <div className="space-y-1.5">
              {attentionCases.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#78847D] bg-[#F7F5EF]/30 rounded-lg border border-[#E7E4DB]">
                  All cases currently meeting SLA targets
                </div>
              ) : (
                attentionCases.map((item) => (
                  <div 
                    key={item.complaint.id}
                    onClick={() => onSelectComplaint(item.complaint)}
                    className="p-2 rounded-lg bg-[#F7F5EF]/50 hover:bg-[#F7F5EF] border border-[#E7E4DB] flex items-center justify-between text-xs cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${item.badgeClass}`}>
                        {item.badge}
                      </span>
                      <span className="font-mono text-[11.5px] font-bold text-[#193B2A] shrink-0">
                        {item.complaint.trackingNumber}
                      </span>
                      <span className="text-[#737A72] text-[11.5px] truncate">
                        · {item.complaint.institutionName}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10.5px] text-[#737A72] shrink-0 font-mono">
                      <span>{item.timeText}</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Bottom-Left: Bureau Workload (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-3">
            <h2 className="text-[13.5px] font-semibold text-[#252D27] font-serif">
              Bureau Workload
            </h2>
            <button 
              onClick={() => onNavigateTab('complaints')}
              className="text-[11px] text-[#737A72] hover:text-[#193B2A] cursor-pointer"
            >
              View Details →
            </button>
          </div>

          {/* Dynamic Bureau Workload rows */}
          <div className="space-y-3 pt-0.5">
            {bureauItems.filter((b) => b.totalAssigned > 0).slice(0, 3).map((b) => {
              const pct = b.totalAssigned > 0 
                ? Math.round(((b.totalAssigned - b.overdueCount) / b.totalAssigned) * 100) 
                : 100;
              return (
                <div 
                  key={b.bureauKey} 
                  onClick={() => {
                    onFilterComplaints({ bureau: b.bureauKey, status: 'ALL' });
                    onNavigateTab('complaints');
                  }}
                  className="flex items-center justify-between gap-3 text-xs cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <span className="w-36 font-medium text-[#252D27] text-[12px] truncate">
                    {b.bureauName}
                  </span>
                  <div className="flex-1 bg-[#F7F5EF] h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-[#193B2A] h-full rounded-full transition-all" 
                      style={{ width: `${pct}%` }} 
                    />
                  </div>
                  <span className="font-mono text-[11px] text-[#737A72] shrink-0">
                    {pct}% ({b.openCount}/{b.totalAssigned})
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom-Right: Institutions Activity Register (6 cols) dynamically derived */}
        <div className="lg:col-span-6 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-2.5">
            <h2 className="text-[13.5px] font-semibold text-[#252D27] font-serif flex items-center gap-1.5">
              <Building2 size={14} className="text-[#193B2A]" />
              <span>Institutions</span>
            </h2>
            <button 
              onClick={() => onNavigateTab('institutions')}
              className="text-[11px] text-[#737A72] hover:text-[#193B2A] cursor-pointer"
            >
              View All →
            </button>
          </div>

          <div className="space-y-1.5 text-xs">
            {SYNTHETIC_INSTITUTIONS.slice(0, 3).map((inst) => {
              const metrics = deriveInstitutionMetrics(inst.id, complaints, now);
              const isOverdue = metrics.overdueCount > 0;
              const statusLabel = isOverdue 
                ? 'Notice Sent' 
                : metrics.openComplaints > 0 
                ? 'Under Review' 
                : 'Approved';
              const statusColor = isOverdue
                ? 'bg-[#B94F45]/10 text-[#B94F45] border-[#B94F45]/20'
                : metrics.openComplaints > 0
                ? 'bg-[#C58B3B]/10 text-[#C58B3B] border-[#C58B3B]/20'
                : 'bg-[#4F8064]/10 text-[#4F8064] border-[#4F8064]/20';
              return (
                <div 
                  key={inst.id}
                  onClick={() => onNavigateTab('institutions')}
                  className="p-2 rounded-lg bg-[#F7F5EF]/40 hover:bg-[#F7F5EF] border border-[#E7E4DB] flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-semibold text-[#252D27] text-[12px] truncate max-w-[200px]">
                      {inst.name}
                    </span>
                    <span className="text-[#737A72] text-[11px] shrink-0">
                      {inst.district || inst.state}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-[11px] font-mono text-[#737A72]">
                      {metrics.openComplaints} active
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
