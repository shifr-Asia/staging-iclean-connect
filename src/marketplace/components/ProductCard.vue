<template>
  <RouterLink :to="`/marketplace/p/${product.slug}`" class="group flex flex-col rounded-md md:rounded-xl md:border border-slate-200 bg-white overflow-hidden shadow-sm md:shadow-none md:hover:shadow-float md:hover:-translate-y-0.5 transition-all">
    <div class="relative">
      <ProductTile :product="product" rounded="rounded-none" class="aspect-square" />
      <span v-if="price.contract" class="absolute left-2 top-2 rounded bg-[#003C80] px-1.5 py-0.5 text-[10px] font-bold text-white">Harga kontrak</span>
      <span v-else-if="price.quote" class="absolute left-2 top-2 rounded bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">Penawaran</span>
    </div>
    <div class="flex flex-1 flex-col p-2 md:p-3">
      <p class="text-[12px] md:text-[13px] leading-snug text-slate-800 line-clamp-2 min-h-[2.5em]">{{ product.name }}</p>
      <p class="mt-0.5 text-[10px] md:text-[11px] text-slate-500 truncate">{{ product.variants.map((v) => v.pack).join(' · ') }}</p>
      <div class="mt-2 min-h-[2.4em]">
        <template v-if="price.login"><span class="inline-flex items-center gap-1 text-[12px] font-semibold text-[#008FD4]"><Lock class="w-3 h-3" />Masuk untuk lihat harga</span></template>
        <template v-else-if="price.pending"><span class="text-[11px] font-semibold text-amber-700">Menunggu verifikasi akun</span></template>
        <template v-else-if="price.quote"><span class="text-[12px] font-bold text-amber-700">Harga via penawaran</span></template>
        <template v-else>
          <p class="text-[10px] text-slate-500 leading-none">mulai dari</p>
          <p class="font-heading text-[15px] font-extrabold text-[#003C80] tabular-nums">{{ rupiah(price.low) }}<span class="text-[11px] font-medium text-slate-500"> /{{ price.uom }}</span></p>
        </template>
      </div>
      <div class="mt-auto pt-1.5 md:pt-2 flex items-center gap-1 text-[10px] md:text-[11px] text-slate-500">
        <Star class="w-3 h-3 fill-amber-400 text-amber-400" />{{ product.rating }}
        <span class="text-slate-300">·</span>{{ product.sold.toLocaleString('id-ID') }}+ terjual
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { Lock, Star } from 'lucide-vue-next'
import ProductTile from './ProductTile.vue'
import { fromPrice, rupiah } from '../pricing'
import { persona, regionOf, defaultAddressId } from '../store'
const props = defineProps({ product: Object })
const price = computed(() => fromPrice(props.product, persona.value, regionOf(defaultAddressId())))
</script>
