import React, { useState } from 'react';
import { Info, X } from 'lucide-react';

export const SyntheticBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#E8F4EC] border-b border-[#D1E7D9] text-[#155836] px-6 py-2.5 text-xs transition-all">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-4 h-4 rounded-full bg-[#1B4332] text-white flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold font-serif italic">i</span>
          </div>
          <span className="font-normal text-[#1A5336] leading-tight">
            This is a synthetic demo environment for SIH 2026. All institutions, complaints, cases and dates are mock data and not real AICTE records.
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <span className="bg-[#D5ECDD] text-[#155734] font-mono font-medium px-2 py-0.5 rounded-full text-[11px]">
            SIH26264
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="text-[#155734] hover:text-[#0C321E] p-0.5 rounded-sm cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
