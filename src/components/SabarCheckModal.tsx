import React from 'react';
import { X, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { SabarCheckResult } from '../types/complaint';

interface SabarCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: SabarCheckResult | null;
  isLoading: boolean;
  onApplyImprovement?: () => void;
}

export const SabarCheckModal: React.FC<SabarCheckModalProps> = ({
  isOpen,
  onClose,
  result,
  isLoading,
  onApplyImprovement,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FBF9FF]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F2EDFF] text-[#7047EB] flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-1.5">
                Sabar Check™ AI Verifier
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#F2EDFF] text-[#7047EB]">
                  Filter Emosi
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Memastikan balasan tidak defensif & aman dari risiko konflik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 border-4 border-[#F2EDFF] border-t-[#7047EB] rounded-full animate-spin mb-4" />
              <h4 className="font-semibold text-slate-800 text-sm">Menganalisis Draf Balasan...</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Mengecek indikasi nada defensif, kata-kata memicu emosi, dan komitmen klausul bisnis.
              </p>
            </div>
          ) : result ? (
            <>
              {/* Score Card */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-[#F8F5FF] to-[#FAF7FF] border border-[#E9E1FF]">
                <div className="relative w-16 h-16 shrink-0 flex items-center justify-center rounded-2xl bg-white shadow-xs border border-[#E2D6FF]">
                  <span className="text-2xl font-extrabold text-[#7047EB]">{result.score}</span>
                  <span className="text-[10px] absolute bottom-1 font-semibold text-slate-400">/ 100</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        result.score >= 80
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : result.score >= 60
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {result.statusText}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed font-medium">
                    {result.summary}
                  </p>
                </div>
              </div>

              {/* Checklist verification */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Poin Pemeriksaan Kesabaran
                </h4>
                <div className="space-y-2">
                  {result.checks.map((chk) => (
                    <div
                      key={chk.id}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 flex items-start gap-3"
                    >
                      <div className="mt-0.5 shrink-0">
                        {chk.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800">{chk.title}</span>
                          <span
                            className={`text-[10px] font-semibold ${
                              chk.passed ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {chk.passed ? 'Lolos' : 'Perlu Perhatian'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                          {chk.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Tips */}
              {result.tips && result.tips.length > 0 && (
                <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tips Komunikasi Krisis dari Sabarin.ai:</span>
                  </div>
                  <ul className="text-[11px] text-amber-900/80 space-y-1 list-disc list-inside">
                    {result.tips.map((tip, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">Siap dikirim ke pelanggan?</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#7047EB] hover:bg-[#5632C8] text-white text-xs font-semibold shadow-xs transition"
          >
            Tutup & Lanjutkan
          </button>
        </div>
      </div>
    </div>
  );
};
