import { ComplaintRecord, BusinessProfile } from '../types/complaint';

export const DEFAULT_BUSINESS_PROFILE: BusinessProfile = {
  businessName: 'Kue & Hampers Berkah',
  businessType: 'Kuliner & Gift Shop',
  businessDescription: 'Toko kue kering premium, hampers hampers hari raya, dan souvenir pernikahan siap kirim ke seluruh Indonesia.',
  returnPolicy: 'Wajib menyertakan video unboxing utuh tanpa cut dalam kurun waktu 1x24 jam sejak barang diterima.',
  refundPolicy: 'Refund 100% atau penggantian baru bila kesalahan murni dari toko atau kerusakan fatal kemasan luar bersegel.',
  warrantyPolicy: 'Garansi kesegaran produk 7 hari setelah pengiriman tiba.',
  maxCompensation: 'Voucher diskon belanja berikutnya maksimal 20% (maks. Rp 50.000) untuk komplain keterlambatan kurir.',
  brandTone: 'Hangat, ramah, sopan, namun tegas memegang prosedur verifikasi.',
};

export const SAMPLE_COMPLAINTS = [
  {
    channel: 'whatsapp' as const,
    product: 'Hampers Keramik Spesial',
    orderNumber: 'WA-882190',
    text: 'Barangnya sudah sampai, tapi kondisinya rusak dan kemasannya juga penyok banget. Kecewa sih, soalnya ini buat kado besok. Gimana solusinya?',
    label: 'Paket Kado Rusak (WhatsApp)',
  },
  {
    channel: 'marketplace' as const,
    product: 'Paket Nasi Kebuli 5 Porsi',
    orderNumber: 'TRX-99214',
    text: 'Pesanan nasi kebuli untuk makan siang kantor baru sampai setelah 2 jam lebih! Makanan udah dingin dan sambalnya tumpah berantakan kena tas pengirim. Bos saya komplain keras. Minta refund sekarang atau saya posting di Instagram!',
    label: 'Makanan Terlambat & Dingin (Marketplace)',
  },
  {
    channel: 'google_maps' as const,
    product: 'Dine-in Resto',
    orderNumber: '-',
    text: 'Pelayanan kasirnya jutek banget! Ditanya promo malah dijawab ketus sambil main HP. Padahal makanan lumayan enak tapi kapok balik lagi kalau karyawan ga punya sopan santun gini. Bintang 1 dulu sampai ada perbaikan.',
    label: 'Review Bintang 1 Kasir Ketus (Google Maps)',
  },
  {
    channel: 'marketplace' as const,
    product: 'Gamis Silk Premium Sage Green',
    orderNumber: 'INV-2026-778',
    text: 'Kak ini gamisnya ukuran XL tapi kok sempit banget kayak ukuran M ya? Jahitan di bagian ketiak juga lepas. Mau tukar ukuran dan tolong ongkir ditanggung seller karena admin salah info size chart.',
    label: 'Salah Ukuran & Jahitan Lepas (Marketplace)',
  },
];

export const INITIAL_COMPLAINT_HISTORY: ComplaintRecord[] = [
  {
    id: 'comp-001',
    timestamp: 'Baru saja',
    channel: 'whatsapp',
    rawComplaint:
      'Barangnya sudah sampai, tapi kondisinya rusak dan kemasannya juga penyok banget. Kecewa sih, soalnya ini buat kado besok. Gimana solusinya?',
    productContext: 'Hampers Keramik Spesial',
    orderNumber: 'WA-882190',
    category: 'Kualitas Produk',
    urgency: 'Tinggi',
    customerEmotion: 'Kecewa & Cemas',
    problemSummary: 'Produk diterima dalam kondisi rusak dan kemasan penyok, dibutuhkan solusi cepat untuk keperluan kado esok hari.',
    customerExpectation: 'Penggantian cepat sebelum acara besok atau solusi pertanggungjawaban jelas.',
    missingInformation: ['Foto kondisi barang yang rusak', 'Foto kemasan luar dan label resi pengiriman'],
    replies: {
      empathetic:
        'Halo Kak, terima kasih sudah menghubungi kami dan memberikan informasi terkait kondisi produk yang diterima. 🙏\n\nKami turut prihatin atas ketidaknyamanan ini, terutama karena produk tersebut dibutuhkan untuk kado besok. Mohon maaf atas kondisi produk yang rusak.\n\nUntuk solusi terbaik, kami siap membantu dengan penggantian produk baru atau pengembalian dana sesuai pilihan Kakak.\n\nMohon kesediaannya untuk mengirimkan foto produk yang diterima agar kami bisa segera memprosesnya, ya. Terima kasih atas pengertiannya. 😊',
      short:
        'Halo Kak, mohon maaf atas kondisi paket yang rusak. Kami sangat memahami kebutuhan kado Kakak untuk esok hari. Mohon kirimkan foto produk serta resi pengiriman agar segera kami proseskan kirim ulang instan / refund hari ini juga. Terima kasih.',
      personal:
        'Duh Kak, kami mohon maaf sebesar-besarnya ya! Ikut sedih dengarnya apalagi buat kado besok. Kakak tenang dulu ya, toko kami tanggung jawab penuh kok. Boleh minta foto barang yang rusak dan nomor pesanannya sebentar? Biar langsung kami siapin barang gantinya sekarang juga!',
    },
    recommendations: [
      {
        id: 'opt-1',
        title: 'Opsi 1 — Penggantian Produk',
        action: 'Kirim produk baru tanpa biaya tambahan.',
        reason: 'Menjaga kepuasan pelanggan dan menyelamatkan momen kado esok hari, serta memulihkan reputasi toko.',
        benefit: 'Tingkat retensi pelanggan tetap tinggi dan reputasi toko terjaga.',
        tradeoff: 'Toko menanggung biaya produksi ganti dan ongkos kirim ekspres.',
        conditions: ['Pelanggan mengirimkan bukti foto/video kerusakan', 'Stok varian yang sama tersedia di gudang'],
        recommended: true,
      },
      {
        id: 'opt-2',
        title: 'Opsi 2 — Pengembalian Dana',
        action: 'Kembalikan dana sesuai metode pembayaran.',
        reason: 'Solusi cepat apabila pengiriman baru tidak mungkin tiba tepat waktu sebelum acara kado esok hari.',
        benefit: 'Masalah terselesaikan tuntas tanpa risiko keterlambatan pengiriman kedua.',
        tradeoff: 'Pendapatan dari transaksi ini hilang.',
        conditions: ['Pelanggan tidak bersedia menunggu pengiriman baru'],
        recommended: false,
      },
      {
        id: 'opt-3',
        title: 'Opsi 3 — Kompensasi Tambahan',
        action: 'Berikan voucher diskon (mis. 10-15%) untuk pembelian berikutnya.',
        reason: 'Menjaga hubungan jangka panjang dan memberikan itikad baik ekstra atas kekecewaan pelanggan.',
        benefit: 'Mendorong repeat purchase di masa mendatang.',
        tradeoff: 'Margin keuntungan pada pembelian berikutnya sedikit berkurang.',
        conditions: ['Diberikan setelah solusi utama (ganti/refund) disepakati bersama'],
        recommended: false,
      },
    ],
    followUpActions: [
      'Minta foto jelas kondisi produk dan kemasan luar.',
      'Konfirmasi solusi sesuai pilihan pelanggan (ganti produk cepat via kurir instan atau refund).',
      'Proses klaim asuransi ekspedisi jika kerusakan disebabkan oleh penanganan kurir.',
      'Lakukan follow-up konfirmasi dalam 24 jam setelah penanganan.',
    ],
    escalationRequired: false,
    status: 'Dalam Proses',
    selectedOptionId: 'opt-1',
  },
  {
    id: 'comp-002',
    timestamp: 'Kemarin, 14:20',
    channel: 'marketplace',
    rawComplaint:
      'Pesanan nasi kebuli untuk makan siang kantor baru sampai setelah 2 jam lebih! Makanan udah dingin dan sambalnya tumpah berantakan kena tas pengirim. Bos saya komplain keras. Minta refund sekarang atau saya posting di Instagram!',
    productContext: 'Paket Nasi Kebuli 5 Porsi',
    orderNumber: 'TRX-99214',
    category: 'Logistik & Pengiriman',
    urgency: 'Kritis',
    customerEmotion: 'Marah & Terancam Publik',
    problemSummary: 'Pengiriman makanan kantor terlambat 2 jam, makanan dingin dan kemasan sambal tumpah. Pelanggan mengancam viralisasi media sosial.',
    customerExpectation: 'Refund penuh secara instan dan permohonan maaf resmi kepada pihak kantor.',
    missingInformation: ['Bukti foto kemasan tumpah', 'Catatan driver kurir'],
    replies: {
      empathetic:
        'Selamat siang Bapak/Ibu, terima kasih sudah segera mengabarkan kepada kami. Kami sangat memahami kekecewaan dan rasa malu di hadapan pimpinan kantor karena pesanan makan siang yang terlambat dan kondisinya tidak memuaskan. Kami memohon maaf sebesar-besarnya atas insiden ini.\n\nKami mengutamakan penyelesaian terbaik bagi kantor Anda. Tim kami siap memproseskan pengembalian dana (refund) penuh atas pesanan ini segera setelah verifikasi nomor pesanan. Mohon konfirmasi nomor rekening/dompet digital Anda agar dapat kami transfer sekarang juga.',
      short:
        'Yth. Pelanggan, kami mohon maaf atas keterlambatan fatal dan tumpahnya sambal pada pesanan kantor Anda. Kami segera memproses full refund hari ini juga. Mohon nomor invoice dan rincian rekening untuk transfer langsung.',
      personal:
        'Bapak/Ibu, kami sangat menyesal dan merasa bersalah atas keterlambatan 2 jam ini. Kami mengerti situasi di hadapan rekan kerja dan pimpinan kantor. Tolong izinkan kami bertanggung jawab penuh dengan refund 100% saat ini juga ya Pak/Bu.',
    },
    recommendations: [
      {
        id: 'opt-2-1',
        title: 'Opsi 1 — Full Refund Langsung',
        action: 'Proses pengembalian dana 100% tanpa menunda.',
        reason: 'Menghindari eskalasi ke ranah publik/media sosial yang dapat mencoreng reputasi restoran.',
        benefit: 'Meredam emosi pelanggan seketika dan menutup risiko viral negatif.',
        tradeoff: 'Kehilangan omzet makanan dan biaya bahan 5 porsi.',
        conditions: ['Konfirmasi nomor transaksi valid'],
        recommended: true,
      },
      {
        id: 'opt-2-2',
        title: 'Opsi 2 — Kirim Menu Pengganti & Surat Maaf',
        action: 'Kirimkan paket cemilan sore / hidangan penutup gratis ke kantor bersama surat permohonan maaf resmi.',
        reason: 'Mengembalikan kredibilitas pelanggan di mata pimpinannya.',
        benefit: 'Bisa mengubah kekecewaan menjadi simpati atas pelayanan pemulihan prima.',
        tradeoff: 'Memerlukan biaya logistik tambahan hari ini.',
        conditions: ['Pelanggan masih berada di kantor yang sama'],
        recommended: false,
      },
    ],
    followUpActions: [
      'Hubungi kurir dan laporkan kendala ke platform marketplace.',
      'Transfer refund secepatnya dalam < 15 menit.',
      'Kirimkan bukti transfer dan pastikan pelanggan sudah merasa tenang.',
    ],
    escalationRequired: true,
    escalationReason: 'Ancaman viralisasi di media sosial dan melibatkan relasi bisnis kantor pelanggan.',
    status: 'Selesai',
    selectedOptionId: 'opt-2-1',
  },
  {
    id: 'comp-003',
    timestamp: '3 hari lalu',
    channel: 'google_maps',
    rawComplaint:
      'Pelayanan kasirnya jutek banget! Ditanya promo malah dijawab ketus sambil main HP. Padahal makanan lumayan enak tapi kapok balik lagi kalau karyawan ga punya sopan santun gini. Bintang 1 dulu sampai ada perbaikan.',
    productContext: 'Kunjungan Dine-in Cafe',
    orderNumber: '-',
    category: 'Layanan Pelanggan',
    urgency: 'Sedang',
    customerEmotion: 'Kecewa & Tersinggung',
    problemSummary: 'Pelanggan merasa dilayani dengan ketus oleh staf kasir yang bermain HP saat melayani, mengakibatkan review bintang 1 di Google Maps.',
    customerExpectation: 'Permohonan maaf publik, evaluasi kedisiplinan staf, dan penawaran itikad baik.',
    missingInformation: ['Hari & jam perkiraan kunjungan pelanggan untuk cek rekaman CCTV internal'],
    replies: {
      empathetic:
        'Halo Kak, terima kasih atas ulasan dan masukan berharganya untuk kafe kami. Kami dengan tulus memohon maaf atas perlakuan staf kasir kami yang tidak ramah dan sibuk dengan ponsel saat melayani Kakak. Hal ini sama sekali tidak mencerminkan standar pelayanan keramahan kami.\n\nMasukan Kakak telah kami jadikan bahan evaluasi dan pembinaan langsung bagi staf terkait hari ini. Kami berharap memiliki kesempatan untuk menyambut Kakak kembali dengan pengalaman yang jauh lebih hangat dan menyenangkan.',
      short:
        'Terima kasih atas masukannya Kak. Kami memohon maaf atas ketidaknyamanan akibat sikap kasir kami. Tim kami telah melakukan evaluasi dan briefing kedisiplinan agar hal ini tidak terulang kembali.',
      personal:
        'Halo Kak, sedih sekali membaca pengalaman Kakak ini. Terima kasih sudah menegur kami dengan jujur. Pihak manajemen sudah menegur dan membina staf kasir kami agar melayani dengan senyum dan perhatian penuh. Semoga Kakak berkenan mampir kembali ya Kak.',
    },
    recommendations: [
      {
        id: 'opt-3-1',
        title: 'Opsi 1 — Balas Review Publik dengan Elegan',
        action: 'Tulis balasan publik yang sopan, akui kelalaian tanpa membela diri, dan jelaskan langkah perbaikan.',
        reason: 'Review Google Maps dibaca oleh calon pelanggan lain. Balasan pemilik yang bijak membuktikan kafe peduli terhadap konsumen.',
        benefit: 'Membangun impresi profesional bagi audiens yang membaca Google Maps.',
        tradeoff: 'Tidak langsung menghapus rating bintang 1, namun menetralisir dampaknya.',
        conditions: ['Tidak boleh mendebat atau menyalahkan pelanggan di ruang publik'],
        recommended: true,
      },
      {
        id: 'opt-3-2',
        title: 'Opsi 2 — Evaluasi & Briefing Internal Tim',
        action: 'Buat aturan ketat larangan penggunaan ponsel pribadi bagi staf frontline saat bertugas.',
        reason: 'Menuntaskan akar masalah agar tidak ada komplain serupa di masa depan.',
        benefit: 'Meningkatkan standar operasional dan kepuasan tamu secara berkelanjutan.',
        tradeoff: 'Perlu komitmen pengawasan harian dari supervisor.',
        conditions: ['Dijalankan di internal seluruh shift toko'],
        recommended: false,
      },
    ],
    followUpActions: [
      'Posting balasan diplomatis di dashboard Google Business Profile.',
      'Briefing harian seluruh staf kasir dan barista mengenai sopan santun.',
      'Pantau jika ada respon susulan dari pengulas.',
    ],
    escalationRequired: false,
    status: 'Selesai',
    selectedOptionId: 'opt-3-1',
  },
];
