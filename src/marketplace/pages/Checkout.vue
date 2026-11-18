<template>
  <StoreLayout title="Checkout">
    <h1 class="hidden md:block font-heading text-xl font-extrabold text-slate-900">Checkout</h1>

    <div v-if="persona.status === 'pending'" class="mcard md:mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center text-amber-900">
      <Clock class="mx-auto h-8 w-8" />
      <p class="mt-2 font-semibold">Akun sedang diverifikasi Sales</p>
      <p class="mt-1 text-[13px]">Checkout aktif setelah akun ditautkan ke data pelanggan di Ukirama.</p>
    </div>

    <div v-else-if="placed.length" class="mcard mx-auto md:mt-4 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 text-center">
      <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-600"><CircleCheck class="h-8 w-8" /></span>
      <p class="mt-3 font-heading text-xl font-extrabold text-slate-900">Pesanan dibuat</p>
      <div class="mt-4 space-y-2 text-left">
        <RouterLink v-for="id in placed" :key="id" :to="`/marketplace/pesanan/${id}`" class="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 hover:border-[#008FD4]">
          <span>
            <span class="block font-semibold text-slate-900">{{ id }}</span>
            <span class="text-[12px] text-slate-500">{{ describe(id) }}</span>
          </span>
          <ChevronRight class="h-4 w-4 text-slate-400" />
        </RouterLink>
      </div>
      <p v-if="payment !== 'top' && hasPriced" class="mt-4 rounded-lg bg-sky-50 px-3 py-2 text-[13px] text-[#016EA3]">Selesaikan pembayaran {{ payment === 'qris' ? 'QRIS' : 'VA BCA 8808 0412 3391 22' }} dalam 24 jam. Status pembayaran tercatat otomatis di Ukirama.</p>
    </div>

    <div v-else-if="!cartSummary.count" class="mcard md:mt-4 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
      Tidak ada produk yang dipilih. <RouterLink to="/marketplace/keranjang" class="font-semibold text-[#008FD4]">Kembali ke keranjang</RouterLink>
    </div>

    <div v-else class="md:mt-4 grid gap-2 md:gap-4 lg:grid-cols-[1fr_360px] lg:items-start">
      <div class="min-w-0 space-y-2 md:space-y-3">
        <!-- buyer -->
        <div class="mcard addr-stripe rounded-2xl border border-slate-200 bg-white p-3 md:p-4 text-[13px]">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <p class="flex items-center gap-1.5 font-heading font-extrabold text-slate-900"><MapPin class="h-4 w-4 text-[#008FD4] md:hidden" />{{ persona.company }}</p>
            <span class="text-slate-500">Kode pelanggan <strong class="text-slate-700">{{ persona.ukiramaCode }}</strong> <SourceChip /></span>
          </div>
          <p class="mt-1 text-slate-500">PIC {{ persona.pic }} · {{ persona.email }} · Sales {{ persona.sales }}</p>
        </div>

        <!-- shipments -->
        <div v-for="g in shipments" :key="g.addr.id" class="mcard rounded-2xl border border-slate-200 bg-white">
          <div class="border-b border-slate-100 px-3 md:px-4 py-3">
            <p class="flex items-center gap-2 text-[13px] font-semibold text-slate-900"><MapPin class="h-4 w-4 text-[#008FD4]" /> Pengiriman ke {{ g.addr.label }}</p>
            <p class="ml-6 text-[12px] text-slate-500">{{ g.addr.recipient }} · {{ g.addr.line }} · {{ g.addr.hours }}</p>
          </div>
          <div v-for="x in g.rows" :key="x.line.sku" class="flex items-center gap-3 px-3 md:px-4 py-2.5 text-[13px]">
            <ProductTile :product="VARIANTS[x.line.sku].product" class="h-12 w-12 shrink-0" />
            <div class="min-w-0 flex-1">
              <p class="truncate font-semibold text-slate-800">{{ VARIANTS[x.line.sku].product.name }}</p>
              <p class="text-[11px] text-slate-500">{{ VARIANTS[x.line.sku].pack }} · {{ x.line.qty }} × {{ x.r.unitPrice ? rupiah(x.r.unitPrice) : 'harga via penawaran' }}</p>
            </div>
            <p class="shrink-0 font-semibold tabular-nums" :class="x.r.unitPrice ? 'text-slate-900' : 'text-amber-700'">{{ x.r.unitPrice ? rupiah(x.r.unitPrice * x.line.qty) : 'Penawaran' }}</p>
          </div>
          <div v-if="g.priced" class="grid gap-2 border-t border-slate-100 px-3 md:px-4 py-3 sm:grid-cols-2">
            <button v-for="m in methods(g.addr)" :key="m.id" class="rounded-lg border px-3 py-2 text-left text-[12px]" :class="(ship[g.addr.id] || 'Armada iClean') === m.id ? 'border-[#008FD4] bg-sky-50' : 'border-slate-200'" @click="ship[g.addr.id] = m.id">
              <span class="flex items-center gap-1.5 font-semibold text-slate-800"><Truck class="h-3.5 w-3.5" />{{ m.id }}</span>
              <span class="text-slate-500">{{ m.eta }} · {{ m.fee }}</span>
            </button>
          </div>
        </div>

        <!-- PO -->
        <div class="mcard rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
          <p class="font-heading font-extrabold text-slate-900">Dokumen pembelian</p>
          <div class="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <label class="block text-[12px] font-semibold text-slate-600">Nomor PO internal (opsional)</label>
              <input v-model="po" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="PO-GSH-11-060" />
            </div>
            <div class="flex items-end"><span class="flex w-full items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2 text-[13px] text-slate-600"><Upload class="h-4 w-4" /> Lampirkan file PO (PDF)</span></div>
            <div class="sm:col-span-2">
              <label class="block text-[12px] font-semibold text-slate-600">Catatan untuk gudang & Sales</label>
              <textarea v-model="note" rows="2" class="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" placeholder="Contoh: sertakan COA, kirim sebelum 10.00, akses loading dock B" />
            </div>
          </div>
        </div>

        <!-- payment -->
        <div v-if="hasPriced" class="mcard rounded-2xl border border-slate-200 bg-white p-3 md:p-4">
          <p class="font-heading font-extrabold text-slate-900">Metode pembayaran</p>
          <div class="mt-3 grid gap-2">
            <button v-if="canTop" class="flex items-start gap-3 rounded-xl border p-3 text-left" :class="payment === 'top' ? 'border-[#008FD4] bg-sky-50' : 'border-slate-200'" @click="payment = 'top'">
              <Receipt class="mt-0.5 h-5 w-5 shrink-0 text-[#003C80]" />
              <span class="min-w-0 flex-1">
                <span class="block text-[13px] font-semibold text-slate-900">Invoice · TOP {{ persona.top }} hari</span>
                <span class="block text-[12px] text-slate-500">Invoice resmi dari Ukirama, bayar via transfer sebelum jatuh tempo.</span>
                <span class="mt-1.5 block text-[11px]" :class="overLimit ? 'text-rose-600 font-semibold' : 'text-slate-500'">Sisa limit kredit {{ rupiah(persona.creditLimit - persona.outstanding) }} dari {{ rupiah(persona.creditLimit) }} <SourceChip /></span>
              </span>
            </button>
            <button v-for="g in gateway" :key="g.id" class="flex items-start gap-3 rounded-xl border p-3 text-left" :class="payment === g.id ? 'border-[#008FD4] bg-sky-50' : 'border-slate-200'" @click="payment = g.id">
              <component :is="g.icon" class="mt-0.5 h-5 w-5 shrink-0 text-[#003C80]" />
              <span>
                <span class="block text-[13px] font-semibold text-slate-900">{{ g.label }}</span>
                <span class="block text-[12px] text-slate-500">{{ g.desc }}</span>
              </span>
            </button>
          </div>
          <p v-if="!canTop" class="mt-2 text-[11px] text-slate-500">Pembayaran Invoice/TOP tersedia untuk pelanggan yang termin kreditnya sudah disetujui di Ukirama. Hubungi Sales untuk pengajuan.</p>
        </div>
      </div>

      <aside class="mcard rounded-2xl border border-slate-200 bg-white p-3 md:p-5 lg:sticky lg:top-40">
        <p class="font-heading text-lg font-extrabold text-slate-900">Ringkasan</p>
        <div class="mt-3 space-y-1.5 text-[13px]">
          <div class="flex justify-between"><span class="text-slate-500">Subtotal produk</span><span class="font-semibold tabular-nums">{{ rupiah(cartSummary.subtotal) }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">Ongkos kirim</span><span class="font-semibold">{{ shippingLabel }}</span></div>
          <div class="flex justify-between"><span class="text-slate-500">PPN 11%</span><span class="font-semibold tabular-nums">{{ rupiah(cartSummary.ppn) }}</span></div>
          <div class="mt-2 flex justify-between border-t border-slate-200 pt-2.5"><span class="font-semibold">Total tagihan</span><span class="font-heading text-xl font-extrabold text-[#003C80] tabular-nums">{{ rupiah(cartSummary.total) }}</span></div>
        </div>
        <div v-if="cartSummary.quote.length" class="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[12px] text-amber-900">
          {{ cartSummary.quote.length }} produk dikirim sebagai <strong>permintaan penawaran</strong>. Sales akan mengirim quotation; Anda bisa menyetujuinya di halaman pesanan.
        </div>
        <ul class="mt-3 space-y-1 text-[11px] text-slate-500">
          <li>• {{ soCount }} Sales Order dibuat di Ukirama (1 per alamat kirim)</li>
          <li v-if="cartSummary.quote.length">• Permintaan penawaran diteruskan ke Sales {{ persona.sales }}</li>
        </ul>
        <button class="hidden md:block mt-4 w-full rounded-lg bg-[#008FD4] py-3 font-semibold text-white hover:bg-[#016EA3] disabled:bg-slate-300" :disabled="hasPriced && (!payment || (payment === 'top' && overLimit))" @click="submit">
          {{ hasPriced ? (payment === 'top' ? 'Buat pesanan' : 'Bayar & buat pesanan') : 'Kirim permintaan penawaran' }}
        </button>
      </aside>
    </div>
    <template v-if="!placed.length && cartSummary.count && persona.status !== 'pending'" #bottom>
      <div class="flex h-[52px] items-center">
        <div class="min-w-0 flex-1 pr-3 text-right leading-tight">
          <p class="text-[11px] text-slate-600">Total pembayaran</p>
          <p class="font-heading text-[16px] font-extrabold text-[#003C80] tabular-nums">{{ hasPriced ? rupiah(cartSummary.total) : 'Menunggu penawaran' }}</p>
        </div>
        <button class="h-full w-[38%] bg-[#008FD4] text-[14px] font-semibold text-white disabled:bg-slate-300" :disabled="hasPriced && (!payment || (payment === 'top' && overLimit))" @click="submit">{{ hasPriced ? 'Buat Pesanan' : 'Kirim Permintaan' }}</button>
      </div>
    </template>
  </StoreLayout>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { MapPin, Truck, Upload, Receipt, Landmark, QrCode, Clock, CircleCheck, ChevronRight } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import ProductTile from '../components/ProductTile.vue'
import SourceChip from '../components/SourceChip.vue'
import { VARIANTS, REGIONS } from '../data'
import { rupiah } from '../pricing'
import { state, persona, cartSummary, addressById, placeOrder } from '../store'

const canTop = computed(() => persona.value.payments?.includes('top'))
const payment = ref(canTop.value ? 'top' : 'va')
const po = ref('')
const note = ref('')
const placed = ref([])
const gateway = [
  { id: 'va', icon: Landmark, label: 'Virtual Account (BCA, Mandiri, BRI, BNI)', desc: 'Lunas otomatis terkonfirmasi, tanpa unggah bukti transfer.' },
  { id: 'qris', icon: QrCode, label: 'QRIS', desc: 'Bayar dari aplikasi bank atau e-wallet perusahaan.' },
]

const all = computed(() => [...cartSummary.value.priced, ...cartSummary.value.quote])
const shipments = computed(() => {
  const m = new Map()
  for (const x of all.value) {
    const a = addressById(x.line.addressId)
    if (!m.has(a.id)) m.set(a.id, { addr: a, rows: [], priced: false })
    const g = m.get(a.id); g.rows.push(x); if (x.r.unitPrice) g.priced = true
  }
  return [...m.values()]
})
const hasPriced = computed(() => cartSummary.value.priced.length > 0)
const soCount = computed(() => shipments.value.filter((g) => g.priced).length)
const ship = reactive({})
const methods = (a) => [
  { id: 'Armada iClean', eta: REGIONS[a.region].leadTime, fee: a.region === 'BALI' ? 'Rp 350.000' : 'Gratis (min. Rp 2 jt)' },
  { id: 'Ekspedisi', eta: REGIONS[a.region].leadTime, fee: 'Sesuai tarif ekspedisi' },
]
const shippingLabel = computed(() => 'Dikonfirmasi di invoice')
const overLimit = computed(() => cartSummary.value.total > persona.value.creditLimit - persona.value.outstanding)

function submit() {
  const shippingByAddress = Object.fromEntries(shipments.value.map((g) => [g.addr.id, ship[g.addr.id] || 'Armada iClean']))
  placed.value = placeOrder({ payment: payment.value, shippingByAddress, poNumber: po.value, note: note.value })
}
function describe(id) {
  const o = state.orders.find((x) => x.id === id)
  if (!o) return ''
  return o.type === 'quote' ? 'Permintaan penawaran · menunggu quotation Sales' : `${o.ukiramaRef} di Ukirama · ${addressById(o.addressId)?.label}`
}
</script>

<style scoped>
@media (max-width: 767px) {
  .addr-stripe { position: relative; padding-bottom: 16px; }
  .addr-stripe::after { content: ''; position: absolute; left: 0; right: 0; bottom: 0; height: 3px;
    background: repeating-linear-gradient(45deg, #008FD4 0 18px, transparent 18px 24px, #F59E0B 24px 42px, transparent 42px 48px); }
}
</style>
