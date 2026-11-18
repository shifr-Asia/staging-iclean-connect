<template>
  <div class="relative grid place-items-center bg-gradient-to-br overflow-hidden" :class="[product.tint, rounded]">
    <div class="absolute inset-x-0 bottom-0 h-1/3 bg-white/30" />
    <div class="relative flex flex-col items-center gap-1.5">
      <div class="rounded-xl bg-white/80 shadow-sm grid place-items-center" :class="big ? 'w-24 h-28' : 'w-14 h-16'">
        <component :is="icon" :class="big ? 'w-10 h-10' : 'w-6 h-6'" class="text-[#003C80]" />
      </div>
      <img src="/logo_iclean_birru.png" alt="" :class="big ? 'h-5' : 'h-3'" class="opacity-70" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChefHat, Shirt, SprayCan, ShieldPlus, Wrench } from 'lucide-vue-next'
const props = defineProps({ product: Object, big: Boolean, rounded: { type: String, default: 'rounded-xl' } })
const icon = computed(() => ({ dapur: ChefHat, laundry: Shirt, housekeeping: SprayCan, sanitasi: ShieldPlus, solusi: Wrench })[props.product.category])
</script>
