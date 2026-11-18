<template>
  <StoreLayout :title="`Keranjang Saya (${state.cart.length})`">
    <h1 class="hidden md:block font-heading text-xl font-extrabold text-slate-900">Keranjang</h1>

    <div v-if="!state.cart.length" class="mcard md:mt-4 rounded-2xl border border-slate-200 bg-white p-10 text-center">
      <ShoppingCart class="mx-auto h-12 w-12 text-slate-300" />
      <p class="mt-3 font-semibold text-slate-800">Keranjang masih kosong</p>
      <RouterLink to="/marketplace" class="mt-4 inline-block rounded-lg bg-[#008FD4] px-5 py-2 font-semibold text-white">Mulai belanja</RouterLink>
    </div>

    <div v-else class="md:mt-4 grid gap-2 md:gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
      <div class="min-w-0 space-y-2 md:space-y-3">
        <div class="hidden md:flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[13px]">
          <label class="flex items-center gap-2.5 font-semibold text-slate-800">
            <input type="checkbox" class="h-4 w-4 accent-[#008FD4]" :checked="allSelected" @change="toggleAll($event.target.checked)" /> Pilih semua ({{ state.cart.length }})
          </label>
          <button class="font-semibold text-rose-600 hover:text-rose-700" @click="removeSelected">Hapus</button>
        </div>

        <!-- priced groups, by delivery address -->
        <div v-for="g in groups" :key="g.key" class="mcard rounded-2xl border border-slate-200 bg-white">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 md:px-4 py-3">
            <div class="flex items-center gap-2 min-w-0">
              <input type="checkbox" class="h-4 w-4 shrink-0 accent-[#008FD4]" :checked="g.lines.every((l) => l.selected)" @change="g.lines.forEach((l) => (l.selected = $event.target.checked))" />
              <MapPin class="h-4 w-4 shrink-0 text-[#008FD4]" />
              <span v-if="g.address" class="min-w-0 truncate text-[13px]"><strong class="text-slate-900">{{ g.address.label }}</strong> <span class="text-slate-500">· {{ REGIONS[g.address.region].name }}</span></span>
              <span v-else class="text-[13px] text-slate-600">Alamat kirim dipilih setelah masuk · harga area <strong>{{ REGIONS[state.guestRegion].name }}</strong></span>
            </div>
            <span class="text-[11px] text-slate-500 flex items-center gap-1"><Truck class="h-3.5 w-3.5" />{{ REGIONS[g.address?.region || state.guestRegion].leadTime }}</span>
          </div>
          <CartRow v-for="l in g.lines" :key="l.sku + l.addressId" :line="l" />
        </div>

        <!-- quote section -->
        <div v-if="quoteLines.length" class="mcard rounded-2xl border border-amber-200 bg-amber-50/40">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-amber-100 px-3 md:px-4 py-3">
            <p class="flex items-center gap-2 text-[13px] font-semibold text-amber-900"><FileText class="h-4 w-4" /> Perlu penawaran Sales ({{ quoteLines.length }})</p>
            <span class="text-[11px] text-amber-800">Dikirim sebagai permintaan penawaran saat checkout</span>
          </div>
          <CartRow v-for="l in quoteLines" :key="'q' + l.sku + l.addressId" :line="l" />
        </div>

        <div class="mcard rounded-2xl border border-slate-200 bg-white p-2 md:p-4">
          <p class="px-1 py-1 md:p-0 text-[13px] md:text-base font-semibold md:font-heading md:font-extrabold text-slate-900">Sering dibeli bersama</p>
          <div class="mt-2 md:mt-3 grid grid-cols-2 gap-1.5 md:gap-2.5 sm:grid-cols-4">
            <ProductCard v-for="p in recs" :key="p.slug" :product="p" />
          </div>
        </div>
      </div>

      <!-- summary -->
      <aside class="hidden lg:block sticky top-40 rounded-2xl border border-slate-200 bg-white p-5">
        <Summary />
      </aside>
    </div>

    <template v-if="state.cart.length" #bottom>
      <div class="flex h-[52px] items-center">
        <label class="flex items-center gap-2 pl-3 pr-2 text-[12px] text-slate-700"><input type="checkbox" class="h-4 w-4 accent-[#008FD4]" :checked="allSelected" @change="toggleAll($event.target.checked)" />Semua</label>
        <div class="min-w-0 flex-1 pr-2 text-right leading-tight">
          <p class="text-[12px] text-slate-700">Total <span class="font-heading text-[15px] font-extrabold text-[#003C80] tabular-nums">{{ totalLabel }}</span></p>
          <p v-if="cartSummary.quote.length && !isGuest" class="text-[10px] text-amber-700">+{{ cartSummary.quote.length }} produk via penawaran</p>
          <p v-else class="text-[10px] text-slate-500">termasuk PPN 11%</p>
        </div>
        <button class="h-full w-[34%] bg-[#008FD4] text-[14px] font-semibold text-white disabled:bg-slate-300" :disabled="!cartSummary.count || persona.status === 'pending'" @click="checkout">{{ isGuest ? 'Masuk' : 'Checkout' }} ({{ cartSummary.count }})</button>
      </div>
    </template>
  </StoreLayout>
</template>

<script setup>
import { computed, onMounted, defineComponent, h } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ShoppingCart, MapPin, Truck, FileText, Trash2, Lock } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import ProductCard from '../components/ProductCard.vue'
import ProductTile from '../components/ProductTile.vue'
import QtyStepper from '../components/QtyStepper.vue'
import SourceChip from '../components/SourceChip.vue'
import { PRODUCTS, REGIONS, VARIANTS } from '../data'
import { rupiah } from '../pricing'
import { state, persona, isGuest, addToCart, removeLine, priceLine, cartSummary, addressById, notify } from '../store'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  if (route.query.add) {
    const v = VARIANTS[route.query.add]
    if (v) {
      addToCart(route.query.add, Number(route.query.qty) || 1)
      notify(`${v.product.name} (${v.pack}) masuk keranjang`)
    }
    router.replace({ path: '/marketplace/keranjang' })
  }
})

const isQuote = (l) => !!priceLine(l).quote
const groups = computed(() => {
  const m = new Map()
  for (const l of state.cart) {
    if (isQuote(l)) continue
    const key = l.addressId || 'guest'
    if (!m.has(key)) m.set(key, { key, address: addressById(l.addressId), lines: [] })
    m.get(key).lines.push(l)
  }
  return [...m.values()]
})
const quoteLines = computed(() => state.cart.filter(isQuote))
const allSelected = computed(() => state.cart.every((l) => l.selected))
const toggleAll = (v) => state.cart.forEach((l) => { l.selected = v })
const removeSelected = () => { state.cart = state.cart.filter((l) => !l.selected) }
const recs = computed(() => PRODUCTS.filter((p) => !state.cart.some((l) => VARIANTS[l.sku].product.slug === p.slug)).slice(0, 4))

const totalLabel = computed(() => {
  if (isGuest.value) return 'Rp —'
  if (persona.value.status === 'pending') return 'Menunggu verifikasi'
  return rupiah(cartSummary.value.total)
})
function checkout() {
  if (isGuest.value) router.push({ path: '/marketplace/masuk', query: { redirect: '/marketplace/checkout' } })
  else router.push('/marketplace/checkout')
}

// ── row ──
const CartRow = defineComponent({
  props: { line: Object },
  setup(props) {
    return () => {
      const l = props.line
      const v = VARIANTS[l.sku]
      const r = priceLine(l)
      return h('div', { class: 'flex gap-2.5 md:gap-3 border-b border-slate-100 px-3 md:px-4 py-3 last:border-0' }, [
        h('input', { type: 'checkbox', class: 'mt-7 h-4 w-4 shrink-0 accent-[#008FD4]', checked: l.selected, onChange: (e) => { l.selected = e.target.checked } }),
        h(RouterLink, { to: `/marketplace/p/${v.product.slug}`, class: 'shrink-0' }, () => h(ProductTile, { product: v.product, class: 'h-[72px] w-[72px] md:h-20 md:w-20', rounded: 'rounded-md' })),
        h('div', { class: 'min-w-0 flex-1' }, [
          h('div', { class: 'flex items-start justify-between gap-2' }, [
            h('div', { class: 'min-w-0' }, [
              h('p', { class: 'text-[13px] font-semibold leading-snug text-slate-900 line-clamp-2' }, v.product.name),
              h('p', { class: 'text-[11px] text-slate-500' }, `${v.pack} · ${l.sku}`),
            ]),
            h('button', { class: 'shrink-0 text-slate-400 hover:text-rose-600', title: 'Hapus', onClick: () => removeLine(l) }, h(Trash2, { class: 'h-4 w-4' })),
          ]),
          !isGuest.value && persona.value.addresses?.length > 1
            ? h('select', {
              class: 'mt-1.5 max-w-full rounded-sm border-0 bg-slate-100 px-2 py-1 text-[11px] text-slate-600',
              value: l.addressId,
              onChange: (e) => { l.addressId = e.target.value },
            }, persona.value.addresses.map((a) => h('option', { value: a.id }, `Kirim ke ${a.label} (${REGIONS[a.region].name})`)))
            : null,
          h('div', { class: 'mt-2 flex flex-wrap items-end justify-between gap-2' }, [
            h('div', { class: 'min-w-0' }, priceBlock(r, v, l)),
            h(QtyStepper, { modelValue: l.qty, small: true, 'onUpdate:modelValue': (n) => { l.qty = n } }),
          ]),
        ]),
      ])
    }
  },
})

function priceBlock(r, v, l) {
  if (r.login) return [h('span', { class: 'inline-flex items-center gap-1 text-[12px] font-semibold text-[#008FD4]' }, [h(Lock, { class: 'h-3 w-3' }), 'Harga tampil setelah masuk'])]
  if (r.pending) return [h('span', { class: 'text-[12px] font-semibold text-amber-700' }, 'Harga tampil setelah akun diverifikasi')]
  if (r.quote) return [h('span', { class: 'text-[12px] font-bold text-amber-700' }, 'Harga via penawaran'), h('p', { class: 'text-[11px] text-slate-500' }, r.reason)]
  return [
    h('p', { class: 'font-heading text-[15px] font-extrabold text-[#003C80] tabular-nums' }, rupiah(r.unitPrice * l.qty)),
    h('p', { class: 'text-[11px] text-slate-500' }, [`${rupiah(r.unitPrice)}/${v.uom} · tier ${r.tier.min}–${r.tier.max} · ${r.listName} `, r.contract ? h('span', { class: 'rounded bg-[#003C80] px-1 text-[10px] font-bold text-white' }, 'kontrak') : null]),
  ]
}

const Summary = defineComponent({
  setup() {
    return () => {
      const s = cartSummary.value
      const rows = []
      rows.push(h('p', { class: 'font-heading text-lg font-extrabold text-slate-900' }, 'Ringkasan belanja'))
      if (isGuest.value || persona.value.status === 'pending') {
        rows.push(h('p', { class: 'mt-3 text-[13px] text-slate-600' }, isGuest.value
          ? 'Harga dihitung setelah Anda masuk, karena setiap klien bisa memiliki harga kontrak yang berbeda.'
          : 'Akun Anda sedang diverifikasi Sales. Checkout aktif setelah akun ditautkan ke data pelanggan di Ukirama.'))
      } else {
        rows.push(h('div', { class: 'mt-3 space-y-1.5 text-[13px]' }, [
          line(`Subtotal (${s.priced.length} produk)`, rupiah(s.subtotal)),
          line('PPN 11%', rupiah(s.ppn)),
          s.quote.length ? line(`Permintaan penawaran`, `${s.quote.length} produk`) : null,
          h('div', { class: 'flex justify-between border-t border-slate-200 pt-2.5 mt-2.5' }, [h('span', { class: 'font-semibold text-slate-900' }, 'Total'), h('span', { class: 'font-heading text-xl font-extrabold text-[#003C80] tabular-nums' }, s.priced.length ? rupiah(s.total) : 'Menunggu penawaran')]),
        ]))
        rows.push(h('div', { class: 'mt-2 flex items-center gap-1.5 text-[11px] text-slate-500' }, [h(SourceChip), 'Harga dihitung dari price list Ukirama']))
      }
      rows.push(h('button', {
        class: 'mt-4 w-full rounded-lg bg-[#008FD4] py-3 font-semibold text-white hover:bg-[#016EA3] disabled:bg-slate-300',
        disabled: !s.count || persona.value.status === 'pending',
        onClick: checkout,
      }, isGuest.value ? 'Masuk untuk checkout' : `Checkout (${s.count})`))
      return h('div', rows)
    }
  },
})
function line(a, b) { return h('div', { class: 'flex justify-between' }, [h('span', { class: 'text-slate-500' }, a), h('span', { class: 'font-semibold text-slate-800 tabular-nums' }, b)]) }
</script>
