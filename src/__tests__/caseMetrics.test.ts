/**
 * AICTE CaseConnect – Unit Tests: caseMetrics.ts
 * All time-dependent tests use setMockNow() for determinism.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  setMockNow,
  getNow,
  getDaysRemaining,
  getWarningThresholdDays,
  isComplaintOverdue,
  isComplaintDueSoon,
  deriveCaseKPIs,
  deriveInstitutionMetrics,
  deriveSidebarBadges,
  deriveNotifications,
} from '../utils/caseMetrics';
import type { Complaint, DeadlineRule, OverlapCandidate } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const NOW = new Date('2026-10-29T12:00:00Z');

const makeComplaint = (overrides: Partial<Complaint>): Complaint => ({
  id: 'comp-test',
  trackingNumber: 'CC-2026-000001',
  title: 'Test Complaint',
  description: 'Test description',
  category: 'ADMISSION_FRAUD',
  categoryLabel: 'Admission Fraud',
  priority: 'HIGH',
  status: 'UNDER_PROCESS',
  bureau: 'APPROVAL_BUREAU',
  bureauName: 'Approval Bureau',
  institutionId: 'inst-1',
  institutionName: 'Test Institute',
  institutionState: 'Maharashtra',
  complainantName: 'Alice Test',
  complainantType: 'STUDENT',
  assignedOfficerId: 'user-1',
  assignedOfficerName: 'Officer A',
  targetDeadline: '2026-11-30T00:00:00Z', // 32 days ahead of NOW
  createdAt: '2026-10-01T09:00:00Z',
  resolvedAt: undefined,
  isOverdue: false,
  overlapCount: 0,
  events: [],
  ...overrides,
});

const makeRule = (overrides: Partial<DeadlineRule>): DeadlineRule => ({
  id: 'rule-test',
  name: 'Test Rule',
  category: 'ADMISSION_FRAUD',
  categoryName: 'Admission Fraud',
  appliesToBureau: 'ALL',
  priority: 'HIGH',
  defaultDurationDays: 30,
  warningThresholdDays: 7,
  escalationTarget: 'Bureau Head',
  isActive: true,
  ...overrides,
});

// ---------------------------------------------------------------------------
// Mock time setup
// ---------------------------------------------------------------------------

beforeEach(() => setMockNow(NOW));
afterEach(() => setMockNow(null));

// ---------------------------------------------------------------------------
// getNow()
// ---------------------------------------------------------------------------

describe('getNow', () => {
  it('returns mock time when setMockNow is set', () => {
    expect(getNow().toISOString()).toBe(NOW.toISOString());
  });

  it('returns a Date close to real time when mock is cleared', () => {
    setMockNow(null);
    const before = Date.now();
    const returned = getNow().getTime();
    const after = Date.now();
    expect(returned).toBeGreaterThanOrEqual(before);
    expect(returned).toBeLessThanOrEqual(after + 10);
  });
});

// ---------------------------------------------------------------------------
// getDaysRemaining()
// ---------------------------------------------------------------------------

describe('getDaysRemaining', () => {
  it('returns positive days for a future deadline', () => {
    const future = '2026-10-31T12:00:00Z'; // 2 days ahead
    expect(getDaysRemaining(future, NOW)).toBe(2);
  });

  it('returns 0 for a deadline exactly at now', () => {
    // ceil of 0 = 0
    expect(getDaysRemaining(NOW.toISOString(), NOW)).toBe(0);
  });

  it('returns negative days for a past deadline', () => {
    const past = '2026-10-27T12:00:00Z'; // 2 days behind
    expect(getDaysRemaining(past, NOW)).toBe(-2);
  });

  it('returns 0 for an empty deadline string', () => {
    expect(getDaysRemaining('', NOW)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// getWarningThresholdDays()
// ---------------------------------------------------------------------------

describe('getWarningThresholdDays', () => {
  it('returns 7 when no rules are provided', () => {
    const c = makeComplaint({});
    expect(getWarningThresholdDays(c, [])).toBe(7);
  });

  it('returns the matching active rule warningThresholdDays', () => {
    const c = makeComplaint({ category: 'RAGGING', bureau: 'RAGGING_PREVENTION', priority: 'CRITICAL' });
    const rule = makeRule({ category: 'RAGGING', appliesToBureau: 'RAGGING_PREVENTION', priority: 'CRITICAL', warningThresholdDays: 3 });
    expect(getWarningThresholdDays(c, [rule])).toBe(3);
  });

  it('falls back to category-only rule when no bureau+category match', () => {
    const c = makeComplaint({ category: 'FEE_EXTORTION', bureau: 'FINANCE_BUREAU', priority: 'MEDIUM' });
    const rule = makeRule({ category: 'FEE_EXTORTION', appliesToBureau: 'ALL', warningThresholdDays: 10 });
    expect(getWarningThresholdDays(c, [rule])).toBe(10);
  });

  it('ignores inactive rules and falls back to 7', () => {
    const c = makeComplaint({ category: 'RAGGING' });
    const inactiveRule = makeRule({ category: 'RAGGING', isActive: false, warningThresholdDays: 3 });
    expect(getWarningThresholdDays(c, [inactiveRule])).toBe(7);
  });
});

// ---------------------------------------------------------------------------
// isComplaintOverdue()
// ---------------------------------------------------------------------------

describe('isComplaintOverdue', () => {
  it('returns false for CLOSED complaints regardless of deadline', () => {
    const c = makeComplaint({ status: 'CLOSED', targetDeadline: '2020-01-01T00:00:00Z' });
    expect(isComplaintOverdue(c, NOW)).toBe(false);
  });

  it('returns true when open and deadline is in the past', () => {
    const c = makeComplaint({ status: 'UNDER_PROCESS', targetDeadline: '2026-10-01T00:00:00Z' });
    expect(isComplaintOverdue(c, NOW)).toBe(true);
  });

  it('returns false when open and deadline is in the future', () => {
    const c = makeComplaint({ status: 'UNDER_PROCESS', targetDeadline: '2026-12-31T00:00:00Z' });
    expect(isComplaintOverdue(c, NOW)).toBe(false);
  });

  it('returns false for empty deadline', () => {
    const c = makeComplaint({ status: 'UNDER_PROCESS', targetDeadline: '' });
    expect(isComplaintOverdue(c, NOW)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// isComplaintDueSoon()
// ---------------------------------------------------------------------------

describe('isComplaintDueSoon', () => {
  it('returns false for CLOSED complaints', () => {
    const c = makeComplaint({ status: 'CLOSED', targetDeadline: '2026-10-30T00:00:00Z' });
    const rule = makeRule({ warningThresholdDays: 7 });
    expect(isComplaintDueSoon(c, [rule], NOW)).toBe(false);
  });

  it('returns false when already overdue', () => {
    const c = makeComplaint({ status: 'UNDER_PROCESS', targetDeadline: '2026-10-01T00:00:00Z' });
    const rule = makeRule({ warningThresholdDays: 7 });
    expect(isComplaintDueSoon(c, [rule], NOW)).toBe(false);
  });

  it('returns true when open, not overdue, and within warning threshold', () => {
    // Deadline in 5 days; threshold is 7 → due soon
    const c = makeComplaint({
      status: 'UNDER_PROCESS',
      targetDeadline: '2026-11-03T12:00:00Z',
      category: 'ADMISSION_FRAUD',
      bureau: 'APPROVAL_BUREAU',
      priority: 'HIGH',
    });
    const rule = makeRule({ warningThresholdDays: 7 });
    expect(isComplaintDueSoon(c, [rule], NOW)).toBe(true);
  });

  it('returns false when well within SLA (beyond threshold)', () => {
    // Deadline in 30 days; threshold 7 → not due soon
    const c = makeComplaint({
      status: 'UNDER_PROCESS',
      targetDeadline: '2026-11-28T12:00:00Z',
    });
    const rule = makeRule({ warningThresholdDays: 7 });
    expect(isComplaintDueSoon(c, [rule], NOW)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// deriveCaseKPIs()
// ---------------------------------------------------------------------------

describe('deriveCaseKPIs', () => {
  it('satisfies the invariant: open + resolved === total', () => {
    const complaints = [
      makeComplaint({ id: 'a', status: 'UNDER_PROCESS', targetDeadline: '2026-12-31T00:00:00Z' }),
      makeComplaint({ id: 'b', status: 'CLOSED', targetDeadline: '2026-10-01T00:00:00Z' }),
      makeComplaint({ id: 'c', status: 'SUBMITTED', targetDeadline: '2026-12-31T00:00:00Z' }),
      makeComplaint({ id: 'd', status: 'OVERDUE', targetDeadline: '2026-10-01T00:00:00Z' }),
    ];
    const kpis = deriveCaseKPIs(complaints, [], NOW);
    expect(kpis.open + kpis.resolved).toBe(kpis.total);
    expect(kpis.total).toBe(4);
    expect(kpis.resolved).toBe(1);
    expect(kpis.open).toBe(3);
  });

  it('correctly counts overdue cases (subset of open)', () => {
    const complaints = [
      makeComplaint({ id: 'x1', status: 'UNDER_PROCESS', targetDeadline: '2026-09-01T00:00:00Z' }),
      makeComplaint({ id: 'x2', status: 'UNDER_PROCESS', targetDeadline: '2026-09-02T00:00:00Z' }),
      makeComplaint({ id: 'x3', status: 'UNDER_PROCESS', targetDeadline: '2026-12-31T00:00:00Z' }),
    ];
    const kpis = deriveCaseKPIs(complaints, [], NOW);
    expect(kpis.overdue).toBe(2);
    expect(kpis.open).toBe(3);
    expect(kpis.overdue).toBeLessThanOrEqual(kpis.open);
  });

  it('returns zero counts for empty input', () => {
    const kpis = deriveCaseKPIs([], [], NOW);
    expect(kpis.total).toBe(0);
    expect(kpis.open).toBe(0);
    expect(kpis.resolved).toBe(0);
    expect(kpis.overdue).toBe(0);
  });

  it('counts awaitingFirstAction only for SUBMITTED status', () => {
    const complaints = [
      makeComplaint({ id: 's1', status: 'SUBMITTED', targetDeadline: '2026-12-31T00:00:00Z' }),
      makeComplaint({ id: 's2', status: 'SUBMITTED', targetDeadline: '2026-12-31T00:00:00Z' }),
      makeComplaint({ id: 's3', status: 'UNDER_PROCESS', targetDeadline: '2026-12-31T00:00:00Z' }),
    ];
    const kpis = deriveCaseKPIs(complaints, [], NOW);
    expect(kpis.awaitingFirstAction).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// deriveInstitutionMetrics()
// ---------------------------------------------------------------------------

describe('deriveInstitutionMetrics', () => {
  it('derives counts strictly from complaint state, not stale fields', () => {
    const complaints = [
      makeComplaint({ id: 'i1', institutionId: 'inst-A', status: 'UNDER_PROCESS', targetDeadline: '2026-09-01T00:00:00Z' }),
      makeComplaint({ id: 'i2', institutionId: 'inst-A', status: 'CLOSED', targetDeadline: '2026-10-01T00:00:00Z' }),
      makeComplaint({ id: 'i3', institutionId: 'inst-A', status: 'SUBMITTED', targetDeadline: '2026-12-31T00:00:00Z' }),
      makeComplaint({ id: 'i4', institutionId: 'inst-B', status: 'CLOSED', targetDeadline: '2026-10-01T00:00:00Z' }),
    ];

    const metricsA = deriveInstitutionMetrics('inst-A', complaints, NOW);
    expect(metricsA.totalComplaints).toBe(3);
    expect(metricsA.openComplaints).toBe(2);
    expect(metricsA.resolvedCount).toBe(1);
    expect(metricsA.overdueCount).toBe(1);

    const metricsB = deriveInstitutionMetrics('inst-B', complaints, NOW);
    expect(metricsB.totalComplaints).toBe(1);
    expect(metricsB.resolvedCount).toBe(1);
    expect(metricsB.openComplaints).toBe(0);
  });

  it('returns zeros for an institution with no complaints', () => {
    const metrics = deriveInstitutionMetrics('inst-UNKNOWN', [], NOW);
    expect(metrics.totalComplaints).toBe(0);
    expect(metrics.openComplaints).toBe(0);
    expect(metrics.overdueCount).toBe(0);
    expect(metrics.resolvedCount).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// deriveSidebarBadges()
// ---------------------------------------------------------------------------

describe('deriveSidebarBadges', () => {
  it('returns complaints badge = awaitingFirstAction (SUBMITTED count)', () => {
    const complaints = [
      makeComplaint({ id: 'b1', status: 'SUBMITTED', targetDeadline: '2026-12-31T00:00:00Z' }),
      makeComplaint({ id: 'b2', status: 'SUBMITTED', targetDeadline: '2026-12-31T00:00:00Z' }),
      makeComplaint({ id: 'b3', status: 'UNDER_PROCESS', targetDeadline: '2026-12-31T00:00:00Z' }),
    ];
    const overlaps: OverlapCandidate[] = [];
    const badges = deriveSidebarBadges(complaints, overlaps, [], NOW);
    expect(badges.complaints).toBe(2);
  });

  it('returns coordination badge = pending overlap reviews count', () => {
    const complaints: Complaint[] = [];
    const overlaps: OverlapCandidate[] = [
      { id: 'ov-1', primaryCaseId: 'a', targetCaseId: 'b', targetTrackingNumber: 'CC-01', targetInstitution: 'X', similarityScore: 70, evidence: {} as any, reviewStatus: 'PENDING_REVIEW', flaggedAt: '' },
      { id: 'ov-2', primaryCaseId: 'c', targetCaseId: 'd', targetTrackingNumber: 'CC-02', targetInstitution: 'Y', similarityScore: 60, evidence: {} as any, reviewStatus: 'CONFIRMED_RELATED', flaggedAt: '' },
    ];
    const badges = deriveSidebarBadges(complaints, overlaps, [], NOW);
    expect(badges.coordination).toBe(1);
  });

  it('returns deadlines badge = overdue + dueSoon count', () => {
    const complaints = [
      // Overdue
      makeComplaint({ id: 'd1', status: 'UNDER_PROCESS', targetDeadline: '2026-10-01T00:00:00Z' }),
      // Due soon (5 days away, threshold 7)
      makeComplaint({ id: 'd2', status: 'UNDER_PROCESS', targetDeadline: '2026-11-03T12:00:00Z', category: 'ADMISSION_FRAUD', bureau: 'APPROVAL_BUREAU', priority: 'HIGH' }),
      // On schedule
      makeComplaint({ id: 'd3', status: 'UNDER_PROCESS', targetDeadline: '2026-12-31T00:00:00Z' }),
    ];
    const rule = makeRule({ warningThresholdDays: 7 });
    const badges = deriveSidebarBadges(complaints, [], [rule], NOW);
    expect(badges.deadlines).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// deriveNotifications()
// ---------------------------------------------------------------------------

describe('deriveNotifications', () => {
  it('generates OVERDUE notifications for overdue open complaints', () => {
    const complaints = [
      makeComplaint({ id: 'n1', status: 'UNDER_PROCESS', targetDeadline: '2026-09-01T00:00:00Z', title: 'Overdue Case' }),
    ];
    const notifs = deriveNotifications(complaints, [], NOW);
    const overdueNotifs = notifs.filter((n) => n.type === 'OVERDUE');
    expect(overdueNotifs.length).toBeGreaterThanOrEqual(1);
  });

  it('generates OVERLAP notifications for pending overlap reviews', () => {
    const complaints: Complaint[] = [];
    const overlaps: OverlapCandidate[] = [
      { id: 'ov-1', primaryCaseId: 'a', targetCaseId: 'b', targetTrackingNumber: 'CC-01', targetInstitution: 'Inst X', similarityScore: 80, evidence: {} as any, reviewStatus: 'PENDING_REVIEW', flaggedAt: '' },
    ];
    const notifs = deriveNotifications(complaints, overlaps, NOW);
    const overlapNotifs = notifs.filter((n) => n.type === 'OVERLAP');
    expect(overlapNotifs.length).toBeGreaterThanOrEqual(1);
  });

  it('does not generate OVERDUE notifications for CLOSED complaints', () => {
    const complaints = [
      makeComplaint({ id: 'n2', status: 'CLOSED', targetDeadline: '2026-09-01T00:00:00Z' }),
    ];
    const notifs = deriveNotifications(complaints, [], NOW);
    const overdueNotifs = notifs.filter((n) => n.type === 'OVERDUE');
    expect(overdueNotifs.length).toBe(0);
  });
});
