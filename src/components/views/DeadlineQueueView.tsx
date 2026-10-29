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
      {/* View Header */}
      <PageHeader
        title="Statutory Deadline & SLA Escalation Queue"
        subtitle="Enforcing time-bound resolution across technical institutions pursuant to AICTE Regulations"
        actions={
          <div className="flex items-center gap-1 bg-[#EAE5DC] p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setFilterState('ALL')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterState === 'ALL' ? 'bg-white text-[#1F2421] shadow-xs font-semibold' : 'text-[#5C6460] hover:text-[#1F2421]'
              }`}
            >
              All Active ({activeComplaints.length})
            </button>
            <button
              onClick={() => setFilterState('OVERDUE')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterState === 'OVERDUE' ? 'bg-[#DC2626] text-white shadow-xs font-semibold' : 'text-[#DC2626] hover:bg-white/50'
              }`}
            >
              Overdue ({kpis.overdue})
            </button>
            <button
              onClick={() => setFilterState('DUE_SOON')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterState === 'DUE_SOON' ? 'bg-[#D97706] text-white shadow-xs font-semibold' : 'text-[#D97706] hover:bg-white/50'
              }`}
            >
              Due Soon ({kpis.dueSoon})
            </button>
            <button
              onClick={() => setFilterState('ON_SCHEDULE')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                filterState === 'ON_SCHEDULE' ? 'bg-[#16A34A] text-white shadow-xs font-semibold' : 'text-[#16A34A] hover:bg-white/50'
              }`}
            >
              On Schedule ({kpis.onSchedule})
            </button>
          </div>
        }
      />

      {/* SLA Tiers Overview (Derived Numbers) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overdue Card */}
        <div
          onClick={() => setFilterState('OVERDUE')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterState === 'OVERDUE'
              ? 'bg-[#FEF2F2] border-[#DC2626] ring-1 ring-[#DC2626]'
              : 'bg-white border-[#FECACA] hover:border-[#DC2626]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#DC2626] font-semibold">
            <span className="flex items-center gap-1.5 font-bold">
              <AlertTriangle size={15} />
              SLA Overdue Breach
            </span>
            <span className="font-mono text-xl font-bold">{kpis.overdue} cases</span>
          </div>
          <p className="text-[11px] text-[#991B1B] mt-1.5 leading-relaxed">
            Statutory timeline exceeded. Bureau Head intervention and formal show-cause dispatch permitted.
          </p>
        </div>

        {/* Due Soon Card */}
        <div
          onClick={() => setFilterState('DUE_SOON')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterState === 'DUE_SOON'
              ? 'bg-[#FFFBEB] border-[#D97706] ring-1 ring-[#D97706]'
              : 'bg-white border-[#FDE68A] hover:border-[#D97706]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#D97706] font-semibold">
            <span className="flex items-center gap-1.5 font-bold">
              <Clock size={15} />
              Approaching SLA Deadline
            </span>
            <span className="font-mono text-xl font-bold">{kpis.dueSoon} cases</span>
          </div>
          <p className="text-[11px] text-[#92400E] mt-1.5 leading-relaxed">
            Within active rule warning threshold. Assigned officers must fast-track inquiry documentation.
          </p>
        </div>

        {/* On Schedule Card */}
        <div
          onClick={() => setFilterState('ON_SCHEDULE')}
          className={`p-4 rounded-xl border transition-all cursor-pointer ${
            filterState === 'ON_SCHEDULE'
              ? 'bg-[#F0FDF4] border-[#16A34A] ring-1 ring-[#16A34A]'
              : 'bg-white border-[#BBF7D0] hover:border-[#16A34A]'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-[#16A34A] font-semibold">
            <span className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 size={15} />
              Comfortably on Schedule
            </span>
            <span className="font-mono text-xl font-bold">{kpis.onSchedule} cases</span>
          </div>
          <p className="text-[11px] text-[#166534] mt-1.5 leading-relaxed">
            Grievances progressing within statutory resolution duration window.
          </p>
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
              className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
            >
              {/* Tracking ID */}
              <td className="py-3 px-4 font-mono font-bold text-[#1B4532] whitespace-nowrap">
                {c.trackingNumber}
              </td>

              {/* Institution */}
              <td className="py-3 px-4 max-w-xs sm:max-w-md">
                <div className="font-semibold text-[#1F2421] truncate group-hover:text-[#1B4532]">
                  {c.institutionName}
                </div>
                <span className="text-[10.5px] text-[#718096] block mt-0.5">
                  {c.categoryLabel} · {c.institutionState}
                </span>
              </td>

              {/* Bureau */}
              <td className="py-3 px-4 whitespace-nowrap">
                <div className="font-medium text-[#1F2421]">{c.bureauName}</div>
                <div className="text-[11px] text-[#718096] mt-0.5">
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
                  <span className="font-bold text-[#DC2626] flex items-center gap-1 font-mono text-xs">
                    <AlertTriangle size={12} />
                    {Math.abs(daysLeft)} days overdue
                  </span>
                ) : daysLeft <= 7 ? (
                  <span className="font-semibold text-[#D97706] font-mono text-xs">
                    {daysLeft} days left
                  </span>
                ) : (
                  <span className="text-[#16A34A] font-mono text-xs">
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
