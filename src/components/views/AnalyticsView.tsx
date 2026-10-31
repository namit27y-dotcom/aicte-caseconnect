import React, { useState } from 'react';
import { 
  Download, 
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { Complaint, UserPersona } from '../../types';
import { DonutChart } from '../charts/DonutChart';
import { LineChart } from '../charts/LineChart';
import { exportAnalyticsToCSV } from '../../utils/analyticsCalculations';

interface AnalyticsViewProps {
  complaints: Complaint[];
  currentPersona?: UserPersona;
  onSelectComplaint?: (complaint: Complaint) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  complaints,
}) => {
  const [timeRange, setTimeRange] = useState('Last 6 Months');
  const [bureauFilter, setBureauFilter] = useState('All Bureaus');
  const [regionFilter, setRegionFilter] = useState('All Regions');

  return (
    <div className="space-y-3.5 select-none pb-6">
      {/* 1. Header with Chart/Graph Banner matching Reference Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#252D27] font-heading">
            Analytics & Reports
          </h1>
          <p className="text-xs text-[#737A72] mt-0.5">
            Insights at a glance
          </p>
        </div>

        {/* Thumbnail preview photograph on right */}
        <div className="hidden md:flex items-center gap-3">
          <div className="w-36 h-16 rounded-lg overflow-hidden border border-[#E7E4DB]">
            <img 
              src="/assets/banner-analytics.jpg" 
              alt="Analytics & Reports" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 2. Filter Toolbar with Export Report Button as in Image 1 & 2 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option>Last 6 Months</option>
            <option>Last 30 Days</option>
            <option>Full Year</option>
          </select>

          <select 
            value={bureauFilter} 
            onChange={(e) => setBureauFilter(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option>All Bureaus</option>
            <option>Approval</option>
            <option>Finance</option>
            <option>Governance</option>
          </select>

          <select 
            value={regionFilter} 
            onChange={(e) => setRegionFilter(e.target.value)}
            className="border border-[#E7E4DB] rounded-md px-2 py-1 text-xs bg-white text-[#252D27] focus:outline-none focus:border-[#193B2A]"
          >
            <option>All Regions</option>
            <option>Northern</option>
            <option>Western</option>
            <option>Southern</option>
          </select>
        </div>

        <button
          onClick={() => exportAnalyticsToCSV(complaints, timeRange)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#193B2A] hover:bg-[#142B21] text-white rounded-md text-xs font-medium cursor-pointer shadow-2xs transition-colors"
        >
          <Download size={13} />
          <span>Export Report</span>
        </button>
      </div>

      {/* 3. Main Split Visual: Case Trends (Left) & Bureau Performance (Right) matching Image 1 & 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Case Trends Line Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs">
          <div className="pb-2.5 border-b border-[#F7F5EF] mb-2">
            <h2 className="text-[13.5px] font-semibold text-[#252D27] font-heading">
              Case Trends
            </h2>
          </div>

          <div className="h-52">
            <LineChart
              data={[
                { label: 'Apr', intake: 310, resolved: 280 },
                { label: 'May', intake: 420, resolved: 390 },
                { label: 'Jun', intake: 380, resolved: 360 },
                { label: 'Jul', intake: 450, resolved: 430 },
                { label: 'Aug', intake: 490, resolved: 470 },
                { label: 'Sep', intake: 520, resolved: 500 },
              ]}
              height={190}
            />
          </div>
        </div>

        {/* Right: Bureau Performance Donut & Stats (5 cols) matching Image 1 & 2 */}
        <div className="lg:col-span-5 bg-white border border-[#E7E4DB] rounded-xl p-4 shadow-2xs">
          <div className="pb-2.5 border-b border-[#F7F5EF] mb-3">
            <h2 className="text-[13.5px] font-semibold text-[#252D27] font-heading">
              Bureau Performance
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="w-32 h-32 shrink-0 flex items-center justify-center">
              <DonutChart
                segments={[
                  { key: 'Approval', label: 'Approval', count: 35, percentage: 35, color: '#193B2A' },
                  { key: 'Finance', label: 'Finance', count: 30, percentage: 30, color: '#C5A568' },
                  { key: 'Governance', label: 'Governance', count: 25, percentage: 25, color: '#829B86' },
                  { key: 'Others', label: 'Others', count: 10, percentage: 10, color: '#737A72' },
                ]}
                total={100}
                centerLabel=""
              />
            </div>

            <div className="flex-1 w-full space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#737A72]">
                  <span className="w-2 h-2 rounded-full bg-[#193B2A]" />
                  <span>Approval</span>
                </span>
                <span className="font-mono font-medium text-[#252D27]">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#737A72]">
                  <span className="w-2 h-2 rounded-full bg-[#C5A568]" />
                  <span>Finance</span>
                </span>
                <span className="font-mono font-medium text-[#252D27]">30%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#737A72]">
                  <span className="w-2 h-2 rounded-full bg-[#829B86]" />
                  <span>Governance</span>
                </span>
                <span className="font-mono font-medium text-[#252D27]">25%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-[#737A72]">
                  <span className="w-2 h-2 rounded-full bg-[#737A72]" />
                  <span>Others</span>
                </span>
                <span className="font-mono font-medium text-[#252D27]">10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
