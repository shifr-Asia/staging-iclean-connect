<template>
  <StoreLayout>
    <div class="md:mx-auto md:max-w-3xl">
      <div class="flex items-center justify-between bg-white px-3 py-3 md:rounded-t-2xl md:border md:border-b-0 md:border-slate-200 md:px-5">
        <h1 class="text-[16px] font-semibold text-slate-900 md:font-heading md:text-lg md:font-extrabold">Notifikasi</h1>
        <SourceChip label="Status dari Ukirama" />
      </div>

      <div v-if="isGuest" class="bg-white p-8 text-center md:rounded-b-2xl md:border md:border-slate-200">
        <p class="text-[13px] text-slate-600">Masuk untuk menerima update pesanan, quotation, dan pembayaran.</p>
        <RouterLink :to="{ path: '/marketplace/masuk', query: { redirect: '/marketplace/notifikasi' } }" class="mt-3 inline-block rounded bg-[#008FD4] px-5 py-2 text-[13px] font-semibold text-white">Masuk</RouterLink>
      </div>

      <template v-else>
        <!-- category rows, Shopee style -->
        <div class="mt-px divide-y divide-slate-100 bg-white md:border-x md:border-slate-200">
          <div v-for="g in groups" :key="g.kind" class="flex items-center gap-3 px-3 py-3 md:px-5">
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full" :class="g.cls"><component :is="g.icon" class="h-[18px] w-[18px]" /></span>
            <div class="min-w-0 flex-1"><p class="text-[13px] font-semibold text-slate-900">{{ g.label }}</p><p class="truncate text-[11px] text-slate-500">{{ g.desc }}</p></div>
            <span v-if="g.n" class="rounded-full bg-rose-500 px-1.5 text-[10px] font-bold leading-[16px] text-white">{{ g.n }}</span>
          </div>
        </div>
        <p class="bg-[#F5F6F8] px-3 pb-2 pt-4 text-[12px] font-semibold text-slate-500 md:px-0">Update pesanan</p>
        <div class="divide-y divide-slate-100 bg-white md:rounded-b-2xl md:border md:border-slate-200">
          <RouterLink v-for="(n, i) in notifications" :key="n.key" :to="`/marketplace/pesanan/${n.orderId}`" class="flex gap-3 px-3 py-3 md:px-5" :class="i < unreadAtOpen ? 'bg-sky-50/70' : ''">
            <ProductTile :product="productOf(n.orderId)" class="h-12 w-12 shrink-0" rounded="rounded" />
            <div class="min-w-0 flex-1">
              <p class="text-[13px] font-semibold text-slate-900">{{ n.title }}</p>
              <p class="text-[12px] leading-snug text-slate-600">{{ n.body }}</p>
              <p class="mt-1 text-[10px] text-slate-400">{{ n.at }}</p>
            </div>
          </RouterLink>
          <p v-if="!notifications.length" class="p-8 text-center text-[13px] text-slate-500">Belum ada notifikasi.</p>
        </div>
      </template>
    </div>
  </StoreLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Truck, FileText, Wallet, Megaphone } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import ProductTile from '../components/ProductTile.vue'
import SourceChip from '../components/SourceChip.vue'
import { VARIANTS } from '../data'
import { state, isGuest, notifications, unreadCount, markNotificationsRead } from '../store'

const unreadAtOpen = ref(unreadCount.value)
onMounted(() => markNotificationsRead())
const productOf = (id) => VARIANTS[state.orders.find((o) => o.id === id).items[0].sku].product
const count = (k) => notifications.value.filter((n) => n.kind === k).length
const groups = computed(() => [
  { kind: 'ship', label: 'Pengiriman', desc: 'Pesanan dikemas, dikirim, dan diterima', icon: Truck, cls: 'bg-indigo-50 text-indigo-600', n: count('ship') },
  { kind: 'quote', label: 'Penawaran', desc: 'Quotation baru dari Sales', icon: FileText, cls: 'bg-amber-50 text-amber-600', n: count('quote') },
  { kind: 'pay', label: 'Tagihan & pembayaran', desc: 'Invoice terbit dan pembayaran diterima', icon: Wallet, cls: 'bg-emerald-50 text-emerald-600', n: count('pay') },
  { kind: 'promo', label: 'Info dari iClean', desc: 'Produk baru dan jadwal kunjungan teknisi', icon: Megaphone, cls: 'bg-rose-50 text-rose-500', n: 0 },
])
</script>
