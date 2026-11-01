import React from 'react';
import {
  Tag,
  MessageCircle,
  Lightbulb,
  Plus,
  ArrowRight,
  ShieldAlert,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { ComplaintRecord } from '../types/complaint';

interface DashboardProps {
  onStartComplaint: () => void;
  recentComplaints: ComplaintRecord[];
  onOpenComplaint: (complaint: ComplaintRecord) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onStartComplaint,
  recentComplaints,
  onOpenComplaint,
}) => {
  const totalComplaints = recentComplaints.length;
  const criticalCount = recentComplaints.filter((c) => c.urgency === 'Kritis' || c.urgency === 'Tinggi').length;
  const resolvedCount = recentComplaints.filter((c) => c.status === 'Selesai').length;

  return (
    <div className="space-y-7 max-w-6xl mx-auto">
      {/* Top Welcome Banner (Matches Mockup) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-white via-white to-[#FAF7FF] border border-[#E9E8F0] p-7 md:p-9 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 z-10 max-w-xl text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight leading-snug">
            Halo, Owner! 👋
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed font-normal">
            Tenang, keluhan pelanggan bisa dihadapi dengan lebih bijak bersama Sabarin.ai.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartComplaint}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7047EB] hover:bg-[#5632C8] text-white text-sm font-semibold shadow-md shadow-[#7047EB]/20 transition-all duration-200 active:scale-98 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tangani Komplain Sekarang</span>
            </button>
          </div>
        </div>

        {/* Calming Illustration (Matches Mockup) */}
        <div className="relative shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 bg-[#F2EDFF]/60 rounded-full filter blur-xl scale-95 -z-10 pointer-events-none" />
          <img
            src="/assets/aistudio/image_bad35933.png"
            alt="Sabarin.ai Asisten Krisis UMKM"
            className="w-52 sm:w-64 h-auto object-contain mix-blend-multiply drop-shadow-xs transition duration-300 filter contrast-[1.03] saturate-[1.06]"
          />
        </div>
      </div>

      {/* 3 Main Feature Cards (Matches Mockup) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1 — Klasifikasi Masalah */}
        <div className="bg-white rounded-2xl p-6 border border-[#E9E8F0] shadow-xs hover:shadow-md hover:border-[#D7CCFC] transition duration-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#F2EDFF] text-[#7047EB] flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Klasifikasi Masalah</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Pahami jenis dan tingkat urgensi komplain secara instan dan objektif.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#7047EB]">
            <span>Filter Kategori Otomatis</span>
            <CheckCircle2 className="w-4 h-4 text-[#7047EB]" />
          </div>
        </div>

        {/* Card 2 — Buat Balasan Sopan */}
        <div className="bg-white rounded-2xl p-6 border border-[#E9E8F0] shadow-xs hover:shadow-md hover:border-emerald-200 transition duration-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Buat Balasan Sopan</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Dapatkan draf balasan profesional, tenang, dan siap kirim sesuai kanal.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-600">
            <span>3 Variasi Nada Balasan</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
        </div>

        {/* Card 3 — Rekomendasi Solusi */}
        <div className="bg-white rounded-2xl p-6 border border-[#E9E8F0] shadow-xs hover:shadow-md hover:border-amber-200 transition duration-200 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Rekomendasi Solusi</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                Pilih langkah terbaik berdasarkan kondisi bisnis dan pertimbangan biaya Anda.
              </p>
            </div>
          </div>
          <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-amber-600">
            <span>Analisis Untung-Rugi</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Quick Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E9E8F0] shadow-2xs">
          <p className="text-xs font-medium text-slate-400">Total Komplain</p>
          <p className="text-2xl font-extrabold text-slate-800 mt-1">{totalComplaints}</p>
          <span className="text-[11px] text-slate-500">Tercatat di sistem</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E9E8F0] shadow-2xs">
          <p className="text-xs font-medium text-slate-400">Kasus Kritis / Urgen</p>
          <p className="text-2xl font-extrabold text-[#EF6464] mt-1">{criticalCount}</p>
          <span className="text-[11px] text-rose-500 font-medium">Perlu respons cepat</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E9E8F0] shadow-2xs">
          <p className="text-xs font-medium text-slate-400">Terselesaikan</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{resolvedCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Terselesaikan damai</span>
        </div>
        <div className="bg-white rounded-xl p-4 border border-[#E9E8F0] shadow-2xs">
          <p className="text-xs font-medium text-slate-400">Rata-rata Sabar Score</p>
          <p className="text-2xl font-extrabold text-[#7047EB] mt-1">96/100</p>
          <span className="text-[11px] text-[#7047EB] font-medium">Sangat terkontrol</span>
        </div>
      </div>

      {/* Recent Complaints Table */}
      <div className="bg-white rounded-2xl border border-[#E9E8F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Aktivitas Komplain Terbaru</h3>
            <p className="text-xs text-slate-400">Daftar keluhan yang membutuhkan tindak lanjut</p>
          </div>
          <button
            onClick={onStartComplaint}
            className="text-xs font-semibold text-[#7047EB] hover:text-[#5632C8] flex items-center gap-1 transition"
          >
            <span>+ Buat Analisis Baru</span>
          </button>
        </div>

        {recentComplaints.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <Smile className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-semibold text-slate-600">Belum ada komplain tercatat.</p>
            <p className="text-xs text-slate-400 mt-1">
              Saat ada pelanggan mengeluh, klik &quot;Tangani Komplain Sekarang&quot;.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentComplaints.slice(0, 4).map((c) => (
              <div
                key={c.id}
                onClick={() => onOpenComplaint(c)}
                className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition cursor-pointer group"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div className="mt-0.5 shrink-0">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full ${
                        c.urgency === 'Kritis'
                          ? 'bg-rose-500 ring-4 ring-rose-100'
                          : c.urgency === 'Tinggi'
                          ? 'bg-amber-500 ring-4 ring-amber-100'
                          : 'bg-emerald-500 ring-4 ring-emerald-100'
                      }`}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-800">{c.category}</span>
                      <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {c.channel.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-slate-400">• {c.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 truncate max-w-xl">
                      &quot;{c.rawComplaint}&quot;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      c.status === 'Selesai'
                        ? 'bg-emerald-50 text-emerald-600'
                        : c.status === 'Dalam Proses'
                        ? 'bg-indigo-50 text-[#7047EB]'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {c.status}
                  </span>
                  <div className="text-slate-400 group-hover:text-[#7047EB] group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prinsip S-A-B-A-R Card Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#F2EDFF] via-[#FBF9FF] to-[#F2EDFF] border border-[#E2D6FF] flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1 text-center md:text-left">
          <h4 className="text-sm font-bold text-[#5632C8] flex items-center justify-center md:justify-start gap-1.5">
            <Sparkles className="w-4 h-4" />
            Formula Emas Penanganan Krisis: S-A-B-A-R
          </h4>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            <strong>S</strong>top emosi sesaat • <strong>A</strong>kui ketidaknyamanan pelanggan • <strong>B</strong>ukti diverifikasi • <strong>A</strong>tasi dengan alternatif solusi • <strong>R</strong>awat hubungan jangka panjang.
          </p>
        </div>
        <button
          onClick={onStartComplaint}
          className="shrink-0 px-4 py-2 rounded-xl bg-white text-[#7047EB] hover:bg-[#F2EDFF] border border-[#D7CCFC] text-xs font-bold transition shadow-2xs"
        >
          Coba Penanganan Baru
        </button>
      </div>
    </div>
  );
};
