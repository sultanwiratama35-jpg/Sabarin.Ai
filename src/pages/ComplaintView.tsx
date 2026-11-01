import React, { useState } from 'react';
import {
  ArrowLeft,
  MessageSquare,
  ShoppingBag,
  MapPin,
  Sparkles,
  Copy,
  Edit3,
  CheckCircle2,
  AlertTriangle,
  Package,
  Frown,
  Smile,
  FileText,
  RotateCcw,
  Info,
  Check,
  Send,
  SlidersHorizontal,
  Save,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import {
  ChannelType,
  ComplaintRecord,
  BusinessProfile,
  ReplyToneTab,
  SabarCheckResult,
} from '../types/complaint';
import { SAMPLE_COMPLAINTS } from '../services/mockData';
import {
  analyzeComplaintWithAI,
  runSabarCheck,
  updateComplaintInHistory,
} from '../services/complaintService';

interface ComplaintViewProps {
  businessProfile: BusinessProfile;
  activeComplaint: ComplaintRecord | null;
  onBackToHome: () => void;
  onOpenSabarCheck: (result: SabarCheckResult) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  onUpdateComplaint: (updated: ComplaintRecord) => void;
}

export const ComplaintView: React.FC<ComplaintViewProps> = ({
  businessProfile,
  activeComplaint,
  onBackToHome,
  onOpenSabarCheck,
  onShowToast,
  onUpdateComplaint,
}) => {
  // Input State
  const [channel, setChannel] = useState<ChannelType>(activeComplaint?.channel || 'whatsapp');
  const [complaintText, setComplaintText] = useState(activeComplaint?.rawComplaint || '');
  const [productContext, setProductContext] = useState(activeComplaint?.productContext || '');
  const [orderNumber, setOrderNumber] = useState(activeComplaint?.orderNumber || '');

  // Result & View Mode
  const [currentResult, setCurrentResult] = useState<ComplaintRecord | null>(activeComplaint || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeReplyTab, setActiveReplyTab] = useState<ReplyToneTab>('empathetic');

  // Edit Draft Mode
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editedDraftText, setEditedDraftText] = useState('');

  // Follow-up Checklist State
  const [checkedFollowUps, setCheckedFollowUps] = useState<Record<string, boolean>>({});

  // Sample index cycler
  const [sampleIndex, setSampleIndex] = useState(0);

  // Handle Load Sample Complaint
  const handleLoadSample = () => {
    const sample = SAMPLE_COMPLAINTS[sampleIndex % SAMPLE_COMPLAINTS.length];
    setChannel(sample.channel);
    setComplaintText(sample.text);
    setProductContext(sample.product);
    setOrderNumber(sample.orderNumber);
    setSampleIndex((prev) => prev + 1);
    onShowToast('Contoh Komplain Dimuat', sample.label, 'info');
  };

  // Handle Submit Analysis
  const handleAnalyze = async () => {
    if (!complaintText.trim()) {
      onShowToast('Teks Komplain Kosong', 'Tempelkan pesan komplain pelanggan terlebih dahulu.', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await analyzeComplaintWithAI(
        complaintText,
        channel,
        productContext,
        orderNumber,
        businessProfile
      );

      setCurrentResult(res.complaint);
      onUpdateComplaint(res.complaint);
      setIsEditingDraft(false);
      setCheckedFollowUps({});

      if (res.isSimulation) {
        onShowToast(
          'Analisis Berhasil (Mode Cerdas)',
          res.message || 'Hasil draf balasan dan solusi telah siap.',
          'info'
        );
      } else {
        onShowToast(
          'Analisis Gemini 3.8 Flash Berhasil!',
          'Draf balasan dan rekomendasi penyelesaian siap ditinjau.',
          'success'
        );
      }
    } catch (err: any) {
      onShowToast('Terjadi Kendala', err.message || 'Gagal memproses analisis.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Get active text based on selected tab
  const getActiveDraftText = () => {
    if (!currentResult) return '';
    if (activeReplyTab === 'empathetic') return currentResult.replies.empathetic;
    if (activeReplyTab === 'short') return currentResult.replies.short;
    return currentResult.replies.personal;
  };

  // Copy active reply text
  const handleCopyText = async () => {
    const textToCopy = isEditingDraft ? editedDraftText : getActiveDraftText();
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      onShowToast('Teks Berhasil Disalin! 📋', 'Siap ditempelkan ke chat pelanggan.', 'success');
    } catch (e) {
      // Fallback
      onShowToast('Teks Siap Digunakan', 'Gunakan tombol copy browser.', 'info');
    }
  };

  // Handle Edit Draft Toggle
  const handleStartEdit = () => {
    setEditedDraftText(getActiveDraftText());
    setIsEditingDraft(true);
  };

  const handleSaveEdit = () => {
    if (!currentResult) return;
    const updated = {
      ...currentResult,
      replies: {
        ...currentResult.replies,
        [activeReplyTab]: editedDraftText,
      },
    };
    setCurrentResult(updated);
    onUpdateComplaint(updated);
    updateComplaintInHistory(updated);
    setIsEditingDraft(false);
    onShowToast('Draf Balasan Diperbarui', 'Perubahan telah disimpan.', 'success');
  };

  // Run Sabar Check
  const handleTriggerSabarCheck = async () => {
    const text = isEditingDraft ? editedDraftText : getActiveDraftText();
    if (!text) return;

    onShowToast('Menjalankan Sabar Check...', 'Mengevaluasi kesantunan dan perlindungan toko.', 'info');
    const result = await runSabarCheck(text, currentResult?.problemSummary || complaintText);
    onOpenSabarCheck(result);
  };

  // Toggle Resolution Option selection
  const handleSelectOption = (optId: string) => {
    if (!currentResult) return;
    const updated = {
      ...currentResult,
      selectedOptionId: optId,
    };
    setCurrentResult(updated);
    onUpdateComplaint(updated);
    updateComplaintInHistory(updated);
  };

  // Toggle Checklist
  const handleToggleChecklist = (item: string) => {
    setCheckedFollowUps((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  // Update Status
  const handleStatusChange = (newStatus: 'Belum Ditangani' | 'Dalam Proses' | 'Selesai') => {
    if (!currentResult) return;
    const updated = { ...currentResult, status: newStatus };
    setCurrentResult(updated);
    onUpdateComplaint(updated);
    updateComplaintInHistory(updated);
    onShowToast('Status Diperbarui', `Status komplain kini: ${newStatus}`, 'success');
  };

  // ==========================================
  // STATE B: RESULT VIEW
  // ==========================================
  if (currentResult) {
    const selectedOption =
      currentResult.recommendations.find((r) => r.id === currentResult.selectedOptionId) ||
      currentResult.recommendations[0];

    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-10">
        {/* Header with Back Arrow */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentResult(null)}
              className="w-9 h-9 rounded-xl bg-white border border-[#E9E8F0] text-slate-600 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition shadow-2xs"
              title="Kembali ke formulir komplain"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
                  Hasil Analisis Komplain
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#F2EDFF] text-[#7047EB] uppercase">
                  {currentResult.channel.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                AI telah membedah masalah pelanggan dan menyiapkan solusi diplomatis yang aman.
              </p>
            </div>
          </div>

          {/* Quick Actions Header: Status & New Analysis */}
          <div className="flex items-center gap-2 self-start sm:self-center">
            <select
              value={currentResult.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition shadow-2xs cursor-pointer ${
                currentResult.status === 'Selesai'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : currentResult.status === 'Dalam Proses'
                  ? 'bg-indigo-50 text-[#7047EB] border-indigo-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}
            >
              <option value="Belum Ditangani">Status: Belum Ditangani</option>
              <option value="Dalam Proses">Status: Dalam Proses</option>
              <option value="Selesai">Status: Selesai</option>
            </select>

            <button
              onClick={() => {
                setCurrentResult(null);
                setComplaintText('');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-[#E9E8F0] hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Komplain Baru</span>
            </button>
          </div>
        </div>

        {/* Escalation Warning (if critical) */}
        {currentResult.escalationRequired && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-rose-900 shadow-2xs animate-in fade-in">
            <div className="mt-0.5 shrink-0 w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 font-bold">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs md:text-sm font-bold flex items-center gap-2">
                Peringatan Risiko Eskalasi Tinggi
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white font-semibold">
                  Tindakan Cepat &lt; 30 Menit
                </span>
              </h4>
              <p className="text-xs text-rose-800/90 mt-1 leading-relaxed">
                {currentResult.escalationReason ||
                  'Pelanggan menunjukkan indikasi kekecewaan mendalam atau potensi penyebaran ke media sosial. Utamakan permohonan maaf dan solusi konkrit tanpa perdebatan.'}
              </p>
            </div>
          </div>
        )}

        {/* Top Stats Row: 4 Small Info Cards Horizontally (Matches Mockup) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Kategori Masalah */}
          <div className="bg-white rounded-2xl p-4 border border-[#E9E8F0] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#F2EDFF] text-[#7047EB] flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-400 block">Kategori Masalah</span>
              <p className="text-sm font-bold text-slate-800 truncate">{currentResult.category}</p>
            </div>
          </div>

          {/* Card 2: Tingkat Urgensi */}
          <div className="bg-white rounded-2xl p-4 border border-[#E9E8F0] shadow-xs flex items-center gap-3.5">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                currentResult.urgency === 'Kritis' || currentResult.urgency === 'Tinggi'
                  ? 'bg-rose-50 text-rose-600'
                  : currentResult.urgency === 'Sedang'
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-400 block">Tingkat Urgensi</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                    currentResult.urgency === 'Kritis' || currentResult.urgency === 'Tinggi'
                      ? 'bg-rose-100 text-rose-700'
                      : currentResult.urgency === 'Sedang'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentResult.urgency}
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Emosi Pelanggan */}
          <div className="bg-white rounded-2xl p-4 border border-[#E9E8F0] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
              <Frown className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-400 block">Emosi Pelanggan</span>
              <p className="text-sm font-bold text-slate-800 truncate">{currentResult.customerEmotion}</p>
            </div>
          </div>

          {/* Card 4: Ringkasan Masalah */}
          <div className="bg-white rounded-2xl p-4 border border-[#E9E8F0] shadow-xs flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#7047EB] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-medium text-slate-400 block">Ringkasan Masalah</span>
              <p className="text-xs font-semibold text-slate-700 line-clamp-2 leading-tight">
                {currentResult.problemSummary}
              </p>
            </div>
          </div>
        </div>

        {/* Main Split Content: 2 Columns (Matches Mockup) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Draf Balasan (Siap Kirim) (7 cols on lg) */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E9E8F0] p-6 shadow-xs flex flex-col justify-between space-y-5">
            {/* Top Bar: Title & 3 Tabs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#F2EDFF] text-[#7047EB] flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-slate-800 text-base">
                    Draf Balasan (Siap Kirim)
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">Bahasa Indonesia Sopan</span>
              </div>

              {/* 3 Tabs (Versi Utama, Lebih Singkat, Lebih Personal) */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl gap-1">
                <button
                  onClick={() => {
                    setActiveReplyTab('empathetic');
                    setIsEditingDraft(false);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeReplyTab === 'empathetic'
                      ? 'bg-[#7047EB] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Versi Utama
                </button>
                <button
                  onClick={() => {
                    setActiveReplyTab('short');
                    setIsEditingDraft(false);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeReplyTab === 'short'
                      ? 'bg-[#7047EB] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lebih Singkat
                </button>
                <button
                  onClick={() => {
                    setActiveReplyTab('personal');
                    setIsEditingDraft(false);
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    activeReplyTab === 'personal'
                      ? 'bg-[#7047EB] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Lebih Personal
                </button>
              </div>

              {/* Text Container: Light Gray Box */}
              <div className="relative rounded-xl border border-slate-200 bg-slate-50/80 p-4.5 min-h-[220px]">
                {isEditingDraft ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedDraftText}
                      onChange={(e) => setEditedDraftText(e.target.value)}
                      rows={8}
                      className="w-full bg-white border border-[#7047EB] rounded-lg p-3 text-xs md:text-sm text-slate-800 focus:outline-hidden leading-relaxed shadow-inner"
                      placeholder="Ubah kalimat balasan di sini..."
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setIsEditingDraft(false)}
                        className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Batal
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="px-3.5 py-1.5 rounded-lg bg-[#7047EB] hover:bg-[#5632C8] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan Perubahan</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-xs md:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-normal">
                    {getActiveDraftText()}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions: Salin Teks, Edit Draf, Sabar Check */}
            <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
              {/* Salin Teks (Solid Purple) */}
              <button
                onClick={handleCopyText}
                className="px-4 py-2.5 rounded-xl bg-[#7047EB] hover:bg-[#5632C8] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition active:scale-98 cursor-pointer"
              >
                <Copy className="w-4 h-4" />
                <span>Salin Teks</span>
              </button>

              {/* Edit Draf (Outline) */}
              <button
                onClick={handleStartEdit}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-slate-500" />
                <span>Edit Draf</span>
              </button>

              {/* Sabar Check (Light Purple) */}
              <button
                onClick={handleTriggerSabarCheck}
                className="px-4 py-2.5 rounded-xl bg-[#F2EDFF] hover:bg-[#E7DEFE] text-[#7047EB] text-xs font-bold flex items-center gap-2 border border-[#E1D4FD] transition active:scale-98 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-[#7047EB]" />
                <span>Sabar Check</span>
              </button>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: Rekomendasi Penyelesaian (5 cols on lg) */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E9E8F0] p-6 shadow-xs space-y-5">
            {/* Header */}
            <div>
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-800 text-base">
                  Rekomendasi Penyelesaian
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Pilih opsi tindakan bisnis yang paling proporsional untuk toko Anda.
              </p>
            </div>

            {/* Vertical List of Selectable Radio-Style Cards (Matches Mockup) */}
            <div className="space-y-3">
              {currentResult.recommendations.map((opt) => {
                const isSelected = (currentResult.selectedOptionId || currentResult.recommendations[0]?.id) === opt.id;
                return (
                  <div
                    key={opt.id}
                    onClick={() => handleSelectOption(opt.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#7047EB] bg-[#FAF8FF] shadow-xs ring-1 ring-[#7047EB]/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Radio circle */}
                      <div className="mt-0.5 shrink-0">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-[#7047EB] bg-[#7047EB]'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <h4 className="text-xs font-bold text-slate-800 leading-snug">{opt.title}</h4>
                          {opt.recommended && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Direkomendasikan
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 font-medium">{opt.action}</p>

                        <div className="text-[11px] text-slate-500 pt-1">
                          <span className="font-semibold text-slate-700">Pertimbangan: </span>
                          <span>{opt.reason}</span>
                        </div>

                        {isSelected && (
                          <div className="mt-2 pt-2 border-t border-[#E9E1FF] text-[11px] text-slate-600 space-y-1">
                            <div>
                              <span className="text-emerald-700 font-semibold">Keuntungan: </span>
                              <span>{opt.benefit}</span>
                            </div>
                            <div>
                              <span className="text-amber-700 font-semibold">Konsekuensi Biaya: </span>
                              <span>{opt.tradeoff}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Info Box: Langkah Tindak Lanjut (Matches Mockup) */}
            <div className="p-4 rounded-xl bg-[#F8F9FC] border border-slate-200/80 space-y-2.5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#7047EB] shrink-0" />
                <h4 className="text-xs font-bold text-slate-800">Langkah Tindak Lanjut:</h4>
              </div>

              <div className="space-y-2 pl-1">
                {currentResult.followUpActions.map((action, idx) => {
                  const isChecked = Boolean(checkedFollowUps[action]);
                  return (
                    <label
                      key={idx}
                      className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer group select-none"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleChecklist(action)}
                        className="mt-0.5 rounded-sm border-slate-300 text-[#7047EB] focus:ring-[#7047EB] shrink-0"
                      />
                      <span
                        className={`leading-relaxed transition ${
                          isChecked ? 'line-through text-slate-400 font-normal' : 'font-medium'
                        }`}
                      >
                        {idx + 1}. {action}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Raw Text Reference Card */}
        <div className="bg-white rounded-2xl border border-[#E9E8F0] p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              Teks Komplain Asli Pelanggan
            </span>
            <span className="text-xs text-slate-400">{currentResult.timestamp}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-700 italic bg-slate-50 p-3 rounded-xl border border-slate-200/60 leading-relaxed">
            &quot;{currentResult.rawComplaint}&quot;
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // STATE A: FORM INPUT VIEW
  // ==========================================
  const charCount = complaintText.length;
  const maxChars = 2000;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header with Back Arrow */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToHome}
          className="w-9 h-9 rounded-xl bg-white border border-[#E9E8F0] text-slate-600 hover:text-slate-900 hover:border-slate-300 flex items-center justify-center transition shadow-2xs cursor-pointer"
          title="Kembali ke Beranda"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Tangani Komplain
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Masukkan detail komplain pelanggan, dan biarkan AI membantu Anda menganalisis, membalas, serta memberikan solusi terbaik.
          </p>
        </div>
      </div>

      {/* Main Input Form Card (Matches Mockup) */}
      <div className="bg-white rounded-2xl border border-[#E9E8F0] p-6 md:p-8 shadow-xs space-y-7">
        {/* SECTION 1: Pilih Kanal Komunikasi */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Pilih Kanal Komunikasi
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => setChannel('whatsapp')}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                channel === 'whatsapp'
                  ? 'border-[#7047EB] bg-[#F2EDFF] text-[#7047EB] shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-3 h-3" />
              </div>
              <span>WhatsApp</span>
            </button>

            {/* Marketplace */}
            <button
              type="button"
              onClick={() => setChannel('marketplace')}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                channel === 'marketplace'
                  ? 'border-[#7047EB] bg-[#F2EDFF] text-[#7047EB] shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-5 h-5 rounded-md bg-rose-500 text-white flex items-center justify-center shrink-0">
                <ShoppingBag className="w-3 h-3" />
              </div>
              <span>Marketplace</span>
            </button>

            {/* Google Maps */}
            <button
              type="button"
              onClick={() => setChannel('google_maps')}
              className={`flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                channel === 'google_maps'
                  ? 'border-[#7047EB] bg-[#F2EDFF] text-[#7047EB] shadow-xs'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="w-5 h-5 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
                <MapPin className="w-3 h-3" />
              </div>
              <span>Google Maps</span>
            </button>
          </div>
        </div>

        {/* SECTION 2: Tempelkan Teks Komplain Pelanggan */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              2. Tempelkan Teks Komplain Pelanggan
            </label>
            {complaintText && (
              <button
                type="button"
                onClick={() => setComplaintText('')}
                className="text-[11px] text-slate-400 hover:text-rose-600 transition"
              >
                Hapus teks
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
              maxLength={maxChars}
              rows={6}
              className="w-full bg-slate-50/70 border border-slate-200 rounded-xl p-4 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#7047EB] focus:bg-white focus:ring-2 focus:ring-[#7047EB]/20 transition leading-relaxed"
              placeholder="Tempelkan pesan komplain pelanggan di sini... (contoh: Barangnya sudah sampai, tapi kondisinya rusak dan kemasannya juga penyok banget. Kecewa sih, soalnya ini buat kado besok. Gimana solusinya?)"
            />
            {/* Character Counter at bottom right (Matches Mockup) */}
            <div className="absolute bottom-3 right-3 text-[11px] font-medium text-slate-400 bg-white/80 px-2 py-0.5 rounded-md backdrop-blur-xs border border-slate-200/50">
              {charCount} / {maxChars}
            </div>
          </div>
        </div>

        {/* SECTION 3: Informasi Tambahan (Opsional) */}
        <div className="space-y-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              3. Informasi Tambahan (Opsional)
            </label>
            <span className="text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              Membantu akurasi solusi AI
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Jenis Produk / Jasa</label>
              <input
                type="text"
                value={productContext}
                onChange={(e) => setProductContext(e.target.value)}
                placeholder="mis. Hampers Keramik Spesial"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Nomor Pesanan / ID (Opsional)</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="mis. TRX-88219"
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions: Contoh Komplain & Analisis dengan AI (Matches Mockup) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          {/* Ghost button: Contoh Komplain */}
          <button
            type="button"
            onClick={handleLoadSample}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <FileText className="w-4 h-4 text-slate-500" />
            <span>Contoh Komplain</span>
          </button>

          {/* Solid primary button: ✨ Analisis dengan AI */}
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#7047EB] hover:bg-[#5632C8] disabled:opacity-70 text-white text-xs md:text-sm font-bold flex items-center justify-center gap-2 shadow-md shadow-[#7047EB]/25 transition active:scale-98 cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Menganalisis Komplain...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analisis dengan AI</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reassurance Banner for Business Owners */}
      <div className="p-4 rounded-xl bg-[#F8F9FC] border border-slate-200/80 flex items-center gap-3 text-xs text-slate-500">
        <Info className="w-4 h-4 text-[#7047EB] shrink-0" />
        <span>
          Sabarin.ai tidak akan mengirim pesan secara otomatis ke pelanggan. Anda memegang kendali penuh atas setiap balasan yang dikirimkan.
        </span>
      </div>
    </div>
  );
};
