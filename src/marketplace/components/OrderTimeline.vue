<template>
  <ol class="relative">
    <li v-for="(s, i) in ORDER_STEPS" :key="s.key" class="relative flex gap-3.5 pb-5 last:pb-0">
      <span v-if="i < ORDER_STEPS.length - 1" class="absolute left-[15px] top-8 bottom-0 w-px" :class="state(i) === 'done' ? 'bg-[#008FD4]' : 'bg-slate-200'" aria-hidden />
      <span class="relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2" :class="dot(i)">
        <Check v-if="state(i) === 'done'" class="w-4 h-4" />
        <Clock v-else-if="state(i) === 'deferred'" class="w-3.5 h-3.5" />
        <span v-else class="text-[11px] font-bold">{{ i + 1 }}</span>
      </span>
      <div class="min-w-0 flex-1 pt-1">
        <div class="flex flex-wrap items-baseline justify-between gap-x-3">
          <p class="text-[13px] font-semibold" :class="state(i) === 'todo' ? 'text-slate-400' : 'text-slate-900'">{{ s.label }}</p>
          <p class="text-[11px] tabular-nums text-slate-500">{{ order.stepAt[i] || (state(i) === 'deferred' ? 'Jatuh tempo ' + order.invoice.due : state(i) === 'current' ? 'Sedang berjalan' : '') }}</p>
        </div>
        <p class="text-[11px] text-slate-500">{{ detail(s, i) }}</p>
      </div>
    </li>
  </ol>
</template>

<script setup>
import { Check, Clock } from 'lucide-vue-next'
import { ORDER_STEPS } from '../data'
const props = defineProps({ order: Object })
function state(i) {
  const o = props.order
  if (o.stepAt[i]) return 'done'
  if (ORDER_STEPS[i].key === 'paid' && o.payment.method === 'top' && o.step > 1) return 'deferred'
  if (i === o.step) return 'current'
  return 'todo'
}
function dot(i) {
  return { done: 'border-[#008FD4] bg-[#008FD4] text-white', current: 'border-[#008FD4] bg-white text-[#008FD4]', deferred: 'border-amber-400 bg-amber-50 text-amber-600', todo: 'border-slate-200 bg-white text-slate-400' }[state(i)]
}
function detail(s, i) {
  const o = props.order
  if (s.key === 'so') return `${o.ukiramaRef} · ${s.who}`
  if (s.key === 'invoice') return `${o.invoice.no} · ${s.who}`
  if (s.key === 'paid') return o.payment.label + (state(i) === 'deferred' ? ' · dibayar sesuai termin' : '')
  if (s.key === 'shipped') return `${o.shipping.method}${o.shipping.ref && o.shipping.ref !== '-' ? ' · ' + o.shipping.ref : ''}`
  return s.who
}
</script>
