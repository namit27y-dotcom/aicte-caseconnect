import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Plus,
  CheckCircle2,
  Hourglass,
  Star,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Institution, Complaint } from '../../types';

interface InstitutionsViewProps {
  institutions: Institution[];
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onFilterComplaintsByInstitution: (instId: string) => void;
}

export const InstitutionsView: React.FC<InstitutionsViewProps> = ({
  institutions,
  complaints,
  onFilterComplaintsByInstitution,
  onSelectComplaint,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Institutions data strictly matching Reference Image 2
  const mockTableData = [
    {
      id: '1-4299118463',
      name: 'Western Tech Institute',
      region: 'Pune',
      type: 'Engineering',
      activeCases: 2,
      status: 'Approved',
      lastUpdated: '29 Oct 2026',
    },
    {
      id: '1-V58201948',
      name: 'Apex Institute of Engg.',
      region: 'Kanpur',
      type: 'Engineering',
      activeCases: 4,
      status: 'Notice Sent',
      lastUpdated: '28 Oct 2026',
    },
    {
      id: '1-552918984',
      name: 'Southern Valley College',
      region: 'Bengaluru',
      type: 'Engineering',
      activeCases: 2,
      status: 'Approved',
      lastUpdated: '27 Oct 2026',
    },
    {
      id: '1-662918477',
      name: 'Greenfield Institute',
      region: 'Delhi',
      type: 'Management',
      activeCases: 1,
      status: 'Approved',
      lastUpdated: '26 Oct 2026',
    },
    {
      id: '1-772918611',
      name: 'Zenith College',
      region: 'Mumbai',
      type: 'Engineering',
      activeCases: 3,
      status: 'Under Review',
      lastUpdated: '25 Oct 2026',
    },
    {
      id: '1-882918902',
      name: 'Central Polytechnic',
      region: 'Bhopal',
      type: 'Polytechnic',
      activeCases: 1,
      status: 'Under Review',
      lastUpdated: '24 Oct 2026',
    },
    {
      id: '1-992918331',
      name: 'National College of Tech',
      region: 'Chennai',
      type: 'Engineering',
      activeCases: 2,
      status: 'Approved',
      lastUpdated: '23 Oct 2026',
    },
  ];

  const filteredData = useMemo(() => {
    return mockTableData.filter(item => {
      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        if (!item.id.toLowerCase().includes(q) && !item.name.toLowerCase().includes(q)) return false;
      }
      if (regionFilter !== 'ALL' && item.region !== regionFilter) return false;
      if (typeFilter !== 'ALL' && item.type !== typeFilter) return false;
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;
      return true;
    });
  }, [searchFilter, regionFilter, typeFilter, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleView = (inst: typeof mockTableData[0]) => {
    onFilterComplaintsByInstitution(inst.id);
  };

  return (
    <div className="space-y-4 select-none pb-6">
      {/* 1. Header with Title & Add Institution Button Matching Reference Image 2 */}
      <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B24] font-serif">
            Institutions
          </h1>
          <p className="text-xs text-[#78847D] mt-0.5 font-sans">
            Manage and monitor institutions
          </p>
        </div>

        <div>
          <button 
            onClick={() => alert('Add Institution configuration is available for administrative onboarding.')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#174B38] hover:bg-[#12382B] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors shrink-0"
          >
            <Plus size={14} />
            <span>Add Institution</span>
          </button>
        </div>
      </div>

      {/* 2. Four KPI Cards Matching Reference Image 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Institutions */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Total Institutions</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#172B24] mt-1 tracking-tight">
              186
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#174B38]/10 text-[#174B38] flex items-center justify-center shrink-0">
            <Building2 size={18} />
          </div>
        </div>

        {/* Active */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Active</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#4F8064] mt-1 tracking-tight">
              172
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4F8064]/10 text-[#4F8064] flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Under Review</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#C58B3B] mt-1 tracking-tight">
              8
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#C58B3B]/10 text-[#C58B3B] flex items-center justify-center shrink-0">
            <Hourglass size={18} />
          </div>
        </div>

        {/* Open Cases */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-3.5 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Open Cases</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#D5A64A] mt-1 tracking-tight">
              24
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#D5A64A]/15 text-[#D5A64A] flex items-center justify-center shrink-0">
            <Star size={18} />
          </div>
        </div>
      </div>

      {/* 3. Filter Toolbar Matching Reference Image 2 */}
      <div className="bg-white border border-[#E8E2D6] rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#78847D]" />
            <input
              type="text"
              placeholder="Search Institutions..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#F7F5EF] border border-[#E8E2D6] rounded-lg text-xs text-[#172B24] placeholder-[#78847D] focus:outline-none focus:border-[#174B38]"
            />
          </div>

          {/* Region */}
          <div className="relative">
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-3 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer"
            >
              <option value="ALL">Region: All</option>
              <option value="Pune">Pune</option>
              <option value="Kanpur">Kanpur</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Delhi">Delhi</option>
              <option value="Mumbai">Mumbai</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>

          {/* Type */}
          <div className="relative">
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-3 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer"
            >
              <option value="ALL">Type: All</option>
              <option value="Engineering">Engineering</option>
              <option value="Management">Management</option>
              <option value="Polytechnic">Polytechnic</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>

          {/* Status */}
          <div className="relative">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none border border-[#E8E2D6] rounded-lg pl-3 pr-7 py-1.5 text-xs bg-white text-[#172B24] focus:outline-none focus:border-[#174B38] font-medium cursor-pointer"
            >
              <option value="ALL">Status: All</option>
              <option value="Approved">Approved</option>
              <option value="Notice Sent">Notice Sent</option>
              <option value="Under Review">Under Review</option>
            </select>
            <ChevronDown size={12} className="absolute right-2 top-2.5 text-[#78847D] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. Table Matching Reference Image 2 */}
      <div className="bg-white border border-[#E8E2D6] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E8E2D6] bg-[#F7F5EF] text-[#78847D] text-[11px] font-semibold">
                <th className="py-3 px-4 font-medium">Permanent ID</th>
                <th className="py-3 px-4 font-medium">Institution Name</th>
                <th className="py-3 px-4 font-medium">Region</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium text-center">Active Cases</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Last Updated</th>
                <th className="py-3 px-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D6] text-[#172B24]">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-[#78847D]">
                    No institutions match the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedData.map((inst) => (
                  <tr 
                    key={inst.id} 
                    onClick={() => handleView(inst)}
                    className="hover:bg-[#F7F5EF] transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono text-[11.5px] font-bold text-[#174B38] whitespace-nowrap group-hover:underline">
                      {inst.id}
                    </td>

                    <td className="py-3.5 px-4 font-semibold text-[#172B24]">
                      {inst.name}
                    </td>

                    <td className="py-3.5 px-4 text-[#78847D]">
                      {inst.region}
                    </td>

                    <td className="py-3.5 px-4 text-[#78847D]">
                      {inst.type}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-medium text-center text-[#172B24]">
                      {inst.activeCases}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded text-[10.5px] font-medium border ${
                        inst.status === 'Approved'
                          ? 'bg-[#4F8064]/15 text-[#4F8064] border-[#4F8064]/30'
                          : inst.status === 'Notice Sent'
                          ? 'bg-[#C58B3B]/15 text-[#C58B3B] border-[#C58B3B]/30'
                          : 'bg-[#D5A64A]/15 text-[#B45309] border-[#D5A64A]/30'
                      }`}>
                        {inst.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#78847D] whitespace-nowrap">
                      {inst.lastUpdated}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleView(inst);
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

        {/* Pagination Matching Reference Image 2: "Showing 1-5 of 186" "< 1 2 3 >" */}
        <div className="p-3 border-t border-[#E8E2D6] bg-white text-xs text-[#78847D] flex items-center justify-between">
          <span>Showing 1-5 of 186</span>
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-6 h-6 flex items-center justify-center rounded border border-[#E8E2D6] text-[#78847D] hover:bg-[#F7F5EF] disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft size={12} />
            </button>

            {Array.from({ length: 3 }, (_, i) => i + 1).map((pg) => (
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
              onClick={() => setCurrentPage(p => Math.min(3, p + 1))}
              disabled={currentPage === 3}
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
