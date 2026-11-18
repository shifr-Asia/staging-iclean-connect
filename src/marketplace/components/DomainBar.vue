<template>
  <div class="sticky top-0 z-50 flex items-center gap-2 border-b border-slate-300 bg-slate-200/95 px-2 sm:px-3 py-1.5 backdrop-blur">
    <RouterLink to="/" class="hidden sm:flex items-center gap-1.5 shrink-0" title="Kembali ke halaman utama mockup">
      <span class="w-2.5 h-2.5 rounded-full bg-rose-400" /><span class="w-2.5 h-2.5 rounded-full bg-amber-400" /><span class="w-2.5 h-2.5 rounded-full bg-emerald-400" />
    </RouterLink>
    <div class="flex min-w-0 flex-1 items-center gap-1.5 rounded-md bg-white px-2.5 py-1 text-[12px] text-slate-600 sm:mx-3">
      <Lock class="w-3 h-3 shrink-0 text-emerald-600" />
      <span class="truncate"><span class="font-semibold text-slate-900">{{ domain }}</span>{{ path }}</span>
    </div>
    <span class="hidden md:inline shrink-0 rounded bg-white/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Simulasi domain · Mockup</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Lock } from 'lucide-vue-next'
const props = defineProps({ domain: String, strip: { type: String, default: '/marketplace' } })
const route = useRoute()
const path = computed(() => route.fullPath.replace(props.strip, '') || '/')
</script>
