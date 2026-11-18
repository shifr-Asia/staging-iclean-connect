<template>
  <div class="min-h-screen bg-white">
    <DomainBar domain="icleanplus.id" strip="/marketplace" />
    <header class="sticky top-[38px] z-40 border-b border-slate-100 bg-white/95 backdrop-blur">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <img src="/logo_iclean_birru.png" alt="iClean" class="h-8" />
        <nav class="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <span>Beranda</span><span class="text-[#008FD4]">Produk</span><span>Solusi Industri</span><span>Tentang Kami</span><span>Kontak</span>
        </nav>
        <span class="rounded-full bg-[#008FD4] px-4 py-2 text-xs font-semibold text-white">Konsultasi Gratis</span>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-5 py-8 md:py-12">
      <p class="text-xs text-slate-500">Beranda / Produk / {{ cat?.name }} / <span class="text-slate-800">{{ product.name }}</span></p>
      <div class="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
        <ProductTile :product="product" big rounded="rounded-3xl" class="aspect-[4/3.4]" />
        <div>
          <span class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-[#008FD4]">{{ cat?.name }}</span>
          <h1 class="mt-3 font-heading text-3xl font-extrabold text-[#003C80] md:text-4xl">{{ product.name }}</h1>
          <p class="mt-4 leading-relaxed text-slate-600">{{ product.desc }}</p>
          <div class="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div class="rounded-xl bg-slate-50 p-3"><p class="text-xs text-slate-500">Kemasan</p><p class="font-semibold text-slate-800">{{ product.variants.map((v) => v.pack).join(', ') }}</p></div>
            <div class="rounded-xl bg-slate-50 p-3"><p class="text-xs text-slate-500">Dokumen</p><p class="font-semibold text-slate-800">SDS · Sertifikat halal</p></div>
          </div>
          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <button class="flex-1 rounded-xl border-2 border-[#008FD4] px-5 py-3.5 font-semibold text-[#008FD4]">Request Free Trial</button>
            <RouterLink :to="buyUrl" class="relative flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#008FD4] px-5 py-3.5 font-semibold text-white hover:bg-[#016EA3]">
              <span class="absolute inset-0 rounded-xl ring-4 ring-[#008FD4]/30 animate-pulse" aria-hidden />
              <ShoppingCart class="h-5 w-5" /> Beli Sekarang
            </RouterLink>
          </div>
          <div class="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-[13px] text-slate-600">
            <p class="font-semibold text-slate-800">Yang berubah di tombol “Beli Sekarang”</p>
            <p class="mt-1"><span class="text-slate-400 line-through">oxphere.com</span> (halaman umum, tanpa info produk) → <strong class="text-[#003C80]">order.icleanplus.id/keranjang?add={{ buyUrl.query.add }}</strong>. Produk langsung masuk keranjang dengan kode item Ukirama.</p>
          </div>
        </div>
      </div>
      <div class="mt-12">
        <p class="text-sm font-semibold text-slate-800">Coba produk lain:</p>
        <div class="mt-3 flex flex-wrap gap-2">
          <RouterLink v-for="p in others" :key="p.slug" :to="`/marketplace/produk/${p.slug}`" class="rounded-full border border-slate-200 px-3 py-1.5 text-[13px] text-slate-700 hover:border-[#008FD4] hover:text-[#008FD4]">{{ p.name }}</RouterLink>
        </div>
      </div>
    </main>
    <DemoPanel />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ShoppingCart } from 'lucide-vue-next'
import DomainBar from '../components/DomainBar.vue'
import DemoPanel from '../components/DemoPanel.vue'
import ProductTile from '../components/ProductTile.vue'
import { PRODUCTS, CATEGORIES } from '../data'

const route = useRoute()
const product = computed(() => PRODUCTS.find((p) => p.slug === route.params.slug) || PRODUCTS[0])
const cat = computed(() => CATEGORIES.find((c) => c.id === product.value.category))
const buyUrl = computed(() => ({ path: '/marketplace/keranjang', query: { add: product.value.variants[product.value.variants.length - 1].sku, qty: 1 } }))
const others = computed(() => PRODUCTS.filter((p) => p.slug !== product.value.slug).slice(0, 6))
</script>
