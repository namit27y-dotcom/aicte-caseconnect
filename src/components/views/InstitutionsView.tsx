import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  AlertTriangle, 
  FileText, 
  Search, 
  ChevronRight,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
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
  onSelectComplaint,
  onFilterComplaintsByInstitution,
}) => {
  const [selectedInst, setSelectedInst] = useState<Institution | null>(institutions[0] || null);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredInstitutions = institutions.filter((inst) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      inst.name.toLowerCase().includes(q) ||
      inst.state.toLowerCase().includes(q) ||
      inst.aictePermanentId.toLowerCase().includes(q)
    );
  });

  const institutionComplaints = selectedInst
    ? complaints.filter((c) => c.institutionId === selectedInst.id)
    : [];

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F2421]">
            Affiliated Technical Institutions Directory
          </h2>
          <p className="text-xs text-[#5C6460] mt-0.5">
            Cross-bureau institutional history, complaint records, and compliance profiles
          </p>
        </div>

        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search institution name, state, ID..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-white border border-[#D5CEC2] rounded-md px-3 py-1.5 text-xs text-[#1F2421] placeholder-[#A0AEC0] focus:outline-none focus:border-[#1B4532]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Institution Cards List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-1">
          {filteredInstitutions.map((inst) => {
            const isSelected = selectedInst?.id === inst.id;

            return (
              <div
                key={inst.id}
                onClick={() => setSelectedInst(inst)}
                className={`p-4 rounded-md border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-white border-[#1B4532] ring-1 ring-[#1B4532] shadow-xs'
                    : 'bg-white border-[#E6E1D8] hover:border-[#C5BCAD]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-sm bg-[#F2EFE9] border border-[#E2DDD3] flex items-center justify-center text-[#1B4532]">
                      <Building2 size={16} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#1F2421] leading-tight">
                        {inst.name}
                      </h4>
                      <span className="font-mono text-[10px] text-[#718096]">
                        AICTE PID: {inst.aictePermanentId}
                      </span>
                    </div>
                  </div>

                  {inst.overdueCount > 0 && (
                    <span className="text-[10px] font-semibold text-[#9B2226] bg-[#FDF0F0] border border-[#F5C2C4] px-1.5 py-0.5 rounded-xs flex items-center gap-1 shrink-0">
                      <AlertTriangle size={10} />
                      {inst.overdueCount} Overdue
                    </span>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#5C6460]">
                  <div className="flex items-center gap-1">
                    <MapPin size={12} className="text-[#846E52]" />
                    <span>{inst.district}, {inst.state}</span>
                  </div>
                  <div className="font-mono text-[#1F2421]">
                    <span className="font-bold text-[#1B4532]">{inst.openComplaints}</span> open / {inst.totalComplaints} total
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column (7 cols): Selected Institution Detailed Profile */}
        <div className="lg:col-span-7">
          {selectedInst ? (
            <Card>
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    <span>{selectedInst.name}</span>
                  </div>
                }
                subtitle={`Established ${selectedInst.establishedYear} · Category: ${selectedInst.category}`}
                action={
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFilterComplaintsByInstitution(selectedInst.id)}
                  >
                    View All in Register
                  </Button>
                }
              />
              <CardContent>
                {/* Institutional KPI Strip */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-3 bg-[#FAF8F5] border border-[#EBE6DC] rounded-sm text-center">
                    <span className="text-[10px] text-[#718096] uppercase font-semibold">Total Complaints</span>
                    <p className="text-xl font-bold font-mono text-[#1F2421] mt-0.5 tabular-nums">
                      {selectedInst.totalComplaints}
                    </p>
                  </div>
                  <div className="p-3 bg-[#EFF6FF] border border-[#BFDBFE] rounded-sm text-center">
                    <span className="text-[10px] text-[#1D4ED8] uppercase font-semibold">Active Open Cases</span>
                    <p className="text-xl font-bold font-mono text-[#1D4ED8] mt-0.5 tabular-nums">
                      {selectedInst.openComplaints}
                    </p>
                  </div>
                  <div className="p-3 bg-[#FDF0F0] border border-[#F5C2C4] rounded-sm text-center">
                    <span className="text-[10px] text-[#9B2226] uppercase font-semibold">SLA Overdue</span>
                    <p className="text-xl font-bold font-mono text-[#9B2226] mt-0.5 tabular-nums">
                      {selectedInst.overdueCount}
                    </p>
                  </div>
                </div>

                {/* Bureaus Handling Cases */}
                <div className="mb-6 p-3 bg-[#FAF8F5] border border-[#EBE6DC] rounded-sm">
                  <span className="text-xs font-semibold text-[#1F2421] block mb-2">
                    Involved AICTE Bureaus
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedInst.bureausInvolved.map((b, idx) => (
                      <Badge key={idx} variant="forest">
                        {b.replace(/_/g, ' ')}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Complaints History Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-3">
                    Complaints Associated with this Institution ({institutionComplaints.length})
                  </h4>

                  {institutionComplaints.length === 0 ? (
                    <p className="text-xs text-[#718096] py-4 text-center bg-[#FAF8F5] rounded-sm">
                      No complaints currently logged for this institution.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {institutionComplaints.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => onSelectComplaint(c)}
                          className="p-3 border border-[#E6E1D8] rounded-sm hover:border-[#1B4532] transition-colors cursor-pointer flex items-center justify-between text-xs"
                        >
                          <div className="space-y-0.5 max-w-md">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-semibold text-[#1B4532]">
                                {c.trackingNumber}
                              </span>
                              <Badge status={c.status}>{c.status.replace('_', ' ')}</Badge>
                              <Badge priority={c.priority}>{c.priority}</Badge>
                            </div>
                            <p className="text-[#1F2421] font-medium truncate">{c.title}</p>
                            <span className="text-[10px] text-[#718096]">
                              Bureau: {c.bureauName} · Filed {c.createdAt.slice(0, 10)}
                            </span>
                          </div>
                          <ChevronRight size={16} className="text-[#718096] shrink-0" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="p-8 text-center bg-white border border-[#E6E1D8] rounded-md text-[#718096]">
              Select an institution from the list to view compliance record.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
