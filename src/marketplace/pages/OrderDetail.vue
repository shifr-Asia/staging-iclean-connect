<template>
  <StoreLayout>
    <RouterLink to="/marketplace/pesanan" class="inline-flex items-center gap-1 text-[13px] text-slate-500 hover:text-[#008FD4]"><ChevronLeft class="h-4 w-4" /> Pesanan saya</RouterLink>

    <div v-if="!o" class="mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">Pesanan tidak ditemukan.</div>

    <div v-else class="mt-3 grid gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
      <div class="min-w-0 space-y-4">
        <!-- header -->
        <div class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-[12px] text-slate-500">{{ o.type === 'quote' ? 'Permintaan penawaran' : 'Pesanan' }} · dibuat {{ o.createdAt }}</p>
              <h1 class="font-heading text-xl font-extrabold text-slate-900">{{ o.id }}</h1>
              <p v-if="o.ukiramaRef" class="mt-0.5 text-[12px] text-slate-500">Nomor dokumen Ukirama: <strong class="text-slate-700">{{ o.ukiramaRef }}</strong> <SourceChip /></p>
            </div>
            <div v-if="o.type === 'order'" class="rounded-xl px-4 py-2.5 text-right" :class="o.leadTime ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-700'">
              <p class="text-[10px] uppercase tracking-wider opacity-70 flex items-center justify-end gap-1"><Clock class="h-3 w-3" />Lead time</p>
              <p class="font-heading text-lg font-extrabold tabular-nums">{{ o.leadTime || 'berjalan' }}</p>
              <p v-if="!o.leadTime" class="text-[10px] opacity-70">estimasi {{ region.leadTime }}</p>
            </div>
          </div>
        </div>

        <!-- quote panel -->
        <div v-if="o.type === 'quote'" class="rounded-2xl border p-4 sm:p-5" :class="o.quoteStatus === 'issued' ? 'border-[#008FD4] bg-sky-50/50' : 'border-amber-200 bg-amber-50/60'">
          <template v-if="o.quoteStatus === 'requested'">
            <p class="flex items-center gap-2 font-semibold text-amber-900"><Clock class="h-4 w-4" /> Menunggu quotation dari Sales</p>
            <p class="mt-1 text-[13px] text-amber-900/80">Sales {{ persona.sales || 'iClean' }} menyiapkan harga sesuai kuantitas, area kirim, dan kebutuhan Anda. Notifikasi dikirim via WhatsApp & email saat quotation terbit.</p>
          </template>
          <template v-else-if="o.quoteStatus === 'issued'">
            <p class="flex items-center gap-2 font-semibold text-[#003C80]"><FileText class="h-4 w-4" /> Quotation {{ o.ukiramaRef }} terbit</p>
            <p class="mt-1 text-[13px] text-slate-600">Dari {{ o.issuedBy }} · {{ o.issuedAt }} · berlaku sampai <strong>{{ o.validUntil }}</strong></p>
            <div class="mt-3 flex flex-wrap gap-2">
              <select v-model="pay" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-[13px]">
                <option v-if="persona.payments?.includes('top')" value="top">Bayar dengan Invoice TOP {{ persona.top }} hari</option>
                <option value="va">Bayar via Virtual Account</option>
              </select>
              <button class="rounded-lg bg-[#008FD4] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#016EA3]" @click="accept">Setujui & jadikan pesanan</button>
              <button class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700" @click="negotiate">Nego via chat Sales</button>
              <button class="rounded-lg px-3 py-2 text-[13px] font-semibold text-rose-600" @click="reject">Tolak</button>
            </div>
          </template>
          <template v-else>
            <p class="font-semibold text-slate-700">{{ o.quoteStatus === 'rejected' ? 'Penawaran ditolak' : 'Penawaran disetujui' }}</p>
          </template>
        </div>

        <!-- timeline -->
        <div v-if="o.type === 'order'" class="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <div class="mb-4 flex items-center justify-between">
            <p class="font-heading font-extrabold text-slate-900">Status pesanan</p>
            <SourceChip label="Diperbarui dari Ukirama" />
          </div>
          <OrderTimeline :order="o" />
        </div>

        <!-- items -->
        <div class="rounded-2xl border border-slate-200 bg-white">
          <p class="border-b border-slate-100 px-4 py-3 font-heading font-extrabold text-slate-900">Produk</p>
          <div v-for="it in o.items" :key="it.sku" class="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-[13px] last:border-0">
            <ProductTile :product="VARIANTS[it.sku].product" class="h-14 w-14 shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="truncate font-semibold text-slate-800">{{ VARIANTS[it.sku].product.name }}</p>
              <p class="text-[11px] text-slate-500">{{ VARIANTS[it.sku].pack }} · {{ it.sku }} · {{ it.qty }} × {{ it.unitPrice ? rupiah(it.unitPrice) : 'menunggu harga' }}</p>
            </div>
            <p class="shrink-0 font-semibold tabular-nums">{{ it.unitPrice ? rupiah(it.unitPrice * it.qty) : '—' }}</p>
          </div>
          <div v-if="o.note" class="border-t border-slate-100 px-4 py-3 text-[12px] text-slate-500">Catatan: {{ o.note }}</div>
        </div>
      </div>

      <aside class="space-y-4 lg:sticky lg:top-40">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 text-[13px]">
          <p class="font-heading font-extrabold text-slate-900">Pengiriman</p>
          <p class="mt-2 font-semibold text-slate-800">{{ addr?.label }} <span class="font-normal text-slate-500">· {{ region.name }}</span></p>
          <p class="text-slate-500">{{ addr?.recipient }}</p>
          <p class="text-slate-500">{{ addr?.line }}</p>
          <p v-if="o.shipping" class="mt-2 flex items-center gap-1.5 text-slate-600"><Truck class="h-4 w-4" />{{ o.shipping.method }}<span v-if="o.shipping.ref !== '-'"> · {{ o.shipping.ref }}</span></p>
        </div>

        <div v-if="o.type === 'order' || o.quoteStatus === 'issued'" class="rounded-2xl border border-slate-200 bg-white p-4 text-[13px]">
          <p class="font-heading font-extrabold text-slate-900">Tagihan</p>
          <div class="mt-2 space-y-1.5">
            <div class="flex justify-between"><span class="text-slate-500">Subtotal</span><span class="tabular-nums">{{ rupiah(t.sub) }}</span></div>
            <div class="flex justify-between"><span class="text-slate-500">PPN 11%</span><span class="tabular-nums">{{ rupiah(t.ppn) }}</span></div>
            <div class="flex justify-between border-t border-slate-200 pt-2"><span class="font-semibold">Total</span><span class="font-heading font-extrabold text-[#003C80] tabular-nums">{{ rupiah(t.total) }}</span></div>
          </div>
          <template v-if="o.invoice">
            <div class="mt-3 rounded-lg bg-slate-50 p-3">
              <div class="flex justify-between"><span class="text-slate-500">Invoice</span><span class="font-semibold">{{ o.invoice.no }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Metode</span><span class="text-right">{{ o.payment.label }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Jatuh tempo</span><span>{{ o.invoice.due }}</span></div>
              <div class="flex justify-between"><span class="text-slate-500">Status bayar</span><span class="font-semibold" :class="paid ? 'text-emerald-600' : 'text-amber-700'">{{ paid ? 'Lunas' : 'Belum lunas' }}</span></div>
            </div>
            <div class="mt-3 flex gap-2">
              <span class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[12px] font-semibold text-slate-700"><Download class="h-3.5 w-3.5" /> Invoice PDF</span>
              <span class="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-[12px] font-semibold text-slate-700"><Download class="h-3.5 w-3.5" /> Faktur pajak</span>
            </div>
            <button v-if="o.type === 'order' && orderTab(o) === 'unpaid'" class="mt-2 w-full rounded-lg bg-[#008FD4] py-2.5 font-semibold text-white" @click="simulateUkiramaUpdate(o.id)">Bayar sekarang (simulasi)</button>
          </template>
        </div>

        <button v-if="o.type === 'order' && o.step >= 6" class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#008FD4] bg-white py-2.5 font-semibold text-[#008FD4]" @click="reorder"><Repeat class="h-4 w-4" /> Pesan lagi</button>
      </aside>
    </div>
  </StoreLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Clock, FileText, Truck, Download, Repeat } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import ProductTile from '../components/ProductTile.vue'
import SourceChip from '../components/SourceChip.vue'
import OrderTimeline from '../components/OrderTimeline.vue'
import { VARIANTS, REGIONS, PERSONAS } from '../data'
import { rupiah } from '../pricing'
import { state, persona, orderTotal, orderTab, acceptQuote, addToCart, simulateUkiramaUpdate, notify } from '../store'

const route = useRoute()
const router = useRouter()
const o = computed(() => state.orders.find((x) => x.id === route.params.id))
const owner = computed(() => PERSONAS[o.value?.customerId])
const addr = computed(() => owner.value?.addresses.find((a) => a.id === o.value.addressId))
const region = computed(() => REGIONS[addr.value?.region || 'JBD'])
const t = computed(() => orderTotal(o.value))
const paid = computed(() => !!o.value?.stepAt?.[2])
const pay = ref(persona.value.payments?.includes('top') ? 'top' : 'va')

function accept() { acceptQuote(o.value, pay.value); notify(`Quotation disetujui · ${o.value.ukiramaRef} dibuat di Ukirama`) }
function reject() { o.value.quoteStatus = 'rejected'; notify('Penawaran ditolak') }
function negotiate() { notify(`Percakapan dengan ${o.value.issuedBy} dibuka di inbox iClean Connect`) }
function reorder() {
  o.value.items.forEach((it) => addToCart(it.sku, it.qty, o.value.addressId))
  router.push('/marketplace/keranjang')
}
</script>
