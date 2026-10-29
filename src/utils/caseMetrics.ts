/**
 * AICTE CaseConnect - Single Source of Truth for Metrics and Calculations
 * SIH 2026 - Problem Statement ID: SIH26264
 *
 * Strict Rule: Every KPI, chart, badge, notification, and CSV count MUST be derived
 * through this module. No invented numbers, trends, or separate math.
 * Invariant: open + resolved = total.
 */

import { Complaint, DeadlineRule, OverlapCandidate, BureauType, NavigationTab } from '../types';

let _mockNow: Date | null = null;

/**
 * Configure mock time for deterministic testing.
 */
export function setMockNow(d: Date | null): void {
  _mockNow = d;
}

/**
 * Single now() helper used across all time, deadline, and SLA computations.
 */
export function getNow(): Date {
  return _mockNow ? new Date(_mockNow.getTime()) : new Date();
}

/**
 * Compute days remaining until target deadline.
 * Positive = days left, Negative = days past deadline (overdue).
 */
export function getDaysRemaining(targetDeadline: string, now: Date = getNow()): number {
  if (!targetDeadline) return 0;
  const deadlineMs = new Date(targetDeadline).getTime();
  const nowMs = now.getTime();
  const diffDays = Math.ceil((deadlineMs - nowMs) / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Resolve the warning threshold (in days) for a given complaint against the active SLA rules.
 * Hierarchy:
 * 1. Active rule matching category, bureau, and priority
 * 2. Active rule matching category and bureau
 * 3. Active rule matching category
 * 4. Fallback default = 7 days
 */
export function getWarningThresholdDays(complaint: Complaint, rules: DeadlineRule[]): number {
  if (!rules || rules.length === 0) return 7;

  const activeRules = rules.filter((r) => r.isActive);

  // 1. Category + Bureau + Priority
  if (complaint.priority) {
    const specificMatch = activeRules.find(
      (r) =>
        r.category === complaint.category &&
        (r.appliesToBureau === 'ALL' || r.appliesToBureau === complaint.bureau) &&
        r.priority === complaint.priority
    );
    if (specificMatch) return specificMatch.warningThresholdDays;
  }

  // 2. Category + Bureau
  const bureauMatch = activeRules.find(
    (r) =>
      r.category === complaint.category &&
      (r.appliesToBureau === 'ALL' || r.appliesToBureau === complaint.bureau)
  );
  if (bureauMatch) return bureauMatch.warningThresholdDays;

  // 3. Category only
  const categoryMatch = activeRules.find((r) => r.category === complaint.category);
  if (categoryMatch) return categoryMatch.warningThresholdDays;

  // 4. Default fallback
  return 7;
}

/**
 * Check if a complaint is overdue.
 * Rule: Not CLOSED, and deadline is strictly in the past.
 */
export function isComplaintOverdue(complaint: Complaint, now: Date = getNow()): boolean {
  if (complaint.status === 'CLOSED') return false;
  if (!complaint.targetDeadline) return false;
  return new Date(complaint.targetDeadline).getTime() < now.getTime();
}

/**
 * Check if a complaint is due soon.
 * Rule: Not CLOSED, not overdue, and days remaining <= warningThresholdDays.
 */
export function isComplaintDueSoon(
  complaint: Complaint,
  rules: DeadlineRule[],
  now: Date = getNow()
): boolean {
  if (complaint.status === 'CLOSED') return false;
  if (isComplaintOverdue(complaint, now)) return false;

  const daysRemaining = getDaysRemaining(complaint.targetDeadline, now);
  const threshold = getWarningThresholdDays(complaint, rules);
  return daysRemaining >= 0 && daysRemaining <= threshold;
}

export interface CaseKPIs {
  total: number;
  open: number;
  overdue: number;
  resolved: number;
  dueSoon: number;
  onSchedule: number;
  awaitingFirstAction: number;
}

/**
 * Derive unified KPIs from visible complaints and active rules.
 * Guarantees invariant: open + resolved = total.
 */
export function deriveCaseKPIs(
  complaints: Complaint[],
  rules: DeadlineRule[] = [],
  now: Date = getNow()
): CaseKPIs {
  const total = complaints.length;
  let resolved = 0;
  let open = 0;
  let overdue = 0;
  let dueSoon = 0;
  let awaitingFirstAction = 0;

  for (const c of complaints) {
    if (c.status === 'CLOSED') {
      resolved++;
    } else {
      open++;
      if (c.status === 'SUBMITTED') {
        awaitingFirstAction++;
      }
      if (isComplaintOverdue(c, now)) {
        overdue++;
      } else if (isComplaintDueSoon(c, rules, now)) {
        dueSoon++;
      }
    }
  }

  const onSchedule = Math.max(0, open - overdue - dueSoon);

  // Invariant verification: open + resolved must equal total
  if (open + resolved !== total) {
    throw new Error(
      `CaseMetrics invariant violated: open (${open}) + resolved (${resolved}) !== total (${total})`
    );
  }

  return {
    total,
    open,
    overdue,
    resolved,
    dueSoon,
    onSchedule,
    awaitingFirstAction,
  };
}

/**
 * Calculate derived complaint counts for a specific institution.
 */
export interface DerivedInstitutionMetrics {
  totalComplaints: number;
  openComplaints: number;
  overdueCount: number;
  resolvedCount: number;
}

export function deriveInstitutionMetrics(
  institutionId: string,
  complaints: Complaint[],
  now: Date = getNow()
): DerivedInstitutionMetrics {
  const institutionComplaints = complaints.filter(
    (c) => c.institutionId === institutionId
  );
  let openCount = 0;
  let overdueCount = 0;
  let resolvedCount = 0;

  for (const c of institutionComplaints) {
    if (c.status === 'CLOSED') {
      resolvedCount++;
    } else {
      openCount++;
      if (isComplaintOverdue(c, now)) {
        overdueCount++;
      }
    }
  }

  return {
    totalComplaints: institutionComplaints.length,
    openComplaints: openCount,
    overdueCount,
    resolvedCount,
  };
}

/**
 * Sidebar badge counts derived strictly from live state:
 * - Complaints: awaiting first action (SUBMITTED)
 * - Coordination: pending overlap reviews
 * - Deadlines: overdue + due soon
 */
export interface SidebarBadges {
  complaints: number;
  coordination: number;
  deadlines: number;
}

export function deriveSidebarBadges(
  complaints: Complaint[],
  overlapCandidates: OverlapCandidate[],
  rules: DeadlineRule[],
  now: Date = getNow()
): SidebarBadges {
  const kpis = deriveCaseKPIs(complaints, rules, now);
  const pendingOverlaps = overlapCandidates.filter(
    (o) => o.reviewStatus === 'PENDING_REVIEW'
  ).length;

  return {
    complaints: kpis.awaitingFirstAction,
    coordination: pendingOverlaps,
    deadlines: kpis.overdue + kpis.dueSoon,
  };
}

/**
 * Derived notifications:
 * - Overdue cases
 * - Pending cross-bureau overlap reviews
 * - New grievance intake awaiting triage
 */
export interface DerivedNotification {
  id: string;
  type: 'OVERDUE' | 'OVERLAP' | 'INTAKE';
  title: string;
  message: string;
  timestamp: string;
  targetTab: NavigationTab;
  complaintId?: string;
  severity: 'danger' | 'warning' | 'info';
}

export function deriveNotifications(
  complaints: Complaint[],
  overlapCandidates: OverlapCandidate[],
  now: Date = getNow()
): DerivedNotification[] {
  const notifications: DerivedNotification[] = [];

  // 1. Overdue cases
  const overdueCases = complaints.filter((c) => isComplaintOverdue(c, now));
  for (const c of overdueCases.slice(0, 5)) {
    notifications.push({
      id: `notif-overdue-${c.id}`,
      type: 'OVERDUE',
      title: 'Statutory SLA Exceeded',
      message: `${c.trackingNumber} at ${c.institutionName} is overdue.`,
      timestamp: c.targetDeadline,
      targetTab: 'deadlines',
      complaintId: c.id,
      severity: 'danger',
    });
  }

  // 2. Pending overlaps
  const pendingOverlaps = overlapCandidates.filter(
    (o) => o.reviewStatus === 'PENDING_REVIEW'
  );
  for (const o of pendingOverlaps.slice(0, 3)) {
    notifications.push({
      id: `notif-overlap-${o.id}`,
      type: 'OVERLAP',
      title: 'Pending Overlap Review',
      message: `${o.targetInstitution}: ${o.similarityScore}% similarity flagged.`,
      timestamp: o.flaggedAt,
      targetTab: 'coordination',
      severity: 'warning',
    });
  }

  // 3. New intake cases
  const submittedCases = complaints.filter((c) => c.status === 'SUBMITTED');
  for (const c of submittedCases.slice(0, 3)) {
    notifications.push({
      id: `notif-intake-${c.id}`,
      type: 'INTAKE',
      title: 'New Intake Awaiting Triage',
      message: `${c.trackingNumber} registered for ${c.institutionName}.`,
      timestamp: c.createdAt,
      targetTab: 'complaints',
      complaintId: c.id,
      severity: 'info',
    });
  }

  return notifications;
}

/**
 * Status distribution breakdown for donut chart derived from complaints.
 */
export interface StatusDistributionItem {
  status: string;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export function deriveStatusDistribution(
  complaints: Complaint[]
): StatusDistributionItem[] {
  const total = complaints.length;
  if (total === 0) return [];

  const counts: Record<string, { count: number; label: string; color: string }> = {
    SUBMITTED: { count: 0, label: 'Submitted', color: '#2563EB' },
    UNDER_PROCESS: { count: 0, label: 'Under Process', color: '#0284C7' },
    COORDINATION: { count: 0, label: 'In Coordination', color: '#7C3AED' },
    RESOLUTION_REVIEW: { count: 0, label: 'Resolution Review', color: '#D97706' },
    CLOSED: { count: 0, label: 'Closed / Disposed', color: '#16A34A' },
  };

  for (const c of complaints) {
    if (counts[c.status]) {
      counts[c.status].count++;
    } else if (c.status === 'OVERDUE') {
      // If legacy status OVERDUE exists, group under UNDER_PROCESS count
      counts['UNDER_PROCESS'].count++;
    }
  }

  return Object.entries(counts).map(([status, item]) => ({
    status,
    label: item.label,
    count: item.count,
    percentage: total > 0 ? Math.round((item.count / total) * 1000) / 10 : 0,
    color: item.color,
  }));
}

/**
 * Bureau workload breakdown with total assigned, open, and overdue counts.
 */
export interface BureauWorkloadItem {
  bureauKey: BureauType;
  bureauName: string;
  totalAssigned: number;
  openCount: number;
  overdueCount: number;
  resolvedCount: number;
}

export const BUREAU_DEFINITIONS: { key: BureauType; name: string }[] = [
  { key: 'APPROVAL_BUREAU', name: 'Approval Bureau' },
  { key: 'FINANCE_BUREAU', name: 'Finance Bureau' },
  { key: 'GRIEVANCE_CELL', name: 'Public Grievance Cell' },
  { key: 'POLICY_ACADEMIC', name: 'Policy & Academic Bureau' },
  { key: 'LEGAL_CELL', name: 'Legal & Vigilance Cell' },
  { key: 'RAGGING_PREVENTION', name: 'Anti-Ragging Bureau' },
];

export function deriveBureauWorkload(
  complaints: Complaint[],
  now: Date = getNow()
): BureauWorkloadItem[] {
  return BUREAU_DEFINITIONS.map((b) => {
    const bureauComplaints = complaints.filter((c) => c.bureau === b.key);
    let openCount = 0;
    let overdueCount = 0;
    let resolvedCount = 0;

    for (const c of bureauComplaints) {
      if (c.status === 'CLOSED') {
        resolvedCount++;
      } else {
        openCount++;
        if (isComplaintOverdue(c, now)) {
          overdueCount++;
        }
      }
    }

    return {
      bureauKey: b.key,
      bureauName: b.name,
      totalAssigned: bureauComplaints.length,
      openCount,
      overdueCount,
      resolvedCount,
    };
  });
}

