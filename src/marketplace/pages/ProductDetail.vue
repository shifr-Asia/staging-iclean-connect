<template>
  <StoreLayout>
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
  </StoreLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Star, Truck, FileText, ShoppingCart, MessageSquare } from 'lucide-vue-next'
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

function add(go) {
  addToCart(variant.value.sku, qty.value, isGuest.value ? null : addressId.value)
  if (go) router.push('/marketplace/keranjang')
  else notify(`${qty.value} ${variant.value.uom} ${product.value.name} masuk keranjang`)
}
</script>
