<template>
  <span
    class="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 whitespace-nowrap align-middle"
    :title="title || 'Data ini dibaca dari Ukirama ERP (sumber kebenaran)'"
  >
    <Database class="w-3 h-3" />{{ label }}
  </span>
</template>

<script setup>
import { Database } from 'lucide-vue-next'
defineProps({ label: { type: String, default: 'Ukirama' }, title: String })
</script>
