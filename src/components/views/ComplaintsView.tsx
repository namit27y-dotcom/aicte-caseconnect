import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  AlertTriangle, 
  GitMerge, 
  ChevronRight,
  ChevronLeft,
  Calendar,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { PriorityBadge } from '../ui/PriorityBadge';
import { FilterBar } from '../ui/FilterBar';
import { DataTable } from '../ui/DataTable';
import { EmptyState } from '../ui/EmptyState';
import { PageHeader } from '../ui/PageHeader';
import { Complaint, UserPersona, ComplaintStatus, ComplaintPriority, BureauType } from '../../types';
import { getNow, isComplaintOverdue, getDaysRemaining } from '../../utils/caseMetrics';

export interface ComplaintFilterState {
  status: string;
  bureau: string;
  priority: string;
  institutionId?: string;
  search: string;
}

interface ComplaintsViewProps {
  complaints: Complaint[];
  currentPersona: UserPersona;
  filterState: ComplaintFilterState;
  onUpdateFilter: (filter: Partial<ComplaintFilterState>) => void;
  onResetFilters: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onOpenNewComplaint: () => void;
}

type SortField = 'trackingNumber' | 'institutionName' | 'status' | 'priority' | 'targetDeadline' | 'createdAt';
type SortOrder = 'asc' | 'desc';

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  currentPersona,
  filterState,
  onUpdateFilter,
  onResetFilters,
  onSelectComplaint,
  onOpenNewComplaint,
}) => {
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  const now = getNow();

  // Toggle column sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter complaints
  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      // Status filter
      if (filterState.status !== 'ALL') {
        if (filterState.status === 'OPEN') {
          if (c.status === 'CLOSED') return false;
        } else if (filterState.status === 'OVERDUE') {
          if (!isComplaintOverdue(c, now)) return false;
        } else if (c.status !== filterState.status) {
          return false;
        }
      }

      // Bureau filter
      if (filterState.bureau !== 'ALL' && c.bureau !== filterState.bureau) {
        return false;
      }

      // Priority filter
      if (filterState.priority !== 'ALL' && c.priority !== filterState.priority) {
        return false;
      }

      // Institution filter
      if (filterState.institutionId && filterState.institutionId !== 'ALL' && c.institutionId !== filterState.institutionId) {
        return false;
      }

      // Search query
      if (filterState.search.trim()) {
        const q = filterState.search.toLowerCase();
        const matchTracking = c.trackingNumber.toLowerCase().includes(q);
        const matchInst = c.institutionName.toLowerCase().includes(q);
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchCat = c.categoryLabel.toLowerCase().includes(q);
        if (!matchTracking && !matchInst && !matchTitle && !matchCat) return false;
      }

      return true;
    });
  }, [complaints, filterState, now]);

  // Sort complaints
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'targetDeadline' || sortField === 'createdAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filtered, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sorted.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  // Active filters count
  const activeFilterCount =
    (filterState.status !== 'ALL' ? 1 : 0) +
    (filterState.bureau !== 'ALL' ? 1 : 0) +
    (filterState.priority !== 'ALL' ? 1 : 0) +
    (filterState.institutionId && filterState.institutionId !== 'ALL' ? 1 : 0) +
    (filterState.search.trim() ? 1 : 0);

  // Safe RFC 4180 CSV export with cell formula injection neutralization
  const handleExportCSV = () => {
    const sanitizeCell = (val: string | number | undefined | null): string => {
      if (val === undefined || val === null) return '""';
      let str = String(val);

      // Neutralise cells starting with =, +, -, @ to prevent spreadsheet formula execution
      if (/^[=+\-@]/.test(str)) {
        str = "'" + str;
      }

      // Escape inner quotes
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      'Tracking Number',
      'Institution Name',
      'State',
      'Category',
      'Status',
      'Priority',
      'Bureau',
      'Assigned Officer',
      'Complainant',
      'Created Date',
      'Target Deadline',
      'Is Overdue',
    ];

    const rows = sorted.map((c) => [
      sanitizeCell(c.trackingNumber),
      sanitizeCell(c.institutionName),
      sanitizeCell(c.institutionState),
      sanitizeCell(c.categoryLabel),
      sanitizeCell(c.status),
      sanitizeCell(c.priority),
      sanitizeCell(c.bureauName),
      sanitizeCell(c.assignedOfficerName),
      sanitizeCell(c.complainantName),
      sanitizeCell(c.createdAt.slice(0, 10)),
      sanitizeCell(c.targetDeadline.slice(0, 10)),
      sanitizeCell(isComplaintOverdue(c, now) ? 'YES' : 'NO'),
    ]);

    const csvContent = [headers.map(h => `"${h}"`).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `aicte_complaints_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <PageHeader
        title="Central Grievance Register"
        subtitle="Searchable, audit-backed complaint ledger across technical institutions and AICTE regulatory bureaus"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<Download size={14} />}
              onClick={handleExportCSV}
              disabled={sorted.length === 0}
            >
              Export CSV ({sorted.length})
            </Button>
            <Button variant="primary" size="sm" onClick={onOpenNewComplaint}>
              + Register Grievance
            </Button>
          </>
        }
      />

      {/* Filter Toolbar */}
      <FilterBar
        activeFilterCount={activeFilterCount}
        onClearAll={onResetFilters}
        resultSummary={
          <span>
            Showing <strong className="font-mono text-[#1F2421]">{sorted.length}</strong> of{' '}
            {complaints.length} cases
          </span>
        }
      >
        {/* Search input in filter bar */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search keyword..."
            value={filterState.search}
            onChange={(e) => {
              onUpdateFilter({ search: e.target.value });
              setCurrentPage(1);
            }}
            className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
          />
        </div>

        {/* Status dropdown */}
        <select
          value={filterState.status}
          onChange={(e) => {
            onUpdateFilter({ status: e.target.value });
            setCurrentPage(1);
          }}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">All Open Cases</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_PROCESS">Under Process</option>
          <option value="COORDINATION">In Coordination</option>
          <option value="RESOLUTION_REVIEW">Resolution Review</option>
          <option value="CLOSED">Closed / Disposed</option>
          <option value="OVERDUE">Overdue (SLA Breached)</option>
        </select>

        {/* Bureau dropdown */}
        <select
          value={filterState.bureau}
          onChange={(e) => {
            onUpdateFilter({ bureau: e.target.value });
            setCurrentPage(1);
          }}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Bureaus</option>
          <option value="APPROVAL_BUREAU">Approval Bureau</option>
          <option value="FINANCE_BUREAU">Finance Bureau</option>
          <option value="GRIEVANCE_CELL">Public Grievance Cell</option>
          <option value="POLICY_ACADEMIC">Policy & Academic</option>
          <option value="LEGAL_CELL">Legal & Vigilance</option>
          <option value="RAGGING_PREVENTION">Anti-Ragging Bureau</option>
        </select>

        {/* Priority dropdown */}
        <select
          value={filterState.priority}
          onChange={(e) => {
            onUpdateFilter({ priority: e.target.value });
            setCurrentPage(1);
          }}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Priorities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </FilterBar>

      {/* Complaints Data Table */}
      <DataTable
        ariaLabel="Central Complaints Register"
        isEmpty={sorted.length === 0}
        emptyState={
          <EmptyState
            title="No grievances match the active criteria"
            description="Adjust or reset the search keywords, bureau selection, or workflow status filter."
            actionLabel="Reset All Filters"
            onAction={onResetFilters}
          />
        }
        headers={[
          <button
            onClick={() => handleSort('trackingNumber')}
            className="flex items-center gap-1 hover:text-[#1B4532] cursor-pointer"
          >
            Tracking ID <ArrowUpDown size={11} />
          </button>,
          <button
            onClick={() => handleSort('institutionName')}
            className="flex items-center gap-1 hover:text-[#1B4532] cursor-pointer"
          >
            Institution & Substance <ArrowUpDown size={11} />
          </button>,
          <th className="font-semibold">Bureau & Officer</th>,
          <button
            onClick={() => handleSort('status')}
            className="flex items-center gap-1 hover:text-[#1B4532] cursor-pointer"
          >
            Status <ArrowUpDown size={11} />
          </button>,
          <button
            onClick={() => handleSort('priority')}
            className="flex items-center gap-1 hover:text-[#1B4532] cursor-pointer"
          >
            Priority <ArrowUpDown size={11} />
          </button>,
          <button
            onClick={() => handleSort('targetDeadline')}
            className="flex items-center gap-1 hover:text-[#1B4532] cursor-pointer"
          >
            Target SLA Deadline <ArrowUpDown size={11} />
          </button>,
          <div className="text-right">Actions</div>,
        ]}
      >
        {paginated.map((c) => {
          const overdue = isComplaintOverdue(c, now);
          const daysLeft = getDaysRemaining(c.targetDeadline, now);

          return (
            <tr
              key={c.id}
              onClick={() => onSelectComplaint(c)}
              className="hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
            >
              {/* Tracking ID */}
              <td className="py-3 px-4 font-mono font-bold text-[#1B4532] whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  <span>{c.trackingNumber}</span>
                  {c.overlapCount > 0 && (
                    <span
                      title={`${c.overlapCount} cross-bureau overlap candidates flagged`}
                      className="text-[10px] bg-[#E8EFEA] text-[#1B4532] px-1 py-0.2 rounded border border-[#CDE1D5] flex items-center gap-0.5"
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

              {/* Institution & Substance */}
              <td className="py-3 px-4 max-w-xs sm:max-w-md">
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

              {/* Priority */}
              <td className="py-3 px-4 whitespace-nowrap">
                <PriorityBadge priority={c.priority} size="sm" />
              </td>

              {/* Deadline */}
              <td className="py-3 px-4 whitespace-nowrap font-mono">
                {overdue ? (
                  <div className="text-[#DC2626] font-bold flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>{Math.abs(daysLeft)}d overdue</span>
                  </div>
                ) : (
                  <div className="text-[#1F2421] text-xs">
                    {c.targetDeadline.slice(0, 10)}
                    <span className="text-[10.5px] text-[#718096] block font-sans">
                      {daysLeft}d left
                    </span>
                  </div>
                )}
              </td>

              {/* Actions */}
              <td className="py-3 px-4 text-right whitespace-nowrap">
                <span className="text-[#718096] group-hover:text-[#1B4532] inline-flex items-center gap-1 font-medium text-[11px]">
                  Inspect <ChevronRight size={14} />
                </span>
              </td>
            </tr>
          );
        })}
      </DataTable>

      {/* Pagination controls */}
      {sorted.length > pageSize && (
        <div className="flex items-center justify-between text-xs text-[#5C6460] pt-2">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sorted.length)} of {sorted.length} cases
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              icon={<ChevronLeft size={13} />}
            >
              Previous
            </Button>

            <span className="font-mono text-xs font-semibold px-2">
              Page {currentPage} of {totalPages}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex-row-reverse"
              icon={<ChevronRight size={13} />}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
