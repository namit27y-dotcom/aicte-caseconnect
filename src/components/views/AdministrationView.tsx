import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  Settings, 
  Users, 
  Clock, 
  AlertTriangle, 
  Building, 
  Save, 
  Plus, 
  Edit2, 
  Trash2, 
  RotateCcw, 
  Search, 
  Filter, 
  UserCheck, 
  UserX, 
  Info,
  Shield,
  HelpCircle,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { can } from '../../utils/permissions';
import { 
  UserPersona, 
  DeadlineRule, 
  UserRole, 
  BureauType, 
  ComplaintCategory, 
  ComplaintPriority,
  AuditLogItem 
} from '../../types';
import { SYNTHETIC_DEADLINE_RULES, SYNTHETIC_PERSONAS } from '../../data/syntheticData';

interface AdministrationViewProps {
  currentPersona: UserPersona;
  deadlineRules: DeadlineRule[];
  onUpdateDeadlineRules: (rules: DeadlineRule[]) => void;
  users: UserPersona[];
  onUpdateUsers: (users: UserPersona[]) => void;
  onRecordAudit: (auditItem: AuditLogItem) => void;
}

export const AdministrationView: React.FC<AdministrationViewProps> = ({
  currentPersona,
  deadlineRules,
  onUpdateDeadlineRules,
  users,
  onUpdateUsers,
  onRecordAudit,
}) => {
  // Navigation sub-tabs within Administration
  const [activeAdminTab, setActiveAdminTab] = useState<'USER_MANAGEMENT' | 'RBAC' | 'SLA_RULES'>('USER_MANAGEMENT');
  const [permissionsExpanded, setPermissionsExpanded] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<DeadlineRule | null>(null);
  const [showResetRulesConfirm, setShowResetRulesConfirm] = useState(false);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // SLA Rule Editor / Modal State
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<DeadlineRule | null>(null);
  const [ruleFormName, setRuleFormName] = useState('');
  const [ruleFormCategory, setRuleFormCategory] = useState<ComplaintCategory>('ADMISSION_FRAUD');
  const [ruleFormBureau, setRuleFormBureau] = useState<BureauType | 'ALL'>('APPROVAL_BUREAU');
  const [ruleFormPriority, setRuleFormPriority] = useState<ComplaintPriority>('HIGH');
  const [ruleFormDuration, setRuleFormDuration] = useState<number>(30);
  const [ruleFormWarning, setRuleFormWarning] = useState<number>(5);
  const [ruleFormTarget, setRuleFormTarget] = useState('');
  const [ruleFormError, setRuleFormError] = useState('');

  // User Management State
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState<string>('ALL');

  // Change Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserPersona | null>(null);
  const [newSelectedRole, setNewSelectedRole] = useState<UserRole>('BUREAU_OFFICER');

  // Change Status Modal State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newSelectedStatus, setNewSelectedStatus] = useState<'ACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION'>('ACTIVE');

  // Add User Modal State
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('BUREAU_OFFICER');
  const [newUserBureau, setNewUserBureau] = useState<BureauType>('APPROVAL_BUREAU');

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // RBAC Permission checks
  const isComplainant = currentPersona.role === 'COMPLAINANT';
  const isOfficer = currentPersona.role === 'BUREAU_OFFICER';
  const isBureauHead = currentPersona.role === 'BUREAU_HEAD';
  const isApexAdmin = currentPersona.role === 'APEX_ADMIN';

  // Guard: Complainant and Bureau Officers cannot access Administration
  if (isComplainant || isOfficer) {
    const adminAccess = can(currentPersona, 'VIEW_ADMIN');
    return (
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
              System Administration &amp; Governance
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Restricted institutional settings and governance policies
            </p>
          </div>
        </div>
        <div className="p-8 bg-white border border-[#FECACA] rounded-xl text-center max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-[#FEF2F2] flex items-center justify-center text-[#DC2626] mx-auto mb-3">
            <Lock size={22} />
          </div>
          <h3 className="text-base font-bold text-[#1F2421]">Administrative Access Restricted</h3>
          <p className="text-xs text-[#5C6460] mt-1.5 leading-relaxed">
            {adminAccess.reason || 'System administration requires Bureau Head or Apex Admin privileges.'}
          </p>
          <span className="text-[11px] text-[#718096] block mt-3 font-mono">
            Current Persona: {currentPersona.name} ({currentPersona.roleLabel})
          </span>
          <p className="text-[11px] text-[#718096] mt-2">
            Tip: Switch your demo persona to <strong>Prof. R. K. Verma (Apex Admin)</strong> using the role switcher in the sidebar.
          </p>
        </div>
      </div>
    );
  }

  // PRD Section 3 Permissions Matrix Definition (13 Capabilities)
  const permissionsMatrix = [
    {
      id: 'p-1',
      capability: 'View complaints',
      description: 'Search, filter, and inspect case registers',
      complainant: 'Own cases only',
      officer: 'Bureau cases only',
      head: 'Bureau cases only',
      admin: 'Global (All bureaus)',
    },
    {
      id: 'p-2',
      capability: 'Submit complaints',
      description: 'Log new grievances into ingestion queue',
      complainant: true,
      officer: true,
      head: true,
      admin: true,
    },
    {
      id: 'p-3',
      capability: 'Edit complaint details',
      description: 'Modify grievance particulars and factual statement',
      complainant: 'Draft only',
      officer: false,
      head: 'Approval required',
      admin: true,
    },
    {
      id: 'p-4',
      capability: 'Assign complaints',
      description: 'Allocate cases to scrutiny officers',
      complainant: false,
      officer: false,
      head: 'Within Bureau',
      admin: 'Global',
    },
    {
      id: 'p-5',
      capability: 'Transfer between bureaus',
      description: 'Handoff multi-disciplinary complaints',
      complainant: false,
      officer: 'Request handoff',
      head: 'Approve & Request',
      admin: 'Direct transfer',
    },
    {
      id: 'p-6',
      capability: 'Change complaint status',
      description: 'Transition cases across workflow stages',
      complainant: false,
      officer: 'Assigned cases',
      head: 'Bureau cases',
      admin: 'Global (All cases)',
    },
    {
      id: 'p-7',
      capability: 'Review potential overlaps',
      description: 'Inspect multi-factor computed evidence scores',
      complainant: false,
      officer: true,
      head: true,
      admin: true,
    },
    {
      id: 'p-8',
      capability: 'Confirm / dismiss related-case suggestions',
      description: 'Adjudicate overlap candidates and link joint inquiries',
      complainant: false,
      officer: 'Bureau cases',
      head: true,
      admin: true,
    },
    {
      id: 'p-9',
      capability: 'View audit history',
      description: 'Inspect immutable append-only state mutation log',
      complainant: 'Own cases only',
      officer: 'Assigned cases',
      head: 'Bureau audit',
      admin: 'Global audit',
    },
    {
      id: 'p-10',
      capability: 'Export reports & analytics',
      description: 'Generate timestamped CSV records & audit extracts',
      complainant: false,
      officer: 'Scoped CSV',
      head: 'Bureau CSV',
      admin: 'Global CSV & raw',
    },
    {
      id: 'p-11',
      capability: 'Configure SLA rules',
      description: 'Adjust default resolution duration and alert thresholds',
      complainant: false,
      officer: false,
      head: 'Optional recommendation',
      admin: true,
    },
    {
      id: 'p-12',
      capability: 'Manage user roles',
      description: 'Provision staff accounts and modify role assignments',
      complainant: false,
      officer: false,
      head: 'Bureau personnel',
      admin: true,
    },
    {
      id: 'p-13',
      capability: 'Access administration settings',
      description: 'Configure institutional parameters & governance policies',
      complainant: false,
      officer: false,
      head: 'Read-only view',
      admin: true,
    },
  ];

  // Helper to render permission values
  const renderPermissionBadge = (val: boolean | string, isApex = false) => {
    if (typeof val === 'boolean') {
      return val ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#155836] bg-[#EAF5EE] border border-[#D1E7D9] px-2 py-0.5 rounded-full">
          <Check size={12} strokeWidth={2.5} /> Allowed
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
          <X size={12} strokeWidth={2} /> Not Allowed
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${
        isApex 
          ? 'bg-[#EAF5EE] text-[#155836] border-[#D1E7D9] font-semibold' 
          : 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
      }`}>
        {val}
      </span>
    );
  };

  // --- SLA RULE HANDLERS ---
  const handleOpenAddRule = () => {
    setEditingRule(null);
    setRuleFormName('');
    setRuleFormCategory('ADMISSION_FRAUD');
    setRuleFormBureau('APPROVAL_BUREAU');
    setRuleFormPriority('HIGH');
    setRuleFormDuration(30);
    setRuleFormWarning(5);
    setRuleFormTarget('Approval Bureau Head');
    setRuleFormError('');
    setIsRuleModalOpen(true);
  };

  const handleOpenEditRule = (rule: DeadlineRule) => {
    setEditingRule(rule);
    setRuleFormName(rule.name);
    setRuleFormCategory(rule.category);
    setRuleFormBureau(rule.appliesToBureau);
    setRuleFormPriority(rule.priority || 'HIGH');
    setRuleFormDuration(rule.defaultDurationDays);
    setRuleFormWarning(rule.warningThresholdDays);
    setRuleFormTarget(rule.escalationTarget);
    setRuleFormError('');
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = () => {
    if (!ruleFormName.trim()) {
      setRuleFormError('Rule name is required.');
      return;
    }
    if (ruleFormDuration <= 0) {
      setRuleFormError('Target resolution duration must be greater than 0 days.');
      return;
    }
    if (ruleFormWarning >= ruleFormDuration) {
      setRuleFormError('Warning threshold must be strictly less than the resolution duration.');
      return;
    }
    if (!ruleFormTarget.trim()) {
      setRuleFormError('Escalation destination role is required.');
      return;
    }

    if (editingRule) {
      // Update existing rule
      const updatedRules = deadlineRules.map((r) =>
        r.id === editingRule.id
          ? {
              ...r,
              name: ruleFormName.trim(),
              category: ruleFormCategory,
              appliesToBureau: ruleFormBureau,
              priority: ruleFormPriority,
              defaultDurationDays: ruleFormDuration,
              warningThresholdDays: ruleFormWarning,
              escalationTarget: ruleFormTarget.trim(),
            }
          : r
      );
      onUpdateDeadlineRules(updatedRules);

      // Audit Log
      onRecordAudit({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName: currentPersona.name,
        actorRole: currentPersona.role,
        actorBureau: currentPersona.bureauName,
        actionType: 'RULE_UPDATED',
        entityType: 'DEADLINE_RULE',
        entityId: editingRule.id,
        summary: `Updated SLA Rule "${ruleFormName}"`,
        details: {
          previousValue: `${editingRule.defaultDurationDays} days (Warning: ${editingRule.warningThresholdDays}d)`,
          newValue: `${ruleFormDuration} days (Warning: ${ruleFormWarning}d)`,
          reason: 'Administrative policy calibration',
        },
      });

      showToast(`SLA Rule "${ruleFormName}" updated successfully.`);
    } else {
      // Create new rule
      const newRule: DeadlineRule = {
        id: `rule-${Date.now()}`,
        name: ruleFormName.trim(),
        category: ruleFormCategory,
        categoryName: ruleFormCategory.replace(/_/g, ' '),
        defaultDurationDays: ruleFormDuration,
        warningThresholdDays: ruleFormWarning,
        escalationTarget: ruleFormTarget.trim(),
        appliesToBureau: ruleFormBureau,
        priority: ruleFormPriority,
        isActive: true,
      };

      onUpdateDeadlineRules([newRule, ...deadlineRules]);

      // Audit Log
      onRecordAudit({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actorName: currentPersona.name,
        actorRole: currentPersona.role,
        actorBureau: currentPersona.bureauName,
        actionType: 'RULE_CREATED',
        entityType: 'DEADLINE_RULE',
        entityId: newRule.id,
        summary: `Created new SLA Rule "${newRule.name}"`,
        details: {
          previousValue: 'None',
          newValue: `${newRule.defaultDurationDays} days target`,
          reason: 'Initial rule onboarding',
        },
      });

      showToast(`New SLA Rule "${ruleFormName}" created.`);
    }

    setIsRuleModalOpen(false);
  };

  const handleToggleRule = (rule: DeadlineRule) => {
    const updatedStatus = !rule.isActive;
    const updatedRules = deadlineRules.map((r) =>
      r.id === rule.id ? { ...r, isActive: updatedStatus } : r
    );
    onUpdateDeadlineRules(updatedRules);

    // Audit Log
    onRecordAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'RULE_TOGGLED',
      entityType: 'DEADLINE_RULE',
      entityId: rule.id,
      summary: `Toggled SLA Rule "${rule.name}" to ${updatedStatus ? 'ACTIVE' : 'INACTIVE'}`,
      details: {
        previousValue: rule.isActive ? 'ACTIVE' : 'INACTIVE',
        newValue: updatedStatus ? 'ACTIVE' : 'INACTIVE',
        reason: 'Administrative toggle',
      },
    });

    showToast(`Rule "${rule.name}" is now ${updatedStatus ? 'Active' : 'Inactive'}.`);
  };

  const handleDeleteRule = (rule: DeadlineRule) => {
    setRuleToDelete(rule);
  };

  const confirmDeleteRule = () => {
    if (!ruleToDelete) return;
    const rule = ruleToDelete;
    const updatedRules = deadlineRules.filter((r) => r.id !== rule.id);
    onUpdateDeadlineRules(updatedRules);

    onRecordAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'RULE_DELETED',
      entityType: 'DEADLINE_RULE',
      entityId: rule.id,
      summary: `Deleted SLA Rule "${rule.name}"`,
      details: {
        previousValue: `${rule.defaultDurationDays} days SLA`,
        newValue: 'Deleted',
        reason: 'Rule decommissioned by administrator',
      },
    });

    setRuleToDelete(null);
    showToast(`Rule "${rule.name}" removed from in-memory configuration.`);
  };

  const handleResetRulesToDefault = () => {
    setShowResetRulesConfirm(true);
  };

  const confirmResetRules = () => {
    onUpdateDeadlineRules(SYNTHETIC_DEADLINE_RULES);
    setShowResetRulesConfirm(false);
    showToast('SLA rules reset to default demo benchmarks.');
  };

  // --- USER ADMINISTRATION HANDLERS ---
  const filteredUsers = users.filter((u) => {
    if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
    if (userStatusFilter !== 'ALL' && u.status !== userStatusFilter) return false;
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const matchName = u.name.toLowerCase().includes(q);
      const matchEmail = u.email.toLowerCase().includes(q);
      const matchBureau = (u.bureauName || '').toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchBureau) return false;
    }
    return true;
  });

  const handleOpenRoleModal = (user: UserPersona) => {
    setTargetUser(user);
    setNewSelectedRole(user.role);
    setIsRoleModalOpen(true);
  };

  const handleConfirmRoleChange = () => {
    if (!targetUser) return;
    const oldRole = targetUser.role;

    const roleLabels: Record<UserRole, string> = {
      COMPLAINANT: 'Complainant (Student / Citizen)',
      BUREAU_OFFICER: 'Bureau Officer',
      BUREAU_HEAD: 'Bureau Head',
      APEX_ADMIN: 'Apex Admin',
    };

    const updatedUsers = users.map((u) =>
      u.id === targetUser.id ? { ...u, role: newSelectedRole, roleLabel: roleLabels[newSelectedRole] } : u
    );
    onUpdateUsers(updatedUsers);

    // Audit Log
    onRecordAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'USER_ROLE_CHANGED',
      entityType: 'USER_ACCOUNT',
      entityId: targetUser.email,
      summary: `Updated role for ${targetUser.name} from ${oldRole} to ${newSelectedRole}`,
      details: {
        previousValue: oldRole,
        newValue: newSelectedRole,
        reason: 'Administrative role reassignment',
      },
    });

    setIsRoleModalOpen(false);
    showToast(`User ${targetUser.name} reassigned to ${roleLabels[newSelectedRole]}.`);
  };

  const handleOpenStatusModal = (user: UserPersona) => {
    setTargetUser(user);
    setNewSelectedStatus(user.status || 'ACTIVE');
    setIsStatusModalOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (!targetUser) return;
    const oldStatus = targetUser.status || 'ACTIVE';

    const updatedUsers = users.map((u) =>
      u.id === targetUser.id ? { ...u, status: newSelectedStatus } : u
    );
    onUpdateUsers(updatedUsers);

    // Audit Log
    onRecordAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'USER_STATUS_CHANGED',
      entityType: 'USER_ACCOUNT',
      entityId: targetUser.email,
      summary: `Changed account status for ${targetUser.name} to ${newSelectedStatus}`,
      details: {
        previousValue: oldStatus,
        newValue: newSelectedStatus,
        reason: 'Administrative access governance',
      },
    });

    setIsStatusModalOpen(false);
    showToast(`Account status for ${targetUser.name} updated to ${newSelectedStatus}.`);
  };

  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      showToast('Name and email are required.', 'error');
      return;
    }

    const bureauNames: Record<BureauType, string> = {
      APPROVAL_BUREAU: 'Approval Bureau',
      FINANCE_BUREAU: 'Finance Bureau',
      GRIEVANCE_CELL: 'Public Grievance Cell',
      POLICY_ACADEMIC: 'Policy & Academic Bureau',
      LEGAL_CELL: 'Legal & Vigilance Cell',
      RAGGING_PREVENTION: 'Anti-Ragging Cell',
    };

    const roleLabels: Record<UserRole, string> = {
      COMPLAINANT: 'Complainant (Student / Citizen)',
      BUREAU_OFFICER: 'Bureau Officer',
      BUREAU_HEAD: 'Bureau Head',
      APEX_ADMIN: 'Apex Admin',
    };

    const initials = newUserName
      .split(' ')
      .map((p) => p[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newUser: UserPersona = {
      id: `user-${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      roleLabel: roleLabels[newUserRole],
      bureau: newUserRole === 'COMPLAINANT' ? undefined : newUserBureau,
      bureauName: newUserRole === 'COMPLAINANT' ? undefined : bureauNames[newUserBureau],
      avatarInitials: initials || 'US',
      status: 'ACTIVE',
      lastActivity: new Date().toISOString(),
    };

    onUpdateUsers([...users, newUser]);

    // Audit Log
    onRecordAudit({
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'USER_CREATED',
      entityType: 'USER_ACCOUNT',
      entityId: newUser.email,
      summary: `Provisioned demo user account for ${newUser.name} (${newUser.role})`,
      details: {
        previousValue: 'None',
        newValue: `${newUser.role} in ${newUser.bureauName || 'Public Portal'}`,
        reason: 'Demo user provisioning',
      },
    });

    setIsAddUserModalOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    showToast(`Demo user ${newUser.name} created.`);
  };

  return (
    <div className="space-y-6 select-none font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border shadow-xl flex items-center gap-2.5 text-xs font-medium transition-all ${
            toastMessage.type === 'success'
              ? 'bg-[#154636] text-white border-[#1E5C47]'
              : 'bg-[#DC2626] text-white border-[#B91C1C]'
          }`}
        >
          {toastMessage.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-[#0F172A]">
              System Administration & Governance
            </h2>
            <span className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-xs bg-[#EAF5EE] text-[#155836] border border-[#D1E7D9]">
              {currentPersona.roleLabel}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Role-Based Access Control (RBAC), configurable statutory SLA rules, and prototype user management • SIH26264
          </p>
        </div>

        {/* Sub-tab navigation (Reordered: User Management -> Role Permissions -> SLA Configuration) */}
        <div className="flex items-center gap-1 bg-[#EAE5DC] p-1 rounded-xl text-xs font-medium">
          <button
            onClick={() => setActiveAdminTab('USER_MANAGEMENT')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeAdminTab === 'USER_MANAGEMENT'
                ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            1. User Directory ({users.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('RBAC')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeAdminTab === 'RBAC'
                ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            2. Role Permissions
          </button>
          <button
            onClick={() => setActiveAdminTab('SLA_RULES')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
              activeAdminTab === 'SLA_RULES'
                ? 'bg-white text-[#0F172A] shadow-xs font-semibold'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            3. SLA Configuration ({deadlineRules.length})
          </button>
        </div>
      </div>

      {/* In-Memory Prototype Governance Disclaimer */}
      <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-lg text-xs text-[#5C6460] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Shield size={15} className="text-[#154636] shrink-0" />
          <span>
            <strong>IN-MEMORY PROTOTYPE NOTICE:</strong> All edits to users, permissions, and SLA benchmarks modify live in-memory state and log append-only audit events for this session. Changes are not persisted to an external database.
          </span>
        </div>
        <span className="font-mono text-[11px] text-[#718096] shrink-0">
          Actor: {currentPersona.name} ({currentPersona.roleLabel})
        </span>
      </div>

      {/* TAB 2: ROLE-PERMISSIONS (Plain-Language Summary First + Matrix in Expander) */}
      {activeAdminTab === 'RBAC' && (
        <div className="space-y-4">
          {/* Plain language role summaries */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-[#E6E1D8] rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1F2421]">Complainant (Student / Citizen)</span>
                <span className="text-[10px] bg-[#FAF8F5] text-[#5C6460] px-2 py-0.5 rounded border border-[#E6E1D8]">External</span>
              </div>
              <p className="text-xs text-[#5C6460] leading-relaxed">
                Can submit grievances, upload evidence, and track the status of their own submitted cases. Strictly restricted from viewing grievances filed by others, modifying workflow statuses, or accessing internal coordination tools.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#E6E1D8] rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1F2421]">Bureau Officer (Scrutiny & Inquiry)</span>
                <span className="text-[10px] bg-[#EBF3EE] text-[#1B4532] px-2 py-0.5 rounded border border-[#CDE1D5]">Operational</span>
              </div>
              <p className="text-xs text-[#5C6460] leading-relaxed">
                Attached to specific regulatory bureaus. Can triage assigned complaints, log investigative notes, transition workflow statuses within their designated bureau, and review cross-bureau overlap recommendations.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#E6E1D8] rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1F2421]">Bureau Head (Departmental Authority)</span>
                <span className="text-[10px] bg-[#F5F3FF] text-[#6D28D9] px-2 py-0.5 rounded border border-[#DDD6FE]">Supervisory</span>
              </div>
              <p className="text-xs text-[#5C6460] leading-relaxed">
                Oversees bureau caseload and scrutiny officers. Holds authority to dispatch formal statutory SLA escalation notices for overdue cases, sign off on resolution reviews, and access administration screens.
              </p>
            </div>

            <div className="p-4 bg-white border border-[#E6E1D8] rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#1F2421]">Apex Admin (AICTE Headquarters)</span>
                <span className="text-[10px] bg-[#FEF2F2] text-[#DC2626] px-2 py-0.5 rounded border border-[#FECACA]">Full Authority</span>
              </div>
              <p className="text-xs text-[#5C6460] leading-relaxed">
                Universal oversight across all AICTE bureaus. Can transfer cases across bureaus, dispatch escalation notices for any case, configure statutory SLA duration rules, and manage user accounts.
              </p>
            </div>
          </div>

          {/* Granular Matrix in Expander */}
          <Card>
            <div className="p-4 border-b border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#154636]" />
                <div>
                  <h3 className="text-sm font-bold text-[#1F2421]">Full Functional Access Control Matrix</h3>
                  <p className="text-xs text-[#5C6460]">13 granular functional capabilities across all AICTE CaseConnect roles</p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPermissionsExpanded(!permissionsExpanded)}
                icon={permissionsExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              >
                {permissionsExpanded ? 'Collapse Matrix' : 'Expand Matrix'}
              </Button>
            </div>

            {permissionsExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                      <th className="py-3 px-4 w-1/3">Capability / Operation</th>
                      <th className="py-3 px-4 text-center">Complainant</th>
                      <th className="py-3 px-4 text-center">Bureau Officer</th>
                      <th className="py-3 px-4 text-center">Bureau Head</th>
                      <th className="py-3 px-4 text-center bg-[#EAF5EE]/40 text-[#155836]">
                        Apex Admin
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E1D8]">
                    {permissionsMatrix.map((row) => (
                      <tr key={row.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-[#0F172A]">{row.capability}</div>
                          <div className="text-[11px] text-[#64748B] mt-0.5">{row.description}</div>
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {renderPermissionBadge(row.complainant)}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {renderPermissionBadge(row.officer)}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          {renderPermissionBadge(row.head)}
                        </td>

                        <td className="py-3 px-4 text-center whitespace-nowrap bg-[#EAF5EE]/20">
                          {renderPermissionBadge(row.admin, true)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: CONFIGURABLE SLA RULES */}
      {activeAdminTab === 'SLA_RULES' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-[#154636]" />
                  <span>Statutory SLA Rules & Escalation Tiers</span>
                </div>
              }
              subtitle="Configurable resolution duration limits, warning triggers, and escalation roles"
              action={
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    icon={<RotateCcw size={13} />}
                    onClick={handleResetRulesToDefault}
                  >
                    Reset Defaults
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Plus size={14} />}
                    onClick={handleOpenAddRule}
                  >
                    Add SLA Rule
                  </Button>
                </div>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    <th className="py-3 px-4">Rule Name & Category</th>
                    <th className="py-3 px-4">Bureau</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Target Duration</th>
                    <th className="py-3 px-4">Warning Trigger</th>
                    <th className="py-3 px-4">Escalation Recipient</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8]">
                  {deadlineRules.map((rule) => (
                    <tr
                      key={rule.id}
                      className={`hover:bg-[#FAF8F5] transition-colors ${
                        !rule.isActive ? 'opacity-60 bg-[#F8FAFC]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-[#0F172A]">{rule.name}</div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">
                          Category: {rule.categoryName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-medium text-[#1E293B]">
                          {rule.appliesToBureau.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge priority={rule.priority || 'HIGH'}>
                          {rule.priority || 'HIGH'}
                        </Badge>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-[#155836]">
                        {rule.defaultDurationDays} Days
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-[#64748B]">
                        &lt; {rule.warningThresholdDays} Days remaining
                      </td>

                      <td className="py-3.5 px-4 text-[#0F172A]">
                        {rule.escalationTarget}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          onClick={() => handleToggleRule(rule)}
                          className={`text-xs px-2.5 py-0.5 rounded-full font-medium transition-colors cursor-pointer ${
                            rule.isActive
                              ? 'bg-[#EAF5EE] text-[#155836] border border-[#D1E7D9]'
                              : 'bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]'
                          }`}
                        >
                          {rule.isActive ? 'Active' : 'Disabled'}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="sm"
                            icon={<Edit2 size={13} />}
                            onClick={() => handleOpenEditRule(rule)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#DC2626] hover:bg-[#FEE2E2]"
                            icon={<Trash2 size={13} />}
                            onClick={() => handleDeleteRule(rule)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 3: PROTOTYPE USER MANAGEMENT */}
      {activeAdminTab === 'USER_MANAGEMENT' && (
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-[#154636]" />
                  <span>AICTE CaseConnect User Directory</span>
                </div>
              }
              subtitle="Prototype user accounts, assigned bureau affiliations, and role elevation controls"
              action={
                <Button
                  variant="primary"
                  size="sm"
                  icon={<Plus size={14} />}
                  onClick={() => setIsAddUserModalOpen(true)}
                  disabled={!isApexAdmin}
                >
                  Provision Demo User
                </Button>
              }
            />

            {/* User Search & Filters */}
            <div className="p-4 border-b border-[#E6E1D8] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="relative w-full sm:w-64">
                <Search size={14} className="absolute left-3 top-2.5 text-[#94A3B8]" />
                <input
                  type="text"
                  placeholder="Search user name, email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full bg-white border border-[#DFE3DC] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
                />
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-white border border-[#DFE3DC] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
                >
                  <option value="ALL">All Roles ({users.length})</option>
                  <option value="COMPLAINANT">Complainant</option>
                  <option value="BUREAU_OFFICER">Bureau Officer</option>
                  <option value="BUREAU_HEAD">Bureau Head</option>
                  <option value="APEX_ADMIN">Apex Admin</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  className="bg-white border border-[#DFE3DC] rounded-lg px-2.5 py-1.5 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
                >
                  <option value="ALL">All Account Statuses</option>
                  <option value="ACTIVE">Active</option>
                  <option value="SUSPENDED">Suspended</option>
                  <option value="PENDING_VERIFICATION">Pending Verification</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8] text-[11px] font-semibold text-[#64748B] uppercase tracking-wider">
                    <th className="py-3 px-4">User Identity</th>
                    <th className="py-3 px-4">Demo Email</th>
                    <th className="py-3 px-4">Assigned Role</th>
                    <th className="py-3 px-4">Bureau Affiliation</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Activity</th>
                    <th className="py-3 px-4 text-right">Administrative Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E1D8]">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-[#64748B]">
                        No users match the search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-[#FAF8F5] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-[#0F172A]">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#154636] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              {u.avatarInitials}
                            </div>
                            <span>{u.name}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[#64748B]">
                          {u.email}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <Badge role={u.role}>{u.roleLabel}</Badge>
                        </td>

                        <td className="py-3.5 px-4 text-[#1E293B]">
                          {u.bureauName || 'Central / External'}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                            u.status === 'ACTIVE'
                              ? 'bg-[#EAF5EE] text-[#155836] border-[#D1E7D9]'
                              : u.status === 'SUSPENDED'
                              ? 'bg-[#FEE2E2] text-[#DC2626] border-[#FECACA]'
                              : 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
                          }`}>
                            {u.status || 'ACTIVE'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-[11px] text-[#64748B]">
                          {u.lastActivity ? u.lastActivity.slice(0, 16).replace('T', ' ') : 'N/A'}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenRoleModal(u)}
                              disabled={!isApexAdmin && currentPersona.email !== u.email}
                            >
                              Change Role
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenStatusModal(u)}
                              disabled={!isApexAdmin}
                            >
                              Status
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* MODAL 1: ADD / EDIT SLA RULE */}
      <Modal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        title={editingRule ? 'Edit SLA Rule' : 'Create New Statutory SLA Rule'}
        subtitle="AICTE Resolution Turnaround & Escalation Policy Configuration"
        maxWidth="lg"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsRuleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveRule}>
              {editingRule ? 'Save Changes' : 'Create Rule'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          {ruleFormError && (
            <div className="p-2.5 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg text-[#DC2626] text-xs flex items-center gap-2">
              <AlertTriangle size={14} className="shrink-0" />
              <span>{ruleFormError}</span>
            </div>
          )}

          <div>
            <Input
              label="SLA Rule Name *"
              placeholder="e.g. Anti-Ragging Expedited Inquest"
              value={ruleFormName}
              onChange={(e) => setRuleFormName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Applicable Category *
              </label>
              <select
                value={ruleFormCategory}
                onChange={(e) => setRuleFormCategory(e.target.value as ComplaintCategory)}
                className="w-full bg-white border border-[#DFE3DC] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
              >
                <option value="ADMISSION_FRAUD">Admission Fraud / Capitation</option>
                <option value="RAGGING">Ragging & Student Harassment</option>
                <option value="FACULTY_NON_PAYMENT">Faculty Salary & Arrears Dues</option>
                <option value="INFRASTRUCTURE">Physical & Lab Infrastructure</option>
                <option value="CURRICULUM_ACCREDITATION">Curriculum & Credentials</option>
                <option value="FEE_EXTORTION">Fee Extortion</option>
                <option value="OTHER">Legal & Vigilance Inquest</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Applicable Bureau *
              </label>
              <select
                value={ruleFormBureau}
                onChange={(e) => setRuleFormBureau(e.target.value as any)}
                className="w-full bg-white border border-[#DFE3DC] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
              >
                <option value="APPROVAL_BUREAU">Approval Bureau</option>
                <option value="FINANCE_BUREAU">Finance Bureau</option>
                <option value="GRIEVANCE_CELL">Public Grievance Cell</option>
                <option value="POLICY_ACADEMIC">Policy & Academic Bureau</option>
                <option value="LEGAL_CELL">Legal & Vigilance Cell</option>
                <option value="ALL">All Bureaus (Cross-Cutting)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Priority Tier
              </label>
              <select
                value={ruleFormPriority}
                onChange={(e) => setRuleFormPriority(e.target.value as ComplaintPriority)}
                className="w-full bg-white border border-[#DFE3DC] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
              >
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Target SLA (Days) *
              </label>
              <input
                type="number"
                min={1}
                max={180}
                value={ruleFormDuration}
                onChange={(e) => setRuleFormDuration(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-white border border-[#DFE3DC] rounded-lg px-3 py-2 text-xs text-[#0F172A] font-mono focus:outline-none focus:border-[#154636]"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Warning Threshold (Days) *
              </label>
              <input
                type="number"
                min={1}
                max={ruleFormDuration - 1}
                value={ruleFormWarning}
                onChange={(e) => setRuleFormWarning(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-white border border-[#DFE3DC] rounded-lg px-3 py-2 text-xs text-[#0F172A] font-mono focus:outline-none focus:border-[#154636]"
              />
            </div>
          </div>

          <div>
            <Input
              label="Escalation Destination Role / Authority *"
              placeholder="e.g. Bureau Head & AICTE Chairman Task Force"
              value={ruleFormTarget}
              onChange={(e) => setRuleFormTarget(e.target.value)}
              required
            />
          </div>
        </div>
      </Modal>

      {/* MODAL 2: CHANGE USER ROLE */}
      <Modal
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        title="Reassign User Role & Permissions"
        subtitle={`Modifying access credentials for ${targetUser?.name || 'Selected User'}`}
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmRoleChange}>
              Confirm Role Reassignment
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <p className="text-[#64748B] leading-relaxed">
            Select the new administrative role for <strong>{targetUser?.name}</strong> ({targetUser?.email}). Changing this role immediately reconfigures permissions according to the AICTE RBAC matrix.
          </p>

          <div className="space-y-2">
            {[
              { role: 'COMPLAINANT', label: 'Complainant', desc: 'Can submit complaints and view own cases.' },
              { role: 'BUREAU_OFFICER', label: 'Bureau Officer', desc: 'Can review bureau cases, update status, and request transfers.' },
              { role: 'BUREAU_HEAD', label: 'Bureau Head', desc: 'Approves transfers, manages bureau team, and views bureau audit.' },
              { role: 'APEX_ADMIN', label: 'Apex Admin', desc: 'Full system oversight, user management, and global audit authority.' },
            ].map((r) => (
              <label
                key={r.role}
                className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                  newSelectedRole === r.role
                    ? 'bg-[#EAF5EE] border-[#154636]'
                    : 'bg-white border-[#E5E7EB] hover:bg-[#F9FAF8]'
                }`}
              >
                <input
                  type="radio"
                  name="userRoleChoice"
                  checked={newSelectedRole === r.role}
                  onChange={() => setNewSelectedRole(r.role as UserRole)}
                  className="mt-0.5 text-[#154636] focus:ring-[#154636]"
                />
                <div>
                  <span className="font-bold text-[#0F172A] block">{r.label}</span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">{r.desc}</span>
                </div>
              </label>
            ))}
          </div>
        </div>
      </Modal>

      {/* MODAL 3: CHANGE ACCOUNT STATUS */}
      <Modal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        title="Modify Account Security Status"
        subtitle={`Target user: ${targetUser?.name}`}
        maxWidth="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleConfirmStatusChange}>
              Apply Status
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-xs">
          <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
            Account Access Status
          </label>
          <select
            value={newSelectedStatus}
            onChange={(e) => setNewSelectedStatus(e.target.value as any)}
            className="w-full bg-white border border-[#DFE3DC] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
          >
            <option value="ACTIVE">Active (Normal Access)</option>
            <option value="SUSPENDED">Suspended (Access Revoked)</option>
            <option value="PENDING_VERIFICATION">Pending Identity Verification</option>
          </select>
          <p className="text-[11px] text-[#64748B] mt-2">
            Status modifications are logged to the immutable audit trail for security compliance.
          </p>
        </div>
      </Modal>

      {/* MODAL 4: PROVISION DEMO USER */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Provision Demo Staff Account"
        subtitle="Onboard synthetic AICTE officer or staff into prototype environment"
        maxWidth="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateUser}>
              Provision User
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <Input
              label="Full Name *"
              placeholder="e.g. Dr. Harish Chandra"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
          </div>

          <div>
            <Input
              label="Demo Email Address *"
              placeholder="e.g. h.chandra@aicte-india.org"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                Assigned Role
              </label>
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                className="w-full bg-white border border-[#DFE3DC] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
              >
                <option value="BUREAU_OFFICER">Bureau Officer</option>
                <option value="BUREAU_HEAD">Bureau Head</option>
                <option value="APEX_ADMIN">Apex Admin</option>
                <option value="COMPLAINANT">Complainant</option>
              </select>
            </div>

            {newUserRole !== 'COMPLAINANT' && (
              <div>
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-[#64748B] mb-1">
                  Bureau Affiliation
                </label>
                <select
                  value={newUserBureau}
                  onChange={(e) => setNewUserBureau(e.target.value as BureauType)}
                  className="w-full bg-white border border-[#DFE3DC] rounded-lg px-3 py-2 text-xs text-[#0F172A] focus:outline-none focus:border-[#154636]"
                >
                  <option value="APPROVAL_BUREAU">Approval Bureau</option>
                  <option value="FINANCE_BUREAU">Finance Bureau</option>
                  <option value="GRIEVANCE_CELL">Public Grievance Cell</option>
                  <option value="POLICY_ACADEMIC">Policy & Academic Bureau</option>
                  <option value="LEGAL_CELL">Legal & Vigilance Cell</option>
                </select>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Rule Confirmation Dialog */}
      <ConfirmDialog
        isOpen={ruleToDelete !== null}
        title="Delete Statutory SLA Rule"
        description={`Are you sure you want to delete SLA rule "${ruleToDelete?.name}"? Any cases relying on this rule will fall back to standard bureau defaults.`}
        confirmLabel="Delete SLA Rule"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={confirmDeleteRule}
        onCancel={() => setRuleToDelete(null)}
      />

      {/* Reset Rules Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetRulesConfirm}
        title="Reset All SLA Rules to Benchmark Defaults"
        description="Are you sure you want to reset all statutory SLA benchmark rules to initial defaults? Custom duration thresholds will be restored."
        confirmLabel="Reset Rules"
        cancelLabel="Cancel"
        variant="warning"
        onConfirm={confirmResetRules}
        onCancel={() => setShowResetRulesConfirm(false)}
      />
    </div>
  );
};
