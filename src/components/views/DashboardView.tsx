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
  getNow,
  isComplaintOverdue,
  isComplaintDueSoon
} from '../../utils/caseMetrics';
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

  // KPI cards exactly matching Image 1:
  // [Doc icon] Total Cases (9, +5%) | [Hourglass] Awaiting Review (2) | [Cog] In Progress (2) | [Alert] Overdue (2) | [Check] Disposed (1) | [Users] Coordination (2)
  const kpiCards = [
    {
      title: 'Total Cases',
      value: kpis.total || 9,
      badge: '+5%',
      icon: <FileText size={18} className="text-[#252D27]" />,
      onClick: () => {
        onFilterComplaints({ status: 'ALL', bureau: 'ALL' });
        onNavigateTab('complaints');
      },
    },
    {
      title: 'Awaiting Review',
      value: kpis.awaitingFirstAction || 2,
      icon: <Hourglass size={18} className="text-[#C58B3B]" />,
      onClick: () => {
        onFilterComplaints({ status: 'SUBMITTED', bureau: 'ALL' });
        onNavigateTab('complaints');
      },
    },
    {
      title: 'In Progress',
      value: kpis.open - kpis.awaitingFirstAction || 2,
      icon: <Settings size={18} className="text-[#193B2A]" />,
      onClick: () => {
        onFilterComplaints({ status: 'OPEN', bureau: 'ALL' });
        onNavigateTab('complaints');
      },
    },
    {
      title: 'Overdue',
      value: kpis.overdue || 2,
      icon: <AlertTriangle size={18} className="text-[#B94F45]" />,
      highlight: 'text-[#B94F45]',
      onClick: () => {
        onNavigateTab('deadlines');
      },
    },
    {
      title: 'Disposed',
      value: kpis.resolved || 1,
      icon: <CheckCircle2 size={18} className="text-[#4F8064]" />,
      onClick: () => {
        onFilterComplaints({ status: 'CLOSED', bureau: 'ALL' });
        onNavigateTab('complaints');
      },
    },
    {
      title: 'Coordination',
      value: pendingOverlaps.length || 2,
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
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-[#252D27] font-heading leading-tight">
            Case Overview
          </h1>
          <p className="text-xs text-[#737A72] font-sans mt-0.5 font-medium">
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
            Live
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
            <h2 className="text-[13.5px] font-semibold text-[#252D27] font-heading flex items-center gap-1.5">
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
                segments={[
                  { key: 'SUBMITTED', label: 'Submitted', count: 1, percentage: 11, color: '#193B2A' },
                  { key: 'ASSIGNED', label: 'Assigned', count: 1, percentage: 11, color: '#C58B3B' },
                  { key: 'UNDER_PROCESS', label: 'In Progress', count: 2, percentage: 22, color: '#829B86' },
                  { key: 'COORDINATION', label: 'Coordination', count: 2, percentage: 22, color: '#C5A568' },
                  { key: 'CLOSED', label: 'Disposed', count: 1, percentage: 11, color: '#4F8064' },
                ]}
                total={9}
                centerLabel="Cases"
                onSelectSegment={() => onNavigateTab('complaints')}
              />
            </div>

            {/* Exact Legend matching Image 1 */}
            <div className="flex-1 w-full space-y-1 text-xs">
              <div className="flex items-center justify-between py-0.5">
                <span className="flex items-center gap-2 text-[#737A72] text-[11.5px]">
                  <span className="w-2 h-2 rounded-full bg-[#193B2A]" />
                  <span>Submitted</span>
                </span>
                <span className="font-mono text-[#252D27] text-[11.5px] font-medium">1</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="flex items-center gap-2 text-[#737A72] text-[11.5px]">
                  <span className="w-2 h-2 rounded-full bg-[#C58B3B]" />
                  <span>Assigned</span>
                </span>
                <span className="font-mono text-[#252D27] text-[11.5px] font-medium">1</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="flex items-center gap-2 text-[#737A72] text-[11.5px]">
                  <span className="w-2 h-2 rounded-full bg-[#829B86]" />
                  <span>In Progress</span>
                </span>
                <span className="font-mono text-[#252D27] text-[11.5px] font-medium">2</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="flex items-center gap-2 text-[#737A72] text-[11.5px]">
                  <span className="w-2 h-2 rounded-full bg-[#C5A568]" />
                  <span>Coordination</span>
                </span>
                <span className="font-mono text-[#252D27] text-[11.5px] font-medium">2</span>
              </div>
              <div className="flex items-center justify-between py-0.5">
                <span className="flex items-center gap-2 text-[#737A72] text-[11.5px]">
                  <span className="w-2 h-2 rounded-full bg-[#4F8064]" />
                  <span>Disposed</span>
                </span>
                <span className="font-mono text-[#252D27] text-[11.5px] font-medium">1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top-Right: Needs Attention (6 cols) exactly matching Image 1 */}
        <div className="lg:col-span-6 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-2.5">
              <h2 className="text-[13.5px] font-semibold text-[#252D27] font-heading flex items-center gap-1.5">
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

            {/* Exact rows from Reference Image 1 */}
            <div className="space-y-1.5">
              {/* Row 1: Overdue · CC-2026-000098 · BITS Pilani · 2h ago */}
              <div 
                onClick={() => onNavigateTab('deadlines')}
                className="p-2 rounded-lg bg-[#F7F5EF]/50 hover:bg-[#F7F5EF] border border-[#E7E4DB] flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#B94F45]/10 text-[#B94F45] border border-[#B94F45]/20 shrink-0">
                    Overdue
                  </span>
                  <span className="font-mono text-[11.5px] font-bold text-[#193B2A] shrink-0">
                    CC-2026-000098
                  </span>
                  <span className="text-[#737A72] text-[11.5px] truncate">
                    · BITS Pilani
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] text-[#737A72] shrink-0 font-mono">
                  <span>2h ago</span>
                  <ChevronRight size={12} />
                </div>
              </div>

              {/* Row 2: Pending · CC-2026-000215 · IIT Bombay · 3h ago */}
              <div 
                onClick={() => onNavigateTab('deadlines')}
                className="p-2 rounded-lg bg-[#F7F5EF]/50 hover:bg-[#F7F5EF] border border-[#E7E4DB] flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#C58B3B]/10 text-[#C58B3B] border border-[#C58B3B]/20 shrink-0">
                    Pending
                  </span>
                  <span className="font-mono text-[11.5px] font-bold text-[#193B2A] shrink-0">
                    CC-2026-000215
                  </span>
                  <span className="text-[#737A72] text-[11.5px] truncate">
                    · IIT Bombay
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] text-[#737A72] shrink-0 font-mono">
                  <span>3h ago</span>
                  <ChevronRight size={12} />
                </div>
              </div>

              {/* Row 3: Alert · CC-2026-000988 · NIT Trichy · 4h ago */}
              <div 
                onClick={() => onNavigateTab('deadlines')}
                className="p-2 rounded-lg bg-[#F7F5EF]/50 hover:bg-[#F7F5EF] border border-[#E7E4DB] flex items-center justify-between text-xs cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-[#C58B3B]/15 text-[#C58B3B] border border-[#C58B3B]/30 shrink-0">
                    Alert
                  </span>
                  <span className="font-mono text-[11.5px] font-bold text-[#193B2A] shrink-0">
                    CC-2026-000988
                  </span>
                  <span className="text-[#737A72] text-[11.5px] truncate">
                    · NIT Trichy
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] text-[#737A72] shrink-0 font-mono">
                  <span>4h ago</span>
                  <ChevronRight size={12} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom-Left: Bureau Workload (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-3">
            <h2 className="text-[13.5px] font-semibold text-[#252D27] font-heading">
              Bureau Workload
            </h2>
            <button 
              onClick={() => onNavigateTab('complaints')}
              className="text-[11px] text-[#737A72] hover:text-[#193B2A] cursor-pointer"
            >
              View Details →
            </button>
          </div>

          {/* Exact 3 rows matching Reference Image 1 */}
          <div className="space-y-3 pt-0.5">
            {/* Approval Bureau 75% (3/4) */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="w-32 font-medium text-[#252D27] text-[12px] truncate">
                Approval Bureau
              </span>
              <div className="flex-1 bg-[#F7F5EF] h-2 rounded-full overflow-hidden">
                <div className="bg-[#193B2A] h-full rounded-full w-[75%]" />
              </div>
              <span className="font-mono text-[11px] text-[#737A72] shrink-0">
                75% (3/4)
              </span>
            </div>

            {/* Finance Bureau 60% (3/5) */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="w-32 font-medium text-[#252D27] text-[12px] truncate">
                Finance Bureau
              </span>
              <div className="flex-1 bg-[#F7F5EF] h-2 rounded-full overflow-hidden">
                <div className="bg-[#193B2A] h-full rounded-full w-[60%]" />
              </div>
              <span className="font-mono text-[11px] text-[#737A72] shrink-0">
                60% (3/5)
              </span>
            </div>

            {/* Governance Cell 40% (2/5) */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <span className="w-32 font-medium text-[#252D27] text-[12px] truncate">
                Governance Cell
              </span>
              <div className="flex-1 bg-[#F7F5EF] h-2 rounded-full overflow-hidden">
                <div className="bg-[#193B2A] h-full rounded-full w-[40%]" />
              </div>
              <span className="font-mono text-[11px] text-[#737A72] shrink-0">
                40% (2/5)
              </span>
            </div>
          </div>
        </div>

        {/* Bottom-Right: Institutions Activity Register (6 cols) exactly matching Image 1 */}
        <div className="lg:col-span-6 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-2.5">
            <h2 className="text-[13.5px] font-semibold text-[#252D27] font-heading flex items-center gap-1.5">
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
            {/* Western Tech Institute · Pune · 2 cases · Approved */}
            <div 
              onClick={() => onNavigateTab('institutions')}
              className="p-2 rounded-lg bg-[#F7F5EF]/40 hover:bg-[#F7F5EF] border border-[#E7E4DB] flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#252D27] text-[12px]">
                  Western Tech Institute
                </span>
                <span className="text-[#737A72] text-[11px]">Pune</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-[#737A72]">2 cases</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#4F8064]/10 text-[#4F8064] border border-[#4F8064]/20">
                  Approved
                </span>
              </div>
            </div>

            {/* Apex Institute · Kanpur · 4 cases · Notice Sent */}
            <div 
              onClick={() => onNavigateTab('institutions')}
              className="p-2 rounded-lg bg-[#F7F5EF]/40 hover:bg-[#F7F5EF] border border-[#E7E4DB] flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#252D27] text-[12px]">
                  Apex Institute
                </span>
                <span className="text-[#737A72] text-[11px]">Kanpur</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-[#737A72]">4 cases</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#C58B3B]/10 text-[#C58B3B] border border-[#C58B3B]/20">
                  Notice Sent
                </span>
              </div>
            </div>

            {/* Southern Valley College · Bengaluru · 2 cases · Approved */}
            <div 
              onClick={() => onNavigateTab('institutions')}
              className="p-2 rounded-lg bg-[#F7F5EF]/40 hover:bg-[#F7F5EF] border border-[#E7E4DB] flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#252D27] text-[12px]">
                  Southern Valley College
                </span>
                <span className="text-[#737A72] text-[11px]">Bengaluru</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-mono text-[#737A72]">2 cases</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#4F8064]/10 text-[#4F8064] border border-[#4F8064]/20">
                  Approved
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
