<template>
  <div class="h-full flex flex-col overflow-y-auto bg-slate-50 text-slate-800">
    
    <!-- STICKY TOP SUB-HEADER: IDENTITAS KLIEN & KONTROL DUAL-VIEW -->
    <div class="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
      <!-- Client Identity & Status -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#003C80] to-[#008FD4] text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
          <Building2 class="w-5 h-5" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h2 class="font-heading font-extrabold text-sm sm:text-base text-[#003C80] leading-tight">
              Portal B2B Klien Eksisting
            </h2>
            <span class="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 hidden xs:inline-block">
              Terverifikasi · TOP 30 Hari
            </span>
          </div>
          <p class="text-xs text-slate-500">
            Akun: <strong>Hotel Grand Serpong</strong> (PIC: Budi Santoso · Sales Rep: Andi Pratama)
          </p>
        </div>
      </div>

      <!-- Controls: Dual-View Switcher + Subtabs -->
      <div class="flex flex-wrap items-center gap-2">
        <!-- Dual View Perspective Switcher -->
        <div class="bg-slate-100 p-1 rounded-xl flex items-center text-xs">
          <button 
            @click="b2bViewMode = 'client'"
            :class="[
              'px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all',
              b2bViewMode === 'client' ? 'bg-white text-[#003C80] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <Building2 class="w-3.5 h-3.5 text-[#008FD4]" />
            <span>Mode Klien (Hotel Grand)</span>
          </button>

          <button 
            @click="b2bViewMode = 'sales'"
            :class="[
              'px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all',
              b2bViewMode === 'sales' ? 'bg-[#003C80] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
            <span>Mode Sales & Gudang</span>
            <span v-if="pendingSalesOrdersCount > 0" class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          </button>
        </div>

        <!-- Subtabs Navigator -->
        <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button 
            @click="b2bSubTab = 'catalog'"
            :class="[
              'px-3 py-1.5 rounded-lg transition-all',
              b2bSubTab === 'catalog' ? 'bg-white text-[#003C80] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            Katalog & Order (RFQ)
          </button>

          <button 
            @click="b2bSubTab = 'orders'"
            :class="[
              'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5',
              b2bSubTab === 'orders' ? 'bg-white text-[#003C80] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            Tracking & Lead Time
            <span class="bg-[#008FD4] text-white text-[9px] font-bold px-1.5 rounded-full">
              {{ b2bOrders.length }}
            </span>
          </button>

          <button 
            @click="b2bSubTab = 'forecast'"
            :class="[
              'px-3 py-1.5 rounded-lg transition-all flex items-center gap-1',
              b2bSubTab === 'forecast' ? 'bg-white text-[#003C80] shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <Sparkles class="w-3.5 h-3.5 text-amber-500" />
            Prediksi Kebutuhan
          </button>
        </div>
      </div>
    </div>

    <!-- SALES MODE BANNER (WHEN ACTIVE) -->
    <div v-if="b2bViewMode === 'sales'" class="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
        <span>
          <strong>Simulasi Mode Internal iClean (Sales & DC Gudang):</strong> Anda sedang melihat perspektif Andi Pratama (Sales Rep) & Tim DC Cikupa. Anda dapat meng-approve kuotasi harga, menerbitkan invoice resmi (#INV), dan memajukan tahapan packing serta pengiriman armada untuk mensimulasikan pembaruan lead time secara real-time.
        </span>
      </div>
      <button @click="b2bViewMode = 'client'" class="text-amber-800 font-bold underline shrink-0 hover:text-amber-950 self-end sm:self-auto">
        Kembali ke Mode Klien
      </button>
    </div>

    <!-- MAIN BODY CONTAINER -->
    <div class="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">

      <!-- ======================================================== -->
      <!-- SUBTAB 1: KATALOG & FORUM PEMESANAN B2B (RFQ) -->
      <!-- ======================================================== -->
      <div v-if="b2bSubTab === 'catalog'" class="space-y-6">
        
        <!-- Notice Box: Alur Harga B2B (Tanpa Harga Statis / Butuh Invoice Sales) -->
        <div class="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 border border-sky-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start gap-4 shadow-xs">
          <div class="w-10 h-10 rounded-xl bg-[#008FD4] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Info class="w-5 h-5" />
          </div>
          <div class="space-y-1.5 text-xs">
            <h4 class="font-bold text-sm text-[#003C80]">
              Alur Pemesanan Khusus Klien B2B (Pemberian Akun Pasca Order Perdana)
            </h4>
            <p class="text-slate-600 leading-relaxed">
              Sebagai klien korporasi terverifikasi, harga final tidak kaku di awal melainkan mengikuti <strong>volume tier kontrak, kuota diskon cabang, dan tonase pengiriman</strong>. Saat Anda mengklik <strong>"Kirim Permintaan Order"</strong>, notifikasi instan akan muncul di sisi Sales/Account Manager (Andi Pratama) untuk menerbitkan <strong>Invoice Resmi (Term of Payment: TOP 30 Hari)</strong>, lalu proses packing & pengiriman logistik akan terupdate otomatis dengan estimasi lead time terukur.
            </p>
            <div class="pt-1 flex flex-wrap items-center gap-2 font-semibold text-[11px] text-[#003C80]">
              <span class="bg-white px-2.5 py-0.5 rounded-md border border-sky-200">✓ Akun Diberikan Sales</span>
              <span class="bg-white px-2.5 py-0.5 rounded-md border border-sky-200">✓ Multi-Destinasi Gudang/Cabang</span>
              <span class="bg-white px-2.5 py-0.5 rounded-md border border-sky-200">✓ Live Lead Time Tracking</span>
              <span class="bg-white px-2.5 py-0.5 rounded-md border border-sky-200">✓ Prediksi Replenishment AI</span>
            </div>
          </div>
        </div>

        <!-- SECTION 1: PILIH ALAMAT & TUJUAN PENGIRIMAN (Warehouse Terpusat vs Cabang Langsung) -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <MapPin class="w-4 h-4 text-[#008FD4]" />
                1. Tentukan Alamat & Tujuan Pengiriman
              </h3>
              <p class="text-xs text-slate-500">
                Pilih apakah dikirim ke Warehouse Terpusat (untuk konsolidasi) atau langsung ke Cabang / Unit Dapur & Laundry hotel
              </p>
            </div>
            <span class="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg self-start sm:self-auto">
              {{ deliveryDestinations.length }} Alamat Terdaftar
            </span>
          </div>

          <!-- Destination Selector Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div 
              v-for="dest in deliveryDestinations" 
              :key="dest.id"
              @click="selectedDestinationId = dest.id"
              :class="[
                'p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-xs',
                selectedDestinationId === dest.id 
                  ? 'border-[#008FD4] bg-sky-50/50 ring-2 ring-sky-200 shadow-xs' 
                  : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
              ]"
            >
              <div class="space-y-2">
                <div class="flex items-center justify-between gap-1">
                  <span 
                    :class="[
                      'text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full',
                      dest.id === 'warehouse' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-[#003C80]'
                    ]"
                  >
                    {{ dest.badge }}
                  </span>
                  <div class="w-4 h-4 rounded-full border flex items-center justify-center" :class="selectedDestinationId === dest.id ? 'border-[#008FD4] bg-[#008FD4]' : 'border-slate-300'">
                    <span v-if="selectedDestinationId === dest.id" class="w-1.5 h-1.5 rounded-full bg-white"></span>
                  </div>
                </div>
                <div>
                  <h4 class="font-bold text-slate-900 text-xs leading-snug">{{ dest.name }}</h4>
                  <p class="text-[11px] text-slate-500 line-clamp-2 mt-1">{{ dest.address }}</p>
                </div>
              </div>

              <div class="mt-3 pt-2 border-t border-slate-200/60 text-[10px] text-slate-600 space-y-0.5">
                <p><strong>PIC:</strong> {{ dest.pic }}</p>
                <p class="text-slate-400">Jam: {{ dest.hours }}</p>
              </div>
            </div>
          </div>

          <!-- Selected Destination Detail Highlight -->
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-800">Tujuan Terpilih:</span>
                <span class="font-extrabold text-[#003C80]">{{ currentDestination.name }}</span>
              </div>
              <p class="text-slate-600 text-[11px]">
                📍 {{ currentDestination.address }} | 👤 PIC: {{ currentDestination.pic }} ({{ currentDestination.phone }})
              </p>
              <p class="text-slate-500 text-[10px]">
                🚚 <strong>Logistik & Bongkar Muat:</strong> {{ currentDestination.dock }} · {{ currentDestination.notes }}
              </p>
            </div>
            <div class="shrink-0">
              <span class="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1">
                <CheckCircle2 class="w-3.5 h-3.5" /> Rute Pengiriman Siap
              </span>
            </div>
          </div>
        </div>

        <!-- SECTION 2: KATALOG PRODUK CHEMICAL B2B -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Package class="w-4 h-4 text-[#008FD4]" />
                2. Katalog Produk & Kuantitas Order
              </h3>
              <p class="text-xs text-slate-500">
                Pilih kebutuhan chemical pembersih. Harga final akan diterbitkan dalam Invoice Resmi oleh Account Manager.
              </p>
            </div>
            <div class="flex items-center gap-2 self-start sm:self-auto">
              <span class="text-xs font-bold text-[#008FD4] bg-sky-50 px-3 py-1 rounded-lg border border-sky-200">
                {{ selectedItemsTotalQty }} Unit Dipilih
              </span>
            </div>
          </div>

          <!-- Product Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div 
              v-for="product in b2bCatalog" 
              :key="product.id"
              :class="[
                'p-4 rounded-2xl border transition-all flex flex-col justify-between text-xs',
                product.qty > 0 
                  ? 'border-[#008FD4] bg-sky-50/30 ring-1 ring-[#008FD4] shadow-xs' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              ]"
            >
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2.5">
                    <div class="w-10 h-10 rounded-xl bg-slate-100 p-1 border border-slate-200 shrink-0 flex items-center justify-center">
                      <img src="/logo_iclean_birru.png" alt="iClean" class="h-6 object-contain" />
                    </div>
                    <div>
                      <span class="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">{{ product.category }}</span>
                      <h4 class="font-bold text-slate-900 text-xs sm:text-sm leading-snug">{{ product.name }}</h4>
                      <span class="text-[11px] font-semibold text-[#008FD4]">{{ product.packaging }}</span>
                    </div>
                  </div>
                </div>

                <!-- AI Cadence Warning / Depletion Pill -->
                <div v-if="product.isCritical" class="bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-lg text-[10px] flex items-center gap-1.5">
                  <AlertCircle class="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span><strong>AI Alert:</strong> Stok di hotel diprediksi habis dlm {{ product.depletionDays }} hari!</span>
                </div>

                <p class="text-slate-600 text-[11px] line-clamp-2">{{ product.desc }}</p>

                <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                  <div class="flex items-center justify-between">
                    <span class="text-slate-500">Tier Kontrak:</span>
                    <span class="font-bold text-[#003C80]">{{ product.tierPrice }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="text-slate-400">Order Terakhir:</span>
                    <span class="text-slate-600">{{ product.lastOrder }}</span>
                  </div>
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="text-slate-400">Ketersediaan DC:</span>
                    <span class="text-emerald-700 font-medium">✓ Ready Stock</span>
                  </div>
                </div>
              </div>

              <!-- Quantity Stepper Controls -->
              <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span class="text-xs font-semibold text-slate-700">Kuantitas (Unit):</span>
                <div class="flex items-center gap-2">
                  <button 
                    @click="product.qty = Math.max(0, product.qty - 1)"
                    class="w-7 h-7 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm transition-all"
                  >
                    -
                  </button>
                  <input 
                    v-model.number="product.qty" 
                    type="number" 
                    min="0"
                    class="w-12 text-center py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900"
                  />
                  <button 
                    @click="product.qty += 1"
                    class="w-7 h-7 rounded-lg border border-sky-300 bg-sky-50 hover:bg-sky-100 text-[#008FD4] flex items-center justify-center font-bold text-sm transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: RINGKASAN ORDER & PENGAJUAN (SUBMIT RFQ) -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-4">
          <h3 class="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
            <FileText class="w-4 h-4 text-[#008FD4]" />
            3. Instruksi Khusus & Konfirmasi Permintaan Order
          </h3>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <!-- Left: Selected Items List -->
            <div class="lg:col-span-2 space-y-3">
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <h5 class="font-bold text-xs text-slate-800 mb-2">Ringkasan Produk Terpilih:</h5>
                <div v-if="selectedItemsTotalQty === 0" class="text-slate-400 text-xs italic py-2">
                  Belum ada produk yang dipilih. Tambahkan kuantitas pada katalog di atas.
                </div>
                <div v-else class="space-y-1.5">
                  <div 
                    v-for="item in b2bCatalog.filter(i => i.qty > 0)" 
                    :key="item.id"
                    class="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 last:border-0"
                  >
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full bg-[#008FD4]"></span>
                      <span class="font-semibold text-slate-800">{{ item.name }}</span>
                      <span class="text-slate-500 text-[11px]">({{ item.packaging }})</span>
                    </div>
                    <span class="font-bold text-[#003C80]">{{ item.qty }} Pail</span>
                  </div>
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-700 mb-1">Catatan Tambahan untuk Tim Logistik & Sales:</label>
                <textarea 
                  v-model="orderNotes" 
                  rows="2"
                  placeholder="Contoh: Wajib sertakan COA & MSDS resmi. Pengiriman mohon tiba sebelum jam 10 pagi..."
                  class="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#008FD4] focus:bg-white"
                ></textarea>
              </div>
            </div>

            <!-- Right: Action CTA Card -->
            <div class="bg-gradient-to-br from-slate-900 to-[#003C80] text-white p-5 rounded-2xl flex flex-col justify-between space-y-4">
              <div class="space-y-2">
                <span class="text-[10px] uppercase font-bold tracking-wider text-sky-300 block">Proses Permintaan Order</span>
                <h4 class="font-heading font-extrabold text-base text-white">Ajukan ke Account Manager</h4>
                <p class="text-[11px] text-slate-200 leading-relaxed">
                  Sales Rep <strong>Andi Pratama</strong> akan menerima notifikasi otomatis, menerapkan diskon kontrak, dan menerbitkan <strong>Invoice Resmi</strong> dalam tempo pembayaran 30 hari.
                </p>
              </div>

              <div class="space-y-2 pt-2 border-t border-white/20">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-300">Total Volume:</span>
                  <strong class="text-white font-bold">{{ selectedItemsTotalQty }} Unit</strong>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-slate-300">Destinasi:</span>
                  <strong class="text-sky-300 font-bold truncate max-w-[150px]">{{ currentDestination.badge }}</strong>
                </div>

                <button 
                  @click="submitB2bOrder"
                  class="w-full mt-2 py-3 bg-[#008FD4] hover:bg-[#016EA3] text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send class="w-4 h-4" />
                  Kirim Permintaan Order (Request Invoice)
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- SUBTAB 2: RIWAYAT PESANAN & LIVE LEAD TIME TRACKING -->
      <!-- ======================================================== -->
      <div v-else-if="b2bSubTab === 'orders'" class="space-y-6">
        
        <!-- Orders Carousel / Selector Tabs -->
        <div class="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="font-heading font-bold text-sm text-slate-900 flex items-center gap-2">
              <Boxes class="w-4 h-4 text-[#008FD4]" />
              Riwayat Pembelian & Pelacakan Pesanan Aktif
            </h3>
            <span class="text-xs text-slate-500">Pilih pesanan untuk melihat lead time aktual</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div 
              v-for="order in b2bOrders" 
              :key="order.id"
              @click="activeTrackingOrderId = order.id"
              :class="[
                'p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between text-xs',
                activeTrackingOrderId === order.id 
                  ? 'border-[#008FD4] bg-sky-50/50 ring-2 ring-sky-200 shadow-xs' 
                  : 'border-slate-200 bg-white hover:border-slate-300'
              ]"
            >
              <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-extrabold text-[#003C80]">{{ order.code }}</span>
                  <span 
                    :class="[
                      'text-[9px] font-bold px-2 py-0.5 rounded-full',
                      order.statusStep === 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    ]"
                  >
                    {{ order.statusStep === 5 ? 'Selesai' : 'Diproses' }}
                  </span>
                </div>
                <p class="text-[11px] font-medium text-slate-700 truncate">{{ order.destinationName }}</p>
                <p class="text-[10px] text-slate-500">{{ order.totalPail }} · {{ order.date }}</p>
              </div>

              <div class="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span class="text-slate-500">Lead Time:</span>
                <span class="font-bold text-[#008FD4] truncate max-w-[120px]">{{ order.leadTimeDisplay }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- SELECTED ORDER LIVE TRACKING & LEAD TIME PERFORMANCE -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
          
          <!-- Order Header Bar -->
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <h3 class="font-heading font-extrabold text-base sm:text-lg text-slate-900">
                  Pelacakan Detail: {{ activeTrackingOrder.code }}
                </h3>
                <span 
                  :class="[
                    'text-xs font-bold px-2.5 py-0.5 rounded-full border',
                    activeTrackingOrder.statusStep === 5 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-sky-50 text-[#008FD4] border-sky-200 animate-pulse'
                  ]"
                >
                  {{ activeTrackingOrder.pricingStatus }}
                </span>
              </div>
              <p class="text-xs text-slate-500">
                Tujuan Pengiriman: <strong>{{ activeTrackingOrder.destinationName }}</strong> ({{ activeTrackingOrder.destinationType }})
              </p>
            </div>

            <!-- Sales PIC & Financial summary -->
            <div class="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
              <div>
                <p class="text-[10px] text-slate-400">Invoice Resmi:</p>
                <p class="font-bold text-slate-800">{{ activeTrackingOrder.invoiceNo }}</p>
              </div>
              <div class="border-l pl-3 border-slate-200">
                <p class="text-[10px] text-slate-400">Total Nominal:</p>
                <p class="font-bold text-[#003C80]">{{ activeTrackingOrder.invoiceAmount }}</p>
              </div>
            </div>
          </div>

          <!-- LEAD TIME PERFORMANCE SCORECARD (KEY USER REQUIREMENT) -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="bg-gradient-to-tr from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-4 space-y-1">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Total Lead Time Pesanan</span>
              <p class="font-heading font-extrabold text-xl text-[#003C80]">{{ activeTrackingOrder.leadTimeDisplay }}</p>
              <p class="text-[11px] text-slate-600">Terhitung sejak klik order diajukan hingga tiba di lokasi</p>
            </div>

            <div class="bg-gradient-to-tr from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 space-y-1">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Performa SLA Logistik</span>
              <p class="font-heading font-extrabold text-xl text-emerald-700">38% Lebih Cepat</p>
              <p class="text-[11px] text-slate-600">Target SLA Maks: 48 Jam (Jabodetabek)</p>
            </div>

            <div class="bg-gradient-to-tr from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-4 space-y-1">
              <span class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Akun & Sales PIC</span>
              <p class="font-heading font-extrabold text-xl text-purple-900">{{ activeTrackingOrder.salesPic }}</p>
              <p class="text-[11px] text-slate-600">Kontrak Korporasi TOP 30 Hari</p>
            </div>
          </div>

          <!-- INTERACTIVE 5-STAGE TRACKING STEPPER WITH TIMESTAMPS & DURATION -->
          <div class="space-y-4 pt-2">
            <h4 class="font-bold text-xs uppercase tracking-wider text-slate-500">
              Progres Alur Pemrosesan, Packing Gudang & Pengiriman:
            </h4>

            <div class="space-y-4">
              <div 
                v-for="(step, idx) in activeTrackingOrder.steps" 
                :key="idx"
                class="flex items-start gap-4 p-3.5 rounded-xl border transition-all"
                :class="[
                  step.completed ? 'bg-emerald-50/40 border-emerald-200' : step.current ? 'bg-sky-50 border-[#008FD4] ring-1 ring-sky-200' : 'bg-slate-50/50 border-slate-200 opacity-60'
                ]"
              >
                <!-- Step Indicator Circle -->
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5"
                  :class="[
                    step.completed ? 'bg-emerald-600 text-white' : step.current ? 'bg-[#008FD4] text-white animate-pulse' : 'bg-slate-200 text-slate-600'
                  ]"
                >
                  <Check v-if="step.completed" class="w-4 h-4" />
                  <span v-else>{{ idx + 1 }}</span>
                </div>

                <!-- Step Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h5 class="font-bold text-slate-900 text-xs sm:text-sm">{{ step.title }}</h5>
                    <span class="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                      🕒 {{ step.time }}
                    </span>
                  </div>
                  <p class="text-xs text-slate-600 mt-1">{{ step.desc }}</p>
                  <div class="mt-2 flex items-center gap-2">
                    <span class="text-[10px] font-extrabold text-[#003C80] bg-sky-100/70 px-2 py-0.5 rounded">
                      Durasi Tahap: {{ step.leadTime }}
                    </span>
                    <span v-if="step.completed" class="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 class="w-3 h-3" /> Selesai
                    </span>
                    <span v-else-if="step.current" class="text-[10px] text-[#008FD4] font-bold flex items-center gap-1">
                      <Clock class="w-3 h-3 animate-spin" /> Sedang Berlangsung
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- SIMULASI KONTROL SALES (HANYA TAMPIL KETIKA MODE SALES AKTIF) -->
          <div v-if="b2bViewMode === 'sales'" class="bg-amber-50 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <ShieldCheck class="w-5 h-5 text-amber-700" />
                <h4 class="font-bold text-xs sm:text-sm text-amber-950">
                  Kontrol Simulasi Internal: Majukan Tahap Pemrosesan Pesanan
                </h4>
              </div>
              <span class="text-[11px] text-amber-800 font-bold">Layar Presenter</span>
            </div>
            <p class="text-xs text-amber-900">
              Gunakan tombol di bawah ini untuk mensimulasikan persetujuan kuotasi, penerbitan invoice resmi, dan proses packing di gudang DC Cikupa hingga pengiriman armada iClean.
            </p>
            <div class="flex flex-wrap items-center gap-2 pt-1">
              <button 
                v-if="activeTrackingOrder.statusStep < 5"
                @click="advanceOrderStep(activeTrackingOrder)"
                class="px-4 py-2 bg-[#003C80] hover:bg-[#002855] text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <TrendingUp class="w-4 h-4 text-emerald-400" />
                Majukan Status ke Tahap {{ activeTrackingOrder.statusStep + 1 }}
              </button>
              <button 
                @click="resetActiveOrder(activeTrackingOrder)"
                class="px-3 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-300 transition-all"
              >
                Reset Simulasi
              </button>
            </div>
          </div>

          <!-- DOKUMEN DIGITAL B2B TERLAMPIR -->
          <div class="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h5 class="font-bold text-xs text-slate-800">Dokumen Digital Terlampir (B2B Compliance):</h5>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <a href="#" @click.prevent="downloadDoc('Invoice')" class="p-2.5 bg-white hover:bg-sky-50 rounded-lg border border-slate-200 hover:border-sky-300 flex items-center justify-between text-slate-700">
                <div class="flex items-center gap-2">
                  <FileText class="w-4 h-4 text-[#008FD4]" />
                  <span class="font-semibold">Invoice Resmi (#INV)</span>
                </div>
                <span class="text-[10px] text-slate-400">PDF</span>
              </a>

              <a href="#" @click.prevent="downloadDoc('Surat Jalan')" class="p-2.5 bg-white hover:bg-sky-50 rounded-lg border border-slate-200 hover:border-sky-300 flex items-center justify-between text-slate-700">
                <div class="flex items-center gap-2">
                  <Truck class="w-4 h-4 text-emerald-600" />
                  <span class="font-semibold">Surat Jalan (DO-8821)</span>
                </div>
                <span class="text-[10px] text-slate-400">PDF</span>
              </a>

              <a href="#" @click.prevent="downloadDoc('COA & MSDS')" class="p-2.5 bg-white hover:bg-sky-50 rounded-lg border border-slate-200 hover:border-sky-300 flex items-center justify-between text-slate-700">
                <div class="flex items-center gap-2">
                  <CheckCircle2 class="w-4 h-4 text-purple-600" />
                  <span class="font-semibold">Sertifikat COA & MSDS</span>
                </div>
                <span class="text-[10px] text-slate-400">PDF</span>
              </a>
            </div>
          </div>

        </div>

      </div>

      <!-- ======================================================== -->
      <!-- SUBTAB 3: ANALISA POLA BELANJA & PREDIKSI KEBUTUHAN AI -->
      <!-- ======================================================== -->
      <div v-if="b2bSubTab === 'forecast'" class="space-y-6">
        
        <!-- TOP EXECUTIVE METRICS -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Pembelian 6 Bulan</span>
            <p class="font-heading font-extrabold text-lg sm:text-xl text-[#003C80]">Rp 78.400.000</p>
            <p class="text-[10px] text-emerald-600 font-semibold">✓ 100% On-Time (TOP 30 Hari)</p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Siklus Repeat Order</span>
            <p class="font-heading font-extrabold text-lg sm:text-xl text-[#008FD4]">32 Hari Sekali</p>
            <p class="text-[10px] text-slate-500">Rata-rata 16.5 Pail / Siklus</p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Kategori Dominan</span>
            <p class="font-heading font-extrabold text-lg sm:text-xl text-slate-800">Food Service</p>
            <p class="text-[10px] text-slate-500">62% Porsi Kebutuhan Dapur</p>
          </div>

          <div class="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span class="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rata-rata Lead Time</span>
            <p class="font-heading font-extrabold text-lg sm:text-xl text-emerald-600">27.5 Jam</p>
            <p class="text-[10px] text-emerald-700 font-semibold">⚡ 42% Lebih Cepat dari SLA</p>
          </div>
        </div>

        <!-- AI HERMES PREDICTIVE CHEMICAL REPLENISHMENT ALERT CARD -->
        <div class="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4 relative overflow-hidden">
          <div class="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>

          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
            <div class="flex items-center gap-2.5">
              <span class="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
                <Sparkles class="w-5 h-5 text-white" />
              </span>
              <div>
                <span class="text-[10px] uppercase tracking-wider font-extrabold bg-white/20 px-2.5 py-0.5 rounded-full">
                  Hermes AI Smart Replenishment
                </span>
                <h3 class="font-heading font-extrabold text-lg sm:text-xl text-white mt-1">
                  Peringatan Stok Kritis & Prediksi Re-Order Chemical
                </h3>
              </div>
            </div>
            <span class="text-xs font-bold bg-white text-orange-900 px-3 py-1 rounded-full shadow-xs self-start sm:self-auto">
              Sisa 12 Hari!
            </span>
          </div>

          <p class="text-xs sm:text-sm text-white/95 leading-relaxed relative z-10 max-w-3xl">
            Berdasarkan histori belanja dan laju konsumsi dapur Hotel Grand Serpong (0.62 pail/hari), stok <strong>iClean Kitchen Degreaser Pro</strong> diestimasi tersisa ± 7 pail dan akan <strong>habis pada 28 Nov 2026</strong>. Disarankan melakukan order 15-20 Pail sebelum tanggal 22 Nov 2026 untuk mengantisipasi lead time pengiriman (1.2 hari) dan mencegah risiko downtime kebersihan dapur.
          </p>

          <div class="pt-2 flex flex-wrap items-center gap-3 relative z-10">
            <button 
              @click="quickReorderPredicted"
              class="px-5 py-2.5 bg-white hover:bg-slate-100 text-orange-900 text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles class="w-4 h-4 text-orange-600" />
              ⚡ 1-Click Ajukan Re-Order Kebutuhan Ini (15 Pail)
            </button>
            <span class="text-xs text-white/80">Otomatis memasukkan 15 Pail ke form pemesanan</span>
          </div>
        </div>

        <!-- POLA KONSUMSI HISTORIS PER PRODUK (BURN RATE CADENCE) -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <TrendingUp class="w-4 h-4 text-[#008FD4]" />
                Pola Konsumsi Historis & Sisa Hari Pemakaian
              </h3>
              <p class="text-xs text-slate-500">
                Analisa burn rate harian yang mendeteksi kapan setiap chemical perlu di-restock
              </p>
            </div>
            <span class="text-xs text-slate-500 font-semibold">Data 6 Bulan Terakhir</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <!-- Product 1: Degreaser -->
            <div class="p-4 bg-amber-50/50 rounded-xl border border-amber-200 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-slate-900 text-xs">Kitchen Degreaser Pro (20L)</h4>
                  <p class="text-[10px] text-slate-500">Area Dapur & Exhaust Hood Restoran</p>
                </div>
                <span class="font-extrabold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full text-[10px]">
                  ⚠️ Sisa 12 Hari
                </span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-amber-500 h-full w-[25%] rounded-full"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-600">
                <span>Konsumsi: 0.62 Pail/Hari (~18 Pail/Bln)</span>
                <span>Siklus: 32 Hari Sekali</span>
              </div>
            </div>

            <!-- Product 2: Dishwashing -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-slate-900 text-xs">Dishwashing Liquid Super (20L)</h4>
                  <p class="text-[10px] text-slate-500">Dishwasher Machine & Manual Sink</p>
                </div>
                <span class="font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px]">
                  ✓ Sisa 31 Hari (Aman)
                </span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full w-[65%] rounded-full"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-600">
                <span>Konsumsi: 0.45 Pail/Hari (~13 Pail/Bln)</span>
                <span>Siklus: 25 Hari Sekali</span>
              </div>
            </div>

            <!-- Product 3: Laundry Enzymatic -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-slate-900 text-xs">Liquid Laundry Enzymatic (20L)</h4>
                  <p class="text-[10px] text-slate-500">Unit Linen & Laundry Hotel</p>
                </div>
                <span class="font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px]">
                  ✓ Sisa 33 Hari (Aman)
                </span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full w-[70%] rounded-full"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-600">
                <span>Konsumsi: 0.28 Pail/Hari (~8 Pail/Bln)</span>
                <span>Siklus: 35 Hari Sekali</span>
              </div>
            </div>

            <!-- Product 4: Sanitizer -->
            <div class="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-bold text-slate-900 text-xs">Surface Hospital Sanitizer (20L)</h4>
                  <p class="text-[10px] text-slate-500">Housekeeping & Public Area</p>
                </div>
                <span class="font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[10px]">
                  ✓ Sisa 45 Hari (Aman)
                </span>
              </div>
              <div class="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div class="bg-emerald-500 h-full w-[85%] rounded-full"></div>
              </div>
              <div class="flex justify-between text-[10px] text-slate-600">
                <span>Konsumsi: 0.15 Pail/Hari (~4.5 Pail/Bln)</span>
                <span>Siklus: 45 Hari Sekali</span>
              </div>
            </div>
          </div>
        </div>

        <!-- PROYEKSI KEBUTUHAN 3 BULAN KE DEPAN (DES 2026, JAN 2027, FEB 2027) -->
        <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-100 pb-3">
            <div>
              <h3 class="font-heading font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                <Calendar class="w-4 h-4 text-[#008FD4]" />
                Proyeksi Kebutuhan Chemical 3 Bulan ke Depan
              </h3>
              <p class="text-xs text-slate-500">
                Prakiraan kebutuhan chemical berdasarkan tren musiman industri perhotelan (High Season akhir tahun vs normalisasi)
              </p>
            </div>
            <span class="text-xs font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200">
              Model Prediktif Hermes AI
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Des 2026 -->
            <div class="p-4 rounded-2xl border border-purple-200 bg-gradient-to-b from-purple-50/50 to-white space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-extrabold text-purple-900 uppercase tracking-wider">Desember 2026</span>
                <span class="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">Peak Season (+35%)</span>
              </div>
              <div class="space-y-1">
                <p class="font-heading font-extrabold text-2xl text-[#003C80]">28 Pail</p>
                <p class="text-[11px] text-slate-600 leading-snug">
                  Gala dinner akhir tahun, banquet ballroom, dan estimasi okupansi hotel 95% memicu lonjakan cuci piring & degreaser dapur.
                </p>
              </div>
              <div class="pt-2 border-t border-purple-100 text-[10px] text-purple-800 font-semibold">
                💡 Rekomendasi: Order di minggu ke-1 Des ke Warehouse Terpusat untuk mengunci slot pengiriman ekspedisi.
              </div>
            </div>

            <!-- Jan 2027 -->
            <div class="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider">Januari 2027</span>
                <span class="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Normalisasi (-10%)</span>
              </div>
              <div class="space-y-1">
                <p class="font-heading font-extrabold text-2xl text-slate-800">16 Pail</p>
                <p class="text-[11px] text-slate-600 leading-snug">
                  Operasional hotel kembali normal pasca libur pergantian tahun. Pemakaian rutin untuk housekeeping & maintenance reguler.
                </p>
              </div>
              <div class="pt-2 border-t border-slate-200 text-[10px] text-slate-600 font-semibold">
                💡 Rekomendasi: Penyesuaian stok aman dengan order rutin mingguan.
              </div>
            </div>

            <!-- Feb 2027 -->
            <div class="p-4 rounded-2xl border border-sky-200 bg-gradient-to-b from-sky-50/50 to-white space-y-2.5">
              <div class="flex items-center justify-between">
                <span class="text-[11px] font-extrabold text-[#003C80] uppercase tracking-wider">Februari 2027</span>
                <span class="bg-sky-100 text-[#003C80] text-[10px] font-bold px-2 py-0.5 rounded-full">MICE & Imlek (+18%)</span>
              </div>
              <div class="space-y-1">
                <p class="font-heading font-extrabold text-2xl text-[#008FD4]">22 Pail</p>
                <p class="text-[11px] text-slate-600 leading-snug">
                  Peningkatan pemesanan ruang meeting korporasi dan perayaan Imlek di restoran hotel membutuhkan ekstra chemical sanitize & degreaser.
                </p>
              </div>
              <div class="pt-2 border-t border-sky-100 text-[10px] text-[#003C80] font-semibold">
                💡 Rekomendasi: Buffer stok 5 pail ekstra di akhir Januari.
              </div>
            </div>
          </div>
        </div>

        <!-- ANALISA STRATEGI DISTRIBUSI: WAREHOUSE TERPUSAT VS CABANG LANGSUNG -->
        <div class="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 shadow-md space-y-3">
          <div class="flex items-center gap-2">
            <Warehouse class="w-5 h-5 text-sky-400" />
            <h4 class="font-heading font-bold text-sm sm:text-base text-white">
              Analisis Efisiensi Distribusi: Warehouse Terpusat vs Direct Cabang
            </h4>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed">
            Data 6 bulan menunjukkan bahwa mengirimkan pesanan volume besar (> 20 pail) ke <strong>Warehouse Terpusat (DC Cikupa)</strong> menghemat <strong>18% biaya logistik</strong> dibandingkan pengiriman bertahap ke masing-masing cabang. Namun untuk kebutuhan darurat (stok kritis &lt; 15 hari), pengiriman langsung ke <strong>Central Kitchen Serpong</strong> atau <strong>Cabang Resort Bogor</strong> menjamin lead time tiba dalam <strong>&lt; 24 jam</strong>.
          </p>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { 
  Building2, ShieldCheck, Sparkles, MapPin, Package, FileText, CheckCircle2,
  AlertCircle, Check, Clock, TrendingUp, Calendar, Boxes, Truck, Warehouse, Send, Info
} from 'lucide-vue-next'

// Perspective View Mode: 'client' (Hotel Grand) | 'sales' (Internal Sales & Warehouse DC)
const b2bViewMode = ref('client')

// Subtabs: 'catalog' | 'orders' | 'forecast'
const b2bSubTab = ref('catalog')

// Selected destination ID
const selectedDestinationId = ref('warehouse')
const orderNotes = ref('Mohon sertakan lembar COA & MSDS resmi. Akses via loading dock B.')
const activeTrackingOrderId = ref('PO-2026-1188')

// Registered Delivery Destinations (Warehouse Terpusat vs Cabang Langsung)
const deliveryDestinations = ref([
  {
    id: 'warehouse',
    name: 'Warehouse Terpusat (DC Logistik Cikupa)',
    badge: 'Pusat Distribusi (DC)',
    address: 'Kawasan Industri Cikupa Mas Blok B No. 12, Cikupa, Tangerang, Banten',
    pic: 'Bambang Sudirja (Kepala Logistik DC)',
    phone: '0812-9988-7711',
    hours: '08:00 - 17:00 WIB (Senin - Sabtu)',
    dock: 'Loading Dock A (Kapasitas Kontainer / Truk Besar, Forklift Ready)',
    notes: 'Rekomendasi pengiriman konsolidasi volume besar (> 20 pail) untuk efisiensi biaya logistik.'
  },
  {
    id: 'branch_kitchen',
    name: 'Cabang 1: Central Kitchen (Hotel Grand Serpong)',
    badge: 'Langsung ke Cabang / Unit',
    address: 'Jl. MH Thamrin KM 2.7, Kebon Nanas, Tangerang (Lantai Ground Kitchen)',
    pic: 'Chef Hendra (Executive Chef) / Bp. Budi Santoso',
    phone: '0811-2233-4455',
    hours: '07:00 - 10:30 WIB (Penerimaan sebelum operasional resto)',
    dock: 'Service Lift Loading Dock 2',
    notes: 'Harap bawa troli pengantar cairan. Wajib label food-grade dan sertifikat Halal.'
  },
  {
    id: 'branch_laundry',
    name: 'Cabang 2: Laundry & Linen Hub (Hotel Grand Serpong)',
    badge: 'Langsung ke Cabang / Unit',
    address: 'Gedung Annex Fl. B1, Jl. MH Thamrin KM 2.7, Tangerang',
    pic: 'Ibu Ratna (Laundry Supervisor)',
    phone: '0857-1122-3344',
    hours: '08:00 - 15:00 WIB',
    dock: 'Pintu Masuk Barat Annex (Basement 1)',
    notes: 'Kemasan pail harus bersegel utuh dan anti bocor.'
  },
  {
    id: 'branch_bogor',
    name: 'Cabang 3: Grand Hotel Resort Bogor',
    badge: 'Langsung ke Cabang / Unit',
    address: 'Jl. Raya Puncak KM 84, Cisarua, Bogor, Jawa Barat',
    pic: 'Pak Danu (Facility & Housekeeping Manager)',
    phone: '0813-4455-6677',
    hours: '09:00 - 16:00 WIB',
    dock: 'Area Parkir Logistik Belakang Villa 10',
    notes: 'Akses jalan menanjak. Armada ekspedisi dibatasi maksimal truk engkel 4 roda.'
  }
])

const currentDestination = computed(() => {
  return deliveryDestinations.value.find(d => d.id === selectedDestinationId.value) || deliveryDestinations.value[0]
})

// B2B Chemical Product Catalog
const b2bCatalog = ref([
  {
    id: 1,
    name: 'iClean Kitchen Degreaser Pro',
    packaging: 'Pail 20 Liter',
    category: 'Layanan Makanan (Food Service)',
    cert: 'Food Grade · Halal · Izin Kemenkes RI',
    tierPrice: 'Estimasi Kontrak: Rp 315.000 - Rp 340.000 / Pail',
    stockDc: '85 Pail Tersedia di DC Cikupa',
    lastOrder: '15 Pail (12 Okt 2026)',
    desc: 'Cairan pembersih alkali khusus pelarut kerak lemak jenuh, minyak nabati/hewani pada exhaust hood, lantai dapur stainless, dan kompor hotel.',
    qty: 0,
    depletionDays: 12,
    isCritical: true
  },
  {
    id: 2,
    name: 'iClean Dishwashing Liquid Super',
    packaging: 'Pail 20 Liter',
    category: 'Layanan Makanan (Food Service)',
    cert: 'Konsentrat Tinggi · Lembut di Tangan',
    tierPrice: 'Estimasi Kontrak: Rp 280.000 - Rp 305.000 / Pail',
    stockDc: '120 Pail Tersedia di DC Cikupa',
    lastOrder: '10 Pail (12 Okt 2026)',
    desc: 'Sabun cuci piring konsentrat rasio 1:60 untuk mesin dishwasher komersial maupun manual sink. Efektif mengangkat noda amis seketika.',
    qty: 0,
    depletionDays: 31,
    isCritical: false
  },
  {
    id: 3,
    name: 'iClean Surface Hospital Sanitizer',
    packaging: 'Pail 20 Liter',
    category: 'Housekeeping & Medicare',
    cert: 'Bakterisidal & Virusidal 99.99%',
    tierPrice: 'Estimasi Kontrak: Rp 390.000 - Rp 420.000 / Pail',
    stockDc: '45 Pail Tersedia di DC Cikupa',
    lastOrder: '5 Pail (28 Agt 2026)',
    desc: 'Desinfektan spektrum luas berbahan dasar quaternary ammonium compound generasi terbaru. Sangat aman untuk kamar tamu dan lobby.',
    qty: 0,
    depletionDays: 45,
    isCritical: false
  },
  {
    id: 4,
    name: 'iClean Heavy Duty Oven & Grill Cleaner',
    packaging: 'Box (4 x Jerigen 5 Liter)',
    category: 'Kitchen Maintenance',
    cert: 'Formula Penetrasi Karbon Gosong',
    tierPrice: 'Estimasi Kontrak: Rp 265.000 - Rp 290.000 / Box',
    stockDc: '60 Box Tersedia di DC Cikupa',
    lastOrder: 'Belum pernah dipesan',
    desc: 'Cairan kental pembersih kerak gosong pada oven, pemanggang grill, salamander dan wajan baja tanpa perlu menyikat keras.',
    qty: 0,
    depletionDays: 99,
    isCritical: false
  },
  {
    id: 5,
    name: 'iClean Liquid Laundry Enzymatic Pro',
    packaging: 'Pail 20 Liter',
    category: 'Commercial Laundry Care',
    cert: 'Triple Bio-Enzymes · Anti-Redeposisi',
    tierPrice: 'Estimasi Kontrak: Rp 340.000 - Rp 370.000 / Pail',
    stockDc: '90 Pail Tersedia di DC Cikupa',
    lastOrder: '8 Pail (12 Okt 2026)',
    desc: 'Deterjen cair mesin laundry komersial dengan enzim protease dan amilase untuk sprei, handuk, dan linen hotel.',
    qty: 0,
    depletionDays: 33,
    isCritical: false
  },
  {
    id: 6,
    name: 'iClean Floor Cleaner Pine Fresh',
    packaging: 'Pail 20 Liter',
    category: 'Public Area & Housekeeping',
    cert: 'Non-Slip · Harum Pinus Segar',
    tierPrice: 'Estimasi Kontrak: Rp 230.000 - Rp 255.000 / Pail',
    stockDc: '110 Pail Tersedia di DC Cikupa',
    lastOrder: '4 Pail (28 Agt 2026)',
    desc: 'Pembersih lantai marmer, granit dan keramik berformula cepat kering dan tidak meninggalkan residu lengket.',
    qty: 0,
    depletionDays: 40,
    isCritical: false
  }
])

const selectedItemsTotalQty = computed(() => {
  return b2bCatalog.value.reduce((acc, item) => acc + item.qty, 0)
})

// Orders dataset with stage-by-stage timestamps, lead times, and destinations
const b2bOrders = ref([
  {
    id: 'PO-2026-1204',
    code: '#PO-2026-1204',
    date: 'Hari Ini, 16 Nov 2026 (11:15 WIB)',
    destinationName: 'Warehouse Terpusat (DC Logistik Cikupa)',
    destinationType: 'Warehouse Terpusat',
    itemsList: [
      { name: 'Kitchen Degreaser Pro (20L)', qty: 20 },
      { name: 'Dishwashing Liquid Super (20L)', qty: 10 }
    ],
    totalPail: '30 Pail (600 L)',
    pricingStatus: 'Menunggu Approval & Invoice Sales',
    salesPic: 'Andi Pratama (Sales Rep)',
    invoiceNo: '#INV-2026-1204 (Draft)',
    invoiceAmount: 'Est. Rp 9.750.000 (Menunggu Diskon Kontrak)',
    statusStep: 1, // 1: RFQ Diajukan, 2: Invoice Diterbitkan, 3: Packing Gudang, 4: Dalam Pengiriman, 5: Tiba di Lokasi
    leadTimeDisplay: 'Berjalan: 45 Menit (Est. Tiba Besok Sore)',
    notes: 'Klien mengajukan order via portal. Menunggu terbitan invoice resmi.',
    steps: [
      {
        title: 'Order Diajukan Klien (RFQ)',
        time: '16 Nov 11:15 WIB',
        desc: 'Pak Budi (Hotel Grand Serpong) mengajukan permintaan 30 pail ke Warehouse Terpusat.',
        leadTime: '0 Menit (Inisiasi)',
        completed: true,
        current: true
      },
      {
        title: 'Review Sales & Terbit Invoice',
        time: 'Estimasi < 2 Jam',
        desc: 'Sales Andi Pratama memvalidasi tier volume 30 pail, menerapkan diskon TOP 30 hari & generate invoice.',
        leadTime: 'Est. +1.5 Jam',
        completed: false,
        current: false
      },
      {
        title: 'Packing & Quality Check (DC Cikupa)',
        time: 'Menunggu Invoice',
        desc: 'Palet 30 pail di-wrapping plastik stretch, barcode batch ditempel, dan surat jalan dicetak.',
        leadTime: 'Est. +3 Jam',
        completed: false,
        current: false
      },
      {
        title: 'Dalam Pengiriman Armada iClean',
        time: 'Menunggu Packing',
        desc: 'Truk Box CDD iClean diberangkatkan dengan surat jalan resmi menuju Kawasan Industri Cikupa Mas.',
        leadTime: 'Est. +18 Jam',
        completed: false,
        current: false
      },
      {
        title: 'Tiba di Lokasi & Diterima Klien',
        time: 'Estimasi Besok Sore',
        desc: 'Bongkar muat di loading dock DC, verifikasi fisik barang, penandatanganan Bukti Timbang & Surat Jalan.',
        leadTime: 'Target Lead Time: 26 Jam',
        completed: false,
        current: false
      }
    ]
  },
  {
    id: 'PO-2026-1188',
    code: '#PO-2026-1188',
    date: '14 Nov 2026 - 15 Nov 2026',
    destinationName: 'Cabang 1: Central Kitchen (Hotel Grand Serpong)',
    destinationType: 'Langsung ke Cabang',
    itemsList: [
      { name: 'Kitchen Degreaser Pro (20L)', qty: 15 },
      { name: 'Dishwashing Liquid Super (20L)', qty: 8 }
    ],
    totalPail: '23 Pail (460 L)',
    pricingStatus: 'Invoice Terbit & Selesai',
    salesPic: 'Andi Pratama',
    invoiceNo: '#INV-2026-1188',
    invoiceAmount: 'Rp 7.425.000 (Diskon Kontrak 5% Applied)',
    statusStep: 5,
    leadTimeDisplay: '29 Jam (1.2 Hari) — 38% Lebih Cepat dari SLA',
    notes: 'Selesai. Barang diterima oleh Chef Hendra di Dapur Utama Hotel Grand Serpong.',
    steps: [
      {
        title: 'Order Diajukan Klien (RFQ)',
        time: '14 Nov 09:15 WIB',
        desc: 'Pak Budi memesan 15 pail Degreaser + 8 pail Dishwashing langsung ke unit Central Kitchen.',
        leadTime: 'Titik Awal Order',
        completed: true,
        current: false
      },
      {
        title: 'Review Sales & Terbit Invoice',
        time: '14 Nov 10:45 WIB',
        desc: 'Andi Pratama mengonfirmasi diskon kontrak korporasi 5% dan menerbitkan Invoice #INV-2026-1188 (TOP 30 Hari).',
        leadTime: '+1 Jam 30 Menit (Review Cepat)',
        completed: true,
        current: false
      },
      {
        title: 'Packing & Quality Check (DC Cikupa)',
        time: '14 Nov 14:00 WIB',
        desc: 'Tim gudang DC Cikupa mem-palletize 23 pail, melampirkan lembar COA & MSDS, dan segel tamper-evident.',
        leadTime: '+3 Jam 15 Menit (Packing Selesai)',
        completed: true,
        current: false
      },
      {
        title: 'Dalam Pengiriman Armada iClean',
        time: '15 Nov 08:30 WIB',
        desc: 'Armada Truk Box iClean B 9124 XYZ (Supir: Pak Joko) berangkat dari hub Cikupa menuju Tangerang Kota.',
        leadTime: '+18 Jam 30 Menit (Jadwal Pengiriman Pagi)',
        completed: true,
        current: false
      },
      {
        title: 'Tiba di Lokasi & Diterima Klien',
        time: '15 Nov 14:15 WIB',
        desc: 'Barang dibongkar di Service Lift Dock 2, diverifikasi oleh Chef Hendra, dan Surat Jalan DO-8821 ditandatangani.',
        leadTime: '+5 Jam 45 Menit (Tuntas)',
        completed: true,
        current: false
      }
    ]
  },
  {
    id: 'PO-2026-1042',
    code: '#PO-2026-1042',
    date: '12 Okt 2026',
    destinationName: 'Warehouse Terpusat (DC Logistik Cikupa)',
    destinationType: 'Warehouse Terpusat',
    itemsList: [
      { name: 'Kitchen Degreaser Pro (20L)', qty: 15 },
      { name: 'Dishwashing Liquid Super (20L)', qty: 10 },
      { name: 'Liquid Laundry Enzymatic (20L)', qty: 8 }
    ],
    totalPail: '33 Pail (660 L)',
    pricingStatus: 'Lunas & Selesai',
    salesPic: 'Andi Pratama',
    invoiceNo: '#INV-2026-1042',
    invoiceAmount: 'Rp 10.820.000',
    statusStep: 5,
    leadTimeDisplay: '26 Jam (1.1 Hari)',
    notes: 'Order rutin bulanan ke gudang pusat logistik.',
    steps: []
  },
  {
    id: 'PO-2026-0881',
    code: '#PO-2026-0881',
    date: '28 Agt 2026',
    destinationName: 'Cabang 3: Grand Hotel Resort Bogor',
    destinationType: 'Langsung ke Cabang',
    itemsList: [
      { name: 'Surface Hospital Sanitizer (20L)', qty: 5 },
      { name: 'Floor Cleaner Pine Fresh (20L)', qty: 4 }
    ],
    totalPail: '9 Pail (180 L)',
    pricingStatus: 'Lunas & Selesai',
    salesPic: 'Andi Pratama',
    invoiceNo: '#INV-2026-0881',
    invoiceAmount: 'Rp 3.120.000',
    statusStep: 5,
    leadTimeDisplay: '34 Jam (1.4 Hari)',
    notes: 'Pengiriman langsung ke cabang Puncak Bogor via truk engkel.',
    steps: []
  }
])

const activeTrackingOrder = computed(() => {
  return b2bOrders.value.find(o => o.id === activeTrackingOrderId.value) || b2bOrders.value[0]
})

const pendingSalesOrdersCount = computed(() => {
  return b2bOrders.value.filter(o => o.statusStep === 1).length
})

// Submission of B2B Order (RFQ Flow)
function submitB2bOrder() {
  if (selectedItemsTotalQty.value === 0) {
    alert('Silakan pilih minimal 1 produk pada katalog untuk mengajukan pesanan.')
    return
  }

  const dest = deliveryDestinations.value.find(d => d.id === selectedDestinationId.value)
  const chosenItems = b2bCatalog.value.filter(i => i.qty > 0).map(i => ({ name: `${i.name} (${i.packaging})`, qty: i.qty }))
  const totalVolume = selectedItemsTotalQty.value
  const randomNum = Math.floor(1000 + Math.random() * 9000)

  const newOrder = {
    id: `PO-2026-${randomNum}`,
    code: `#PO-2026-${randomNum}`,
    date: 'Baru Saja (16 Nov)',
    destinationName: dest ? dest.name : 'Warehouse Terpusat',
    destinationType: dest ? dest.badge : 'Warehouse Terpusat',
    itemsList: chosenItems,
    totalPail: `${totalVolume} Unit (${totalVolume * 20} Liter)`,
    pricingStatus: 'Permintaan Terkirim (Menunggu Invoice Sales)',
    salesPic: 'Andi Pratama',
    invoiceNo: 'Draft (Menunggu Terbitan Sales)',
    invoiceAmount: 'Dihitung berdasarkan kontrak',
    statusStep: 1,
    leadTimeDisplay: 'Baru Dimulai (Menunggu Review Sales)',
    notes: orderNotes.value || 'Tidak ada catatan tambahan',
    steps: [
      {
        title: 'Order Diajukan Klien (RFQ)',
        time: 'Baru Saja',
        desc: `Permintaan ${totalVolume} unit dikirim ke tim Sales & Akun iClean oleh Budi Santoso.`,
        leadTime: '0 Menit (Inisiasi)',
        completed: true,
        current: true
      },
      {
        title: 'Review Sales & Terbit Invoice',
        time: 'Estimasi < 2 Jam',
        desc: 'Sales Andi Pratama memvalidasi tier harga kontrak dan menerbitkan invoice resmi.',
        leadTime: 'Est. +1.5 Jam',
        completed: false,
        current: false
      },
      {
        title: 'Packing & Quality Check (DC Cikupa)',
        time: 'Menunggu Invoice',
        desc: 'Proses kemas dan inspeksi segel mutu produk di gudang pusat.',
        leadTime: 'Est. +3 Jam',
        completed: false,
        current: false
      },
      {
        title: 'Dalam Pengiriman Armada iClean',
        time: 'Menunggu Packing',
        desc: 'Armada logistik mengirim pesanan ke lokasi pengiriman yang dipilih.',
        leadTime: 'Est. +18 Jam',
        completed: false,
        current: false
      },
      {
        title: 'Tiba di Lokasi & Diterima Klien',
        time: 'Estimasi 24-36 Jam',
        desc: 'Barang diterima dan diverifikasi oleh PIC penerima.',
        leadTime: 'Target SLA: 48 Jam',
        completed: false,
        current: false
      }
    ]
  }

  b2bOrders.value.unshift(newOrder)
  activeTrackingOrderId.value = newOrder.id

  // Reset product quantities
  b2bCatalog.value.forEach(i => i.qty = 0)

  // Switch to tracking view
  b2bSubTab.value = 'orders'
  alert(`✅ Permintaan Order ${newOrder.code} Berhasil Dikirim!\n\nNotifikasi instan telah masuk ke Sales PIC (Andi Pratama). Anda dapat memantau status persetujuan invoice, proses packing gudang, dan lead time pengiriman pada layar Tracking ini.`)
}

// 1-Click Re-order from AI Prediksi
function quickReorderPredicted() {
  const item = b2bCatalog.value.find(i => i.id === 1) // Kitchen Degreaser
  if (item) {
    item.qty = 15
  }
  b2bSubTab.value = 'catalog'
  alert('✨ 15 Pail Kitchen Degreaser Pro berhasil dimasukkan ke form order sesuai rekomendasi AI Hermes!\n\nSilakan pilih tujuan pengiriman (Warehouse Terpusat atau Cabang Kitchen) lalu klik "Kirim Permintaan Order".')
}

// Advance Order Step in Sales Mode
function advanceOrderStep(order) {
  if (order.statusStep < 5) {
    order.statusStep += 1
    if (order.statusStep === 2) {
      order.pricingStatus = 'Invoice Resmi Terbit (#INV-2026-1204)'
      order.invoiceAmount = 'Rp 9.262.500 (Diskon Kontrak 5% Disetujui)'
      if (order.steps[1]) {
        order.steps[1].completed = true
        order.steps[1].time = 'Hari Ini 11:45 WIB'
        order.steps[1].desc = 'Sales Andi Pratama menyetujui harga kontrak & menerbitkan Invoice #INV-2026-1204 (TOP 30 Hari).'
        order.steps[1].current = false
      }
      if (order.steps[2]) order.steps[2].current = true
      order.leadTimeDisplay = 'Lead Time: 30 Menit (Invoice Siap)'
      alert('📄 Invoice #INV-2026-1204 berhasil diterbitkan oleh Tim Sales!\nStatus otomatis beralih ke Packing Gudang DC Cikupa.')
    } else if (order.statusStep === 3) {
      if (order.steps[2]) {
        order.steps[2].completed = true
        order.steps[2].time = 'Hari Ini 13:30 WIB'
        order.steps[2].desc = 'Tim DC Cikupa selesai melakukan palletizing, wrapping & penempelan barcode batch.'
        order.steps[2].current = false
      }
      if (order.steps[3]) order.steps[3].current = true
      order.leadTimeDisplay = 'Lead Time: 2 Jam 15 Menit (Packing Selesai)'
      alert('📦 Gudang DC Cikupa: Proses packing & QC selesai.\nBarang siap dimuat ke armada truk logistik.')
    } else if (order.statusStep === 4) {
      if (order.steps[3]) {
        order.steps[3].completed = true
        order.steps[3].time = 'Hari Ini 14:15 WIB'
        order.steps[3].desc = 'Truk Box iClean B 9124 XYZ (Supir: Pak Joko) diberangkatkan menuju lokasi tujuan.'
        order.steps[3].current = false
      }
      if (order.steps[4]) order.steps[4].current = true
      order.leadTimeDisplay = 'Lead Time: 3 Jam (Dalam Perjalanan)'
      alert('🚚 Armada Logistik: Truk sedang dalam perjalanan menuju lokasi pengiriman.')
    } else if (order.statusStep === 5) {
      if (order.steps[4]) {
        order.steps[4].completed = true
        order.steps[4].time = 'Hari Ini 16:30 WIB'
        order.steps[4].desc = 'Barang tiba di lokasi tujuan, diperiksa PIC penerima & Surat Jalan ditandatangani.'
        order.steps[4].current = false
      }
      order.pricingStatus = 'Tiba di Lokasi & Selesai'
      order.leadTimeDisplay = 'Total Lead Time: 5 Jam 15 Menit (Tuntas Hari yang Sama)'
      alert('✅ Pengiriman Selesai!\nBarang telah diterima dengan baik di lokasi klien dan surat jalan terverifikasi.')
    }
  }
}

function resetActiveOrder(order) {
  order.statusStep = 1
  order.pricingStatus = 'Menunggu Approval & Invoice Sales'
  order.invoiceAmount = 'Est. Rp 9.750.000 (Menunggu Diskon Kontrak)'
  order.leadTimeDisplay = 'Berjalan: 45 Menit'
  if (order.steps && order.steps.length) {
    order.steps[0].completed = true
    order.steps[0].current = true
    for (let i = 1; i < order.steps.length; i++) {
      order.steps[i].completed = false
      order.steps[i].current = false
    }
  }
  alert('Simulasi pesanan berhasil di-reset ke tahap 1 (Order Diajukan).')
}

function downloadDoc(docType) {
  alert(`Mengunduh dokumen digital: ${docType} (${activeTrackingOrder.value.code})...\nDokumen ini tersinkronisasi otomatis dengan CMS & ERP iClean.`)
}
</script>
