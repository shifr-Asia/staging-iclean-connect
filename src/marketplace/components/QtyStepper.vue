<template>
  <div class="inline-flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden" :class="small ? 'h-8' : 'h-10'">
    <button type="button" class="px-2.5 h-full text-slate-600 hover:bg-slate-100 disabled:opacity-40" :disabled="modelValue <= min" @click="set(modelValue - 1)" aria-label="Kurangi">
      <Minus class="w-3.5 h-3.5" />
    </button>
    <input
      :value="modelValue"
      @change="set(+$event.target.value)"
      inputmode="numeric"
      class="w-12 h-full text-center text-sm font-semibold text-slate-900 border-x border-slate-200 focus:outline-none tabular-nums"
    />
    <button type="button" class="px-2.5 h-full text-[#008FD4] hover:bg-sky-50" @click="set(modelValue + 1)" aria-label="Tambah">
      <Plus class="w-3.5 h-3.5" />
    </button>
  </div>
</template>

<script setup>
import { Minus, Plus } from 'lucide-vue-next'
const props = defineProps({ modelValue: { type: Number, required: true }, min: { type: Number, default: 1 }, small: Boolean })
const emit = defineEmits(['update:modelValue'])
const set = (v) => emit('update:modelValue', Math.max(props.min, Number.isFinite(v) ? Math.floor(v) : props.min))
</script>
