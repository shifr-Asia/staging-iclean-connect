<template>
  <StoreLayout title="Pesanan Saya" back-to="/marketplace/akun">
    <div class="hidden md:flex flex-wrap items-center justify-between gap-2">
      <h1 class="font-heading text-xl font-extrabold text-slate-900">Pesanan saya</h1>
      <SourceChip label="Status & riwayat dari Ukirama" />
    </div>

    <div v-if="isGuest" class="mcard md:mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <p class="font-semibold text-slate-800">Masuk untuk melihat pesanan Anda</p>
      <RouterLink :to="{ path: '/marketplace/masuk', query: { redirect: '/marketplace/pesanan' } }" class="mt-3 inline-block rounded-lg bg-[#008FD4] px-5 py-2 font-semibold text-white">Masuk</RouterLink>
    </div>

    <template v-else>
      <div class="no-scrollbar sticky top-[86px] z-30 md:static md:mt-4 overflow-x-auto border-b md:border md:rounded-2xl border-slate-200 bg-white">
        <div class="flex min-w-max">
          <button v-for="t in STATUS_TABS" :key="t.id" class="relative px-4 py-3 text-[13px] whitespace-nowrap" :class="tab === t.id ? 'font-semibold text-[#008FD4]' : 'text-slate-600 hover:text-slate-900'" @click="tab = t.id">
            {{ t.label }}<span v-if="count(t.id)" class="ml-1 text-[11px]">({{ count(t.id) }})</span>
            <span v-if="tab === t.id" class="absolute inset-x-3 bottom-0 h-0.5 rounded bg-[#008FD4]" />
          </button>
        </div>
      </div>

      <div class="mt-2 md:mt-3 space-y-2 md:space-y-3">
        <p v-if="!list.length" class="mcard rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Belum ada pesanan di status ini.</p>
        <RouterLink v-for="o in list" :key="o.id" :to="`/marketplace/pesanan/${o.id}`" class="mcard block rounded-2xl border border-slate-200 bg-white hover:border-[#008FD4]/60">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 md:px-4 py-2.5 text-[12px]">
            <span class="flex flex-wrap items-center gap-x-2 text-slate-500">
              <strong class="text-slate-900">{{ o.id }}</strong>
              <span v-if="o.ukiramaRef">· {{ o.ukiramaRef }}</span>
              <span class="hidden md:inline">· {{ o.createdAt }}</span>
            </span>
            <span class="font-semibold" :class="badgeCls(o)">{{ stepLabel(o) }}</span>
          </div>
          <div class="flex gap-3 px-3 md:px-4 py-3">
            <ProductTile :product="VARIANTS[o.items[0].sku].product" class="h-16 w-16 shrink-0" />
            <div class="min-w-0 flex-1 text-[13px]">
              <p class="truncate font-semibold text-slate-800">{{ VARIANTS[o.items[0].sku].product.name }} <span class="font-normal text-slate-500">· {{ VARIANTS[o.items[0].sku].pack }}</span></p>
              <p class="text-[12px] text-slate-500">{{ o.items[0].qty }} {{ VARIANTS[o.items[0].sku].uom }}<span v-if="o.items.length > 1"> · +{{ o.items.length - 1 }} produk lain</span></p>
              <p class="mt-1 flex items-center gap-1 text-[12px] text-slate-500"><MapPin class="h-3.5 w-3.5" /> {{ addrLabel(o) }}</p>
            </div>
            <div class="shrink-0 text-right">
              <p class="text-[11px] text-slate-500">{{ o.type === 'quote' && o.quoteStatus === 'requested' ? 'Total' : 'Total tagihan' }}</p>
              <p class="font-heading font-extrabold tabular-nums" :class="o.type === 'quote' && o.quoteStatus === 'requested' ? 'text-amber-700 text-[13px]' : 'text-[#003C80]'">{{ o.type === 'quote' && o.quoteStatus === 'requested' ? 'Menunggu harga' : rupiah(orderTotal(o).total) }}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-3 md:px-4 py-2.5 text-[12px]">
            <span class="min-w-0 truncate text-slate-500">{{ o.payment?.label || (o.quoteStatus === 'issued' ? `Berlaku sampai ${o.validUntil}` : 'Sales sedang menyiapkan quotation') }}</span>
            <span class="shrink-0 rounded-sm md:rounded-none bg-[#008FD4] md:bg-transparent px-3 md:px-0 py-1.5 md:py-0 font-semibold text-white md:text-[#008FD4]">{{ cta(o) }}<span class="hidden md:inline"> →</span></span>
          </div>
        </RouterLink>
      </div>
    </template>
  </StoreLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { MapPin } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import ProductTile from '../components/ProductTile.vue'
import SourceChip from '../components/SourceChip.vue'
import { STATUS_TABS, VARIANTS } from '../data'
import { rupiah } from '../pricing'
import { state, persona, isGuest, orderTab, stepLabel, orderTotal, addressById } from '../store'

const route = useRoute()
const mine = computed(() => state.orders.filter((o) => o.customerId === persona.value.id))
const firstNonEmpty = STATUS_TABS.find((t) => mine.value.some((o) => orderTab(o) === t.id))?.id || 'processing'
const tab = ref(route.query.tab || firstNonEmpty)
watch(() => route.query.tab, (t) => { if (t) tab.value = t })
const list = computed(() => mine.value.filter((o) => orderTab(o) === tab.value))
const count = (id) => mine.value.filter((o) => orderTab(o) === id).length
const addrLabel = (o) => addressById(o.addressId)?.label || '-'
const badgeCls = (o) => ({ quote: 'text-amber-700', unpaid: 'text-rose-600', processing: 'text-[#008FD4]', shipped: 'text-indigo-600', done: 'text-emerald-600', cancelled: 'text-slate-500' }[orderTab(o)])
const cta = (o) => ({ quote: o.quoteStatus === 'issued' ? 'Lihat & setujui penawaran' : 'Lihat permintaan', unpaid: 'Bayar sekarang', processing: 'Lacak pesanan', shipped: 'Lacak pengiriman', done: 'Lihat detail · Pesan lagi', cancelled: 'Lihat detail' }[orderTab(o)])
</script>
