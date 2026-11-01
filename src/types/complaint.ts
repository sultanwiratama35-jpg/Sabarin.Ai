export type ChannelType = 'whatsapp' | 'marketplace' | 'google_maps';

export type UrgencyLevel = 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';

export type ComplaintCategory =
  | 'Kualitas Produk'
  | 'Logistik & Pengiriman'
  | 'Layanan Pelanggan'
  | 'Pembayaran & Tagihan'
  | 'Pengembalian Barang'
  | 'Pengembalian Dana'
  | 'Keterlambatan'
  | 'Lainnya';

export type ReplyToneTab = 'empathetic' | 'short' | 'personal';

export interface ResolutionOption {
  id: string;
  title: string;
  action: string;
  reason: string;
  benefit: string;
  tradeoff: string;
  conditions: string[];
  recommended: boolean;
}

export interface ComplaintRecord {
  id: string;
  timestamp: string;
  channel: ChannelType;
  rawComplaint: string;
  productContext?: string;
  orderNumber?: string;
  category: ComplaintCategory | string;
  urgency: UrgencyLevel;
  customerEmotion: string;
  problemSummary: string;
  customerExpectation: string;
  missingInformation: string[];
  replies: {
    empathetic: string; // Versi Utama / Empatik
    short: string;      // Lebih Singkat / Profesional
    personal: string;   // Lebih Personal / Hangat & Tegas
  };
  recommendations: ResolutionOption[];
  followUpActions: string[];
  escalationRequired: boolean;
  escalationReason?: string;
  status: 'Belum Ditangani' | 'Dalam Proses' | 'Selesai';
  selectedOptionId?: string;
}

export interface BusinessProfile {
  businessName: string;
  businessType: string;
  businessDescription: string;
  returnPolicy: string;
  refundPolicy: string;
  warrantyPolicy: string;
  maxCompensation: string;
  brandTone: string;
}

export interface SabarCheckItem {
  id: string;
  title: string;
  passed: boolean;
  explanation: string;
}

export interface SabarCheckResult {
  score: number;
  statusText: string;
  summary: string;
  checks: SabarCheckItem[];
  tips: string[];
}
