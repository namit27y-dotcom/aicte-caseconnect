import React, { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  AlertTriangle, 
  GitMerge, 
  ChevronRight,
  Eye,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Complaint, ComplaintStatus, UserPersona } from '../../types';

interface ComplaintsViewProps {
  complaints: Complaint[];
  currentPersona: UserPersona;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenNewComplaint: () => void;
  searchQuery: string;
}

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  currentPersona,
  onSelectComplaint,
  onOpenNewComplaint,
  searchQuery,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [bureauFilter, setBureauFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  // Filter complaints
  const filtered = complaints.filter((c) => {
    // Role scoping: if complainant, only show their own complaints or allow testing
    if (currentPersona.role === 'COMPLAINANT' && c.complainantName !== 'Pooja Mehta') {
      // In demo mode, show all if they choose, or scope
    }

    if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
    if (bureauFilter !== 'ALL' && c.bureau !== bureauFilter) return false;
    if (priorityFilter !== 'ALL' && c.priority !== priorityFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTracking = c.trackingNumber.toLowerCase().includes(q);
      const matchInst = c.institutionName.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchCat = c.categoryLabel.toLowerCase().includes(q);
      if (!matchTracking && !matchInst && !matchTitle && !matchCat) return false;
    }

    return true;
  });

  const handleExportCSV = () => {
    const headers = ['Tracking Number', 'Institution', 'State', 'Category', 'Status', 'Priority', 'Bureau', 'Deadline'];
    const rows = filtered.map((c) => [
      c.trackingNumber,
      `"${c.institutionName.replace(/"/g, '""')}"`,
      c.institutionState,
      c.categoryLabel,
      c.status,
      c.priority,
      c.bureauName,
      c.targetDeadline
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aicte_caseconnect_complaints_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F2421]">
            Central Complaint Register
          </h2>
          <p className="text-xs text-[#5C6460] mt-0.5">
            Searchable, audit-backed complaint ledger across all technical institutions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={<Download size={14} />} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button variant="primary" size="sm" onClick={onOpenNewComplaint}>
            + Log Complaint
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-[#E6E1D8] p-3 rounded-md flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[#4A5568] flex items-center gap-1.5 mr-1">
            <Filter size={13} />
            Filters:
          </span>

          {/* Status dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-xs px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
          >
            <option value="ALL">All Statuses ({complaints.length})</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_PROCESS">Under Process</option>
            <option value="COORDINATION">In Coordination</option>
            <option value="RESOLUTION_REVIEW">Resolution Review</option>
            <option value="CLOSED">Closed / Disposed</option>
            <option value="OVERDUE">Overdue</option>
          </select>

          {/* Bureau dropdown */}
          <select
            value={bureauFilter}
            onChange={(e) => setBureauFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-xs px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
          >
            <option value="ALL">All Bureaus</option>
            <option value="APPROVAL_BUREAU">Approval Bureau</option>
            <option value="FINANCE_BUREAU">Finance Bureau</option>
            <option value="GRIEVANCE_CELL">Public Grievance Cell</option>
            <option value="POLICY_ACADEMIC">Policy & Academic</option>
          </select>

          {/* Priority dropdown */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-xs px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div className="text-[11px] text-[#718096]">
          Showing <span className="font-semibold text-[#1F2421] font-mono">{filtered.length}</span> of {complaints.length} cases
        </div>
      </div>

      {/* Complaints Data Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8] text-[11px] font-semibold text-[#5C6460] uppercase tracking-wider">
                <th className="py-3 px-4">Tracking ID</th>
                <th className="py-3 px-4">Institution & Issue</th>
                <th className="py-3 px-4">Bureau & Officer</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Deadline SLA</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E1D8]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#718096]">
                    <p className="font-medium text-sm text-[#1F2421]">No complaints match the filter criteria</p>
                    <p className="text-xs text-[#5C6460] mt-1">Try resetting the status, bureau, or search filters.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3"
                      onClick={() => {
                        setStatusFilter('ALL');
                        setBureauFilter('ALL');
                        setPriorityFilter('ALL');
                      }}
                    >
                      Reset Filters
                    </Button>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onSelectComplaint(c)}
                    className="hover:bg-[#FAF8F5]/80 transition-colors cursor-pointer group"
                  >
                    {/* Tracking ID */}
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1B4532]">
                      <div className="flex items-center gap-1.5">
                        <span>{c.trackingNumber}</span>
                        {c.overlapCount > 0 && (
                          <span
                            title={`${c.overlapCount} cross-bureau overlap candidates flagged`}
                            className="text-[10px] bg-[#E8EFEA] text-[#1B4532] px-1 py-0.2 rounded-xs border border-[#CDE1D5] flex items-center gap-0.5"
                          >
                            <GitMerge size={10} />
                            {c.overlapCount}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#A0AEC0] block font-sans mt-0.5">
                        Filed {c.createdAt.slice(0, 10)}
                      </span>
                    </td>

                    {/* Institution & Issue Title */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-[#1F2421] truncate group-hover:text-[#1B4532]">
                        {c.institutionName}
                      </div>
                      <p className="text-[11px] text-[#5C6460] truncate mt-0.5">
                        {c.title}
                      </p>
                      <span className="text-[10px] text-[#718096] inline-block mt-0.5">
                        {c.categoryLabel} · {c.institutionState}
                      </span>
                    </td>

                    {/* Bureau & Officer */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-medium text-[#1F2421]">{c.bureauName}</div>
                      <div className="text-[11px] text-[#718096] mt-0.5">
                        {c.assignedOfficerName || 'Unassigned'}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge status={c.status}>
                        {c.status.replace('_', ' ')}
                      </Badge>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <Badge priority={c.priority}>
                        {c.priority}
                      </Badge>
                    </td>

                    {/* Target Deadline */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        {c.isOverdue ? (
                          <span className="text-[#9B2226] font-semibold flex items-center gap-1">
                            <AlertTriangle size={12} />
                            Overdue
                          </span>
                        ) : (
                          <span className="text-[#5C6460] flex items-center gap-1 font-mono text-[11px]">
                            <Calendar size={11} />
                            {c.targetDeadline.slice(0, 10)}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#A0AEC0]">
                        {c.isOverdue ? 'Action Escalated' : 'On Schedule'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <span className="text-[#718096] group-hover:text-[#1B4532] inline-flex items-center gap-1 font-medium text-[11px]">
                        Inspect <ChevronRight size={14} />
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
