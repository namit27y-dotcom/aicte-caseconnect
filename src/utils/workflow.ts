/**
 * AICTE CaseConnect - Workflow Engine & State Machine
 * SIH 2026 - Problem Statement ID: SIH26264
 *
 * Strict state transition governance. No arbitrary or skipped transitions allowed.
 * Every transition requires a non-empty audit justification reason.
 */

import { ComplaintStatus } from '../types';

export const ALLOWED_TRANSITIONS: Record<ComplaintStatus, ComplaintStatus[]> = {
  SUBMITTED: ['UNDER_PROCESS'],
  UNDER_PROCESS: ['COORDINATION', 'RESOLUTION_REVIEW'],
  COORDINATION: ['UNDER_PROCESS', 'RESOLUTION_REVIEW'],
  RESOLUTION_REVIEW: ['UNDER_PROCESS', 'CLOSED'],
  OVERDUE: ['UNDER_PROCESS', 'COORDINATION', 'RESOLUTION_REVIEW'],
  CLOSED: [], // Terminal status
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  SUBMITTED: 'Submitted (Intake)',
  UNDER_PROCESS: 'Under Process',
  COORDINATION: 'Multi-Bureau Coordination',
  RESOLUTION_REVIEW: 'Resolution Review',
  CLOSED: 'Closed / Disposed',
  OVERDUE: 'Overdue (SLA Breached)',
};

export const STATUS_DESCRIPTIONS: Record<ComplaintStatus, string> = {
  SUBMITTED: 'Initial grievance registered; pending formal triage and preliminary examination.',
  UNDER_PROCESS: 'Active departmental investigation, verification, and documentation gathering.',
  COORDINATION: 'Cross-bureau joint inquiry or shared institution fact-finding.',
  RESOLUTION_REVIEW: 'Draft resolution or inquiry findings pending final administrative sign-off.',
  CLOSED: 'Final resolution or formal closure notice issued. Terminal state.',
  OVERDUE: 'Statutory SLA expired before closure. High-priority remediation required.',
};

/**
 * Check if transitioning from currentStatus to nextStatus is allowed by the workflow engine.
 */
export function canTransition(currentStatus: ComplaintStatus, nextStatus: ComplaintStatus): boolean {
  if (currentStatus === nextStatus) return false;
  const allowed = ALLOWED_TRANSITIONS[currentStatus];
  return Array.isArray(allowed) && allowed.includes(nextStatus);
}

/**
 * Return list of valid next statuses from current status.
 */
export function getNextAllowedStatuses(currentStatus: ComplaintStatus): ComplaintStatus[] {
  return ALLOWED_TRANSITIONS[currentStatus] || [];
}

/**
 * Validate that a proposed transition has a valid status and non-empty reason.
 */
export function validateTransition(
  currentStatus: ComplaintStatus,
  nextStatus: ComplaintStatus,
  reason: string
): { valid: boolean; error?: string } {
  if (!reason || !reason.trim()) {
    return { valid: false, error: 'A valid justification reason is required for all status changes.' };
  }
  if (!canTransition(currentStatus, nextStatus)) {
    return {
      valid: false,
      error: `Transition from ${STATUS_LABELS[currentStatus]} to ${STATUS_LABELS[nextStatus]} is not permitted by workflow rules.`,
    };
  }
  return { valid: true };
}
