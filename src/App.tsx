/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AICTE CaseConnect - Smart India Hackathon 2026 MVP (SIH26264)
 * Institution-Related Complaint Monitoring & Resolution Platform
 * Team: VECTOR_VAGABONDS
 */

import React, { useState, useMemo } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { SyntheticBanner } from './components/layout/SyntheticBanner';

import { DashboardView } from './components/views/DashboardView';
import { ComplaintsView, ComplaintFilterState } from './components/views/ComplaintsView';
import { InstitutionsView } from './components/views/InstitutionsView';
import { CoordinationView } from './components/views/CoordinationView';
import { DeadlineQueueView } from './components/views/DeadlineQueueView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { AuditTrailView } from './components/views/AuditTrailView';
import { AdministrationView } from './components/views/AdministrationView';

import { ComplaintDetailDrawer } from './components/views/ComplaintDetailDrawer';
import { NewComplaintModal } from './components/views/NewComplaintModal';

import { 
  NavigationTab, 
  UserPersona, 
  Complaint, 
  ComplaintStatus, 
  AuditLogItem, 
  OverlapCandidate,
  CoordinationGroup,
  BureauType,
  DeadlineRule
} from './types';

import { 
  SYNTHETIC_PERSONAS, 
  SYNTHETIC_COMPLAINTS, 
  SYNTHETIC_INSTITUTIONS,
  SYNTHETIC_OVERLAPS,
  SYNTHETIC_COORDINATION_GROUPS,
  SYNTHETIC_AUDIT_LOGS,
  SYNTHETIC_DEADLINE_RULES
} from './data/syntheticData';

import { 
  getNow, 
  deriveSidebarBadges, 
  deriveNotifications, 
  DerivedNotification 
} from './utils/caseMetrics';
import { can, isComplaintVisibleToPersona } from './utils/permissions';
import { validateTransition } from './utils/workflow';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(SYNTHETIC_PERSONAS[0]); // Aashish Kumar (Bureau Officer)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Lifted Complaint Filters State
  const [complaintFilter, setComplaintFilter] = useState<ComplaintFilterState>({
    status: 'ALL',
    bureau: 'ALL',
    priority: 'ALL',
    institutionId: undefined,
    search: '',
  });

  // Domain Synthetic State
  const [complaints, setComplaints] = useState<Complaint[]>(SYNTHETIC_COMPLAINTS);
  const [coordinationGroups, setCoordinationGroups] = useState<CoordinationGroup[]>(SYNTHETIC_COORDINATION_GROUPS);
  const [overlapCandidates, setOverlapCandidates] = useState<OverlapCandidate[]>(SYNTHETIC_OVERLAPS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(SYNTHETIC_AUDIT_LOGS);
  const [deadlineRules, setDeadlineRules] = useState<DeadlineRule[]>(SYNTHETIC_DEADLINE_RULES);
  const [users, setUsers] = useState<UserPersona[]>(SYNTHETIC_PERSONAS);

  // Selected Complaint for Drawer & Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);

  // Notifications read tracking state
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(new Set());

  const now = getNow();

  // Role-scoped complaints: Complainant sees only their own complaints
  const visibleComplaints = useMemo(() => {
    return complaints.filter((c) => isComplaintVisibleToPersona(c, currentPersona));
  }, [complaints, currentPersona]);

  // Derived sidebar badge counts
  const sidebarBadges = useMemo(() => {
    return deriveSidebarBadges(visibleComplaints, overlapCandidates, deadlineRules, now);
  }, [visibleComplaints, overlapCandidates, deadlineRules, now]);

  // Derived notification list
  const notifications = useMemo(() => {
    return deriveNotifications(visibleComplaints, overlapCandidates, now);
  }, [visibleComplaints, overlapCandidates, now]);

  const handleMarkAllNotificationsRead = () => {
    setReadNotificationIds(new Set(notifications.map((n) => n.id)));
  };

  const handleNotificationClick = (notif: DerivedNotification) => {
    setReadNotificationIds((prev) => new Set([...prev, notif.id]));
    setActiveTab(notif.targetTab);
    if (notif.complaintId) {
      const match = complaints.find((c) => c.id === notif.complaintId);
      if (match) setSelectedComplaint(match);
    }
  };

  // Status Change Handler with Immutable Audit Logging and Permissions Enforcement
  const handleStatusChange = (complaintId: string, newStatus: ComplaintStatus, reason: string) => {
    const targetComp = complaints.find((c) => c.id === complaintId);
    if (!targetComp) return;

    // Strict Permissions Check
    const permission = can(currentPersona, 'CHANGE_STATUS', { complaint: targetComp });
    if (!permission.allowed) {
      alert(`Action rejected: ${permission.reason}`);
      return;
    }

    // Strict Workflow Transition Check
    const validation = validateTransition(targetComp.status, newStatus, reason);
    if (!validation.valid) {
      alert(`Workflow transition rejected: ${validation.error}`);
      return;
    }

    let targetTracking = targetComp.trackingNumber;
    let oldStatusVal = targetComp.status;

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          const newEvent = {
            id: `ev-${Date.now()}`,
            complaintId: c.id,
            action: `STATUS_CHANGED_TO_${newStatus}`,
            actor: currentPersona.name,
            actorRole: currentPersona.role,
            timestamp: new Date().toISOString(),
            description: `Status changed to ${newStatus}. Note: ${reason}`,
          };
          return {
            ...c,
            status: newStatus,
            resolvedAt: newStatus === 'CLOSED' ? new Date().toISOString() : c.resolvedAt,
            events: [newEvent, ...c.events],
          };
        }
        return c;
      })
    );

    // Append to Audit Trail
    const newAuditItem: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'STATUS_CHANGE',
      entityType: 'COMPLAINT',
      entityId: targetTracking || complaintId,
      summary: `Status updated from ${oldStatusVal} to ${newStatus}`,
      details: {
        previousValue: oldStatusVal,
        newValue: newStatus,
        reason,
      },
    };

    setAuditLogs((prev) => [newAuditItem, ...prev]);

    // Update active inspector if open
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              resolvedAt: newStatus === 'CLOSED' ? new Date().toISOString() : prev.resolvedAt,
            }
          : null
      );
    }
  };

  // Create Complaint Handler with Unique Sequential Tracking IDs
  const handleCreateComplaint = (data: Partial<Complaint>) => {
    const permission = can(currentPersona, 'CREATE_COMPLAINT');
    if (!permission.allowed) {
      alert(`Action rejected: ${permission.reason}`);
      return;
    }

    // Calculate next sequential tracking number without collision
    let maxNumber = 123;
    for (const c of complaints) {
      const match = c.trackingNumber.match(/CC-2026-(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    }
    const trackingNumber = `CC-2026-${String(maxNumber + 1).padStart(6, '0')}`;

    const nowTime = getNow();

    // Default SLA from active rules or fall back to 30 days
    let slaDays = 30;
    if (data.category) {
      const activeRule = deadlineRules.find(
        (r) => r.isActive && r.category === data.category
      );
      if (activeRule) slaDays = activeRule.defaultDurationDays;
    }
    const deadlineDate = new Date(nowTime.getTime() + slaDays * 24 * 60 * 60 * 1000);

    const newComp: Complaint = {
      id: `comp-${Date.now()}`,
      trackingNumber,
      title: data.title || 'Untitled Grievance',
      description: data.description || '',
      institutionId: data.institutionId || 'inst-1',
      institutionName: data.institutionName || 'Selected Institute',
      institutionState: data.institutionState || 'Uttar Pradesh',
      category: data.category || 'ADMISSION_FRAUD',
      categoryLabel: data.categoryLabel || 'Admission Fraud',
      status: 'SUBMITTED',
      priority: data.priority || 'HIGH',
      bureau: currentPersona.bureau || 'APPROVAL_BUREAU',
      bureauName: currentPersona.bureauName || 'Approval Bureau',
      assignedOfficerName: currentPersona.name,
      assignedOfficerId: currentPersona.id,
      complainantName: data.complainantName || currentPersona.name,
      complainantType: data.complainantType || 'STUDENT',
      createdAt: nowTime.toISOString(),
      targetDeadline: deadlineDate.toISOString(),
      isOverdue: false,
      overlapCount: 0,
      events: [
        {
          id: `ev-${Date.now()}`,
          complaintId: `comp-${Date.now()}`,
          action: 'INTAKE_LOGGED',
          actor: currentPersona.name,
          actorRole: currentPersona.role,
          timestamp: nowTime.toISOString(),
          description: `Grievance registered and assigned initial tracking number ${trackingNumber}.`,
        },
      ],
    };

    setComplaints((prev) => [newComp, ...prev]);

    // Record audit event
    const newAuditItem: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: nowTime.toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'STATUS_CHANGE',
      entityType: 'COMPLAINT',
      entityId: trackingNumber,
      summary: `Initial intake logged for ${newComp.institutionName}`,
      details: {
        previousValue: 'None',
        newValue: 'SUBMITTED',
        reason: 'New case intake via AICTE Centralized Platform',
      },
    };

    setAuditLogs((prev) => [newAuditItem, ...prev]);
    setSelectedComplaint(newComp);
  };

  // Overlap confirmation
  const handleConfirmOverlap = (overlapId: string) => {
    const permission = can(currentPersona, 'REVIEW_OVERLAP');
    if (!permission.allowed) {
      alert(`Action rejected: ${permission.reason}`);
      return;
    }

    setOverlapCandidates((prev) =>
      prev.map((o) => (o.id === overlapId ? { ...o, reviewStatus: 'CONFIRMED_RELATED' } : o))
    );

    const overlap = overlapCandidates.find((o) => o.id === overlapId);

    const newAuditItem: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'OVERLAP_LINK',
      entityType: 'COMPLAINT',
      entityId: overlap?.targetTrackingNumber || overlapId,
      summary: `Officer confirmed cross-bureau overlap relation (Confidence: ${overlap?.similarityScore}%)`,
      details: {
        previousValue: 'PENDING_REVIEW',
        newValue: 'CONFIRMED_RELATED',
        reason: 'Officer verified matching institution and temporal proximity.',
      },
    };
    setAuditLogs((prev) => [newAuditItem, ...prev]);
  };

  // Overlap dismissal
  const handleDismissOverlap = (overlapId: string) => {
    const permission = can(currentPersona, 'REVIEW_OVERLAP');
    if (!permission.allowed) {
      alert(`Action rejected: ${permission.reason}`);
      return;
    }

    setOverlapCandidates((prev) =>
      prev.map((o) => (o.id === overlapId ? { ...o, reviewStatus: 'DISMISSED_INDEPENDENT' } : o))
    );

    const overlap = overlapCandidates.find((o) => o.id === overlapId);

    const newAuditItem: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'OVERLAP_LINK',
      entityType: 'COMPLAINT',
      entityId: overlap?.targetTrackingNumber || overlapId,
      summary: `Officer evaluated overlap candidate and dismissed as independent`,
      details: {
        previousValue: 'PENDING_REVIEW',
        newValue: 'DISMISSED_INDEPENDENT',
        reason: 'Different departmental matters not requiring joint inquiry.',
      },
    };
    setAuditLogs((prev) => [newAuditItem, ...prev]);
  };

  // Escalation notice trigger
  const handleTriggerEscalation = (trackingNumber: string) => {
    const targetComp = complaints.find((c) => c.trackingNumber === trackingNumber);
    if (!targetComp) return;

    const alreadyEscalated = auditLogs.some(
      (a) => a.entityId === trackingNumber && a.actionType === 'DEADLINE_OVERRIDE'
    );

    const permission = can(currentPersona, 'TRIGGER_ESCALATION', {
      complaint: targetComp,
      alreadyEscalated,
    });

    if (!permission.allowed) {
      alert(`Action rejected: ${permission.reason}`);
      return;
    }

    const newAuditItem: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentPersona.name,
      actorRole: currentPersona.role,
      actorBureau: currentPersona.bureauName,
      actionType: 'DEADLINE_OVERRIDE',
      entityType: 'COMPLAINT',
      entityId: trackingNumber,
      summary: `Dispatched formal SLA notice to Regional Officer and Bureau Head`,
      details: {
        previousValue: 'Overdue Pending',
        newValue: 'Formal Show-Cause Notice Dispatched',
        reason: 'Statutory deadline exceeded without compliance submission.',
      },
    };
    setAuditLogs((prev) => [newAuditItem, ...prev]);
  };

  // Jump from Institution to Complaints with filtered view
  const handleFilterComplaintsByInstitution = (instId: string) => {
    setComplaintFilter({
      status: 'ALL',
      bureau: 'ALL',
      priority: 'ALL',
      institutionId: instId,
      search: '',
    });
    setActiveTab('complaints');
  };

  const handleFilterFromDashboard = (filter: { status?: string; bureau?: string }) => {
    setComplaintFilter((prev) => ({
      ...prev,
      status: filter.status !== undefined ? filter.status : prev.status,
      bureau: filter.bureau !== undefined ? filter.bureau : prev.bureau,
    }));
  };

  const handleResetComplaintFilters = () => {
    setComplaintFilter({
      status: 'ALL',
      bureau: 'ALL',
      priority: 'ALL',
      institutionId: undefined,
      search: '',
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0F172A] flex flex-col font-sans antialiased">
      <div className="flex-1 flex">
        {/* Responsive Sidebar Navigation - Exactly 295px wide */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentPersona={currentPersona}
          badges={sidebarBadges}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Workspace Area with exact 295px left padding for sidebar */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-[295px] bg-[#FAF8F5] transition-all">
          {/* Top Bar Header with Unified Role Switcher and Search */}
          <TopBar
            activeTab={activeTab}
            currentPersona={currentPersona}
            complaints={visibleComplaints}
            notifications={notifications}
            readNotificationIds={readNotificationIds}
            onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
            onNotificationClick={handleNotificationClick}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
            searchQuery={complaintFilter.search}
            onSearchChange={(q) => setComplaintFilter((prev) => ({ ...prev, search: q }))}
            onPersonaChange={setCurrentPersona}
            onSelectComplaint={setSelectedComplaint}
            onNavigateTab={setActiveTab}
          />

          {/* Synthetic Demo Data Isolation Banner */}
          <SyntheticBanner />

          {/* Page Body Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-7 max-w-[1668px] w-full mx-auto">
            {activeTab === 'overview' && (
              <DashboardView
                currentPersona={currentPersona}
                complaints={visibleComplaints}
                deadlineRules={deadlineRules}
                overlapCandidates={overlapCandidates}
                onSelectComplaint={setSelectedComplaint}
                onNavigateTab={setActiveTab}
                onFilterComplaints={handleFilterFromDashboard}
              />
            )}

            {activeTab === 'complaints' && (
              <ComplaintsView
                complaints={visibleComplaints}
                currentPersona={currentPersona}
                filterState={complaintFilter}
                onUpdateFilter={(p) => setComplaintFilter((prev) => ({ ...prev, ...p }))}
                onResetFilters={handleResetComplaintFilters}
                onSelectComplaint={setSelectedComplaint}
                onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
              />
            )}

            {activeTab === 'institutions' && (
              <InstitutionsView
                institutions={SYNTHETIC_INSTITUTIONS}
                complaints={visibleComplaints}
                onSelectComplaint={setSelectedComplaint}
                onFilterComplaintsByInstitution={handleFilterComplaintsByInstitution}
              />
            )}

            {activeTab === 'coordination' && (
              <CoordinationView
                coordinationGroups={coordinationGroups}
                overlapCandidates={overlapCandidates}
                complaints={visibleComplaints}
                currentPersona={currentPersona}
                onSelectComplaint={setSelectedComplaint}
                onConfirmOverlap={handleConfirmOverlap}
                onDismissOverlap={handleDismissOverlap}
              />
            )}

            {activeTab === 'deadlines' && (
              <DeadlineQueueView
                complaints={visibleComplaints}
                deadlineRules={deadlineRules}
                currentPersona={currentPersona}
                onSelectComplaint={setSelectedComplaint}
                onTriggerEscalation={handleTriggerEscalation}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView
                complaints={visibleComplaints}
                currentPersona={currentPersona}
                onSelectComplaint={setSelectedComplaint}
              />
            )}

            {activeTab === 'audit' && (
              <AuditTrailView
                auditLogs={auditLogs}
                searchQuery={complaintFilter.search}
              />
            )}

            {activeTab === 'administration' && (
              <AdministrationView
                currentPersona={currentPersona}
                deadlineRules={deadlineRules}
                onUpdateDeadlineRules={setDeadlineRules}
                users={users}
                onUpdateUsers={setUsers}
                onRecordAudit={(item) => setAuditLogs((prev) => [item, ...prev])}
              />
            )}
          </main>
        </div>
      </div>

      {/* Case Details Drawer with State Machine Transition Controls */}
      <ComplaintDetailDrawer
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        currentPersona={currentPersona}
        onStatusChange={handleStatusChange}
        onNavigateTab={setActiveTab}
      />

      {/* New Complaint Intake Dialog */}
      <NewComplaintModal
        isOpen={isNewComplaintOpen}
        onClose={() => setIsNewComplaintOpen(false)}
        onSubmit={handleCreateComplaint}
      />
    </div>
  );
}
