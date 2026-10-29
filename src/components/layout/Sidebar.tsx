import React from 'react';
import { 
  Home, 
  FolderArchive, 
  Building, 
  Share2, 
  Clock, 
  BarChart2, 
  Award, 
  ShieldCheck,
  User,
  ChevronDown,
  Landmark,
  X
} from 'lucide-react';
import { NavigationTab, UserPersona } from '../../types';
import { SYNTHETIC_PERSONAS } from '../../data/syntheticData';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  currentPersona: UserPersona;
  onPersonaChange: (persona: UserPersona) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentPersona,
  onPersonaChange,
  mobileOpen,
  onMobileClose,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home size={19} strokeWidth={1.8} />,
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: <FolderArchive size={19} strokeWidth={1.8} />,
      badge: '7',
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: <Building size={19} strokeWidth={1.8} />,
    },
    {
      id: 'coordination',
      label: 'Coordination',
      icon: <Share2 size={19} strokeWidth={1.8} />,
      badge: '1',
    },
    {
      id: 'deadlines',
      label: 'Deadline Queue',
      icon: <Clock size={19} strokeWidth={1.8} />,
      badge: '1',
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 size={19} strokeWidth={1.8} />,
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: <Award size={19} strokeWidth={1.8} />,
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: <ShieldCheck size={19} strokeWidth={1.8} />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar container: Exactly 295px width, dark forest green #09251F */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[295px] bg-[#09251F] text-[#E2EBE6] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-[#143B30] select-none`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              {/* Circular institutional emblem with classical columns */}
              <div className="w-11 h-11 rounded-full bg-[#0D382B] border-2 border-[#165643] flex items-center justify-center text-white shrink-0 shadow-inner">
                <Landmark size={22} strokeWidth={1.7} />
              </div>
              <div className="leading-tight">
                <h1 className="text-[17px] font-bold tracking-tight text-white font-sans">
                  AICTE CaseConnect
                </h1>
                <p className="text-[10px] text-[#7B9B8E] mt-0.5 max-w-[170px] leading-snug">
                  Institution-Related Complaint Monitoring & Resolution Platform
                </p>
              </div>
            </div>

            <button
              onClick={onMobileClose}
              className="lg:hidden text-[#7B9B8E] hover:text-white p-1 rounded-sm"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation List */}
          <nav className="px-4 py-2 space-y-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onMobileClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#154636] text-white shadow-xs font-semibold'
                      : 'text-[#8EA89D] hover:text-white hover:bg-[#0E342B]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-[#7B9B8E]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#11382C] text-[#6DB19C] text-[11px] font-mono font-medium flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Active Role & Footer */}
        <div className="p-5 pt-0 relative overflow-hidden">
          {/* Subtle institutional architectural columns silhouette watermark */}
          <div className="absolute right-4 bottom-14 opacity-15 pointer-events-none text-[#236853]">
            <svg width="110" height="70" viewBox="0 0 100 60" fill="currentColor">
              <path d="M50 4 L10 20 L90 20 Z" />
              <rect x="8" y="20" width="84" height="4" />
              <rect x="16" y="24" width="8" height="30" />
              <rect x="34" y="24" width="8" height="30" />
              <rect x="58" y="24" width="8" height="30" />
              <rect x="76" y="24" width="8" height="30" />
              <rect x="5" y="54" width="90" height="6" />
            </svg>
          </div>

          {/* Active Role Card */}
          <div className="relative z-10">
            <div
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="bg-[#0B2A21] border border-[#174637] rounded-xl p-3 flex items-center justify-between cursor-pointer hover:border-[#225A48] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#123A2E] flex items-center justify-center text-[#7B9B8E] shrink-0 border border-[#1A4C3D]">
                  <User size={16} />
                </div>
                <div>
                  <span className="text-[10px] text-[#719284] uppercase tracking-wider font-medium block leading-none">
                    Active Role
                  </span>
                  <div className="text-xs font-bold text-white mt-1 leading-tight">
                    {currentPersona.roleLabel}
                  </div>
                  <div className="text-[10.5px] text-[#719284] leading-tight mt-0.5">
                    Western Region
                  </div>
                </div>
              </div>
              <ChevronDown size={14} className={`text-[#719284] transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </div>

            {/* Role dropdown switcher */}
            {roleDropdownOpen && (
              <div className="absolute bottom-16 left-5 right-5 bg-[#071D17] border border-[#1B4A3B] rounded-xl p-2 shadow-2xl z-20 space-y-1">
                <span className="text-[10px] text-[#719284] uppercase font-mono px-2 block pt-1">
                  Switch Demo Persona:
                </span>
                {SYNTHETIC_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onPersonaChange(p);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                      currentPersona.id === p.id
                        ? 'bg-[#154636] text-white font-medium'
                        : 'text-[#8EA89D] hover:bg-[#0D3327] hover:text-white'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] opacity-75">{p.roleLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="mt-4 pt-3 border-t border-[#13372C] text-[11px] text-[#557669] flex flex-col gap-0.5 font-sans">
            <div>AICTE CaseConnect v1.0</div>
            <div>SIH 2026</div>
          </div>
        </div>
      </aside>
    </>
  );
};
