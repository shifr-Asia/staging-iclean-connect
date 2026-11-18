<template>
  <StoreLayout hide-search>
    <!-- ════════ MOBILE "Saya" (Shopee) ════════ -->
    <div class="md:hidden">
      <div class="bg-gradient-to-b from-[#003C80] to-[#0a6fb3] px-4 pb-5 pt-1 text-white">
        <div class="flex items-center gap-3">
          <span class="grid h-14 w-14 shrink-0 place-items-center rounded-full border-2 border-white/70 bg-white/15"><Building2 class="h-7 w-7" /></span>
          <div v-if="isGuest" class="flex flex-1 justify-end gap-2">
            <RouterLink :to="{ path: '/marketplace/masuk', query: { redirect: '/marketplace/akun' } }" class="rounded-sm bg-white px-4 py-1.5 text-[13px] font-semibold text-[#003C80]">Masuk</RouterLink>
            <RouterLink to="/marketplace/daftar" class="rounded-sm border border-white px-4 py-1.5 text-[13px] font-semibold">Daftar</RouterLink>
          </div>
          <div v-else class="min-w-0 flex-1">
            <p class="truncate text-[16px] font-semibold">{{ persona.label }}</p>
            <p class="mt-0.5 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 text-[10px]">
              <BadgeCheck v-if="persona.status === 'verified'" class="h-3 w-3" /><Clock v-else class="h-3 w-3" />
              {{ persona.status === 'verified' ? 'Terverifikasi · ' + persona.ukiramaCode : 'Menunggu verifikasi Sales' }}
            </p>
          </div>
        </div>
      </div>

      <template v-if="!isGuest">
        <!-- my orders -->
        <div class="bg-white">
          <RouterLink to="/marketplace/pesanan" class="flex items-center justify-between border-b border-slate-100 px-3 py-3">
            <span class="flex items-center gap-2 text-[14px] text-slate-900"><ClipboardList class="h-5 w-5 text-[#008FD4]" />Pesanan Saya</span>
            <span class="flex items-center text-[12px] text-slate-500">Lihat riwayat<ChevronRight class="h-4 w-4" /></span>
          </RouterLink>
          <div class="grid grid-cols-5 py-3">
            <RouterLink v-for="t in orderIcons" :key="t.id" :to="`/marketplace/pesanan?tab=${t.id}`" class="relative flex flex-col items-center gap-1 text-center">
              <component :is="t.icon" class="h-6 w-6 text-slate-700" :stroke-width="1.5" />
              <span class="text-[10px] leading-tight text-slate-600">{{ t.label }}</span>
              <span v-if="count(t.id)" class="absolute left-1/2 -top-1 ml-1.5 min-w-[16px] rounded-full border border-white bg-rose-500 px-1 text-center text-[9px] font-bold leading-[14px] text-white">{{ count(t.id) }}</span>
            </RouterLink>
          </div>
        </div>

        <!-- finance -->
        <div class="mt-2 grid grid-cols-3 divide-x divide-slate-100 bg-white py-3 text-center">
          <div><p class="text-[13px] font-bold text-slate-900 tabular-nums">{{ persona.top ? persona.top + ' hari' : '—' }}</p><p class="text-[10px] text-slate-500">Termin (TOP)</p></div>
          <div><p class="text-[13px] font-bold text-slate-900 tabular-nums">{{ persona.top ? shortRp(persona.creditLimit - persona.outstanding) : '—' }}</p><p class="text-[10px] text-slate-500">Sisa limit kredit</p></div>
          <div><p class="text-[13px] font-bold text-slate-900 tabular-nums">{{ unpaidCount }}</p><p class="text-[10px] text-slate-500">Invoice belum lunas</p></div>
        </div>
        <p class="bg-white px-3 pb-2 text-right text-[10px] text-emerald-700">Data kontrak, kredit & tagihan dari Ukirama</p>
        <div v-if="persona.contract" class="mt-2 bg-white px-3 py-3">
          <div class="flex items-center justify-between"><p class="text-[13px] font-semibold text-slate-900">Kontrak aktif</p><span class="rounded-full bg-emerald-50 px-2 text-[10px] font-semibold text-emerald-700">{{ persona.contract.status }}</span></div>
          <div class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[12px]">
            <span class="text-slate-500">Nomor</span><span class="text-right font-medium text-slate-800">{{ persona.contract.no }}</span>
            <span class="text-slate-500">Periode</span><span class="text-right text-slate-800">{{ persona.contract.period }}</span>
            <span class="text-slate-500">Cakupan</span><span class="text-right text-slate-800">{{ persona.contract.scope }}</span>
            <span class="text-slate-500">Komitmen</span><span class="text-right text-slate-800">{{ persona.contract.minMonthly }}</span>
          </div>
          <div class="mt-3"><div class="flex justify-between text-[11px] text-slate-500"><span>Kredit terpakai {{ shortRp(persona.outstanding) }}</span><span>Limit {{ shortRp(persona.creditLimit) }}</span></div>
          <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-slate-100"><div class="h-full bg-[#008FD4]" :style="{ width: (persona.outstanding / persona.creditLimit * 100) + '%' }" /></div></div>
        </div>

        <!-- menu -->
        <div class="mt-2 divide-y divide-slate-100 bg-white">
          <button v-for="m in menu" :key="m.label" class="flex w-full items-center gap-3 px-3 py-3 text-left" @click="m.do ? m.do() : $router.push(m.to)">
            <component :is="m.icon" class="h-5 w-5 shrink-0" :class="m.cls" />
            <span class="flex-1 text-[14px] text-slate-800">{{ m.label }}</span>
            <span v-if="m.hint" class="text-[11px] text-slate-400">{{ m.hint }}</span>
            <ChevronRight class="h-4 w-4 text-slate-300" />
          </button>
        </div>

        <!-- addresses & payments (expanded) -->
        <div id="m-addr" class="mt-2 bg-white px-3 py-3">
          <p class="text-[13px] font-semibold text-slate-900">Alamat pengiriman ({{ persona.addresses.length }})</p>
          <div v-for="a in persona.addresses" :key="a.id" class="mt-2 border-l-2 pl-3" :class="a.type === 'warehouse' ? 'border-purple-400' : 'border-[#008FD4]'">
            <p class="text-[13px] font-semibold text-slate-800">{{ a.label }} <span class="text-[10px] font-normal text-slate-500">· {{ REGIONS[a.region].name }}</span></p>
            <p class="text-[12px] text-slate-500">{{ a.recipient }} · {{ a.line }}</p>
          </div>
        </div>
        <div id="m-pay" class="mt-2 bg-white px-3 py-3">
          <p class="text-[13px] font-semibold text-slate-900">Riwayat pembayaran</p>
          <RouterLink v-for="o in invoices" :key="o.id" :to="`/marketplace/pesanan/${o.id}`" class="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0">
            <span class="min-w-0"><span class="block text-[13px] text-slate-800">{{ o.invoice.no }}</span><span class="block truncate text-[11px] text-slate-500">{{ o.payment.label }}</span></span>
            <span class="shrink-0 text-right"><span class="block text-[13px] font-semibold tabular-nums">{{ rupiah(orderTotal(o).total) }}</span><span class="block text-[10px]" :class="o.stepAt[2] ? 'text-emerald-600' : 'text-amber-700'">{{ o.stepAt[2] ? 'Lunas' : 'Belum lunas' }}</span></span>
          </RouterLink>
        </div>
      </template>
      <div v-else class="mt-2 divide-y divide-slate-100 bg-white">
        <RouterLink to="/marketplace/integrasi" class="flex items-center gap-3 px-3 py-3 text-[14px] text-slate-800"><ArrowLeftRight class="h-5 w-5 text-emerald-600" /><span class="flex-1">Integrasi Ukirama</span><ChevronRight class="h-4 w-4 text-slate-300" /></RouterLink>
        <RouterLink to="/marketplace/sales" class="flex items-center gap-3 px-3 py-3 text-[14px] text-slate-800"><LayoutDashboard class="h-5 w-5 text-slate-600" /><span class="flex-1">Konsol Sales (internal)</span><ChevronRight class="h-4 w-4 text-slate-300" /></RouterLink>
      </div>
    </div>

    <!-- ════════ DESKTOP ════════ -->
    <div class="hidden md:block">
    <div v-if="isGuest" class="rounded-2xl border border-slate-200 bg-white p-8 text-center">
      <p class="font-semibold text-slate-800">Masuk untuk melihat akun perusahaan</p>
      <RouterLink :to="{ path: '/marketplace/masuk', query: { redirect: '/marketplace/akun' } }" class="mt-3 inline-block rounded-lg bg-[#008FD4] px-5 py-2 font-semibold text-white">Masuk</RouterLink>
    </div>
    <template v-else>
      <div class="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5">
        <div class="flex items-center gap-3">
          <span class="grid h-12 w-12 place-items-center rounded-xl bg-[#003C80] text-white"><Building2 class="h-6 w-6" /></span>
          <div>
            <p class="font-heading text-lg font-extrabold text-slate-900">{{ persona.company }}</p>
            <p class="text-[12px] text-slate-500">PIC {{ persona.pic }} · {{ persona.email }}</p>
          </div>
        </div>
        <div class="text-right text-[12px]">
          <p v-if="persona.ukiramaCode">Kode pelanggan <strong>{{ persona.ukiramaCode }}</strong> <SourceChip /></p>
          <p v-else class="font-semibold text-amber-700">Menunggu verifikasi Sales</p>
          <button class="mt-1 text-slate-500 hover:text-rose-600" @click="out">Keluar</button>
        </div>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 text-[13px]">
          <div class="flex items-center justify-between"><p class="font-heading font-extrabold text-slate-900">Kontrak, termin & kredit</p><SourceChip /></div>
          <div v-if="persona.contract" class="mt-3 rounded-lg bg-slate-50 p-3">
            <p class="font-semibold text-slate-900">{{ persona.contract.no }} <span class="ml-1 rounded-full bg-emerald-100 px-2 text-[10px] font-semibold text-emerald-700">{{ persona.contract.status }}</span></p>
            <p class="text-[12px] text-slate-500">{{ persona.contract.period }} · {{ persona.contract.scope }}</p>
            <p class="text-[12px] text-slate-500">Komitmen {{ persona.contract.minMonthly }} · price list {{ persona.contract.priceList }}</p>
          </div>
          <template v-if="persona.top">
            <p class="mt-3 text-slate-500">TOP</p><p class="font-semibold text-slate-900">{{ persona.top }} hari</p>
            <p class="mt-2 text-slate-500">Limit kredit</p><p class="font-semibold text-slate-900 tabular-nums">{{ rupiah(persona.creditLimit) }}</p>
            <p class="mt-2 text-slate-500">Piutang berjalan</p><p class="font-semibold text-slate-900 tabular-nums">{{ rupiah(persona.outstanding) }}</p>
            <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full bg-[#008FD4]" :style="{ width: (persona.outstanding / persona.creditLimit * 100) + '%' }" /></div>
          </template>
          <p v-else class="mt-3 text-slate-500">Pembayaran di muka via VA/QRIS yang dibuat Ukirama. Pengajuan TOP dapat dibahas dengan Sales {{ persona.sales || '' }}.</p>
          <p class="mt-3 text-slate-500">Sales PIC</p><p class="font-semibold text-slate-900">{{ persona.sales || 'Belum ditetapkan' }}</p>
        </div>

        <div class="rounded-2xl border border-slate-200 bg-white p-5 text-[13px] lg:col-span-2">
          <p class="font-heading font-extrabold text-slate-900">Alamat pengiriman ({{ persona.addresses.length }})</p>
          <div class="mt-3 grid gap-2 sm:grid-cols-2">
            <div v-for="a in persona.addresses" :key="a.id" class="rounded-xl border border-slate-200 p-3">
              <div class="flex items-center justify-between gap-2">
                <p class="font-semibold text-slate-900">{{ a.label }}</p>
                <span class="rounded-full px-2 py-0.5 text-[10px] font-bold" :class="a.type === 'warehouse' ? 'bg-purple-100 text-purple-800' : 'bg-sky-100 text-[#016EA3]'">{{ a.type === 'warehouse' ? 'Gudang pusat' : 'Cabang' }}</span>
              </div>
              <p class="mt-1 text-slate-500">{{ a.recipient }}</p>
              <p class="text-slate-500">{{ a.line }}</p>
              <p class="mt-1 text-[11px] text-slate-400">{{ REGIONS[a.region].name }} · {{ a.hours }}</p>
            </div>
            <div class="grid place-items-center rounded-xl border border-dashed border-slate-300 p-3 text-slate-500">+ Ajukan alamat baru (diverifikasi Sales)</div>
          </div>
        </div>
      </div>

      <div class="mt-4 rounded-2xl border border-slate-200 bg-white">
        <div class="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <p class="font-heading font-extrabold text-slate-900">Riwayat pembayaran</p><SourceChip />
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[560px] text-[13px]">
            <thead><tr class="text-left text-[11px] uppercase tracking-wider text-slate-500"><th class="px-5 py-2">Invoice</th><th class="px-5 py-2">Pesanan</th><th class="px-5 py-2">Metode</th><th class="px-5 py-2">Jumlah</th><th class="px-5 py-2">Status</th></tr></thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="o in invoices" :key="o.id">
                <td class="px-5 py-2.5 font-semibold">{{ o.invoice.no }}</td>
                <td class="px-5 py-2.5"><RouterLink :to="`/marketplace/pesanan/${o.id}`" class="text-[#008FD4]">{{ o.id }}</RouterLink></td>
                <td class="px-5 py-2.5 text-slate-600">{{ o.payment.label }}</td>
                <td class="px-5 py-2.5 tabular-nums">{{ rupiah(orderTotal(o).total) }}</td>
                <td class="px-5 py-2.5"><span class="font-semibold" :class="o.stepAt[2] ? 'text-emerald-600' : 'text-amber-700'">{{ o.stepAt[2] ? 'Lunas · ' + o.stepAt[2].split(' · ')[0] : 'Jatuh tempo ' + o.invoice.due }}</span></td>
              </tr>
              <tr v-if="!invoices.length"><td colspan="5" class="px-5 py-6 text-center text-slate-500">Belum ada invoice.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
    </div>
  </StoreLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Building2, BadgeCheck, Clock, ClipboardList, ChevronRight, FileText, Wallet, PackageOpen, Truck, PackageCheck, MapPinned, CreditCard, Bell, ArrowLeftRight, LayoutDashboard, Headset, LogOut } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import SourceChip from '../components/SourceChip.vue'
import { REGIONS } from '../data'
import { rupiah } from '../pricing'
import { state, persona, isGuest, logout, orderTotal, orderTab, notify } from '../store'

const router = useRouter()
const invoices = computed(() => state.orders.filter((o) => o.customerId === persona.value.id && o.type === 'order' && o.invoice))
const mine = computed(() => state.orders.filter((o) => o.customerId === persona.value.id))
const count = (tab) => mine.value.filter((o) => orderTab(o) === tab).length
const unpaidCount = computed(() => invoices.value.filter((o) => !o.stepAt[2]).length)
const shortRp = (n) => (n >= 1e6 ? `Rp ${Math.round(n / 1e6)} jt` : rupiah(n))
const orderIcons = [
  { id: 'quote', label: 'Penawaran', icon: FileText },
  { id: 'unpaid', label: 'Belum Bayar', icon: Wallet },
  { id: 'processing', label: 'Diproses', icon: PackageOpen },
  { id: 'shipped', label: 'Dikirim', icon: Truck },
  { id: 'done', label: 'Selesai', icon: PackageCheck },
]
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
const menu = computed(() => [
  { label: 'Alamat Saya', icon: MapPinned, cls: 'text-[#008FD4]', hint: `${persona.value.addresses.length} alamat`, do: () => scrollTo('m-addr') },
  { label: 'Riwayat Pembayaran', icon: CreditCard, cls: 'text-emerald-600', do: () => scrollTo('m-pay') },
  { label: 'Notifikasi', icon: Bell, cls: 'text-amber-500', to: '/marketplace/notifikasi' },
  { label: 'Hubungi Sales', icon: Headset, cls: 'text-indigo-500', hint: persona.value.sales || '', do: () => notify(`Chat dengan ${persona.value.sales || 'Sales iClean'} dibuka`) },
  { label: 'Integrasi Ukirama', icon: ArrowLeftRight, cls: 'text-emerald-600', to: '/marketplace/integrasi' },
  { label: 'Konsol Sales (internal)', icon: LayoutDashboard, cls: 'text-slate-600', to: '/marketplace/sales' },
  { label: 'Keluar', icon: LogOut, cls: 'text-rose-500', do: out },
])
function out() { logout(); router.push('/marketplace') }
</script>
