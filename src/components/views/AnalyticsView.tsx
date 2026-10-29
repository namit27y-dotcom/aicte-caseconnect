import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  RotateCcw, 
  Download, 
  Filter, 
  MapPin, 
  Info,
  Calendar
} from 'lucide-react';
import { Button } from '../ui/Button';
import { FilterBar } from '../ui/FilterBar';
import { ChartCard } from '../ui/ChartCard';
import { PageHeader } from '../ui/PageHeader';
import { DonutChart } from '../charts/DonutChart';
import { HorizontalBarChart } from '../charts/HorizontalBarChart';
import { LineChart } from '../charts/LineChart';
import { BarChart } from '../charts/BarChart';
import { Complaint, UserPersona } from '../../types';
import { 
  calculateBureauWorkload, 
  calculateStateDistribution, 
  calculateAgingBuckets, 
  calculateCategoryDistribution,
  calculateMonthlyTrends,
  exportAnalyticsToCSV,
  TRACKED_BUREAUS 
} from '../../utils/analyticsCalculations';
import { deriveStatusDistribution, getNow } from '../../utils/caseMetrics';

interface AnalyticsViewProps {
  complaints: Complaint[];
  currentPersona?: UserPersona;
  onSelectComplaint?: (complaint: Complaint) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  complaints,
  currentPersona,
  onSelectComplaint,
}) => {
  // Shared Analytics Scope Filters
  const [dateRange, setDateRange] = useState<string>('ALL');
  const [bureauFilter, setBureauFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const now = getNow();

  // Distinct list of states present in complaints
  const availableStates = useMemo(() => {
    const set = new Set<string>();
    complaints.forEach((c) => {
      if (c.institutionState) set.add(c.institutionState);
    });
    return Array.from(set).sort();
  }, [complaints]);

  // Distinct list of categories present in complaints
  const availableCategories = useMemo(() => {
    const map = new Map<string, string>();
    complaints.forEach((c) => {
      map.set(c.category, c.categoryLabel || c.category);
    });
    return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
  }, [complaints]);

  // Unified filtering: EVERY chart receives this exact same set
  const filteredComplaints = useMemo(() => {
    const nowMs = now.getTime();

    return complaints.filter((c) => {
      // Bureau Filter
      if (bureauFilter !== 'ALL' && c.bureau !== bureauFilter) return false;

      // State Filter
      if (stateFilter !== 'ALL' && c.institutionState !== stateFilter) return false;

      // Category Filter
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;

      // Status Filter
      if (statusFilter !== 'ALL') {
        if (statusFilter === 'OPEN') {
          if (c.status === 'CLOSED') return false;
        } else if (c.status !== statusFilter) {
          return false;
        }
      }

      // Date Range Filter (based on c.createdAt)
      if (dateRange !== 'ALL' && c.createdAt) {
        const createdMs = new Date(c.createdAt).getTime();
        const diffDays = (nowMs - createdMs) / (1000 * 60 * 60 * 24);

        if (dateRange === '7D' && diffDays > 7) return false;
        if (dateRange === '30D' && diffDays > 30) return false;
        if (dateRange === '90D' && diffDays > 90) return false;
      }

      return true;
    });
  }, [complaints, bureauFilter, stateFilter, categoryFilter, statusFilter, dateRange, now]);

  // Computed metrics from the SAME filtered set
  const statusDistribution = useMemo(
    () => deriveStatusDistribution(filteredComplaints),
    [filteredComplaints]
  );
  const bureauWorkload = useMemo(
    () => calculateBureauWorkload(filteredComplaints),
    [filteredComplaints]
  );
  const stateMetrics = useMemo(
    () => calculateStateDistribution(filteredComplaints),
    [filteredComplaints]
  );
  const agingBuckets = useMemo(
    () => calculateAgingBuckets(filteredComplaints),
    [filteredComplaints]
  );
  const monthlyTrends = useMemo(
    () => calculateMonthlyTrends(filteredComplaints),
    [filteredComplaints]
  );

  // Active filters count
  const activeFilterCount =
    (dateRange !== 'ALL' ? 1 : 0) +
    (bureauFilter !== 'ALL' ? 1 : 0) +
    (stateFilter !== 'ALL' ? 1 : 0) +
    (categoryFilter !== 'ALL' ? 1 : 0) +
    (statusFilter !== 'ALL' ? 1 : 0);

  const handleResetFilters = () => {
    setDateRange('ALL');
    setBureauFilter('ALL');
    setStateFilter('ALL');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
  };

  const filterSummary = [
    dateRange !== 'ALL' ? `Date: ${dateRange}` : null,
    bureauFilter !== 'ALL' ? `Bureau: ${bureauFilter}` : null,
    stateFilter !== 'ALL' ? `State: ${stateFilter}` : null,
    categoryFilter !== 'ALL' ? `Category: ${categoryFilter}` : null,
    statusFilter !== 'ALL' ? `Status: ${statusFilter}` : null,
  ]
    .filter(Boolean)
    .join(', ') || 'All Visible Cases';

  return (
    <div className="space-y-6 select-none font-sans">
      {/* 1. Page Header */}
      <PageHeader
        title="Institutional Analytics & Regulatory Governance"
        subtitle="Five synchronized analytical perspectives derived strictly from the active filtered grievance scope"
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => exportAnalyticsToCSV(filteredComplaints, filterSummary)}
            disabled={filteredComplaints.length === 0}
          >
            Export Filtered CSV ({filteredComplaints.length})
          </Button>
        }
      />

      {/* 2. Shared Single Filter Bar */}
      <FilterBar
        activeFilterCount={activeFilterCount}
        onClearAll={handleResetFilters}
        resultSummary={
          <span>
            Active Analytics Scope:{' '}
            <strong className="font-mono text-[#1F2421]">
              {filteredComplaints.length}
            </strong>{' '}
            of {complaints.length} cases
          </span>
        }
      >
        {/* Date Window */}
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Time Periods</option>
          <option value="7D">Last 7 Days</option>
          <option value="30D">Last 30 Days</option>
          <option value="90D">Last 90 Days</option>
        </select>

        {/* Bureau Filter */}
        <select
          value={bureauFilter}
          onChange={(e) => setBureauFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Bureaus</option>
          {TRACKED_BUREAUS.map((b) => (
            <option key={b.key} value={b.key}>
              {b.label}
            </option>
          ))}
        </select>

        {/* State Filter */}
        <select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All States / UTs</option>
          {availableStates.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Categories</option>
          {availableCategories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.label}
            </option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#FAF8F5] border border-[#D5CEC2] rounded-md px-2.5 py-1 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
        >
          <option value="ALL">All Statuses</option>
          <option value="OPEN">Open Only</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="UNDER_PROCESS">Under Process</option>
          <option value="COORDINATION">Coordination</option>
          <option value="RESOLUTION_REVIEW">Resolution Review</option>
          <option value="CLOSED">Closed / Disposed</option>
        </select>
      </FilterBar>

      {/* 3. The Five Specified Synchronized Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Status Distribution Donut (5 cols) */}
        <div className="lg:col-span-5">
          <ChartCard
            title="1. Grievance Status Distribution"
            subtitle="Current disposition breakdown of complaints in active scope"
            className="h-full"
          >
            <DonutChart
              segments={statusDistribution.map((s) => ({
                key: s.status,
                label: s.label,
                count: s.count,
                percentage: s.percentage,
                color: s.color,
              }))}
              total={filteredComplaints.length}
              centerLabel="Filtered Cases"
            />
          </ChartCard>
        </div>

        {/* Chart 2: Bureau Workload & SLA Adherence (7 cols) */}
        <div className="lg:col-span-7">
          <ChartCard
            title="2. Bureau Workload & SLA Adherence"
            subtitle="Active caseload assigned to AICTE bureaus with overdue volume highlighted"
            className="h-full"
          >
            <HorizontalBarChart
              items={bureauWorkload.map((b) => ({
                key: b.bureauKey,
                label: b.bureauName,
                total: b.totalAssigned,
                open: b.openCount,
                overdue: b.overdueCount,
                resolved: b.disposedCount,
              }))}
            />
          </ChartCard>
        </div>

        {/* Chart 3: State Grievance Distribution (6 cols) */}
        <div className="lg:col-span-6">
          <ChartCard
            title="3. Regional & State Distribution"
            subtitle="Geographical concentration of grievances across technical institutions"
            className="h-full"
          >
            <HorizontalBarChart
              items={stateMetrics.slice(0, 6).map((s) => ({
                key: s.state,
                label: s.state,
                total: s.total,
                open: s.open,
                overdue: s.overdue,
                resolved: s.disposed,
              }))}
            />
          </ChartCard>
        </div>

        {/* Chart 4: Aging Buckets (6 cols) */}
        <div className="lg:col-span-6">
          <ChartCard
            title="4. Caseload Aging Profile"
            subtitle="Duration active grievances have remained pending since registration"
            className="h-full"
          >
            <BarChart
              items={agingBuckets.map((b) => ({
                key: b.bucket,
                label: b.label,
                value: b.count,
                subtext: b.description,
                color: b.bucket === '60+' ? '#DC2626' : b.bucket === '31-60' ? '#D97706' : '#1B4532',
              }))}
              height={200}
            />
          </ChartCard>
        </div>

        {/* Chart 5: Intake vs Resolution Monthly Trends (12 cols) */}
        <div className="lg:col-span-12">
          <ChartCard
            title="5. Monthly Intake versus Disposed Trend"
            subtitle="Truthful historical comparison across consecutive active calendar periods"
          >
            <LineChart
              data={monthlyTrends.map((m) => ({
                label: m.monthLabel,
                intake: m.intakeCount,
                resolved: m.disposedCount,
              }))}
              height={220}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
