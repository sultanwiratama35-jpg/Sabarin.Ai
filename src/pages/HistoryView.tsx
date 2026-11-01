import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  ShoppingBag,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { ComplaintRecord, ChannelType, UrgencyLevel } from '../types/complaint';

interface HistoryViewProps {
  history: ComplaintRecord[];
  onSelectComplaint: (complaint: ComplaintRecord) => void;
  onUpdateStatus: (id: string, newStatus: 'Belum Ditangani' | 'Dalam Proses' | 'Selesai') => void;
  onStartNewComplaint: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelectComplaint,
  onUpdateStatus,
  onStartNewComplaint,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filtered = history.filter((item) => {
    const matchesSearch =
      item.rawComplaint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.productContext && item.productContext.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.problemSummary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel = selectedChannel === 'all' || item.channel === selectedChannel;
    const matchesUrgency = selectedUrgency === 'all' || item.urgency === selectedUrgency;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesChannel && matchesUrgency && matchesStatus;
  });

  const getChannelBadge = (ch: ChannelType) => {
    switch (ch) {
      case 'whatsapp':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            <MessageSquare className="w-3 h-3" /> WhatsApp
          </span>
        );
      case 'marketplace':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
            <ShoppingBag className="w-3 h-3" /> Marketplace
          </span>
        );
      case 'google_maps':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            <MapPin className="w-3 h-3" /> Google Maps
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-slate-800 tracking-tight">
            Riwayat Komplain Pelanggan
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">
            Daftar seluruh komplain yang telah dianalisis bersama catatan status penyelesaian.
          </p>
        </div>
        <button
          onClick={onStartNewComplaint}
          className="px-4 py-2.5 rounded-xl bg-[#7047EB] hover:bg-[#5632C8] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition self-start sm:self-center"
        >
          <Sparkles className="w-4 h-4" />
          <span>+ Tangani Komplain Baru</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-2xl border border-[#E9E8F0] p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search box */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan kata kunci, produk, atau rangkuman masalah..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:border-[#7047EB] focus:bg-white transition"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {/* Channel filter */}
            <select
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#7047EB]"
            >
              <option value="all">Semua Kanal</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="marketplace">Marketplace</option>
              <option value="google_maps">Google Maps</option>
            </select>

            {/* Urgency filter */}
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#7047EB]"
            >
              <option value="all">Semua Urgensi</option>
              <option value="Kritis">Kritis</option>
              <option value="Tinggi">Tinggi</option>
              <option value="Sedang">Sedang</option>
              <option value="Rendah">Rendah</option>
            </select>

            {/* Status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-hidden focus:border-[#7047EB]"
            >
              <option value="all">Semua Status</option>
              <option value="Belum Ditangani">Belum Ditangani</option>
              <option value="Dalam Proses">Dalam Proses</option>
              <option value="Selesai">Selesai</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaints List / Table */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E9E8F0] p-12 text-center shadow-xs">
          <Clock className="w-10 h-10 mx-auto text-slate-300 mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">Tidak ada riwayat komplain yang cocok</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian atau reset filter untuk melihat data lainnya.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#E9E8F0] shadow-xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5">Tanggal & Kanal</th>
                  <th className="px-6 py-3.5">Kategori & Masalah</th>
                  <th className="px-6 py-3.5">Urgensi & Emosi</th>
                  <th className="px-6 py-3.5">Status Penanganan</th>
                  <th className="px-6 py-3.5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition group">
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{item.timestamp}</div>
                      <div className="mt-1">{getChannelBadge(item.channel)}</div>
                    </td>
                    <td className="px-6 py-4 align-top max-w-md">
                      <div className="font-bold text-slate-800">{item.category}</div>
                      <p className="text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        &quot;{item.rawComplaint}&quot;
                      </p>
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <div>
                        <span
                          className={`inline-block font-extrabold text-[11px] px-2 py-0.5 rounded-md ${
                            item.urgency === 'Kritis'
                              ? 'bg-rose-100 text-rose-700'
                              : item.urgency === 'Tinggi'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {item.urgency}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Emosi: {item.customerEmotion}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top whitespace-nowrap">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value as any)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                          item.status === 'Selesai'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : item.status === 'Dalam Proses'
                            ? 'bg-indigo-50 text-[#7047EB] border-indigo-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        <option value="Belum Ditangani">Belum Ditangani</option>
                        <option value="Dalam Proses">Dalam Proses</option>
                        <option value="Selesai">Selesai</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 align-top text-right whitespace-nowrap">
                      <button
                        onClick={() => onSelectComplaint(item)}
                        className="px-3 py-1.5 rounded-lg bg-[#F2EDFF] hover:bg-[#7047EB] text-[#7047EB] hover:text-white font-bold text-xs inline-flex items-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Buka Draf</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  {getChannelBadge(item.channel)}
                  <span className="text-[11px] text-slate-400">{item.timestamp}</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{item.category}</h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    &quot;{item.rawComplaint}&quot;
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        item.urgency === 'Kritis' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {item.urgency}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.customerEmotion}</span>
                  </div>
                  <button
                    onClick={() => onSelectComplaint(item)}
                    className="px-3 py-1 rounded-lg bg-[#7047EB] text-white text-xs font-bold"
                  >
                    Buka
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
