<template>
  <div class="min-h-screen bg-[#F8FAFC] text-slate-800">
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 md:px-5">
        <RouterLink to="/" class="flex items-center gap-2 text-[13px] font-semibold text-slate-600 hover:text-[#008FD4]"><ArrowLeft class="h-4 w-4" /> Halaman utama</RouterLink>
        <img src="/logo_iclean_birru.png" alt="iClean" class="h-6" />
      </div>
      <nav class="no-scrollbar mx-auto flex max-w-6xl gap-1 overflow-x-auto px-3 pb-2 text-[13px] md:px-4">
        <a v-for="t in toc" :key="t.id" :href="`#${t.id}`" class="shrink-0 rounded-full px-3 py-1 text-slate-600 hover:bg-slate-100">{{ t.label }}</a>
      </nav>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8 md:px-5 md:py-12">
      <p class="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">B2B Marketplace · order.icleanplus.id</p>
      <h1 class="mt-2 font-heading text-2xl font-extrabold leading-tight text-slate-900 md:text-4xl">Kebutuhan data dari iClean & Ukirama</h1>
      <p class="mt-3 max-w-3xl leading-relaxed text-slate-600">
        Ukirama ERP adalah sumber kebenaran untuk produk, harga, pelanggan, pesanan, pembayaran, dan pengiriman. Daftar ini merangkum data dan akses yang dibutuhkan agar marketplace dapat dibangun dan tersambung ke Ukirama.
      </p>
      <div class="mt-5 flex flex-wrap gap-2 text-[12px]">
        <span class="rounded-full bg-amber-100 px-3 py-1 font-semibold text-amber-800">Draf untuk diskusi · 18 Nov 2026</span>
        <span class="rounded-full bg-sky-100 px-3 py-1 font-semibold text-[#016EA3]">{{ iclean.reduce((n, g) => n + g.items.length, 0) }} kebutuhan dari iClean</span>
        <span class="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700">{{ ukirama.reduce((n, g) => n + g.items.length, 0) }} kebutuhan dari Ukirama</span>
      </div>

      <!-- flow summary -->
      <section id="alur" class="scroll-mt-28 mt-10">
        <h2 class="font-heading text-xl font-extrabold text-slate-900">Alur yang disepakati</h2>
        <ol class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <li v-for="(f, i) in flow" :key="i" class="rounded-xl border border-slate-200 bg-white p-4">
            <span class="font-heading text-sm font-bold text-[#008FD4]">{{ String(i + 1).padStart(2, '0') }}</span>
            <p class="mt-1 text-[14px] font-semibold text-slate-900">{{ f.t }}</p>
            <p class="mt-1 text-[13px] leading-relaxed text-slate-600">{{ f.d }}</p>
          </li>
        </ol>
      </section>

      <!-- two columns -->
      <div class="mt-12 grid gap-8 lg:grid-cols-2">
        <section id="iclean" class="scroll-mt-28">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-[#008FD4] text-white"><Building2 class="h-5 w-5" /></span>
            <div><p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Disiapkan oleh</p><h2 class="font-heading text-xl font-extrabold text-slate-900">Pihak iClean</h2></div>
          </div>
          <div class="mt-4 space-y-3">
            <Group v-for="g in iclean" :key="g.title" :g="g" color="#008FD4" :open="openSet" @toggle="toggle" />
          </div>
        </section>
        <section id="ukirama" class="scroll-mt-28">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-xl bg-emerald-600 text-white"><Database class="h-5 w-5" /></span>
            <div><p class="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Dikonfirmasi ke</p><h2 class="font-heading text-xl font-extrabold text-slate-900">Pihak Ukirama</h2></div>
          </div>
          <p class="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] text-amber-900">Dokumentasi API Ukirama tidak tersedia publik, jadi poin-poin ini perlu diminta langsung ke Ukirama.</p>
          <div class="mt-3 space-y-3">
            <Group v-for="g in ukirama" :key="g.title" :g="g" color="#059669" :open="openSet" @toggle="toggle" />
          </div>
        </section>
      </div>

      <!-- mapping -->
      <section id="pemetaan" class="scroll-mt-28 mt-12">
        <h2 class="font-heading text-xl font-extrabold text-slate-900">Pemetaan data & arah sinkron</h2>
        <p class="mt-1 text-[13px] text-slate-600">Marketplace tidak menyimpan versi harga sendiri. Harga dihitung ulang dari Ukirama saat checkout, sehingga SO dan invoice selalu sama dengan yang dilihat klien.</p>
        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table class="w-full min-w-[640px] text-[13px]">
            <thead class="bg-slate-50"><tr class="text-left text-[11px] uppercase tracking-wider text-slate-500"><th class="px-4 py-3">Data</th><th class="px-4 py-3">Sumber kebenaran</th><th class="px-4 py-3">Arah</th><th class="px-4 py-3">Frekuensi (usulan)</th></tr></thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="r in mapping" :key="r[0]">
                <td class="px-4 py-2.5 font-semibold text-slate-900">{{ r[0] }}</td>
                <td class="px-4 py-2.5">{{ r[1] }}</td>
                <td class="px-4 py-2.5"><span class="whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold" :class="dirCls[r[2]]">{{ r[2] }}</span></td>
                <td class="px-4 py-2.5 text-slate-600">{{ r[3] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- open questions -->
      <section id="pertanyaan" class="scroll-mt-28 mt-12">
        <h2 class="font-heading text-xl font-extrabold text-slate-900">Pertanyaan terbuka</h2>
        <ol class="mt-4 divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
          <li v-for="(q, i) in questions" :key="i" class="flex gap-3 px-4 py-3 text-[14px]">
            <span class="font-heading font-bold text-[#008FD4] tabular-nums">{{ i + 1 }}</span>
            <span class="text-slate-700">{{ q }}</span>
          </li>
        </ol>
      </section>

      <section class="mt-12 rounded-xl border border-dashed border-slate-300 bg-white p-5 text-[13px] text-slate-600">
        <p class="font-semibold text-slate-900">Di luar lingkup tahap mockup</p>
        <ul class="mt-2 list-disc space-y-1 pl-5">
          <li>Membangun aplikasi order.icleanplus.id yang sesungguhnya.</li>
          <li>Integrasi nyata dengan API Ukirama (menunggu dokumentasi & akses sandbox).</li>
          <li>Mengubah tombol “Beli Sekarang” di website icleanplus.id agar mengirim kode item.</li>
        </ul>
        <div class="mt-4 flex flex-wrap gap-2">
          <RouterLink to="/marketplace/integrasi" class="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white">Lihat diagram integrasi</RouterLink>
          <RouterLink to="/marketplace/produk/kitchen-degreaser-pro" class="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700">Coba mockup marketplace</RouterLink>
          <button class="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700" @click="print">Cetak / simpan PDF</button>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, defineComponent, h } from 'vue'
import { ArrowLeft, Building2, Database, ChevronDown } from 'lucide-vue-next'

const toc = [
  { id: 'alur', label: 'Alur' }, { id: 'iclean', label: 'Dari iClean' }, { id: 'ukirama', label: 'Dari Ukirama' },
  { id: 'pemetaan', label: 'Pemetaan data' }, { id: 'pertanyaan', label: 'Pertanyaan terbuka' },
]
const flow = [
  { t: 'Beli Sekarang → keranjang', d: 'Dari halaman produk icleanplus.id ke order.icleanplus.id; produk langsung masuk keranjang dengan kode item Ukirama.' },
  { t: 'Belanja seperti marketplace', d: 'Tambah produk lain. Harga belum tampil sebelum login.' },
  { t: 'Login / daftar', d: 'Checkout wajib login. Pendaftar baru diverifikasi Sales dan ditautkan ke data pelanggan di Ukirama.' },
  { t: 'Harga dari Ukirama', d: 'Berbeda per klien, per area kirim, dan per kuantitas. Produk khusus atau qty di atas tier lewat quotation Sales.' },
  { t: 'Pembayaran via Ukirama', d: 'Invoice/TOP untuk klien dengan termin disetujui; VA/QRIS dibuat oleh Ukirama untuk klien lain. Kontrak dan saldo kredit juga dari Ukirama.' },
  { t: 'Status & riwayat', d: 'SO → invoice → pembayaran → DO → kirim → diterima dibaca dari Ukirama; lead time & pola belanja dihitung otomatis.' },
]
const iclean = [
  { title: 'Produk', items: [
    ['Pemetaan produk website (CMS) ↔ kode item Ukirama', 'Satu produk bisa punya beberapa kode item (5 L, 20 L, drum). Tabel produk CMS belum punya kolom kode item.'],
    ['Kemasan & satuan (UoM) per kode item', 'Jeriken, pail, drum, paket.'],
    ['Produk yang dijual online vs wajib lewat penawaran', 'Mis. disinfektan khusus RS, drum 200 L, paket dosing system.'],
    ['Minimum order per item', 'Bila ada.'],
    ['Foto & dokumen produk (SDS, COA, sertifikat)', 'Sebagian besar sudah ada di CMS.'],
  ] },
  { title: 'Aturan harga', items: [
    ['Struktur price list di Ukirama', 'Per klien, per grup/industri, per region, atau kombinasi.'],
    ['Pembagian region / zona harga', 'Kota/kabupaten mana masuk zona mana.'],
    ['Tier kuantitas', 'Batas tiap tier dan batas qty yang wajib lewat penawaran.'],
    ['Harga kontrak per klien', 'Daftar klien dengan harga khusus beserta masa berlakunya.'],
    ['PPN, pembulatan & ongkos kirim', 'Ongkir di invoice, gratis di atas nominal tertentu, atau per zona.'],
    ['Siapa yang boleh mengubah harga', 'Agar harga hanya diubah di Ukirama.'],
  ] },
  { title: 'Pelanggan', items: [
    ['Daftar pelanggan eksisting + kode pelanggan Ukirama', 'Untuk menautkan akun marketplace.'],
    ['PIC & kontak (email kerja, WhatsApp)', 'Untuk undangan akun dan login OTP.'],
    ['Alamat kirim per pelanggan', 'Gudang pusat / cabang, penerima, jam terima barang, region.'],
    ['Kontrak klien eksisting', 'Pastikan nomor, periode, cakupan produk/region, dan harga kontrak sudah tercatat di Ukirama.'],
    ['Termin (TOP) & limit kredit', 'Sudah tercatat di Ukirama; menentukan siapa yang boleh bayar dengan Invoice/TOP.'],
    ['Sales PIC & pembagian wilayah', 'Routing verifikasi akun dan quotation.'],
    ['Pengguna per perusahaan', 'Purchasing pusat, PIC cabang, approver — perlu persetujuan pusat?'],
  ] },
  { title: 'Proses kerja', items: [
    ['Verifikasi pendaftar', 'Siapa, dokumen yang diminta (NPWP/NIB), SLA.'],
    ['Quotation', 'Siapa yang menerbitkan, SLA, masa berlaku, alur nego.'],
    ['Konfirmasi pembayaran', 'Pembayaran VA/QRIS tercatat otomatis di Ukirama; transfer manual dikonfirmasi siapa?'],
    ['Pembatalan, retur, komplain', 'Kebijakan dan penanggung jawab.'],
    ['Dokumen wajib', 'PO klien, faktur pajak, COA/MSDS per pengiriman.'],
  ] },
  { title: 'Logistik', items: [
    ['Daftar gudang / DC', 'Asal pengiriman per region.'],
    ['Metode kirim', 'Armada iClean, ekspedisi (nama mitra), ambil sendiri.'],
    ['Standar lead time per region', 'Untuk estimasi di halaman produk dan checkout.'],
    ['Siapa memperbarui status kirim & resi', 'Disarankan langsung di Ukirama.'],
  ] },
  { title: 'Pembayaran', items: [
    ['Fitur pembayaran Ukirama yang aktif', 'VA bank apa saja dan QRIS yang sudah aktif di akun Ukirama iClean.'],
    ['Aturan masa berlaku VA/QRIS', 'Mis. 24 jam; apa yang terjadi bila lewat.'],
    ['Kapan pakai VA/QRIS vs Invoice/TOP', 'Klien baru wajib bayar di muka? Bila limit kredit habis?'],
  ] },
  { title: 'Migrasi & website', items: [
    ['Data akun/pesanan di oxphere.com', 'Yang perlu dibawa, bila ada.'],
    ['Rencana redirect', 'Tautan lama ke oxphere.com.'],
    ['Tombol “Beli Sekarang” di icleanplus.id', 'Saat ini satu URL global ke oxphere.com; perlu URL per produk yang membawa kode item.'],
    ['Konten legal', 'Syarat & Ketentuan, Kebijakan Privasi, kebijakan retur.'],
  ] },
]
const ukirama = [
  { title: 'Akses', items: [
    ['Dokumentasi API & sandbox/staging', 'Lingkungan uji untuk pengembangan.'],
    ['Metode autentikasi', 'API key / OAuth, rotasi kredensial, IP whitelist.'],
    ['Rate limit, SLA/uptime & kontak teknis', ''],
    ['Biaya / paket untuk akses API', ''],
  ] },
  { title: 'Endpoint baca (Ukirama → marketplace)', items: [
    ['Item / produk', 'Kode, nama, kategori, UoM, status aktif, berat; filter updated_since.'],
    ['Stok per gudang', 'Kode item, gudang/DC, qty tersedia.'],
    ['Price list', 'Cakupan (klien/grup/region), kode item, tier qty, harga, masa berlaku — paling kritis.'],
    ['Pelanggan', 'Kode, nama, NPWP, grup, Sales PIC.'],
    ['Kontrak klien', 'Nomor, periode, status, cakupan produk & region, price list terkait, komitmen pembelian.'],
    ['Saldo kredit', 'TOP, limit kredit, kredit terpakai, sisa limit, piutang jatuh tempo.'],
    ['Alamat pelanggan', 'Kode alamat, label, alamat, region, penerima.'],
    ['Quotation & Sales Order', 'Nomor, status, item, harga, nomor referensi marketplace.'],
    ['Delivery Order / pengiriman', 'Nomor DO, status, tanggal kirim, resi/armada, tanggal diterima.'],
    ['Invoice & pembayaran', 'Nomor, jatuh tempo, total, status, file PDF & faktur pajak.'],
  ] },
  { title: 'Endpoint tulis (marketplace → Ukirama)', items: [
    ['Buat/ubah pelanggan & alamat', 'Saat Sales memverifikasi pendaftar baru.'],
    ['Buat permintaan quotation', 'Atau draft quotation yang dilengkapi Sales di Ukirama.'],
    ['Buat Sales Order', 'Status awal bisa diatur (draft / menunggu approval), nomor PO klien, referensi marketplace.'],
  ] },
  { title: 'Pembayaran VA / QRIS', items: [
    ['Buat VA / QRIS untuk invoice', 'Lewat API: nomor VA atau kode QRIS, nominal, masa berlaku.'],
    ['Status pembayaran', 'Lunas / kedaluwarsa / sebagian; tanggal & nominal diterima.'],
    ['Provider di balik fitur pembayaran Ukirama', 'Untuk memahami batasan & biaya per transaksi.'],
  ] },
  { title: 'Perubahan status', items: [
    ['Webhook', 'Untuk perubahan quotation, SO, DO, invoice, pembayaran — atau filter updated_since untuk polling.'],
    ['Custom field referensi', 'Menyimpan nomor pesanan marketplace di dokumen Ukirama.'],
    ['Format penomoran & zona waktu', 'SO, DO, INV, QT.'],
  ] },
]
const mapping = [
  ['Produk & UoM', 'Ukirama', 'Ukirama → app', 'Terjadwal (mis. tiap jam)'],
  ['Konten produk (foto, deskripsi, SDS)', 'CMS website', 'CMS → app', 'Saat publikasi'],
  ['Stok per gudang', 'Ukirama', 'Ukirama → app', '15–30 menit'],
  ['Price list', 'Ukirama', 'Ukirama → app', 'Terjadwal + validasi ulang saat checkout'],
  ['Pelanggan & alamat', 'Ukirama', 'Dua arah', 'Saat verifikasi akun'],
  ['Kontrak klien', 'Ukirama', 'Ukirama → app', 'Terjadwal + saat login'],
  ['TOP, limit & saldo kredit', 'Ukirama', 'Ukirama → app', 'Dibaca ulang saat checkout'],
  ['Quotation', 'Ukirama', 'Dua arah', 'Real-time'],
  ['Sales Order', 'Ukirama', 'App → Ukirama', 'Real-time saat checkout'],
  ['Invoice & faktur', 'Ukirama', 'Ukirama → app', 'Webhook / polling'],
  ['VA / QRIS per invoice', 'Ukirama', 'Ukirama → app', 'Real-time saat checkout'],
  ['Status pembayaran', 'Ukirama', 'Ukirama → app', 'Webhook / polling'],
  ['Pengiriman & resi', 'Ukirama', 'Ukirama → app', 'Webhook / polling'],
  ['Akun login, keranjang, sesi', 'Marketplace', '—', '—'],
]
const dirCls = { 'Ukirama → app': 'bg-emerald-50 text-emerald-700', 'CMS → app': 'bg-slate-100 text-slate-600', 'App → Ukirama': 'bg-sky-50 text-[#016EA3]', 'Dua arah': 'bg-violet-50 text-violet-700', '—': 'text-slate-400' }
const questions = [
  'Bagaimana price list per region dan per tier qty dimodelkan di Ukirama hari ini — sudah terstruktur atau sebagian masih diatur manual oleh Sales?',
  'Apakah SO dari marketplace langsung aktif, atau perlu approval Sales/Finance di Ukirama?',
  'Siapa yang memperbarui status pengiriman di Ukirama, dan apakah resi ekspedisi sudah dicatat di sana?',
  'Apakah satu perusahaan klien perlu beberapa user dengan peran berbeda (purchasing pusat, PIC cabang, approver)?',
  'Apakah VA/QRIS di Ukirama bisa dibuat per invoice lewat API, dan bagaimana status pembayarannya dikirim balik (webhook atau polling)?',
  'Apakah ada data pelanggan/pesanan di oxphere.com yang perlu dimigrasikan?',
  'Subdomain final: order.icleanplus.id atau nama lain? Siapa yang mengelola DNS?',
]

const openSet = reactive(new Set([iclean[0].title, ukirama[0].title]))
const toggle = (t) => (openSet.has(t) ? openSet.delete(t) : openSet.add(t))
const print = () => { iclean.concat(ukirama).forEach((g) => openSet.add(g.title)); setTimeout(() => window.print(), 100) }

const Group = defineComponent({
  props: { g: Object, color: String, open: Object },
  emits: ['toggle'],
  setup(p, { emit }) {
    return () => {
      const isOpen = p.open.has(p.g.title)
      return h('div', { class: 'overflow-hidden rounded-xl border border-slate-200 bg-white' }, [
        h('button', { class: 'flex w-full items-center justify-between gap-3 px-4 py-3 text-left', onClick: () => emit('toggle', p.g.title) }, [
          h('span', { class: 'flex items-center gap-2.5' }, [
            h('span', { class: 'h-2 w-2 rounded-full', style: { background: p.color } }),
            h('span', { class: 'text-[14px] font-semibold text-slate-900' }, p.g.title),
            h('span', { class: 'rounded-full bg-slate-100 px-2 text-[11px] text-slate-500' }, p.g.items.length),
          ]),
          h(ChevronDown, { class: ['h-4 w-4 text-slate-400 transition-transform', isOpen ? 'rotate-180' : ''] }),
        ]),
        isOpen ? h('ul', { class: 'divide-y divide-slate-100 border-t border-slate-100' }, p.g.items.map(([t, d]) =>
          h('li', { class: 'flex gap-3 px-4 py-2.5' }, [
            h('span', { class: 'mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border', style: { borderColor: p.color } }),
            h('span', [h('span', { class: 'block text-[13px] font-medium text-slate-800' }, t), d ? h('span', { class: 'block text-[12px] text-slate-500' }, d) : null]),
          ]))) : null,
      ])
    }
  },
})
</script>

<style scoped>
@media print {
  header { position: static !important; }
  header nav, button { display: none !important; }
}
</style>
