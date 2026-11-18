<template>
  <div class="fixed right-3 z-[60] flex flex-col items-end md:items-start md:bottom-4 md:left-3 md:right-auto" :class="raised ? 'bottom-[84px]' : 'bottom-[72px]'">
    <transition name="fade">
      <div v-if="open" class="mb-2 w-[290px] max-h-[70vh] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-float text-[13px]">
        <div class="flex items-center justify-between">
          <p class="font-heading font-extrabold text-[#003C80]">Panel demo</p>
          <button class="text-slate-400 hover:text-slate-700" @click="open = false"><X class="w-4 h-4" /></button>
        </div>
        <p class="mt-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">Masuk sebagai</p>
        <div class="mt-1.5 space-y-1">
          <button v-for="p in list" :key="p.id" class="flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-left" :class="state.personaId === p.id ? 'border-[#008FD4] bg-sky-50' : 'border-slate-200 hover:bg-slate-50'" @click="pick(p.id)">
            <span class="font-semibold text-slate-800">{{ p.label }}</span>
            <span class="text-[10px] text-slate-500">{{ p.hint }}</span>
          </button>
        </div>
        <div class="mt-3 grid gap-1.5">
          <button class="flex items-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 font-semibold text-white hover:bg-emerald-700" @click="simulateUkiramaUpdate($route.params.id)">
            <RefreshCw class="w-4 h-4" /> Simulasikan update dari Ukirama
          </button>
          <RouterLink to="/marketplace/sales" class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50" @click="open = false"><LayoutDashboard class="w-4 h-4" /> Konsol Sales (internal)</RouterLink>
          <RouterLink to="/marketplace/integrasi" class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50" @click="open = false"><ArrowLeftRight class="w-4 h-4" /> Integrasi Ukirama</RouterLink>
          <RouterLink to="/marketplace/produk/kitchen-degreaser-pro" class="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50" @click="open = false"><Globe class="w-4 h-4" /> Mulai dari icleanplus.id</RouterLink>
          <button class="text-[11px] text-slate-400 hover:text-rose-600 pt-1" @click="resetDemo">Reset data demo</button>
        </div>
      </div>
    </transition>
    <button class="flex items-center gap-2 rounded-full bg-slate-900 p-3 md:px-3.5 md:py-2 text-[12px] font-semibold text-white shadow-float hover:bg-slate-800" :title="`Panel demo · ${persona.label}`" @click="open = !open">
      <FlaskConical class="w-4 h-4 text-emerald-400" /><span class="hidden md:inline">Demo · {{ persona.label }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { X, RefreshCw, LayoutDashboard, ArrowLeftRight, Globe, FlaskConical } from 'lucide-vue-next'
import { state, persona, login, logout, simulateUkiramaUpdate, resetDemo, notify } from '../store'
defineProps({ raised: Boolean })
const open = ref(false)
const list = [
  { id: 'guest', label: 'Tamu', hint: 'belum login' },
  { id: 'hgs', label: 'Hotel Grand Serpong', hint: 'kontrak · TOP 30' },
  { id: 'kls', label: 'Klinik Sehat Medika', hint: 'VA/QRIS' },
  { id: 'new', label: 'CV Laundry Bersih Jaya', hint: 'pendaftar baru' },
]
function pick(id) {
  id === 'guest' ? logout() : login(id)
  notify(`Masuk sebagai ${persona.value.label}`)
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity .15s, transform .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(6px); }
</style>
