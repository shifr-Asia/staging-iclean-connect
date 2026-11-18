<template>
  <StoreLayout>
    <!-- ════════ MOBILE (Shopee-style) ════════ -->
    <div class="md:hidden">
      <template v-if="!activeCat && !q">
        <!-- banner carousel -->
        <div class="bg-gradient-to-b from-[#003C80] to-[#F5F6F8] px-3 pb-3 pt-1">
          <div class="relative overflow-hidden rounded-lg">
            <div class="flex transition-transform duration-500" :style="{ transform: `translateX(-${slide * 100}%)` }">
              <div v-for="b in banners" :key="b.t" class="relative h-[132px] w-full shrink-0 overflow-hidden p-4 text-white" :class="b.bg">
                <p class="text-[10px] font-semibold uppercase tracking-wider text-white/70">{{ b.k }}</p>
                <p class="mt-1 max-w-[230px] font-heading text-[17px] font-extrabold leading-tight">{{ b.t }}</p>
                <p class="mt-1 max-w-[230px] text-[11px] text-white/80">{{ b.d }}</p>
                <component :is="b.icon" class="absolute -bottom-3 -right-3 h-28 w-28 text-white/15" />
              </div>
            </div>
            <div class="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              <span v-for="(b, i) in banners" :key="i" class="h-1.5 rounded-full transition-all" :class="i === slide ? 'w-4 bg-white' : 'w-1.5 bg-white/50'" />
            </div>
          </div>
        </div>

        <!-- account strip -->
        <div class="mx-3 -mt-1 grid grid-cols-3 divide-x divide-slate-100 rounded-lg bg-white py-2.5 shadow-sm">
          <template v-if="isGuest">
            <div class="col-span-3 flex items-center justify-between gap-2 px-3">
              <p class="text-[12px] text-slate-600">Masuk untuk lihat <strong class="text-slate-900">harga kontrak</strong> Anda</p>
              <div class="flex shrink-0 gap-1.5">
                <RouterLink :to="{ path: '/marketplace/masuk', query: { redirect: '/marketplace' } }" class="rounded border border-[#008FD4] px-3 py-1 text-[12px] font-semibold text-[#008FD4]">Masuk</RouterLink>
                <RouterLink to="/marketplace/daftar" class="rounded bg-[#008FD4] px-3 py-1 text-[12px] font-semibold text-white">Daftar</RouterLink>
              </div>
            </div>
          </template>
          <template v-else>
            <RouterLink v-for="s in strip" :key="s.l" :to="s.to" class="flex flex-col items-center px-1 text-center">
              <span class="flex items-center gap-1 text-[13px] font-bold text-slate-900 tabular-nums"><component :is="s.icon" class="h-3.5 w-3.5 text-[#008FD4]" />{{ s.v }}</span>
              <span class="text-[10px] text-slate-500">{{ s.l }}</span>
            </RouterLink>
          </template>
        </div>

        <!-- icon grid -->
        <div class="mt-2 bg-white px-2 pb-1 pt-3">
          <div class="grid grid-cols-4 gap-y-3">
            <RouterLink v-for="s in shortcuts" :key="s.label" :to="s.to" class="flex flex-col items-center gap-1 text-center">
              <span class="grid h-11 w-11 place-items-center rounded-2xl" :class="s.cls"><component :is="s.icon" class="h-5 w-5" /></span>
              <span class="px-0.5 text-[10.5px] leading-tight text-slate-700">{{ s.label }}</span>
            </RouterLink>
          </div>
        </div>

        <!-- buy again -->
        <div v-if="buyAgain.length" class="mt-2 bg-white py-3">
          <div class="flex items-center justify-between px-3">
            <p class="text-[14px] font-bold uppercase tracking-wide text-[#003C80]">Pesan lagi</p>
            <span class="text-[10px] text-emerald-700">riwayat dari Ukirama</span>
          </div>
          <div class="no-scrollbar mt-2 flex gap-2 overflow-x-auto px-3">
            <div v-for="b in buyAgain" :key="b.sku" class="w-[108px] shrink-0">
              <RouterLink :to="`/marketplace/p/${b.v.product.slug}`"><ProductTile :product="b.v.product" class="aspect-square" rounded="rounded-md" /></RouterLink>
              <p class="mt-1 truncate text-[11px] text-slate-700">{{ b.v.product.name }}</p>
              <button class="mt-1 w-full rounded border border-[#008FD4] py-1 text-[11px] font-semibold text-[#008FD4]" @click="again(b)">+ {{ b.qty }} {{ b.v.uom }}</button>
            </div>
          </div>
        </div>
      </template>

      <!-- result header for search / category -->
      <div v-else class="flex items-center justify-between bg-white px-3 py-2.5">
        <p class="truncate text-[14px] font-semibold text-slate-900">{{ heading }}</p>
        <RouterLink to="/marketplace" class="shrink-0 text-[12px] text-[#008FD4]">Hapus filter</RouterLink>
      </div>

      <!-- recommendation grid -->
      <div class="sticky top-[94px] z-30 mt-2 border-b-2 border-[#008FD4] bg-white py-2.5 text-center text-[13px] font-bold uppercase tracking-wide text-[#008FD4]">
        {{ !activeCat && !q ? 'Rekomendasi' : list.length + ' produk' }}
      </div>
      <div v-if="isGuest" class="flex items-center justify-between gap-2 bg-white px-3 pb-2 text-[11px] text-slate-500">
        <span class="flex items-center gap-1"><MapPin class="h-3.5 w-3.5" /> Area kirim</span>
        <select v-model="state.guestRegion" class="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] text-slate-700">
          <option v-for="r in REGIONS" :key="r.code" :value="r.code">{{ r.name }}</option>
        </select>
      </div>
      <div class="grid grid-cols-2 gap-1.5 p-1.5">
        <ProductCard v-for="p in list" :key="p.slug" :product="p" />
      </div>
      <p v-if="!list.length" class="bg-white p-8 text-center text-[13px] text-slate-500">Produk tidak ditemukan.</p>
    </div>

    <!-- ════════ DESKTOP ════════ -->
    <div class="hidden md:block">
      <section v-if="!activeCat && !q" class="grid gap-3 grid-cols-[1.6fr_1fr]">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003C80] to-[#008FD4] p-8 text-white">
          <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200">Portal pengadaan B2B iClean</p>
          <h1 class="mt-2 max-w-md font-heading text-3xl font-extrabold leading-tight">Pesan chemical untuk semua cabang dari satu akun.</h1>
          <p class="mt-2 max-w-md text-sm text-white/80">Harga mengikuti kontrak dan area pengiriman Anda. Status pesanan diperbarui langsung dari gudang iClean.</p>
          <div class="mt-5 flex flex-wrap gap-2 text-[12px]">
            <span class="rounded-full bg-white/15 px-3 py-1">Harga per klien & region</span>
            <span class="rounded-full bg-white/15 px-3 py-1">Invoice TOP / VA / QRIS</span>
            <span class="rounded-full bg-white/15 px-3 py-1">Lacak sampai diterima</span>
          </div>
          <Boxes class="absolute -right-6 -bottom-6 h-40 w-40 text-white/10" />
        </div>
        <div class="grid gap-3">
          <div class="rounded-2xl border border-slate-200 bg-white p-4">
            <template v-if="isGuest">
              <p class="font-heading font-extrabold text-slate-900">Sudah jadi klien iClean?</p>
              <p class="mt-1 text-[12px] text-slate-500">Masuk untuk melihat harga kontrak dan riwayat pesanan.</p>
              <RouterLink :to="{ path: '/marketplace/masuk', query: { redirect: '/marketplace' } }" class="mt-3 inline-block rounded-lg bg-[#008FD4] px-4 py-1.5 text-[13px] font-semibold text-white">Masuk</RouterLink>
            </template>
            <template v-else>
              <p class="text-[11px] uppercase tracking-wider text-slate-500">Selamat datang</p>
              <p class="font-heading font-extrabold text-slate-900 truncate">{{ persona.label }}</p>
              <p class="mt-1 text-[12px] text-slate-500">Sales PIC: {{ persona.sales || 'menunggu penugasan' }}</p>
              <p v-if="persona.top" class="mt-1 text-[12px] text-slate-500">TOP {{ persona.top }} hari · sisa limit {{ rupiah(persona.creditLimit - persona.outstanding) }}</p>
            </template>
          </div>
          <RouterLink to="/marketplace/pesanan" class="rounded-2xl border border-slate-200 bg-white p-4 hover:border-[#008FD4]">
            <p class="font-heading font-extrabold text-slate-900">Pesanan aktif</p>
            <p class="mt-1 text-[12px] text-slate-500">{{ isGuest ? 'Masuk untuk melihat status pengiriman.' : `${activeOrders} pesanan sedang berjalan` }}</p>
            <span class="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-[#008FD4]">Lacak <ChevronRight class="h-4 w-4" /></span>
          </RouterLink>
        </div>
      </section>

      <section v-if="buyAgain.length && !activeCat && !q" class="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <div class="flex items-center justify-between">
          <p class="font-heading font-extrabold text-slate-900 flex items-center gap-2"><Repeat class="h-4 w-4 text-[#008FD4]" /> Pesan lagi</p>
          <SourceChip label="Riwayat dari Ukirama" />
        </div>
        <div class="mt-3 flex gap-3 overflow-x-auto pb-1">
          <div v-for="b in buyAgain" :key="b.sku" class="flex w-64 shrink-0 items-center gap-3 rounded-xl border border-slate-200 p-2.5">
            <ProductTile :product="b.v.product" class="h-14 w-14 shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="truncate text-[13px] font-semibold text-slate-800">{{ b.v.product.name }}</p>
              <p class="text-[11px] text-slate-500">{{ b.v.pack }} · terakhir {{ b.qty }} {{ b.v.uom }}</p>
            </div>
            <button class="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-50 text-[#008FD4] hover:bg-sky-100" :title="`Tambah ${b.qty} ke keranjang`" @click="again(b)"><Plus class="h-4 w-4" /></button>
          </div>
        </div>
      </section>

      <section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p class="font-heading font-extrabold text-slate-900">Kategori</p>
        <div class="mt-3 grid grid-cols-6 gap-2">
          <RouterLink :to="{ path: '/marketplace' }" class="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center text-[11px] hover:bg-slate-50" :class="!activeCat ? 'text-[#008FD4] font-semibold' : 'text-slate-600'">
            <span class="grid h-11 w-11 place-items-center rounded-xl bg-slate-100"><LayoutGrid class="h-5 w-5" /></span>Semua
          </RouterLink>
          <RouterLink v-for="c in CATEGORIES" :key="c.id" :to="{ path: '/marketplace', query: { kategori: c.id } }" class="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center text-[11px] hover:bg-slate-50" :class="activeCat === c.id ? 'text-[#008FD4] font-semibold' : 'text-slate-600'">
            <span class="grid h-11 w-11 place-items-center rounded-xl" :class="activeCat === c.id ? 'bg-sky-100' : 'bg-slate-100'"><component :is="ICONS[c.id]" class="h-5 w-5" /></span>{{ c.name }}
          </RouterLink>
        </div>
      </section>

      <section class="mt-4">
        <div class="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p class="font-heading text-lg font-extrabold text-slate-900">{{ heading }}</p>
          <div class="flex items-center gap-2 text-[12px] text-slate-500">
            <MapPin class="h-4 w-4" />
            <template v-if="isGuest">
              Area kirim:
              <select v-model="state.guestRegion" class="rounded-md border border-slate-200 bg-white px-2 py-1 text-[12px] text-slate-700">
                <option v-for="r in REGIONS" :key="r.code" :value="r.code">{{ r.name }}</option>
              </select>
            </template>
            <span v-else>Harga untuk {{ defaultAddr?.label }} ({{ REGIONS[defaultAddr?.region]?.name }})</span>
          </div>
        </div>
        <div v-if="list.length" class="grid grid-cols-3 gap-2.5 lg:grid-cols-5">
          <ProductCard v-for="p in list" :key="p.slug" :product="p" />
        </div>
        <p v-else class="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Produk tidak ditemukan.</p>
      </section>
    </div>
  </StoreLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import { Boxes, ChevronRight, Repeat, Plus, LayoutGrid, MapPin, ChefHat, Shirt, SprayCan, ShieldPlus, Wrench, Truck, FileText, Wallet, Receipt, BadgePercent } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductTile from '../components/ProductTile.vue'
import SourceChip from '../components/SourceChip.vue'
import { PRODUCTS, CATEGORIES, REGIONS, VARIANTS } from '../data'
import { rupiah } from '../pricing'
import { state, persona, isGuest, addToCart, addressById, defaultAddressId, orderTab, notify } from '../store'

const ICONS = { dapur: ChefHat, laundry: Shirt, housekeeping: SprayCan, sanitasi: ShieldPlus, solusi: Wrench }
const route = useRoute()
const activeCat = computed(() => route.query.kategori)
const q = computed(() => (route.query.q || '').toString().toLowerCase())
const list = computed(() => PRODUCTS.filter((p) => (!activeCat.value || p.category === activeCat.value) && (!q.value || p.name.toLowerCase().includes(q.value) || p.desc.toLowerCase().includes(q.value))))
const heading = computed(() => q.value ? `Hasil untuk “${route.query.q}”` : activeCat.value ? CATEGORIES.find((c) => c.id === activeCat.value)?.name : 'Semua produk')
const defaultAddr = computed(() => addressById(defaultAddressId()))
const mine = computed(() => state.orders.filter((o) => o.customerId === persona.value.id))
const activeOrders = computed(() => mine.value.filter((o) => ['processing', 'shipped', 'unpaid'].includes(orderTab(o))).length)
const quoteCount = computed(() => mine.value.filter((o) => orderTab(o) === 'quote').length)
const buyAgain = computed(() => {
  if (persona.value.status !== 'verified') return []
  const seen = new Map()
  for (const o of mine.value) if (o.type === 'order') for (const it of o.items) if (!seen.has(it.sku)) seen.set(it.sku, { sku: it.sku, qty: it.qty, v: VARIANTS[it.sku] })
  return [...seen.values()].slice(0, 8)
})
function again(b) { addToCart(b.sku, b.qty); notify(`${b.qty} ${b.v.uom} ${b.v.product.name} masuk keranjang`) }

// mobile
const banners = [
  { k: 'Portal B2B iClean', t: 'Pesan untuk semua cabang dari satu akun', d: 'Harga sesuai kontrak & area kirim Anda', bg: 'bg-gradient-to-br from-[#003C80] to-[#008FD4]', icon: Boxes },
  { k: 'Bayar fleksibel', t: 'Invoice TOP 30 hari atau VA / QRIS', d: 'Status pembayaran tercatat otomatis', bg: 'bg-gradient-to-br from-emerald-600 to-teal-500', icon: Wallet },
  { k: 'Lacak pengiriman', t: 'Dari gudang iClean sampai diterima', d: 'Lead time tercatat di setiap pesanan', bg: 'bg-gradient-to-br from-indigo-600 to-sky-500', icon: Truck },
]
const slide = ref(0)
let timer
onMounted(() => { timer = setInterval(() => { slide.value = (slide.value + 1) % banners.length }, 3500) })
onBeforeUnmount(() => clearInterval(timer))
const strip = computed(() => [
  { l: persona.value.top ? 'Sisa limit TOP' : 'Pembayaran', v: persona.value.top ? `${Math.round((persona.value.creditLimit - persona.value.outstanding) / 1e6)} jt` : 'VA/QRIS', icon: Wallet, to: '/marketplace/akun' },
  { l: 'Pesanan aktif', v: activeOrders.value, icon: Truck, to: '/marketplace/pesanan?tab=processing' },
  { l: 'Penawaran', v: quoteCount.value, icon: FileText, to: '/marketplace/pesanan?tab=quote' },
])
const shortcuts = [
  { label: 'Dapur', to: '/marketplace?kategori=dapur', icon: ChefHat, cls: 'bg-orange-50 text-orange-600' },
  { label: 'Laundry', to: '/marketplace?kategori=laundry', icon: Shirt, cls: 'bg-violet-50 text-violet-600' },
  { label: 'House-keeping', to: '/marketplace?kategori=housekeeping', icon: SprayCan, cls: 'bg-emerald-50 text-emerald-600' },
  { label: 'Sanitasi', to: '/marketplace?kategori=sanitasi', icon: ShieldPlus, cls: 'bg-sky-50 text-[#008FD4]' },
  { label: 'Solusi & Kontrak', to: '/marketplace?kategori=solusi', icon: Wrench, cls: 'bg-amber-50 text-amber-600' },
  { label: 'Penawaran', to: '/marketplace/pesanan?tab=quote', icon: BadgePercent, cls: 'bg-rose-50 text-rose-600' },
  { label: 'Lacak Pesanan', to: '/marketplace/pesanan?tab=shipped', icon: Truck, cls: 'bg-indigo-50 text-indigo-600' },
  { label: 'Tagihan', to: '/marketplace/akun', icon: Receipt, cls: 'bg-teal-50 text-teal-600' },
]
</script>
