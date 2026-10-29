import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Clock, 
  ArrowRight,
  UserCheck,
  FileText
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AuditLogItem } from '../../types';

interface AuditTrailViewProps {
  auditLogs: AuditLogItem[];
  searchQuery: string;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  auditLogs,
  searchQuery,
}) => {
  const [actionFilter, setActionFilter] = useState<string>('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter !== 'ALL' && log.actionType !== actionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        log.entityId.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.summary.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F2421]">
            Immutable Audit Trail
          </h2>
          <p className="text-xs text-[#5C6460] mt-0.5">
            Cryptographically timestamped, append-only record of every workflow mutation, status change, and coordination link
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#718096] font-medium hidden sm:inline">Event:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-white border border-[#D5CEC2] rounded-md px-2.5 py-1.5 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
          >
            <option value="ALL">All Event Types ({auditLogs.length})</option>
            <option value="STATUS_CHANGE">Status Transitions</option>
            <option value="BUREAU_TRANSFER">Bureau Transfers</option>
            <option value="OVERLAP_LINK">Overlap Calculations</option>
            <option value="COORDINATION_INITIATED">Coordination Initiated</option>
            <option value="DEADLINE_OVERRIDE">Deadline & SLA Overrides</option>
          </select>
        </div>
      </div>

      {/* Compliance Note */}
      <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-md text-xs text-[#5C6460] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#1B4532]" />
          <span>Section 7 Rule 7: Every important workflow mutation creates an immutable audit event.</span>
        </div>
        <span className="font-mono text-[11px] text-[#718096]">Hash-chain verified</span>
      </div>

      {/* Audit Log Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8] text-[11px] font-semibold text-[#5C6460] uppercase tracking-wider">
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4">Action Type</th>
                <th className="py-3 px-4">Entity Ref</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Mutation Summary & Evidence</th>
                <th className="py-3 px-4">State Transition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E1D8]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF8F5] transition-colors">
                  {/* Timestamp */}
                  <td className="py-3.5 px-4 font-mono text-[#5C6460] whitespace-nowrap text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} className="text-[#A0AEC0]" />
                      <span>{log.timestamp.replace('T', ' ').slice(0, 19)}</span>
                    </div>
                  </td>

                  {/* Action Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-mono text-[11px] bg-[#FAF8F5] text-[#1F2421] border border-[#D5CEC2] px-2 py-0.5 rounded-xs">
                      {log.actionType}
                    </span>
                  </td>

                  {/* Entity ID */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#1B4532] whitespace-nowrap">
                    {log.entityId}
                  </td>

                  {/* Actor */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="font-semibold text-[#1F2421]">{log.actorName}</div>
                    <div className="text-[10px] text-[#718096]">
                      {log.actorRole} {log.actorBureau ? `(${log.actorBureau})` : ''}
                    </div>
                  </td>

                  {/* Summary */}
                  <td className="py-3.5 px-4 max-w-sm">
                    <div className="font-medium text-[#1F2421]">{log.summary}</div>
                    {log.details.reason && (
                      <p className="text-[11px] text-[#5C6460] mt-0.5 italic">
                        Reason: {log.details.reason}
                      </p>
                    )}
                  </td>

                  {/* State Transition */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[11px]">
                    {log.details.previousValue && log.details.newValue ? (
                      <div className="flex items-center gap-1 font-mono text-[#4A5568]">
                        <span className="line-through opacity-70">{log.details.previousValue}</span>
                        <ArrowRight size={12} className="text-[#1B4532]" />
                        <span className="font-semibold text-[#1B4532]">{log.details.newValue}</span>
                      </div>
                    ) : (
                      <span className="text-[#A0AEC0]">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
