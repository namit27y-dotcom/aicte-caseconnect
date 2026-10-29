/**
 * AICTE CaseConnect - Synthetic Demo Data Store
 * SIH 2026 - Problem Statement ID: SIH26264
 * 
 * DISCLAIMER: All records, names, institution identifiers, tracking codes, and dates
 * are synthetic fixtures generated strictly for demonstration and technical validation.
 */

import { 
  UserPersona, 
  Complaint, 
  Institution, 
  CoordinationGroup, 
  AuditLogItem, 
  DeadlineRule,
  OverlapCandidate 
} from '../types';

export const SYNTHETIC_PERSONAS: UserPersona[] = [
  {
    id: 'user-officer-1',
    name: 'Aashish Kumar',
    email: 'aashish.kumar@aicte-india.org',
    role: 'BUREAU_OFFICER',
    roleLabel: 'Bureau Officer',
    bureau: 'APPROVAL_BUREAU',
    bureauName: 'Approval Bureau',
    avatarInitials: 'AK'
  },
  {
    id: 'user-head-1',
    name: 'Dr. Sunita Sharma',
    email: 'sunita.sharma@aicte-india.org',
    role: 'BUREAU_HEAD',
    roleLabel: 'Bureau Head',
    bureau: 'GRIEVANCE_CELL',
    bureauName: 'Public Grievance Cell',
    avatarInitials: 'SS'
  },
  {
    id: 'user-admin-1',
    name: 'Prof. R. K. Verma',
    email: 'rk.verma.hq@aicte-india.org',
    role: 'APEX_ADMIN',
    roleLabel: 'Apex Admin',
    bureauName: 'AICTE Headquarters (Apex Authority)',
    avatarInitials: 'RV'
  },
  {
    id: 'user-complainant-1',
    name: 'Pooja Mehta',
    email: 'pooja.mehta.std@gmail.com',
    role: 'COMPLAINANT',
    roleLabel: 'Complainant (Student / Citizen)',
    avatarInitials: 'PM'
  }
];

export const SYNTHETIC_INSTITUTIONS: Institution[] = [
  {
    id: 'inst-1',
    aictePermanentId: '1-429910481',
    name: 'Apex Institute of Engineering & Technology',
    state: 'Uttar Pradesh',
    district: 'Kanpur Nagar',
    category: 'Engineering & Technology',
    totalComplaints: 8,
    openComplaints: 5,
    overdueCount: 2,
    bureausInvolved: ['APPROVAL_BUREAU', 'FINANCE_BUREAU', 'GRIEVANCE_CELL'],
    establishedYear: 2008
  },
  {
    id: 'inst-2',
    aictePermanentId: '1-938201948',
    name: 'National Technical Academy of Pune',
    state: 'Maharashtra',
    district: 'Pune',
    category: 'Management & Technology',
    totalComplaints: 6,
    openComplaints: 3,
    overdueCount: 1,
    bureausInvolved: ['FINANCE_BUREAU', 'POLICY_ACADEMIC'],
    establishedYear: 2012
  },
  {
    id: 'inst-3',
    aictePermanentId: '1-552910394',
    name: 'Southern Valley College of Pharmacy & Biotech',
    state: 'Karnataka',
    district: 'Bengaluru Urban',
    category: 'Pharmacy',
    totalComplaints: 4,
    openComplaints: 2,
    overdueCount: 0,
    bureausInvolved: ['APPROVAL_BUREAU', 'GRIEVANCE_CELL'],
    establishedYear: 2015
  },
  {
    id: 'inst-4',
    aictePermanentId: '1-771920485',
    name: 'Vidya Bharti Institute of Management & Science',
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    category: 'Management (MBA/MCA)',
    totalComplaints: 5,
    openComplaints: 4,
    overdueCount: 2,
    bureausInvolved: ['APPROVAL_BUREAU', 'FINANCE_BUREAU'],
    establishedYear: 2010
  },
  {
    id: 'inst-5',
    aictePermanentId: '1-638291049',
    name: 'Royal Polytechnic Institute of Chennai',
    state: 'Tamil Nadu',
    district: 'Chennai',
    category: 'Polytechnic Diploma',
    totalComplaints: 3,
    openComplaints: 1,
    overdueCount: 0,
    bureausInvolved: ['GRIEVANCE_CELL', 'POLICY_ACADEMIC'],
    establishedYear: 2004
  },
  {
    id: 'inst-6',
    aictePermanentId: '1-849201847',
    name: 'Greenfield Himalayan University Technical Faculty',
    state: 'Uttarakhand',
    district: 'Dehradun',
    category: 'Architecture & Planning',
    totalComplaints: 2,
    openComplaints: 1,
    overdueCount: 0,
    bureausInvolved: ['APPROVAL_BUREAU'],
    establishedYear: 2018
  }
];

export const SYNTHETIC_COMPLAINTS: Complaint[] = [
  {
    id: 'comp-101',
    trackingNumber: 'CC-2026-000123',
    title: 'Capitation fee extortion and unapproved 60-seat expansion in Computer Science',
    description: 'Institution management is demanding unreceipted donation for B.Tech admission and operating an unapproved shift.',
    institutionId: 'inst-1',
    institutionName: 'Western Tech Institute',
    institutionState: 'Maharashtra',
    category: 'ADMISSION_FRAUD',
    categoryLabel: 'Approval',
    status: 'UNDER_PROCESS',
    priority: 'HIGH',
    bureau: 'APPROVAL_BUREAU',
    bureauName: 'Approval',
    assignedOfficerName: 'Aashish Kumar',
    assignedOfficerId: 'user-officer-1',
    complainantName: 'Pooja Mehta',
    complainantType: 'STUDENT',
    createdAt: '2026-10-28T10:30:00Z',
    targetDeadline: '2026-11-28T18:00:00Z',
    isOverdue: false,
    overlapCount: 2,
    coordinationGroupId: 'grp-01',
    events: [
      {
        id: 'ev-1',
        complaintId: 'comp-101',
        action: 'SUBMISSION_RECEIVED',
        actor: 'Pooja Mehta',
        actorRole: 'COMPLAINANT',
        timestamp: '2026-10-28T10:30:00Z',
        description: 'Complaint registered via Centralized AICTE Portal.'
      }
    ]
  },
  {
    id: 'comp-102',
    trackingNumber: 'CC-2026-000087',
    title: 'Severe Ragging incident and deficient hostel security protocols',
    description: 'First year students subjected to intimidation; anti-ragging committee failed to act promptly.',
    institutionId: 'inst-2',
    institutionName: 'Sunrise Engineering College',
    institutionState: 'Gujarat',
    category: 'INFRASTRUCTURE',
    categoryLabel: 'Infrastructure',
    status: 'SUBMITTED', // Under Triage
    priority: 'CRITICAL',
    bureau: 'GRIEVANCE_CELL',
    bureauName: 'Grievance',
    assignedOfficerName: 'Dr. Sunita Sharma',
    assignedOfficerId: 'user-head-1',
    complainantName: 'Confidential Whistleblower',
    complainantType: 'ANONYMOUS',
    createdAt: '2026-10-27T08:00:00Z',
    targetDeadline: '2026-11-03T18:00:00Z',
    isOverdue: false,
    overlapCount: 0,
    events: [
      {
        id: 'ev-201',
        complaintId: 'comp-102',
        action: 'TRIAGE_LOGGED',
        actor: 'System Router',
        actorRole: 'BUREAU_OFFICER',
        timestamp: '2026-10-27T08:00:00Z',
        description: 'Case logged and routed to Grievance cell for triage.'
      }
    ]
  },
  {
    id: 'comp-103',
    trackingNumber: 'CC-2026-000151',
    title: 'Illegal retention of tuition fees after AICTE counseling seat surrender',
    description: 'Account office refusing fee refund despite student withdrawing within the mandatory AICTE timeframe.',
    institutionId: 'inst-3',
    institutionName: 'Global Institute of Tech',
    institutionState: 'Karnataka',
    category: 'FEE_EXTORTION',
    categoryLabel: 'Fee-related',
    status: 'UNDER_PROCESS', // Assigned
    priority: 'HIGH',
    bureau: 'FINANCE_BUREAU',
    bureauName: 'Finance',
    assignedOfficerName: 'Ritu Sachdeva',
    assignedOfficerId: 'user-officer-fin',
    complainantName: 'Deepak Saxena',
    complainantType: 'PARENT',
    createdAt: '2026-10-26T11:15:00Z',
    targetDeadline: '2026-11-25T18:00:00Z',
    isOverdue: false,
    overlapCount: 1,
    events: [
      {
        id: 'ev-301',
        complaintId: 'comp-103',
        action: 'OFFICER_ASSIGNED',
        actor: 'Finance Bureau Head',
        actorRole: 'BUREAU_HEAD',
        timestamp: '2026-10-26T11:15:00Z',
        description: 'Assigned to Finance officer for scrutiny.'
      }
    ]
  },
  {
    id: 'comp-104',
    trackingNumber: 'CC-2026-000098',
    title: 'Non-payment of faculty DA arrears and withholding provident fund deductions',
    description: '35 faculty members have not been paid statutory arrears for over 6 months.',
    institutionId: 'inst-4',
    institutionName: 'National Polytechnic',
    institutionState: 'Delhi NCR',
    category: 'FACULTY_NON_PAYMENT',
    categoryLabel: 'Faculty',
    status: 'OVERDUE',
    priority: 'CRITICAL',
    bureau: 'POLICY_ACADEMIC',
    bureauName: 'Policy & Academic',
    assignedOfficerName: 'Vikramaditya Rao',
    assignedOfficerId: 'user-officer-pol',
    complainantName: 'Dr. H. C. Joshi',
    complainantType: 'FACULTY',
    createdAt: '2026-10-25T14:20:00Z',
    targetDeadline: '2026-10-27T18:00:00Z',
    isOverdue: true,
    overlapCount: 1,
    events: [
      {
        id: 'ev-401',
        complaintId: 'comp-104',
        action: 'SLA_BREACH',
        actor: 'SLA Engine',
        actorRole: 'APEX_ADMIN',
        timestamp: '2026-10-27T18:00:00Z',
        description: 'Statutory deadline passed without resolution. Escalated to overdue.'
      }
    ]
  },
  {
    id: 'comp-105',
    trackingNumber: 'CC-2026-000076',
    title: 'Irregularities in semester examination evaluation and answer sheet leakage',
    description: 'Complaints raised regarding unauthorized re-evaluation fees and grading discrepancies.',
    institutionId: 'inst-5',
    institutionName: 'Eastern College of Engineering',
    institutionState: 'West Bengal',
    category: 'CURRICULUM_ACCREDITATION',
    categoryLabel: 'Exam',
    status: 'UNDER_PROCESS',
    priority: 'MEDIUM',
    bureau: 'POLICY_ACADEMIC',
    bureauName: 'Academic',
    assignedOfficerName: 'S. Ramanathan',
    assignedOfficerId: 'user-officer-pol2',
    complainantName: 'M. Anand',
    complainantType: 'STUDENT',
    createdAt: '2026-10-24T09:30:00Z',
    targetDeadline: '2026-11-23T18:00:00Z',
    isOverdue: false,
    overlapCount: 0,
    events: [
      {
        id: 'ev-501',
        complaintId: 'comp-105',
        action: 'INQUIRY_ORDERED',
        actor: 'Academic Cell',
        actorRole: 'BUREAU_OFFICER',
        timestamp: '2026-10-24T09:30:00Z',
        description: 'Notice served to Controller of Examinations.'
      }
    ]
  },
  {
    id: 'comp-106',
    trackingNumber: 'CC-2026-000129',
    title: 'Cash capitation charges demanded for hostel room confirmation',
    description: 'Off-the-record cash collection without official receipt.',
    institutionId: 'inst-1',
    institutionName: 'Western Tech Institute',
    institutionState: 'Maharashtra',
    category: 'FEE_EXTORTION',
    categoryLabel: 'Fee-related',
    status: 'COORDINATION',
    priority: 'HIGH',
    bureau: 'FINANCE_BUREAU',
    bureauName: 'Finance',
    assignedOfficerName: 'Ritu Sachdeva',
    assignedOfficerId: 'user-officer-fin',
    complainantName: 'Karthik N.',
    complainantType: 'PARENT',
    createdAt: '2026-10-20T11:15:00Z',
    targetDeadline: '2026-11-20T18:00:00Z',
    isOverdue: false,
    overlapCount: 2,
    coordinationGroupId: 'grp-01',
    events: []
  },
  {
    id: 'comp-107',
    trackingNumber: 'CC-2026-000072',
    title: 'Withholding original 10th and 12th marksheet certificates upon course withdrawal',
    description: 'Institute refuses to release certificates unless 4-year tuition fee is paid in full.',
    institutionId: 'inst-5',
    institutionName: 'Eastern College of Engineering',
    institutionState: 'West Bengal',
    category: 'ADMISSION_FRAUD',
    categoryLabel: 'Admission',
    status: 'CLOSED',
    priority: 'HIGH',
    bureau: 'POLICY_ACADEMIC',
    bureauName: 'Academic',
    assignedOfficerName: 'S. Ramanathan',
    assignedOfficerId: 'user-officer-pol',
    complainantName: 'Anil Roy',
    complainantType: 'STUDENT',
    createdAt: '2026-09-28T10:00:00Z',
    targetDeadline: '2026-10-28T18:00:00Z',
    isOverdue: false,
    overlapCount: 0,
    events: []
  }
];

export const SYNTHETIC_OVERLAPS: OverlapCandidate[] = [
  {
    id: 'ovlp-1',
    primaryCaseId: 'comp-101',
    targetCaseId: 'comp-106',
    targetTrackingNumber: 'CC-2026-000129',
    targetInstitution: 'Western Tech Institute',
    similarityScore: 88,
    evidence: {
      sameInstitution: true,
      institutionScore: 100,
      categoryMatch: false,
      categoryScore: 75,
      temporalProximityDays: 2,
      temporalScore: 95,
      textSimilarityScore: 82,
      matchedKeywords: ['Western Tech', 'capitation donation', 'cash payment without receipt', 'hostel extortion'],
      totalConfidence: 88,
      explanation: 'Both complaints target Western Tech Institute within a 48-hour window. Both cite non-receipted cash demands and illegal institutional fees.'
    },
    reviewStatus: 'CONFIRMED_RELATED',
    flaggedAt: '2026-10-20T12:00:00Z'
  }
];

export const SYNTHETIC_COORDINATION_GROUPS: CoordinationGroup[] = [
  {
    id: 'grp-01',
    groupNumber: 'GRP-2026-001',
    title: 'Joint Regulatory & Financial Inquiry into Western Tech Admissions',
    leadBureau: 'APPROVAL_BUREAU',
    leadBureauName: 'Approval Bureau',
    participatingBureaus: ['APPROVAL_BUREAU', 'FINANCE_BUREAU'],
    leadOfficer: 'Aashish Kumar (Approval Bureau)',
    institutionName: 'Western Tech Institute',
    complaintIds: ['comp-101', 'comp-106'],
    complaintTrackingNumbers: ['CC-2026-000123', 'CC-2026-000129'],
    status: 'ACTIVE',
    createdAt: '2026-10-21T09:00:00Z',
    summary: 'Cross-bureau inquiry authorized to inspect intake sanction compliance and hostel fee financial books simultaneously.'
  }
];

export const SYNTHETIC_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'audit-101',
    timestamp: '2026-10-28T14:15:20Z',
    actorName: 'Aashish Kumar',
    actorRole: 'BUREAU_OFFICER',
    actorBureau: 'Approval Bureau',
    actionType: 'STATUS_CHANGE',
    entityType: 'COMPLAINT',
    entityId: 'CC-2026-000123',
    summary: 'Complaint status transitioned to UNDER_PROCESS',
    details: {
      previousValue: 'SUBMITTED',
      newValue: 'UNDER_PROCESS',
      reason: 'Assigned to bureau scrutiny officer.'
    }
  },
  {
    id: 'audit-102',
    timestamp: '2026-10-27T18:00:00Z',
    actorName: 'System (SLA Engine)',
    actorRole: 'APEX_ADMIN',
    actionType: 'DEADLINE_OVERRIDE',
    entityType: 'COMPLAINT',
    entityId: 'CC-2026-000098',
    summary: 'Overdue flag escalated to Red Alert',
    details: {
      previousValue: 'Approaching Warning',
      newValue: 'Overdue (SLA Exceeded)',
      reason: 'Statutory deadline exceeded without bureau resolution.'
    }
  }
];

export const SYNTHETIC_DEADLINE_RULES: DeadlineRule[] = [
  {
    id: 'rule-ragging',
    category: 'RAGGING',
    categoryName: 'Ragging & Harassment',
    defaultDurationDays: 7,
    warningThresholdDays: 2,
    escalationTarget: 'Bureau Head & AICTE Chairman Task Force',
    appliesToBureau: 'GRIEVANCE_CELL',
    isActive: true
  },
  {
    id: 'rule-admission',
    category: 'ADMISSION_FRAUD',
    categoryName: 'Admission Fraud / Capitation Fee',
    defaultDurationDays: 15,
    warningThresholdDays: 3,
    escalationTarget: 'Approval Bureau Head',
    appliesToBureau: 'APPROVAL_BUREAU',
    isActive: true
  },
  {
    id: 'rule-salary',
    category: 'FACULTY_NON_PAYMENT',
    categoryName: 'Faculty Salary & Arrears Dues',
    defaultDurationDays: 30,
    warningThresholdDays: 5,
    escalationTarget: 'Finance Bureau Joint Director',
    appliesToBureau: 'FINANCE_BUREAU',
    isActive: true
  },
  {
    id: 'rule-infra',
    category: 'INFRASTRUCTURE',
    categoryName: 'Deficient Lab / Physical Infrastructure',
    defaultDurationDays: 45,
    warningThresholdDays: 7,
    escalationTarget: 'Regional Office Scrutiny Committee',
    appliesToBureau: 'APPROVAL_BUREAU',
    isActive: true
  },
  {
    id: 'rule-curriculum',
    category: 'CURRICULUM_ACCREDITATION',
    categoryName: 'Curriculum & Faculty Credentialing',
    defaultDurationDays: 30,
    warningThresholdDays: 5,
    escalationTarget: 'Policy & Academic Bureau Chief',
    appliesToBureau: 'POLICY_ACADEMIC',
    isActive: true
  }
];

export const SYNTHETIC_DASHBOARD_METRICS = {
  totalComplaints: 100,
  totalTrend: '+5% vs last month',
  openComplaints: 68,
  openTrend: '+3%',
  overdueComplaints: 12,
  overdueTrend: '+2%',
  disposedComplaints: 32,
  disposedTrend: '+8%',
  statusBreakdown: [
    { label: 'Submitted', count: 28, percentage: 28, color: '#3B82F6' },
    { label: 'Under Process', count: 26, percentage: 26, color: '#0EA5E9' },
    { label: 'Coordination', count: 12, percentage: 12, color: '#8B5CF6' },
    { label: 'Resolution Review', count: 8, percentage: 8, color: '#F59E0B' },
    { label: 'Closed', count: 14, percentage: 14, color: '#10B981' },
    { label: 'Overdue', count: 12, percentage: 12, color: '#EF4444' }
  ],
  categoryBreakdown: [
    { label: 'Approval & Affiliation', percentage: 22 },
    { label: 'Infrastructure', percentage: 18 },
    { label: 'Fee-related', percentage: 15 },
    { label: 'Faculty & Staff', percentage: 12 },
    { label: 'Examination', percentage: 10 },
    { label: 'Other', percentage: 23 }
  ],
  bureauWorkload: [
    { 
      bureau: 'Approval Bureau', 
      activeCount: 22, 
      maxCapacity: 30, 
      percentage: 73, 
      handoffNotice: '3 cross-bureau handoffs pending review' 
    },
    { 
      bureau: 'Finance Bureau', 
      activeCount: 18, 
      maxCapacity: 25, 
      percentage: 72, 
      handoffNotice: '2 cross-bureau handoffs pending review' 
    },
    { 
      bureau: 'Grievance Cell', 
      activeCount: 15, 
      maxCapacity: 20, 
      percentage: 75 
    },
    { 
      bureau: 'Policy & Academic', 
      activeCount: 15, 
      maxCapacity: 20, 
      percentage: 75 
    },
    { 
      bureau: 'Legal & Vigilance Cell', 
      activeCount: 8, 
      maxCapacity: 15, 
      percentage: 53 
    }
  ]
};
