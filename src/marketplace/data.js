// Dummy data shaped like what the Ukirama ERP API would return.
// In the real app every list here is read from Ukirama (source of truth).

export const REGIONS = {
  JBD: { code: 'JBD', name: 'Jabodetabek', leadTime: '1–2 hari kerja', leadDays: [1, 2] },
  JTM: { code: 'JTM', name: 'Jawa Timur', leadTime: '2–3 hari kerja', leadDays: [2, 3] },
  BALI: { code: 'BALI', name: 'Bali & Nusa Tenggara', leadTime: '3–5 hari kerja', leadDays: [3, 5] },
}

export const CATEGORIES = [
  { id: 'dapur', name: 'Dapur & Food Service', icon: 'ChefHat' },
  { id: 'laundry', name: 'Laundry', icon: 'Shirt' },
  { id: 'housekeeping', name: 'Housekeeping', icon: 'SprayCan' },
  { id: 'sanitasi', name: 'Sanitasi & Disinfeksi', icon: 'ShieldPlus' },
  { id: 'solusi', name: 'Solusi & Kontrak', icon: 'Wrench' },
]

// pricingMode: 'price' = harga dari price list Ukirama; 'quote' = selalu lewat penawaran Sales
export const PRODUCTS = [
  {
    slug: 'kitchen-degreaser-pro', name: 'Kitchen Degreaser Pro', category: 'dapur', pricingMode: 'price',
    tint: 'from-sky-100 to-blue-200', rating: 4.9, sold: 1240,
    desc: 'Pembersih lemak dan kerak membandel untuk kitchen hood, kompor, dan lantai dapur komersial.',
    variants: [
      { sku: 'FG-KDP-05', pack: 'Jeriken 5 L', uom: 'jrg', base: 185000 },
      { sku: 'FG-KDP-20', pack: 'Pail 20 L', uom: 'pail', base: 640000 },
    ],
  },
  {
    slug: 'dishwashing-liquid-super', name: 'Dishwashing Liquid Super', category: 'dapur', pricingMode: 'price',
    tint: 'from-cyan-100 to-sky-200', rating: 4.8, sold: 2310,
    desc: 'Sabun cuci piring pekat, aman untuk peralatan makan dan efektif di air sadah.',
    variants: [
      { sku: 'FG-DWS-05', pack: 'Jeriken 5 L', uom: 'jrg', base: 120000 },
      { sku: 'FG-DWS-20', pack: 'Pail 20 L', uom: 'pail', base: 410000 },
    ],
  },
  {
    slug: 'oven-grill-cleaner', name: 'Oven & Grill Cleaner', category: 'dapur', pricingMode: 'price',
    tint: 'from-orange-100 to-amber-200', rating: 4.7, sold: 530,
    desc: 'Formula alkali kuat untuk oven, grill, dan salamander dengan waktu kontak singkat.',
    variants: [{ sku: 'FG-OGC-05', pack: 'Jeriken 5 L', uom: 'jrg', base: 245000 }],
  },
  {
    slug: 'laundry-detergent-liquid', name: 'Laundry Detergent Liquid', category: 'laundry', pricingMode: 'price',
    tint: 'from-indigo-100 to-violet-200', rating: 4.8, sold: 870,
    desc: 'Deterjen cair untuk mesin laundry komersial, cocok untuk linen hotel dan seragam.',
    variants: [
      { sku: 'FG-LDL-20', pack: 'Pail 20 L', uom: 'pail', base: 520000 },
      { sku: 'FG-LDL-200', pack: 'Drum 200 L', uom: 'drum', base: null, quoteOnly: true },
    ],
  },
  {
    slug: 'fabric-softener-fresh', name: 'Fabric Softener Fresh', category: 'laundry', pricingMode: 'price',
    tint: 'from-pink-100 to-rose-200', rating: 4.6, sold: 640,
    desc: 'Pelembut linen dengan aroma segar tahan lama, membantu mengurangi waktu setrika.',
    variants: [{ sku: 'FG-FSF-20', pack: 'Pail 20 L', uom: 'pail', base: 465000 }],
  },
  {
    slug: 'floor-cleaner-pine', name: 'Floor Cleaner Pine Fresh', category: 'housekeeping', pricingMode: 'price',
    tint: 'from-emerald-100 to-teal-200', rating: 4.8, sold: 1980,
    desc: 'Pembersih lantai netral beraroma pinus untuk lobi, koridor, dan area publik.',
    variants: [
      { sku: 'FG-FCP-05', pack: 'Jeriken 5 L', uom: 'jrg', base: 98000 },
      { sku: 'FG-FCP-20', pack: 'Pail 20 L', uom: 'pail', base: 345000 },
    ],
  },
  {
    slug: 'glass-cleaner-crystal', name: 'Glass Cleaner Crystal', category: 'housekeeping', pricingMode: 'price',
    tint: 'from-sky-50 to-cyan-200', rating: 4.7, sold: 760,
    desc: 'Pembersih kaca dan cermin tanpa noda garis, cepat kering.',
    variants: [{ sku: 'FG-GCC-05', pack: 'Jeriken 5 L', uom: 'jrg', base: 89000 }],
  },
  {
    slug: 'hand-soap-antibacterial', name: 'Hand Soap Antibacterial', category: 'housekeeping', pricingMode: 'price',
    tint: 'from-lime-100 to-green-200', rating: 4.9, sold: 2650,
    desc: 'Sabun cuci tangan antibakteri dengan pelembap, untuk toilet tamu dan area staf.',
    variants: [{ sku: 'FG-HSA-05', pack: 'Jeriken 5 L', uom: 'jrg', base: 112000 }],
  },
  {
    slug: 'sanitizer-spray-surface', name: 'Sanitizer Spray Surface', category: 'sanitasi', pricingMode: 'price',
    tint: 'from-teal-100 to-emerald-200', rating: 4.8, sold: 1420,
    desc: 'Sanitizer permukaan food-contact tanpa bilas untuk meja saji dan peralatan dapur.',
    variants: [
      { sku: 'FG-SSS-05', pack: 'Jeriken 5 L', uom: 'jrg', base: 165000 },
      { sku: 'FG-SSS-20', pack: 'Pail 20 L', uom: 'pail', base: 590000 },
    ],
  },
  {
    slug: 'hospital-grade-disinfectant', name: 'Hospital Grade Disinfectant', category: 'sanitasi', pricingMode: 'quote',
    tint: 'from-slate-100 to-slate-300', rating: 4.9, sold: 210,
    desc: 'Disinfektan tingkat rumah sakit. Harga mengikuti spesifikasi, volume, dan dokumen registrasi yang dibutuhkan.',
    quoteReason: 'Harga disesuaikan dengan spesifikasi & volume',
    variants: [{ sku: 'FG-HGD-05', pack: 'Jeriken 5 L', uom: 'jrg', base: null }],
  },
  {
    slug: 'paket-dosing-system', name: 'Paket Dosing System + Chemical Kontrak', category: 'solusi', pricingMode: 'quote',
    tint: 'from-amber-100 to-yellow-200', rating: 5.0, sold: 48,
    desc: 'Pemasangan dosing pump untuk dishwasher/laundry beserta pasokan chemical bulanan dan kunjungan teknisi.',
    quoteReason: 'Butuh survei lokasi',
    variants: [{ sku: 'SV-DOS-01', pack: 'Paket per lokasi', uom: 'paket', base: null }],
  },
]

export const VARIANTS = Object.fromEntries(
  PRODUCTS.flatMap((p) => p.variants.map((v) => [v.sku, { ...v, product: p }])),
)

// Price lists, as maintained in Ukirama.
// General lists are per region; a customer group may get a discount; a customer may have a contract list.
const REGION_FACTOR = { JBD: 1, JTM: 1.04, BALI: 1.1 }
const round = (n) => Math.round(n / 500) * 500

function generalTiers(base, region) {
  const b = base * REGION_FACTOR[region]
  return [
    { min: 1, max: 9, price: round(b) },
    { min: 10, max: 49, price: round(b * 0.95) },
    { min: 50, max: 199, price: round(b * 0.9) },
  ]
}

export const PRICE_LISTS = [
  ...Object.keys(REGIONS).map((r) => ({
    code: `PL-UMUM-${r}`,
    name: `Harga Umum ${REGIONS[r].name}`,
    scope: { region: r },
    items: Object.fromEntries(
      Object.values(VARIANTS).filter((v) => v.base).map((v) => [v.sku, generalTiers(v.base, r)]),
    ),
  })),
  {
    code: 'PL-GRP-HEALTH',
    name: 'Grup Healthcare (−3%)',
    scope: { group: 'healthcare' },
    discount: 0.03,
  },
  {
    code: 'PL-K-HGS-2026',
    name: 'Kontrak Hotel Grand Serpong 2026',
    scope: { customer: 'hgs' },
    regions: ['JBD', 'BALI'],
    items: {
      'FG-KDP-20': [{ min: 1, max: 19, price: 575000 }, { min: 20, max: 99, price: 549000 }, { min: 100, max: 300, price: 525000 }],
      'FG-DWS-20': [{ min: 1, max: 19, price: 368000 }, { min: 20, max: 99, price: 352000 }, { min: 100, max: 300, price: 339000 }],
      'FG-LDL-20': [{ min: 1, max: 29, price: 470000 }, { min: 30, max: 300, price: 449000 }],
      'FG-FCP-20': [{ min: 1, max: 29, price: 309000 }, { min: 30, max: 300, price: 295000 }],
      'FG-SSS-20': [{ min: 1, max: 19, price: 529000 }, { min: 20, max: 300, price: 509000 }],
    },
  },
]

export const PERSONAS = {
  guest: { id: 'guest', label: 'Tamu (belum login)', status: 'guest' },
  hgs: {
    id: 'hgs', status: 'verified', label: 'Hotel Grand Serpong',
    company: 'PT Grand Serpong Hospitality', ukiramaCode: 'C-00412', group: 'hospitality',
    pic: 'Budi Santoso', email: 'purchasing@grandserpong.co.id', phone: '0812-8800-1122',
    sales: 'Andi Pratama', top: 30, creditLimit: 150000000, outstanding: 42500000,
    payments: ['top', 'gateway'],
    addresses: [
      { id: 'hgs-wh', label: 'Gudang Pusat', type: 'warehouse', region: 'JBD', recipient: 'Gudang Purchasing · Pak Dedi', line: 'Jl. Raya Serpong Km 7, Tangerang Selatan', hours: 'Sen–Jum 08.00–16.00' },
      { id: 'hgs-bali', label: 'Cabang Kuta', type: 'branch', region: 'BALI', recipient: 'Engineering Store · Bu Komang', line: 'Jl. Pantai Kuta No. 18, Badung, Bali', hours: 'Setiap hari 09.00–17.00' },
      { id: 'hgs-sby', label: 'Cabang Surabaya', type: 'branch', region: 'JTM', recipient: 'Housekeeping · Pak Hendra', line: 'Jl. Basuki Rahmat 66, Surabaya', hours: 'Sen–Sab 08.00–15.00' },
    ],
  },
  kls: {
    id: 'kls', status: 'verified', label: 'Klinik Sehat Medika',
    company: 'PT Klinik Sehat Medika', ukiramaCode: 'C-01188', group: 'healthcare',
    pic: 'dr. Dewi Lestari', email: 'admin@kliniksehat.id', phone: '0813-3300-4455',
    sales: 'Rina Wulandari', top: 0, creditLimit: 0, outstanding: 0,
    payments: ['gateway'],
    addresses: [
      { id: 'kls-sby', label: 'Klinik Utama', type: 'branch', region: 'JTM', recipient: 'Bagian Umum · Mas Arif', line: 'Jl. Raya Darmo 120, Surabaya', hours: 'Sen–Sab 08.00–20.00' },
    ],
  },
  new: {
    id: 'new', status: 'pending', label: 'CV Laundry Bersih Jaya',
    company: 'CV Laundry Bersih Jaya', ukiramaCode: null, group: 'laundry',
    pic: 'Wayan Sudarma', email: 'owner@bersihjaya.id', phone: '0817-5500-6677',
    sales: null, top: 0, creditLimit: 0, outstanding: 0, npwp: '09.254.294.3-901.000', industry: 'Laundry komersial',
    payments: ['gateway'],
    addresses: [
      { id: 'new-dps', label: 'Workshop Denpasar', type: 'branch', region: 'BALI', recipient: 'Wayan Sudarma', line: 'Jl. Gatot Subroto Barat 210, Denpasar', hours: 'Setiap hari 08.00–18.00' },
    ],
  },
}

export const ORDER_STEPS = [
  { key: 'so', label: 'Sales Order dibuat', who: 'Ukirama · SO' },
  { key: 'invoice', label: 'Invoice terbit', who: 'Ukirama · Faktur penjualan' },
  { key: 'paid', label: 'Pembayaran', who: 'Ukirama · Penerimaan kas' },
  { key: 'packing', label: 'Delivery Order & packing', who: 'Ukirama · DO gudang' },
  { key: 'shipped', label: 'Dalam pengiriman', who: 'Armada / ekspedisi' },
  { key: 'received', label: 'Diterima', who: 'Konfirmasi penerima' },
]

export const STATUS_TABS = [
  { id: 'quote', label: 'Menunggu Penawaran' },
  { id: 'unpaid', label: 'Belum Bayar' },
  { id: 'processing', label: 'Diproses' },
  { id: 'shipped', label: 'Dikirim' },
  { id: 'done', label: 'Selesai' },
  { id: 'cancelled', label: 'Dibatalkan' },
]

function d(day, time) { return `${day} Nov 2026 · ${time}` }

export function seedOrders() {
  return [
    {
      id: 'MKT-2611-0102', ukiramaRef: 'SO/2611/0231', type: 'order', customerId: 'hgs', addressId: 'hgs-wh',
      createdAt: d(3, '09.12'), poNumber: 'PO-GSH-11-031', payment: { method: 'top', label: 'Invoice TOP 30 hari' },
      invoice: { no: 'INV/2611/0188', due: '3 Des 2026', paidAt: d(10, '14.20') },
      shipping: { method: 'Armada iClean', ref: 'Truk B 9123 TQ' },
      items: [{ sku: 'FG-KDP-20', qty: 20, unitPrice: 549000 }, { sku: 'FG-DWS-20', qty: 24, unitPrice: 352000 }],
      stepAt: [d(3, '09.12'), d(3, '10.05'), d(10, '14.20'), d(4, '13.30'), d(5, '07.45'), d(5, '15.10')],
      step: 6, leadTime: '2 hari 6 jam',
    },
    {
      id: 'MKT-2611-0117', ukiramaRef: 'SO/2611/0257', type: 'order', customerId: 'hgs', addressId: 'hgs-bali',
      createdAt: d(13, '10.40'), poNumber: 'PO-GSH-11-044', payment: { method: 'top', label: 'Invoice TOP 30 hari' },
      invoice: { no: 'INV/2611/0214', due: '13 Des 2026' },
      shipping: { method: 'Ekspedisi', ref: 'Resi JNE Trucking 4400 1288 0091' },
      items: [{ sku: 'FG-LDL-20', qty: 30, unitPrice: 449000 }, { sku: 'FG-FSF-20', qty: 12, unitPrice: 511500 }],
      stepAt: [d(13, '10.40'), d(13, '11.15'), null, d(14, '09.00'), d(15, '08.20'), null],
      step: 5,
    },
    {
      id: 'MKT-2611-0125', ukiramaRef: 'SO/2611/0266', type: 'order', customerId: 'hgs', addressId: 'hgs-sby',
      createdAt: d(17, '15.02'), poNumber: 'PO-GSH-11-052', payment: { method: 'top', label: 'Invoice TOP 30 hari' },
      invoice: { no: 'INV/2611/0230', due: '17 Des 2026' },
      shipping: { method: 'Armada iClean', ref: '-' },
      items: [{ sku: 'FG-FCP-20', qty: 15, unitPrice: 341000 }, { sku: 'FG-HSA-05', qty: 20, unitPrice: 110500 }],
      stepAt: [d(17, '15.02'), d(17, '16.10'), null, null, null, null],
      step: 2,
    },
    {
      id: 'RFQ-2611-0018', ukiramaRef: null, type: 'quote', quoteStatus: 'requested', customerId: 'hgs', addressId: 'hgs-bali',
      createdAt: d(16, '11.30'), note: 'Rencana stok 3 bulan untuk laundry Kuta.',
      items: [{ sku: 'FG-LDL-200', qty: 4, unitPrice: null }],
    },
    {
      id: 'RFQ-2611-0015', ukiramaRef: 'QT/2611/0009', type: 'quote', quoteStatus: 'issued', customerId: 'hgs', addressId: 'hgs-wh',
      createdAt: d(12, '09.00'), issuedAt: d(13, '14.45'), validUntil: '27 Nov 2026', issuedBy: 'Andi Pratama',
      note: 'Untuk area klinik karyawan.',
      items: [{ sku: 'FG-HGD-05', qty: 30, unitPrice: 238000 }],
    },
    {
      id: 'MKT-2611-0109', ukiramaRef: 'SO/2611/0244', type: 'order', customerId: 'kls', addressId: 'kls-sby',
      createdAt: d(8, '13.20'), poNumber: '', payment: { method: 'va', label: 'VA BCA (payment gateway)' },
      invoice: { no: 'INV/2611/0201', due: 'Dibayar di muka', paidAt: d(8, '13.41') },
      shipping: { method: 'Ekspedisi', ref: 'Resi SiCepat 0041 2290 8812' },
      items: [{ sku: 'FG-HSA-05', qty: 12, unitPrice: 107000 }, { sku: 'FG-SSS-05', qty: 6, unitPrice: 166500 }],
      stepAt: [d(8, '13.20'), d(8, '13.21'), d(8, '13.41'), d(9, '10.00'), d(9, '16.30'), d(11, '11.05')],
      step: 6, leadTime: '2 hari 22 jam',
    },
  ]
}

export function seedSyncLog() {
  return [
    { at: '18 Nov · 08.00', dir: 'in', entity: 'Price list', detail: '5 price list, 31 item tersinkron', ok: true },
    { at: '18 Nov · 08.00', dir: 'in', entity: 'Stok gudang', detail: 'DC Cikupa, DC Surabaya, DC Denpasar', ok: true },
    { at: '17 Nov · 16.10', dir: 'in', entity: 'Invoice', detail: 'INV/2611/0230 → MKT-2611-0125', ok: true },
    { at: '17 Nov · 15.02', dir: 'out', entity: 'Sales Order', detail: 'MKT-2611-0125 → SO/2611/0266', ok: true },
    { at: '16 Nov · 11.30', dir: 'out', entity: 'Permintaan penawaran', detail: 'RFQ-2611-0018 dikirim ke Sales', ok: true },
  ]
}

export const STOCK = {
  default: [{ wh: 'DC Cikupa', qty: 420 }, { wh: 'DC Surabaya', qty: 160 }, { wh: 'DC Denpasar', qty: 85 }],
}
