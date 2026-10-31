import React, { useState } from 'react';
import { 
  GitMerge, 
  Hourglass,
  AlertTriangle,
  CheckCircle2,
  Check,
  Search,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
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
  overlapCandidates,
  complaints,
  onSelectComplaint,
  onConfirmOverlap,
  onDismissOverlap,
}) => {
  // Pairs matching Reference Image 2
  const candidatePairs = [
    { 
      id: '1', 
      p1: 'CC-2026-000098', 
      p2: 'CC-2026-000112', 
      score: 95,
      institution: 'BITS Pilani',
      subject: 'Infrastructure & Attendance glitched in hostel block',
      sameInstitution: true,
      similarSubject: true,
      relatedPeriod: true,
    },
    { 
      id: '2', 
      p1: 'CC-2026-000215', 
      p2: 'CC-2026-000208', 
      score: 92,
      institution: 'IIT Bombay',
      subject: 'Faculty shortage in AI & Data Science Department',
      sameInstitution: true,
      similarSubject: true,
      relatedPeriod: true,
    },
    { 
      id: '3', 
      p1: 'CC-2026-000312', 
      p2: 'CC-2026-000347', 
      score: 87,
      institution: 'NIT Trichy',
      subject: 'End-semester exam schedule conflict and fee grievance',
      sameInstitution: true,
      similarSubject: true,
      relatedPeriod: false,
    },
  ];

  const [selectedPairId, setSelectedPairId] = useState<string>('1');
  const [showAllPairs, setShowAllPairs] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);

  const selectedPair = candidatePairs.find((p) => p.id === selectedPairId) || candidatePairs[0];

  const handleReview = (pair: typeof candidatePairs[0]) => {
    setSelectedPairId(pair.id);
    // Find matching complaint to trigger drawer if available
    const c = complaints.find(comp => comp.trackingNumber === pair.p1 || comp.trackingNumber === pair.p2);
    if (c) {
      onSelectComplaint(c);
    } else {
      setReviewModalOpen(true);
    }
  };

  return (
    <div className="space-y-4 select-none pb-6">
      {/* 1. Header Matching Reference Image 2 */}
      <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#172B24] font-serif">
            Overlap Intelligence
          </h1>
          <p className="text-xs text-[#78847D] mt-0.5 font-sans">
            Find and review overlapping cases
          </p>
        </div>
      </div>

      {/* 2. 4 KPI Cards Matching Reference Image 2 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Matches */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Total Matches</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#172B24] mt-1 tracking-tight">
              42
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#174B38]/10 text-[#174B38] flex items-center justify-center shrink-0">
            <GitMerge size={18} />
          </div>
        </div>

        {/* High Confidence */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">High Confidence</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#174B38] mt-1 tracking-tight">
              18
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4F8064]/10 text-[#4F8064] flex items-center justify-center shrink-0">
            <Hourglass size={18} />
          </div>
        </div>

        {/* Under Review */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Under Review</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#C58B3B] mt-1 tracking-tight">
              12
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#C58B3B]/10 text-[#C58B3B] flex items-center justify-center shrink-0">
            <AlertTriangle size={18} />
          </div>
        </div>

        {/* Confirmed */}
        <div className="bg-white border border-[#E8E2D6] rounded-xl p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-[#78847D] block">Confirmed</span>
            <div className="text-2xl sm:text-3xl font-bold font-sans text-[#4F8064] mt-1 tracking-tight">
              12
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4F8064]/10 text-[#4F8064] flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} />
          </div>
        </div>
      </div>

      {/* 3. Clean Two-Column Layout: Potential Matches (Left) & Match Analysis (Right) Matching Reference Image 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 items-stretch">
        {/* Left Column: Potential Matches (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F7F5EF] mb-3">
              <h2 className="text-[14px] font-bold text-[#172B24] font-serif">
                Potential Matches
              </h2>
              <button 
                onClick={() => setShowAllPairs(!showAllPairs)}
                className="text-xs text-[#78847D] hover:text-[#174B38] font-medium cursor-pointer transition-colors"
              >
                {showAllPairs ? 'Show Less' : 'View All →'}
              </button>
            </div>

            <div className="space-y-2.5">
              {candidatePairs.map((pair) => {
                const isSelected = selectedPairId === pair.id;
                return (
                  <div
                    key={pair.id}
                    onClick={() => setSelectedPairId(pair.id)}
                    className={`p-3 rounded-lg border transition-all flex items-center justify-between gap-3 text-xs cursor-pointer ${
                      isSelected
                        ? 'border-[#174B38] bg-[#F7F5EF]/60 shadow-xs'
                        : 'border-[#E8E2D6] bg-white hover:border-[#174B38]/50 hover:bg-[#F7F5EF]/30'
                    }`}
                  >
                    <div className="flex items-center gap-3 font-mono text-[12px] font-bold text-[#174B38]">
                      <GitMerge size={14} className="text-[#D5A64A] shrink-0" />
                      <span className="hover:underline">{pair.p1}</span>
                      <span className="text-[#78847D] font-normal">↔</span>
                      <span className="hover:underline">{pair.p2}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold font-sans bg-[#4F8064]/10 text-[#4F8064] border border-[#4F8064]/20">
                        {pair.score}% Match
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReview(pair);
                        }}
                        className="px-3 py-1 text-[11px] font-semibold border border-[#E8E2D6] rounded-md bg-white hover:bg-[#174B38] hover:text-white transition-colors cursor-pointer shadow-2xs"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F7F5EF] mt-3 text-[11px] text-[#78847D] flex items-center justify-between">
            <span>Showing top AICTE semantic & metadata overlap candidates</span>
            <span className="font-mono text-[#174B38] font-semibold">Live Pipeline Active</span>
          </div>
        </div>

        {/* Right Column: Match Analysis (5 cols) Matching Reference Image 2 */}
        <div className="lg:col-span-5 bg-white border border-[#E8E2D6] rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="pb-3 border-b border-[#F7F5EF] mb-3">
              <h2 className="text-[14px] font-bold text-[#172B24] font-serif">
                Match Analysis
              </h2>
            </div>

            {/* Venn Diagram Illustration with Intersecting Circles */}
            <div className="flex items-center justify-center py-3">
              <div className="relative flex items-center justify-center w-48 h-28">
                {/* Left Circle (Sage Green) */}
                <div className="w-24 h-24 rounded-full bg-[#829B86]/40 border border-[#829B86] flex items-center justify-center -mr-7 relative z-10">
                  <span className="font-mono text-[10px] font-bold text-[#172B24] pr-2 truncate max-w-[65px]">
                    {selectedPair.p1.slice(-6)}
                  </span>
                </div>
                {/* Right Circle (Muted Gold) */}
                <div className="w-24 h-24 rounded-full bg-[#D5A64A]/35 border border-[#D5A64A] flex items-center justify-center relative z-10">
                  <span className="font-mono text-[10px] font-bold text-[#172B24] pl-2 truncate max-w-[65px]">
                    {selectedPair.p2.slice(-6)}
                  </span>
                </div>
              </div>
            </div>

            {/* Three Indicator Checklists Matching Reference Image 2 */}
            <div className="space-y-2.5 py-1 px-2">
              <div className="flex items-center gap-2.5 text-xs text-[#172B24] font-medium">
                <span className="w-5 h-5 rounded-full bg-[#4F8064] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={2.5} />
                </span>
                <span>Same Institution ({selectedPair.institution})</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[#172B24] font-medium">
                <span className="w-5 h-5 rounded-full bg-[#4F8064] text-white flex items-center justify-center shrink-0">
                  <Check size={12} strokeWidth={2.5} />
                </span>
                <span>Similar Subject (Cosine Similarity: {selectedPair.score}%)</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-[#172B24] font-medium">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white ${
                  selectedPair.relatedPeriod ? 'bg-[#4F8064]' : 'bg-[#78847D]'
                }`}>
                  <Check size={12} strokeWidth={2.5} />
                </span>
                <span>Related Period (Within same statutory reporting quarter)</span>
              </div>
            </div>
          </div>

          {/* Action Button at Bottom Matching Reference Image 2 */}
          <div className="pt-4 border-t border-[#F7F5EF] mt-3 flex justify-end">
            <button
              onClick={() => handleReview(selectedPair)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#174B38] hover:bg-[#12382B] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs transition-colors"
            >
              <span>View Details →</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
