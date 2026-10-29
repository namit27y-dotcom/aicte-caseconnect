/**
 * AICTE CaseConnect – Unit Tests: workflow.ts
 * Tests the strict state-machine transition rules.
 */

import { describe, it, expect } from 'vitest';
import {
  ALLOWED_TRANSITIONS,
  canTransition,
  getNextAllowedStatuses,
  validateTransition,
  STATUS_LABELS,
  STATUS_DESCRIPTIONS,
} from '../utils/workflow';
import type { ComplaintStatus } from '../types';

// ---------------------------------------------------------------------------
// ALLOWED_TRANSITIONS map coverage
// ---------------------------------------------------------------------------

describe('ALLOWED_TRANSITIONS', () => {
  it('covers all six ComplaintStatus values as keys', () => {
    const statuses: ComplaintStatus[] = [
      'SUBMITTED', 'UNDER_PROCESS', 'COORDINATION', 'RESOLUTION_REVIEW', 'OVERDUE', 'CLOSED',
    ];
    statuses.forEach((s) => {
      expect(ALLOWED_TRANSITIONS).toHaveProperty(s);
    });
  });

  it('CLOSED is a terminal state with no outgoing transitions', () => {
    expect(ALLOWED_TRANSITIONS['CLOSED']).toEqual([]);
  });

  it('SUBMITTED only transitions to UNDER_PROCESS', () => {
    expect(ALLOWED_TRANSITIONS['SUBMITTED']).toEqual(['UNDER_PROCESS']);
  });
});

// ---------------------------------------------------------------------------
// canTransition()
// ---------------------------------------------------------------------------

describe('canTransition', () => {
  // Valid transitions
  const validTransitions: [ComplaintStatus, ComplaintStatus][] = [
    ['SUBMITTED', 'UNDER_PROCESS'],
    ['UNDER_PROCESS', 'COORDINATION'],
    ['UNDER_PROCESS', 'RESOLUTION_REVIEW'],
    ['COORDINATION', 'UNDER_PROCESS'],
    ['COORDINATION', 'RESOLUTION_REVIEW'],
    ['RESOLUTION_REVIEW', 'UNDER_PROCESS'],
    ['RESOLUTION_REVIEW', 'CLOSED'],
    ['OVERDUE', 'UNDER_PROCESS'],
    ['OVERDUE', 'COORDINATION'],
    ['OVERDUE', 'RESOLUTION_REVIEW'],
  ];

  validTransitions.forEach(([from, to]) => {
    it(`allows valid transition ${from} → ${to}`, () => {
      expect(canTransition(from, to)).toBe(true);
    });
  });

  // Invalid transitions
  const invalidTransitions: [ComplaintStatus, ComplaintStatus][] = [
    ['SUBMITTED', 'CLOSED'],
    ['SUBMITTED', 'COORDINATION'],
    ['SUBMITTED', 'RESOLUTION_REVIEW'],
    ['CLOSED', 'UNDER_PROCESS'],
    ['CLOSED', 'SUBMITTED'],
    ['CLOSED', 'COORDINATION'],
    ['RESOLUTION_REVIEW', 'SUBMITTED'],
    ['RESOLUTION_REVIEW', 'COORDINATION'],
    ['COORDINATION', 'SUBMITTED'],
    ['COORDINATION', 'CLOSED'],
  ];

  invalidTransitions.forEach(([from, to]) => {
    it(`rejects invalid transition ${from} → ${to}`, () => {
      expect(canTransition(from, to)).toBe(false);
    });
  });

  it('rejects self-transitions (no status → same status)', () => {
    const statuses: ComplaintStatus[] = [
      'SUBMITTED', 'UNDER_PROCESS', 'COORDINATION', 'RESOLUTION_REVIEW', 'OVERDUE', 'CLOSED',
    ];
    statuses.forEach((s) => {
      expect(canTransition(s, s)).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// getNextAllowedStatuses()
// ---------------------------------------------------------------------------

describe('getNextAllowedStatuses', () => {
  it('returns empty array for CLOSED (terminal state)', () => {
    expect(getNextAllowedStatuses('CLOSED')).toEqual([]);
  });

  it('returns only UNDER_PROCESS for SUBMITTED', () => {
    expect(getNextAllowedStatuses('SUBMITTED')).toEqual(['UNDER_PROCESS']);
  });

  it('returns COORDINATION and RESOLUTION_REVIEW for UNDER_PROCESS', () => {
    const nexts = getNextAllowedStatuses('UNDER_PROCESS');
    expect(nexts).toContain('COORDINATION');
    expect(nexts).toContain('RESOLUTION_REVIEW');
    expect(nexts).not.toContain('CLOSED');
  });

  it('returns UNDER_PROCESS and CLOSED for RESOLUTION_REVIEW', () => {
    const nexts = getNextAllowedStatuses('RESOLUTION_REVIEW');
    expect(nexts).toContain('UNDER_PROCESS');
    expect(nexts).toContain('CLOSED');
  });

  it('returns UNDER_PROCESS, COORDINATION, RESOLUTION_REVIEW for OVERDUE', () => {
    const nexts = getNextAllowedStatuses('OVERDUE');
    expect(nexts).toContain('UNDER_PROCESS');
    expect(nexts).toContain('COORDINATION');
    expect(nexts).toContain('RESOLUTION_REVIEW');
    expect(nexts).not.toContain('CLOSED');
    expect(nexts).not.toContain('SUBMITTED');
  });
});

// ---------------------------------------------------------------------------
// validateTransition()
// ---------------------------------------------------------------------------

describe('validateTransition', () => {
  it('returns valid: true for a correct transition with non-empty reason', () => {
    const result = validateTransition('SUBMITTED', 'UNDER_PROCESS', 'Triage complete; forwarding to scrutiny officer.');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('returns valid: false when reason is empty', () => {
    const result = validateTransition('SUBMITTED', 'UNDER_PROCESS', '');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns valid: false when reason is only whitespace', () => {
    const result = validateTransition('SUBMITTED', 'UNDER_PROCESS', '   ');
    expect(result.valid).toBe(false);
  });

  it('returns valid: false for an invalid transition even with a valid reason', () => {
    const result = validateTransition('SUBMITTED', 'CLOSED', 'Skipping all steps');
    expect(result.valid).toBe(false);
    expect(result.error).toBeTruthy();
  });

  it('returns valid: false for any transition FROM CLOSED (terminal)', () => {
    const statuses: ComplaintStatus[] = ['SUBMITTED', 'UNDER_PROCESS', 'COORDINATION'];
    statuses.forEach((target) => {
      const result = validateTransition('CLOSED', target, 'Trying to reopen');
      expect(result.valid).toBe(false);
    });
  });
});

// ---------------------------------------------------------------------------
// STATUS_LABELS / STATUS_DESCRIPTIONS completeness
// ---------------------------------------------------------------------------

describe('STATUS_LABELS and STATUS_DESCRIPTIONS', () => {
  const statuses: ComplaintStatus[] = [
    'SUBMITTED', 'UNDER_PROCESS', 'COORDINATION', 'RESOLUTION_REVIEW', 'OVERDUE', 'CLOSED',
  ];

  statuses.forEach((s) => {
    it(`STATUS_LABELS has a non-empty label for ${s}`, () => {
      expect(STATUS_LABELS[s]).toBeTruthy();
    });

    it(`STATUS_DESCRIPTIONS has a non-empty description for ${s}`, () => {
      expect(STATUS_DESCRIPTIONS[s]).toBeTruthy();
    });
  });
});

