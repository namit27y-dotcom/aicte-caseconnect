import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Globe, 
  Info,
  Check,
  Save,
  Building
} from 'lucide-react';
import { UserPersona } from '../../types';

interface SettingsViewProps {
  currentPersona: UserPersona;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ currentPersona }) => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'NOTIFICATIONS' | 'SECURITY' | 'LANGUAGE' | 'ABOUT'>('GENERAL');
  const [orgName, setOrgName] = useState('AICTE');
  const [defaultRegion, setDefaultRegion] = useState('All India');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const menuItems = [
    { id: 'GENERAL', label: 'General', icon: <SettingsIcon size={15} /> },
    { id: 'NOTIFICATIONS', label: 'Notifications', icon: <Bell size={15} /> },
    { id: 'SECURITY', label: 'Security', icon: <Shield size={15} /> },
    { id: 'LANGUAGE', label: 'Language', icon: <Globe size={15} /> },
    { id: 'ABOUT', label: 'About', icon: <Info size={15} /> },
  ];

  return (
    <div className="space-y-4 select-none pb-6">
      {/* 1. Top Section Header with Gears Banner from Reference Image 1 */}
      <div className="bg-white border border-[#E7E4DB] rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs relative overflow-hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#252D27] font-heading">
            Settings
          </h1>
          <p className="text-xs text-[#737A72] mt-0.5">
            Configure application
          </p>
        </div>
      </div>

      {/* 2. Settings Layout Matching PDF Page 5: Left Menu Tabs, Right Form + Image Card */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 bg-white border border-[#E7E4DB] rounded-xl p-5 shadow-2xs">
        {/* Left Settings Sidebar Tabs (3 cols) */}
        <div className="md:col-span-3 space-y-1 border-r border-[#F7F5EF] pr-4">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-[#193B2A] text-white font-semibold'
                    : 'text-[#737A72] hover:bg-[#F7F5EF] hover:text-[#252D27]'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Settings Form and Preview Card from PDF Page 5 (9 cols) */}
        <div className="md:col-span-9 flex flex-col justify-between pl-0 md:pl-2">
          <div className="space-y-5">
            <div>
              <h2 className="text-[15px] font-semibold text-[#252D27] font-heading">
                General Settings
              </h2>
              <p className="text-xs text-[#737A72] mt-0.5">
                Configure basic application settings
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Form Inputs (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#252D27] mb-1.5">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#E7E4DB] rounded-lg text-xs text-[#252D27] focus:outline-none focus:border-[#193B2A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#252D27] mb-1.5">
                    Default Region
                  </label>
                  <select
                    value={defaultRegion}
                    onChange={(e) => setDefaultRegion(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#E7E4DB] rounded-lg text-xs text-[#252D27] bg-white focus:outline-none focus:border-[#193B2A]"
                  >
                    <option>All India</option>
                    <option>Northern Region</option>
                    <option>Western Region</option>
                    <option>Southern Region</option>
                    <option>Eastern Region</option>
                  </select>
                </div>
              </div>

              {/* Reference Institutional Photography Card from PDF Page 5 (5 cols) */}
              <div className="lg:col-span-5 rounded-xl overflow-hidden border border-[#E7E4DB] shadow-2xs">
                <img
                  src="/assets/hero-building.jpg"
                  alt="AICTE Institutional Headquarters"
                  className="w-full h-32 object-cover object-center"
                />
                <div className="p-2.5 bg-[#F7F5EF] text-[11px] text-[#737A72]">
                  <span className="font-semibold text-[#252D27] block">AICTE Headquarters</span>
                  <span>Nelson Mandela Marg, New Delhi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons as in PDF: Save Changes | Cancel */}
          <div className="pt-6 border-t border-[#F7F5EF] flex items-center justify-end gap-2.5">
            {savedSuccess && (
              <span className="text-xs text-[#4F8064] font-medium flex items-center gap-1 mr-2">
                <Check size={14} /> Saved successfully
              </span>
            )}
            <button
              onClick={() => alert('Settings reset to default.')}
              className="px-3.5 py-1.5 border border-[#E7E4DB] rounded-lg text-xs font-medium text-[#737A72] hover:bg-[#F7F5EF] cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 bg-[#193B2A] hover:bg-[#142B21] text-white rounded-lg text-xs font-medium cursor-pointer shadow-2xs"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

