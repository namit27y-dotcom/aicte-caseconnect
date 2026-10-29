import React, { useState, useMemo } from 'react';
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
import { PageHeader } from '../ui/PageHeader';
import { FilterBar } from '../ui/FilterBar';
import { DataTable } from '../ui/DataTable';
import { EmptyState } from '../ui/EmptyState';
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
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('ALL');
  const [entitySearch, setEntitySearch] = useState<string>(searchQuery);

  // Chronological sort: newest first
  const sortedLogs = useMemo(() => {
    return [...auditLogs].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [auditLogs]);

  // Filtering
  const filteredLogs = useMemo(() => {
    const nowMs = Date.now();

    return sortedLogs.filter((log) => {
      // Event action filter
      if (actionFilter !== 'ALL' && log.actionType !== actionFilter) {
        return false;
      }

      // Date range filter
      if (dateRangeFilter !== 'ALL') {
        const logMs = new Date(log.timestamp).getTime();
        const diffDays = (nowMs - logMs) / (1000 * 60 * 60 * 24);

        if (dateRangeFilter === '1D' && diffDays > 1) return false;
        if (dateRangeFilter === '7D' && diffDays > 7) return false;
        if (dateRangeFilter === '30D' && diffDays > 30) return false;
      }

      // Entity / Actor / Keyword search
      if (entitySearch.trim()) {
        const q = entitySearch.toLowerCase();
        const matchEntity = log.entityId.toLowerCase().includes(q);
        const matchActor = log.actorName.toLowerCase().includes(q);
        const matchSummary = log.summary.toLowerCase().includes(q);
        const matchReason = log.details?.reason?.toLowerCase().includes(q);
        if (!matchEntity && !matchActor && !matchSummary && !matchReason) {
          return false;
        }
      }

      return true;
    });
  }, [sortedLogs, actionFilter, dateRangeFilter, entitySearch]);

  const activeFilterCount =
    (actionFilter !== 'ALL' ? 1 : 0) +
    (dateRangeFilter !== 'ALL' ? 1 : 0) +
    (entitySearch.trim() ? 1 : 0);

  const handleResetFilters = () => {
    setActionFilter('ALL');
    setDateRangeFilter('ALL');
    setEntitySearch('');
  };

  return (
    <div className="space-y-5">
      {/* View Header */}
      <PageHeader
        title="Immutable Statutory Audit Trail"
        subtitle="Chronological, cryptographically verifiable ledger of every workflow state change, SLA dispatch, and coordination link"
      />

      {/* Compliance Note */}
      <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-lg text-xs text-[#5C6460] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-[#1B4532]" />
          <span>
            <strong>Section 7 Rule 7:</strong> All case mutations generate an unalterable audit item. No modification or deletion is permitted.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#718096] hidden sm:inline">
          Hash-chain verified • Append-only
        </span>
      </div>

      {/* Filter Toolbar */}
      <FilterBar
        activeFilterCount={activeFilterCount}
        onClearAll={handleResetFilters}
        resultSummary={
          <span>
            Showing <strong className="font-mono text-[#1F2421]">{filteredLogs.length}</strong> of{' '}
            {auditLogs.length} audit records
          </span>
        }
      >
        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-2 text-[#94A3B8]" />
          <input
            type="text"
            placeholder="Search entity, actor, keyword..."
            value={entitySearch}
            onChange={(e) => setEntitySearch(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md pl-8 pr-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
          />
        </div>

        {/* Action Type dropdown */}
        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Event Types</option>
          <option value="STATUS_CHANGE">Status Transitions</option>
          <option value="BUREAU_TRANSFER">Bureau Transfers</option>
          <option value="OVERLAP_LINK">Overlap Reviews</option>
          <option value="COORDINATION_INITIATED">Coordination Initiated</option>
          <option value="DEADLINE_OVERRIDE">Deadline & SLA Dispatches</option>
        </select>

        {/* Date Window */}
        <select
          value={dateRangeFilter}
          onChange={(e) => setDateRangeFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Time</option>
          <option value="1D">Last 24 Hours</option>
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
        </select>
      </FilterBar>

      {/* Audit Log Table */}
      <DataTable
        ariaLabel="Immutable Statutory Audit Trail"
        isEmpty={filteredLogs.length === 0}
        emptyState={
          <EmptyState
            title="No audit entries match the criteria"
            description="Try resetting the event type or date filter."
            actionLabel="Reset Filters"
            onAction={handleResetFilters}
          />
        }
        headers={[
          <th className="font-semibold">Timestamp (UTC)</th>,
          <th className="font-semibold">Action Type</th>,
          <th className="font-semibold">Entity Ref</th>,
          <th className="font-semibold">Actor & Role</th>,
          <th className="font-semibold">Plain-Language Summary & Reason</th>,
          <th className="font-semibold">State Transition</th>,
        ]}
      >
        {filteredLogs.map((log) => (
          <tr key={log.id} className="hover:bg-[#FAF8F5] transition-colors">
            {/* Timestamp */}
            <td className="py-3 px-4 font-mono text-[#5C6460] whitespace-nowrap text-[11px]">
              <div className="flex items-center gap-1.5">
                <Clock size={12} className="text-[#94A3B8]" />
                <span>{log.timestamp.replace('T', ' ').slice(0, 19)}</span>
              </div>
            </td>

            {/* Action Type */}
            <td className="py-3 px-4 whitespace-nowrap">
              <span className="font-mono text-[10.5px] font-bold px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#E6E1D8] text-[#1F2421]">
                {log.actionType}
              </span>
            </td>

            {/* Entity Ref */}
            <td className="py-3 px-4 font-mono text-xs font-bold text-[#1B4532] whitespace-nowrap">
              {log.entityId}
            </td>

            {/* Actor */}
            <td className="py-3 px-4 whitespace-nowrap">
              <div className="font-semibold text-[#1F2421]">{log.actorName}</div>
              <div className="text-[10.5px] text-[#718096]">
                {log.actorRole} {log.actorBureau ? `· ${log.actorBureau}` : ''}
              </div>
            </td>

            {/* Summary & Justification Reason */}
            <td className="py-3 px-4 max-w-sm sm:max-w-md">
              <div className="font-semibold text-[#1F2421] leading-snug">
                {log.summary}
              </div>
              {log.details?.reason && (
                <p className="text-[11px] text-[#5C6460] mt-0.5 leading-relaxed italic">
                  "{log.details.reason}"
                </p>
              )}
            </td>

            {/* State Transition before -> after */}
            <td className="py-3 px-4 whitespace-nowrap">
              {log.details?.previousValue && log.details?.newValue ? (
                <div className="flex items-center gap-1.5 text-xs font-mono">
                  <span className="text-[#718096] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E6E1D8]">
                    {log.details.previousValue}
                  </span>
                  <ArrowRight size={11} className="text-[#94A3B8]" />
                  <span className="font-bold text-[#16A34A] bg-[#F0FDF4] px-1.5 py-0.5 rounded border border-[#BBF7D0]">
                    {log.details.newValue}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-[#94A3B8]">—</span>
              )}
            </td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
};
