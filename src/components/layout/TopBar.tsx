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
    coordination: 'Overlap Intelligence',
    deadlines: 'Alerts & SLA',
    analytics: 'Analytics & Reports',
    administration: 'Users & Officers',
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
            className="w-full bg-[#F7F5EF] border border-[#E7E4DB] rounded-full pl-8 pr-12 py-1 text-[11.5px] text-[#252D27] placeholder-[#737A72] focus:outline-none focus:border-[#193B2A] transition-all"
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
                      <span className="font-mono text-xs font-bold text-[#193B2A]">
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

      {/* Right: Bell with Red Badge [0/5] + Persona Pill [AK] Aashish Kumar v */}
      <div className="flex items-center gap-3">
        {/* Bell with red badge */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-1 text-[#737A72] hover:text-[#252D27] relative cursor-pointer"
            aria-label="View notifications"
          >
            <Bell size={16} />
            <span className="absolute -top-1 -right-1.5 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#B94F45] text-white text-[8.5px] font-mono font-bold flex items-center justify-center">
              {unreadNotifications.length || 5}
            </span>
          </button>
        </div>

        {/* Persona Pill from Image 1: [AK Circle] Aashish Kumar v */}
        <div className="relative">
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
                          ? 'bg-[#193B2A] text-white font-medium'
                          : 'text-[#252D27] hover:bg-[#F7F5EF]'
                      }`}
                    >
                      <div>
                        <div className="font-medium leading-tight">{p.name}</div>
                        <div className="text-[10px] text-[#737A72]">{p.roleLabel}</div>
                      </div>
                      {isSelected && <CheckCircle2 size={12} className="text-[#C5A568]" />}
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
