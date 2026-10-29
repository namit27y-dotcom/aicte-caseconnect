/**
 * AICTE CaseConnect – Unit Tests: permissions.ts
 * Tests role-based access control rules.
 * PROTOTYPE NOTICE: These checks mirror server-side enforcement in a real deployment.
 */

import { describe, it, expect } from 'vitest';
import { can, isComplaintVisibleToPersona } from '../utils/permissions';
import type { UserPersona, Complaint } from '../types';

// ---------------------------------------------------------------------------
// Persona Fixtures
// ---------------------------------------------------------------------------

const complainant: UserPersona = {
  id: 'user-complainant',
  name: 'Riya Sharma',
  email: 'riya@test.com',
  role: 'COMPLAINANT',
  roleLabel: 'Complainant',
  bureau: undefined,
  bureauName: undefined,
  avatarInitials: 'RS',
  status: 'ACTIVE',
  lastActivity: '2026-10-01T00:00:00Z',
};

const officer: UserPersona = {
  id: 'user-officer',
  name: 'Aashish Kumar',
  email: 'aashish@aicte.in',
  role: 'BUREAU_OFFICER',
  roleLabel: 'Bureau Officer',
  bureau: 'APPROVAL_BUREAU',
  bureauName: 'Approval Bureau',
  avatarInitials: 'AK',
  status: 'ACTIVE',
  lastActivity: '2026-10-01T00:00:00Z',
};

const bureauHead: UserPersona = {
  id: 'user-head',
  name: 'Prof. S. Mehta',
  email: 'smehta@aicte.in',
  role: 'BUREAU_HEAD',
  roleLabel: 'Bureau Head',
  bureau: 'GRIEVANCE_CELL',
  bureauName: 'Grievance Cell',
  avatarInitials: 'SM',
  status: 'ACTIVE',
  lastActivity: '2026-10-01T00:00:00Z',
};

const apexAdmin: UserPersona = {
  id: 'user-admin',
  name: 'Prof. R. K. Verma',
  email: 'rkverma@aicte.in',
  role: 'APEX_ADMIN',
  roleLabel: 'Apex Administrator',
  bureau: undefined,
  bureauName: undefined,
  avatarInitials: 'RV',
  status: 'ACTIVE',
  lastActivity: '2026-10-01T00:00:00Z',
};

// ---------------------------------------------------------------------------
// Complaint Fixtures
// ---------------------------------------------------------------------------

const ownComplaint: Complaint = {
  id: 'comp-own',
  trackingNumber: 'CC-2026-000001',
  title: 'Riya Sharma complaint',
  description: 'Fee extortion',
  category: 'FEE_EXTORTION',
  categoryLabel: 'Fee Extortion',
  priority: 'HIGH',
  status: 'SUBMITTED',
  bureau: 'APPROVAL_BUREAU',
  bureauName: 'Approval Bureau',
  institutionId: 'inst-1',
  institutionName: 'ABC Institute',
  institutionState: 'Maharashtra',
  complainantName: 'Riya Sharma', // matches complainant persona name
  complainantType: 'STUDENT',
  assignedOfficerId: 'user-officer',
  assignedOfficerName: 'Aashish Kumar',
  targetDeadline: '2026-12-31T00:00:00Z',
  createdAt: '2026-10-01T09:00:00Z',
  resolvedAt: undefined,
  isOverdue: false,
  overlapCount: 0,
  events: [],
};

const otherComplaint: Complaint = {
  ...ownComplaint,
  id: 'comp-other',
  trackingNumber: 'CC-2026-000002',
  complainantName: 'Someone Else',
  assignedOfficerId: 'user-other',
  bureau: 'FINANCE_BUREAU',
  bureauName: 'Finance Bureau',
};

const overdueComplaint: Complaint = {
  ...ownComplaint,
  id: 'comp-overdue',
  trackingNumber: 'CC-2026-000003',
  bureau: 'GRIEVANCE_CELL',
  bureauName: 'Grievance Cell',
  isOverdue: true,
  status: 'OVERDUE',
  targetDeadline: '2026-09-01T00:00:00Z',
};

// ---------------------------------------------------------------------------
// isComplaintVisibleToPersona()
// ---------------------------------------------------------------------------

describe('isComplaintVisibleToPersona', () => {
  it('complainant can see their own complaints (name match)', () => {
    expect(isComplaintVisibleToPersona(ownComplaint, complainant)).toBe(true);
  });

  it('complainant can NOT see another person\'s complaint', () => {
    expect(isComplaintVisibleToPersona(otherComplaint, complainant)).toBe(false);
  });

  it('officer can see all complaints (system-wide access)', () => {
    expect(isComplaintVisibleToPersona(ownComplaint, officer)).toBe(true);
    expect(isComplaintVisibleToPersona(otherComplaint, officer)).toBe(true);
  });

  it('bureau head can see all complaints', () => {
    expect(isComplaintVisibleToPersona(ownComplaint, bureauHead)).toBe(true);
    expect(isComplaintVisibleToPersona(otherComplaint, bureauHead)).toBe(true);
  });

  it('apex admin can see all complaints', () => {
    expect(isComplaintVisibleToPersona(ownComplaint, apexAdmin)).toBe(true);
    expect(isComplaintVisibleToPersona(otherComplaint, apexAdmin)).toBe(true);
  });

  it('complainant can see complaints where they are the assigned officer', () => {
    const assignedComplaint = { ...otherComplaint, assignedOfficerId: complainant.id };
    expect(isComplaintVisibleToPersona(assignedComplaint, complainant)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// can() – CREATE_COMPLAINT
// ---------------------------------------------------------------------------

describe('can: CREATE_COMPLAINT', () => {
  [complainant, officer, bureauHead, apexAdmin].forEach((persona) => {
    it(`${persona.roleLabel} can create complaints`, () => {
      expect(can(persona, 'CREATE_COMPLAINT').allowed).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// can() – CHANGE_STATUS
// ---------------------------------------------------------------------------

describe('can: CHANGE_STATUS', () => {
  it('complainant CANNOT change status', () => {
    const result = can(complainant, 'CHANGE_STATUS', { complaint: ownComplaint });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  it('officer CAN change status for own bureau complaint', () => {
    // officer is in APPROVAL_BUREAU; ownComplaint is in APPROVAL_BUREAU
    const result = can(officer, 'CHANGE_STATUS', { complaint: ownComplaint });
    expect(result.allowed).toBe(true);
  });

  it('officer CANNOT change status for different bureau complaint', () => {
    // officer is in APPROVAL_BUREAU; otherComplaint is in FINANCE_BUREAU
    const result = can(officer, 'CHANGE_STATUS', { complaint: otherComplaint });
    expect(result.allowed).toBe(false);
    expect(result.reason).toBeTruthy();
  });

  it('bureau head CAN change status for their bureau complaint', () => {
    // bureauHead is in GRIEVANCE_CELL; overdueComplaint is in GRIEVANCE_CELL
    const result = can(bureauHead, 'CHANGE_STATUS', { complaint: overdueComplaint });
    expect(result.allowed).toBe(true);
  });

  it('bureau head CANNOT change status for a different bureau complaint', () => {
    // bureauHead is in GRIEVANCE_CELL; ownComplaint is in APPROVAL_BUREAU
    const result = can(bureauHead, 'CHANGE_STATUS', { complaint: ownComplaint });
    expect(result.allowed).toBe(false);
  });

  it('apex admin CAN change status for any bureau complaint', () => {
    expect(can(apexAdmin, 'CHANGE_STATUS', { complaint: ownComplaint }).allowed).toBe(true);
    expect(can(apexAdmin, 'CHANGE_STATUS', { complaint: otherComplaint }).allowed).toBe(true);
    expect(can(apexAdmin, 'CHANGE_STATUS', { complaint: overdueComplaint }).allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// can() – TRIGGER_ESCALATION
// ---------------------------------------------------------------------------

describe('can: TRIGGER_ESCALATION', () => {
  it('complainant CANNOT trigger escalation', () => {
    expect(can(complainant, 'TRIGGER_ESCALATION').allowed).toBe(false);
  });

  it('bureau officer CANNOT trigger escalation (policy: Bureau Head+ only)', () => {
    expect(can(officer, 'TRIGGER_ESCALATION').allowed).toBe(false);
  });

  it('bureau head CAN trigger escalation for own bureau overdue complaint', () => {
    // bureauHead is in GRIEVANCE_CELL; overdueComplaint is in GRIEVANCE_CELL and is overdue
    const result = can(bureauHead, 'TRIGGER_ESCALATION', {
      complaint: overdueComplaint,
      alreadyEscalated: false,
    });
    expect(result.allowed).toBe(true);
  });

  it('bureau head CANNOT trigger escalation for a different bureau\'s complaint', () => {
    const result = can(bureauHead, 'TRIGGER_ESCALATION', {
      complaint: ownComplaint, // APPROVAL_BUREAU, not GRIEVANCE_CELL
      alreadyEscalated: false,
    });
    expect(result.allowed).toBe(false);
  });

  it('bureau head CANNOT trigger escalation if already escalated', () => {
    const result = can(bureauHead, 'TRIGGER_ESCALATION', {
      complaint: overdueComplaint,
      alreadyEscalated: true,
    });
    expect(result.allowed).toBe(false);
  });

  it('bureau head CANNOT trigger escalation for a non-overdue complaint', () => {
    const nonOverdue = { ...overdueComplaint, isOverdue: false, status: 'UNDER_PROCESS' as const };
    const result = can(bureauHead, 'TRIGGER_ESCALATION', {
      complaint: nonOverdue,
      alreadyEscalated: false,
    });
    expect(result.allowed).toBe(false);
  });

  it('apex admin CAN trigger escalation for any complaint', () => {
    const result = can(apexAdmin, 'TRIGGER_ESCALATION', {
      complaint: overdueComplaint,
      alreadyEscalated: false,
    });
    expect(result.allowed).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// can() – REVIEW_OVERLAP
// ---------------------------------------------------------------------------

describe('can: REVIEW_OVERLAP', () => {
  it('complainant CANNOT review overlaps', () => {
    expect(can(complainant, 'REVIEW_OVERLAP').allowed).toBe(false);
  });

  [officer, bureauHead, apexAdmin].forEach((persona) => {
    it(`${persona.roleLabel} CAN review overlaps`, () => {
      expect(can(persona, 'REVIEW_OVERLAP').allowed).toBe(true);
    });
  });
});

// ---------------------------------------------------------------------------
// can() – VIEW_ADMIN / MANAGE_USERS / MANAGE_RULES
// ---------------------------------------------------------------------------

describe('can: VIEW_ADMIN / MANAGE_USERS / MANAGE_RULES', () => {
  const adminActions = ['VIEW_ADMIN', 'MANAGE_USERS', 'MANAGE_RULES'] as const;

  adminActions.forEach((action) => {
    it(`complainant CANNOT perform ${action}`, () => {
      expect(can(complainant, action).allowed).toBe(false);
    });

    it(`bureau officer CANNOT perform ${action}`, () => {
      expect(can(officer, action).allowed).toBe(false);
    });

    it(`bureau head CAN perform ${action}`, () => {
      expect(can(bureauHead, action).allowed).toBe(true);
    });

    it(`apex admin CAN perform ${action}`, () => {
      expect(can(apexAdmin, action).allowed).toBe(true);
    });
  });
});
