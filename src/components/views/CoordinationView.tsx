import React, { useState } from 'react';
import { 
  GitMerge, 
  Users, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Building2, 
  FileText, 
  ShieldCheck,
  Percent,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { PageHeader } from '../ui/PageHeader';
import { CoordinationGroup, OverlapCandidate, Complaint, UserPersona } from '../../types';
import { can } from '../../utils/permissions';

interface CoordinationViewProps {
  coordinationGroups: CoordinationGroup[];
  overlapCandidates: OverlapCandidate[];
  complaints: Complaint[];
  currentPersona: UserPersona;
  onSelectComplaint: (complaint: Complaint) => void;
  onConfirmOverlap: (overlapId: string) => void;
  onDismissOverlap: (overlapId: string) => void;
}

export const CoordinationView: React.FC<CoordinationViewProps> = ({
  coordinationGroups,
  overlapCandidates,
  complaints,
  currentPersona,
  onSelectComplaint,
  onConfirmOverlap,
  onDismissOverlap,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERLAPS' | 'GROUPS'>('OVERLAPS');
  const [selectedOverlapId, setSelectedOverlapId] = useState<string>(overlapCandidates[0]?.id || '');
  const [detailsExpanded, setDetailsExpanded] = useState<boolean>(false);

  const selectedOverlap = overlapCandidates.find((o) => o.id === selectedOverlapId) || overlapCandidates[0] || null;
  const permission = can(currentPersona, 'REVIEW_OVERLAP');

  return (
    <div className="space-y-5">
      {/* View Header */}
      <PageHeader
        title="Cross-Bureau Coordination & Overlap Engine"
        subtitle="Identify fragmented multi-bureau cases, review computed evidence, and coordinate joint investigations"
        actions={
          <div className="flex items-center gap-1 bg-[#EAE5DC] p-1 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('OVERLAPS')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'OVERLAPS' ? 'bg-white text-[#1F2421] shadow-xs font-semibold' : 'text-[#5C6460] hover:text-[#1F2421]'
              }`}
            >
              Overlap Candidates ({overlapCandidates.length})
            </button>
            <button
              onClick={() => setActiveTab('GROUPS')}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                activeTab === 'GROUPS' ? 'bg-white text-[#1F2421] shadow-xs font-semibold' : 'text-[#5C6460] hover:text-[#1F2421]'
              }`}
            >
              Coordination Groups ({coordinationGroups.length})
            </button>
          </div>
        }
      />

      {/* Human-in-the-loop Disclosure Notice */}
      <div className="p-3.5 bg-[#F2F7F4] border border-[#CDE1D5] rounded-lg text-xs text-[#1B4532] flex items-start gap-3">
        <ShieldCheck size={18} className="text-[#1B4532] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Human-in-the-Loop Overlap Decision Principle</span>
          <p className="text-[11px] text-[#265E44] leading-relaxed">
            Similarity scores are algorithmic suggestions designed to assist human officers in detecting cross-bureau patterns. Final determination of relation or independent processing remains strictly with assigned officers and is recorded in the immutable audit trail.
          </p>
        </div>
      </div>

      {activeTab === 'OVERLAPS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Overlap Candidate List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">
              Candidate Overlap Pairs ({overlapCandidates.length})
            </h3>

            {overlapCandidates.map((candidate) => {
              const isSelected = selectedOverlap?.id === candidate.id;
              const primaryComplaint = complaints.find((c) => c.id === candidate.primaryCaseId);

              return (
                <div
                  key={candidate.id}
                  onClick={() => {
                    setSelectedOverlapId(candidate.id);
                    setDetailsExpanded(false);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1B4532] ring-2 ring-[#1B4532] shadow-sm'
                      : 'bg-white border-[#E6E1D8] hover:border-[#CBD5E1]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-[#1B4532] flex items-center gap-1">
                      <Percent size={14} />
                      {candidate.similarityScore}% Algorithmic Match
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      candidate.reviewStatus === 'CONFIRMED_RELATED'
                        ? 'bg-[#EBF3EE] text-[#1B4532] border-[#CDE1D5]'
                        : candidate.reviewStatus === 'DISMISSED_INDEPENDENT'
                        ? 'bg-[#FAF8F5] text-[#718096] border-[#E2DDD3]'
                        : 'bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]'
                    }`}>
                      {candidate.reviewStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-[#1F2421]">
                    {candidate.targetInstitution}
                  </h4>

                  <div className="mt-3 pt-2.5 border-t border-[#F4F1EA] flex items-center justify-between text-xs text-[#5C6460]">
                    <span className="font-mono font-semibold text-[#1B4532]">
                      {primaryComplaint?.trackingNumber || 'Case A'}
                    </span>
                    <ArrowRight size={13} className="text-[#94A3B8]" />
                    <span className="font-mono font-semibold text-[#1B4532]">
                      {candidate.targetTrackingNumber}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (7 cols): Evidence Inspector & Decision Controls */}
          <div className="lg:col-span-7">
            {selectedOverlap ? (
              <div className="bg-white border border-[#E6E1D8] rounded-xl p-6 shadow-2xs space-y-5">
                <div className="pb-3 border-b border-[#F4F1EA]">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-[#1F2421]">
                      Cross-Bureau Case Comparison
                    </h3>
                    <span className="font-mono text-sm font-bold text-[#1B4532] bg-[#EBF3EE] px-2 py-0.5 rounded border border-[#CDE1D5]">
                      {selectedOverlap.similarityScore}% Confidence
                    </span>
                  </div>
                  <p className="text-xs text-[#5C6460] mt-0.5">
                    Institution: <strong className="text-[#1F2421]">{selectedOverlap.targetInstitution}</strong>
                  </p>
                </div>

                {/* Plain language explanation */}
                <div className="p-4 bg-[#FAF8F5] border border-[#E6E1D8] rounded-lg text-xs leading-relaxed text-[#1F2421] space-y-1">
                  <span className="font-bold text-[#1B4532] block">
                    Plain-Language Investigative Lead:
                  </span>
                  <p>{selectedOverlap.evidence.explanation}</p>
                </div>

                {/* Expander for detailed algorithmic breakdown */}
                <div className="border border-[#E6E1D8] rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setDetailsExpanded(!detailsExpanded)}
                    className="w-full p-3 bg-[#FAF8F5] hover:bg-[#F4F1EA] transition-colors flex items-center justify-between text-xs font-semibold text-[#1F2421] cursor-pointer"
                  >
                    <span>Detailed Evidence Factor Breakdown</span>
                    {detailsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {detailsExpanded && (
                    <div className="p-4 space-y-4 text-xs border-t border-[#E6E1D8] bg-white">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {/* Factor 1: Institution Match */}
                        <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-md text-center">
                          <span className="text-[10px] text-[#718096] uppercase font-semibold">
                            Same Institute
                          </span>
                          <p className="font-mono text-base font-bold text-[#1B4532] mt-1">
                            {selectedOverlap.evidence.institutionScore}%
                          </p>
                          <span className="text-[10px] text-[#265E44] block">Verified AISHE</span>
                        </div>

                        {/* Factor 2: Temporal Proximity */}
                        <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-md text-center">
                          <span className="text-[10px] text-[#718096] uppercase font-semibold">
                            Time Window
                          </span>
                          <p className="font-mono text-base font-bold text-[#1F2421] mt-1">
                            {selectedOverlap.evidence.temporalScore}%
                          </p>
                          <span className="text-[10px] text-[#718096] block">
                            {selectedOverlap.evidence.temporalProximityDays} days apart
                          </span>
                        </div>

                        {/* Factor 3: Category Weight */}
                        <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-md text-center">
                          <span className="text-[10px] text-[#718096] uppercase font-semibold">
                            Category Scope
                          </span>
                          <p className="font-mono text-base font-bold text-[#1F2421] mt-1">
                            {selectedOverlap.evidence.categoryScore}%
                          </p>
                          <span className="text-[10px] text-[#718096] block">Cross-Bureau</span>
                        </div>

                        {/* Factor 4: Keyword & Text Similarity */}
                        <div className="p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-md text-center">
                          <span className="text-[10px] text-[#718096] uppercase font-semibold">
                            Text Semantics
                          </span>
                          <p className="font-mono text-base font-bold text-[#1F2421] mt-1">
                            {selectedOverlap.evidence.textSimilarityScore}%
                          </p>
                          <span className="text-[10px] text-[#718096] block">Keyword Match</span>
                        </div>
                      </div>

                      {/* Matched Keywords */}
                      <div>
                        <span className="text-[11px] font-semibold text-[#4A5568] block mb-1.5">
                          Common Salient Entities & Keywords:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedOverlap.evidence.matchedKeywords.map((kw, i) => (
                            <span
                              key={i}
                              className="bg-[#FAF8F5] text-[#1F2421] border border-[#D5CEC2] px-2 py-0.5 rounded text-xs font-mono"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Review Actions */}
                <div className="pt-4 border-t border-[#E6E1D8] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-[#5C6460]">
                    Current Status:{' '}
                    <strong className="text-[#1F2421]">
                      {selectedOverlap.reviewStatus.replace('_', ' ')}
                    </strong>
                  </div>

                  {!permission.allowed ? (
                    <div className="text-[11px] text-[#DC2626] font-medium bg-[#FEF2F2] p-2 rounded border border-[#FECACA]">
                      {permission.reason}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<XCircle size={14} className="text-[#DC2626]" />}
                        onClick={() => onDismissOverlap(selectedOverlap.id)}
                      >
                        Keep Separate (Independent)
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<CheckCircle2 size={14} />}
                        onClick={() => onConfirmOverlap(selectedOverlap.id)}
                      >
                        Confirm Related (Joint Action)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        /* Coordination Groups Tab */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coordinationGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-[#E6E1D8] rounded-xl p-5 shadow-2xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-[#1B4532]">
                  {group.groupNumber}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EBF3EE] text-[#1B4532] border border-[#CDE1D5]">
                  {group.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#1F2421]">{group.title}</h4>
              <p className="text-xs text-[#5C6460] leading-relaxed">{group.summary}</p>

              <div className="p-3 bg-[#FAF8F5] rounded-lg text-xs space-y-1">
                <div>
                  <span className="text-[#718096]">Lead Bureau:</span>{' '}
                  <strong className="text-[#1F2421]">{group.leadBureauName}</strong> (Officer: {group.leadOfficer})
                </div>
                <div>
                  <span className="text-[#718096]">Target Institution:</span>{' '}
                  <strong className="text-[#1F2421]">{group.institutionName}</strong>
                </div>
                <div>
                  <span className="text-[#718096]">Linked Cases:</span>{' '}
                  <span className="font-mono text-[#1B4532] font-semibold">
                    {group.complaintTrackingNumbers.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
