<template>
  <div class="min-h-screen bg-slate-100">
    <DomainBar domain="connect.icleanplus.id" strip="/marketplace/sales" />
    <header class="bg-[#0F172A] text-white">
      <div class="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div class="flex items-center gap-3">
          <img src="/logo_iclean_birru.png" alt="" class="h-7 rounded bg-white px-1.5 py-1" />
          <div>
            <p class="font-heading font-extrabold">Konsol Sales · Marketplace</p>
            <p class="text-[11px] text-white/60">Sisi internal iClean — Andi Pratama (Sales Jabodetabek & Bali)</p>
          </div>
        </div>
        <RouterLink to="/marketplace" class="rounded-lg bg-white/10 px-3 py-1.5 text-[13px] font-semibold hover:bg-white/20">← Kembali ke toko</RouterLink>
      </div>
      <div class="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
        <button v-for="t in tabs" :key="t.id" class="whitespace-nowrap rounded-t-lg px-4 py-2 text-[13px]" :class="tab === t.id ? 'bg-slate-100 font-semibold text-slate-900' : 'text-white/70 hover:text-white'" @click="tab = t.id">
          {{ t.label }} <span v-if="t.n" class="ml-1 rounded-full bg-amber-400 px-1.5 text-[10px] font-bold text-slate-900">{{ t.n }}</span>
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-4 py-5 pb-24">
      <!-- verify -->
      <div v-if="tab === 'verify'" class="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div class="rounded-2xl border border-slate-200 bg-white p-5">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="font-heading text-lg font-extrabold text-slate-900">CV Laundry Bersih Jaya</p>
            <span class="rounded-full px-2.5 py-1 text-[11px] font-bold" :class="signup.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-800'">{{ signup.status === 'verified' ? 'Terverifikasi · ' + signup.ukiramaCode : 'Menunggu verifikasi · daftar ' + signup.submittedAt }}</span>
          </div>
          <div class="mt-4 grid gap-x-6 gap-y-2 text-[13px] sm:grid-cols-2">
            <p><span class="text-slate-500">PIC:</span> {{ n.pic }}</p>
            <p><span class="text-slate-500">WhatsApp:</span> {{ n.phone }}</p>
            <p><span class="text-slate-500">Email:</span> {{ n.email }}</p>
            <p><span class="text-slate-500">NPWP:</span> {{ n.npwp }}</p>
            <p><span class="text-slate-500">Industri:</span> {{ n.industry }}</p>
            <p><span class="text-slate-500">Alamat:</span> {{ n.addresses[0].line }}</p>
          </div>
          <div class="mt-5 rounded-xl border border-slate-200 p-4">
            <p class="flex items-center gap-2 text-[13px] font-semibold text-slate-900"><Search class="h-4 w-4" /> Pencocokan dengan data pelanggan Ukirama</p>
            <div class="mt-2 space-y-2 text-[13px]">
              <label v-for="m in matches" :key="m.code" class="flex items-start gap-2.5 rounded-lg border px-3 py-2" :class="choice === m.code ? 'border-[#008FD4] bg-sky-50' : 'border-slate-200'">
                <input v-model="choice" type="radio" :value="m.code" class="mt-1 accent-[#008FD4]" :disabled="signup.status === 'verified'" />
                <span><span class="font-semibold text-slate-900">{{ m.title }}</span><span class="block text-[12px] text-slate-500">{{ m.desc }}</span></span>
              </label>
            </div>
          </div>
          <button v-if="signup.status !== 'verified'" class="mt-4 rounded-lg bg-[#008FD4] px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#016EA3]" @click="verify">Verifikasi & tautkan ke Ukirama</button>
          <p v-else class="mt-4 text-[13px] text-emerald-700">Akun aktif. Klien sekarang melihat harga umum area Bali dan bisa checkout via payment gateway.</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 text-[13px] text-slate-600">
          <p class="font-heading font-extrabold text-slate-900">Yang terjadi saat verifikasi</p>
          <ol class="mt-2 space-y-1.5">
            <li>1. Akun marketplace ditautkan ke kode pelanggan Ukirama (lama atau baru).</li>
            <li>2. Price list, termin, dan limit kredit dibaca dari Ukirama.</li>
            <li>3. Sales PIC & wilayah ditetapkan; klien menerima notifikasi WhatsApp.</li>
          </ol>
        </div>
      </div>

      <!-- quotes -->
      <div v-else-if="tab === 'quote'" class="space-y-3">
        <p v-if="!quotes.length" class="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Tidak ada permintaan penawaran yang menunggu.</p>
        <div v-for="q in quotes" :key="q.id" class="rounded-2xl border border-slate-200 bg-white">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3 text-[13px]">
            <span><strong class="text-slate-900">{{ q.id }}</strong> · {{ PERSONAS[q.customerId].label }} · {{ q.createdAt }}</span>
            <span class="text-slate-500">Kirim ke {{ addrOf(q).label }} ({{ REGIONS[addrOf(q).region].name }})</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] text-[13px]">
              <thead><tr class="text-left text-[11px] uppercase tracking-wider text-slate-500"><th class="px-5 py-2">Produk</th><th class="px-5 py-2">Qty</th><th class="px-5 py-2">Referensi harga</th><th class="px-5 py-2">Harga penawaran / unit</th></tr></thead>
              <tbody class="divide-y divide-slate-100">
                <tr v-for="(it, i) in q.items" :key="it.sku">
                  <td class="px-5 py-2.5"><span class="font-semibold">{{ VARIANTS[it.sku].product.name }}</span> <span class="text-[11px] text-slate-500">· {{ VARIANTS[it.sku].pack }}</span></td>
                  <td class="px-5 py-2.5 tabular-nums">{{ it.qty }} {{ VARIANTS[it.sku].uom }}</td>
                  <td class="px-5 py-2.5 text-[12px] text-slate-500">Harga terakhir {{ rupiah(estimateQuotePrice(it.sku) * 1.04) }}</td>
                  <td class="px-5 py-2.5"><input v-model.number="draft[q.id][i]" class="w-36 rounded-lg border border-slate-300 px-2.5 py-1.5 text-right tabular-nums" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3 text-[12px]">
            <span class="text-slate-500">Catatan klien: {{ q.note || '-' }}</span>
            <button class="rounded-lg bg-[#008FD4] px-4 py-2 text-[13px] font-semibold text-white" @click="issue(q)">Terbitkan quotation di Ukirama</button>
          </div>
        </div>
      </div>

      <!-- orders -->
      <div v-else-if="tab === 'orders'" class="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table class="w-full min-w-[720px] text-[13px]">
          <thead><tr class="text-left text-[11px] uppercase tracking-wider text-slate-500"><th class="px-5 py-2.5">Pesanan</th><th class="px-5 py-2.5">Klien</th><th class="px-5 py-2.5">Dokumen Ukirama</th><th class="px-5 py-2.5">Status</th><th class="px-5 py-2.5">Total</th></tr></thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="o in orders" :key="o.id">
              <td class="px-5 py-2.5 font-semibold whitespace-nowrap">{{ o.id }}</td>
              <td class="px-5 py-2.5">{{ PERSONAS[o.customerId].label }}</td>
              <td class="px-5 py-2.5 text-slate-600">{{ o.ukiramaRef }} · {{ o.invoice?.no }}</td>
              <td class="px-5 py-2.5">{{ stepLabel(o) }}</td>
              <td class="px-5 py-2.5 tabular-nums">{{ rupiah(orderTotal(o).total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- sync -->
      <div v-else class="rounded-2xl border border-slate-200 bg-white">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p class="font-heading font-extrabold text-slate-900">Log sinkronisasi Ukirama</p>
          <button class="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-[12px] font-semibold text-white" @click="syncNow"><RefreshCw class="h-3.5 w-3.5" /> Sinkron sekarang</button>
        </div>
        <div class="divide-y divide-slate-100 text-[13px]">
          <div v-for="(l, i) in state.syncLog" :key="i" class="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-2.5">
            <span class="w-28 shrink-0 text-[12px] text-slate-500 tabular-nums">{{ l.at }}</span>
            <span class="flex w-24 shrink-0 items-center gap-1 text-[12px] font-semibold" :class="l.dir === 'in' ? 'text-emerald-700' : 'text-[#008FD4]'">
              <component :is="l.dir === 'in' ? ArrowDownLeft : ArrowUpRight" class="h-3.5 w-3.5" />{{ l.dir === 'in' ? 'Dari Ukirama' : 'Ke Ukirama' }}
            </span>
            <span class="w-40 shrink-0 font-semibold text-slate-800">{{ l.entity }}</span>
            <span class="min-w-0 flex-1 text-slate-600">{{ l.detail }}</span>
          </div>
        </div>
      </div>
    </main>
    <DemoPanel />
    <transition name="fade"><div v-if="state.toast" :key="state.toast.id" class="fixed left-1/2 top-20 z-[70] -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2.5 text-[13px] text-white shadow-float">{{ state.toast.msg }}</div></transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect } from 'vue'
import { Search, RefreshCw, ArrowDownLeft, ArrowUpRight } from 'lucide-vue-next'
import DomainBar from '../components/DomainBar.vue'
import DemoPanel from '../components/DemoPanel.vue'
import { PERSONAS, VARIANTS, REGIONS } from '../data'
import { rupiah } from '../pricing'
import { state, verifySignup, issueQuote, estimateQuotePrice, stepLabel, orderTotal, notify } from '../store'

const n = PERSONAS.new
const signup = computed(() => state.signups.new)
const quotes = computed(() => state.orders.filter((o) => o.type === 'quote' && o.quoteStatus === 'requested'))
const orders = computed(() => state.orders.filter((o) => o.type === 'order'))
const tab = ref(signup.value.status !== 'verified' ? 'verify' : quotes.value.length ? 'quote' : 'orders')
const tabs = computed(() => [
  { id: 'verify', label: 'Verifikasi akun', n: signup.value.status === 'verified' ? 0 : 1 },
  { id: 'quote', label: 'Permintaan penawaran', n: quotes.value.length },
  { id: 'orders', label: 'Pesanan marketplace', n: 0 },
  { id: 'sync', label: 'Sinkron Ukirama', n: 0 },
])
const matches = [
  { code: 'C-01342', title: 'Buat pelanggan baru di Ukirama → C-01342', desc: 'Tidak ditemukan data dengan NPWP atau nomor WhatsApp yang sama.' },
  { code: 'C-00977', title: 'Tautkan ke C-00977 · Bersih Jaya Laundry (Denpasar)', desc: 'Nama mirip, pernah membeli lewat Sales pada 2025. Riwayat & harga ikut terbawa.' },
]
const choice = ref('C-01342')
const draft = reactive({})
watchEffect(() => { quotes.value.forEach((q) => { if (!draft[q.id]) draft[q.id] = q.items.map((it) => estimateQuotePrice(it.sku)) }) })
const addrOf = (q) => PERSONAS[q.customerId].addresses.find((a) => a.id === q.addressId)

function verify() { verifySignup(choice.value, 'Made Ariawan'); notify(`Akun ditautkan ke ${choice.value} di Ukirama`) }
function issue(q) { issueQuote(q, draft[q.id]); notify(`Quotation ${q.ukiramaRef} terbit · klien menerima notifikasi`) }
function syncNow() { state.syncLog.unshift({ at: 'baru saja', dir: 'in', entity: 'Price list & stok', detail: 'Tidak ada perubahan sejak sinkron terakhir', ok: true }) }
</script>
