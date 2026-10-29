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
  Save
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { UserPersona, DeadlineRule } from '../../types';
import { SYNTHETIC_DEADLINE_RULES } from '../../data/syntheticData';

interface AdministrationViewProps {
  currentPersona: UserPersona;
}

export const AdministrationView: React.FC<AdministrationViewProps> = ({
  currentPersona,
}) => {
  const [deadlineRules, setDeadlineRules] = useState<DeadlineRule[]>(SYNTHETIC_DEADLINE_RULES);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isPermitted = currentPersona.role === 'APEX_ADMIN' || currentPersona.role === 'BUREAU_HEAD';

  const permissionsMatrix = [
    { capability: 'Submit a complaint', complainant: true, officer: true, head: true, admin: true },
    { capability: 'View own cases', complainant: true, officer: true, head: true, admin: true },
    { capability: 'View bureau cases', complainant: false, officer: true, head: true, admin: true },
    { capability: 'Update case status', complainant: false, officer: true, head: true, admin: true },
    { capability: 'Transfer between bureaus', complainant: false, officer: 'Request only', head: 'Approve / Req', admin: true },
    { capability: 'View analytics', complainant: false, officer: 'Scoped', head: 'Scoped', admin: 'Global' },
    { capability: 'Configure deadline SLAs', complainant: false, officer: false, head: 'Optional', admin: true },
    { capability: 'View audit history', complainant: 'Own cases', officer: 'Assigned', head: 'Bureau', admin: 'Global' },
    { capability: 'Manage users & roles', complainant: false, officer: false, head: 'Restricted', admin: true },
  ];

  const handleUpdateDuration = (ruleId: string, days: number) => {
    setDeadlineRules(rules => rules.map(r => r.id === ruleId ? { ...r, defaultDurationDays: days } : r));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!isPermitted) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4 bg-white border border-[#E6E1D8] rounded-lg mt-8">
        <div className="w-12 h-12 rounded-full bg-[#FDF0F0] border border-[#F5C2C4] text-[#9B2226] flex items-center justify-center mx-auto">
          <Lock size={22} />
        </div>
        <h3 className="text-base font-bold text-[#1F2421]">
          Role-Restricted Administration Portal
        </h3>
        <p className="text-xs text-[#5C6460] leading-relaxed">
          Your current active persona is <span className="font-semibold text-[#1F2421]">{currentPersona.roleLabel}</span>. In accordance with Section 3 RBAC policies, system administration and deadline configuration are restricted to <span className="font-semibold text-[#1B4532]">Apex Admin</span> and <span className="font-semibold text-[#1B4532]">Bureau Head</span>.
        </p>
        <p className="text-[11px] text-[#718096]">
          Tip: You can switch your active demo persona to <strong>Prof. R. K. Verma (Apex Admin)</strong> using the role switcher at the bottom of the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E6E1D8]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-[#1F2421]">
            System Administration & RBAC Engine
          </h2>
          <p className="text-xs text-[#5C6460] mt-0.5">
            AICTE governance parameters, SLA rules configuration, and role permission matrices
          </p>
        </div>

        <Badge role={currentPersona.role}>
          Authorized: {currentPersona.name}
        </Badge>
      </div>

      {/* Role & Permissions Matrix (PRD Section 3) */}
      <Card>
        <CardHeader
          title="Role Permissions & Access Control Matrix"
          subtitle="Enforced on the server and verified via cryptographic session tokens"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#E6E1D8] text-[11px] font-semibold text-[#5C6460] uppercase tracking-wider">
                <th className="py-3 px-4">Capability / Action</th>
                <th className="py-3 px-4 text-center">Complainant</th>
                <th className="py-3 px-4 text-center">Bureau Officer</th>
                <th className="py-3 px-4 text-center">Bureau Head</th>
                <th className="py-3 px-4 text-center bg-[#E8EFEA]/40 text-[#1B4532]">Apex Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6E1D8]">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-3 px-4 font-medium text-[#1F2421]">
                    {row.capability}
                  </td>

                  {/* Complainant */}
                  <td className="py-3 px-4 text-center">
                    {typeof row.complainant === 'boolean' ? (
                      row.complainant ? (
                        <Check size={16} className="text-[#1B4532] mx-auto" />
                      ) : (
                        <X size={16} className="text-[#A0AEC0] mx-auto" />
                      )
                    ) : (
                      <span className="font-mono text-[11px] text-[#5C6460]">{row.complainant}</span>
                    )}
                  </td>

                  {/* Bureau Officer */}
                  <td className="py-3 px-4 text-center">
                    {typeof row.officer === 'boolean' ? (
                      row.officer ? (
                        <Check size={16} className="text-[#1B4532] mx-auto" />
                      ) : (
                        <X size={16} className="text-[#A0AEC0] mx-auto" />
                      )
                    ) : (
                      <span className="font-mono text-[11px] text-[#5C6460]">{row.officer}</span>
                    )}
                  </td>

                  {/* Bureau Head */}
                  <td className="py-3 px-4 text-center">
                    {typeof row.head === 'boolean' ? (
                      row.head ? (
                        <Check size={16} className="text-[#1B4532] mx-auto" />
                      ) : (
                        <X size={16} className="text-[#A0AEC0] mx-auto" />
                      )
                    ) : (
                      <span className="font-mono text-[11px] text-[#5C6460]">{row.head}</span>
                    )}
                  </td>

                  {/* Apex Admin */}
                  <td className="py-3 px-4 text-center bg-[#E8EFEA]/20">
                    {typeof row.admin === 'boolean' ? (
                      row.admin ? (
                        <Check size={16} className="text-[#1B4532] mx-auto" />
                      ) : (
                        <X size={16} className="text-[#A0AEC0] mx-auto" />
                      )
                    ) : (
                      <span className="font-mono text-[11px] font-semibold text-[#1B4532]">{row.admin}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Configurable Deadline Rules */}
      <Card>
        <CardHeader
          title="Configurable SLA Duration & Escalation Rules"
          subtitle="Modify statutory default days by grievance classification"
          action={
            saveSuccess && (
              <span className="text-xs text-[#1B4532] font-semibold flex items-center gap-1">
                <Check size={14} /> Rule Saved & Audited
              </span>
            )
          }
        />
        <CardContent>
          <div className="space-y-4">
            {deadlineRules.map((rule) => (
              <div
                key={rule.id}
                className="p-3.5 bg-[#FAF8F5] border border-[#E6E1D8] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#1F2421]">{rule.categoryName}</span>
                    <Badge variant="forest">{rule.appliesToBureau.replace('_', ' ')}</Badge>
                  </div>
                  <p className="text-[11px] text-[#5C6460] mt-0.5">
                    Escalation recipient: <span className="font-medium text-[#1F2421]">{rule.escalationTarget}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[#718096]">SLA Target:</span>
                    <select
                      value={rule.defaultDurationDays}
                      onChange={(e) => handleUpdateDuration(rule.id, parseInt(e.target.value, 10))}
                      className="bg-white border border-[#D5CEC2] rounded-xs px-2 py-1 font-mono font-bold text-[#1F2421] focus:outline-none focus:border-[#1B4532]"
                    >
                      <option value={7}>7 Days (Express / Ragging)</option>
                      <option value={15}>15 Days (Admission)</option>
                      <option value={30}>30 Days (Standard SLA)</option>
                      <option value={45}>45 Days (Infrastructure Inspection)</option>
                      <option value={60}>60 Days (Comprehensive Audit)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
