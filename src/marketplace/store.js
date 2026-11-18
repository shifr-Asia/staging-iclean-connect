import { reactive, watch, computed } from 'vue'
import { PERSONAS, VARIANTS, ORDER_STEPS, seedOrders, seedSyncLog } from './data'
import { resolvePrice, PPN } from './pricing'

const KEY = 'iclean-marketplace-demo-v1'

function fresh() {
  return {
    personaId: 'guest',
    guestRegion: 'JBD',
    cart: [], // { sku, qty, addressId|null, selected }
    orders: seedOrders(),
    signups: { new: { status: 'pending', submittedAt: '17 Nov 2026 · 19.40' } },
    syncLog: seedSyncLog(),
    toast: null,
    seq: 130,
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...fresh(), ...JSON.parse(raw), toast: null }
  } catch { /* ignore */ }
  return fresh()
}

export const state = reactive(load())
watch(state, (s) => {
  const { toast, ...rest } = s
  localStorage.setItem(KEY, JSON.stringify(rest))
}, { deep: true })

export function resetDemo() {
  Object.assign(state, fresh())
  notify('Data demo dikembalikan ke awal')
}

export function notify(msg, kind = 'ok') {
  state.toast = { msg, kind, id: Date.now() }
  setTimeout(() => { if (state.toast && Date.now() - state.toast.id >= 2900) state.toast = null }, 3000)
}

// ── persona ──
export const persona = computed(() => {
  const p = PERSONAS[state.personaId] || PERSONAS.guest
  if (p.id === 'new' && state.signups.new?.status === 'verified') {
    return { ...p, status: 'verified', ukiramaCode: state.signups.new.ukiramaCode, sales: state.signups.new.sales }
  }
  return p
})
export const isGuest = computed(() => persona.value.status === 'guest')
export function login(id) { state.personaId = id; normalizeCart() }
export function logout() { state.personaId = 'guest'; normalizeCart() }

export function addressById(id) {
  return persona.value.addresses?.find((a) => a.id === id) || null
}
export function defaultAddressId() { return persona.value.addresses?.[0]?.id || null }
export function regionOf(addressId) { return addressById(addressId)?.region || state.guestRegion }

function normalizeCart() {
  const ids = (persona.value.addresses || []).map((a) => a.id)
  state.cart.forEach((l) => { if (!ids.includes(l.addressId)) l.addressId = ids[0] || null })
}

// ── cart ──
export function addToCart(sku, qty = 1, addressId) {
  if (!VARIANTS[sku]) return
  const addr = addressId || defaultAddressId()
  const line = state.cart.find((l) => l.sku === sku && l.addressId === addr)
  if (line) line.qty += qty
  else state.cart.push({ sku, qty, addressId: addr, selected: true })
}
export function removeLine(line) { state.cart.splice(state.cart.indexOf(line), 1) }
export const cartCount = computed(() => state.cart.reduce((n, l) => n + l.qty, 0))

export function priceLine(line) {
  return resolvePrice(line.sku, persona.value, regionOf(line.addressId), line.qty)
}

export const cartSummary = computed(() => {
  const sel = state.cart.filter((l) => l.selected)
  const priced = []; const quote = []
  for (const l of sel) {
    const r = priceLine(l)
    if (r.unitPrice) priced.push({ line: l, r, total: r.unitPrice * l.qty })
    else quote.push({ line: l, r })
  }
  const subtotal = priced.reduce((n, x) => n + x.total, 0)
  return { priced, quote, subtotal, ppn: subtotal * PPN, total: subtotal * (1 + PPN), count: sel.length }
})

// ── checkout ──
export function placeOrder({ payment, shippingByAddress, poNumber, note }) {
  const { priced, quote } = cartSummary.value
  const created = []
  const byAddr = (arr) => arr.reduce((m, x) => ((m[x.line.addressId] ||= []).push(x), m), {})
  for (const [addrId, rows] of Object.entries(byAddr(priced))) {
    state.seq += 1
    const id = `MKT-2611-0${state.seq}`
    const so = `SO/2611/0${state.seq + 140}`
    const gw = payment !== 'top'
    created.push(id)
    state.orders.unshift({
      id, ukiramaRef: so, type: 'order', customerId: persona.value.id, addressId: addrId,
      createdAt: nowLabel(), poNumber, note,
      payment: { method: payment, label: payment === 'top' ? `Invoice TOP ${persona.value.top} hari` : payment === 'qris' ? 'QRIS (payment gateway)' : 'VA BCA (payment gateway)' },
      invoice: { no: `INV/2611/0${state.seq + 100}`, due: gw ? 'Dibayar di muka' : 'TOP 30 hari' },
      shipping: { method: shippingByAddress[addrId] || 'Armada iClean', ref: '-' },
      items: rows.map((x) => ({ sku: x.line.sku, qty: x.line.qty, unitPrice: x.r.unitPrice })),
      stepAt: [nowLabel(), gw ? nowLabel() : null, null, null, null, null],
      step: gw ? 2 : 1,
    })
    state.syncLog.unshift({ at: shortNow(), dir: 'out', entity: 'Sales Order', detail: `${id} → ${so}`, ok: true })
  }
  for (const [addrId, rows] of Object.entries(byAddr(quote))) {
    state.seq += 1
    const id = `RFQ-2611-0${state.seq}`
    created.push(id)
    state.orders.unshift({
      id, ukiramaRef: null, type: 'quote', quoteStatus: 'requested', customerId: persona.value.id, addressId: addrId,
      createdAt: nowLabel(), note, items: rows.map((x) => ({ sku: x.line.sku, qty: x.line.qty, unitPrice: null })),
    })
    state.syncLog.unshift({ at: shortNow(), dir: 'out', entity: 'Permintaan penawaran', detail: `${id} dikirim ke Sales`, ok: true })
  }
  state.cart = state.cart.filter((l) => !l.selected)
  return created
}

export function requestQuote(sku, qty, addressId, note = '') {
  state.seq += 1
  const id = `RFQ-2611-0${state.seq}`
  state.orders.unshift({
    id, ukiramaRef: null, type: 'quote', quoteStatus: 'requested', customerId: persona.value.id,
    addressId: addressId || defaultAddressId(), createdAt: nowLabel(), note, items: [{ sku, qty, unitPrice: null }],
  })
  state.syncLog.unshift({ at: shortNow(), dir: 'out', entity: 'Permintaan penawaran', detail: `${id} dikirim ke Sales`, ok: true })
  return id
}

// ── quotation lifecycle ──
export function issueQuote(order, prices, issuedBy = 'Andi Pratama') {
  order.items.forEach((it, i) => { it.unitPrice = prices[i] })
  order.quoteStatus = 'issued'
  order.issuedAt = nowLabel()
  order.validUntil = '2 Des 2026'
  order.issuedBy = issuedBy
  order.ukiramaRef = `QT/2611/0${state.seq - 100}`
  state.syncLog.unshift({ at: shortNow(), dir: 'in', entity: 'Quotation', detail: `${order.ukiramaRef} → ${order.id}`, ok: true })
}
export function acceptQuote(order, payment) {
  const so = `SO/2611/0${state.seq + 160}`
  Object.assign(order, {
    type: 'order', quoteStatus: 'accepted', ukiramaRef: so, poNumber: '',
    payment: { method: payment, label: payment === 'top' ? 'Invoice TOP 30 hari' : 'VA BCA (payment gateway)' },
    invoice: { no: `INV/2611/0${state.seq + 120}`, due: payment === 'top' ? 'TOP 30 hari' : 'Dibayar di muka' },
    shipping: { method: 'Armada iClean', ref: '-' },
    stepAt: [nowLabel(), payment === 'top' ? null : nowLabel(), null, null, null, null],
    step: payment === 'top' ? 1 : 2,
  })
  state.syncLog.unshift({ at: shortNow(), dir: 'out', entity: 'Sales Order', detail: `${order.id} → ${so} (dari quotation)`, ok: true })
}

// ── status helpers ──
export function orderTab(o) {
  if (o.type === 'quote') return o.quoteStatus === 'rejected' ? 'cancelled' : 'quote'
  if (o.cancelled) return 'cancelled'
  if (o.step >= 6) return 'done'
  if (o.step >= 5) return 'shipped'
  const gw = o.payment?.method !== 'top'
  if (gw && o.step < 3) return 'unpaid'
  return 'processing'
}
export function stepLabel(o) {
  if (o.type === 'quote') return o.quoteStatus === 'issued' ? 'Penawaran terbit' : o.quoteStatus === 'rejected' ? 'Penawaran ditolak' : 'Menunggu penawaran Sales'
  if (o.step >= 6) return 'Diterima'
  const next = ORDER_STEPS[o.step]
  if (o.payment?.method === 'top' && next.key === 'paid') return 'Diproses gudang'
  return { so: 'Menunggu invoice', invoice: 'Menunggu invoice', paid: 'Menunggu pembayaran', packing: 'Packing di gudang', shipped: 'Siap dikirim', received: 'Dalam pengiriman' }[next.key]
}

/** Advance one order by one step, as if Ukirama pushed a status update. */
export function simulateUkiramaUpdate(targetId) {
  const target = targetId && state.orders.find((o) => o.id === targetId)
  const mine = target ? [target] : state.orders.filter((o) => o.customerId === persona.value.id || persona.value.status === 'guest')
  const q = mine.find((o) => o.type === 'quote' && o.quoteStatus === 'requested')
  if (q) {
    issueQuote(q, q.items.map((it) => estimateQuotePrice(it.sku)))
    notify(`Ukirama: quotation ${q.ukiramaRef} terbit untuk ${q.id}`)
    return
  }
  const o = mine.find((x) => x.type === 'order' && x.step < 6 && !x.cancelled)
  if (!o) { notify('Tidak ada pesanan aktif untuk diperbarui', 'info'); return }
  let i = o.step
  // TOP orders: payment happens later; skip it in the logistics flow
  if (ORDER_STEPS[i].key === 'paid' && o.payment.method === 'top') { i += 1 }
  o.stepAt[i] = nowLabel()
  o.step = i + 1
  if (o.step >= 6) o.leadTime = '2 hari 4 jam'
  if (ORDER_STEPS[i].key === 'shipped' && o.shipping.ref === '-') o.shipping.ref = o.shipping.method === 'Ekspedisi' ? 'Resi JNE Trucking 4400 1301 2210' : 'Truk B 9471 KQ'
  state.syncLog.unshift({ at: shortNow(), dir: 'in', entity: 'Status pesanan', detail: `${o.ukiramaRef}: ${ORDER_STEPS[i].label}`, ok: true })
  notify(`Ukirama: ${o.id} → ${ORDER_STEPS[i].label}`)
}

export function estimateQuotePrice(sku) {
  return { 'FG-LDL-200': 4950000, 'FG-HGD-05': 238000, 'SV-DOS-01': 3750000 }[sku] || 250000
}

// ── sales console ──
export function verifySignup(ukiramaCode, sales) {
  state.signups.new = { ...state.signups.new, status: 'verified', ukiramaCode, sales, verifiedAt: nowLabel() }
  state.syncLog.unshift({ at: shortNow(), dir: 'out', entity: 'Customer', detail: `CV Laundry Bersih Jaya → ${ukiramaCode}`, ok: true })
}

function nowLabel() {
  const d = new Date()
  return `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })} ${d.getFullYear()} · ${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`
}
function shortNow() {
  const d = new Date()
  return `${d.getDate()} ${d.toLocaleString('id-ID', { month: 'short' })} · ${String(d.getHours()).padStart(2, '0')}.${String(d.getMinutes()).padStart(2, '0')}`
}

export function orderTotal(o) {
  const sub = o.items.reduce((n, it) => n + (it.unitPrice || 0) * it.qty, 0)
  return { sub, ppn: sub * PPN, total: sub * (1 + PPN) }
}
