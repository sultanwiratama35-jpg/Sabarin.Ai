import { ComplaintRecord, BusinessProfile, SabarCheckResult, ChannelType } from '../types/complaint';
import { INITIAL_COMPLAINT_HISTORY, DEFAULT_BUSINESS_PROFILE } from './mockData';

const HISTORY_KEY = 'sabarin_complaints_history';
const PROFILE_KEY = 'sabarin_business_profile';

export function getStoredProfile(): BusinessProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read profile from localStorage', e);
  }
  return DEFAULT_BUSINESS_PROFILE;
}

export function saveStoredProfile(profile: BusinessProfile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function getStoredHistory(): ComplaintRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw !== null) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to read complaints history from localStorage', e);
  }
  // Initialize with realistic seed history if not previously set
  saveStoredHistory(INITIAL_COMPLAINT_HISTORY);
  return INITIAL_COMPLAINT_HISTORY;
}

export function saveStoredHistory(history: ComplaintRecord[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error('Failed to save complaints history to localStorage', e);
  }
}

export function addComplaintToHistory(complaint: ComplaintRecord): void {
  const current = getStoredHistory();
  const updated = [complaint, ...current.filter((c) => c.id !== complaint.id)];
  saveStoredHistory(updated);
}

export function updateComplaintInHistory(complaint: ComplaintRecord): void {
  const current = getStoredHistory();
  const index = current.findIndex((c) => c.id === complaint.id);
  if (index !== -1) {
    current[index] = complaint;
    saveStoredHistory([...current]);
  } else {
    addComplaintToHistory(complaint);
  }
}

export function deleteComplaintFromHistory(id: string): ComplaintRecord[] {
  const current = getStoredHistory();
  const updated = current.filter((c) => c.id !== id);
  saveStoredHistory(updated);
  return updated;
}

export function clearAllComplaintHistory(): void {
  saveStoredHistory([]);
}

/**
 * Intelligent local simulation engine that creates realistic, contextual Indonesian UMKM resolutions
 * if Gemini API key is not yet configured or if server is in demo mode.
 */
export function generateLocalSimulation(
  complaintText: string,
  channel: ChannelType,
  productContext?: string,
  orderNumber?: string,
  profile?: BusinessProfile
): ComplaintRecord {
  const lower = complaintText.toLowerCase();

  let category = 'Kualitas Produk';
  let urgency: 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis' = 'Tinggi';
  let customerEmotion = 'Kecewa';
  let escalationRequired = false;
  let escalationReason = '';

  if (lower.includes('viral') || lower.includes('instagram') || lower.includes('lapor') || lower.includes('somasi') || lower.includes('bintang 1')) {
    urgency = 'Kritis';
    customerEmotion = 'Marah & Mengancam Publik';
    escalationRequired = true;
    escalationReason = 'Pelanggan menyebut potensi eskalasi publik / media sosial.';
  } else if (lower.includes('terlambat') || lower.includes('telat') || lower.includes('lama') || lower.includes('kurir') || lower.includes('jam')) {
    category = 'Logistik & Pengiriman';
    urgency = 'Sedang';
    customerEmotion = 'Frustrasi & Khawatir';
  } else if (lower.includes('kasir') || lower.includes('jutek') || lower.includes('pelayanan') || lower.includes('admin') || lower.includes('ketus')) {
    category = 'Layanan Pelanggan';
    urgency = 'Sedang';
    customerEmotion = 'Kecewa & Tersinggung';
  } else if (lower.includes('ukuran') || lower.includes('size') || lower.includes('warna') || lower.includes('salah')) {
    category = 'Pengembalian Barang';
    urgency = 'Sedang';
    customerEmotion = 'Bingung & Kecewa';
  } else if (lower.includes('rusak') || lower.includes('pecah') || lower.includes('basi') || lower.includes('cacat') || lower.includes('penyok')) {
    category = 'Kualitas Produk';
    urgency = 'Tinggi';
    customerEmotion = 'Kecewa & Mendesak';
  }

  const channelGreeting =
    channel === 'whatsapp'
      ? 'Halo Kak, terima kasih sudah menghubungi kami.'
      : channel === 'marketplace'
      ? 'Yth. Pelanggan, terima kasih atas laporannya pada pesanan ini.'
      : 'Halo Kak, terima kasih atas ulasan dan masukan berharganya untuk bisnis kami.';

  const replies = channel === 'whatsapp'
    ? {
        empathetic: `Halo Kak, terima kasih sudah kabari kami ya. 🙏\n\nKami mohon maaf banget atas ketidaknyamanan yang dialami terkait ${productContext || 'pesanan Kakak'}. Toko kami pasti tanggung jawab penuh kok agar Kakak tetap tenang dan puas. 😊\n\nBoleh minta tolong kirimkan foto/video produk yang berkendala ya Kak? Biar langsung tim kami bantu siapkan penggantian baru atau pengembalian dana hari ini juga. Makasih banyak atas kesabaran dan kebaikannya ya Kak! 🙏✨`,
        short: `Halo Kak, mohon maaf banget atas kendala pada pesanan ini ya. 🙏 Toko kami siap bantu proseskan ganti baru atau refund secepatnya. Boleh kirimkan foto produk dan nomor pesanannya ya Kak? Makasih banyak! 😊`,
        personal: `Duh Kak, mohon maaf banget ya atas ketidaknyamanan ini! Kami ikut nyesek dengarnya. 🥺 Kakak jangan khawatir ya, kami dari pihak toko pasti tanggung jawab penuh kok. Boleh dibantu kirim foto barangnya sebentar ya Kak? Biar langsung kami siapin solusinya sekarang juga! Makasih ya Kak. 🙏😊`,
      }
    : {
        empathetic: `${channelGreeting} 🙏\n\nKami sangat memahami kekecewaan dan ketidaknyamanan yang dialami terkait ${productContext || 'pesanan Anda'}. Kami memohon maaf yang sebesar-besarnya atas kendala ini.\n\nToko kami bertanggung jawab penuh untuk memastikan Anda mendapatkan solusi terbaik tanpa dipersulit. Mohon berkenan mengirimkan foto/video kondisi produk serta label resi pengiriman agar tim kami dapat segera memproseskan penggantian baru atau pengembalian dana secepatnya.\n\nTerima kasih banyak atas kesabaran dan pengertian Anda. 😊`,
        short: `${channelGreeting} Kami memohon maaf atas kendala pada pesanan ini. Toko kami siap memproseskan penggantian unit baru atau pengembalian dana penuh hari ini juga. Mohon kirimkan foto bukti produk dan nomor resi untuk verifikasi instan. Terima kasih.`,
        personal: `Duh Kak, mohon maaf banget ya atas ketidaknyamanan ini! Kami ikut nyesek dengarnya. Jangan khawatir ya, kami dari pihak toko siap tanggung jawab penuh sampai tuntas. Boleh dibantu kirim foto barangnya sebentar Kak? Biar langsung kami atur solusinya sekarang juga!`,
      };

  const recommendations = [
    {
      id: 'opt-local-1',
      title: 'Opsi 1 — Penggantian Produk',
      action: 'Kirim produk baru tanpa biaya tambahan.',
      reason: 'Menjaga kepuasan pelanggan dan mempertahankan reputasi toko di marketplace.',
      benefit: 'Pelanggan merasa dihargai dan potensi ulasan buruk/viral dapat dinetralisir.',
      tradeoff: 'Toko menanggung biaya ganti dan biaya pengiriman ulang.',
      conditions: ['Pelanggan bersedia melampirkan foto/video bukti kerusakan', 'Stok varian produk tersedia'],
      recommended: true,
    },
    {
      id: 'opt-local-2',
      title: 'Opsi 2 — Pengembalian Dana',
      action: 'Kembalikan dana sesuai metode pembayaran.',
      reason: 'Solusi cepat apabila pelanggan sudah tidak ingin menunggu atau produk pengganti habis.',
      benefit: 'Masalah terselesaikan seketika tanpa risiko pengiriman ulang bermasalah.',
      tradeoff: 'Pendapatan dari transaksi ini tidak terealisasi.',
      conditions: ['Pelanggan menolak pengiriman barang pengganti'],
      recommended: false,
    },
    {
      id: 'opt-local-3',
      title: 'Opsi 3 — Kompensasi Tambahan',
      action: 'Berikan voucher diskon (mis. 10-15%) untuk pembelian berikutnya.',
      reason: 'Bentuk itikad baik ekstra untuk memulihkan kepercayaan konsumen dalam jangka panjang.',
      benefit: 'Mendorong pelanggan untuk tetap berbelanja kembali di masa depan.',
      tradeoff: 'Margin laba pesanan berikutnya sedikit berkurang.',
      conditions: ['Diberikan setelah kesepakatan solusi utama selesai'],
      recommended: false,
    },
  ];

  const followUpActions = [
    'Minta foto jelas kondisi produk dan kemasan luar.',
    'Konfirmasi solusi sesuai pilihan pelanggan (ganti produk baru atau refund dana).',
    'Proses penggantian atau refund sesuai prosedur yang disepakati.',
    'Lakukan follow-up konfirmasi dalam 24 jam setelah penanganan selesai.',
  ];

  return {
    id: `comp-${Date.now()}`,
    timestamp: 'Baru saja',
    channel,
    rawComplaint: complaintText,
    productContext: productContext || 'Produk Pesanan',
    orderNumber: orderNumber || '-',
    category,
    urgency,
    customerEmotion,
    problemSummary: `Pelanggan mengalami kendala pada produk/layanan: "${complaintText.slice(0, 80)}..." dan memerlukan penanganan segera.`,
    customerExpectation: 'Penjelasan sopan, penanganan cepat, dan opsi ganti rugi atau penggantian yang adil.',
    missingInformation: ['Foto bukti kendala / video unboxing', 'Konfirmasi resi pengiriman'],
    replies,
    recommendations,
    followUpActions,
    escalationRequired,
    escalationReason,
    status: 'Belum Ditangani',
    selectedOptionId: 'opt-local-1',
  };
}

/**
 * Main Analysis Dispatcher: Calls Server API (Gemini 3.8 Flash),
 * with seamless graceful fallback to smart local simulation if backend key is unconfigured.
 */
export async function analyzeComplaintWithAI(
  complaintText: string,
  channel: ChannelType,
  productContext?: string,
  orderNumber?: string,
  businessProfile?: BusinessProfile
): Promise<{ complaint: ComplaintRecord; isSimulation: boolean; message?: string }> {
  try {
    const res = await fetch('/api/gemini/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complaintText,
        channel,
        productContext,
        orderNumber,
        businessProfile,
      }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        const newRecord: ComplaintRecord = {
          id: `comp-${Date.now()}`,
          timestamp: 'Baru saja',
          channel,
          rawComplaint: complaintText,
          productContext,
          orderNumber,
          category: d.category || 'Kualitas Produk',
          urgency: (['Rendah', 'Sedang', 'Tinggi', 'Kritis'].includes(d.urgency) ? d.urgency : 'Tinggi') as any,
          customerEmotion: d.customerEmotion || 'Kecewa',
          problemSummary: d.problemSummary || 'Keluhan pelanggan memerlukan perhatian segera.',
          customerExpectation: d.customerExpectation || 'Solusi terbaik dari pihak toko.',
          missingInformation: Array.isArray(d.missingInformation) ? d.missingInformation : [],
          replies: {
            empathetic: d.replies?.empathetic || '',
            short: d.replies?.short || '',
            personal: d.replies?.personal || '',
          },
          recommendations: (d.recommendations || []).map((rec: any, idx: number) => ({
            id: rec.id || `opt-${idx + 1}`,
            title: rec.title || `Opsi ${idx + 1}`,
            action: rec.action || '',
            reason: rec.reason || '',
            benefit: rec.benefit || '',
            tradeoff: rec.tradeoff || '',
            conditions: Array.isArray(rec.conditions) ? rec.conditions : [],
            recommended: Boolean(rec.recommended),
          })),
          followUpActions: Array.isArray(d.followUpActions) ? d.followUpActions : [],
          escalationRequired: Boolean(d.escalationRequired),
          escalationReason: d.escalationReason || '',
          status: 'Belum Ditangani',
          selectedOptionId: d.recommendations?.find((r: any) => r.recommended)?.id || d.recommendations?.[0]?.id,
        };

        addComplaintToHistory(newRecord);
        return { complaint: newRecord, isSimulation: false };
      }
    }
  } catch (err) {
    console.warn('Backend API unavailable or error, switching to smart local simulation', err);
  }

  // Graceful fallback simulation
  const localRecord = generateLocalSimulation(
    complaintText,
    channel,
    productContext,
    orderNumber,
    businessProfile
  );
  addComplaintToHistory(localRecord);
  return {
    complaint: localRecord,
    isSimulation: true,
    message: 'Hasil dihasilkan dengan Mode Cepat Simulasi Sabarin.ai.',
  };
}

/**
 * Sabar Check verification
 */
export async function runSabarCheck(
  draftText: string,
  complaintContext: string
): Promise<SabarCheckResult> {
  try {
    const res = await fetch('/api/gemini/sabar-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ draftText, complaintContext }),
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json = await res.json();
      if (json.data && json.data.score) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Sabar check API error, using local check', err);
  }

  // Local rule-based Sabar Check
  const lower = draftText.toLowerCase();
  const hasBlame = lower.includes('salah anda') || lower.includes('bukan salah kami') || lower.includes('jangan salahkan');
  const hasApology = lower.includes('maaf') || lower.includes('mohon maaf') || lower.includes('prihatin');
  const hasAction = lower.includes('solusi') || lower.includes('bantu') || lower.includes('proses') || lower.includes('kirim');
  const isTooShort = draftText.trim().length < 25;

  const checks = [
    {
      id: '1',
      title: 'Nada Tidak Defensif & Santun',
      passed: !hasBlame,
      explanation: !hasBlame
        ? 'Bagus! Pesan tidak menyangkal atau menyalahkan pembeli secara reaktif.'
        : 'Perhatian: Ada indikasi kalimat yang terkesan menyangkal atau mendebat pembeli.',
    },
    {
      id: '2',
      title: 'Unsur Empati & Permohonan Maaf',
      passed: hasApology,
      explanation: hasApology
        ? 'Draf memuat itikad baik dan permohonan maaf atas ketidaknyamanan.'
        : 'Saran: Tambahkan kata maaf atau empati di awal pesan agar pembeli merasa didengarkan.',
    },
    {
      id: '3',
      title: 'Penawaran Solusi Jelas',
      passed: hasAction && !isTooShort,
      explanation: hasAction
        ? 'Terdapat komitmen solusi konkret dan petunjuk langkah berikutnya.'
        : 'Draf perlu memperjelas opsi solusi atau verifikasi yang ditawarkan.',
    },
    {
      id: '4',
      title: 'Proteksi Risiko Toko',
      passed: true,
      explanation: 'Pesan meminta bukti verifikasi foto/resi terlebih dahulu sebelum janji ganti rugi permanen.',
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return {
    score,
    statusText: score >= 75 ? 'Sangat Aman Dikirim' : 'Perlu Penyesuaian Santun',
    summary:
      score >= 75
        ? 'Draf balasan ini sudah memenuhi standar diplomasi bisnis: tenang, sopan, dan menjaga martabat toko.'
        : 'Sebaiknya perbaiki beberapa kalimat yang berpotensi memancing emosi lanjutan dari pelanggan.',
    checks,
    tips: [
      'Gunakan emotikon secukupnya (🙏, 😊) untuk mencairkan ketegangan di WhatsApp.',
      'Hindari mengetik dengan huruf kapital (Caps Lock) karena terkesan berteriak.',
      'Balas dalam waktu < 30 menit agar emosi pelanggan tidak meluap.',
    ],
  };
}
