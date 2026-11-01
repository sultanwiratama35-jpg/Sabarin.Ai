import React from 'react';
import { Menu } from 'lucide-react';
import { BusinessProfile } from '../types/complaint';
import { NavTab } from './Sidebar';

interface HeaderProps {
  currentTab: NavTab;
  businessProfile: BusinessProfile;
  onOpenMobileMenu: () => void;
  onNavigateToTangani?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  businessProfile,
  onOpenMobileMenu,
}) => {
  const getTabTitle = () => {
    switch (currentTab) {
      case 'beranda':
        return 'Dashboard Beranda';
      case 'tangani':
        return 'Tangani Komplain';
      case 'profil':
        return 'Profil Bisnis';
      case 'riwayat':
        return 'Riwayat Komplain';
      case 'bantuan':
        return 'Bantuan & Panduan';
      default:
        return 'Sabarin.ai';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E9E8F0] px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile menu button & Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 leading-none">
              {getTabTitle()}
            </h2>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 hidden sm:block">
            {businessProfile.businessName || 'Toko UMKM'}
          </p>
        </div>
      </div>
    </header>
  );
};
