import React from 'react';
import { 
  Building, 
  Share2, 
  Clock, 
  BarChart2, 
  Award, 
  ShieldCheck,
  X,
  LayoutDashboard,
  FolderOpen,
  Settings,
  AlertTriangle,
  Users,
  Database,
  Building2,
  ChevronDown
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
  React.useEffect(() => {
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

  // Navigation modules grouped by section matching Reference Image 1 & 2
  const navSections: {
    sectionTitle?: string;
    items: { id: NavigationTab; label: string; icon: React.ReactNode; badgeCount?: number }[];
  }[] = [
    {
      items: [
        {
          id: 'overview',
          label: 'Overview',
          icon: <LayoutDashboard size={16} strokeWidth={1.8} />,
        },
        {
          id: 'institutions',
          label: 'Institutions',
          icon: <Building2 size={16} strokeWidth={1.8} />,
        },
        {
          id: 'complaints',
          label: 'Complaints',
          icon: <FolderOpen size={16} strokeWidth={1.8} />,
          badgeCount: badges.complaints || 9,
        },
        {
          id: 'coordination',
          label: 'Overlap Intelligence',
          icon: <Share2 size={16} strokeWidth={1.8} />,
          badgeCount: badges.coordination || 2,
        },
        {
          id: 'coordination',
          label: 'Coordination Centre',
          icon: <Share2 size={16} strokeWidth={1.8} />,
          badgeCount: 2,
        },
      ],
    },
    {
      sectionTitle: 'MONITORING',
      items: [
        {
          id: 'deadlines',
          label: 'Alerts & SLA',
          icon: <AlertTriangle size={16} strokeWidth={1.8} />,
          badgeCount: badges.deadlines || 5,
        },
        {
          id: 'analytics',
          label: 'Analytics & Reports',
          icon: <BarChart2 size={16} strokeWidth={1.8} />,
        },
      ],
    },
    {
      sectionTitle: 'ADMINISTRATION',
      items: [
        {
          id: 'administration',
          label: 'Users & Officers',
          icon: <Users size={16} strokeWidth={1.8} />,
        },
        {
          id: 'administration',
          label: 'Data Management',
          icon: <Database size={16} strokeWidth={1.8} />,
        },
        {
          id: 'audit',
          label: 'Audit Logs',
          icon: <Award size={16} strokeWidth={1.8} />,
        },
        {
          id: 'settings',
          label: 'Settings',
          icon: <Settings size={16} strokeWidth={1.8} />,
        },
      ],
    },
  ];

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar matching Reference Image 1 & 2 */}
      <aside
        id="app-sidebar"
        role="navigation"
        aria-label="Main Navigation"
        className={`fixed inset-y-0 left-0 z-50 w-[240px] bg-[#142B21] text-[#F7F5EF] flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } border-r border-[#193B2A] select-none`}
      >
        <div>
          {/* Brand Header with Cropped AICTE Official Logo */}
          <div className="p-3.5 pt-4 pb-3 flex items-center justify-between border-b border-[#193B2A]/70">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 p-0.5">
                <img 
                  src="/assets/aicte-logo.png" 
                  alt="AICTE Logo" 
                  className="w-full h-full object-contain filter drop-shadow-sm"
                />
              </div>
              <div className="leading-tight">
                <span className="text-[14px] font-bold tracking-tight text-white font-heading block">
                  AICTE
                </span>
                <span className="text-[10px] text-[#C5A568] font-medium tracking-wide block">
                  CaseConnect
                </span>
              </div>
            </div>

            <button
              onClick={onMobileClose}
              className="lg:hidden text-[#829B86] hover:text-white p-1 rounded-md hover:bg-white/10"
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
          </div>

          {/* Navigation Section */}
          <nav className="px-2 pt-2 pb-2 space-y-3">
            {navSections.map((section, sIndex) => (
              <div key={sIndex} className="space-y-0.5">
                {section.sectionTitle && (
                  <div className="px-2.5 pt-2 pb-1 text-[9.5px] font-bold tracking-wider text-[#829B86]/70 uppercase font-sans">
                    {section.sectionTitle}
                  </div>
                )}
                {section.items.map((item, index) => {
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={`${item.label}-${index}`}
                      onClick={() => {
                        onTabChange(item.id);
                        onMobileClose();
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#193B2A] text-white shadow-2xs font-semibold'
                          : 'text-[#829B86] hover:text-white hover:bg-[#193B2A]/40'
                      }`}
                      aria-current={isActive ? 'page' : undefined}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-[#C5A568]' : 'text-[#829B86]'}>
                          {item.icon}
                        </span>
                        <span className="truncate">{item.label}</span>
                      </div>

                      {typeof item.badgeCount === 'number' && item.badgeCount > 0 && (
                        <span
                          title={`${item.badgeCount} items`}
                          className={`min-w-4 h-4 px-1 rounded-full text-[9.5px] font-mono font-bold flex items-center justify-center ${
                            item.label.includes('Alert') || item.label.includes('SLA')
                              ? 'bg-[#C58B3B] text-white'
                              : 'bg-[#C5A568]/20 text-[#C5A568]'
                          }`}
                        >
                          {item.badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Section: Active Persona Profile with Dropdown Chevron & Lotus Accent */}
        <div className="p-2.5 border-t border-[#193B2A]/60 relative overflow-hidden">
          <div className="bg-[#193B2A]/60 border border-[#193B2A] rounded-lg p-2 flex items-center justify-between cursor-pointer hover:bg-[#193B2A] transition-colors relative z-10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#142B21] border border-[#C5A568]/40 flex items-center justify-center text-[#C5A568] font-bold text-[10px] shrink-0">
                {currentPersona.avatarInitials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-white leading-tight truncate">
                  {currentPersona.name}
                </div>
                <div className="text-[9.5px] text-[#829B86] leading-tight mt-0.5 truncate">
                  {currentPersona.roleLabel}
                </div>
              </div>
            </div>
            <ChevronDown size={13} className="text-[#829B86] shrink-0" />
          </div>

          {/* Institutional Subtle Lotus Watermark Contour */}
          <div className="pt-2 flex justify-center opacity-25 pointer-events-none select-none">
            <svg width="48" height="24" viewBox="0 0 100 50" fill="none" stroke="#C5A568" strokeWidth="1.5">
              <path d="M50 45 C40 30, 20 25, 10 35 C20 15, 40 20, 50 45 Z" />
              <path d="M50 45 C60 30, 80 25, 90 35 C80 15, 60 20, 50 45 Z" />
              <path d="M50 45 C35 25, 30 10, 50 5 C70 10, 65 25, 50 45 Z" />
              <circle cx="50" cy="5" r="2" fill="#C5A568" />
            </svg>
          </div>
        </div>
      </aside>
    </>
  );
};
