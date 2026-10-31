import React, { useState } from 'react';
import { 
  Building2, 
  Search, 
  Plus
} from 'lucide-react';
import { Institution, Complaint } from '../../types';
import { deriveInstitutionMetrics, getNow } from '../../utils/caseMetrics';

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
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const now = getNow();

  // Institutions data matching Reference Image 1 & 2
  const mockTableData = [
    {
      id: '1-4299118463',
      name: 'Western Tech Institute',
      region: 'Pune',
      type: 'Engg.',
      activeCases: 2,
      status: 'Approved',
      lastUpdated: '29 Oct 2026',
    },
    {
      id: '1-V58201948',
      name: 'Apex Institute of Engg.',
      region: 'Kanpur',
      type: 'Engg.',
      activeCases: 4,
      status: 'Notice Sent',
      lastUpdated: '28 Oct 2026',
    },
    {
      id: '1-552918984',
      name: 'Southern Valley College',
      region: 'Bengaluru',
      type: 'Engg.',
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
      type: 'Engg.',
      activeCases: 3,
      status: 'Under Review',
      lastUpdated: '25 Oct 2026',
    },
  ];

  return (
    <div className="space-y-3.5 select-none pb-6">
      {/* 1. Top Section Header with Building Banner as in Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#252D27] font-heading">
            Institutions
          </h1>
          <p className="text-xs text-[#737A72] mt-0.5">
            Manage and view institutions
          </p>
        </div>

        {/* Thumbnail preview photograph on right */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-36 h-16 rounded-lg overflow-hidden border border-[#E7E4DB]">
            <img 
              src="/assets/banner-institutions.jpg" 
              alt="Institutions" 
              className="w-full h-full object-cover"
            />
          </div>
          <button 
            onClick={() => alert('Add Institution is restricted to Apex Admin.')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#193B2A] hover:bg-[#142B21] text-white rounded-md text-xs font-medium cursor-pointer shadow-2xs transition-colors shrink-0"
          >
            <Plus size={13} />
            <span>Add Institution</span>
          </button>
        </div>
      </div>

      {/* 2. Four KPI Cards: Total (247 / 186) | Active (231 / 172) | Under Review (12 / 8) | Open Cases (18 / 24) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Total</span>
          <div className="text-2xl font-bold font-sans text-[#252D27] mt-0.5 tabular-nums">
            247
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Active</span>
          <div className="text-2xl font-bold font-sans text-[#4F8064] mt-0.5 tabular-nums">
            231
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Under Review</span>
          <div className="text-2xl font-bold font-sans text-[#C58B3B] mt-0.5 tabular-nums">
            12
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Open Cases</span>
          <div className="text-2xl font-bold font-sans text-[#193B2A] mt-0.5 tabular-nums">
            18
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
              placeholder="Search institutions..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-8 pr-3 py-1 bg-[#F7F5EF] border border-[#E7E4DB] rounded-md text-xs text-[#252D27] placeholder-[#737A72] focus:outline-none focus:border-[#193B2A]"
            />
          </div>

          <select 
            value={regionFilter} 
            onChange={(e) => setRegionFilter(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option value="ALL">All Regions</option>
            <option value="Pune">Pune</option>
            <option value="Kanpur">Kanpur</option>
            <option value="Bengaluru">Bengaluru</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
          </select>

          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option value="ALL">All Types</option>
            <option value="Engg.">Engg.</option>
            <option value="Management">Management</option>
            <option value="Polytech">Polytech</option>
          </select>

          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option value="ALL">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Notice Sent">Notice Sent</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>

        <button 
          onClick={() => alert('Add Institution is restricted to Apex Admin.')}
          className="md:hidden inline-flex items-center gap-1.5 px-3 py-1 bg-[#193B2A] text-white rounded-md text-xs font-medium"
        >
          <Plus size={13} />
          <span>Add</span>
        </button>
      </div>

      {/* 4. Table matching Reference Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E7E4DB] bg-[#F7F5EF]/60 text-[#737A72] text-[11px] font-semibold">
                <th className="py-2.5 px-3 font-medium">ID</th>
                <th className="py-2.5 px-3 font-medium">Institution Name</th>
                <th className="py-2.5 px-3 font-medium">Region</th>
                <th className="py-2.5 px-3 font-medium">Type</th>
                <th className="py-2.5 px-3 font-medium text-center">Active Cases</th>
                <th className="py-2.5 px-3 font-medium">Status</th>
                <th className="py-2.5 px-3 font-medium">Last Updated</th>
                <th className="py-2.5 px-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7E4DB] text-[#252D27]">
              {mockTableData.map((inst) => (
                <tr key={inst.id} className="hover:bg-[#F7F5EF] transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#737A72]">
                    {inst.id}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#252D27]">
                    {inst.name}
                  </td>
                  <td className="py-2.5 px-3 text-[#737A72]">
                    {inst.region}
                  </td>
                  <td className="py-2.5 px-3 text-[#737A72]">
                    {inst.type}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-center font-bold text-[#193B2A]">
                    {inst.activeCases}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${
                      inst.status === 'Approved'
                        ? 'bg-[#4F8064]/10 text-[#4F8064] border-[#4F8064]/20'
                        : inst.status === 'Notice Sent'
                        ? 'bg-[#C58B3B]/10 text-[#C58B3B] border-[#C58B3B]/20'
                        : 'bg-[#C58B3B]/15 text-[#C58B3B] border-[#C58B3B]/30'
                    }`}>
                      {inst.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-[#737A72] font-mono text-[11px]">
                    {inst.lastUpdated}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => onFilterComplaintsByInstitution('inst-101')}
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
          <span>Showing 1-5 of 186</span>
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
