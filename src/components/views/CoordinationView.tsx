import React, { useState } from 'react';
import { 
  GitMerge, 
  Search,
  Eye,
  Check
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
  onConfirmOverlap,
  onDismissOverlap,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(overlapCandidates[0]?.id || '');
  const selectedCandidate = overlapCandidates.find(o => o.id === selectedCandidateId) || overlapCandidates[0];

  const candidatePairs = [
    { id: '1', p1: 'CC-2026-000098', p2: 'CC-2026-000112', score: 95 },
    { id: '2', p1: 'CC-2026-000215', p2: 'CC-2026-000220', score: 88 },
    { id: '3', p1: 'CC-2026-000312', p2: 'CC-2026-000347', score: 82 },
  ];

  return (
    <div className="space-y-3.5 select-none pb-6">
      {/* 1. Header with Magnifying Glass Banner from Reference Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#252D27] font-heading">
            Overlap Intelligence
          </h1>
          <p className="text-xs text-[#737A72] mt-0.5">
            Find related cases
          </p>
        </div>

        {/* Thumbnail preview photograph on right */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-36 h-16 rounded-lg overflow-hidden border border-[#E7E4DB]">
            <img 
              src="/assets/banner-overlap.jpg" 
              alt="Overlap Intelligence" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 2. 4 KPI Cards: Matches (12 / 42) | High Confidence (6 / 18) | Under Review (3 / 12) | Confirmed (3 / 12) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Matches</span>
          <div className="text-2xl font-bold font-sans text-[#252D27] mt-0.5 tabular-nums">
            12
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">High Confidence</span>
          <div className="text-2xl font-bold font-sans text-[#193B2A] mt-0.5 tabular-nums">
            6
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Under Review</span>
          <div className="text-2xl font-bold font-sans text-[#C58B3B] mt-0.5 tabular-nums">
            3
          </div>
        </div>

        <div className="bg-white border border-[#E7E4DB] rounded-xl p-3 shadow-2xs">
          <span className="text-[11px] text-[#737A72] block">Confirmed</span>
          <div className="text-2xl font-bold font-sans text-[#4F8064] mt-0.5 tabular-nums">
            3
          </div>
        </div>
      </div>

      {/* 3. Potential Matches Card exactly matching Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs">
        <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-3">
          <h2 className="text-[13.5px] font-semibold text-[#252D27] font-heading">
            Potential Matches
          </h2>
          <span className="text-[11px] text-[#737A72] hover:text-[#193B2A] cursor-pointer">View All →</span>
        </div>

        <div className="space-y-2">
          {candidatePairs.map((pair) => (
            <div
              key={pair.id}
              className="p-3 rounded-lg border border-[#E7E4DB] bg-[#F7F5EF]/40 hover:bg-[#F7F5EF] hover:border-[#193B2A] transition-all flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3 font-mono text-[12px] font-bold text-[#193B2A]">
                <GitMerge size={14} className="text-[#C5A568]" />
                <span>{pair.p1}</span>
                <span className="text-[#737A72] font-normal">↔</span>
                <span>{pair.p2}</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold font-sans bg-[#4F8064]/10 text-[#4F8064] border border-[#4F8064]/20">
                  {pair.score}% Match
                </span>
                <button
                  onClick={() => alert(`Reviewing overlap match ${pair.p1} ↔ ${pair.p2}`)}
                  className="px-3 py-1 text-[11px] font-medium border border-[#E7E4DB] rounded bg-white hover:bg-[#193B2A] hover:text-white transition-colors cursor-pointer"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
