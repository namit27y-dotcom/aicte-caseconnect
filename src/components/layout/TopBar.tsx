import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronsUpDown, 
  User, 
  Menu,
  CheckCircle2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { NavigationTab, UserPersona } from '../../types';
import { SYNTHETIC_PERSONAS } from '../../data/syntheticData';

interface TopBarProps {
  activeTab: NavigationTab;
  currentPersona: UserPersona;
  onOpenMobileSidebar: () => void;
  onOpenNewComplaint: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPersonaChange?: (persona: UserPersona) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  currentPersona,
  onOpenMobileSidebar,
  onOpenNewComplaint,
  searchQuery,
  onSearchChange,
  onPersonaChange,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8EAE6] px-6 py-3.5 select-none">
      <div className="flex items-center justify-between gap-4">
        {/* Left: Mobile trigger & Global Search */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 text-[#4A5568] hover:text-[#1F2421] hover:bg-black/5 rounded-md"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Search Box with Ctrl K */}
          <div className="relative flex items-center w-full">
            <Search size={15} className="absolute left-3.5 text-[#94A3B8] pointer-events-none" />
            <input
              type="text"
              placeholder="Search by tracking no, institution, keyword..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-[#FFFFFF] border border-[#DFE3DC] rounded-lg pl-10 pr-20 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#154636] focus:ring-1 focus:ring-[#154636] transition-all"
            />
            {/* Keyboard shortcut hint */}
            <div className="absolute right-2.5 flex items-center gap-1 pointer-events-none">
              <span className="bg-[#F4F5F1] text-[#64748B] text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-[#DFE3DC]">
                Ctrl
              </span>
              <span className="bg-[#F4F5F1] text-[#64748B] text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-[#DFE3DC]">
                K
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Role Selector, Notification Bell, User Avatar */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Role selector button */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#DFE3DC] text-xs font-medium text-[#1E293B] hover:bg-[#F9FAF8] transition-colors cursor-pointer"
            >
              <User size={13} className="text-[#64748B]" />
              <span>{currentPersona.roleLabel}</span>
              <ChevronsUpDown size={13} className="text-[#94A3B8]" />
            </button>

            {roleMenuOpen && onPersonaChange && (
              <div className="absolute right-0 top-full mt-1.5 w-56 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-40 space-y-0.5">
                <div className="text-[10px] font-semibold text-[#64748B] uppercase px-2 py-1">
                  Select Role Persona
                </div>
                {SYNTHETIC_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onPersonaChange(p);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex flex-col ${
                      currentPersona.id === p.id
                        ? 'bg-[#EBF5EE] text-[#1B4332] font-semibold'
                        : 'text-[#334155] hover:bg-[#F8FAF9]'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10px] text-[#64748B] font-normal">{p.roleLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notification Bell with red badge '3' */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F3EE] transition-colors relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#DC2626] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs">
                3
              </span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-3 z-40 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-semibold text-[#0F172A] border-b border-[#F1F5F9] pb-2">
                  <span>Notifications (3 unread)</span>
                  <span className="text-[11px] text-[#0F766E] font-medium cursor-pointer">Mark all read</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 bg-[#FEF2F2] border border-[#FEE2E2] rounded-lg text-[#991B1B] text-[11px] flex gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5 text-[#DC2626]" />
                    <div>
                      <span className="font-semibold block">SLA Exceeded Alert</span>
                      CC-2026-000098 at National Polytechnic is overdue.
                    </div>
                  </div>
                  <div className="p-2 bg-[#F0FDF4] border border-[#DCFCE7] rounded-lg text-[#166534] text-[11px] flex gap-2">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-[#16A34A]" />
                    <div>
                      <span className="font-semibold block">Overlap Verified</span>
                      Western Tech candidate confirmed with Finance Bureau.
                    </div>
                  </div>
                  <div className="p-2 bg-[#F8FAFC] border border-[#F1F5F9] rounded-lg text-[#334155] text-[11px] flex gap-2">
                    <Clock size={14} className="shrink-0 mt-0.5 text-[#64748B]" />
                    <div>
                      <span className="font-semibold block">Triage Queue Updated</span>
                      Sunrise Engineering College complaint logged.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile avatar & info */}
          <div className="flex items-center gap-2.5 pl-1 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-[#133A2E] text-white font-bold text-xs flex items-center justify-center shadow-sm">
              {currentPersona.avatarInitials}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <div className="text-xs font-bold text-[#0F172A]">
                {currentPersona.name}
              </div>
              <div className="text-[10.5px] text-[#64748B]">
                {currentPersona.roleLabel}
              </div>
            </div>
            <ChevronDown size={14} className="text-[#94A3B8] hidden sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
};
