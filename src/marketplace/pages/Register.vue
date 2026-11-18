<template>
  <StoreLayout title="Daftar Akun Perusahaan">
    <div class="mx-auto max-w-3xl px-3 pt-3 md:p-0">
      <h1 class="font-heading text-xl font-extrabold text-slate-900">Daftar akun perusahaan</h1>
      <p class="mt-1 text-[13px] text-slate-600">Setelah mendaftar, Sales iClean memverifikasi data Anda dan menautkannya ke data pelanggan di Ukirama. Setelah itu harga dan checkout aktif.</p>

      <ol class="mt-5 grid grid-cols-3 gap-2 text-[12px]">
        <li v-for="(s, i) in ['Data perusahaan', 'Verifikasi Sales', 'Siap belanja']" :key="s" class="rounded-lg border px-3 py-2" :class="i <= (done ? 1 : 0) ? 'border-[#008FD4] bg-sky-50 text-[#003C80] font-semibold' : 'border-slate-200 bg-white text-slate-500'">
          {{ i + 1 }}. {{ s }}
        </li>
      </ol>

      <div v-if="!done" class="mt-4 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div class="grid gap-4 sm:grid-cols-2">
          <Field label="Nama perusahaan" v-model="f.company" />
          <Field label="NPWP perusahaan" v-model="f.npwp" />
          <div>
            <label class="block text-[13px] font-semibold text-slate-700">Industri</label>
            <select v-model="f.industry" class="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm">
              <option>Hotel & resort</option><option>Restoran & katering</option><option>Rumah sakit & klinik</option><option>Laundry komersial</option><option>Gedung & fasilitas</option>
            </select>
          </div>
          <Field label="Nama PIC" v-model="f.pic" />
          <Field label="Email kerja" v-model="f.email" />
          <Field label="Nomor WhatsApp" v-model="f.phone" />
          <div class="sm:col-span-2"><Field label="Alamat pengiriman utama" v-model="f.address" /></div>
          <div class="sm:col-span-2">
            <label class="block text-[13px] font-semibold text-slate-700">Sudah pernah membeli dari iClean?</label>
            <div class="mt-1.5 flex flex-wrap gap-2 text-[13px]">
              <button v-for="o in ['Belum pernah', 'Sudah, lewat Sales', 'Sudah, lewat oxphere.com']" :key="o" class="rounded-lg border px-3 py-1.5" :class="f.history === o ? 'border-[#008FD4] bg-sky-50 font-semibold text-[#003C80]' : 'border-slate-200'" @click="f.history = o">{{ o }}</button>
            </div>
            <p class="mt-1 text-[11px] text-slate-500">Membantu Sales menautkan akun ke data pelanggan yang sudah ada, sehingga riwayat dan harga kontrak ikut terbawa.</p>
          </div>
          <div class="sm:col-span-2 flex items-center gap-2 rounded-lg border border-dashed border-slate-300 px-3 py-2.5 text-[13px] text-slate-600"><Upload class="h-4 w-4" /> Unggah NPWP / NIB (opsional)</div>
        </div>
        <label class="mt-4 flex items-start gap-2 text-[12px] text-slate-600"><input type="checkbox" checked class="mt-0.5 accent-[#008FD4]" /> Saya menyetujui Syarat & Ketentuan dan Kebijakan Privasi iClean.</label>
        <button class="mt-4 w-full rounded-lg bg-[#008FD4] py-3 font-semibold text-white hover:bg-[#016EA3]" @click="submit">Daftar</button>
      </div>

      <div v-else class="mt-4 rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <span class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-100 text-amber-600"><Clock class="h-7 w-7" /></span>
        <p class="mt-3 font-heading text-lg font-extrabold text-slate-900">Pendaftaran diterima</p>
        <p class="mx-auto mt-1 max-w-md text-[13px] text-slate-600">Sales iClean akan memverifikasi data {{ f.company }} (biasanya 1 hari kerja) dan menghubungi Anda melalui WhatsApp. Sementara itu Anda tetap bisa menjelajah katalog dan menyiapkan keranjang.</p>
        <div class="mt-4 flex justify-center gap-2">
          <RouterLink to="/marketplace" class="rounded-lg border border-slate-200 px-4 py-2 text-[13px] font-semibold text-slate-700">Jelajah katalog</RouterLink>
          <RouterLink to="/marketplace/sales" class="rounded-lg bg-slate-900 px-4 py-2 text-[13px] font-semibold text-white">Lihat dari sisi Sales →</RouterLink>
        </div>
      </div>
    </div>
  </StoreLayout>
</template>

<script setup>
import { reactive, ref, defineComponent, h } from 'vue'
import { Upload, Clock } from 'lucide-vue-next'
import StoreLayout from '../components/StoreLayout.vue'
import { PERSONAS } from '../data'
import { state, login } from '../store'

const n = PERSONAS.new
const f = reactive({ company: n.company, npwp: n.npwp, industry: 'Laundry komersial', pic: n.pic, email: n.email, phone: n.phone, address: n.addresses[0].line, history: 'Belum pernah' })
const done = ref(false)
function submit() {
  state.signups.new = { status: 'pending', submittedAt: 'baru saja' }
  login('new')
  done.value = true
}
const Field = defineComponent({
  props: { label: String, modelValue: String },
  emits: ['update:modelValue'],
  setup(p, { emit }) {
    return () => h('div', [
      h('label', { class: 'block text-[13px] font-semibold text-slate-700' }, p.label),
      h('input', { class: 'mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#008FD4] focus:outline-none', value: p.modelValue, onInput: (e) => emit('update:modelValue', e.target.value) }),
    ])
  },
})
</script>
