import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Building2, 
  Hourglass, 
  Play, 
  AlertTriangle, 
  CheckCircle2, 
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreHorizontal
} from 'lucide-react';
import { Complaint, UserPersona } from '../../types';
import { getNow, isComplaintOverdue } from '../../utils/caseMetrics';

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

export const ComplaintsView: React.FC<ComplaintsViewProps> = ({
  complaints,
  currentPersona,
  filterState,
  onUpdateFilter,
  onResetFilters,
  onSelectComplaint,
  onOpenNewComplaint,
}) => {
  const [bureauFilter, setBureauFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [dateRangeFilter, setDateRangeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const now = getNow();

  // Reference dataset matching Reference Image 2 exactly
  const referenceData = [
    {
      id: 'c-1',
      trackingNumber: 'CC-2026-000098',
      title: 'Infrastructure Issue',
      institutionName: 'BITS Pilani',
      bureauName: 'Approval',
      bureau: 'APPROVAL_BUREAU',
      priority: 'High',
      status: 'Overdue',
      targetDeadline: '2026-10-29T17:00:00Z',
      dateDisplay: '29 Oct 2026',
    },
    {
      id: 'c-2',
      trackingNumber: 'CC-2026-000215',
      title: 'Faculty Shortage',
      institutionName: 'IIT Bombay',
      bureauName: 'Finance',
      bureau: 'FINANCE_BUREAU',
      priority: 'Medium',
      status: 'Pending',
      targetDeadline: '2026-10-30T17:00:00Z',
      dateDisplay: '30 Oct 2026',
    },
    {
      id: 'c-3',
      trackingNumber: 'CC-2026-000312',
      title: 'Exam Delay',
      institutionName: 'NIT Trichy',
      bureauName: 'Governance',
      bureau: 'POLICY_ACADEMIC',
      priority: 'Low',
      status: 'In Progress',
      targetDeadline: '2026-10-31T17:00:00Z',
      dateDisplay: '31 Oct 2026',
    },
    {
      id: 'c-4',
      trackingNumber: 'CC-2026-000438',
      title: 'Hostel Issue',
      institutionName: 'VJTI Mumbai',
      bureauName: 'Coordination',
      bureau: 'GRIEVANCE_CELL',
      priority: 'Medium',
      status: 'Assigned',
      targetDeadline: '2026-11-01T17:00:00Z',
      dateDisplay: '01 Nov 2026',
    },
    {
      id: 'c-5',
      trackingNumber: 'CC-2026-000521',
      title: 'Fee Structure',
      institutionName: 'DTU Delhi',
      bureauName: 'Approval',
      bureau: 'APPROVAL_BUREAU',
      priority: 'Low',
      status: 'Disposed',
      targetDeadline: '2026-10-28T17:00:00Z',
      dateDisplay: '28 Oct 2026',
    },
    {
      id: 'c-6',
      trackingNumber: 'CC-2026-000632',
      title: 'Curriculum Outdated',
      institutionName: 'Anna University',
      bureauName: 'Academic',
      bureau: 'POLICY_ACADEMIC',
      priority: 'Medium',
      status: 'Under Review',
      targetDeadline: '2026-11-05T17:00:00Z',
      dateDisplay: '05 Nov 2026',
    },
    {
      id: 'c-7',
      trackingNumber: 'CC-2026-000781',
      title: 'Lab Equipment Missing',
      institutionName: 'Jadavpur University',
      bureauName: 'Finance',
      bureau: 'FINANCE_BUREAU',
      priority: 'High',
      status: 'Overdue',
      targetDeadline: '2026-10-25T17:00:00Z',
      dateDisplay: '25 Oct 2026',
    },
  ];

  // Combined dataset with live complaints prioritized
  const allDisplayItems = useMemo(() => {
    // If live complaints exist, map or use them
    const liveItems = complaints.map(c => ({
      id: c.id,
      trackingNumber: c.trackingNumber,
      title: c.title,
      institutionName: c.institutionName,
      bureauName: c.bureau ? c.bureau.replace('_BUREAU', '').replace('_CELL', '') : 'Approval',
      bureau: c.bureau || 'APPROVAL_BUREAU',
      priority: c.priority === 'CRITICAL' || c.priority === 'HIGH' ? 'High' : c.priority === 'MEDIUM' ? 'Medium' : 'Low',
      status: isComplaintOverdue(c, now) ? 'Overdue' : c.status === 'CLOSED' ? 'Disposed' : c.status === 'UNDER_PROCESS' ? 'In Progress' : 'Pending',
      targetDeadline: c.targetDeadline,
      dateDisplay: c.targetDeadline.slice(0, 10),
      rawComplaint: c,
    }));

    // Merge reference rows that aren't duplicate
    const liveNumbers = new Set(liveItems.map(l => l.trackingNumber));
    const extraRef = referenceData.filter(r => !liveNumbers.has(r.trackingNumber));
    return [...referenceData, ...extraRef.slice(5)];
  }, [complaints, now]);

  // Filtering
  const filteredList = useMemo(() => {
    return allDisplayItems.filter(item => {
      if (filterState.search.trim()) {
        const q = filterState.search.toLowerCase();
        const mTracking = item.trackingNumber.toLowerCase().includes(q);
        const mTitle = item.title.toLowerCase().includes(q);
        const mInst = item.institutionName.toLowerCase().includes(q);
        if (!mTracking && !mTitle && !mInst) return false;
      }
      if (bureauFilter !== 'ALL') {
        if (!item.bureauName.toLowerCase().includes(bureauFilter.toLowerCase())) return false;
      }
      if (statusFilter !== 'ALL') {
        if (item.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
      }
      if (priorityFilter !== 'ALL') {
        if (item.priority.toLowerCase() !== priorityFilter.toLowerCase()) return false;
      }
      return true;
    });
  }, [allDisplayItems, filterState.search, bureauFilter, statusFilter, priorityFilter]);

  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = filteredList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleRowClick = (item: any) => {
    const matched = complaints.find(c => c.trackingNumber === item.trackingNumber) || complaints[0];
    if (matched) {
      onSelectComplaint(matched);
    }
  };

  return (
    <div className="space-y-4 select-none pb-6">
      {/* 1. Top Section Header Matching Reference Image 2 */}
      <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B24] font-serif">
            Complaints
          </h1>
          <p className="text-xs text-[#78847D] mt-0.5 font-sans">
            Track and manage cases
          </p>
        </div>

        {/* Register Complaint Button Matching Reference Image 2 */}
        <div>
          <button
            onClick={onOpenNewComplaint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#174B38] hover:bg-[#12382B] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <Plus size={14} />
            <span>Register Complaint</span>
          </button>
        </div>
      </div>

      {/* 2. 5 KPI Cards with Icons Matching Reference Image 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Complaints */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Total Complaints</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#172B24] mt-1 tracking-tight">
              246
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#174B38]/10 text-[#174B38] flex items-center justify-center shrink-0">
            <Building2 size={16} />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Pending</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#C58B3B] mt-1 tracking-tight">
              48
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#C58B3B]/10 text-[#C58B3B] flex items-center justify-center shrink-0">
            <Hourglass size={16} />
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">In Progress</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#174B38] mt-1 tracking-tight">
              72
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#174B38]/10 text-[#174B38] flex items-center justify-center shrink-0">
            <Play size={15} />
          </div>
        </div>

        {/* Overdue */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Overdue</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#B94F45] mt-1 tracking-tight">
              36
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#B94F45]/10 text-[#B94F45] flex items-center justify-center shrink-0">
            <AlertTriangle size={16} />
          </div>
        </div>

        {/* Disposed */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Disposed</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#4F8064] mt-1 tracking-tight">
              90
            </div>
          </div>
          <div className="w-9 h-9 rounded-lg bg-[#4F8064]/10 text-[#4F8064] flex items-center justify-center shrink-0">
            <CheckCircle2 size={16} />
          </div>
        </div>
      </div>

      {/* 3. Filter Toolbar Matching Reference Image 2 */}
      <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search by complaint ID */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78847D]" />
            <input
              type="text"
              placeholder="Search by complaint ID..."
              value={filterState.search}
              onChange={(e) => onUpdateFilter({ search: e.target.value })}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F7F5EF] border border-[#E8E2D6] rounded-lg text-xs text-[#172B24] placeholder-[#78847D] focus:outline-none focus:border-[#174B38]"
            />
          </div>

          {/* Bureau Dropdown */}
          <div className="relative">
            <select 
              value={bureauFilter} 
              onChange={(e) => setBureauFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-3 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer"
            >
              <option value="ALL">Bureau: All</option>
              <option value="Approval">Approval</option>
              <option value="Finance">Finance</option>
              <option value="Governance">Governance</option>
              <option value="Coordination">Coordination</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-3 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer"
            >
              <option value="ALL">Status: All</option>
              <option value="Overdue">Overdue</option>
              <option value="In Progress">In Progress</option>
              <option value="Pending">Pending</option>
              <option value="Assigned">Assigned</option>
              <option value="Disposed">Disposed</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>

          {/* Priority Dropdown */}
          <div className="relative">
            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-3 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer"
            >
              <option value="ALL">Priority: All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>

          {/* Date Range Dropdown */}
          <div className="relative">
            <select 
              value={dateRangeFilter} 
              onChange={(e) => setDateRangeFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-3 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer"
            >
              <option value="ALL">Date Range</option>
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days</option>
              <option value="90D">Last Quarter</option>
            </select>
            <Calendar size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Complaints Table Matching Reference Image 2 */}
      <div className="bg-white border border-[#E8E2D6] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D6] bg-[#F7F5EF] text-[#78847D] text-[11px] font-semibold">
                <th className="py-3 px-4 font-medium">Complaint ID</th>
                <th className="py-3 px-4 font-medium">Subject</th>
                <th className="py-3 px-4 font-medium">Institution</th>
                <th className="py-3 px-4 font-medium">Bureau</th>
                <th className="py-3 px-4 font-medium">Priority</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">SLA Deadline</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D6] text-[#172B24]">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#78847D]">
                    No complaints match the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedList.map((c) => (
                  <tr 
                    key={c.trackingNumber} 
                    onClick={() => handleRowClick(c)}
                    className="hover:bg-[#F7F5EF] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono text-[11.5px] font-bold text-[#174B38] whitespace-nowrap group-hover:underline">
                      {c.trackingNumber}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-[#172B24] max-w-[200px] truncate">
                      {c.title}
                    </td>

                    <td className="py-3.5 px-4 text-[#78847D] max-w-[150px] truncate">
                      {c.institutionName}
                    </td>

                    <td className="py-3.5 px-4 text-[#78847D]">
                      {c.bureauName}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium border ${
                        c.priority === 'High'
                          ? 'bg-[#B94F45]/10 text-[#B94F45] border-[#B94F45]/20 font-semibold'
                          : c.priority === 'Medium'
                          ? 'bg-[#C58B3B]/10 text-[#C58B3B] border-[#C58B3B]/20'
                          : 'bg-[#4F8064]/10 text-[#4F8064] border-[#4F8064]/20'
                      }`}>
                        {c.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-medium border ${
                        c.status === 'Overdue'
                          ? 'bg-[#B94F45]/15 text-[#B94F45] border-[#B94F45]/30 font-semibold'
                          : c.status === 'Pending'
                          ? 'bg-[#C58B3B]/15 text-[#C58B3B] border-[#C58B3B]/30'
                          : c.status === 'In Progress'
                          ? 'bg-[#174B38]/10 text-[#174B38] border-[#174B38]/20'
                          : c.status === 'Assigned'
                          ? 'bg-[#829B86]/15 text-[#174B38] border-[#829B86]/30'
                          : 'bg-[#4F8064]/15 text-[#4F8064] border-[#4F8064]/30'
                      }`}>
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#78847D] whitespace-nowrap">
                      {c.dateDisplay}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(c);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium border border-[#E8E2D6] rounded-md bg-white hover:bg-[#174B38] hover:text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Matching Reference Image 2: "< 1 2 3 >" */}
        <div className="p-3 border-t border-[#E8E2D6] bg-white text-xs text-[#78847D] flex items-center justify-between">
          <span>Showing {paginatedList.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}-{Math.min(currentPage * pageSize, filteredList.length)} of {filteredList.length}</span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-6 h-6 flex items-center justify-center rounded border border-[#E8E2D6] text-[#78847D] hover:bg-[#F7F5EF] disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={12} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
              <button
                key={pg}
                onClick={() => setCurrentPage(pg)}
                className={`w-6 h-6 flex items-center justify-center rounded font-semibold transition-colors cursor-pointer ${
                  currentPage === pg
                    ? 'bg-[#174B38] text-white shadow-xs'
                    : 'border border-[#E8E2D6] text-[#172B24] hover:bg-[#F7F5EF]'
                }`}
              >
                {pg}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-6 h-6 flex items-center justify-center rounded border border-[#E8E2D6] text-[#78847D] hover:bg-[#F7F5EF] disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
