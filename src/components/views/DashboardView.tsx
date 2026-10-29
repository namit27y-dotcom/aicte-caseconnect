import React from 'react';
import { 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Calendar, 
  Building2,
  GitMerge,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { Complaint, UserPersona, DeadlineRule, OverlapCandidate } from '../../types';
import { 
  deriveCaseKPIs, 
  deriveStatusDistribution, 
  deriveBureauWorkload, 
  getNow,
  isComplaintOverdue,
  isComplaintDueSoon,
  getDaysRemaining
} from '../../utils/caseMetrics';
import { KpiCard } from '../ui/KpiCard';
import { ChartCard } from '../ui/ChartCard';
import { DonutChart } from '../charts/DonutChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { StatusBadge } from '../ui/StatusBadge';
import { PriorityBadge } from '../ui/PriorityBadge';

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

  const recentComplaints = complaints.slice(0, 5);

  // Priority Actions: overdue cases, due soon, and pending overlaps
  const overdueCases = complaints.filter((c) => isComplaintOverdue(c, now));
  const dueSoonCases = complaints.filter((c) => isComplaintDueSoon(c, deadlineRules, now));
  const pendingOverlaps = overlapCandidates.filter((o) => o.reviewStatus === 'PENDING_REVIEW');

  // Format live simulated date
  const formattedDate = now.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-6 select-none">
      {/* 1. Header Greeting & Live Timestamp */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
            <span className="text-xs font-semibold text-[#5C6460] uppercase tracking-wider">
              AICTE Grievance Command Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1F2421] mt-1 font-sans">
            Welcome back, {currentPersona.name}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C6460] mt-1">
            Real-time case monitoring across technical institutions and AICTE regulatory bureaus.
          </p>
        </div>

        {/* Live Date Card */}
        <div className="bg-white border border-[#E6E1D8] rounded-xl px-4 py-2.5 flex items-center gap-3 shrink-0 shadow-2xs">
          <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] flex items-center justify-center text-[#1B4532] border border-[#E6E1D8]">
            <Calendar size={18} strokeWidth={1.8} />
          </div>
          <div className="leading-tight">
            <span className="text-[10.5px] text-[#718096] uppercase font-semibold block">
              Platform Clock
            </span>
            <span className="text-xs font-bold text-[#1F2421]">
              {formattedDate}, {formattedTime}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Four Trustworthy KPI Cards (Derived from caseMetrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Visible Complaints */}
        <KpiCard
          title="Total Complaints"
          value={kpis.total}
          context="Across all AICTE bureaus"
          icon={<FileText size={22} />}
          variant="neutral"
          onClick={() => {
            onFilterComplaints({ status: 'ALL', bureau: 'ALL' });
            onNavigateTab('complaints');
          }}
          ariaLabel={`Total complaints: ${kpis.total}. Click to inspect full register.`}
        />

        {/* KPI 2: Open Complaints */}
        <KpiCard
          title="Open Complaints"
          value={kpis.open}
          context="Active inquiry & verification"
          icon={<Clock size={22} />}
          variant="primary"
          onClick={() => {
            onFilterComplaints({ status: 'OPEN', bureau: 'ALL' });
            onNavigateTab('complaints');
          }}
          ariaLabel={`Open complaints: ${kpis.open}. Click to inspect active register.`}
        />

        {/* KPI 3: Overdue (Subset of Open) */}
        <KpiCard
          title="Overdue (SLA Breached)"
          value={kpis.overdue}
          context={`${kpis.overdue} of ${kpis.open} open cases`}
          icon={<AlertTriangle size={22} />}
          variant="danger"
          onClick={() => {
            onNavigateTab('deadlines');
          }}
          ariaLabel={`Overdue cases: ${kpis.overdue} of ${kpis.open} open. Click to inspect deadline queue.`}
        />

        {/* KPI 4: Resolved / Closed */}
        <KpiCard
          title="Resolved Cases"
          value={kpis.resolved}
          context="Formally closed & audited"
          icon={<CheckCircle2 size={22} />}
          variant="success"
          onClick={() => {
            onFilterComplaints({ status: 'CLOSED', bureau: 'ALL' });
            onNavigateTab('complaints');
          }}
          ariaLabel={`Resolved complaints: ${kpis.resolved}. Click to inspect closed cases.`}
        />
      </div>

      {/* 3. Operational Charts (Status Donut & Bureau Workload) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Status Distribution Donut (5 cols) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="Status Distribution"
            subtitle="Click any slice to filter the central register"
            className="h-full"
          >
            <DonutChart
              segments={statusSegments.map((s) => ({
                key: s.status,
                label: s.label,
                count: s.count,
                percentage: s.percentage,
                color: s.color,
              }))}
              total={kpis.total}
              centerLabel="Total Grievances"
              onSelectSegment={(statusKey) => {
                onFilterComplaints({ status: statusKey });
                onNavigateTab('complaints');
              }}
            />
          </ChartCard>
        </div>

        {/* Bureau Workload Horizontal Bar (7 cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="Bureau Workload & SLA Adherence"
            subtitle="Grievances assigned across bureaus; red denotes overdue cases"
            action={
              <button
                onClick={() => onNavigateTab('complaints')}
                className="text-xs text-[#1B4532] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                View all <ArrowRight size={13} />
              </button>
            }
            className="h-full"
          >
            <HorizontalBarChart
              items={bureauItems.map((b) => ({
                key: b.bureauKey,
                label: b.bureauName,
                total: b.totalAssigned,
                open: b.openCount,
                overdue: b.overdueCount,
                resolved: b.resolvedCount,
              }))}
              onSelectBar={(bureauKey) => {
                onFilterComplaints({ bureau: bureauKey });
                onNavigateTab('complaints');
              }}
            />
          </ChartCard>
        </div>
      </div>

      {/* 4. Priority Remediation Actions & Recent Intake Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Priority Actions (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA]">
            <div>
              <h3 className="text-sm font-bold text-[#1F2421] tracking-tight flex items-center gap-2">
                <ShieldAlert size={16} className="text-[#DC2626]" />
                Priority Actions Required
              </h3>
              <p className="text-xs text-[#5C6460] mt-0.5">
                Urgent attention items requiring officer or head sign-off
              </p>
            </div>
            <span className="bg-[#FEF2F2] text-[#DC2626] font-mono font-bold text-[11px] px-2 py-0.5 rounded-full border border-[#FECACA]">
              {overdueCases.length + dueSoonCases.length + pendingOverlaps.length}
            </span>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {/* Overdue Items */}
            {overdueCases.map((c) => (
              <div
                key={`act-overdue-${c.id}`}
                onClick={() => onSelectComplaint(c)}
                className="p-3 bg-[#FFFBFB] border border-[#FECACA] rounded-lg hover:border-[#DC2626] transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-bold text-[#DC2626]">
                      {c.trackingNumber}
                    </span>
                    <span className="text-[10px] bg-[#FEF2F2] text-[#DC2626] px-1.5 py-0.2 rounded font-bold uppercase">
                      SLA Overdue
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#1F2421] truncate mt-1">
                    {c.institutionName}
                  </h4>
                  <p className="text-[11px] text-[#5C6460] truncate mt-0.5">
                    {c.title}
                  </p>
                </div>
                <ChevronRight size={15} className="text-[#DC2626] shrink-0 mt-1" />
              </div>
            ))}

            {/* Due Soon Items */}
            {dueSoonCases.map((c) => {
              const daysLeft = getDaysRemaining(c.targetDeadline, now);
              return (
                <div
                  key={`act-due-${c.id}`}
                  onClick={() => onSelectComplaint(c)}
                  className="p-3 bg-[#FFFDF7] border border-[#FDE68A] rounded-lg hover:border-[#D97706] transition-all cursor-pointer flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold text-[#B45309]">
                        {c.trackingNumber}
                      </span>
                      <span className="text-[10px] bg-[#FFFBEB] text-[#D97706] px-1.5 py-0.2 rounded font-bold uppercase">
                        Due in {daysLeft}d
                      </span>
                    </div>
                    <h4 className="text-xs font-semibold text-[#1F2421] truncate mt-1">
                      {c.institutionName}
                    </h4>
                    <p className="text-[11px] text-[#5C6460] truncate mt-0.5">
                      {c.title}
                    </p>
                  </div>
                  <ChevronRight size={15} className="text-[#D97706] shrink-0 mt-1" />
                </div>
              );
            })}

            {/* Pending Overlaps */}
            {pendingOverlaps.map((o) => (
              <div
                key={`act-ov-${o.id}`}
                onClick={() => onNavigateTab('coordination')}
                className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-lg hover:border-[#1B4532] transition-all cursor-pointer flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <GitMerge size={12} className="text-[#1B4532]" />
                    <span className="text-xs font-semibold text-[#1B4532]">
                      Cross-Bureau Overlap Candidate
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-[#EBF3EE] text-[#1B4532] px-1 rounded">
                      {o.similarityScore}% match
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#1F2421] truncate mt-1">
                    {o.targetInstitution}
                  </h4>
                  <p className="text-[11px] text-[#5C6460] truncate mt-0.5">
                    Review required between assigned bureaus
                  </p>
                </div>
                <ChevronRight size={15} className="text-[#718096] shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Intake Cases Table (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA]">
              <div>
                <h3 className="text-sm font-bold text-[#1F2421] tracking-tight">
                  Recent Grievance Intake
                </h3>
                <p className="text-xs text-[#5C6460] mt-0.5">
                  Latest registered grievances awaiting action or updates
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('complaints')}
                className="text-xs text-[#1B4532] font-semibold flex items-center gap-1 hover:underline cursor-pointer"
              >
                View all ({complaints.length}) <ArrowRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-[#F4F1EA] mt-2">
              {recentComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectComplaint(c)}
                  className="py-3 px-2 rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 group"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#1B4532]">
                        {c.trackingNumber}
                      </span>
                      <span className="text-xs font-semibold text-[#1F2421] truncate group-hover:text-[#1B4532]">
                        {c.institutionName}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#5C6460] truncate mt-0.5">
                      {c.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <StatusBadge status={c.status} size="sm" />
                    <PriorityBadge priority={c.priority} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F4F1EA] flex items-center justify-between text-xs text-[#718096]">
            <span>Showing latest 5 of {complaints.length} registered cases</span>
            <button
              onClick={() => onNavigateTab('complaints')}
              className="text-[#1B4532] font-semibold hover:underline"
            >
              Open Full Central Register →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
