import React, { useEffect } from 'react';
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
  Landmark,
  X
} from 'lucide-react';
import { NavigationTab, UserPersona } from '../../types';
import { SidebarBadges } from '../../utils/caseMetrics';

interface SidebarProps {
  activeTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  currentPersona: UserPersona;
  badges: SidebarBadges;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  currentPersona,
  badges,
  mobileOpen,
  onMobileClose,
}) => {
  // Handle Escape key on mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        onMobileClose();
      }
    };
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileOpen, onMobileClose]);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badgeCount?: number }[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <Home size={18} strokeWidth={1.8} />,
    },
    {
      id: 'complaints',
      label: 'Complaints',
      icon: <FolderArchive size={18} strokeWidth={1.8} />,
      badgeCount: badges.complaints, // Awaiting first action
    },
    {
      id: 'institutions',
      label: 'Institutions',
      icon: <Building size={18} strokeWidth={1.8} />,
    },
    {
      id: 'coordination',
      label: 'Coordination',
      icon: <Share2 size={18} strokeWidth={1.8} />,
      badgeCount: badges.coordination, // Pending overlap reviews
    },
    {
      id: 'deadlines',
      label: 'Deadline Queue',
      icon: <Clock size={18} strokeWidth={1.8} />,
      badgeCount: badges.deadlines, // Overdue + Due soon
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart2 size={18} strokeWidth={1.8} />,
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: <Award size={18} strokeWidth={1.8} />,
    },
    {
      id: 'administration',
      label: 'Administration',
      icon: <ShieldCheck size={18} strokeWidth={1.8} />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container: Exactly 295px width, dark forest green #09251F */}
      <aside
        id="app-sidebar"
        role="navigation"
        aria-label="Main Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-[295px] bg-[#09251F] text-[#E2EBE6] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } border-r border-[#143B30] select-none`}
      >
        <div>
          {/* Brand Header */}
          <div className="p-6 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#0D382B] border-2 border-[#165643] flex items-center justify-center text-white shrink-0 shadow-inner">
                <Landmark size={22} strokeWidth={1.7} />
              </div>
              <div className="leading-tight">
                <span className="text-[17px] font-bold tracking-tight text-white font-sans block">
                  AICTE CaseConnect
                </span>
                <span className="text-[10px] text-[#7B9B8E] mt-0.5 block max-w-[170px] leading-snug">
                  Complaint Monitoring & Resolution Platform
                </span>
              </div>
            </div>

            <button
              onClick={onMobileClose}
              className="lg:hidden text-[#7B9B8E] hover:text-white p-1.5 rounded-md hover:bg-white/10"
              aria-label="Close navigation"
            >
              <X size={18} />
            </button>
          </div>

          {/* Navigation List */}
          <nav className="px-4 py-2 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onMobileClose();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#154636] text-white shadow-xs font-semibold'
                      : 'text-[#8EA89D] hover:text-white hover:bg-[#0E342B]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-[#7B9B8E]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                    <span
                      title={`${item.badgeCount} items`}
                      className={`min-w-5 h-5 px-1.5 rounded-full text-[10.5px] font-mono font-bold flex items-center justify-center ${
                        item.id === 'deadlines'
                          ? 'bg-[#DC2626] text-white'
                          : 'bg-[#11382C] text-[#6DB19C]'
                      }`}
                    >
                      {item.badgeCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Active Persona Info & Prototype Notice (Duplicate switcher removed) */}
        <div className="p-5 pt-0 relative overflow-hidden">
          {/* Subtle watermark */}
          <div className="absolute right-4 bottom-14 opacity-15 pointer-events-none text-[#236853]">
            <svg width="100" height="60" viewBox="0 0 100 60" fill="currentColor">
              <path d="M50 4 L10 20 L90 20 Z" />
              <rect x="8" y="20" width="84" height="4" />
              <rect x="16" y="24" width="8" height="30" />
              <rect x="34" y="24" width="8" height="30" />
              <rect x="58" y="24" width="8" height="30" />
              <rect x="76" y="24" width="8" height="30" />
              <rect x="5" y="54" width="90" height="6" />
            </svg>
          </div>

          <div className="bg-[#0B2A21] border border-[#174637] rounded-xl p-3 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#123A2E] flex items-center justify-center text-[#7B9B8E] shrink-0 border border-[#1A4C3D] font-bold text-xs text-white">
                {currentPersona.avatarInitials}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] text-[#719284] uppercase tracking-wider font-medium block leading-none">
                  Logged in as
                </span>
                <div className="text-xs font-bold text-white mt-1 leading-tight truncate">
                  {currentPersona.name}
                </div>
                <div className="text-[10.5px] text-[#719284] leading-tight mt-0.5 truncate">
                  {currentPersona.roleLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-3 pt-2.5 border-t border-[#13372C] text-[10px] text-[#557669] flex flex-col gap-0.5 font-sans">
            <div className="flex items-center justify-between">
              <span>AICTE CaseConnect</span>
              <span className="font-mono">SIH 2026</span>
            </div>
            <span className="text-[#3E5C50] text-[9.5px]">Client-side Prototype Demo</span>
          </div>
        </div>
      </aside>
    </>
  );
};
