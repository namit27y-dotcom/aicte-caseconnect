import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Search, 
  ChevronRight,
  ShieldCheck,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge } from '../ui/StatusBadge';
import { PriorityBadge } from '../ui/PriorityBadge';
import { PageHeader } from '../ui/PageHeader';
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
  onSelectComplaint,
  onFilterComplaintsByInstitution,
}) => {
  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0]?.id || '');
  const [searchFilter, setSearchFilter] = useState('');

  const now = getNow();

  const selectedInst = institutions.find((i) => i.id === selectedInstId) || institutions[0] || null;

  const filteredInstitutions = institutions.filter((inst) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.state.toLowerCase().includes(q) ||
      inst.district.toLowerCase().includes(q) ||
      inst.aictePermanentId.toLowerCase().includes(q)
    );
  });

  const selectedMetrics = selectedInst
    ? deriveInstitutionMetrics(selectedInst.id, complaints, now)
    : { totalComplaints: 0, openComplaints: 0, overdueCount: 0, resolvedCount: 0 };

  const institutionComplaints = selectedInst
    ? complaints.filter((c) => c.institutionId === selectedInst.id)
    : [];

  return (
    <div className="space-y-5">
      {/* View Header */}
      <PageHeader
        title="Affiliated Technical Institutions Directory"
        subtitle="Cross-bureau institutional history, live complaint records, and compliance profiles"
        actions={
          <div className="w-full sm:w-72">
            <input
              type="text"
              placeholder="Search institution name, state, ID..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-1.5 text-xs text-[#1F2421] placeholder-[#A0AEC0] focus:outline-none focus:border-[#1B4532]"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Institution Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredInstitutions.map((inst) => {
            const isSelected = selectedInst?.id === inst.id;
            // Derive counts strictly from live complaints state
            const metrics = deriveInstitutionMetrics(inst.id, complaints, now);

            return (
              <div
                key={inst.id}
                onClick={() => setSelectedInstId(inst.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#1B4532] ring-2 ring-[#1B4532] shadow-sm'
                    : 'bg-white border-[#E6E1D8] hover:border-[#CBD5E1]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center text-[#1B4532] shrink-0">
                      <Building2 size={18} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-[#1F2421] leading-tight truncate">
                        {inst.name}
                      </h4>
                      <span className="font-mono text-[10px] text-[#718096]">
                        PID: {inst.aictePermanentId} · Est. {inst.establishedYear}
                      </span>
                    </div>
                  </div>

                  {metrics.overdueCount > 0 && (
                    <span className="text-[10px] font-bold text-[#DC2626] bg-[#FEF2F2] border border-[#FECACA] px-1.5 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                      <AlertTriangle size={10} />
                      {metrics.overdueCount} Overdue
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F4F1EA] flex items-center justify-between text-xs text-[#5C6460]">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#846E52]" />
                    <span>{inst.district}, {inst.state}</span>
                  </div>
                  <div className="font-mono text-xs">
                    <span className="font-bold text-[#1B4532]">{metrics.openComplaints}</span> open / {metrics.totalComplaints} total
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): Selected Institution Detailed Profile */}
        <div className="lg:col-span-7">
          {selectedInst ? (
            <div className="bg-white border border-[#E6E1D8] rounded-xl p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#F4F1EA]">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#1B4532]">
                      PID: {selectedInst.aictePermanentId}
                    </span>
                    <span className="text-[10.5px] bg-[#FAF8F5] text-[#5C6460] px-2 py-0.5 rounded border border-[#E6E1D8]">
                      {selectedInst.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1F2421] mt-1">
                    {selectedInst.name}
                  </h3>
                  <p className="text-xs text-[#5C6460] mt-0.5">
                    {selectedInst.district}, {selectedInst.state} · Established {selectedInst.establishedYear}
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onFilterComplaintsByInstitution(selectedInst.id)}
                  icon={<ExternalLink size={13} />}
                >
                  Filter in Register ({selectedMetrics.totalComplaints})
                </Button>
              </div>

              {/* Institution derived metrics strip */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-lg text-center">
                  <span className="text-[10px] text-[#718096] uppercase font-semibold block">
                    Total Ingestion
                  </span>
                  <span className="text-xl font-bold font-sans text-[#1F2421] mt-0.5 block">
                    {selectedMetrics.totalComplaints}
                  </span>
                </div>
                <div className="p-3 bg-[#F0F9FF] border border-[#BAE6FD] rounded-lg text-center">
                  <span className="text-[10px] text-[#0369A1] uppercase font-semibold block">
                    Active Open
                  </span>
                  <span className="text-xl font-bold font-sans text-[#0284C7] mt-0.5 block">
                    {selectedMetrics.openComplaints}
                  </span>
                </div>
                <div className="p-3 bg-[#FFFBFB] border border-[#FECACA] rounded-lg text-center">
                  <span className="text-[10px] text-[#DC2626] uppercase font-semibold block">
                    Overdue Cases
                  </span>
                  <span className="text-xl font-bold font-sans text-[#DC2626] mt-0.5 block">
                    {selectedMetrics.overdueCount}
                  </span>
                </div>
              </div>

              {/* Related Complaints List */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-3">
                  Institution Grievance History ({institutionComplaints.length})
                </h4>

                {institutionComplaints.length === 0 ? (
                  <div className="p-6 bg-[#FAF8F5] rounded-lg border border-[#E6E1D8] text-center text-xs text-[#718096]">
                    No grievance records on file for this institution.
                  </div>
                ) : (
                  <div className="divide-y divide-[#F4F1EA] border border-[#E6E1D8] rounded-lg overflow-hidden">
                    {institutionComplaints.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => onSelectComplaint(c)}
                        className="p-3 bg-white hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#1B4532]">
                              {c.trackingNumber}
                            </span>
                            <span className="text-xs font-semibold text-[#1F2421] truncate group-hover:text-[#1B4532]">
                              {c.title}
                            </span>
                          </div>
                          <span className="text-[10.5px] text-[#718096] block mt-0.5">
                            {c.bureauName} · Filed {c.createdAt.slice(0, 10)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={c.status} size="sm" />
                          <ChevronRight size={14} className="text-[#718096] group-hover:text-[#1B4532]" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-xs text-[#718096] bg-white border border-[#E6E1D8] rounded-xl">
              Select an institution from the directory to inspect records.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
