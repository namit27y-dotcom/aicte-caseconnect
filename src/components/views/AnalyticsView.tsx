import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  Building2, 
  Calendar,
  Download
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

export const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState('Quarter 4 (2026)');

  const monthlyIntake = [
    { month: 'Jun', total: 64, resolved: 58 },
    { month: 'Jul', total: 78, resolved: 70 },
    { month: 'Aug', total: 92, resolved: 80 },
    { month: 'Sep', total: 110, resolved: 95 },
    { month: 'Oct', total: 100, resolved: 32 },
  ];

  const stateDistribution = [
    { state: 'Uttar Pradesh', count: 28, percentage: 28 },
    { state: 'Maharashtra', count: 22, percentage: 22 },
    { state: 'Karnataka', count: 18, percentage: 18 },
    { state: 'Madhya Pradesh', count: 14, percentage: 14 },
    { state: 'Tamil Nadu', count: 12, percentage: 12 },
    { state: 'Other States', count: 6, percentage: 6 },
  ];

  return (
    <div className="space-y-5">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F2421]">
            Resolution & Workload Analytics
          </h2>
          <p className="text-xs text-[#5C6460] mt-0.5">
            Statistical tracking of complaint throughput, inter-bureau turnaround, and geographic clustering
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-white border border-[#D5CEC2] rounded-md px-3 py-1.5 text-xs text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
          >
            <option>Quarter 4 (2026)</option>
            <option>Academic Year 2025-26</option>
            <option>All-Time Synthetic Register</option>
          </select>
        </div>
      </div>

      {/* Top Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-[#E6E1D8] rounded-md">
          <span className="text-xs text-[#5C6460] font-medium block">Average Resolution Time</span>
          <p className="text-2xl font-bold font-mono text-[#1F2421] mt-1 tabular-nums">
            18.4 Days
          </p>
          <span className="text-[11px] text-[#1B4532] block mt-1">-3.2 days vs 2025</span>
        </div>

        <div className="p-4 bg-white border border-[#E6E1D8] rounded-md">
          <span className="text-xs text-[#5C6460] font-medium block">First-Response SLA Compliance</span>
          <p className="text-2xl font-bold font-mono text-[#1F2421] mt-1 tabular-nums">
            94.2%
          </p>
          <span className="text-[11px] text-[#1B4532] block mt-1">+4.8% improvement</span>
        </div>

        <div className="p-4 bg-white border border-[#E6E1D8] rounded-md">
          <span className="text-xs text-[#5C6460] font-medium block">Cross-Bureau Coordination Rate</span>
          <p className="text-2xl font-bold font-mono text-[#1F2421] mt-1 tabular-nums">
            17.6%
          </p>
          <span className="text-[11px] text-[#5C6460] block mt-1">Multi-bureau cases linked</span>
        </div>

        <div className="p-4 bg-white border border-[#E6E1D8] rounded-md">
          <span className="text-xs text-[#5C6460] font-medium block">Appeals / Re-openings</span>
          <p className="text-2xl font-bold font-mono text-[#1F2421] mt-1 tabular-nums">
            2.1%
          </p>
          <span className="text-[11px] text-[#1B4532] block mt-1">Well below 5% benchmark</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly intake trend chart */}
        <div className="lg:col-span-7">
          <Card>
            <CardHeader
              title="Monthly Complaint Intake & Resolution"
              subtitle="Comparison of newly registered cases vs disposed complaints"
            />
            <CardContent>
              <div className="space-y-4">
                {monthlyIntake.map((item, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#1F2421]">{item.month} 2026</span>
                      <span className="font-mono text-[#5C6460]">
                        {item.total} Intake / {item.resolved} Disposed
                      </span>
                    </div>
                    <div className="w-full bg-[#FAF8F5] border border-[#E6E1D8] h-5 rounded-xs flex overflow-hidden">
                      <div
                        className="bg-[#1B4532] h-full flex items-center justify-center text-[10px] text-white font-mono"
                        style={{ width: `${(item.resolved / 120) * 100}%` }}
                      >
                        {item.resolved}
                      </div>
                      <div
                        className="bg-[#D4A373] h-full flex items-center justify-center text-[10px] text-white font-mono"
                        style={{ width: `${((item.total - item.resolved) / 120) * 100}%` }}
                      >
                        {item.total - item.resolved > 0 ? item.total - item.resolved : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-6 mt-6 pt-3 border-t border-[#E6E1D8] text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#1B4532] rounded-xs" />
                  <span className="text-[#5C6460]">Disposed Complaints</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#D4A373] rounded-xs" />
                  <span className="text-[#5C6460]">Pending / Under Investigation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Geographic State Distribution */}
        <div className="lg:col-span-5">
          <Card>
            <CardHeader
              title="Geographic State Distribution"
              subtitle="Concentration of reported technical institute grievances"
            />
            <CardContent>
              <div className="space-y-3.5">
                {stateDistribution.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#1F2421]">{s.state}</span>
                      <span className="font-mono text-[#5C6460]">{s.count} ({s.percentage}%)</span>
                    </div>
                    <div className="w-full bg-[#EAE5DC] h-2 rounded-xs overflow-hidden">
                      <div
                        className="bg-[#1B4532] h-full rounded-xs transition-all"
                        style={{ width: `${s.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
