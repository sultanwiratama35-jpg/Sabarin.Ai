import React, { useState } from 'react';
import { Store, Save, Sparkles, CheckCircle2, ShieldAlert, Info, HelpCircle } from 'lucide-react';
import { BusinessProfile } from '../types/complaint';
import { saveStoredProfile } from '../services/complaintService';

interface BusinessProfileViewProps {
  initialProfile: BusinessProfile;
  onSaveProfile: (profile: BusinessProfile) => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

export const BusinessProfileView: React.FC<BusinessProfileViewProps> = ({
  initialProfile,
  onSaveProfile,
  onShowToast,
}) => {
  const [profile, setProfile] = useState<BusinessProfile>(initialProfile);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredProfile(profile);
    onSaveProfile(profile);
    setIsSaved(true);
    onShowToast('Profil Bisnis Disimpan', 'AI Sabarin.ai akan menyesuaikan rekomendasi dengan kebijakan toko Anda.', 'success');
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
          Profil Bisnis & Kebijakan Toko
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Konteks ini digunakan oleh AI untuk menyusun rekomendasi resolusi dan balasan yang realistis sesuai batas kemampuan usaha Anda.
        </p>
      </div>

      {/* Info Callout */}
      <div className="p-4 rounded-xl bg-[#F2EDFF] border border-[#E2D6FF] flex items-start gap-3 text-xs text-slate-700">
        <Sparkles className="w-4 h-4 text-[#7047EB] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[#5632C8] block mb-0.5">Personalisasi AI Aktif:</strong>
          Informasi ini mencegah AI menjanjikan ganti rugi yang melampaui batas anggaran toko Anda, serta menyesuaikan gaya bahasa agar selaras dengan brand Anda.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E9E8F0] p-6 md:p-8 shadow-xs space-y-6">
        {/* Identitas Bisnis */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Store className="w-4 h-4 text-[#7047EB]" />
            <span>Identitas Usaha</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Usaha / Toko</label>
              <input
                type="text"
                value={profile.businessName}
                onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition"
                placeholder="mis. Kue & Hampers Berkah"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Usaha</label>
              <input
                type="text"
                value={profile.businessType}
                onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition"
                placeholder="mis. Kuliner, Fashion Retail, Bengkel, atau Jasa"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Singkat Usaha</label>
            <textarea
              value={profile.businessDescription}
              onChange={(e) => setProfile({ ...profile, businessDescription: e.target.value })}
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition leading-relaxed"
              placeholder="Jelaskan produk utama dan jangkauan pengiriman..."
            />
          </div>
        </div>

        {/* Kebijakan Penanganan Komplain */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Kebijakan Toko & Batas Resolusi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kebijakan Retur / Pengembalian</label>
              <textarea
                value={profile.returnPolicy}
                onChange={(e) => setProfile({ ...profile, returnPolicy: e.target.value })}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition leading-relaxed"
                placeholder="mis. Wajib video unboxing 1x24 jam tanpa jeda."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kebijakan Pengembalian Dana (Refund)</label>
              <textarea
                value={profile.refundPolicy}
                onChange={(e) => setProfile({ ...profile, refundPolicy: e.target.value })}
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition leading-relaxed"
                placeholder="mis. Refund 100% jika kesalahan toko atau kemasan rusak parah."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ketentuan Garansi</label>
              <input
                type="text"
                value={profile.warrantyPolicy}
                onChange={(e) => setProfile({ ...profile, warrantyPolicy: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition"
                placeholder="mis. Garansi rasa segar 7 hari / ganti baru"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Batas Maksimal Kompensasi Goodwill</label>
              <input
                type="text"
                value={profile.maxCompensation}
                onChange={(e) => setProfile({ ...profile, maxCompensation: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition"
                placeholder="mis. Voucher diskon 15% maksimal Rp 50.000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gaya Komunikasi Brand (Tone of Voice)</label>
            <input
              type="text"
              value={profile.brandTone}
              onChange={(e) => setProfile({ ...profile, brandTone: e.target.value })}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition"
              placeholder="mis. Ramah, sopan, bersahabat, santai tapi tetap bertanggung jawab"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#7047EB] hover:bg-[#5632C8] text-white text-xs md:text-sm font-bold flex items-center gap-2 shadow-xs transition active:scale-98 cursor-pointer"
          >
            {isSaved ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Profil Tersimpan!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Profil Bisnis</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
