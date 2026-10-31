import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus
} from 'lucide-react';
import { Complaint, UserPersona } from '../../types';
import { getNow, isComplaintOverdue } from '../../utils/caseMetrics';
import { StatusBadge } from '../ui/StatusBadge';
import { PriorityBadge } from '../ui/PriorityBadge';

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
  const [bureauSelect, setBureauSelect] = useState('ALL');
  const [statusSelect, setStatusSelect] = useState('ALL');
  const [prioritySelect, setPrioritySelect] = useState('ALL');

  const now = getNow();

  // Mock complaints list strictly matching Reference Image 1 & 2
  const referenceComplaints = [
    {
      id: 'CC-2026-000098',
      subject: 'Infrastructure Issue',
      institution: 'BITS Pilani',
      bureau: 'Approval',
      priority: 'High',
      status: 'Overdue',
      deadline: '29 Oct 2026',
    },
    {
      id: 'CC-2026-000215',
      subject: 'Faculty Shortage',
      institution: 'IIT Bombay',
      bureau: 'Finance',
      priority: 'Medium',
      status: 'Pending',
      deadline: '30 Oct 2026',
    },
    {
      id: 'CC-2026-000312',
      subject: 'Exam Delay',
      institution: 'NIT Trichy',
      bureau: 'Governance',
      priority: 'Low',
      status: 'In Progress',
      deadline: '31 Oct 2026',
    },
    {
      id: 'CC-2026-000438',
      subject: 'Hostel Issue',
      institution: 'VJTI Mumbai',
      bureau: 'Coordination',
      priority: 'Medium',
      status: 'Assigned',
      deadline: '01 Nov 2026',
    },
    {
      id: 'CC-2026-000521',
      subject: 'Fee Structure',
      institution: 'DTU Delhi',
      bureau: 'Approval',
      priority: 'Low',
      status: 'Disposed',
      deadline: '28 Oct 2026',
    },
  ];

  return (
    <div className="space-y-3.5 select-none pb-6">
      {/* 1. Header with Document photograph banner matching Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#252D27] font-heading">
            Complaints
          </h1>
          <p className="text-xs text-[#737A72] mt-0.5">
            Track and manage complaints
          </p>
        </div>

        {/* Thumbnail preview photograph on right */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-36 h-16 rounded-lg overflow-hidden border border-[#E7E4DB]">
            <img 
              src="/assets/banner-complaints.jpg" 
              alt="Complaints Management" 
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={onOpenNewComplaint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#193B2A] hover:bg-[#142B21] text-white rounded-md text-xs font-medium cursor-pointer shadow-2xs transition-colors shrink-0"
          >
            <Plus size={13} />
            <span>Register Complaint</span>
          </button>
        </div>
      </div>

      {/* 2. 5 KPI Cards matching Image 1: Total (142 / 246) | Pending (48) | In Progress (52 / 72) | Overdue (20 / 36) | Disposed (22 / 90) */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Total</span>
          <div className="text-2xl font-bold font-sans text-[#252D27] mt-0.5 tabular-nums">
            142
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Pending</span>
          <div className="text-2xl font-bold font-sans text-[#C58B3B] mt-0.5 tabular-nums">
            48
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">In Progress</span>
          <div className="text-2xl font-bold font-sans text-[#193B2A] mt-0.5 tabular-nums">
            52
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Overdue</span>
          <div className="text-2xl font-bold font-sans text-[#B94F45] mt-0.5 tabular-nums">
            20
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Disposed</span>
          <div className="text-2xl font-bold font-sans text-[#4F8064] mt-0.5 tabular-nums">
            22
          </div>
        </div>
      </div>

      {/* 3. Filter Toolbar matching Reference Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-2 flex-1">
          <div className="relative min-w-[200px] flex-1 max-w-xs">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737A72]" />
            <input
              type="text"
              placeholder="Search complaint..."
              value={filterState.search}
              onChange={(e) => onUpdateFilter({ search: e.target.value })}
              className="w-full pl-8 pr-3 py-1 bg-[#F7F5EF] border border-[#E7E4DB] rounded-md text-xs text-[#252D27] placeholder-[#737A72] focus:outline-none focus:border-[#193B2A]"
            />
          </div>

          <select 
            value={bureauSelect} 
            onChange={(e) => setBureauSelect(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option value="ALL">All Bureaus</option>
            <option value="Approval">Approval</option>
            <option value="Finance">Finance</option>
            <option value="Governance">Governance</option>
          </select>

          <select 
            value={prioritySelect} 
            onChange={(e) => setPrioritySelect(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option value="ALL">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select 
            value={statusSelect} 
            onChange={(e) => setStatusSelect(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option value="ALL">All Status</option>
            <option value="Overdue">Overdue</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Disposed">Disposed</option>
          </select>
        </div>

        <button 
          onClick={onOpenNewComplaint}
          className="md:hidden inline-flex items-center gap-1.5 px-3 py-1 bg-[#193B2A] text-white rounded-md text-xs font-medium"
        >
          <Plus size={13} />
          <span>Register</span>
        </button>
      </div>

      {/* 4. Table matching Reference Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7E4DB] bg-[#F7F5EF]/60 text-[#737A72] text-[11px] font-semibold">
                <th className="py-2.5 px-3 font-medium">Complaint ID</th>
                <th className="py-2.5 px-3 font-medium">Subject</th>
                <th className="py-2.5 px-3 font-medium">Institution</th>
                <th className="py-2.5 px-3 font-medium">Bureau</th>
                <th className="py-2.5 px-3 font-medium">Priority</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium">SLA Deadline</th>
                <th className="py-2.5 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DB] text-[#252D27]">
              {referenceComplaints.map((c) => (
                <tr key={c.id} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-[#193B2A]">
                    {c.id}
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#252D27]">
                    {c.subject}
                  </td>
                  <td className="py-2.5 px-3 text-[#737A72]">
                    {c.institution}
                  </td>
                  <td className="py-2.5 px-3 text-[#737A72]">
                    {c.bureau}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      c.priority === 'High'
                        ? 'bg-[#B94F45]/10 text-[#B94F45] border-[#B94F45]/20'
                        : c.priority === 'Medium'
                        ? 'bg-[#C58B3B]/10 text-[#C58B3B] border-[#C58B3B]/20'
                        : 'bg-[#829B86]/10 text-[#193B2A] border-[#829B86]/20'
                    }`}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      c.status === 'Overdue'
                        ? 'bg-[#B94F45]/10 text-[#B94F45] border-[#B94F45]/20'
                        : c.status === 'Pending'
                        ? 'bg-[#C58B3B]/10 text-[#C58B3B] border-[#C58B3B]/20'
                        : c.status === 'In Progress'
                        ? 'bg-[#193B2A]/10 text-[#193B2A] border-[#193B2A]/20'
                        : 'bg-[#4F8064]/10 text-[#4F8064] border-[#4F8064]/20'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#737A72]">
                    {c.deadline}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onSelectComplaint(complaints[0])}
                      className="px-2.5 py-0.5 text-[11px] font-medium border border-[#E7E4DB] rounded hover:bg-[#193B2A] hover:text-white transition-colors cursor-pointer"
                    >
                      ···
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-2.5 border-t border-[#E7E4DB] text-xs text-[#737A72] flex items-center justify-between">
          <span>Showing 1-5 of 142</span>
          <div className="flex items-center gap-1 font-mono text-xs">
            <span className="w-5 h-5 flex items-center justify-center rounded bg-[#193B2A] text-white font-bold">1</span>
            <span className="w-5 h-5 flex items-center justify-center rounded border border-[#E7E4DB] cursor-pointer hover:bg-[#F7F5EF]">2</span>
            <span className="w-5 h-5 flex items-center justify-center rounded border border-[#E7E4DB] cursor-pointer hover:bg-[#F7F5EF]">3</span>
          </div>
        </div>
      </div>
    </div>
  );
};
