import React, { useState, useEffect } from 'react';
import { Sidebar, NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast, ToastMessage } from './components/Toast';
import { SabarCheckModal } from './components/SabarCheckModal';
import { Dashboard } from './pages/Dashboard';
import { ComplaintView } from './pages/ComplaintView';
import { BusinessProfileView } from './pages/BusinessProfileView';
import { HistoryView } from './pages/HistoryView';
import { HelpView } from './pages/HelpView';
import { ComplaintRecord, BusinessProfile, SabarCheckResult } from './types/complaint';
import {
  getStoredProfile,
  getStoredHistory,
  saveStoredHistory,
  saveStoredProfile,
  deleteComplaintFromHistory,
  clearAllComplaintHistory,
} from './services/complaintService';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('beranda');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Business Profile
  const [businessProfile, setBusinessProfile] = useState<BusinessProfile>(getStoredProfile);

  // Complaints History
  const [complaintsHistory, setComplaintsHistory] = useState<ComplaintRecord[]>(getStoredHistory);

  // Currently focused complaint in Tangani Komplain
  const [activeComplaint, setActiveComplaint] = useState<ComplaintRecord | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sabar Check modal
  const [isSabarModalOpen, setIsSabarModalOpen] = useState(false);
  const [sabarResult, setSabarResult] = useState<SabarCheckResult | null>(null);
  const [isSabarLoading, setIsSabarLoading] = useState(false);

  const showToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      title,
      description,
    };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenSabarCheck = (result: SabarCheckResult) => {
    setSabarResult(result);
    setIsSabarModalOpen(true);
  };

  const handleSelectComplaintFromHistory = (complaint: ComplaintRecord) => {
    setActiveComplaint(complaint);
    setCurrentTab('tangani');
  };

  const handleStartNewComplaint = () => {
    setActiveComplaint(null);
    setCurrentTab('tangani');
  };

  const handleUpdateComplaintRecord = (updated: ComplaintRecord) => {
    setActiveComplaint(updated);
    setComplaintsHistory((prev) => {
      const idx = prev.findIndex((c) => c.id === updated.id);
      if (idx !== -1) {
        const copy = [...prev];
        copy[idx] = updated;
        saveStoredHistory(copy);
        return copy;
      }
      const newHistory = [updated, ...prev];
      saveStoredHistory(newHistory);
      return newHistory;
    });
  };

  const handleUpdateStatus = (id: string, newStatus: 'Belum Ditangani' | 'Dalam Proses' | 'Selesai') => {
    setComplaintsHistory((prev) => {
      const copy = prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item));
      saveStoredHistory(copy);
      return copy;
    });
    showToast('Status Diperbarui', `Status komplain telah diubah menjadi: ${newStatus}`, 'success');
  };

  const handleDeleteComplaint = (id: string) => {
    deleteComplaintFromHistory(id);
    setComplaintsHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeComplaint?.id === id) {
      setActiveComplaint(null);
    }
    showToast('Riwayat Dihapus', 'Data komplain telah dihapus dari riwayat.', 'info');
  };

  const handleClearAllComplaints = () => {
    clearAllComplaintHistory();
    setComplaintsHistory([]);
    if (activeComplaint) {
      setActiveComplaint(null);
    }
    showToast('Semua Riwayat Dikosongkan', 'Seluruh data komplain telah dihapus dari penyimpanan.', 'info');
  };

  const handleSaveProfile = (newProfile: BusinessProfile) => {
    setBusinessProfile(newProfile);
    saveStoredProfile(newProfile);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex">
      {/* Sidebar (Desktop fixed, Mobile drawer) */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          if (tab === 'tangani' && currentTab !== 'tangani') {
            // keep current active or reset if desired
          }
          setCurrentTab(tab);
        }}
        businessProfile={businessProfile}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          businessProfile={businessProfile}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onNavigateToTangani={handleStartNewComplaint}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentTab === 'beranda' && (
            <Dashboard
              businessProfile={businessProfile}
              onStartComplaint={handleStartNewComplaint}
              recentComplaints={complaintsHistory}
              onOpenComplaint={handleSelectComplaintFromHistory}
            />
          )}

          {currentTab === 'tangani' && (
            <ComplaintView
              key={activeComplaint?.id || 'new'}
              businessProfile={businessProfile}
              activeComplaint={activeComplaint}
              onBackToHome={() => setCurrentTab('beranda')}
              onOpenSabarCheck={handleOpenSabarCheck}
              onShowToast={showToast}
              onUpdateComplaint={handleUpdateComplaintRecord}
            />
          )}

          {currentTab === 'profil' && (
            <BusinessProfileView
              initialProfile={businessProfile}
              onSaveProfile={handleSaveProfile}
              onShowToast={showToast}
            />
          )}

          {currentTab === 'riwayat' && (
            <HistoryView
              history={complaintsHistory}
              onSelectComplaint={handleSelectComplaintFromHistory}
              onUpdateStatus={handleUpdateStatus}
              onStartNewComplaint={handleStartNewComplaint}
              onDeleteComplaint={handleDeleteComplaint}
              onClearAllComplaints={handleClearAllComplaints}
            />
          )}

          {currentTab === 'bantuan' && <HelpView />}
        </main>
      </div>

      {/* Sabar Check Modal */}
      <SabarCheckModal
        isOpen={isSabarModalOpen}
        onClose={() => setIsSabarModalOpen(false)}
        result={sabarResult}
        isLoading={isSabarLoading}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
