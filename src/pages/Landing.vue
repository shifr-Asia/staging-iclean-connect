<template>
  <div class="min-h-screen bg-[#F8FAFC]">
    <header class="border-b border-slate-200 bg-white">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <div class="flex items-center gap-3">
          <img src="/logo_iclean_birru.png" alt="iClean" class="h-8" />
          <span class="h-5 w-px bg-slate-200" />
          <span class="text-sm font-semibold text-slate-600">Mockup Platform Digital</span>
        </div>
        <span class="rounded-full border border-sky-200 bg-sky-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#008FD4]">Mockup · Nov 2026</span>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-12 md:py-20">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">iClean · PT Shifr Asia Inovasi</p>
      <h1 class="mt-3 max-w-3xl font-heading text-3xl font-extrabold leading-tight text-[#0F172A] md:text-5xl">
        Dua aplikasi, satu sumber data pelanggan.
      </h1>
      <p class="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
        Pilih modul yang ingin dilihat. Keduanya membaca data produk, harga, pelanggan, dan pesanan dari Ukirama ERP sehingga angka di setiap layar selalu sama.
      </p>

      <div class="mt-10 grid gap-5 md:grid-cols-2">
        <RouterLink
          v-for="c in cards" :key="c.to" :to="c.to"
          class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-float"
        >
          <div class="flex items-start justify-between">
            <span class="grid h-12 w-12 place-items-center rounded-xl text-white" :style="{ background: c.color }"><component :is="c.icon" class="h-6 w-6" /></span>
            <span class="rounded-full px-2.5 py-1 text-[11px] font-bold" :class="c.badgeCls">{{ c.badge }}</span>
          </div>
          <p class="mt-6 text-[12px] font-semibold uppercase tracking-wider text-slate-500">{{ c.domain }}</p>
          <h2 class="mt-1 font-heading text-2xl font-extrabold text-slate-900">{{ c.title }}</h2>
          <p class="mt-2 leading-relaxed text-slate-600">{{ c.desc }}</p>
          <ul class="mt-5 space-y-2 text-sm text-slate-700">
            <li v-for="f in c.features" :key="f" class="flex gap-2.5"><Check class="mt-0.5 h-4 w-4 shrink-0" :style="{ color: c.color }" />{{ f }}</li>
          </ul>
          <span class="mt-7 inline-flex items-center gap-2 text-sm font-bold" :style="{ color: c.color }">
            {{ c.cta }} <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </RouterLink>
      </div>

      <RouterLink to="/kebutuhan-data" class="group mt-5 grid gap-5 rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:-translate-y-1 hover:border-slate-300 hover:shadow-float md:grid-cols-[auto_1fr_auto] md:items-center md:p-7">
        <span class="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600 text-white"><ClipboardList class="h-6 w-6" /></span>
        <div>
          <div class="flex flex-wrap items-center gap-2">
            <h2 class="font-heading text-xl font-extrabold text-slate-900">Kebutuhan Data & Integrasi Ukirama</h2>
            <span class="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">Perlu ditindaklanjuti</span>
          </div>
          <p class="mt-1 text-slate-600">Daftar data yang perlu disiapkan pihak iClean dan akses API yang perlu dikonfirmasi ke Ukirama, beserta pemetaan data dan pertanyaan terbuka.</p>
          <div class="mt-3 flex flex-wrap gap-2 text-[12px]">
            <span class="rounded-full bg-sky-50 px-2.5 py-1 font-semibold text-[#016EA3]">Dari iClean: produk, harga, pelanggan, proses, logistik, pembayaran</span>
            <span class="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">Dari Ukirama: akses API, endpoint baca/tulis, webhook</span>
          </div>
        </div>
        <span class="inline-flex items-center gap-2 text-sm font-bold text-emerald-700">Lihat daftar <ArrowRight class="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
      </RouterLink>
    </main>
  </div>
</template>

<script setup>
import { Store, MessagesSquare, Check, ArrowRight, ClipboardList } from 'lucide-vue-next'

const cards = [
  {
    to: '/marketplace/produk/kitchen-degreaser-pro', icon: Store, color: '#008FD4',
    domain: 'order.icleanplus.id', title: 'B2B Marketplace', badge: 'Prioritas · Pengganti oxphere.com', badgeCls: 'bg-sky-100 text-[#016EA3]',
    desc: 'Belanja chemical iClean dengan pengalaman seperti Shopee atau Tokopedia, tetapi dengan aturan harga B2B.',
    features: [
      'Tombol “Beli Sekarang” di icleanplus.id langsung masuk keranjang',
      'Harga per klien, per area kirim, dan per kuantitas; sebagian lewat penawaran',
      'Daftar akun diverifikasi Sales, checkout dengan Invoice TOP atau VA/QRIS dari Ukirama',
      'Kontrak, saldo kredit, riwayat belanja, pembayaran & status kirim dari Ukirama',
    ],
    cta: 'Mulai dari halaman produk icleanplus.id',
  },
  {
    to: '/crm', icon: MessagesSquare, color: '#003C80',
    domain: 'connect.icleanplus.id', title: 'Integrated CRM', badge: 'Tahap berikutnya', badgeCls: 'bg-slate-100 text-slate-700',
    desc: 'Inbox terpadu website, Instagram, dan WhatsApp dengan AI Hermes dan Customer 360° untuk tim CS & Sales.',
    features: [
      'Satu inbox untuk semua channel, dengan label asal pesan',
      'AI Hermes menjawab dari katalog dan menyerahkan ke manusia',
      'Panel Customer 360°: Sales PIC, region, status beli, riwayat order',
      'Dashboard funnel dan kecepatan respons untuk manajemen',
    ],
    cta: 'Buka mockup CRM',
  },
]
</script>
