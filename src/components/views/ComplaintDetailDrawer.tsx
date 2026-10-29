import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Building2, 
  Clock, 
  AlertTriangle, 
  GitMerge, 
  Calendar, 
  User, 
  History,
  Send,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Complaint, ComplaintStatus, UserPersona } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { PriorityBadge } from '../ui/PriorityBadge';
import { Button } from '../ui/Button';
import { 
  getNextAllowedStatuses, 
  STATUS_LABELS, 
  validateTransition 
} from '../../utils/workflow';
import { can } from '../../utils/permissions';
import { getNow, isComplaintOverdue, getDaysRemaining } from '../../utils/caseMetrics';

interface ComplaintDetailDrawerProps {
  complaint: Complaint | null;
  onClose: () => void;
  currentPersona: UserPersona;
  onStatusChange: (complaintId: string, newStatus: ComplaintStatus, reason: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const ComplaintDetailDrawer: React.FC<ComplaintDetailDrawerProps> = ({
  complaint,
  onClose,
  currentPersona,
  onStatusChange,
  onNavigateTab,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | ''>('');
  const [statusReason, setStatusReason] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const drawerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  // Focus and Escape key handling
  useEffect(() => {
    if (complaint) {
      previouslyFocusedElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // Default the selected status to the first allowed transition
      const nextAllowed = getNextAllowedStatuses(complaint.status);
      setSelectedStatus(nextAllowed.length > 0 ? nextAllowed[0] : '');
      setStatusReason('');
      setValidationError(null);

      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
        if (previouslyFocusedElement.current) {
          previouslyFocusedElement.current.focus();
        }
      };
    }
  }, [complaint, onClose]);

  if (!complaint) return null;

  const now = getNow();
  const overdue = isComplaintOverdue(complaint, now);
  const daysLeft = getDaysRemaining(complaint.targetDeadline, now);

  const permission = can(currentPersona, 'CHANGE_STATUS', { complaint });
  const nextAllowed = getNextAllowedStatuses(complaint.status);

  const handleApplyStatusChange = () => {
    if (!selectedStatus) return;
    const validation = validateTransition(complaint.status, selectedStatus, statusReason);
    if (!validation.valid) {
      setValidationError(validation.error || 'Validation failed.');
      return;
    }

    onStatusChange(complaint.id, selectedStatus, statusReason.trim());
    setStatusReason('');
    setValidationError(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="w-screen max-w-xl bg-white border-l border-[#E6E1D8] shadow-2xl flex flex-col focus:outline-none"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E6E1D8] bg-[#FAF8F5] flex items-start justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono font-bold text-base text-[#1B4532]">
                  {complaint.trackingNumber}
                </span>
                <StatusBadge status={complaint.status} size="sm" />
                <PriorityBadge priority={complaint.priority} size="sm" />
              </div>
              <h2 id="drawer-title" className="text-base font-bold text-[#1F2421] leading-snug">
                {complaint.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#718096] hover:text-[#1F2421] rounded-md hover:bg-black/5"
              aria-label="Close inspector"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
            {/* Institution & Complainant strip */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF8F5] border border-[#E6E1D8] rounded-lg">
              <div>
                <span className="text-[10px] text-[#718096] uppercase font-semibold block">
                  Institution
                </span>
                <p className="font-semibold text-[#1F2421] mt-0.5">{complaint.institutionName}</p>
                <span className="text-[10.5px] text-[#5C6460] block mt-0.5">{complaint.institutionState}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] uppercase font-semibold block">
                  Complainant
                </span>
                <p className="font-semibold text-[#1F2421] mt-0.5">{complaint.complainantName}</p>
                <span className="text-[10.5px] text-[#5C6460] block mt-0.5">
                  Type: {complaint.complainantType}
                </span>
              </div>
            </div>

            {/* Case Details */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-2">
                Case Substance & Allegations
              </h3>
              <div className="p-4 bg-white border border-[#E6E1D8] rounded-lg leading-relaxed text-[#1F2421]">
                {complaint.description}
              </div>
            </div>

            {/* Bureau Assignment & SLA */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-[#E6E1D8] rounded-lg">
                <span className="text-[10px] text-[#718096] uppercase font-semibold block">
                  Assigned Bureau
                </span>
                <p className="font-semibold text-[#1F2421] mt-0.5">{complaint.bureauName}</p>
                <span className="text-[10.5px] text-[#718096] block mt-0.5">
                  Officer: {complaint.assignedOfficerName || 'Pending Assignment'}
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E6E1D8] rounded-lg">
                <span className="text-[10px] text-[#718096] uppercase font-semibold block">
                  Target SLA Deadline
                </span>
                <p
                  className={`font-mono font-bold mt-0.5 ${
                    overdue ? 'text-[#DC2626]' : 'text-[#1F2421]'
                  }`}
                >
                  {complaint.targetDeadline.slice(0, 10)}
                </p>
                <span className="text-[10.5px] text-[#718096] block mt-0.5 font-sans">
                  {overdue ? (
                    <span className="text-[#DC2626] font-semibold flex items-center gap-1">
                      <AlertTriangle size={11} />
                      Exceeded by {Math.abs(daysLeft)} days
                    </span>
                  ) : (
                    <span>{daysLeft} days remaining</span>
                  )}
                </span>
              </div>
            </div>

            {/* Overlap Indicator */}
            {complaint.overlapCount > 0 && (
              <div className="p-3.5 bg-[#F7FAF8] border border-[#CDE1D5] rounded-lg flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <GitMerge size={16} className="text-[#1B4532] shrink-0" />
                  <div>
                    <span className="font-semibold text-[#1B4532] block">
                      {complaint.overlapCount} Potential Overlapping Cases Flagged
                    </span>
                    <span className="text-[11px] text-[#5C6460]">
                      Cross-bureau correlation detected for this institution
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onClose();
                    onNavigateTab('coordination');
                  }}
                >
                  Inspect Overlaps
                </Button>
              </div>
            )}

            {/* Workflow Transition Card */}
            <div className="p-4 bg-[#FAF8F5] border border-[#E6E1D8] rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-[#1F2421]">
                  Workflow State Mutation
                </span>
                <span className="text-[11px] text-[#718096] font-mono">
                  Current: {STATUS_LABELS[complaint.status]}
                </span>
              </div>

              {/* Disabled permission reason if user cannot change status */}
              {!permission.allowed ? (
                <div className="p-3 bg-[#FEF2F2] border border-[#FECACA] rounded-md text-[#991B1B] text-[11px] flex items-start gap-2">
                  <ShieldAlert size={14} className="shrink-0 mt-0.5 text-[#DC2626]" />
                  <span>{permission.reason}</span>
                </div>
              ) : nextAllowed.length === 0 ? (
                <div className="p-3 bg-[#F0FDF4] border border-[#BBF7D0] rounded-md text-[#15803D] text-[11px] flex items-center gap-2">
                  <Info size={14} className="shrink-0 text-[#16A34A]" />
                  <span>This case is Closed / Disposed. Closed status is a terminal state.</span>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">
                      Next Valid Workflow Status:
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                      className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-1.5 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
                    >
                      {nextAllowed.map((status) => (
                        <option key={status} value={status}>
                          {STATUS_LABELS[status]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#4A5568] mb-1">
                      Audit Justification (Required for legal audit trail):
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Received compliance affidavit from institute registrar"
                      value={statusReason}
                      onChange={(e) => {
                        setStatusReason(e.target.value);
                        setValidationError(null);
                      }}
                      className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-1.5 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
                    />
                    {validationError && (
                      <p className="text-[11px] text-[#DC2626] font-medium mt-1">
                        {validationError}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleApplyStatusChange}
                    disabled={!statusReason.trim()}
                    className="w-full justify-center"
                  >
                    Commit Status Change to Immutable Audit Log
                  </Button>
                </div>
              )}
            </div>

            {/* Chronological Event History */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-3 flex items-center gap-1.5">
                <History size={14} />
                Chronological Case Event History
              </h3>

              <div className="space-y-3 pl-2 border-l-2 border-[#E6E1D8]">
                {complaint.events.map((event) => (
                  <div key={event.id} className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#1B4532] border-2 border-white" />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#1F2421]">
                        {event.action.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[#A0AEC0] font-mono">{event.timestamp.slice(0, 10)}</span>
                    </div>
                    <p className="text-[#5C6460] leading-relaxed">{event.description}</p>
                    <span className="text-[10px] text-[#718096] block font-mono">
                      Actor: {event.actor} ({event.actorRole})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-between">
            <span className="text-[10.5px] font-mono text-[#718096]">
              Immutable Case Ref: {complaint.id}
            </span>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close Inspector
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
