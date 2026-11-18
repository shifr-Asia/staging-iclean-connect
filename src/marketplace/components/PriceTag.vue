<template>
  <div>
    <template v-if="r.login">
      <RouterLink :to="{ path: '/marketplace/masuk', query: { redirect: $route.fullPath } }" class="inline-flex items-center gap-1 text-[13px] font-semibold text-[#008FD4] hover:underline">
        <Lock class="w-3.5 h-3.5" /> Masuk untuk lihat harga
      </RouterLink>
    </template>
    <template v-else-if="r.pending">
      <span class="inline-flex items-center gap-1 text-[12px] font-semibold text-amber-700"><Clock class="w-3.5 h-3.5" /> Harga tampil setelah akun diverifikasi</span>
    </template>
    <template v-else-if="r.quote">
      <span class="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[12px] font-bold text-amber-800"><FileText class="w-3.5 h-3.5" /> Harga via penawaran</span>
      <p v-if="showReason" class="mt-1 text-[11px] text-slate-500">{{ r.reason }}</p>
    </template>
    <template v-else-if="r.unitPrice">
      <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span :class="big ? 'text-2xl sm:text-3xl' : 'text-base'" class="font-heading font-extrabold text-[#003C80] tabular-nums">{{ rupiah(r.unitPrice) }}</span>
        <span class="text-xs text-slate-500">/ {{ uom }}</span>
        <span v-if="r.contract" class="rounded bg-[#003C80] px-1.5 py-0.5 text-[10px] font-bold text-white">Harga kontrak</span>
        <SourceChip v-if="big" />
      </div>
      <p v-if="big" class="mt-1 text-[11px] text-slate-500">{{ r.listName }}<template v-if="r.contract"> · {{ r.region.name }}</template> · tier {{ r.tier.min }}–{{ r.tier.max }} {{ uom }}</p>
    </template>
  </div>
</template>

<script setup>
import { Lock, Clock, FileText } from 'lucide-vue-next'
import SourceChip from './SourceChip.vue'
import { rupiah } from '../pricing'
defineProps({ r: Object, uom: String, big: Boolean, showReason: Boolean })
</script>
