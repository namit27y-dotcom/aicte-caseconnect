/**
 * AICTE CaseConnect - Core Type Definitions
 * SIH 2026 - Problem Statement ID: SIH26264
 */

export type UserRole = 'COMPLAINANT' | 'BUREAU_OFFICER' | 'BUREAU_HEAD' | 'APEX_ADMIN';

export type BureauType = 
  | 'APPROVAL_BUREAU'
  | 'FINANCE_BUREAU'
  | 'GRIEVANCE_CELL'
  | 'POLICY_ACADEMIC'
  | 'LEGAL_CELL'
  | 'RAGGING_PREVENTION';

export type ComplaintStatus = 
  | 'SUBMITTED'
  | 'UNDER_PROCESS'
  | 'COORDINATION'
  | 'RESOLUTION_REVIEW'
  | 'CLOSED'
  | 'OVERDUE';

export type ComplaintPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplaintCategory = 
  | 'RAGGING'
  | 'FACULTY_NON_PAYMENT'
  | 'INFRASTRUCTURE'
  | 'ADMISSION_FRAUD'
  | 'CURRICULUM_ACCREDITATION'
  | 'FEE_EXTORTION'
  | 'OTHER';

export interface UserPersona {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  bureau?: BureauType;
  bureauName?: string;
  avatarInitials: string;
}

export interface Institution {
  id: string;
  aictePermanentId: string;
  name: string;
  state: string;
  district: string;
  category: string;
  totalComplaints: number;
  openComplaints: number;
  overdueCount: number;
  bureausInvolved: BureauType[];
  establishedYear: number;
}

export interface ComplaintEvent {
  id: string;
  complaintId: string;
  action: string;
  actor: string;
  actorRole: UserRole;
  timestamp: string;
  description: string;
  metadata?: Record<string, any>;
}

export interface OverlapEvidence {
  sameInstitution: boolean;
  institutionScore: number; // 0-100
  categoryMatch: boolean;
  categoryScore: number;
  temporalProximityDays: number;
  temporalScore: number;
  textSimilarityScore: number;
  matchedKeywords: string[];
  totalConfidence: number; // computed weighted score
  explanation: string;
}

export interface OverlapCandidate {
  id: string;
  primaryCaseId: string;
  targetCaseId: string;
  targetTrackingNumber: string;
  targetInstitution: string;
  similarityScore: number; // 0-100
  evidence: OverlapEvidence;
  reviewStatus: 'PENDING_REVIEW' | 'CONFIRMED_RELATED' | 'DISMISSED_INDEPENDENT';
  flaggedAt: string;
}

export interface Complaint {
  id: string;
  trackingNumber: string; // e.g. CC-2026-000123
  title: string;
  description: string;
  institutionId: string;
  institutionName: string;
  institutionState: string;
  category: ComplaintCategory;
  categoryLabel: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  bureau: BureauType;
  bureauName: string;
  assignedOfficerName: string;
  assignedOfficerId: string;
  complainantName: string;
  complainantType: 'STUDENT' | 'FACULTY' | 'PARENT' | 'ANONYMOUS' | 'CITIZEN';
  createdAt: string;
  targetDeadline: string;
  isOverdue: boolean;
  overlapCount: number;
  coordinationGroupId?: string;
  events: ComplaintEvent[];
}

export interface CoordinationGroup {
  id: string;
  groupNumber: string; // GRP-2026-001
  title: string;
  leadBureau: BureauType;
  leadBureauName: string;
  participatingBureaus: BureauType[];
  leadOfficer: string;
  institutionName: string;
  complaintIds: string[];
  complaintTrackingNumbers: string[];
  status: 'ACTIVE' | 'RESOLVED' | 'REVIEW';
  createdAt: string;
  summary: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  actorBureau?: string;
  actionType: 'STATUS_CHANGE' | 'BUREAU_TRANSFER' | 'OVERLAP_LINK' | 'NOTE_ADDED' | 'DEADLINE_OVERRIDE' | 'COORDINATION_INITIATED';
  entityType: 'COMPLAINT' | 'COORDINATION_GROUP' | 'DEADLINE_RULE';
  entityId: string;
  summary: string;
  details: {
    previousValue?: string;
    newValue?: string;
    reason?: string;
  };
}

export interface DeadlineRule {
  id: string;
  category: ComplaintCategory;
  categoryName: string;
  defaultDurationDays: number;
  warningThresholdDays: number;
  escalationTarget: string;
  appliesToBureau: BureauType | 'ALL';
  isActive: boolean;
}

export type NavigationTab = 
  | 'overview'
  | 'complaints'
  | 'institutions'
  | 'coordination'
  | 'deadlines'
  | 'analytics'
  | 'audit'
  | 'administration';
