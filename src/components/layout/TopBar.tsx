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
  X,
  Plus,
  Home,
  ChevronDown
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
  const notificationsContainerRef = useRef<HTMLDivElement>(null);
  const roleMenuContainerRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setSearchDropdownOpen(false);
      }
      if (
        notificationsContainerRef.current &&
        !notificationsContainerRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }
      if (
        roleMenuContainerRef.current &&
        !roleMenuContainerRef.current.contains(target)
      ) {
        setRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifications = notifications.filter(
    (n) => !readNotificationIds.has(n.id)
  );

  const matchingComplaints = searchQuery.trim()
    ? complaints.filter((c) => {
        const q = searchQuery.toLowerCase();
        return (
          c.trackingNumber.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.categoryLabel.toLowerCase().includes(q)
        );
      }).slice(0, 5)
    : [];

  const tabTitles: Record<NavigationTab, string> = {
    overview: 'Overview',
    institutions: 'Institutions',
    complaints: 'Complaints',
    overlap: 'Overlap Intelligence',
    coordination: 'Coordination Centre',
    deadlines: 'Alerts & SLA',
    analytics: 'Analytics & Reports',
    administration: 'Users & Officers',
    data_management: 'Data Management',
    audit: 'Audit Logs',
    settings: 'Settings',
  };

  return (
    <header className="h-12 bg-white border-b border-[#E7E4DB] px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 select-none shadow-2xs">
      {/* Left: Home Icon + Section Title from Reference Image 1 & 2 */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-1 text-[#737A72] hover:text-[#252D27] rounded hover:bg-[#F7F5EF] cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu size={16} />
        </button>

        <div className="flex items-center gap-1.5 text-xs text-[#252D27]">
          <Home size={13} className="text-[#737A72]" />
          <span className="text-[13px] font-semibold text-[#252D27] font-heading">
            {tabTitles[activeTab]}
          </span>
        </div>
      </div>

      {/* Center: Search pill exactly like Image 1: [Search icon] Search cases, institutions... [Ctrl K] */}
      <div ref={searchContainerRef} className="flex-1 max-w-sm relative hidden md:block">
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#737A72]"
          />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search cases, institutions..."
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              setSearchDropdownOpen(true);
            }}
            onFocus={() => setSearchDropdownOpen(true)}
            className="w-full bg-[#F7F5EF] border border-[#E7E4DB] rounded-full pl-8 pr-12 py-1 text-[11.5px] text-[#252D27] placeholder-[#737A72] focus:outline-none focus:border-[#174B38] transition-all"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1 py-0.2 text-[9px] font-mono text-[#737A72] bg-white border border-[#E7E4DB] rounded shadow-2xs">
            Ctrl K
          </kbd>
        </div>

        {/* Global Search Results Dropdown */}
        {searchDropdownOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E7E4DB] rounded-xl shadow-xl overflow-hidden z-50">
            <div className="p-2 border-b border-[#F7F5EF] flex items-center justify-between text-[11px] font-semibold text-[#737A72]">
              <span>Results ({matchingComplaints.length})</span>
              <button
                onClick={() => setSearchDropdownOpen(false)}
                className="text-[#737A72] hover:text-[#252D27]"
              >
                <X size={12} />
              </button>
            </div>

            {matchingComplaints.length === 0 ? (
              <div className="p-3 text-center text-xs text-[#737A72]">
                No matching records
              </div>
            ) : (
              <div className="divide-y divide-[#F7F5EF] max-h-72 overflow-y-auto">
                {matchingComplaints.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectComplaint(c);
                      setSearchDropdownOpen(false);
                    }}
                    className="p-2.5 hover:bg-[#F7F5EF] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-[#174B38]">
                        {c.trackingNumber}
                      </span>
                      <StatusBadge status={c.status} size="sm" />
                    </div>
                    <div className="text-xs font-medium text-[#252D27] mt-0.5 truncate">
                      {c.institutionName}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Bell with Red Badge + Persona Pill */}
      <div className="flex items-center gap-3">
        {/* Bell with red badge & notification dropdown */}
        <div ref={notificationsContainerRef} className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={`p-1.5 rounded-full text-[#737A72] hover:text-[#252D27] hover:bg-[#F7F5EF] relative cursor-pointer transition-colors ${
              notificationsOpen ? 'bg-[#F7F5EF] text-[#252D27]' : ''
            }`}
            aria-label="View notifications"
          >
            <Bell size={16} />
            {unreadNotifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#B94F45] text-white text-[8.5px] font-mono font-bold flex items-center justify-center shadow-2xs">
                {unreadNotifications.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Popover */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E8E2D6] rounded-xl shadow-xl p-3 z-50">
              {/* Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#F7F5EF] mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#172B24] font-serif">
                    Notifications &amp; Alerts
                  </span>
                  {unreadNotifications.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded text-[9.5px] font-bold bg-[#B94F45]/10 text-[#B94F45] border border-[#B94F45]/20 font-mono">
                      {unreadNotifications.length} new
                    </span>
                  )}
                </div>
                {unreadNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={onMarkAllNotificationsRead}
                    className="text-[11px] text-[#174B38] hover:underline font-medium cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification Items */}
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-0.5">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#78847D]">
                    No active notifications or alerts.
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const isUnread = !readNotificationIds.has(notif.id);
                    const iconMap = {
                      danger: <AlertTriangle size={15} className="text-[#B94F45] shrink-0 mt-0.5" />,
                      warning: <GitMerge size={15} className="text-[#C58B3B] shrink-0 mt-0.5" />,
                      info: <FileText size={15} className="text-[#174B38] shrink-0 mt-0.5" />,
                    };

                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          onNotificationClick(notif);
                          setNotificationsOpen(false);
                        }}
                        className={`p-2.5 rounded-lg border text-left text-xs flex gap-2.5 cursor-pointer transition-all ${
                          isUnread
                            ? 'bg-[#F7F5EF]/80 border-[#E8E2D6] hover:bg-[#F7F5EF] shadow-2xs'
                            : 'bg-white border-[#F7F5EF] opacity-75 hover:opacity-100 hover:bg-[#F7F5EF]/40'
                        }`}
                      >
                        {iconMap[notif.severity]}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className={`font-semibold leading-tight truncate ${isUnread ? 'text-[#172B24]' : 'text-[#78847D]'}`}>
                              {notif.title}
                            </span>
                            {isUnread && (
                              <span className="w-1.5 h-1.5 rounded-full bg-[#174B38] shrink-0" />
                            )}
                          </div>
                          <p className="text-[11px] text-[#78847D] mt-0.5 leading-snug line-clamp-2">
                            {notif.message}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="pt-2.5 border-t border-[#F7F5EF] mt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onNavigateTab('deadlines');
                    setNotificationsOpen(false);
                  }}
                  className="text-[11px] text-[#174B38] hover:underline font-semibold cursor-pointer"
                >
                  View Statutory SLA Deadlines →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Persona Pill from Image 1: [AK Circle] Aashish Kumar v */}
        <div ref={roleMenuContainerRef} className="relative">
          <button
            onClick={() => setRoleMenuOpen(!roleMenuOpen)}
            className="flex items-center gap-1.5 pl-0.5 pr-1.5 py-0.5 rounded-full hover:bg-[#F7F5EF] cursor-pointer transition-colors text-xs"
          >
            <div className="w-6 h-6 rounded-full bg-[#252D27] text-white flex items-center justify-center font-bold text-[9.5px]">
              {currentPersona.avatarInitials}
            </div>
            <span className="font-medium text-[#252D27] text-[12px] truncate max-w-[110px]">
              {currentPersona.name}
            </span>
            <ChevronDown size={12} className="text-[#737A72]" />
          </button>

          {roleMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E7E4DB] rounded-xl shadow-xl p-1.5 z-50">
              <div className="px-2 py-1 border-b border-[#F7F5EF] mb-1">
                <span className="text-[10px] font-bold text-[#737A72] uppercase tracking-wider block">
                  Switch Active Persona
                </span>
              </div>
              <div className="space-y-0.5">
                {SYNTHETIC_PERSONAS.map((p) => {
                  const isSelected = p.id === currentPersona.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        onPersonaChange(p);
                        setRoleMenuOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-md text-xs flex items-center justify-between cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#174B38] text-white font-medium'
                          : 'text-[#252D27] hover:bg-[#F7F5EF]'
                      }`}
                    >
                      <div>
                        <div className="font-medium leading-tight">{p.name}</div>
                        <div className="text-[10px] text-[#737A72]">{p.roleLabel}</div>
                      </div>
                      {isSelected && <CheckCircle2 size={12} className="text-[#D5A64A]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
