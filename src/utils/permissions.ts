/**
 * AICTE CaseConnect - Centralized Permissions & Role Governance
 * SIH 2026 - Problem Statement ID: SIH26264
 *
 * PROTOTYPE NOTICE:
 * This is an in-memory client-side demonstration prototype. In a production
 * AICTE deployment, these authorization checks are strictly enforced server-side
 * via secure JWT tokens, API gateways, and database row-level security (RLS).
 */

import { UserPersona, Complaint, UserRole, BureauType } from '../types';

export type AppAction =
  | 'VIEW_COMPLAINT'
  | 'CHANGE_STATUS'
  | 'TRIGGER_ESCALATION'
  | 'REVIEW_OVERLAP'
  | 'VIEW_ADMIN'
  | 'MANAGE_USERS'
  | 'MANAGE_RULES'
  | 'CREATE_COMPLAINT';

export interface PermissionContext {
  complaint?: Complaint;
  targetBureau?: BureauType;
  alreadyEscalated?: boolean;
}

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

/**
 * Filter complaints visible to the given persona based on role scoping.
 * Complainant only sees their own complaints.
 * Officers, Bureau Heads, and Apex Admins see system-wide complaints for holistic triage.
 */
export function isComplaintVisibleToPersona(complaint: Complaint, persona: UserPersona): boolean {
  if (persona.role === 'COMPLAINANT') {
    return (
      complaint.complainantName.trim().toLowerCase() === persona.name.trim().toLowerCase() ||
      complaint.assignedOfficerId === persona.id
    );
  }
  return true;
}

/**
 * Single source of truth for authorization across the platform.
 * Returns { allowed: boolean, reason?: string }
 */
export function can(
  persona: UserPersona,
  action: AppAction,
  context?: PermissionContext
): PermissionResult {
  const role: UserRole = persona.role;

  switch (action) {
    case 'VIEW_COMPLAINT': {
      if (role === 'COMPLAINANT') {
        if (!context?.complaint) return { allowed: true };
        const isOwner = isComplaintVisibleToPersona(context.complaint, persona);
        return isOwner
          ? { allowed: true }
          : {
              allowed: false,
              reason: 'Complainants are restricted to viewing only their own submitted grievances.',
            };
      }
      return { allowed: true };
    }

    case 'CREATE_COMPLAINT': {
      return { allowed: true };
    }

    case 'CHANGE_STATUS': {
      if (role === 'COMPLAINANT') {
        return {
          allowed: false,
          reason: 'Complainants cannot modify grievance investigation workflow status.',
        };
      }

      if (role === 'APEX_ADMIN') {
        return { allowed: true };
      }

      // BUREAU_OFFICER & BUREAU_HEAD may only modify complaints assigned to their bureau
      if (!context?.complaint) {
        return { allowed: true };
      }

      if (context.complaint.bureau !== persona.bureau) {
        const userBureauName = persona.bureauName || persona.bureau || 'your designated bureau';
        return {
          allowed: false,
          reason: `Departmental restriction: You may only modify cases within ${userBureauName}.`,
        };
      }

      return { allowed: true };
    }

    case 'TRIGGER_ESCALATION': {
      if (role === 'COMPLAINANT') {
        return {
          allowed: false,
          reason: 'Complainants cannot dispatch official statutory escalation notices.',
        };
      }

      if (role === 'BUREAU_OFFICER') {
        return {
          allowed: false,
          reason: 'Only Bureau Heads and Apex Admins hold authority to dispatch formal SLA breach notices.',
        };
      }

      if (context?.complaint) {
        // Bureau head can only escalate their bureau
        if (role === 'BUREAU_HEAD' && context.complaint.bureau !== persona.bureau) {
          return {
            allowed: false,
            reason: 'Bureau Heads may only issue escalation notices for their own bureau cases.',
          };
        }

        // Must be overdue
        if (!context.complaint.isOverdue && context.complaint.status !== 'OVERDUE') {
          return {
            allowed: false,
            reason: 'Escalation notices can only be dispatched for grievances exceeding their statutory deadline.',
          };
        }

        // Already escalated check
        if (context.alreadyEscalated) {
          return {
            allowed: false,
            reason: 'A formal escalation notice has already been dispatched for this grievance.',
          };
        }
      }

      return { allowed: true };
    }

    case 'REVIEW_OVERLAP': {
      if (role === 'COMPLAINANT') {
        return {
          allowed: false,
          reason: 'Cross-bureau coordination and duplicate detection is restricted to AICTE officers.',
        };
      }
      return { allowed: true };
    }

    case 'VIEW_ADMIN':
    case 'MANAGE_USERS':
    case 'MANAGE_RULES': {
      if (role === 'COMPLAINANT' || role === 'BUREAU_OFFICER') {
        return {
          allowed: false,
          reason: 'System administration and SLA policy configuration require Bureau Head or Apex Admin privileges.',
        };
      }
      return { allowed: true };
    }

    default:
      return { allowed: false, reason: 'Action not recognized.' };
  }
}
