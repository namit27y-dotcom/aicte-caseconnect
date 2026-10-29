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
  Percent
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CoordinationGroup, OverlapCandidate, Complaint, UserPersona } from '../../types';

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
  const [activeTab, setActiveTab] = useState<'GROUPS' | 'OVERLAPS'>('OVERLAPS');
  const [selectedOverlap, setSelectedOverlap] = useState<OverlapCandidate | null>(overlapCandidates[0] || null);

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F2421]">
            Cross-Bureau Coordination & Overlap Engine
          </h2>
          <p className="text-xs text-[#5C6460] mt-0.5">
            Identify fragmented multi-bureau cases, review computed evidence, and coordinate joint investigations
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1 bg-[#EAE5DC] p-1 rounded-md text-xs font-medium">
          <button
            onClick={() => setActiveTab('OVERLAPS')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              activeTab === 'OVERLAPS' ? 'bg-white text-[#1F2421] shadow-xs' : 'text-[#5C6460] hover:text-[#1F2421]'
            }`}
          >
            Overlap Candidates ({overlapCandidates.length})
          </button>
          <button
            onClick={() => setActiveTab('GROUPS')}
            className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
              activeTab === 'GROUPS' ? 'bg-white text-[#1F2421] shadow-xs' : 'text-[#5C6460] hover:text-[#1F2421]'
            }`}
          >
            Coordination Groups ({coordinationGroups.length})
          </button>
        </div>
      </div>

      {/* Mandatory AICTE Rule Banner */}
      <div className="p-3.5 bg-[#F2F7F4] border border-[#CDE1D5] rounded-md text-xs text-[#1B4532] flex items-start gap-3">
        <ShieldCheck size={18} className="text-[#1B4532] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold">AICTE Overlap Review Principle (Rule 9 & 10)</span>
          <p className="text-[11px] text-[#265E44] leading-relaxed">
            Algorithmic overlap detection flags potential relation based on verifiable evidence (institutional identity, keyword semantics, and temporal proximity). Similarity is an investigative lead for officer coordination, never automated presumption of duplicate or wrongdoing.
          </p>
        </div>
      </div>

      {activeTab === 'OVERLAPS' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (5 cols): Overlap Candidate List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4A5568]">
              Candidate Overlap Pairs
            </h3>

            {overlapCandidates.map((candidate) => {
              const isSelected = selectedOverlap?.id === candidate.id;
              const primaryComplaint = complaints.find((c) => c.id === candidate.primaryCaseId);

              return (
                <div
                  key={candidate.id}
                  onClick={() => setSelectedOverlap(candidate)}
                  className={`p-4 rounded-md border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-[#1B4532] ring-1 ring-[#1B4532] shadow-xs'
                      : 'bg-white border-[#E6E1D8] hover:border-[#C5BCAD]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono font-bold text-sm text-[#1B4532] flex items-center gap-1">
                      <Percent size={14} />
                      {candidate.similarityScore}% Overlap Score
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-xs border ${
                      candidate.reviewStatus === 'CONFIRMED_RELATED'
                        ? 'bg-[#EBF3EE] text-[#1B4532] border-[#CDE1D5]'
                        : candidate.reviewStatus === 'DISMISSED_INDEPENDENT'
                        ? 'bg-[#FAF8F5] text-[#718096] border-[#E2DDD3]'
                        : 'bg-[#FDF6ED] text-[#9A621D] border-[#F2DEBF]'
                    }`}>
                      {candidate.reviewStatus.replace('_', ' ')}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold text-[#1F2421]">
                    {candidate.targetInstitution}
                  </h4>

                  <div className="mt-3 pt-2.5 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#5C6460]">
                    <span className="font-mono">{primaryComplaint?.trackingNumber || 'Case A'}</span>
                    <ArrowRight size={12} className="text-[#A0AEC0]" />
                    <span className="font-mono">{candidate.targetTrackingNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column (7 cols): Evidence Inspector & Decision Controls */}
          <div className="lg:col-span-7">
            {selectedOverlap ? (
              <Card>
                <CardHeader
                  title={
                    <div className="flex items-center gap-2">
                      <span>Computed Overlap Evidence Audit</span>
                      <span className="font-mono text-sm font-bold text-[#1B4532]">
                        ({selectedOverlap.similarityScore}%)
                      </span>
                    </div>
                  }
                  subtitle={`Target: ${selectedOverlap.targetInstitution}`}
                />
                <CardContent>
                  <div className="space-y-5">
                    {/* Explanation */}
                    <div className="p-3.5 bg-[#FAF8F5] border border-[#E6E1D8] rounded-sm text-xs leading-relaxed text-[#1F2421]">
                      <span className="font-semibold block mb-1 text-[#1B4532]">
                        Evidence Summary & Synthesis:
                      </span>
                      {selectedOverlap.evidence.explanation}
                    </div>

                    {/* Evidence factor score breakdown */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-3">
                        Signal Breakdown (Weighted Multi-Factor Model)
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {/* Factor 1: Institution Match */}
                        <div className="p-3 bg-white border border-[#E6E1D8] rounded-xs text-center">
                          <span className="text-[10px] text-[#718096] uppercase font-semibold">Same Institution</span>
                          <p className="font-mono text-base font-bold text-[#1B4532] mt-1">
                            {selectedOverlap.evidence.institutionScore}%
                          </p>
                          <span className="text-[10px] text-[#265E44] block">Verified AISHE</span>
                        </div>

                        {/* Factor 2: Temporal Proximity */}
                        <div className="p-3 bg-white border border-[#E6E1D8] rounded-xs text-center">
                          <span className="text-[10px] text-[#718096] uppercase font-semibold">Temporal Window</span>
                          <p className="font-mono text-base font-bold text-[#1F2421] mt-1">
                            {selectedOverlap.evidence.temporalScore}%
                          </p>
                          <span className="text-[10px] text-[#718096] block">
                            {selectedOverlap.evidence.temporalProximityDays} days apart
                          </span>
                        </div>

                        {/* Factor 3: Category Match */}
                        <div className="p-3 bg-white border border-[#E6E1D8] rounded-xs text-center">
                          <span className="text-[10px] text-[#718096] uppercase font-semibold">Category Weight</span>
                          <p className="font-mono text-base font-bold text-[#1F2421] mt-1">
                            {selectedOverlap.evidence.categoryScore}%
                          </p>
                          <span className="text-[10px] text-[#718096] block">Cross-Bureau domain</span>
                        </div>

                        {/* Factor 4: Keyword & Text Similarity */}
                        <div className="p-3 bg-white border border-[#E6E1D8] rounded-xs text-center">
                          <span className="text-[10px] text-[#718096] uppercase font-semibold">Text Cosine Score</span>
                          <p className="font-mono text-base font-bold text-[#1F2421] mt-1">
                            {selectedOverlap.evidence.textSimilarityScore}%
                          </p>
                          <span className="text-[10px] text-[#718096] block">TF-IDF Vector</span>
                        </div>
                      </div>
                    </div>

                    {/* Matched Keywords */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#4A5568] mb-2">
                        Common Salient Entities & Keywords
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedOverlap.evidence.matchedKeywords.map((kw, i) => (
                          <span
                            key={i}
                            className="bg-[#FAF8F5] text-[#1F2421] border border-[#D5CEC2] px-2 py-0.5 rounded-xs text-xs font-mono"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Review Actions */}
                    <div className="pt-4 border-t border-[#E6E1D8] flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-[#5C6460]">
                        Officer Decision:{' '}
                        <span className="font-semibold text-[#1F2421]">
                          {selectedOverlap.reviewStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          icon={<XCircle size={14} className="text-[#9B2226]" />}
                          onClick={() => onDismissOverlap(selectedOverlap.id)}
                        >
                          Dismiss as Independent
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<CheckCircle2 size={14} />}
                          onClick={() => onConfirmOverlap(selectedOverlap.id)}
                        >
                          Confirm & Link to Joint Investigation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </div>
      ) : (
        /* Coordination Groups Tab */
        <div className="space-y-4">
          {coordinationGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader
                title={
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-[#E8EFEA] text-[#1B4532] px-2 py-0.5 rounded-xs border border-[#CDE1D5]">
                      {group.groupNumber}
                    </span>
                    <span>{group.title}</span>
                  </div>
                }
                subtitle={`Target Institution: ${group.institutionName} · Created ${group.createdAt.slice(0, 10)}`}
                action={
                  <Badge variant="forest">
                    {group.status}
                  </Badge>
                }
              />
              <CardContent>
                <div className="space-y-4 text-xs">
                  <p className="text-[#5C6460] leading-relaxed">
                    {group.summary}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-[#FAF8F5] border border-[#E6E1D8] rounded-sm">
                    <div>
                      <span className="text-[10px] text-[#718096] uppercase font-semibold block">Lead Bureau</span>
                      <span className="font-medium text-[#1F2421]">{group.leadBureauName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718096] uppercase font-semibold block">Lead Officer</span>
                      <span className="font-medium text-[#1F2421]">{group.leadOfficer}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#718096] uppercase font-semibold block">Member Bureaus</span>
                      <span className="font-medium text-[#1F2421]">
                        {group.participatingBureaus.map(b => b.replace('_', ' ')).join(', ')}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-[#1F2421] block mb-2">
                      Linked Complaint Cases ({group.complaintTrackingNumbers.length})
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {group.complaintTrackingNumbers.map((tracking, idx) => {
                        const comp = complaints.find(c => c.trackingNumber === tracking);
                        return (
                          <div
                            key={idx}
                            onClick={() => comp && onSelectComplaint(comp)}
                            className="p-2.5 bg-white border border-[#D5CEC2] rounded-xs hover:border-[#1B4532] transition-colors cursor-pointer flex items-center gap-2"
                          >
                            <FileText size={14} className="text-[#1B4532]" />
                            <span className="font-mono font-semibold text-[#1F2421]">{tracking}</span>
                            {comp && <span className="text-[11px] text-[#718096]">({comp.bureauName})</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
