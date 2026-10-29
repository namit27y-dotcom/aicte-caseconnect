import React, { useState } from 'react';
import { 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Building2, 
  FileText, 
  ChevronRight,
  BellRing,
  Filter
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Complaint, UserPersona, DeadlineRule } from '../../types';
import { SYNTHETIC_DEADLINE_RULES } from '../../data/syntheticData';

interface DeadlineQueueViewProps {
  complaints: Complaint[];
  currentPersona: UserPersona;
  onSelectComplaint: (complaint: Complaint) => void;
  onTriggerEscalation: (trackingNumber: string) => void;
}

export const DeadlineQueueView: React.FC<DeadlineQueueViewProps> = ({
  complaints,
  currentPersona,
  onSelectComplaint,
  onTriggerEscalation,
}) => {
  const [filterState, setFilterState] = useState<'ALL' | 'OVERDUE' | 'APPROACHING'>('ALL');

  const overdueComplaints = complaints.filter((c) => c.isOverdue);
  const activeComplaints = complaints.filter((c) => c.status !== 'CLOSED');

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F2421]">
            Statutory Deadline & Escalation Queue
          </h2>
          <p className="text-xs text-[#5C6460] mt-0.5">
            SLA enforcement across AICTE bureaus • Priority tracking for statutory anti-ragging & fee dispute mandates
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1 bg-[#EAE5DC] p-1 rounded-md text-xs font-medium">
          <button
            onClick={() => setFilterState('ALL')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              filterState === 'ALL' ? 'bg-white text-[#1F2421] shadow-xs' : 'text-[#5C6460] hover:text-[#1F2421]'
            }`}
          >
            All Active ({activeComplaints.length})
          </button>
          <button
            onClick={() => setFilterState('OVERDUE')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              filterState === 'OVERDUE' ? 'bg-[#9B2226] text-white shadow-xs' : 'text-[#9B2226] hover:bg-white/50'
            }`}
          >
            Overdue ({overdueComplaints.length})
          </button>
        </div>
      </div>

      {/* SLA Tiers Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-[#FFF5F5] border border-[#F5C2C4] rounded-md">
          <div className="flex items-center justify-between text-xs text-[#9B2226] font-semibold">
            <span className="flex items-center gap-1.5">
              <AlertTriangle size={15} />
              Overdue Breach
            </span>
            <span className="font-mono text-lg font-bold">{overdueComplaints.length} cases</span>
          </div>
          <p className="text-[11px] text-[#9B2226]/80 mt-1">
            Exceeded statutory resolution window; requires immediate Bureau Head intervention.
          </p>
        </div>

        <div className="p-4 bg-[#FFFBF0] border border-[#F2DEBF] rounded-md">
          <div className="flex items-center justify-between text-xs text-[#9A621D] font-semibold">
            <span className="flex items-center gap-1.5">
              <Clock size={15} />
              Approaching SLA (&lt; 48h)
            </span>
            <span className="font-mono text-lg font-bold">2 cases</span>
          </div>
          <p className="text-[11px] text-[#9A621D]/80 mt-1">
            Automated alerts dispatched to assigned Bureau Officers.
          </p>
        </div>

        <div className="p-4 bg-[#F2F7F4] border border-[#CDE1D5] rounded-md">
          <div className="flex items-center justify-between text-xs text-[#1B4532] font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              Within Statutory Limits
            </span>
            <span className="font-mono text-lg font-bold">
              {activeComplaints.length - overdueComplaints.length} cases
            </span>
          </div>
          <p className="text-[11px] text-[#1B4532]/80 mt-1">
            Normal investigation timelines running on schedule.
          </p>
        </div>
      </div>

      {/* Deadline Queue Table */}
      <Card>
        <CardHeader
          title="Active SLA Tracking Matrix"
          subtitle="Real-time target resolution dates computed by statutory category rules"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8] text-[11px] font-semibold text-[#5C6460] uppercase tracking-wider">
                <th className="py-3 px-4">Tracking Code</th>
                <th className="py-3 px-4">Institution & Case</th>
                <th className="py-3 px-4">Bureau</th>
                <th className="py-3 px-4">Filing Date</th>
                <th className="py-3 px-4">Target Deadline</th>
                <th className="py-3 px-4">SLA Status</th>
                <th className="py-3 px-4 text-right">Escalation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E1D8]">
              {activeComplaints
                .filter((c) => (filterState === 'OVERDUE' ? c.isOverdue : true))
                .map((c) => (
                  <tr
                    key={c.id}
                    className={`hover:bg-[#FAF8F5] transition-colors ${
                      c.isOverdue ? 'bg-[#FFFBFB]' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-[#1B4532]">
                      {c.trackingNumber}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-semibold text-[#1F2421] truncate">{c.institutionName}</div>
                      <div className="text-[11px] text-[#5C6460] truncate">{c.title}</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-[#1F2421]">
                      {c.bureauName}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-[#5C6460]">
                      {c.createdAt.slice(0, 10)}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-semibold">
                      <span className={c.isOverdue ? 'text-[#9B2226]' : 'text-[#1F2421]'}>
                        {c.targetDeadline.slice(0, 10)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {c.isOverdue ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#9B2226] bg-[#FDF0F0] border border-[#F5C2C4] px-2 py-0.5 rounded-xs">
                          <AlertTriangle size={12} />
                          Overdue (+11 days)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-medium text-[#1B4532] bg-[#EBF3EE] border border-[#CDE1D5] px-2 py-0.5 rounded-xs">
                          <Clock size={12} />
                          Normal (6 days left)
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {c.isOverdue && (
                          <Button
                            variant="danger"
                            size="sm"
                            icon={<BellRing size={12} />}
                            onClick={() => onTriggerEscalation(c.trackingNumber)}
                          >
                            Dispatch Notice
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSelectComplaint(c)}
                        >
                          View Case
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Statutory Rules Reference Card */}
      <Card>
        <CardHeader
          title="Configured AICTE Statutory SLA Rules"
          subtitle="Mandated resolution turnaround windows by grievance classification"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4">
          {SYNTHETIC_DEADLINE_RULES.map((rule) => (
            <div
              key={rule.id}
              className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-sm text-xs space-y-1"
            >
              <div className="flex items-center justify-between font-semibold text-[#1F2421]">
                <span>{rule.categoryName}</span>
                <span className="font-mono text-[#1B4532] font-bold">
                  {rule.defaultDurationDays} Days
                </span>
              </div>
              <p className="text-[11px] text-[#5C6460]">
                Warning alert triggers at {rule.warningThresholdDays} days remaining.
              </p>
              <span className="text-[10px] text-[#718096] block pt-1 border-t border-[#E6E1D8]/60">
                Escalates to: {rule.escalationTarget}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
