import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Building2, 
  Clock, 
  AlertTriangle, 
  GitMerge, 
  Calendar, 
  User, 
  CheckCircle2, 
  History,
  Send,
  ArrowRight
} from 'lucide-react';
import { Complaint, ComplaintStatus, UserPersona } from '../../types';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

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
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>('UNDER_PROCESS');
  const [statusReason, setStatusReason] = useState('');
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);

  if (!complaint) return null;

  const canUpdateStatus = currentPersona.role !== 'COMPLAINANT';

  const handleApplyStatusChange = () => {
    if (!statusReason.trim()) return;
    onStatusChange(complaint.id, selectedStatus, statusReason);
    setShowStatusUpdate(false);
    setStatusReason('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1F2421]/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white border-l border-[#E6E1D8] shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-[#E6E1D8] bg-[#FAF8F5] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-base text-[#1B4532]">
                  {complaint.trackingNumber}
                </span>
                <Badge status={complaint.status}>
                  {complaint.status.replace('_', ' ')}
                </Badge>
                <Badge priority={complaint.priority}>
                  {complaint.priority}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-[#1F2421] mt-1.5 leading-snug">
                {complaint.title}
              </h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#718096] hover:text-[#1F2421] rounded-md hover:bg-black/5"
            >
              <X size={20} />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
            {/* Institution & Complainant strip */}
            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF8F5] border border-[#E6E1D8] rounded-sm">
              <div>
                <span className="text-[10px] text-[#718096] uppercase font-semibold block">Target Institution</span>
                <p className="font-semibold text-[#1F2421] mt-0.5">{complaint.institutionName}</p>
                <span className="text-[10px] text-[#5C6460] block mt-0.5">{complaint.institutionState}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#718096] uppercase font-semibold block">Complainant</span>
                <p className="font-semibold text-[#1F2421] mt-0.5">{complaint.complainantName}</p>
                <span className="text-[10px] text-[#5C6460] block mt-0.5">Category: {complaint.complainantType}</span>
              </div>
            </div>

            {/* Case Details */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-2">
                Case Substance & Allegations
              </h4>
              <div className="p-4 bg-white border border-[#E6E1D8] rounded-sm leading-relaxed text-[#1F2421]">
                {complaint.description}
              </div>
            </div>

            {/* Bureau Assignment & SLA */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white border border-[#E6E1D8] rounded-sm">
                <span className="text-[10px] text-[#718096] uppercase font-semibold block">Assigned Bureau</span>
                <p className="font-semibold text-[#1F2421] mt-0.5">{complaint.bureauName}</p>
                <span className="text-[10px] text-[#718096] block mt-0.5">
                  Officer: {complaint.assignedOfficerName || 'Pending'}
                </span>
              </div>

              <div className="p-3 bg-white border border-[#E6E1D8] rounded-sm">
                <span className="text-[10px] text-[#718096] uppercase font-semibold block">Target SLA Deadline</span>
                <p className={`font-mono font-bold mt-0.5 ${complaint.isOverdue ? 'text-[#9B2226]' : 'text-[#1F2421]'}`}>
                  {complaint.targetDeadline.slice(0, 10)}
                </p>
                <span className="text-[10px] text-[#718096] block mt-0.5">
                  {complaint.isOverdue ? 'Statutory SLA Exceeded' : 'On Schedule'}
                </span>
              </div>
            </div>

            {/* Overlap Indicator */}
            {complaint.overlapCount > 0 && (
              <div className="p-3.5 bg-[#F7FAF8] border border-[#CDE1D5] rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitMerge size={16} className="text-[#1B4532]" />
                  <div>
                    <span className="font-semibold text-[#1B4532] block">
                      {complaint.overlapCount} Potential Overlapping Cases Flagged
                    </span>
                    <span className="text-[11px] text-[#5C6460]">
                      Detected cross-bureau correlation with shared institution
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
                  Inspect Overlap
                </Button>
              </div>
            )}

            {/* Status Mutation Form (Officer / Admin) */}
            {canUpdateStatus && (
              <div className="p-4 bg-[#FAF8F5] border border-[#E6E1D8] rounded-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-[#1F2421]">
                    Workflow Status Mutation
                  </span>
                  <button
                    onClick={() => setShowStatusUpdate(!showStatusUpdate)}
                    className="text-xs text-[#1B4532] font-semibold hover:underline"
                  >
                    {showStatusUpdate ? 'Cancel' : 'Update Status'}
                  </button>
                </div>

                {showStatusUpdate && (
                  <div className="space-y-3 pt-2">
                    <div>
                      <label className="block text-[11px] text-[#718096] mb-1 font-medium">New Status:</label>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as ComplaintStatus)}
                        className="w-full bg-white border border-[#D5CEC2] rounded-xs px-2.5 py-1.5 text-xs text-[#1F2421]"
                      >
                        <option value="UNDER_PROCESS">Under Process</option>
                        <option value="COORDINATION">Coordination (Multi-Bureau)</option>
                        <option value="RESOLUTION_REVIEW">Resolution Review</option>
                        <option value="CLOSED">Closed (Disposed)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-[#718096] mb-1 font-medium">
                        Audit Justification (Required for Section 7 Rule 7):
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Received compliance affidavit from institute registrar"
                        value={statusReason}
                        onChange={(e) => setStatusReason(e.target.value)}
                        className="w-full bg-white border border-[#D5CEC2] rounded-xs px-2.5 py-1.5 text-xs text-[#1F2421]"
                      />
                    </div>

                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleApplyStatusChange}
                      disabled={!statusReason.trim()}
                    >
                      Commit Status Change to Audit Trail
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Chronological Event History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-3 flex items-center gap-1.5">
                <History size={14} />
                Chronological Case Event History
              </h4>

              <div className="space-y-3 pl-2 border-l-2 border-[#E6E1D8]">
                {complaint.events.map((event) => (
                  <div key={event.id} className="relative pl-4 space-y-0.5">
                    <div className="absolute -left-[13px] top-1 w-2.5 h-2.5 rounded-full bg-[#1B4532] border-2 border-white" />
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-[#1F2421]">{event.action.replace(/_/g, ' ')}</span>
                      <span className="text-[#A0AEC0] font-mono">{event.timestamp.slice(0, 10)}</span>
                    </div>
                    <p className="text-[#5C6460] leading-relaxed">{event.description}</p>
                    <span className="text-[10px] text-[#718096] block">
                      Actor: {event.actor} ({event.actorRole})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-between">
            <span className="text-[10px] font-mono text-[#718096]">
              Immutable Record Ref: {complaint.id}
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
