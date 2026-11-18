<template>
  <StoreLayout title="Detail Produk">
    <!-- ════════ MOBILE (Shopee-style) ════════ -->
    <div class="md:hidden">
      <div class="relative bg-white">
        <ProductTile :product="product" big rounded="rounded-none" class="aspect-square w-full" />
        <span class="absolute bottom-3 right-3 rounded-full bg-black/40 px-2 py-0.5 text-[11px] text-white">1/5</span>
      </div>

      <!-- price block -->
      <div class="bg-white px-3 pb-3 pt-2.5">
        <template v-if="price.unitPrice">
          <div class="flex flex-wrap items-baseline gap-x-2">
            <span class="font-heading text-[22px] font-extrabold text-[#003C80] tabular-nums">{{ rupiah(price.unitPrice) }}</span>
            <span class="text-[12px] text-slate-500">/ {{ variant.uom }}</span>
            <span v-if="price.contract" class="rounded-sm bg-[#003C80] px-1.5 text-[10px] font-bold leading-4 text-white">Harga kontrak</span>
          </div>
          <p class="mt-0.5 text-[11px] text-slate-500">{{ price.listName }} <SourceChip /></p>
        </template>
        <RouterLink v-else-if="price.login" :to="{ path: '/marketplace/masuk', query: { redirect: $route.fullPath } }" class="flex items-center justify-between rounded-md bg-sky-50 px-3 py-2.5">
          <span class="flex items-center gap-2 text-[13px] font-semibold text-[#003C80]"><Lock class="h-4 w-4" />Masuk untuk lihat harga</span>
          <ChevronRight class="h-4 w-4 text-[#008FD4]" />
        </RouterLink>
        <p v-else-if="price.pending" class="rounded-md bg-amber-50 px-3 py-2.5 text-[12px] font-semibold text-amber-800">Harga tampil setelah akun diverifikasi Sales</p>
        <div v-else-if="price.quote" class="rounded-md bg-amber-50 px-3 py-2.5">
          <p class="flex items-center gap-1.5 text-[14px] font-bold text-amber-800"><FileText class="h-4 w-4" />Harga via penawaran</p>
          <p class="text-[11px] text-amber-800/80">{{ price.reason }}</p>
        </div>
        <h1 class="mt-2.5 text-[15px] leading-snug text-slate-900">{{ product.name }} · {{ variant.pack }}</h1>
        <div class="mt-1.5 flex items-center gap-2 text-[11px] text-slate-500">
          <span class="flex items-center gap-0.5 text-slate-800"><Star class="h-3 w-3 fill-amber-400 text-amber-400" />{{ product.rating }}</span>
          <span class="h-3 w-px bg-slate-300" /><span>{{ product.sold.toLocaleString('id-ID') }}+ terjual</span>
          <span class="h-3 w-px bg-slate-300" /><span>{{ variant.sku }}</span>
        </div>
      </div>

      <!-- option rows -->
      <div class="mt-2 divide-y divide-slate-100 bg-white text-[13px]">
        <button v-if="price.tiers" class="flex w-full items-center gap-3 px-3 py-3 text-left" @click="openSheet('cart')">
          <span class="w-[72px] shrink-0 text-slate-500">Grosir</span>
          <span class="min-w-0 flex-1 truncate text-slate-800">Mulai {{ rupiah(price.tiers[price.tiers.length - 1].price) }} (≥{{ price.tiers[price.tiers.length - 1].min }} {{ variant.uom }})</span>
          <ChevronRight class="h-4 w-4 text-slate-400" />
        </button>
        <button class="flex w-full items-center gap-3 px-3 py-3 text-left" @click="openSheet('cart')">
          <span class="w-[72px] shrink-0 text-slate-500">Kemasan</span>
          <span class="min-w-0 flex-1 truncate text-slate-800">{{ variant.pack }} <span class="text-slate-400">· {{ product.variants.length }} pilihan</span></span>
          <ChevronRight class="h-4 w-4 text-slate-400" />
        </button>
        <button class="flex w-full items-center gap-3 px-3 py-3 text-left" @click="openSheet('cart')">
          <span class="w-[72px] shrink-0 text-slate-500">Kirim ke</span>
          <span class="min-w-0 flex-1">
            <span class="block truncate text-slate-800">{{ isGuest ? 'Area ' + REGIONS[region].name : addrLabel }}</span>
            <span class="block text-[11px] text-slate-500"><Truck class="mr-1 inline h-3 w-3" />Estimasi tiba {{ REGIONS[region].leadTime }}</span>
          </span>
          <ChevronRight class="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <!-- stock -->
      <div class="mt-2 bg-white px-3 py-3">
        <div class="flex items-center justify-between"><p class="text-[13px] font-semibold text-slate-900">Stok gudang iClean</p><SourceChip /></div>
        <div class="mt-2 grid grid-cols-3 gap-2 text-center">
          <div v-for="s in STOCK.default" :key="s.wh" class="rounded-md bg-slate-50 py-2"><p class="text-[14px] font-bold text-slate-900 tabular-nums">{{ s.qty }}</p><p class="text-[10px] text-slate-500">{{ s.wh }}</p></div>
        </div>
      </div>

      <!-- sales pic -->
      <div v-if="!isGuest && persona.sales" class="mt-2 flex items-center gap-3 bg-white px-3 py-3">
        <span class="grid h-10 w-10 place-items-center rounded-full bg-[#003C80] text-white"><User class="h-5 w-5" /></span>
        <div class="min-w-0 flex-1"><p class="text-[13px] font-semibold text-slate-900">{{ persona.sales }}</p><p class="text-[11px] text-slate-500">Sales PIC · biasanya membalas &lt; 1 jam</p></div>
        <button class="rounded border border-[#008FD4] px-3 py-1 text-[12px] font-semibold text-[#008FD4]" @click="chat">Chat</button>
      </div>

      <div class="mt-2 bg-white px-3 py-3">
        <p class="text-[13px] font-semibold text-slate-900">Deskripsi produk</p>
        <p class="mt-1.5 text-[13px] leading-relaxed text-slate-600">{{ product.desc }}</p>
        <div class="mt-2.5 flex flex-wrap gap-1.5 text-[11px]">
          <span class="rounded border border-slate-200 px-2 py-1">SDS / MSDS</span><span class="rounded border border-slate-200 px-2 py-1">COA per batch</span><span class="rounded border border-slate-200 px-2 py-1">Sertifikat halal</span>
        </div>
      </div>
      <div class="mt-2 bg-white px-3 py-3 text-[12px] text-slate-600">
        <p class="text-[13px] font-semibold text-slate-900">Cara harga ditentukan</p>
        <p class="mt-1">Harga kontrak klien → harga umum area kirim → tier kuantitas. Di atas tier tertinggi atau produk khusus lewat penawaran Sales. Semua price list dikelola di Ukirama.</p>
      </div>
    </div>

    <!-- bottom action bar (Shopee) -->
    <template #bottom>
      <div class="flex h-[52px]">
        <button class="flex w-[22%] flex-col items-center justify-center gap-0.5 bg-[#E6F4FB] text-[10px] text-[#016EA3]" @click="chat"><MessageCircleMore class="h-5 w-5" />Chat</button>
        <template v-if="price.quote">
          <button class="flex-1 bg-amber-500 text-[14px] font-semibold text-white" @click="openSheet('quote')">Minta Penawaran</button>
        </template>
        <template v-else>
          <button class="flex w-[28%] flex-col items-center justify-center gap-0.5 border-l border-[#bfe3f4] bg-[#E6F4FB] text-[10px] text-[#016EA3]" @click="openSheet('cart')"><ShoppingCart class="h-5 w-5" />Keranjang</button>
          <button class="flex-1 bg-[#008FD4] text-[14px] font-semibold text-white" @click="openSheet('buy')">Beli Sekarang</button>
        </template>
      </div>
    </template>

    <!-- variant bottom sheet -->
    <transition name="sheet">
      <div v-if="sheet" class="fixed inset-0 z-[80] md:hidden" @click.self="sheet = null">
        <div class="absolute inset-0 bg-black/40" @click="sheet = null" />
        <div class="absolute inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-xl bg-white pb-[env(safe-area-inset-bottom)]">
          <div class="flex gap-3 border-b border-slate-100 p-3">
            <ProductTile :product="product" class="-mt-8 h-24 w-24 shrink-0 border-2 border-white shadow" rounded="rounded-md" />
            <div class="min-w-0 flex-1">
              <p v-if="price.unitPrice" class="font-heading text-[18px] font-extrabold text-[#003C80] tabular-nums">{{ rupiah(price.unitPrice) }}<span class="text-[11px] font-normal text-slate-500"> /{{ variant.uom }}</span></p>
              <p v-else-if="price.quote" class="text-[14px] font-bold text-amber-700">Harga via penawaran</p>
              <p v-else class="text-[13px] font-semibold text-[#008FD4]">Harga tampil setelah masuk</p>
              <p class="text-[11px] text-slate-500">Stok: {{ stockTotal }} {{ variant.uom }}</p>
            </div>
            <button class="self-start text-slate-400" @click="sheet = null"><X class="h-5 w-5" /></button>
          </div>
          <div class="space-y-4 p-3">
            <div>
              <p class="text-[13px] text-slate-800">Kemasan</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <button v-for="v in product.variants" :key="v.sku" class="rounded-sm border px-3 py-1.5 text-[12px]" :class="v.sku === variant.sku ? 'border-[#008FD4] bg-sky-50 text-[#008FD4]' : 'border-slate-200 bg-slate-50 text-slate-700'" @click="sku = v.sku">{{ v.pack }}<span v-if="v.quoteOnly" class="ml-1 text-[10px] text-amber-600">(penawaran)</span></button>
              </div>
            </div>
            <div>
              <p class="text-[13px] text-slate-800">Kirim ke</p>
              <div class="mt-2 flex flex-wrap gap-2">
                <template v-if="!isGuest">
                  <button v-for="a in persona.addresses" :key="a.id" class="rounded-sm border px-3 py-1.5 text-left text-[12px]" :class="a.id === addressId ? 'border-[#008FD4] bg-sky-50 text-[#008FD4]' : 'border-slate-200 bg-slate-50 text-slate-700'" @click="addressId = a.id">{{ a.label }} <span class="text-[10px] opacity-70">· {{ REGIONS[a.region].name }}</span></button>
                </template>
                <template v-else>
                  <button v-for="r in REGIONS" :key="r.code" class="rounded-sm border px-3 py-1.5 text-[12px]" :class="r.code === state.guestRegion ? 'border-[#008FD4] bg-sky-50 text-[#008FD4]' : 'border-slate-200 bg-slate-50 text-slate-700'" @click="state.guestRegion = r.code">{{ r.name }}</button>
                </template>
              </div>
            </div>
            <TierTable v-if="price.tiers" :tiers="price.tiers" :qty="qty" :uom="variant.uom" :region="REGIONS[region].name" />
            <div class="flex items-center justify-between">
              <p class="text-[13px] text-slate-800">Jumlah</p>
              <QtyStepper v-model="qty" small />
            </div>
            <p v-if="price.unitPrice" class="text-right text-[12px] text-slate-500">Subtotal <strong class="text-slate-900">{{ rupiah(price.unitPrice * qty) }}</strong> (belum PPN)</p>
          </div>
          <div class="border-t border-slate-100 p-3">
            <button class="w-full rounded-sm py-3 text-[14px] font-semibold text-white" :class="price.quote ? 'bg-amber-500' : 'bg-[#008FD4]'" @click="confirmSheet">
              {{ price.quote ? 'Kirim ke daftar penawaran' : sheet === 'buy' ? 'Beli Sekarang' : 'Masukkan Keranjang' }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ════════ DESKTOP ════════ -->
    <div class="hidden md:block">
    <p class="mb-3 text-[12px] text-slate-500">
      <RouterLink to="/marketplace" class="hover:text-[#008FD4]">Beranda</RouterLink> /
      <RouterLink :to="{ path: '/marketplace', query: { kategori: product.category } }" class="hover:text-[#008FD4]">{{ cat.name }}</RouterLink> /
      <span class="text-slate-800">{{ product.name }}</span>
    </p>

    <div class="grid gap-4 lg:grid-cols-[380px_1fr_300px]">
      <!-- gallery -->
      <div class="rounded-2xl border border-slate-200 bg-white p-3">
        <ProductTile :product="product" big class="aspect-square" />
        <div class="mt-2 grid grid-cols-4 gap-2">
          <ProductTile v-for="i in 4" :key="i" :product="product" class="aspect-square opacity-70" :class="i === 1 ? 'ring-2 ring-[#008FD4] opacity-100' : ''" />
        </div>
      </div>

      <!-- info -->
      <div class="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <h1 class="font-heading text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">{{ product.name }}</h1>
        <div class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-slate-500">
          <span class="flex items-center gap-1 text-slate-800"><Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />{{ product.rating }}</span>
          <span>{{ product.sold.toLocaleString('id-ID') }}+ terjual</span>
          <span>Kode item: <strong class="text-slate-700">{{ variant.sku }}</strong> <SourceChip /></span>
        </div>

        <div class="mt-4 rounded-xl bg-slate-50 p-4">
          <PriceTag :r="price" :uom="variant.uom" big show-reason />
        </div>

        <!-- variant -->
        <div class="mt-5 grid gap-4 sm:grid-cols-[110px_1fr] sm:items-center">
          <p class="text-[13px] text-slate-500">Kemasan</p>
          <div class="flex flex-wrap gap-2">
            <button v-for="v in product.variants" :key="v.sku" class="rounded-lg border px-3.5 py-2 text-[13px]" :class="v.sku === variant.sku ? 'border-[#008FD4] bg-sky-50 font-semibold text-[#003C80]' : 'border-slate-200 text-slate-700 hover:border-slate-300'" @click="sku = v.sku">
              {{ v.pack }}<span v-if="v.quoteOnly" class="ml-1.5 rounded bg-amber-100 px-1 text-[10px] font-bold text-amber-700">penawaran</span>
            </button>
          </div>

          <p class="text-[13px] text-slate-500">Kirim ke</p>
          <div>
            <select v-if="!isGuest" v-model="addressId" class="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px]">
              <option v-for="a in persona.addresses" :key="a.id" :value="a.id">{{ a.label }} — {{ REGIONS[a.region].name }}</option>
            </select>
            <select v-else v-model="state.guestRegion" class="w-full max-w-sm rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px]">
              <option v-for="r in REGIONS" :key="r.code" :value="r.code">Area {{ r.name }}</option>
            </select>
            <p class="mt-1 flex items-center gap-1 text-[11px] text-slate-500"><Truck class="h-3.5 w-3.5" /> Estimasi tiba {{ REGIONS[region].leadTime }} · harga bisa berbeda per area</p>
          </div>

          <p class="text-[13px] text-slate-500">Kuantitas</p>
          <div class="flex flex-wrap items-center gap-3">
            <QtyStepper v-model="qty" />
            <span class="text-[12px] text-slate-500">{{ variant.uom }} · stok tersedia <strong class="text-slate-700">{{ stockTotal }}</strong></span>
          </div>
        </div>

        <TierTable v-if="price.tiers" class="mt-5" :tiers="price.tiers" :qty="qty" :uom="variant.uom" :region="REGIONS[region].name" />
        <div v-else-if="price.login || price.pending" class="mt-5 rounded-xl border border-dashed border-slate-300 p-3 text-[12px] text-slate-500">
          Harga bertingkat per kuantitas dan area tampil setelah {{ price.pending ? 'akun diverifikasi' : 'masuk' }}. Harga untuk setiap klien bisa berbeda sesuai kontrak di Ukirama.
        </div>

        <!-- actions -->
        <div class="mt-5 flex flex-col gap-2 sm:flex-row">
          <template v-if="price.quote">
            <button class="flex flex-1 items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 font-semibold text-white hover:bg-amber-600" @click="add(true)"><FileText class="h-5 w-5" /> Minta Penawaran</button>
          </template>
          <template v-else>
            <button class="flex flex-1 items-center justify-center gap-2 rounded-lg border-2 border-[#008FD4] bg-sky-50 px-5 py-3 font-semibold text-[#008FD4] hover:bg-sky-100" @click="add(false)"><ShoppingCart class="h-5 w-5" /> Tambah ke Keranjang</button>
            <button class="flex-1 rounded-lg bg-[#008FD4] px-5 py-3 font-semibold text-white hover:bg-[#016EA3]" @click="add(true)">Beli Sekarang</button>
          </template>
        </div>
        <p v-if="price.unitPrice" class="mt-2 text-right text-[12px] text-slate-500">Subtotal {{ qty }} {{ variant.uom }}: <strong class="text-slate-900">{{ rupiah(price.unitPrice * qty) }}</strong> (belum PPN)</p>
      </div>

      <!-- side -->
      <div class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-white p-4">
          <div class="flex items-center justify-between"><p class="font-heading font-extrabold text-slate-900">Stok gudang</p><SourceChip /></div>
          <div class="mt-2 space-y-1.5 text-[13px]">
            <div v-for="s in STOCK.default" :key="s.wh" class="flex justify-between border-b border-slate-100 pb-1.5"><span class="text-slate-500">{{ s.wh }}</span><span class="font-semibold text-slate-800 tabular-nums">{{ s.qty }} {{ variant.uom }}</span></div>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 text-[13px]">
          <p class="font-heading font-extrabold text-slate-900">Cara harga ditentukan</p>
          <ol class="mt-2 space-y-1.5 text-slate-600">
            <li>1. Harga kontrak klien (bila ada)</li>
            <li>2. Harga umum sesuai area kirim</li>
            <li>3. Tier sesuai kuantitas</li>
            <li>4. Di atas tier tertinggi atau produk khusus → penawaran Sales</li>
          </ol>
          <p class="mt-2 text-[11px] text-slate-400">Semua price list dikelola di Ukirama.</p>
        </div>
        <div v-if="!isGuest && persona.sales" class="rounded-2xl border border-slate-200 bg-white p-4 text-[13px]">
          <p class="text-[11px] uppercase tracking-wider text-slate-500">Sales PIC Anda</p>
          <p class="font-semibold text-slate-900">{{ persona.sales }}</p>
          <button class="mt-2 flex items-center gap-1.5 text-[#008FD4] font-semibold"><MessageSquare class="h-4 w-4" /> Chat tentang produk ini</button>
        </div>
      </div>
    </div>

    <div class="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
      <p class="font-heading font-extrabold text-slate-900">Deskripsi produk</p>
      <p class="mt-2 max-w-3xl leading-relaxed text-slate-600">{{ product.desc }}</p>
      <div class="mt-4 flex flex-wrap gap-2 text-[12px]">
        <span class="rounded-lg border border-slate-200 px-3 py-1.5">SDS / MSDS (PDF)</span>
        <span class="rounded-lg border border-slate-200 px-3 py-1.5">COA per batch</span>
        <span class="rounded-lg border border-slate-200 px-3 py-1.5">Sertifikat halal</span>
      </div>
    </div>
    </div>
  </StoreLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, Truck, FileText, ShoppingCart, MessageSquare, MessageCircleMore, Lock, ChevronRight, User, X } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import ProductTile from '../components/ProductTile.vue'
import PriceTag from '../components/PriceTag.vue'
import TierTable from '../components/TierTable.vue'
import QtyStepper from '../components/QtyStepper.vue'
import SourceChip from '../components/SourceChip.vue'
import { PRODUCTS, CATEGORIES, REGIONS, STOCK } from '../data'
import { resolvePrice, rupiah } from '../pricing'
import { state, persona, isGuest, addToCart, defaultAddressId, notify } from '../store'

const route = useRoute()
const router = useRouter()
const product = computed(() => PRODUCTS.find((p) => p.slug === route.params.slug) || PRODUCTS[0])
const cat = computed(() => CATEGORIES.find((c) => c.id === product.value.category))
const firstSku = (p) => (p.variants.find((v) => !v.quoteOnly) || p.variants[0]).sku
const sku = ref(firstSku(product.value))
watch(product, (p) => { sku.value = firstSku(p); qty.value = 1 })
const variant = computed(() => product.value.variants.find((v) => v.sku === sku.value) || product.value.variants[0])
const qty = ref(1)
const addressId = ref(defaultAddressId())
watch(() => persona.value.id, () => { addressId.value = defaultAddressId() })
const region = computed(() => isGuest.value ? state.guestRegion : (persona.value.addresses.find((a) => a.id === addressId.value)?.region || 'JBD'))
const price = computed(() => resolvePrice(variant.value.sku, persona.value, region.value, qty.value))
const stockTotal = computed(() => STOCK.default.reduce((n, s) => n + s.qty, 0))

const sheet = ref(null)
const addrLabel = computed(() => persona.value.addresses?.find((a) => a.id === addressId.value)?.label || '')
function openSheet(mode) { sheet.value = mode }
function confirmSheet() { const go = sheet.value === 'buy' || !!price.value.quote; sheet.value = null; add(go) }
function chat() { notify(`Chat dengan ${persona.value.sales || 'Sales iClean'} dibuka di inbox iClean Connect`) }

function add(go) {
  addToCart(variant.value.sku, qty.value, isGuest.value ? null : addressId.value)
  if (go) router.push('/marketplace/keranjang')
  else notify(`${qty.value} ${variant.value.uom} ${product.value.name} masuk keranjang`)
}
</script>

<style scoped>
.sheet-enter-active, .sheet-leave-active { transition: opacity .2s; }
.sheet-enter-active > div:last-child, .sheet-leave-active > div:last-child { transition: transform .25s ease; }
.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-from > div:last-child, .sheet-leave-to > div:last-child { transform: translateY(100%); }
</style>
