<template>
  <StoreLayout>
    <!-- hero -->
    <section v-if="!activeCat && !q" class="grid gap-3 md:grid-cols-[1.6fr_1fr]">
      <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003C80] to-[#008FD4] p-6 md:p-8 text-white">
        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200">Portal pengadaan B2B iClean</p>
        <h1 class="mt-2 max-w-md font-heading text-2xl font-extrabold leading-tight md:text-3xl">Pesan chemical untuk semua cabang dari satu akun.</h1>
        <p class="mt-2 max-w-md text-sm text-white/80">Harga mengikuti kontrak dan area pengiriman Anda. Status pesanan diperbarui langsung dari gudang iClean.</p>
        <div class="mt-5 flex flex-wrap gap-2 text-[12px]">
          <span class="rounded-full bg-white/15 px-3 py-1">Harga per klien & region</span>
          <span class="rounded-full bg-white/15 px-3 py-1">Invoice TOP / VA / QRIS</span>
          <span class="rounded-full bg-white/15 px-3 py-1">Lacak sampai diterima</span>
        </div>
        <Boxes class="absolute -right-6 -bottom-6 h-40 w-40 text-white/10" />
      </div>
      <div class="grid grid-cols-2 gap-3 md:grid-cols-1">
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

    <!-- buy again -->
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

    <!-- categories -->
    <section class="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
      <p class="font-heading font-extrabold text-slate-900">Kategori</p>
      <div class="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
        <RouterLink :to="{ path: '/marketplace' }" class="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center text-[11px] hover:bg-slate-50" :class="!activeCat ? 'text-[#008FD4] font-semibold' : 'text-slate-600'">
          <span class="grid h-11 w-11 place-items-center rounded-xl bg-slate-100"><LayoutGrid class="h-5 w-5" /></span>Semua
        </RouterLink>
        <RouterLink v-for="c in CATEGORIES" :key="c.id" :to="{ path: '/marketplace', query: { kategori: c.id } }" class="flex flex-col items-center gap-1.5 rounded-xl p-2 text-center text-[11px] hover:bg-slate-50" :class="activeCat === c.id ? 'text-[#008FD4] font-semibold' : 'text-slate-600'">
          <span class="grid h-11 w-11 place-items-center rounded-xl" :class="activeCat === c.id ? 'bg-sky-100' : 'bg-slate-100'"><component :is="ICONS[c.id]" class="h-5 w-5" /></span>{{ c.name }}
        </RouterLink>
      </div>
    </section>

    <!-- grid -->
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
      <div v-if="list.length" class="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
        <ProductCard v-for="p in list" :key="p.slug" :product="p" />
      </div>
      <p v-else class="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Produk tidak ditemukan.</p>
    </section>
  </StoreLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Boxes, ChevronRight, Repeat, Plus, LayoutGrid, MapPin, ChefHat, Shirt, SprayCan, ShieldPlus, Wrench } from 'lucide-vue-next'
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
const activeOrders = computed(() => mine.value.filter((o) => ['processing', 'shipped', 'unpaid', 'quote'].includes(orderTab(o))).length)
const buyAgain = computed(() => {
  if (persona.value.status !== 'verified') return []
  const seen = new Map()
  for (const o of mine.value) if (o.type === 'order') for (const it of o.items) if (!seen.has(it.sku)) seen.set(it.sku, { sku: it.sku, qty: it.qty, v: VARIANTS[it.sku] })
  return [...seen.values()].slice(0, 6)
})
function again(b) { addToCart(b.sku, b.qty); notify(`${b.qty} ${b.v.uom} ${b.v.product.name} masuk keranjang`) }
</script>
