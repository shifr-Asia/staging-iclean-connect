<template>
  <StoreLayout>
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
          <div class="flex items-center justify-between"><p class="font-heading font-extrabold text-slate-900">Termin & kredit</p><SourceChip /></div>
          <template v-if="persona.top">
            <p class="mt-3 text-slate-500">TOP</p><p class="font-semibold text-slate-900">{{ persona.top }} hari</p>
            <p class="mt-2 text-slate-500">Limit kredit</p><p class="font-semibold text-slate-900 tabular-nums">{{ rupiah(persona.creditLimit) }}</p>
            <p class="mt-2 text-slate-500">Piutang berjalan</p><p class="font-semibold text-slate-900 tabular-nums">{{ rupiah(persona.outstanding) }}</p>
            <div class="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div class="h-full bg-[#008FD4]" :style="{ width: (persona.outstanding / persona.creditLimit * 100) + '%' }" /></div>
          </template>
          <p v-else class="mt-3 text-slate-500">Pembayaran di muka via payment gateway. Pengajuan TOP dapat dibahas dengan Sales {{ persona.sales || '' }}.</p>
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
  </StoreLayout>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Building2 } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import SourceChip from '../components/SourceChip.vue'
import { REGIONS } from '../data'
import { rupiah } from '../pricing'
import { state, persona, isGuest, logout, orderTotal } from '../store'

const router = useRouter()
const invoices = computed(() => state.orders.filter((o) => o.customerId === persona.value.id && o.type === 'order' && o.invoice))
function out() { logout(); router.push('/marketplace') }
</script>
