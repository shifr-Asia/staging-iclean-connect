<template>
  <div class="rounded-xl border border-slate-200 overflow-hidden">
    <div class="flex items-center justify-between bg-slate-50 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
      <span>Harga bertingkat ({{ region }})</span><SourceChip />
    </div>
    <div class="grid" :style="{ gridTemplateColumns: `repeat(${tiers.length + 1}, minmax(0,1fr))` }">
      <div v-for="t in tiers" :key="t.min" class="px-3 py-2.5 border-t border-r border-slate-100 transition-colors" :class="active(t) ? 'bg-sky-50' : ''">
        <p class="text-[11px] text-slate-500">{{ t.min }}–{{ t.max }} {{ uom }}</p>
        <p class="text-sm font-bold tabular-nums" :class="active(t) ? 'text-[#003C80]' : 'text-slate-700'">{{ rupiah(t.price) }}</p>
      </div>
      <div class="px-3 py-2.5 border-t border-slate-100" :class="qty > tiers[tiers.length - 1].max ? 'bg-amber-50' : ''">
        <p class="text-[11px] text-slate-500">&gt; {{ tiers[tiers.length - 1].max }} {{ uom }}</p>
        <p class="text-[12px] font-bold text-amber-700">Penawaran</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import SourceChip from './SourceChip.vue'
import { rupiah } from '../pricing'
const props = defineProps({ tiers: Array, qty: Number, uom: String, region: String })
const active = (t) => props.qty >= t.min && props.qty <= t.max
</script>
