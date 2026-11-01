import React from 'react';
import {
  Home,
  MessageSquarePlus,
  Store,
  History,
  HelpCircle,
  Lightbulb,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  X,
} from 'lucide-react';
import { BusinessProfile } from '../types/complaint';

export type NavTab = 'beranda' | 'tangani' | 'profil' | 'riwayat' | 'bantuan';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  businessProfile: BusinessProfile;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  businessProfile,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'beranda' as NavTab, label: 'Beranda', icon: Home },
    { id: 'tangani' as NavTab, label: 'Tangani Komplain', icon: MessageSquarePlus, badge: 'AI Siaga' },
    { id: 'profil' as NavTab, label: 'Profil Bisnis', icon: Store },
    { id: 'riwayat' as NavTab, label: 'Riwayat Komplain', icon: History },
    { id: 'bantuan' as NavTab, label: 'Bantuan & SOP', icon: HelpCircle },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-[#E9E8F0] flex flex-col justify-between transition-transform duration-300 ease-in-out shrink-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Area: Logo & Navigation */}
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="p-5 flex items-center justify-between border-b border-slate-100/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#7047EB] text-white flex items-center justify-center shadow-md shadow-[#7047EB]/25">
                {/* Friendly speech bubble icon with smile */}
                <svg
                  className="w-6 h-6 fill-current"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 2C6.477 2 2 6.03 2 11C2 13.565 3.208 15.864 5.156 17.433C4.945 18.675 4.34 19.989 3.272 21.057C3.064 21.265 3.09 21.606 3.328 21.782C3.513 21.919 3.766 21.942 3.974 21.841C6.241 20.732 8.077 19.866 9.155 19.467C10.063 19.816 11.018 20 12 20C17.523 20 22 15.97 22 11C22 6.03 17.523 2 12 2Z"
                    fill="currentColor"
                  />
                  <path
                    d="M8.5 10.5C9.05228 10.5 9.5 10.0523 9.5 9.5C9.5 8.94772 9.05228 8.5 8.5 8.5C7.94772 8.5 7.5 8.94772 7.5 9.5C7.5 10.0523 7.94772 10.5 8.5 10.5Z"
                    fill="#F2EDFF"
                  />
                  <path
                    d="M15.5 10.5C16.0523 10.5 16.5 10.0523 16.5 9.5C16.5 8.94772 16.0523 8.5 15.5 8.5C14.9477 8.5 14.5 8.94772 14.5 9.5C14.5 10.0523 14.9477 10.5 15.5 10.5Z"
                    fill="#F2EDFF"
                  />
                  <path
                    d="M8.5 13C9.2 14.2 10.4 15 12 15C13.6 15 14.8 14.2 15.5 13"
                    stroke="#F2EDFF"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <h1 className="font-extrabold text-slate-800 text-lg tracking-tight leading-tight">
                  Sabarin<span className="text-[#7047EB]">.ai</span>
                </h1>
                <p className="text-[11px] font-medium text-slate-400">
                  Asisten Krisis UMKM
                </p>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3.5 space-y-1.5 flex-1">
            <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Menu Utama
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group text-left ${
                    isActive
                      ? 'bg-[#F2EDFF] text-[#7047EB] shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? 'text-[#7047EB]' : 'text-slate-400 group-hover:text-slate-600'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-[#7047EB] text-white'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Accent: Tips Hari Ini & User Profile */}
          <div className="p-3.5 space-y-3 border-t border-[#E9E8F0]/70 bg-gradient-to-b from-transparent to-slate-50/50">
            {/* Tips Hari Ini Card */}
            <div className="p-3.5 rounded-xl bg-[#F2EDFF] border border-[#E3D9FC] text-slate-700 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-md bg-[#7047EB] text-white flex items-center justify-center shrink-0">
                  <Lightbulb className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-[#5632C8]">Tips Hari Ini</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Balas komplain maksimal 24 jam untuk menjaga kepercayaan pelanggan.
              </p>
            </div>

            {/* User Business Card */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="relative w-8 h-8 rounded-lg bg-gradient-to-tr from-[#7047EB] to-[#9977F8] text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                  {businessProfile.businessName.charAt(0) || 'O'}
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {businessProfile.businessName || 'Owner UMKM'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {businessProfile.businessType || 'UMKM Siaga'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
