import { PRICE_LISTS, VARIANTS, REGIONS } from './data'

export const rupiah = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID')
const round = (n) => Math.round(n / 500) * 500

/**
 * Resolve the price a customer sees, mimicking the lookup order in Ukirama:
 * 1. guest → no price; 2. quote-only product/variant → quote;
 * 3. customer contract list (if it covers the SKU and region) → else general region list (+ group discount);
 * 4. pick tier by qty; 5. qty above the highest tier → quote.
 */
export function resolvePrice(sku, persona, region, qty = 1) {
  const v = VARIANTS[sku]
  if (!v) return { none: true }
  if (v.product.pricingMode === 'quote' || v.quoteOnly) {
    return { quote: true, reason: v.product.quoteReason || 'Kemasan besar — harga lewat penawaran' }
  }
  if (!persona || persona.status === 'guest') return { login: true }
  if (persona.status === 'pending') return { pending: true }

  const contract = PRICE_LISTS.find(
    (pl) => pl.scope.customer === persona.id && pl.items?.[sku] && (!pl.regions || pl.regions.includes(region)),
  )
  const general = PRICE_LISTS.find((pl) => pl.scope.region === region)
  const groupDisc = PRICE_LISTS.find((pl) => pl.scope.group && pl.scope.group === persona.group)
  const list = contract || general
  const tiers = list.items[sku]
  const top = tiers[tiers.length - 1]
  if (qty > top.max) {
    return { quote: true, reason: `Di atas ${top.max} ${v.uom} — harga lewat penawaran`, tiers, list }
  }
  const tier = tiers.find((t) => qty >= t.min && qty <= t.max) || tiers[0]
  const disc = !contract && groupDisc ? groupDisc.discount : 0
  const unitPrice = disc ? round(tier.price * (1 - disc)) : tier.price
  return {
    unitPrice,
    tier,
    tiers: disc ? tiers.map((t) => ({ ...t, price: round(t.price * (1 - disc)) })) : tiers,
    listCode: list.code + (disc ? ` + ${groupDisc.code}` : ''),
    listName: contract ? list.name : `${list.name}${disc ? ' · ' + groupDisc.name : ''}`,
    contract: !!contract,
    region: REGIONS[region],
  }
}

/** Lowest price shown on product cards ("mulai dari"). */
export function fromPrice(product, persona, region) {
  let best = null
  for (const v of product.variants) {
    const r = resolvePrice(v.sku, persona, region, 1)
    if (r.unitPrice) {
      const low = r.tiers[r.tiers.length - 1].price
      if (!best || low < best.low) best = { low, uom: v.uom, contract: r.contract }
    } else if (!best && r.login) best = { login: true }
    else if (!best && r.pending) best = { pending: true }
  }
  if (!best) return { quote: true }
  return best
}

export const PPN = 0.11
