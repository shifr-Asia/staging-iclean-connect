<template>
  <StoreLayout title="Integrasi Ukirama">
    <div class="px-3 pt-3 md:p-0"><h1 class="font-heading text-xl md:text-2xl font-extrabold text-slate-900">Rancangan integrasi dengan Ukirama</h1>
    <p class="mt-1 max-w-3xl text-[14px] text-slate-600">Ukirama adalah sumber kebenaran untuk produk, harga, pelanggan, pesanan, pembayaran, dan pengiriman. Marketplace hanya menampilkan data tersebut dan mengirim transaksi baru ke Ukirama melalui API.</p></div>

    <!-- diagram -->
    <div class="mcard mt-5 grid items-stretch gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 lg:grid-cols-[1fr_auto_1.1fr_auto_1fr]">
      <Box title="icleanplus.id" sub="Website & CMS" :lines="['Halaman produk', 'Tombol Beli Sekarang → kode item']" color="#64748b" />
      <Arrow label="SKU" />
      <Box title="order.icleanplus.id" sub="B2B Marketplace" :lines="['Keranjang, checkout, akun', 'Cache data Ukirama (baca)', 'Payment gateway (VA/QRIS)', 'Notifikasi WA & email']" color="#008FD4" />
      <Arrow label="API" both />
      <Box title="Ukirama ERP" sub="Sumber kebenaran" :lines="['Item, stok, price list', 'Pelanggan, TOP, limit kredit', 'Quotation, SO, DO, invoice', 'Penerimaan pembayaran']" color="#0f9f6e" />
    </div>

    <!-- table -->
    <div class="mcard mt-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table class="w-full min-w-[760px] text-[13px]">
        <thead class="bg-slate-50">
          <tr class="text-left text-[11px] uppercase tracking-wider text-slate-500">
            <th class="px-4 py-3">Data</th><th class="px-4 py-3">Sumber kebenaran</th><th class="px-4 py-3">Arah</th><th class="px-4 py-3">Kapan</th><th class="px-4 py-3">Dipakai untuk</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="r in rows" :key="r[0]">
            <td class="px-4 py-2.5 font-semibold text-slate-900">{{ r[0] }}</td>
            <td class="px-4 py-2.5">{{ r[1] }}</td>
            <td class="px-4 py-2.5"><span class="inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold" :class="r[2] === 'in' ? 'bg-emerald-50 text-emerald-700' : r[2] === 'out' ? 'bg-sky-50 text-[#016EA3]' : 'bg-violet-50 text-violet-700'">{{ dir[r[2]] }}</span></td>
            <td class="px-4 py-2.5 text-slate-600">{{ r[3] }}</td>
            <td class="px-4 py-2.5 text-slate-600">{{ r[4] }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="mt-2 md:mt-5 grid gap-2 md:gap-4 md:grid-cols-2">
      <div class="mcard rounded-2xl border border-slate-200 bg-white p-5 text-[13px]">
        <p class="font-heading font-extrabold text-slate-900">Dibutuhkan dari pihak Ukirama</p>
        <ul class="mt-2 space-y-1.5 text-slate-600">
          <li v-for="x in fromUkirama" :key="x" class="flex gap-2"><Check class="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />{{ x }}</li>
        </ul>
      </div>
      <div class="mcard rounded-2xl border border-slate-200 bg-white p-5 text-[13px]">
        <p class="font-heading font-extrabold text-slate-900">Dibutuhkan dari pihak iClean</p>
        <ul class="mt-2 space-y-1.5 text-slate-600">
          <li v-for="x in fromIclean" :key="x" class="flex gap-2"><Check class="mt-0.5 h-4 w-4 shrink-0 text-[#008FD4]" />{{ x }}</li>
        </ul>
      </div>
    </div>
    <p class="mt-3 px-3 md:px-0 text-[12px] text-slate-500">Rincian lengkap ada di dokumen “Kebutuhan Data Marketplace & Integrasi Ukirama”.</p>
  </StoreLayout>
</template>

<script setup>
import { defineComponent, h } from 'vue'
import { Check, ArrowRight, ArrowLeftRight } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'

const dir = { in: 'Ukirama → app', out: 'app → Ukirama', both: 'Dua arah' }
const rows = [
  ['Produk & kemasan (item, UoM)', 'Ukirama', 'in', 'Terjadwal (mis. tiap jam) + saat ada perubahan', 'Katalog; dipadankan dengan konten CMS website'],
  ['Stok per gudang', 'Ukirama', 'in', 'Tiap 15–30 menit', 'Info ketersediaan di halaman produk'],
  ['Price list (klien, grup, region, tier qty)', 'Ukirama', 'in', 'Terjadwal + validasi ulang saat checkout', 'Harga setelah login, tabel tier'],
  ['Pelanggan, alamat, TOP, limit kredit, piutang', 'Ukirama', 'both', 'Saat verifikasi akun; dibaca ulang saat checkout', 'Akun perusahaan, opsi bayar TOP'],
  ['Permintaan penawaran & quotation', 'Ukirama', 'both', 'Real-time (saat dibuat / terbit)', 'Produk khusus, qty di atas tier'],
  ['Sales Order', 'Ukirama', 'out', 'Real-time saat checkout', 'Pesanan yang sudah ada harganya'],
  ['Invoice & faktur pajak (PDF)', 'Ukirama', 'in', 'Webhook / polling', 'Tagihan, unduh dokumen'],
  ['Pembayaran', 'Ukirama', 'both', 'Gateway → Ukirama real-time; transfer manual dibaca dari Ukirama', 'Status lunas, riwayat pembayaran'],
  ['Delivery Order, resi, status kirim', 'Ukirama', 'in', 'Webhook / polling', 'Timeline pesanan & lead time'],
  ['Akun login, keranjang, sesi', 'Marketplace', '—', '—', 'Hanya data operasional aplikasi'],
]
const fromUkirama = [
  'Dokumentasi API + akses sandbox, kredensial, rate limit',
  'Endpoint baca: item, stok, price list, pelanggan, quotation, SO, DO, invoice, pembayaran',
  'Endpoint tulis: pelanggan, quotation request, sales order, penerimaan pembayaran',
  'Webhook atau filter updated_since untuk perubahan status',
  'Custom field nomor referensi marketplace di dokumen',
]
const fromIclean = [
  'Pemetaan produk website ↔ kode item Ukirama',
  'Aturan harga: per klien, region, tier qty, produk wajib penawaran',
  'Daftar pelanggan eksisting, alamat cabang, TOP & limit kredit',
  'Alur verifikasi akun, SLA quotation, konfirmasi pembayaran',
  'Data gudang, metode kirim, lead time per region',
  'Akun payment gateway & data migrasi dari oxphere.com',
]

const Box = defineComponent({
  props: { title: String, sub: String, lines: Array, color: String },
  setup(p) {
    return () => h('div', { class: 'rounded-xl border-2 p-4', style: { borderColor: p.color } }, [
      h('p', { class: 'text-[11px] font-semibold uppercase tracking-wider', style: { color: p.color } }, p.sub),
      h('p', { class: 'font-heading text-lg font-extrabold text-slate-900' }, p.title),
      h('ul', { class: 'mt-2 space-y-1 text-[12px] text-slate-600' }, p.lines.map((l) => h('li', '• ' + l))),
    ])
  },
})
const Arrow = defineComponent({
  props: { label: String, both: Boolean },
  setup(p) {
    return () => h('div', { class: 'flex flex-col items-center justify-center gap-1 py-1 text-slate-400' }, [
      h(p.both ? ArrowLeftRight : ArrowRight, { class: 'h-6 w-6 rotate-90 lg:rotate-0' }),
      h('span', { class: 'text-[11px] font-semibold' }, p.label),
    ])
  },
})
</script>
