import React, { useState, useMemo } from 'react';
import { 
  BarChart3, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Filter, 
  RotateCcw, 
  Download, 
  MapPin, 
  Share2, 
  Layers, 
  Calendar, 
  Building2, 
  Info,
  TrendingUp,
  FileText,
  Search,
  Check,
  X
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Complaint, BureauType, ComplaintCategory, ComplaintStatus, UserPersona } from '../../types';
import { 
  calculateKPIs, 
  calculateBureauWorkload, 
  calculateStateDistribution, 
  calculateAgingBuckets, 
  calculateCategoryDistribution,
  calculateMonthlyTrends,
  exportAnalyticsToCSV,
  TRACKED_BUREAUS 
} from '../../utils/analyticsCalculations';

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
  // Global Analytics Filters State
  const [dateRange, setDateRange] = useState<string>('ALL');
  const [bureauFilter, setBureauFilter] = useState<string>('ALL');
  const [stateFilter, setStateFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [stateSearchQuery, setStateSearchQuery] = useState<string>('');
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Filter complaints dynamically
  const filteredComplaints = useMemo(() => {
    const now = new Date('2026-10-29T11:42:00Z').getTime();

    return complaints.filter((c) => {
      // Bureau Filter
      if (bureauFilter !== 'ALL' && c.bureau !== bureauFilter) return false;

      // State Filter
      if (stateFilter !== 'ALL' && c.institutionState !== stateFilter) return false;

      // Category Filter
      if (categoryFilter !== 'ALL' && c.category !== categoryFilter) return false;

      // Status Filter
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;

      // Date Range Filter
      if (dateRange !== 'ALL' && c.createdAt) {
        const created = new Date(c.createdAt).getTime();
        const diffDays = (now - created) / (1000 * 60 * 60 * 24);

        if (dateRange === '7D' && diffDays > 7) return false;
        if (dateRange === '30D' && diffDays > 30) return false;
        if (dateRange === '90D' && diffDays > 90) return false;
        if (dateRange === 'AY2025' && (c.createdAt < '2025-07-01' || c.createdAt > '2026-06-30')) return false;
      }

      return true;
    });
  }, [complaints, bureauFilter, stateFilter, categoryFilter, statusFilter, dateRange]);

  // Dynamically computed metrics using typed calculation engine
  const kpis = useMemo(() => calculateKPIs(filteredComplaints), [filteredComplaints]);
  const bureauWorkload = useMemo(() => calculateBureauWorkload(filteredComplaints), [filteredComplaints]);
  const stateMetrics = useMemo(() => calculateStateDistribution(filteredComplaints), [filteredComplaints]);
  const agingBuckets = useMemo(() => calculateAgingBuckets(filteredComplaints), [filteredComplaints]);
  const categoryMetrics = useMemo(() => calculateCategoryDistribution(filteredComplaints), [filteredComplaints]);
  const monthlyTrends = useMemo(() => calculateMonthlyTrends(filteredComplaints), [filteredComplaints]);

  // Filtered state list for search
  const displayedStates = useMemo(() => {
    if (!stateSearchQuery.trim()) return stateMetrics;
    const q = stateSearchQuery.toLowerCase();
    return stateMetrics.filter(s => s.state.toLowerCase().includes(q));
  }, [stateMetrics, stateSearchQuery]);

  // Reset all filters
  const handleResetFilters = () => {
    setDateRange('ALL');
    setBureauFilter('ALL');
    setStateFilter('ALL');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setStateSearchQuery('');
  };

  const isFiltered = dateRange !== 'ALL' || bureauFilter !== 'ALL' || stateFilter !== 'ALL' || categoryFilter !== 'ALL' || statusFilter !== 'ALL';

  const filterSummary = [
    dateRange !== 'ALL' ? `Date: ${dateRange}` : null,
    bureauFilter !== 'ALL' ? `Bureau: ${bureauFilter}` : null,
    stateFilter !== 'ALL' ? `State: ${stateFilter}` : null,
    categoryFilter !== 'ALL' ? `Category: ${categoryFilter}` : null,
    statusFilter !== 'ALL' ? `Status: ${statusFilter}` : null,
  ].filter(Boolean).join(', ') || 'All Records';

  return (
    <div className="space-y-6 select-none font-sans">
      {/* 1. Header & Synthetic Data Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
              Analytics & Institutional Governance Intelligence
            </h2>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-xs bg-[#EAF5EE] text-[#155836] border border-[#D1E7D9]">
              Live Computed Engine
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Statistical tracking computed dynamically from {complaints.length} registered complaint cases • SIH26264
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isFiltered && (
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw size={13} />}
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => exportAnalyticsToCSV(filteredComplaints, filterSummary)}
          >
            Export Analytics CSV ({filteredComplaints.length})
          </Button>
        </div>
      </div>

      {/* Demo Data Disclaimer */}
      <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-lg text-xs text-[#5C6460] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info size={15} className="text-[#154636] shrink-0" />
          <span>
            <strong>DEMO DATA NOTICE:</strong> All analytics KPIs, resolution times, and workload distributions are computed live from synthetic AICTE CaseConnect simulation records.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#718096] hidden md:inline">
          Scope: {filteredComplaints.length} of {complaints.length} cases
        </span>
      </div>

      {/* 2. Interactive Global Filter Toolbar */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B]">
            <Filter size={14} className="text-[#154636]" />
            <span>Interactive Analytics Scope Filters:</span>
          </div>

          {stateFilter !== 'ALL' && (
            <div className="flex items-center gap-1.5 bg-[#EAF5EE] text-[#155836] border border-[#D1E7D9] px-2.5 py-1 rounded-md text-xs font-medium">
              <MapPin size={12} />
              <span>State: {stateFilter}</span>
              <button
                onClick={() => setStateFilter('ALL')}
                className="hover:text-black ml-1 cursor-pointer"
                aria-label="Clear state filter"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
          {/* Date Range */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
              Time Window
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DFE3DC] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
            >
              <option value="ALL">All Time</option>
              <option value="7D">Last 7 Days (Express SLA)</option>
              <option value="30D">Last 30 Days (Monthly Intake)</option>
              <option value="90D">Last 90 Days (Quarterly View)</option>
              <option value="AY2025">Academic Year 2025–26</option>
            </select>
          </div>

          {/* Bureau */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
              AICTE Bureau
            </label>
            <select
              value={bureauFilter}
              onChange={(e) => setBureauFilter(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DFE3DC] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
            >
              <option value="ALL">All AICTE Bureaus</option>
              <option value="APPROVAL_BUREAU">Approval Bureau</option>
              <option value="FINANCE_BUREAU">Finance Bureau</option>
              <option value="GRIEVANCE_CELL">Public Grievance Cell</option>
              <option value="POLICY_ACADEMIC">Policy & Academic Bureau</option>
              <option value="LEGAL_CELL">Legal & Vigilance Cell</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
              Institution State
            </label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DFE3DC] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
            >
              <option value="ALL">All States / UTs</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Delhi NCR">Delhi NCR</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Uttarakhand">Uttarakhand</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
              Grievance Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DFE3DC] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
            >
              <option value="ALL">All Categories</option>
              <option value="ADMISSION_FRAUD">Admission & Capitation</option>
              <option value="RAGGING">Ragging & Harassment</option>
              <option value="FACULTY_NON_PAYMENT">Faculty Salaries & Arrears</option>
              <option value="INFRASTRUCTURE">Physical & Lab Infrastructure</option>
              <option value="FEE_EXTORTION">Fee Extortion</option>
              <option value="CURRICULUM_ACCREDITATION">Curriculum & Credentials</option>
              <option value="OTHER">Vigilance & Other</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
              Case Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#DFE3DC] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
            >
              <option value="ALL">All Statuses</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="UNDER_PROCESS">Under Process</option>
              <option value="COORDINATION">In Coordination</option>
              <option value="RESOLUTION_REVIEW">Resolution Review</option>
              <option value="CLOSED">Disposed (Closed)</option>
              <option value="OVERDUE">Overdue (SLA Breached)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Seven Dynamic KPI Cards (Calculated directly from dataset) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* KPI 1: Total Complaints */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-[#64748B] block truncate">
            Total Complaints
          </span>
          <div className="text-2xl font-bold font-sans text-[#0F172A] mt-1 tabular-nums">
            {kpis.total}
          </div>
          <span className="text-[10px] text-[#16A34A] block mt-0.5">
            In filtered scope
          </span>
        </div>

        {/* KPI 2: Open Complaints */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-[#64748B] block truncate">
            Open Cases
          </span>
          <div className="text-2xl font-bold font-sans text-[#0284C7] mt-1 tabular-nums">
            {kpis.open}
          </div>
          <span className="text-[10px] text-[#64748B] block mt-0.5">
            Active inquiry
          </span>
        </div>

        {/* KPI 3: Overdue Complaints */}
        <div className="bg-white border border-[#FECACA] bg-[#FFFBFB] rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-[#DC2626] block truncate">
            Overdue Cases
          </span>
          <div className="text-2xl font-bold font-sans text-[#DC2626] mt-1 tabular-nums">
            {kpis.overdue}
          </div>
          <span className="text-[10px] text-[#DC2626]/80 block mt-0.5">
            SLA breached
          </span>
        </div>

        {/* KPI 4: Disposed Complaints */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-[#64748B] block truncate">
            Disposed Cases
          </span>
          <div className="text-2xl font-bold font-sans text-[#155836] mt-1 tabular-nums">
            {kpis.disposed}
          </div>
          <span className="text-[10px] text-[#155836] block mt-0.5">
            Compliance verified
          </span>
        </div>

        {/* KPI 5: Disposal Rate */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-[#64748B] block truncate" title="Formula: (Disposed Cases / Total Cases) * 100">
            Disposal Rate
          </span>
          <div className="text-2xl font-bold font-sans text-[#0F172A] mt-1 tabular-nums">
            {kpis.disposalRate}%
          </div>
          <span className="text-[10px] text-[#64748B] block mt-0.5 truncate" title="(Disposed / Total) * 100">
            (Disposed / Total)
          </span>
        </div>

        {/* KPI 6: Average Resolution Time */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-[#64748B] block truncate" title="Formula: Σ(Resolved Date - Intake Date) / Disposed Count">
            Avg Resolution
          </span>
          <div className="text-2xl font-bold font-sans text-[#0F172A] mt-1 tabular-nums">
            {kpis.avgResolutionDays !== null ? `${kpis.avgResolutionDays}d` : 'No data'}
          </div>
          <span className="text-[10px] text-[#64748B] block mt-0.5 truncate" title="Σ(Days to Closure) / Closed">
            {kpis.avgResolutionDays !== null ? 'Turnaround average' : 'No closed cases'}
          </span>
        </div>

        {/* KPI 7: Cross-Bureau Cases */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-3.5 shadow-2xs">
          <span className="text-[11px] font-medium text-[#64748B] block truncate">
            Cross-Bureau
          </span>
          <div className="text-2xl font-bold font-sans text-[#7C3AED] mt-1 tabular-nums">
            {kpis.crossBureauCount}
          </div>
          <span className="text-[10px] text-[#7C3AED] block mt-0.5">
            Inter-bureau linked
          </span>
        </div>
      </div>

      {/* 4. Bureau Workload Analytics Section */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <Layers size={17} className="text-[#154636]" />
              <span>Bureau Workload Distribution & Comparison</span>
            </div>
          }
          subtitle="Assigned cases, active backlog, overdue breaches, and capacity share across all 5 AICTE Bureaus"
          action={
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7]" />
                <span className="text-[#64748B]">Open</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626]" />
                <span className="text-[#64748B]">Overdue</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#155836]" />
                <span className="text-[#64748B]">Disposed</span>
              </div>
            </div>
          }
        />
        <CardContent>
          <div className="space-y-4">
            {bureauWorkload.map((b) => {
              const totalAssigned = b.totalAssigned;
              const openPercent = totalAssigned > 0 ? (b.openCount / totalAssigned) * 100 : 0;
              const overduePercent = totalAssigned > 0 ? (b.overdueCount / totalAssigned) * 100 : 0;
              const disposedPercent = totalAssigned > 0 ? (b.disposedCount / totalAssigned) * 100 : 0;

              return (
                <div
                  key={b.bureauKey}
                  onClick={() => setBureauFilter(bureauFilter === b.bureauKey ? 'ALL' : b.bureauKey)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    bureauFilter === b.bureauKey
                      ? 'bg-[#EAF5EE] border-[#154636] ring-1 ring-[#154636]'
                      : 'bg-white border-[#E5E7EB] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#0F172A] text-sm">
                        {b.bureauName}
                      </span>
                      {bureauFilter === b.bureauKey && (
                        <span className="text-[10px] bg-[#154636] text-white px-2 py-0.5 rounded-full">
                          Active Filter
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-mono">
                      <span>Total: <strong>{b.totalAssigned}</strong></span>
                      <span className="text-[#0284C7]">Open: <strong>{b.openCount}</strong></span>
                      <span className="text-[#DC2626]">Overdue: <strong>{b.overdueCount}</strong></span>
                      <span className="text-[#155836]">Disposed: <strong>{b.disposedCount}</strong></span>
                      <span className="text-[#64748B] text-[11px]">Share of Open: {b.shareOfOpen}%</span>
                    </div>
                  </div>

                  {/* Multi-segment workload progress track */}
                  <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${openPercent}%` }}
                      className="h-full bg-[#0284C7] transition-all"
                      title={`Open: ${b.openCount}`}
                    />
                    <div
                      style={{ width: `${overduePercent}%` }}
                      className="h-full bg-[#DC2626] transition-all"
                      title={`Overdue: ${b.overdueCount}`}
                    />
                    <div
                      style={{ width: `${disposedPercent}%` }}
                      className="h-full bg-[#155836] transition-all"
                      title={`Disposed: ${b.disposedCount}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 5. State-Wise Distribution & Aging Buckets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: State-Wise Complaint Distribution (6 cols) */}
        <div className="lg:col-span-6">
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <MapPin size={17} className="text-[#154636]" />
                  <span>State-Wise Geographic Density</span>
                </div>
              }
              subtitle="Interactive state rankings based on verified institution addresses • Click to filter"
              action={
                <div className="relative w-40">
                  <Search size={12} className="absolute left-2.5 top-2.5 text-[#94A3B8]" />
                  <input
                    type="text"
                    placeholder="Search state..."
                    value={stateSearchQuery}
                    onChange={(e) => setStateSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#DFE3DC] rounded-lg pl-7 pr-2 py-1 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
                  />
                </div>
              }
            />
            <CardContent>
              {displayedStates.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#64748B]">
                  No state records match the filter query.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {displayedStates.map((st) => {
                    const isSelected = stateFilter === st.state;

                    return (
                      <div
                        key={st.state}
                        onClick={() => setStateFilter(isSelected ? 'ALL' : st.state)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#EAF5EE] border-[#154636] ring-1 ring-[#154636]'
                            : 'bg-white border-[#E5E7EB] hover:border-[#CBD5E1]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-[#0F172A]">{st.state}</span>
                            {st.overdue > 0 && (
                              <span className="text-[10px] text-[#DC2626] bg-[#FEE2E2] px-1.5 py-0.2 rounded-xs font-medium">
                                {st.overdue} Overdue
                              </span>
                            )}
                          </div>
                          <div className="font-mono text-xs text-[#64748B]">
                            <strong className="text-[#0F172A]">{st.total} cases</strong> ({st.open} open · {st.disposed} closed)
                          </div>
                        </div>

                        {/* Relative Progress Bar */}
                        <div className="w-full h-2 bg-[#E2E8F0] rounded-full overflow-hidden flex">
                          <div
                            className="bg-[#154636] h-full rounded-full transition-all"
                            style={{ width: `${st.percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Complaint Aging Buckets & Category Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Aging Buckets Card */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <Clock size={17} className="text-[#154636]" />
                  <span>Complaint Ageing Analysis (Active Queue)</span>
                </div>
              }
              subtitle="Turnaround exposure computed from submission date to current benchmark date"
            />
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {agingBuckets.map((b, idx) => {
                  const colors = [
                    'border-[#DCFCE7] bg-[#F0FDF4] text-[#166534]',
                    'border-[#E0F2FE] bg-[#F0F9FF] text-[#0369A1]',
                    'border-[#FEF3C7] bg-[#FFFBEB] text-[#B45309]',
                    'border-[#FEE2E2] bg-[#FEF2F2] text-[#B91C1C]',
                  ];

                  return (
                    <div key={b.bucket} className={`p-3 rounded-xl border ${colors[idx]} text-center`}>
                      <span className="text-[11px] font-bold block">{b.label}</span>
                      <div className="text-2xl font-bold font-sans mt-1 tabular-nums">
                        {b.count}
                      </div>
                      <span className="text-[10px] opacity-80 block mt-0.5">
                        {b.percentage}% of active
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 pt-3 border-t border-[#F1F5F9] text-[11px] text-[#64748B] space-y-1">
                <div className="flex items-center justify-between">
                  <span>Fresh Triage (0–7d): Express resolution target</span>
                  <span className="font-mono font-medium">Low Risk</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Extended Backlog (60+d): Requires Apex Admin intervention</span>
                  <span className="font-mono font-medium text-[#DC2626]">High Risk</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution Card */}
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <BarChart3 size={17} className="text-[#154636]" />
                  <span>Grievance Classification Breakdown</span>
                </div>
              }
              subtitle="Share of reported allegations across institutional categories"
            />
            <CardContent>
              <div className="space-y-3">
                {categoryMetrics.map((c) => (
                  <div key={c.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1E293B]">{c.label}</span>
                      <span className="font-mono text-[#64748B] text-[11px]">
                        {c.count} cases ({c.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                      <div
                        className="bg-[#134E3F] h-full rounded-full transition-all"
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 6. Monthly Intake vs Disposed Comparison Chart */}
      <Card>
        <CardHeader
          title={
            <div className="flex items-center gap-2">
              <TrendingUp size={17} className="text-[#154636]" />
              <span>Monthly Intake & Resolution Trends</span>
            </div>
          }
          subtitle="Chronological comparison of cases logged versus cases formally disposed"
          action={
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#154636]" />
                <span className="text-[#64748B]">Disposed Cases</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#D4A373]" />
                <span className="text-[#64748B]">Newly Received</span>
              </div>
            </div>
          }
        />
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {monthlyTrends.map((m) => (
              <div key={m.monthKey} className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl text-center space-y-2">
                <span className="text-xs font-semibold text-[#0F172A] block">
                  {m.monthLabel}
                </span>

                <div className="flex items-baseline justify-center gap-2 font-mono">
                  <span className="text-xs text-[#155836] font-bold">
                    ✓ {m.disposedCount}
                  </span>
                  <span className="text-xs text-[#64748B]">/</span>
                  <span className="text-xs text-[#D4A373] font-bold">
                    + {m.intakeCount}
                  </span>
                </div>

                {/* Vertical mini bars */}
                <div className="h-16 flex items-end justify-center gap-2 pt-2 border-t border-[#E6E1D8]">
                  <div
                    className="w-4 bg-[#154636] rounded-t-xs transition-all"
                    style={{ height: `${Math.min(100, (m.disposedCount / 10) * 100)}%` }}
                    title={`Disposed: ${m.disposedCount}`}
                  />
                  <div
                    className="w-4 bg-[#D4A373] rounded-t-xs transition-all"
                    style={{ height: `${Math.min(100, (m.intakeCount / 10) * 100)}%` }}
                    title={`Intake: ${m.intakeCount}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
