import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ShieldCheck,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Sparkles,
  BookOpen,
  Scale,
  AlertCircle,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const HelpView: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: 'Bagaimana cara terbaik menangani komplain pelanggan yang marah?',
      answer:
        'Gunakan rumus S-A-B-A-R: 1) Jangan langsung membalas saat emosi panas. 2) Validasi perasaan pelanggan dengan meminta maaf atas ketidaknyamanan tanpa langsung mengakui kesalahan sepihak sebelum bukti dicek. 3) Minta bukti video unboxing/foto dengan nada santun. 4) Tawarkan opsi resolusi yang jelas (ganti produk baru atau refund).',
      category: 'Metode Krisis',
    },
    {
      question: 'Apa perbedaan gaya balasan WhatsApp, Marketplace, dan Google Maps?',
      answer:
        '• WhatsApp: Lebih personal, cepat, dan ramah dengan emotikon santun (🙏, 😊).\n• Marketplace: Patuh pada Terms of Service platform, cantumkan instruksi komplain resmi agar terlindungi asuransi pengiriman.\n• Google Maps: Dibaca oleh publik calon pelanggan baru. Wajib berjiwa besar, akui masukan tanpa berdebat, dan undang mereka untuk menghubungi kontak resmi agar masalah selesai secara privat.',
      category: 'Kanal Komunikasi',
    },
    {
      question: 'Apakah Sabarin.ai akan mengirim pesan secara otomatis ke pelanggan?',
      answer:
        'Tidak. Sabarin.ai didesain sebagai Co-Pilot (Asisten Pendamping). Setiap teks balasan harus disetujui, diedit jika perlu, dan disalin sendiri oleh Anda sebelum dikirim ke pelanggan. Anda tetap memegang 100% kendali.',
      category: 'Keamanan & Kontrol',
    },
    {
      question: 'Bagaimana jika pembeli menolak mengirimkan video unboxing?',
      answer:
        'Gunakan pendekatan win-win: "Kami sangat ingin membantu Kakak secepatnya. Foto label resi dan kemasan luar sangat kami butuhkan untuk mengajukan klaim ganti rugi ke pihak ekspedisi agar toko kami bisa mengganti barang Kakak tanpa kendala." Penjelasan alasan di balik permintaan bukti biasanya lebih mudah diterima pembeli.',
      category: 'Penyelesaian Sengketa',
    },
    {
      question: 'Kapan komplain dikategorikan sebagai "Kritis"?',
      answer:
        'Komplain menjadi Kritis bila pelanggan mengancam akan memviralkan di media sosial, membawa ke ranah hukum/somasi, melibatkan pihak ketiga (mis. atasan kantor pembeli), atau menyangkut keamanan pangan dan cedera fisik. Kasus ini memerlukan penanganan < 30 menit langsung oleh pemilik bisnis.',
      category: 'Urgensi Krisis',
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
          Pusat Bantuan & SOP Penanganan Krisis
        </h1>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Panduan langkah demi langkah dan praktik terbaik meredam komplain konsumen bagi pelaku UMKM.
        </p>
      </div>

      {/* Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-[#E9E8F0] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#F2EDFF] text-[#7047EB] flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h4 className="text-xs font-bold text-slate-800">1. Analisis Masalah</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Tempelkan komplain apa adanya. AI akan membedah akar masalah dan tingkat risiko eskalasi.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9E8F0] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h4 className="text-xs font-bold text-slate-800">2. Pilih Balasan</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Gunakan tab Versi Utama, Singkat, atau Personal. Jalankan <em>Sabar Check</em> untuk memastikan pesan aman.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#E9E8F0] shadow-xs space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h4 className="text-xs font-bold text-slate-800">3. Eksekusi Solusi</h4>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            Terapkan rekomendasi resolusi bisnis (ganti barang / refund / voucher) dan tandai checklist tindak lanjut.
          </p>
        </div>
      </div>

      {/* Accordion FAQ */}
      <div className="bg-white rounded-2xl border border-[#E9E8F0] shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#7047EB]" />
            <h3 className="font-bold text-slate-800 text-sm">Tanya Jawab Seputar Penanganan Komplain</h3>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={idx} className="transition">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition"
                >
                  <span className="text-xs md:text-sm font-bold text-slate-800">
                    {faq.question}
                  </span>
                  <div
                    className={`w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 transition-transform ${
                      isOpen ? 'rotate-180 bg-[#F2EDFF] text-[#7047EB]' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-slate-50/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal & Consumer Protection Advice */}
      <div className="p-5 rounded-2xl bg-white border border-[#E9E8F0] shadow-2xs space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-slate-700" />
          <h4 className="text-xs font-bold text-slate-800">
            Catatan Hukum & UU Perlindungan Konsumen No. 8/1999
          </h4>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          Konsumen berhak atas informasi yang benar, jelas, dan jujur mengenai kondisi barang, serta hak untuk mendapatkan ganti rugi jika barang yang diterima tidak sesuai dengan perjanjian atau dalam keadaan rusak. Menyediakan mekanisme penanganan komplain yang ramah dan terstruktur seperti di Sabarin.ai menghindarkan bisnis Anda dari risiko sanksi perlindungan konsumen dan menjaga reputasi usaha jangka panjang.
        </p>
      </div>
    </div>
  );
};
