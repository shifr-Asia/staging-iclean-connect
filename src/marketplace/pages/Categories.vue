<template>
  <StoreLayout>
    <div class="flex min-h-[calc(100vh-150px)] md:min-h-0 md:gap-4">
      <!-- left rail -->
      <aside class="w-[88px] shrink-0 bg-[#F5F6F8] md:w-56 md:rounded-2xl md:border md:border-slate-200 md:bg-white md:p-2">
        <button v-for="c in CATEGORIES" :key="c.id" class="relative flex w-full flex-col items-center gap-1 px-1.5 py-3 text-center text-[11px] md:flex-row md:gap-2.5 md:rounded-lg md:px-3 md:py-2.5 md:text-left md:text-[13px]" :class="active === c.id ? 'bg-white font-semibold text-[#008FD4] md:bg-sky-50' : 'text-slate-600'" @click="active = c.id">
          <span v-if="active === c.id" class="absolute left-0 top-3 bottom-3 w-[3px] rounded-r bg-[#008FD4] md:hidden" />
          <component :is="ICONS[c.id]" class="h-5 w-5 shrink-0" />{{ c.name }}
        </button>
      </aside>
      <!-- products -->
      <section class="min-w-0 flex-1 bg-white p-2.5 md:rounded-2xl md:border md:border-slate-200 md:p-4">
        <div class="flex items-center justify-between">
          <p class="text-[13px] font-semibold text-slate-900 md:text-base">{{ cat.name }}</p>
          <RouterLink :to="{ path: '/marketplace', query: { kategori: active } }" class="text-[11px] text-[#008FD4]">Lihat semua</RouterLink>
        </div>
        <div class="mt-2.5 grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2.5">
          <ProductCard v-for="p in items" :key="p.slug" :product="p" />
        </div>
      </section>
    </div>
  </StoreLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChefHat, Shirt, SprayCan, ShieldPlus, Wrench } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import ProductCard from '../components/ProductCard.vue'
import { PRODUCTS, CATEGORIES } from '../data'

const ICONS = { dapur: ChefHat, laundry: Shirt, housekeeping: SprayCan, sanitasi: ShieldPlus, solusi: Wrench }
const active = ref(CATEGORIES[0].id)
const cat = computed(() => CATEGORIES.find((c) => c.id === active.value))
const items = computed(() => PRODUCTS.filter((p) => p.category === active.value))
</script>
