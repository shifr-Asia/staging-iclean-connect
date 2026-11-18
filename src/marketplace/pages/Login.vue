<template>
  <StoreLayout title="Masuk">
    <div class="mcard mx-auto grid max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-2">
      <div class="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#003C80] to-[#008FD4] p-8 text-white">
        <div>
          <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-200">iClean Order</p>
          <p class="mt-2 font-heading text-2xl font-extrabold leading-tight">Masuk untuk melihat harga kontrak, invoice, dan status pengiriman.</p>
        </div>
        <ul class="space-y-2 text-sm text-white/85">
          <li class="flex gap-2"><Check class="h-4 w-4 mt-0.5" />Harga khusus per perusahaan & area kirim</li>
          <li class="flex gap-2"><Check class="h-4 w-4 mt-0.5" />Riwayat pesanan & pembayaran dari Ukirama</li>
          <li class="flex gap-2"><Check class="h-4 w-4 mt-0.5" />Satu akun untuk semua cabang</li>
        </ul>
      </div>

      <div class="p-4 sm:p-8">
        <p v-if="redirect.includes('checkout')" class="mb-4 rounded-lg bg-sky-50 px-3 py-2 text-[12px] text-[#016EA3]">Masuk dulu untuk melanjutkan checkout. Keranjang Anda tetap tersimpan.</p>
        <h1 class="font-heading text-xl font-extrabold text-slate-900">Masuk</h1>

        <template v-if="step === 1">
          <label class="mt-5 block text-[13px] font-semibold text-slate-700">Email atau nomor WhatsApp</label>
          <input v-model="ident" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#008FD4] focus:outline-none" placeholder="purchasing@perusahaan.co.id" />
          <button class="mt-4 w-full rounded-lg bg-[#008FD4] py-2.5 font-semibold text-white hover:bg-[#016EA3] disabled:bg-slate-300" :disabled="!ident" @click="step = 2">Kirim kode OTP</button>
        </template>
        <template v-else>
          <p class="mt-3 text-[13px] text-slate-600">Kode 6 digit dikirim ke <strong>{{ ident }}</strong>.</p>
          <div class="mt-3 flex gap-2">
            <input v-for="i in 6" :key="i" maxlength="1" class="h-11 w-full rounded-lg border border-slate-300 text-center text-lg font-bold" :value="'482916'[i - 1]" />
          </div>
          <button class="mt-4 w-full rounded-lg bg-[#008FD4] py-2.5 font-semibold text-white hover:bg-[#016EA3]" @click="doLogin(matchPersona())">Masuk</button>
        </template>

        <div class="mt-6">
          <p class="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Akun demo</p>
          <div class="mt-2 grid gap-2">
            <button v-for="a in demo" :key="a.id" class="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2 text-left text-[13px] hover:border-[#008FD4] hover:bg-sky-50" @click="doLogin(a.id)">
              <span><span class="font-semibold text-slate-800">{{ a.label }}</span><span class="block text-[11px] text-slate-500">{{ a.hint }}</span></span>
              <ChevronRight class="h-4 w-4 text-slate-400" />
            </button>
          </div>
        </div>

        <p class="mt-6 text-center text-[13px] text-slate-600">Belum punya akun? <RouterLink :to="{ path: '/marketplace/daftar', query: { redirect } }" class="font-semibold text-[#008FD4]">Daftar perusahaan</RouterLink></p>
      </div>
    </div>
  </StoreLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, ChevronRight } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import { login, notify, persona } from '../store'
import { PERSONAS } from '../data'

const route = useRoute()
const router = useRouter()
const redirect = computed(() => (route.query.redirect || '/marketplace').toString())
const step = ref(1)
const ident = ref('')
const demo = [
  { id: 'hgs', label: 'Hotel Grand Serpong', hint: 'Klien kontrak · TOP 30 hari · 3 alamat' },
  { id: 'kls', label: 'Klinik Sehat Medika', hint: 'Klien terverifikasi · bayar via VA/QRIS' },
  { id: 'new', label: 'CV Laundry Bersih Jaya', hint: 'Baru mendaftar · menunggu verifikasi Sales' },
]
const matchPersona = () => Object.values(PERSONAS).find((p) => p.email && ident.value.toLowerCase().includes(p.email.split('@')[1].split('.')[0]))?.id || 'hgs'
function doLogin(id) {
  login(id)
  notify(`Masuk sebagai ${persona.value.label}`)
  router.push(redirect.value)
}
</script>
