/**
 * AICTE CaseConnect - Reusable Typed Analytics Calculation Engine
 * SIH 2026 - Problem Statement ID: SIH26264
 * 
 * Strict rule: All metrics are computed dynamically from active/filtered complaint records.
 * Formulas are transparently documented and resilient to empty/missing date values.
 */

import { Complaint, BureauType, ComplaintCategory } from '../types';
import { getNow, isComplaintOverdue } from './caseMetrics';

export interface AnalyticsKPIs {
  total: number;
  open: number;
  overdue: number;
  disposed: number;
  disposalRate: number; // Formula: (disposed / total) * 100
  avgResolutionDays: number | null; // Formula: Σ(Resolved Date - Intake Date) / Disposed Count
  crossBureauCount: number; // Cases flagged with overlap or coordination group
}

export interface BureauWorkloadMetric {
  bureauKey: BureauType;
  bureauName: string;
  totalAssigned: number;
  openCount: number;
  overdueCount: number;
  disposedCount: number;
  shareOfOpen: number; // % of all active open complaints across AICTE
}

export interface StateComplaintMetric {
  state: string;
  total: number;
  open: number;
  disposed: number;
  overdue: number;
  percentage: number;
}

export interface AgingBucketMetric {
  bucket: string;
  label: string;
  count: number;
  percentage: number;
  description: string;
}

export interface MonthlyTrendMetric {
  monthKey: string;
  monthLabel: string;
  intakeCount: number;
  disposedCount: number;
}

export interface CategoryMetric {
  category: ComplaintCategory | string;
  label: string;
  count: number;
  percentage: number;
}

/**
 * Standard bureaus tracked across AICTE
 */
export const TRACKED_BUREAUS: { key: BureauType; label: string }[] = [
  { key: 'APPROVAL_BUREAU', label: 'Approval Bureau' },
  { key: 'FINANCE_BUREAU', label: 'Finance Bureau' },
  { key: 'GRIEVANCE_CELL', label: 'Public Grievance Cell' },
  { key: 'POLICY_ACADEMIC', label: 'Policy & Academic Bureau' },
  { key: 'LEGAL_CELL', label: 'Legal & Vigilance Cell' },
  { key: 'RAGGING_PREVENTION', label: 'Anti-Ragging Bureau' },
];

/**
 * Calculate high-level KPIs from a list of complaints
 */
export function calculateKPIs(complaints: Complaint[]): AnalyticsKPIs {
  const total = complaints.length;
  if (total === 0) {
    return {
      total: 0,
      open: 0,
      overdue: 0,
      disposed: 0,
      disposalRate: 0,
      avgResolutionDays: null,
      crossBureauCount: 0,
    };
  }

  const now = getNow();
  const open = complaints.filter(c => c.status !== 'CLOSED').length;
  const overdue = complaints.filter(c => isComplaintOverdue(c, now)).length;
  const disposed = complaints.filter(c => c.status === 'CLOSED').length;
  const disposalRate = total > 0 ? Math.round((disposed / total) * 1000) / 10 : 0;

  // Resolution duration: Calculate for CLOSED complaints having both createdAt & resolvedAt
  const closedWithDates = complaints.filter(
    c => c.status === 'CLOSED' && c.createdAt && (c.resolvedAt || c.events.some(e => e.action.includes('DISPOSED')))
  );

  let avgResolutionDays: number | null = null;
  if (closedWithDates.length > 0) {
    const totalDays = closedWithDates.reduce((acc, c) => {
      const start = new Date(c.createdAt).getTime();
      let end = c.resolvedAt ? new Date(c.resolvedAt).getTime() : 0;
      if (!end) {
        const disposedEvent = c.events.find(e => e.action.includes('DISPOSED'));
        if (disposedEvent) end = new Date(disposedEvent.timestamp).getTime();
      }
      if (end && end >= start) {
        const days = (end - start) / (1000 * 60 * 60 * 24);
        return acc + days;
      }
      return acc;
    }, 0);

    avgResolutionDays = Math.round((totalDays / closedWithDates.length) * 10) / 10;
  }

  const crossBureauCount = complaints.filter(
    c => c.overlapCount > 0 || Boolean(c.coordinationGroupId)
  ).length;

  return {
    total,
    open,
    overdue,
    disposed,
    disposalRate,
    avgResolutionDays,
    crossBureauCount,
  };
}

/**
 * Calculate workload and distribution per bureau
 */
export function calculateBureauWorkload(complaints: Complaint[]): BureauWorkloadMetric[] {
  const totalOpenOverall = complaints.filter(c => c.status !== 'CLOSED').length;
  const now = getNow();

  return TRACKED_BUREAUS.map(b => {
    const bureauComplaints = complaints.filter(c => c.bureau === b.key);
    const totalAssigned = bureauComplaints.length;
    const openCount = bureauComplaints.filter(c => c.status !== 'CLOSED').length;
    const overdueCount = bureauComplaints.filter(c => isComplaintOverdue(c, now)).length;
    const disposedCount = bureauComplaints.filter(c => c.status === 'CLOSED').length;
    const shareOfOpen = totalOpenOverall > 0 
      ? Math.round((openCount / totalOpenOverall) * 100) 
      : 0;

    return {
      bureauKey: b.key,
      bureauName: b.label,
      totalAssigned,
      openCount,
      overdueCount,
      disposedCount,
      shareOfOpen,
    };
  });
}

/**
 * Calculate state-wise complaint distribution
 */
export function calculateStateDistribution(complaints: Complaint[]): StateComplaintMetric[] {
  if (complaints.length === 0) return [];
  const now = getNow();

  const stateMap = new Map<string, { total: number; open: number; disposed: number; overdue: number }>();

  complaints.forEach(c => {
    const state = c.institutionState?.trim() || 'Unspecified Region';
    const entry = stateMap.get(state) || { total: 0, open: 0, disposed: 0, overdue: 0 };
    entry.total += 1;
    if (c.status === 'CLOSED') {
      entry.disposed += 1;
    } else {
      entry.open += 1;
      if (isComplaintOverdue(c, now)) entry.overdue += 1;
    }
    stateMap.set(state, entry);
  });

  const totalComplaints = complaints.length;
  const result: StateComplaintMetric[] = [];

  stateMap.forEach((data, state) => {
    result.push({
      state,
      total: data.total,
      open: data.open,
      disposed: data.disposed,
      overdue: data.overdue,
      percentage: Math.round((data.total / totalComplaints) * 100),
    });
  });

  // Sort descending by total volume
  return result.sort((a, b) => b.total - a.total);
}

/**
 * Calculate age buckets for active/open complaints
 */
export function calculateAgingBuckets(
  complaints: Complaint[]
): AgingBucketMetric[] {
  const refTime = getNow().getTime();
  const openComplaints = complaints.filter(c => c.status !== 'CLOSED');
  const totalOpen = openComplaints.length;

  const buckets = [
    { bucket: '0-7', label: '0–7 Days', description: 'Fresh intake / triage window', count: 0 },
    { bucket: '8-30', label: '8–30 Days', description: 'Active investigation phase', count: 0 },
    { bucket: '31-60', label: '31–60 Days', description: 'Extended inquiry / coordination', count: 0 },
    { bucket: '60+', label: '60+ Days', description: 'Critical backlog / SLA breach risk', count: 0 },
  ];

  openComplaints.forEach(c => {
    const createdTime = new Date(c.createdAt).getTime();
    const daysOld = Math.max(0, Math.floor((refTime - createdTime) / (1000 * 60 * 60 * 24)));

    if (daysOld <= 7) {
      buckets[0].count += 1;
    } else if (daysOld <= 30) {
      buckets[1].count += 1;
    } else if (daysOld <= 60) {
      buckets[2].count += 1;
    } else {
      buckets[3].count += 1;
    }
  });

  return buckets.map(b => ({
    ...b,
    percentage: totalOpen > 0 ? Math.round((b.count / totalOpen) * 100) : 0,
  }));
}

/**
 * Calculate category breakdown
 */
export function calculateCategoryDistribution(complaints: Complaint[]): CategoryMetric[] {
  if (complaints.length === 0) return [];

  const catMap = new Map<string, number>();

  complaints.forEach(c => {
    const label = c.categoryLabel || c.category;
    catMap.set(label, (catMap.get(label) || 0) + 1);
  });

  const total = complaints.length;
  const result: CategoryMetric[] = [];

  catMap.forEach((count, label) => {
    result.push({
      category: label,
      label,
      count,
      percentage: Math.round((count / total) * 100),
    });
  });

  return result.sort((a, b) => b.count - a.count);
}

/**
 * Calculate monthly trends across distinct periods present in the complaint dataset
 */
export function calculateMonthlyTrends(complaints: Complaint[]): MonthlyTrendMetric[] {
  if (complaints.length === 0) return [];

  const monthSet = new Set<string>();
  complaints.forEach(c => {
    if (c.createdAt) monthSet.add(c.createdAt.slice(0, 7));
    if (c.resolvedAt) monthSet.add(c.resolvedAt.slice(0, 7));
  });

  const sortedMonths = Array.from(monthSet).sort();
  if (sortedMonths.length === 0) return [];

  return sortedMonths.map(key => {
    const dateObj = new Date(`${key}-01T00:00:00Z`);
    const monthLabel = dateObj.toLocaleDateString('en-US', { month: 'short', year: 'numeric', timeZone: 'UTC' });

    const intakeCount = complaints.filter(c => c.createdAt && c.createdAt.startsWith(key)).length;
    const disposedCount = complaints.filter(
      c => c.status === 'CLOSED' && (
        (c.resolvedAt && c.resolvedAt.startsWith(key)) ||
        c.events.some(e => e.action.includes('DISPOSED') && e.timestamp.startsWith(key))
      )
    ).length;

    return {
      monthKey: key,
      monthLabel,
      intakeCount,
      disposedCount,
    };
  });
}

/**
 * Export safe RFC 4180 CSV with cell formula injection neutralization
 */
export function exportAnalyticsToCSV(
  complaints: Complaint[],
  activeFilterSummary: string
) {
  const kpis = calculateKPIs(complaints);
  const now = getNow();

  const sanitizeCell = (val: string | number | undefined | null): string => {
    if (val === undefined || val === null) return '""';
    let str = String(val);
    if (/^[=+\-@]/.test(str)) {
      str = "'" + str;
    }
    return `"${str.replace(/"/g, '""')}"`;
  };

  const headerSummaryLines = [
    `"AICTE CaseConnect Analytics Report (SIH26264)"`,
    `"Generated At: ${now.toISOString()}"`,
    `"Active Filter Scope: ${activeFilterSummary}"`,
    `"Total Cases: ${kpis.total}"`,
    `"Open Cases: ${kpis.open}"`,
    `"Overdue Cases: ${kpis.overdue}"`,
    `"Disposed Cases: ${kpis.disposed}"`,
    `"Disposal Rate: ${kpis.disposalRate}%"`,
    `"Average Resolution Duration: ${kpis.avgResolutionDays ? `${kpis.avgResolutionDays} days` : 'N/A'}"`,
    '""',
    '"Tracking Number","Institution Name","State","Category","Bureau","Status","Priority","Created Date","Target Deadline","Overdue Flag","Cross-Bureau Overlap"',
  ];

  const dataRows = complaints.map(c => [
    sanitizeCell(c.trackingNumber),
    sanitizeCell(c.institutionName),
    sanitizeCell(c.institutionState),
    sanitizeCell(c.categoryLabel || c.category),
    sanitizeCell(c.bureauName || c.bureau),
    sanitizeCell(c.status),
    sanitizeCell(c.priority),
    sanitizeCell(c.createdAt ? c.createdAt.slice(0, 10) : 'N/A'),
    sanitizeCell(c.targetDeadline ? c.targetDeadline.slice(0, 10) : 'N/A'),
    sanitizeCell(isComplaintOverdue(c, now) ? 'YES' : 'NO'),
    sanitizeCell(c.overlapCount > 0 ? `YES (${c.overlapCount})` : 'NO'),
  ].join(','));

  const csvContent = [...headerSummaryLines, ...dataRows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = url;
  downloadAnchor.download = `aicte_caseconnect_analytics_${now.toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  document.body.removeChild(downloadAnchor);
  URL.revokeObjectURL(url);
}
