import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Bell, 
  ChevronsUpDown, 
  User, 
  Menu,
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  GitMerge,
  FileText,
  X
} from 'lucide-react';
import { NavigationTab, UserPersona, Complaint } from '../../types';
import { SYNTHETIC_PERSONAS } from '../../data/syntheticData';
import { DerivedNotification } from '../../utils/caseMetrics';
import { StatusBadge } from '../ui/StatusBadge';

interface TopBarProps {
  activeTab: NavigationTab;
  currentPersona: UserPersona;
  complaints: Complaint[];
  notifications: DerivedNotification[];
  readNotificationIds: Set<string>;
  onMarkAllNotificationsRead: () => void;
  onNotificationClick: (notification: DerivedNotification) => void;
  onOpenMobileSidebar: () => void;
  onOpenNewComplaint: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onPersonaChange: (persona: UserPersona) => void;
  onSelectComplaint: (complaint: Complaint) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeTab,
  currentPersona,
  complaints,
  notifications,
  readNotificationIds,
  onMarkAllNotificationsRead,
  onNotificationClick,
  onOpenMobileSidebar,
  onOpenNewComplaint,
  searchQuery,
  onSearchChange,
  onPersonaChange,
  onSelectComplaint,
  onNavigateTab,
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        setSearchDropdownOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchDropdownOpen(false);
        setNotificationsOpen(false);
        setRoleMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter complaints for search dropdown
  const searchResults = searchQuery.trim()
    ? complaints.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.trackingNumber.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q)
        );
      }).slice(0, 6)
    : [];

  const unreadNotifications = notifications.filter(
    (n) => !readNotificationIds.has(n.id)
  );

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchDropdownOpen(false);
      onNavigateTab('complaints');
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#E8EAE6] px-4 sm:px-6 py-3 select-none">
      <div className="flex items-center justify-between gap-3 sm:gap-4">
        {/* Left: Mobile trigger & Global Search */}
        <div ref={searchContainerRef} className="relative flex items-center gap-2.5 flex-1 max-w-xl">
          <button
            onClick={onOpenMobileSidebar}
            className="lg:hidden p-1.5 text-[#4A5568] hover:text-[#1F2421] hover:bg-black/5 rounded-md"
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>

          {/* Search Box */}
          <div className="relative flex items-center w-full">
            <Search size={15} className="absolute left-3.5 text-[#94A3B8] pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search tracking no, institution, grievance keyword... (Ctrl+K)"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setSearchDropdownOpen(true);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setSearchDropdownOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              className="w-full bg-[#FFFFFF] border border-[#DFE3DC] rounded-lg pl-10 pr-20 py-2 text-xs text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#154636] focus:ring-1 focus:ring-[#154636] transition-all"
              aria-label="Global grievance search"
            />
            {/* Keyboard shortcut hint */}
            <div className="absolute right-2.5 hidden sm:flex items-center gap-1 pointer-events-none">
              <span className="bg-[#F4F5F1] text-[#64748B] text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-[#DFE3DC]">
                Ctrl
              </span>
              <span className="bg-[#F4F5F1] text-[#64748B] text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-[#DFE3DC]">
                K
              </span>
            </div>
          </div>

          {/* Global Search Results Dropdown */}
          {searchDropdownOpen && searchQuery.trim() && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-2 z-50 text-xs">
              <div className="px-2.5 py-1 text-[10.5px] font-semibold text-[#64748B] uppercase border-b border-[#F1F5F9] flex items-center justify-between">
                <span>Matching Grievances ({searchResults.length})</span>
                <span className="font-normal lowercase">press Enter to view all</span>
              </div>

              {searchResults.length === 0 ? (
                <div className="py-4 text-center text-[#718096]">
                  No complaints found matching "{searchQuery}".
                </div>
              ) : (
                <div className="divide-y divide-[#F1F5F9] max-h-72 overflow-y-auto">
                  {searchResults.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        onSelectComplaint(c);
                        setSearchDropdownOpen(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-[#FAF8F5] rounded-md transition-colors flex items-start justify-between gap-3 cursor-pointer group"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#1B4532]">
                            {c.trackingNumber}
                          </span>
                          <span className="font-semibold text-[#1F2421] truncate">
                            {c.institutionName}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#5C6460] truncate mt-0.5">
                          {c.title}
                        </p>
                      </div>
                      <div className="shrink-0 pt-0.5">
                        <StatusBadge status={c.status} size="sm" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Section: Role Selector, Notification Bell, User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Role selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#DFE3DC] text-xs font-medium text-[#1E293B] hover:bg-[#F9FAF8] transition-colors cursor-pointer"
              aria-label={`Switch persona. Current: ${currentPersona.roleLabel}`}
            >
              <User size={13} className="text-[#64748B]" />
              <span className="hidden sm:inline">{currentPersona.roleLabel}</span>
              <span className="sm:hidden">{currentPersona.name.split(' ')[0]}</span>
              <ChevronsUpDown size={13} className="text-[#94A3B8]" />
            </button>

            {roleMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-1.5 z-50 space-y-0.5">
                <div className="text-[10px] font-semibold text-[#64748B] uppercase px-2.5 py-1">
                  Switch Persona (Role Simulation)
                </div>
                {SYNTHETIC_PERSONAS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onPersonaChange(p);
                      setRoleMenuOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-2 rounded-lg text-xs flex flex-col ${
                      currentPersona.id === p.id
                        ? 'bg-[#EBF5EE] text-[#1B4332] font-semibold'
                        : 'text-[#334155] hover:bg-[#F8FAF9]'
                    }`}
                  >
                    <span>{p.name}</span>
                    <span className="text-[10.5px] text-[#64748B] font-normal">{p.roleLabel}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Derived Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-[#475569] hover:text-[#0F172A] hover:bg-[#F1F3EE] transition-colors relative cursor-pointer"
              aria-label={`View notifications. ${unreadNotifications.length} unread.`}
            >
              <Bell size={18} />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full bg-[#DC2626] text-white text-[9.5px] font-bold flex items-center justify-center shadow-xs">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-xl shadow-2xl p-3 z-50 text-xs space-y-2.5">
                <div className="flex items-center justify-between font-semibold text-[#0F172A] border-b border-[#F1F5F9] pb-2">
                  <span>
                    Notifications ({unreadNotifications.length} unread)
                  </span>
                  {unreadNotifications.length > 0 && (
                    <button
                      type="button"
                      onClick={onMarkAllNotificationsRead}
                      className="text-[11px] text-[#154636] font-semibold hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-4 text-center text-[#718096]">
                      No active alerts or notices.
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const isUnread = !readNotificationIds.has(notif.id);
                      const iconMap = {
                        danger: <AlertTriangle size={14} className="text-[#DC2626] shrink-0 mt-0.5" />,
                        warning: <GitMerge size={14} className="text-[#D97706] shrink-0 mt-0.5" />,
                        info: <FileText size={14} className="text-[#2563EB] shrink-0 mt-0.5" />,
                      };

                      return (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onNotificationClick(notif);
                            setNotificationsOpen(false);
                          }}
                          className={`p-2.5 rounded-lg border text-left text-xs flex gap-2.5 cursor-pointer transition-colors ${
                            isUnread
                              ? 'bg-[#FAF8F5] border-[#D5CEC2] font-medium'
                              : 'bg-white border-[#F1F5F9] opacity-75'
                          }`}
                        >
                          {iconMap[notif.severity]}
                          <div className="flex-1 min-w-0">
                            <span className="font-bold text-[#1F2421] block leading-tight">
                              {notif.title}
                            </span>
                            <p className="text-[11px] text-[#5C6460] mt-0.5 leading-snug">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User profile initials */}
          <div className="w-9 h-9 rounded-full bg-[#133A2E] text-white font-bold text-xs flex items-center justify-center shadow-xs shrink-0">
            {currentPersona.avatarInitials}
          </div>
        </div>
      </div>
    </header>
  );
};
