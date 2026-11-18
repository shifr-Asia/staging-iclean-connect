<template>
  <div class="min-h-screen bg-[#F5F6F8] text-slate-800">
    <DomainBar domain="order.icleanplus.id" />

    <!-- store header -->
    <header class="sticky top-[37px] z-40 bg-[#003C80] text-white shadow-sm">
      <div class="hidden md:block border-b border-white/10">
        <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-1 text-[11px] text-white/70">
          <span>Portal pengadaan resmi iClean · produk, harga & status pesanan langsung dari ERP</span>
          <div class="flex items-center gap-4">
            <RouterLink to="/marketplace/pesanan" class="hover:text-white">Lacak pesanan</RouterLink>
            <a href="#" class="hover:text-white" @click.prevent>Bantuan</a>
            <span>Hubungi Sales: 0811-8878-333</span>
          </div>
        </div>
      </div>
      <div class="mx-auto flex max-w-7xl items-center gap-3 md:gap-6 px-4 py-3">
        <RouterLink to="/marketplace" class="flex shrink-0 items-center gap-2">
          <span class="grid h-9 w-9 place-items-center rounded-lg bg-white"><img src="/logo_iclean_birru.png" alt="iClean" class="h-5" /></span>
          <span class="hidden sm:block leading-tight">
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
        <div class="hidden md:flex shrink-0 items-center gap-2">
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
      <nav class="hidden md:block bg-[#003C80] border-t border-white/10">
        <div class="mx-auto flex max-w-7xl items-center gap-5 px-4 py-2 text-[13px] text-white/80">
          <RouterLink v-for="c in CATEGORIES" :key="c.id" :to="{ path: '/marketplace', query: { kategori: c.id } }" class="hover:text-white">{{ c.name }}</RouterLink>
          <RouterLink to="/marketplace/pesanan" class="ml-auto flex items-center gap-1.5 hover:text-white"><Receipt class="w-4 h-4" /> Pesanan saya</RouterLink>
        </div>
      </nav>
    </header>

    <div v-if="persona.status === 'pending'" class="bg-amber-50 border-b border-amber-200">
      <div class="mx-auto max-w-7xl px-4 py-2 text-[12px] text-amber-900 flex items-center gap-2">
        <Clock class="w-4 h-4 shrink-0" /> Akun {{ persona.company }} sedang diverifikasi Sales iClean. Anda tetap bisa menjelajah katalog; harga dan checkout aktif setelah akun ditautkan ke data pelanggan di Ukirama.
      </div>
    </div>

    <main class="mx-auto max-w-7xl px-3 sm:px-4 py-4 md:py-6 pb-28 md:pb-12">
      <slot />
    </main>

    <footer class="hidden md:block border-t border-slate-200 bg-white">
      <div class="mx-auto grid max-w-7xl grid-cols-4 gap-6 px-4 py-8 text-[12px] text-slate-500">
        <div><img src="/logo_iclean_birru.png" alt="iClean" class="h-6" /><p class="mt-2">Portal pengadaan B2B resmi iClean untuk hotel, restoran, rumah sakit, laundry, dan fasilitas.</p></div>
        <div><p class="font-semibold text-slate-800">Layanan</p><p class="mt-2">Harga kontrak per klien</p><p>Multi-alamat gudang & cabang</p><p>Invoice TOP & payment gateway</p></div>
        <div><p class="font-semibold text-slate-800">Data pesanan</p><p class="mt-2">Harga, stok, invoice, pembayaran & pengiriman bersumber dari Ukirama ERP</p></div>
        <div><p class="font-semibold text-slate-800">Butuh bantuan?</p><p class="mt-2">Sales & CS iClean · Senin–Jumat 08.00–17.00</p></div>
      </div>
    </footer>

    <!-- mobile bottom nav -->
    <nav class="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-slate-200 bg-white md:hidden">
      <RouterLink v-for="t in tabs" :key="t.to" :to="t.to" class="flex flex-col items-center py-2 text-[10px]" :class="$route.path === t.to ? 'text-[#008FD4] font-semibold' : 'text-slate-500'">
        <component :is="t.icon" class="w-5 h-5" />{{ t.label }}
      </RouterLink>
    </nav>

    <DemoPanel />

    <transition name="toast">
      <div v-if="state.toast" :key="state.toast.id" class="fixed left-1/2 top-24 z-[70] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] text-white shadow-float flex items-center gap-2 max-w-[92vw]">
        <CircleCheck class="w-4 h-4 text-emerald-400 shrink-0" /> {{ state.toast.msg }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Search, ShoppingCart, Building2, Receipt, Clock, Store, User, CircleCheck } from 'lucide-vue-next'
import DomainBar from './DomainBar.vue'
import DemoPanel from './DemoPanel.vue'
import { CATEGORIES } from '../data'
import { state, persona, isGuest, cartCount } from '../store'

const router = useRouter()
const q = ref('')
const goSearch = () => router.push({ path: '/marketplace', query: q.value ? { q: q.value } : {} })
const tabs = [
  { to: '/marketplace', label: 'Beranda', icon: Store },
  { to: '/marketplace/keranjang', label: 'Keranjang', icon: ShoppingCart },
  { to: '/marketplace/pesanan', label: 'Pesanan', icon: Receipt },
  { to: '/marketplace/akun', label: 'Akun', icon: User },
]
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: opacity .2s, transform .2s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, -8px); }
</style>
