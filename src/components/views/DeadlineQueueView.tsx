import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  FileText, 
  ChevronRight,
  BellRing,
  Filter,
  Send
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { PriorityBadge } from '../ui/PriorityBadge';
import { PageHeader } from '../ui/PageHeader';
import { DataTable } from '../ui/DataTable';
import { EmptyState } from '../ui/EmptyState';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Complaint, UserPersona, DeadlineRule } from '../../types';
import { 
  deriveCaseKPIs, 
  getNow, 
  isComplaintOverdue, 
  isComplaintDueSoon, 
  getDaysRemaining 
} from '../../utils/caseMetrics';
import { can } from '../../utils/permissions';

interface DeadlineQueueViewProps {
  complaints: Complaint[];
  deadlineRules: DeadlineRule[];
  currentPersona: UserPersona;
  onSelectComplaint: (complaint: Complaint) => void;
  onTriggerEscalation: (trackingNumber: string) => void;
}

export const DeadlineQueueView: React.FC<DeadlineQueueViewProps> = ({
  complaints,
  deadlineRules,
  currentPersona,
  onSelectComplaint,
  onTriggerEscalation,
}) => {
  const [filterState, setFilterState] = useState<'ALL' | 'OVERDUE' | 'DUE_SOON' | 'ON_SCHEDULE'>('ALL');
  const [escalatingComplaint, setEscalatingComplaint] = useState<Complaint | null>(null);

  const now = getNow();
  const kpis = deriveCaseKPIs(complaints, deadlineRules, now);
  const complianceRate = kpis.total > 0 ? Math.round(((kpis.total - kpis.overdue) / kpis.total) * 100) : 100;

  const activeComplaints = complaints.filter((c) => c.status !== 'CLOSED');

  const filteredComplaints = activeComplaints.filter((c) => {
    const overdue = isComplaintOverdue(c, now);
    const dueSoon = isComplaintDueSoon(c, deadlineRules, now);

    if (filterState === 'OVERDUE') return overdue;
    if (filterState === 'DUE_SOON') return dueSoon;
    if (filterState === 'ON_SCHEDULE') return !overdue && !dueSoon;
    return true;
  });

  return (
    <div className="space-y-5">
      {/* 1. Top Section Header Matching Reference Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#252D27] font-heading">
            Alerts & SLA
          </h1>
          <p className="text-xs text-[#737A72] mt-0.5">
            Monitor statutory timeframes and escalation milestones
          </p>
        </div>

        {/* Action pills filter in header */}
        <div className="flex items-center gap-1 bg-[#EAE5DC] p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setFilterState('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterState === 'ALL' ? 'bg-white text-[#252D27] shadow-xs font-semibold' : 'text-[#737A72] hover:text-[#252D27]'
            }`}
          >
            All Active ({activeComplaints.length})
          </button>
          <button
            onClick={() => setFilterState('OVERDUE')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterState === 'OVERDUE' ? 'bg-[#B94F45] text-white shadow-xs font-semibold' : 'text-[#B94F45] hover:bg-white/50'
            }`}
          >
            Overdue ({kpis.overdue})
          </button>
          <button
            onClick={() => setFilterState('DUE_SOON')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterState === 'DUE_SOON' ? 'bg-[#C58B3B] text-white shadow-xs font-semibold' : 'text-[#C58B3B] hover:bg-white/50'
            }`}
          >
            Due Soon ({kpis.dueSoon})
          </button>
          <button
            onClick={() => setFilterState('ON_SCHEDULE')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              filterState === 'ON_SCHEDULE' ? 'bg-[#193B2A] text-white shadow-xs font-semibold' : 'text-[#193B2A] hover:bg-white/50'
            }`}
          >
            On Schedule ({kpis.onSchedule})
          </button>
        </div>
      </div>

      {/* 2. 4 KPI Cards Matching Reference Image 1 & 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div 
          onClick={() => setFilterState('ALL')}
          className="bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs cursor-pointer hover:border-[#193B2A] transition-colors"
        >
          <div className="text-2xl sm:text-3xl font-bold text-[#252D27] font-heading">
            {activeComplaints.length}
          </div>
          <div className="text-xs font-medium text-[#737A72] mt-0.5">
            Total Active
          </div>
        </div>

        <div 
          onClick={() => setFilterState('OVERDUE')}
          className="bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs cursor-pointer hover:border-[#B94F45] transition-colors"
        >
          <div className="text-2xl sm:text-3xl font-bold text-[#B94F45] font-heading">
            {kpis.overdue}
          </div>
          <div className="text-xs font-medium text-[#737A72] mt-0.5">
            Overdue SLA
          </div>
        </div>

        <div 
          onClick={() => setFilterState('DUE_SOON')}
          className="bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs cursor-pointer hover:border-[#C58B3B] transition-colors"
        >
          <div className="text-2xl sm:text-3xl font-bold text-[#C58B3B] font-heading">
            {kpis.dueSoon}
          </div>
          <div className="text-xs font-medium text-[#737A72] mt-0.5">
            Due Soon
          </div>
        </div>

        <div 
          onClick={() => setFilterState('ON_SCHEDULE')}
          className="bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs cursor-pointer hover:border-[#4F8064] transition-colors"
        >
          <div className="text-2xl sm:text-3xl font-bold text-[#4F8064] font-heading">
            {complianceRate}%
          </div>
          <div className="text-xs font-medium text-[#737A72] mt-0.5">
            SLA Compliance
          </div>
        </div>
      </div>

      {/* Queue Table */}
      <DataTable
        ariaLabel="Deadline and SLA Queue"
        isEmpty={filteredComplaints.length === 0}
        emptyState={
          <EmptyState
            title="No grievances in this SLA category"
            description="All active cases are currently conforming to other SLA tiers."
            actionLabel="View All Active"
            onAction={() => setFilterState('ALL')}
          />
        }
        headers={[
          <th className="font-semibold">Tracking ID</th>,
          <th className="font-semibold">Institution & Category</th>,
          <th className="font-semibold">Assigned Bureau</th>,
          <th className="font-semibold">Status</th>,
          <th className="font-semibold">Target SLA Deadline</th>,
          <th className="font-semibold">Remaining Window</th>,
          <div className="text-right">Escalation & Actions</div>,
        ]}
      >
        {filteredComplaints.map((c) => {
          const overdue = isComplaintOverdue(c, now);
          const daysLeft = getDaysRemaining(c.targetDeadline, now);
          const permission = can(currentPersona, 'TRIGGER_ESCALATION', { complaint: c });

          return (
            <tr
              key={c.id}
              onClick={() => onSelectComplaint(c)}
              className="hover:bg-[#F7F5EF] transition-colors cursor-pointer group"
            >
              {/* Tracking ID */}
              <td className="py-3 px-4 font-mono font-bold text-[#193B2A] whitespace-nowrap">
                {c.trackingNumber}
              </td>

              {/* Institution */}
              <td className="py-3 px-4 max-w-xs sm:max-w-md">
                <div className="font-semibold text-[#252D27] truncate group-hover:text-[#193B2A]">
                  {c.institutionName}
                </div>
                <span className="text-[10.5px] text-[#737A72] block mt-0.5">
                  {c.categoryLabel} · {c.institutionState}
                </span>
              </td>

              {/* Bureau */}
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="font-medium text-[#252D27]">{c.bureauName}</div>
                <div className="text-[11px] text-[#737A72] mt-0.5">
                  {c.assignedOfficerName || 'Unassigned'}
                </div>
              </td>

              {/* Status */}
              <td className="py-3 px-4 whitespace-nowrap">
                <StatusBadge status={c.status} size="sm" />
              </td>

              {/* Target SLA Deadline */}
              <td className="py-3 px-4 whitespace-nowrap font-mono text-xs">
                {c.targetDeadline.slice(0, 10)}
              </td>

              {/* Remaining Window */}
              <td className="py-3 px-4 whitespace-nowrap">
                {overdue ? (
                  <span className="font-bold text-[#B94F45] flex items-center gap-1 font-mono text-xs">
                    <AlertTriangle size={12} />
                    {Math.abs(daysLeft)} days overdue
                  </span>
                ) : daysLeft <= 7 ? (
                  <span className="font-semibold text-[#C58B3B] font-mono text-xs">
                    {daysLeft} days left
                  </span>
                ) : (
                  <span className="text-[#4F8064] font-mono text-xs">
                    {daysLeft} days left
                  </span>
                )}
              </td>

              {/* Next Action / Escalation Dispatch */}
              <td
                className="py-3 px-4 text-right whitespace-nowrap"
                onClick={(e) => e.stopPropagation()}
              >
                {overdue ? (
                  <Button
                    variant="danger"
                    size="sm"
                    icon={<BellRing size={12} />}
                    disabled={!permission.allowed}
                    title={permission.allowed ? 'Dispatch formal SLA notice' : permission.reason}
                    onClick={() => setEscalatingComplaint(c)}
                  >
                    Dispatch Notice
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onSelectComplaint(c)}
                  >
                    Inspect Case
                  </Button>
                )}
              </td>
            </tr>
          );
        })}
      </DataTable>

      {/* Escalation Confirmation Dialog */}
      <ConfirmDialog
        isOpen={escalatingComplaint !== null}
        title="Dispatch Formal Statutory SLA Notice"
        description={`Issue a formal compliance warning for ${escalatingComplaint?.trackingNumber} (${escalatingComplaint?.institutionName}). This action will be recorded in the immutable audit trail and sent to the Regional Officer.`}
        confirmLabel="Dispatch SLA Notice"
        cancelLabel="Cancel"
        variant="danger"
        requireReason
        reasonPlaceholder="e.g. Statutory 30-day ragging inquiry period lapsed without university inquiry report."
        onConfirm={(reason) => {
          if (escalatingComplaint) {
            onTriggerEscalation(escalatingComplaint.trackingNumber);
            setEscalatingComplaint(null);
          }
        }}
        onCancel={() => setEscalatingComplaint(null)}
      />
    </div>
  );
};
