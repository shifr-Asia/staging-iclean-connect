<template>
  <div class="min-h-screen bg-[#F5F6F8] text-slate-800">
    <DomainBar domain="order.icleanplus.id" />

    <!-- ── desktop header ── -->
    <header class="hidden md:block sticky top-[38px] z-40 bg-[#003C80] text-white shadow-sm">
      <div class="border-b border-white/10">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 text-[11px] text-white/70">
          <span>Portal pengadaan resmi iClean · produk, harga & status pesanan langsung dari ERP</span>
          <div class="flex items-center gap-4">
            <RouterLink to="/marketplace/pesanan" class="hover:text-white">Lacak pesanan</RouterLink>
            <RouterLink to="/marketplace/notifikasi" class="hover:text-white">Notifikasi</RouterLink>
            <span>Hubungi Sales: 0811-8878-333</span>
          </div>
        </div>
      </div>
      <div class="mx-auto flex max-w-7xl items-center gap-6 px-4 py-3">
        <RouterLink to="/marketplace" class="flex shrink-0 items-center gap-2">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-white"><img src="/logo_iclean_birru.png" alt="iClean" class="h-5" /></span>
          <span class="leading-tight">
            <span class="block font-heading text-lg font-extrabold">iClean <span class="text-sky-300">Order</span></span>
            <span class="block text-[10px] text-white/60">B2B Marketplace</span>
          </span>
        </RouterLink>
        <form class="flex min-w-0 flex-1 items-center rounded-lg bg-white p-1" @submit.prevent="goSearch">
          <input v-model="q" class="min-w-0 flex-1 bg-transparent px-2.5 py-1 text-sm text-slate-800 focus:outline-none" placeholder="Cari degreaser, deterjen laundry, sanitizer…" />
          <button class="grid h-8 w-10 place-items-center rounded-md bg-[#008FD4] hover:bg-[#016EA3]"><Search class="w-4 h-4" /></button>
        </form>
        <RouterLink to="/marketplace/keranjang" class="relative grid h-10 w-10 shrink-0 place-items-center rounded-lg hover:bg-white/10" aria-label="Keranjang">
          <ShoppingCart class="w-6 h-6" />
          <span v-if="cartCount" class="absolute -right-0.5 -top-0.5 min-w-[18px] rounded-full bg-amber-400 px-1 text-center text-[10px] font-bold leading-[18px] text-slate-900">{{ cartCount > 99 ? '99+' : cartCount }}</span>
        </RouterLink>
        <div class="flex shrink-0 items-center gap-2">
          <template v-if="isGuest">
            <RouterLink :to="{ path: '/marketplace/masuk', query: { redirect: $route.fullPath } }" class="rounded-lg border border-white/40 px-3.5 py-1.5 text-sm font-semibold hover:bg-white/10">Masuk</RouterLink>
            <RouterLink to="/marketplace/daftar" class="rounded-lg bg-white px-3.5 py-1.5 text-sm font-semibold text-[#003C80] hover:bg-sky-50">Daftar</RouterLink>
          </template>
          <RouterLink v-else to="/marketplace/akun" class="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-white/10">
            <span class="grid h-8 w-8 place-items-center rounded-full bg-white/15"><Building2 class="w-4 h-4" /></span>
            <span class="leading-tight text-left">
              <span class="block max-w-[150px] truncate text-[13px] font-semibold">{{ persona.label }}</span>
              <span class="block text-[10px]" :class="persona.status === 'pending' ? 'text-amber-300' : 'text-white/60'">{{ persona.status === 'pending' ? 'Menunggu verifikasi' : persona.ukiramaCode }}</span>
            </span>
          </RouterLink>
        </div>
      </div>
      <nav class="border-t border-white/10">
        <div class="mx-auto flex max-w-7xl items-center gap-5 px-4 py-2 text-[13px] text-white/80">
          <RouterLink v-for="c in CATEGORIES" :key="c.id" :to="{ path: '/marketplace', query: { kategori: c.id } }" class="hover:text-white">{{ c.name }}</RouterLink>
          <RouterLink to="/marketplace/pesanan" class="ml-auto flex items-center gap-1.5 hover:text-white"><Receipt class="w-4 h-4" /> Pesanan saya</RouterLink>
        </div>
      </nav>
    </header>

    <!-- ── mobile header (Shopee pattern) ── -->
    <header v-if="!title" class="md:hidden sticky top-[38px] z-40 flex items-center gap-2 bg-[#003C80] px-3 py-2.5">
      <form v-if="!hideSearch" class="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-white px-2.5 py-2" @submit.prevent="goSearch">
        <Search class="h-4 w-4 shrink-0 text-[#008FD4]" />
        <input v-model="q" class="min-w-0 flex-1 bg-transparent text-[13px] text-slate-800 placeholder:text-[#008FD4]/70 focus:outline-none" placeholder="Cari produk iClean" />
      </form>
      <span v-else class="flex-1" />
      <RouterLink to="/marketplace/keranjang" class="relative grid h-9 w-9 shrink-0 place-items-center text-white" aria-label="Keranjang">
        <ShoppingCart class="h-6 w-6" />
        <span v-if="cartCount" class="absolute right-0 top-0 min-w-[16px] rounded-full border border-[#003C80] bg-amber-400 px-1 text-center text-[9px] font-bold leading-[14px] text-slate-900">{{ cartCount > 99 ? '99+' : cartCount }}</span>
      </RouterLink>
      <RouterLink to="/marketplace/notifikasi" class="relative grid h-9 w-9 shrink-0 place-items-center text-white" aria-label="Chat & notifikasi">
        <MessageCircleMore class="h-6 w-6" />
        <span v-if="unread" class="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#003C80] bg-rose-500" />
      </RouterLink>
    </header>
    <header v-else class="md:hidden sticky top-[38px] z-40 flex h-12 items-center gap-1 border-b border-slate-200 bg-white px-1">
      <button class="grid h-10 w-10 place-items-center text-[#008FD4]" aria-label="Kembali" @click="back"><ArrowLeft class="h-5 w-5" /></button>
      <p class="min-w-0 flex-1 truncate text-[16px] text-slate-900">{{ title }}</p>
      <slot name="mobile-actions">
        <RouterLink to="/marketplace/keranjang" class="relative grid h-10 w-10 place-items-center text-[#008FD4]" aria-label="Keranjang">
          <ShoppingCart class="h-5 w-5" />
          <span v-if="cartCount" class="absolute right-1 top-1 min-w-[16px] rounded-full bg-rose-500 px-1 text-center text-[9px] font-bold leading-[16px] text-white">{{ cartCount > 99 ? '99+' : cartCount }}</span>
        </RouterLink>
      </slot>
    </header>

    <div v-if="persona.status === 'pending'" class="bg-amber-50 border-b border-amber-200">
      <div class="mx-auto max-w-7xl px-3 md:px-4 py-2 text-[12px] text-amber-900 flex items-center gap-2">
        <Clock class="w-4 h-4 shrink-0" /> <span>Akun {{ persona.company }} sedang diverifikasi Sales. Harga & checkout aktif setelah akun ditautkan ke data pelanggan di Ukirama.</span>
      </div>
    </div>

    <main class="mkt-main mx-auto max-w-7xl md:px-4 md:py-6" :class="$slots.bottom ? 'pb-24 md:pb-12' : title ? 'pb-6 md:pb-12' : 'pb-20 md:pb-12'">
      <slot />
    </main>

    <footer class="hidden md:block border-t border-slate-200 bg-white">
      <div class="mx-auto grid max-w-7xl grid-cols-4 gap-6 px-4 py-8 text-[12px] text-slate-500">
        <div><img src="/logo_iclean_birru.png" alt="iClean" class="h-6" /><p class="mt-2">Portal pengadaan B2B resmi iClean untuk hotel, restoran, rumah sakit, laundry, dan fasilitas.</p></div>
        <div><p class="font-semibold text-slate-800">Layanan</p><p class="mt-2">Harga kontrak per klien</p><p>Multi-alamat gudang & cabang</p><p>Invoice TOP & VA/QRIS dari Ukirama</p></div>
        <div><p class="font-semibold text-slate-800">Data pesanan</p><p class="mt-2">Harga, stok, invoice, pembayaran & pengiriman bersumber dari Ukirama ERP</p></div>
        <div><p class="font-semibold text-slate-800">Butuh bantuan?</p><p class="mt-2">Sales & CS iClean · Senin–Jumat 08.00–17.00</p></div>
      </div>
    </footer>

    <!-- mobile sticky action bar supplied by the page -->
    <div v-if="$slots.bottom" class="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white md:hidden pb-[env(safe-area-inset-bottom)]">
      <slot name="bottom" />
    </div>
    <!-- mobile bottom nav (Shopee: Beranda · Kategori · Notifikasi · Saya) -->
    <nav v-else-if="!title" class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white md:hidden pb-[env(safe-area-inset-bottom)]">
      <RouterLink v-for="t in tabs" :key="t.to" :to="t.to" class="relative flex flex-col items-center gap-0.5 pt-1.5 pb-1 text-[10px]" :class="isActive(t) ? 'text-[#008FD4]' : 'text-slate-500'">
        <component :is="t.icon" class="h-[22px] w-[22px]" :stroke-width="isActive(t) ? 2.2 : 1.6" />{{ t.label }}
        <span v-if="t.badge" class="absolute left-1/2 top-0.5 ml-1.5 min-w-[16px] rounded-full bg-rose-500 px-1 text-center text-[9px] font-bold leading-[16px] text-white">{{ t.badge }}</span>
      </RouterLink>
    </nav>

    <DemoPanel :raised="!!$slots.bottom" />

    <transition name="toast">
      <div v-if="state.toast" :key="state.toast.id" class="fixed left-1/2 top-1/2 md:top-24 z-[70] -translate-x-1/2 rounded-xl bg-slate-900/90 md:bg-slate-900 px-4 py-2.5 text-[13px] text-white shadow-float flex items-center gap-2 max-w-[86vw]">
        <CircleCheck class="w-4 h-4 text-emerald-400 shrink-0" /> {{ state.toast.msg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Search, ShoppingCart, Building2, Receipt, Clock, Store, User, CircleCheck, ArrowLeft, LayoutGrid, Bell, MessageCircleMore } from 'lucide-vue-next'
import DomainBar from './DomainBar.vue'
import DemoPanel from './DemoPanel.vue'
import { CATEGORIES } from '../data'
import { state, persona, isGuest, cartCount, unreadCount } from '../store'

const props = defineProps({ title: String, backTo: String, hideSearch: Boolean })
const router = useRouter()
const route = useRoute()
const q = ref('')
const goSearch = () => router.push({ path: '/marketplace', query: q.value ? { q: q.value } : {} })
const back = () => (props.backTo ? router.push(props.backTo) : window.history.length > 1 ? router.back() : router.push('/marketplace'))
const unread = computed(() => unreadCount.value)
const tabs = computed(() => [
  { to: '/marketplace', label: 'Beranda', icon: Store, exact: true },
  { to: '/marketplace/kategori', label: 'Kategori', icon: LayoutGrid },
  { to: '/marketplace/notifikasi', label: 'Notifikasi', icon: Bell, badge: unread.value || null },
  { to: '/marketplace/akun', label: 'Saya', icon: User },
])
const isActive = (t) => (t.exact ? route.path === t.to : route.path.startsWith(t.to))
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: opacity .2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; }
</style>
