/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * AICTE CaseConnect - Smart India Hackathon 2026 MVP (SIH26264)
 * Institution-Related Complaint Monitoring & Resolution Platform
 * Team: VECTOR_VAGABONDS
 */

import React, { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { SyntheticBanner } from './components/layout/SyntheticBanner';

import { DashboardView } from './components/views/DashboardView';
import { ComplaintsView } from './components/views/ComplaintsView';
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
  BureauType
} from './types';

import { 
  SYNTHETIC_PERSONAS, 
  SYNTHETIC_COMPLAINTS, 
  SYNTHETIC_INSTITUTIONS,
  SYNTHETIC_OVERLAPS,
  SYNTHETIC_COORDINATION_GROUPS,
  SYNTHETIC_AUDIT_LOGS
} from './data/syntheticData';

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [currentPersona, setCurrentPersona] = useState<UserPersona>(SYNTHETIC_PERSONAS[0]); // Aashish Kumar (Bureau Officer)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Domain Synthetic State
  const [complaints, setComplaints] = useState<Complaint[]>(SYNTHETIC_COMPLAINTS);
  const [coordinationGroups, setCoordinationGroups] = useState<CoordinationGroup[]>(SYNTHETIC_COORDINATION_GROUPS);
  const [overlapCandidates, setOverlapCandidates] = useState<OverlapCandidate[]>(SYNTHETIC_OVERLAPS);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(SYNTHETIC_AUDIT_LOGS);

  // Selected Complaint for Drawer & Modal State
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);

  // Status Change Handler with Immutable Audit Logging (Section 7 Rule 7)
  const handleStatusChange = (complaintId: string, newStatus: ComplaintStatus, reason: string) => {
    let targetTracking = '';
    let oldStatusVal = '';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === complaintId) {
          targetTracking = c.trackingNumber;
          oldStatusVal = c.status;
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
            isOverdue: newStatus === 'CLOSED' ? false : c.isOverdue,
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
              isOverdue: newStatus === 'CLOSED' ? false : prev.isOverdue,
            }
          : null
      );
    }
  };

  // Create Complaint Handler with Audit Logging
  const handleCreateComplaint = (data: Partial<Complaint>) => {
    const nextSeq = 156 + complaints.length;
    const trackingNumber = `CC-2026-000${nextSeq}`;
    const now = new Date();
    const deadlineDate = new Date();
    // Default 30-day SLA
    deadlineDate.setDate(now.getDate() + 30);

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
      complainantName: data.complainantName || 'Citizen Complainant',
      complainantType: data.complainantType || 'STUDENT',
      createdAt: now.toISOString(),
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
          timestamp: now.toISOString(),
          description: `Grievance registered and assigned initial tracking number ${trackingNumber}.`,
        },
      ],
    };

    setComplaints((prev) => [newComp, ...prev]);

    // Record audit event
    const newAuditItem: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: now.toISOString(),
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
    const inst = SYNTHETIC_INSTITUTIONS.find((i) => i.id === instId);
    if (inst) {
      setSearchQuery(inst.name);
      setActiveTab('complaints');
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#0F172A] flex flex-col font-sans antialiased">
      <div className="flex-1 flex">
        {/* Responsive Sidebar Navigation - Exactly 295px wide */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentPersona={currentPersona}
          onPersonaChange={setCurrentPersona}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Workspace Area with exact 295px left padding for sidebar */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-[295px] bg-[#FBF9F5] transition-all">
          {/* Top Bar Header */}
          <TopBar
            activeTab={activeTab}
            currentPersona={currentPersona}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
            onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPersonaChange={setCurrentPersona}
          />

          {/* Synthetic Demo Data Isolation Banner directly beneath TopBar */}
          <SyntheticBanner />

          {/* Page Body Viewport */}
          <main className="flex-1 p-5 sm:p-7 max-w-[1668px] w-full mx-auto">
            {activeTab === 'overview' && (
              <DashboardView
                currentPersona={currentPersona}
                onSelectComplaint={setSelectedComplaint}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'complaints' && (
              <ComplaintsView
                complaints={complaints}
                currentPersona={currentPersona}
                onSelectComplaint={setSelectedComplaint}
                onOpenNewComplaint={() => setIsNewComplaintOpen(true)}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'institutions' && (
              <InstitutionsView
                institutions={SYNTHETIC_INSTITUTIONS}
                complaints={complaints}
                onSelectComplaint={setSelectedComplaint}
                onFilterComplaintsByInstitution={handleFilterComplaintsByInstitution}
              />
            )}

            {activeTab === 'coordination' && (
              <CoordinationView
                coordinationGroups={coordinationGroups}
                overlapCandidates={overlapCandidates}
                complaints={complaints}
                currentPersona={currentPersona}
                onSelectComplaint={setSelectedComplaint}
                onConfirmOverlap={handleConfirmOverlap}
                onDismissOverlap={handleDismissOverlap}
              />
            )}

            {activeTab === 'deadlines' && (
              <DeadlineQueueView
                complaints={complaints}
                currentPersona={currentPersona}
                onSelectComplaint={setSelectedComplaint}
                onTriggerEscalation={handleTriggerEscalation}
              />
            )}

            {activeTab === 'analytics' && <AnalyticsView />}

            {activeTab === 'audit' && (
              <AuditTrailView
                auditLogs={auditLogs}
                searchQuery={searchQuery}
              />
            )}

            {activeTab === 'administration' && (
              <AdministrationView currentPersona={currentPersona} />
            )}
          </main>
        </div>
      </div>

      {/* Case Details Drawer */}
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
