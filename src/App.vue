<template>
  <div class="h-screen w-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased overflow-hidden">
    <!-- Top Navigation Header -->
    <header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-20 shrink-0">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <img src="/logo_iclean_birru.png" alt="iClean Logo" class="h-8 object-contain" />
          <div class="flex items-center gap-2">
            <span class="font-heading font-extrabold text-xl tracking-tight text-[#003C80]">iClean<span class="text-[#008FD4]">Connect</span></span>
            <span class="bg-sky-100 text-[#008FD4] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-sky-200 uppercase tracking-wider">
              Prototype Mockup
            </span>
          </div>
        </div>

        <!-- Navigation Tabs -->
        <nav class="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button 
            @click="activeTab = 'inbox'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
              activeTab === 'inbox' ? 'bg-white text-[#003C80] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <MessageSquare class="w-4 h-4 text-[#008FD4]" />
            Unified Inbox (Omnichannel CS)
            <span class="bg-[#008FD4] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">4</span>
          </button>

          <button 
            @click="activeTab = 'simulator'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
              activeTab === 'simulator' ? 'bg-white text-[#003C80] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <GitMerge class="w-4 h-4 text-emerald-500" />
            Cross-Channel Journey Simulator
          </button>

          <button 
            @click="activeTab = 'analytics'"
            :class="[
              'px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-2',
              activeTab === 'analytics' ? 'bg-white text-[#003C80] shadow-sm' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <BarChart3 class="w-4 h-4 text-purple-500" />
            Executive Dashboard
          </button>
        </nav>
      </div>

      <!-- Right System Status -->
      <div class="flex items-center gap-4">
        <div class="hidden lg:flex items-center gap-3 text-xs">
          <div class="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CMS API: <strong>{{ productsCount }} Produk Aktif</strong></span>
          </div>
          <div class="flex items-center gap-1.5 bg-sky-50 text-[#008FD4] px-3 py-1 rounded-lg border border-sky-200">
            <Sparkles class="w-3.5 h-3.5 text-[#008FD4]" />
            <span>Hermes RAG AI: <strong>Ready</strong></span>
          </div>
        </div>

        <div class="flex items-center gap-2 pl-3 border-l border-slate-200">
          <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-[#008FD4] to-[#003C80] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            CS
          </div>
          <div class="text-xs hidden sm:block">
            <p class="font-bold text-slate-800 leading-tight">Customer Support Team</p>
            <p class="text-slate-500 text-[10px]">iClean Staging Node (VM3)</p>
          </div>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT CONTAINER -->
    <main class="flex-1 overflow-hidden">
      <!-- 1. TAB: UNIFIED INBOX VIEW (3-COLUMN LAYOUT) -->
      <div v-if="activeTab === 'inbox'" class="h-full flex overflow-hidden">
        
        <!-- COLUMN 1: CHANNELS & CONVERSATION LIST -->
        <section class="w-80 md:w-88 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <!-- Channel Filter Header -->
          <div class="p-3.5 border-b border-slate-100">
            <div class="relative mb-3">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Cari pelanggan, pesan, no. WA..."
                class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#008FD4] focus:bg-white transition-all"
              />
            </div>

            <!-- Channel Pills -->
            <div class="grid grid-cols-4 gap-1">
              <button 
                @click="channelFilter = 'all'"
                :class="[
                  'py-1 rounded-md text-[11px] font-semibold text-center transition-all',
                  channelFilter === 'all' ? 'bg-[#003C80] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]"
              >
                Semua ({{ conversations.length }})
              </button>
              <button 
                @click="channelFilter = 'whatsapp'"
                :class="[
                  'py-1 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all',
                  channelFilter === 'whatsapp' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]"
              >
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span> WA
              </button>
              <button 
                @click="channelFilter = 'instagram'"
                :class="[
                  'py-1 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all',
                  channelFilter === 'instagram' ? 'bg-pink-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]"
              >
                <span class="w-2 h-2 rounded-full bg-pink-500"></span> IG
              </button>
              <button 
                @click="channelFilter = 'web'"
                :class="[
                  'py-1 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all',
                  channelFilter === 'web' ? 'bg-[#008FD4] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]"
              >
                <span class="w-2 h-2 rounded-full bg-[#008FD4]"></span> Web
              </button>
            </div>
          </div>

          <!-- Conversations Queue List -->
          <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
            <div 
              v-for="conv in filteredConversations" 
              :key="conv.id"
              @click="selectConversation(conv)"
              :class="[
                'p-3.5 cursor-pointer transition-all hover:bg-slate-50 relative',
                selectedConv.id === conv.id ? 'bg-sky-50/70 border-l-4 border-l-[#008FD4]' : ''
              ]"
            >
              <div class="flex items-start justify-between gap-2 mb-1">
                <div class="flex items-center gap-2">
                  <div class="relative">
                    <img :src="conv.avatar" :alt="conv.name" class="w-10 h-10 rounded-full object-cover border border-slate-200" />
                    <!-- Channel Badge Icon on Avatar -->
                    <span 
                      v-if="conv.channel === 'whatsapp'"
                      class="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white shadow-xs"
                      title="WhatsApp Channel"
                    >
                      <PhoneCall class="w-2.5 h-2.5" />
                    </span>
                    <span 
                      v-else-if="conv.channel === 'instagram'"
                      class="absolute -bottom-1 -right-1 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white p-0.5 rounded-full border-2 border-white shadow-xs"
                      title="Instagram DM"
                    >
                      <Instagram class="w-2.5 h-2.5" />
                    </span>
                    <span 
                      v-else
                      class="absolute -bottom-1 -right-1 bg-[#008FD4] text-white p-0.5 rounded-full border-2 border-white shadow-xs"
                      title="Website Chatbot"
                    >
                      <Globe class="w-2.5 h-2.5" />
                    </span>
                  </div>
                  <div>
                    <h4 class="text-xs font-bold text-slate-900 leading-tight">{{ conv.name }}</h4>
                    <p class="text-[11px] text-slate-500 font-medium">{{ conv.company }}</p>
                  </div>
                </div>
                <span class="text-[10px] text-slate-400 whitespace-nowrap">{{ conv.time }}</span>
              </div>

              <!-- Message preview -->
              <p class="text-xs text-slate-600 line-clamp-1 mb-2">
                <span v-if="conv.unread" class="font-bold text-slate-900">{{ conv.lastMessage }}</span>
                <span v-else>{{ conv.lastMessage }}</span>
              </p>

              <!-- Tags / Status Pills -->
              <div class="flex items-center justify-between text-[10px]">
                <span 
                  :class="[
                    'px-2 py-0.5 rounded font-semibold',
                    conv.status === 'Sudah Beli' ? 'bg-emerald-100 text-emerald-700' :
                    conv.status === 'Quoted' ? 'bg-purple-100 text-purple-700' :
                    conv.status === 'Follow Up' ? 'bg-amber-100 text-amber-700' :
                    'bg-sky-100 text-[#008FD4]'
                  ]"
                >
                  {{ conv.status }}
                </span>

                <div v-if="conv.hasCrossChannel" class="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  <span class="text-[9px] font-bold text-[#008FD4]">Web</span>
                  <ArrowRight class="w-2.5 h-2.5 text-slate-400" />
                  <span class="text-[9px] font-bold text-emerald-600">WA</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- COLUMN 2: ACTIVE CONVERSATION & UNIFIED TIMELINE -->
        <section class="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          <!-- Chat Header -->
          <div class="h-16 px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-3">
              <img :src="selectedConv.avatar" class="w-10 h-10 rounded-full border border-slate-200 object-cover" />
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="font-heading font-bold text-sm text-slate-900">{{ selectedConv.name }}</h3>
                  <span class="text-xs text-slate-500">({{ selectedConv.company }})</span>
                  <span 
                    :class="[
                      'text-[10px] px-2 py-0.2 rounded-full font-bold uppercase',
                      selectedConv.channel === 'whatsapp' ? 'bg-emerald-100 text-emerald-700' :
                      selectedConv.channel === 'instagram' ? 'bg-pink-100 text-pink-700' :
                      'bg-sky-100 text-[#008FD4]'
                    ]"
                  >
                    Channel Aktif: {{ selectedConv.channel }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 flex items-center gap-2">
                  <span>{{ selectedConv.phone || selectedConv.handle }}</span>
                  <span>•</span>
                  <span>PIC Sales: <strong>{{ selectedConv.salesPic }}</strong></span>
                </p>
              </div>
            </div>

            <!-- Action Toolbar -->
            <div class="flex items-center gap-2">
              <button 
                @click="triggerHandoffModal = true"
                class="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold flex items-center gap-1.5 transition-all"
              >
                <UserCheck class="w-3.5 h-3.5 text-[#008FD4]" />
                Handoff ke Sales
              </button>

              <button 
                @click="markResolved"
                class="text-xs px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1.5 transition-all"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                Selesai (Resolve)
              </button>
            </div>
          </div>

          <!-- Cross-Channel Unified Timeline Messages -->
          <div ref="chatContainer" class="flex-1 p-6 overflow-y-auto space-y-4">
            
            <!-- Notice: Unified Identity Banner -->
            <div v-if="selectedConv.hasCrossChannel" class="bg-gradient-to-r from-sky-50 via-emerald-50 to-sky-50 border border-sky-200 p-3 rounded-xl flex items-center gap-3 text-xs text-slate-700 shadow-xs">
              <div class="p-2 bg-white rounded-lg shadow-xs text-[#008FD4]">
                <GitMerge class="w-4 h-4 text-[#008FD4]" />
              </div>
              <div class="flex-1">
                <p class="font-bold text-[#003C80]">Identitas Terintegrasi (Identity Merged)</p>
                <p class="text-[11px] text-slate-600">
                  Pelanggan ini pertama kali bertanya via <strong>Website Chatbot</strong> pada 14 Nov, lalu melanjutkan percakapan di <strong>WhatsApp</strong>. Semua konteks & riwayat digabungkan otomatis.
                </p>
              </div>
              <span class="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Ref: #WEB-8821
              </span>
            </div>

            <!-- Chat Bubbles -->
            <div v-for="(msg, index) in selectedConv.messages" :key="index" class="space-y-1">
              <!-- Channel & Date Divider -->
              <div v-if="msg.isDivider" class="flex items-center gap-3 my-4">
                <div class="h-px bg-slate-200 flex-1"></div>
                <div class="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-600 shadow-xs">
                  <component :is="msg.channelIcon" class="w-3 h-3" :class="msg.channelColor" />
                  <span>{{ msg.dividerText }}</span>
                </div>
                <div class="h-px bg-slate-200 flex-1"></div>
              </div>

              <!-- Message Item -->
              <div 
                v-else
                :class="[
                  'flex gap-2.5 max-w-[80%]',
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                ]"
              >
                <!-- Avatar -->
                <div 
                  :class="[
                    'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                    msg.sender === 'user' ? 'bg-slate-200 text-slate-700' :
                    msg.sender === 'ai' ? 'bg-[#008FD4] text-white shadow-xs' :
                    'bg-[#003C80] text-white'
                  ]"
                >
                  <span v-if="msg.sender === 'user'">U</span>
                  <Sparkles v-else-if="msg.sender === 'ai'" class="w-3.5 h-3.5" />
                  <span v-else>CS</span>
                </div>

                <!-- Bubble Card -->
                <div>
                  <div 
                    :class="[
                      'p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs',
                      msg.sender === 'user' ? 'bg-[#008FD4] text-white rounded-tr-none' :
                      msg.sender === 'ai' ? 'bg-white border border-sky-100 text-slate-800 rounded-tl-none ring-1 ring-sky-200/50' :
                      'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    ]"
                  >
                    <div v-if="msg.sender === 'ai'" class="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-[#008FD4]">
                      <Sparkles class="w-3 h-3" />
                      <span>Hermes AI Assistant</span>
                    </div>

                    <div v-if="msg.sender === 'cs'" class="flex items-center gap-1.5 mb-1 text-[10px] font-bold text-[#003C80]">
                      <User class="w-3 h-3" />
                      <span>{{ msg.agentName || 'CS Agent (Andi)' }}</span>
                    </div>

                    <p class="whitespace-pre-line">{{ msg.text }}</p>

                    <!-- Product Attachment Card if AI recommend product -->
                    <div v-if="msg.productCard" class="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                      <img :src="msg.productCard.image" class="w-10 h-10 object-contain rounded bg-white p-1 border border-slate-100" />
                      <div class="flex-1 min-w-0">
                        <p class="font-bold text-[11px] text-slate-900 truncate">{{ msg.productCard.name }}</p>
                        <p class="text-[10px] text-slate-500 truncate">{{ msg.productCard.category }}</p>
                      </div>
                      <span class="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Ready Stock</span>
                    </div>
                  </div>

                  <span class="text-[10px] text-slate-400 px-1 mt-0.5 block" :class="msg.sender === 'user' ? 'text-right' : 'text-left'">
                    {{ msg.time }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Live Bot Typing Indicator if waiting -->
            <div v-if="isAiGenerating" class="flex gap-2.5 max-w-[60%] mr-auto items-center">
              <div class="w-7 h-7 rounded-full bg-[#008FD4] text-white flex items-center justify-center shrink-0">
                <Sparkles class="w-3.5 h-3.5 animate-spin" />
              </div>
              <div class="bg-white border border-sky-100 p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-[#008FD4] rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-[#008FD4] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 bg-[#008FD4] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span class="text-[11px] text-slate-500 ml-1 font-medium">Hermes AI sedang membaca katalog produk iClean...</span>
              </div>
            </div>
          </div>

          <!-- Bottom Live Chat Input Bar -->
          <div class="p-4 bg-white border-t border-slate-200">
            <!-- AI Assist Suggestion Bar -->
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center gap-1.5 text-xs text-slate-600">
                <span class="font-semibold text-slate-700">Kirim balasan sebagai:</span>
                <button 
                  @click="replyMode = 'cs'" 
                  :class="[
                    'px-2.5 py-0.5 rounded text-[11px] font-bold transition-all',
                    replyMode === 'cs' ? 'bg-[#003C80] text-white' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  Manusia (CS)
                </button>
                <button 
                  @click="replyMode = 'ai'" 
                  :class="[
                    'px-2.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 transition-all',
                    replyMode === 'ai' ? 'bg-[#008FD4] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  <Sparkles class="w-3 h-3" />
                  Hermes AI Otomatis
                </button>
              </div>

              <!-- Quick AI Assistant Action -->
              <button 
                @click="autoDraftWithAi"
                :disabled="isAiGenerating"
                class="text-xs text-[#008FD4] hover:text-[#003C80] font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles class="w-3.5 h-3.5" />
                <span>Buatkan Draf Jawaban via Hermes RAG</span>
              </button>
            </div>

            <!-- Chat Form -->
            <form @submit.prevent="sendMessage" class="flex gap-2 items-center">
              <input 
                v-model="inputMessage"
                type="text" 
                placeholder="Ketik balasan Anda ke WhatsApp klien di sini..."
                class="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#008FD4] focus:bg-white transition-all"
              />
              <button 
                type="submit"
                :disabled="!inputMessage.trim() || isAiGenerating"
                class="px-5 py-2.5 bg-[#008FD4] hover:bg-[#016EA3] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <span>Kirim</span>
                <Send class="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        <!-- COLUMN 3: CUSTOMER 360° REAL-TIME CONTEXT PANEL -->
        <aside class="w-80 md:w-92 border-l border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
          <!-- Profile Card Header -->
          <div class="p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white">
            <div class="flex items-center justify-between mb-3">
              <span class="text-[10px] uppercase font-extrabold tracking-wider text-slate-400">Customer 360° Profile</span>
              <span 
                :class="[
                  'text-[10px] px-2 py-0.5 rounded-full font-bold',
                  selectedConv.isCustomer ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                ]"
              >
                {{ selectedConv.isCustomer ? 'Pelanggan Aktif' : 'Prospek Hangat (MQL)' }}
              </span>
            </div>

            <div class="flex items-center gap-3 mb-4">
              <img :src="selectedConv.avatar" class="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs" />
              <div>
                <h4 class="font-heading font-bold text-sm text-slate-900 leading-tight">{{ selectedConv.name }}</h4>
                <p class="text-xs font-medium text-[#008FD4]">{{ selectedConv.position || 'Purchasing / Facility' }}</p>
                <p class="text-xs text-slate-500">{{ selectedConv.company }}</p>
              </div>
            </div>

            <!-- Quick Info Grid -->
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 block">Sektor Industri</span>
                <strong class="text-slate-800 font-semibold">{{ selectedConv.industry || 'Hospitality / Hotel' }}</strong>
              </div>
              <div class="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span class="text-[10px] text-slate-400 block">Wilayah / Region</span>
                <strong class="text-slate-800 font-semibold">{{ selectedConv.region || 'Jabodetabek' }}</strong>
              </div>
            </div>
          </div>

          <!-- Section: Status Pembelian & Riwayat Transaksi -->
          <div class="p-5 border-b border-slate-100">
            <h5 class="text-xs font-bold text-[#003C80] mb-3 flex items-center justify-between">
              <span>Status Pembelian & Produk</span>
              <span class="text-[10px] text-emerald-600 font-bold" v-if="selectedConv.isCustomer">
                Total: {{ selectedConv.totalSpend }}
              </span>
            </h5>

            <!-- If Already Purchased -->
            <div v-if="selectedConv.isCustomer" class="space-y-2">
              <div class="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs">
                <div class="flex items-center justify-between text-[11px] font-bold text-emerald-900 mb-1">
                  <span>Order #IC-2026-081</span>
                  <span class="text-[10px] text-emerald-600">12 Okt 2026</span>
                </div>
                <ul class="text-[11px] text-slate-600 space-y-0.5 list-disc pl-4">
                  <li>5x Kitchen Degreaser Pro (20L)</li>
                  <li>3x Dishwashing Liquid Super (20L)</li>
                </ul>
              </div>

              <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                <div class="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1">
                  <span>Order #IC-2026-044</span>
                  <span class="text-[10px] text-slate-400">28 Agt 2026</span>
                </div>
                <ul class="text-[11px] text-slate-500 space-y-0.5 list-disc pl-4">
                  <li>2x Floor Cleaner Pine Fresh (20L)</li>
                </ul>
              </div>
            </div>

            <!-- If Still In Negotiation / Quoted -->
            <div v-else class="p-3 bg-purple-50 rounded-xl border border-purple-100 text-xs text-purple-900">
              <p class="font-bold mb-1">Menunggu Keputusan PO (Penawaran #Q-994)</p>
              <p class="text-[11px] text-purple-700 leading-snug">
                Produk diminati: <strong>Kitchen Degreaser & Floor Sanitizer</strong> (Estimasi nilai: Rp 18.500.000).
              </p>
            </div>
          </div>

          <!-- Section: PIC Sales & Komunikasi Terakhir -->
          <div class="p-5 border-b border-slate-100">
            <h5 class="text-xs font-bold text-[#003C80] mb-3">PIC Sales & Log Terakhir</h5>

            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Sales Representative:</span>
                <strong class="text-slate-800">{{ selectedConv.salesPic }}</strong>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-slate-500">Kontak Terakhir:</span>
                <span class="text-slate-700 font-medium">15 Nov 2026 (WhatsApp)</span>
              </div>
              <div class="pt-2 border-t border-slate-200">
                <span class="text-[10px] font-bold text-slate-500 block mb-1">Catatan Komunikasi:</span>
                <p class="text-[11px] text-slate-700 italic bg-white p-2 rounded border border-slate-100">
                  "{{ selectedConv.lastNote }}"
                </p>
              </div>
            </div>

            <!-- Quick Add Note -->
            <button 
              @click="addQuickNote"
              class="w-full mt-3 py-1.5 border border-dashed border-slate-300 hover:border-[#008FD4] hover:text-[#008FD4] rounded-lg text-xs font-semibold text-slate-600 transition-all flex items-center justify-center gap-1"
            >
              <Plus class="w-3.5 h-3.5" />
              <span>Tambah Catatan Follow-Up</span>
            </button>
          </div>

          <!-- Section: Live Catalog References from CMS -->
          <div class="p-5">
            <h5 class="text-xs font-bold text-[#003C80] mb-3 flex items-center justify-between">
              <span>Rekomendasi Produk Terkait</span>
              <span class="text-[10px] text-slate-400">Dari CMS iClean</span>
            </h5>

            <div class="space-y-2">
              <div 
                v-for="p in relatedProducts" 
                :key="p.id"
                class="p-2 bg-slate-50 hover:bg-sky-50 rounded-lg border border-slate-100 hover:border-sky-200 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <p class="font-bold text-slate-800 text-[11px]">{{ p.name }}</p>
                  <p class="text-[10px] text-slate-500">{{ p.category }}</p>
                </div>
                <button 
                  @click="insertProductToChat(p)"
                  class="px-2 py-1 bg-white hover:bg-[#008FD4] hover:text-white border border-slate-200 rounded text-[10px] font-bold text-slate-600 transition-all"
                >
                  Sisipkan
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>

      <!-- 2. TAB: CROSS-CHANNEL JOURNEY SIMULATOR -->
      <div v-else-if="activeTab === 'simulator'" class="h-full p-8 overflow-y-auto bg-slate-50">
        <div class="max-w-5xl mx-auto space-y-8">
          <!-- Simulator Header -->
          <div class="text-center space-y-2">
            <span class="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
              Bahan Presentasi C-Level
            </span>
            <h2 class="font-heading font-extrabold text-2xl md:text-3xl text-[#003C80]">
              Bagaimana Percakapan Tetap "Nyambung" Lintas Channel?
            </h2>
            <p class="text-slate-600 text-sm max-w-2xl mx-auto">
              Simulasi interaktif bagaimana <strong>Calon Klien A (Budi Santoso)</strong> berpindah dari Website Chatbot $\rightarrow$ WhatsApp CS tanpa kehilangan riwayat percakapan dan status transaksi.
            </p>
          </div>

          <!-- Step Progression Navigator -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              @click="simStep = 1"
              :class="[
                'p-5 rounded-2xl border cursor-pointer transition-all',
                simStep === 1 ? 'bg-white border-[#008FD4] shadow-md ring-2 ring-sky-200' : 'bg-white/60 border-slate-200 hover:bg-white'
              ]"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="w-6 h-6 rounded-full bg-[#008FD4] text-white flex items-center justify-center font-bold text-xs">1</span>
                <span class="font-bold text-sm text-slate-900">Hari 1: Website Chatbot</span>
              </div>
              <p class="text-xs text-slate-500">
                Klien bertanya di web `main-iclean.shifr.asia`. Hermes AI menjawab produk dan menangkap nomor WhatsApp untuk penawaran.
              </p>
            </div>

            <div 
              @click="simStep = 2"
              :class="[
                'p-5 rounded-2xl border cursor-pointer transition-all',
                simStep === 2 ? 'bg-white border-emerald-500 shadow-md ring-2 ring-emerald-200' : 'bg-white/60 border-slate-200 hover:bg-white'
              ]"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">2</span>
                <span class="font-bold text-sm text-slate-900">Hari 3: Pindah ke WhatsApp CS</span>
              </div>
              <p class="text-xs text-slate-500">
                Klien chat nomor CS via WhatsApp. Sistem mencocokkan nomor HP / token referensi dan melakukan <strong>Auto-Merge</strong>.
              </p>
            </div>

            <div 
              @click="simStep = 3"
              :class="[
                'p-5 rounded-2xl border cursor-pointer transition-all',
                simStep === 3 ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-200' : 'bg-white/60 border-slate-200 hover:bg-white'
              ]"
            >
              <div class="flex items-center gap-2 mb-2">
                <span class="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">3</span>
                <span class="font-bold text-sm text-slate-900">Layar CS (Customer 360°)</span>
              </div>
              <p class="text-xs text-slate-500">
                CS langsung melihat riwayat webchat + data apakah sudah beli + sales PIC yang bertanggung jawab dalam 1 layar.
              </p>
            </div>
          </div>

          <!-- Step Display Card -->
          <div class="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <!-- Step 1 Display -->
            <div v-if="simStep === 1" class="space-y-6">
              <div class="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 class="font-bold text-lg text-slate-900">Langkah 1: Calon Klien Bertanya di Website iClean</h3>
                  <p class="text-xs text-slate-500">Klien masih berstatus pengunjung web anonim</p>
                </div>
                <span class="px-3 py-1 bg-sky-50 text-[#008FD4] rounded-full text-xs font-bold border border-sky-200">
                  Channel: Website Widget
                </span>
              </div>

              <div class="bg-slate-50 p-6 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-4">
                <div class="bg-[#008FD4] text-white p-3.5 rounded-2xl rounded-tr-none text-xs ml-auto max-w-[85%]">
                  "Halo, hotel kami butuh cairan pembersih kerak lemak dan lantai dapur restoran yang food grade, ada rekomendasi?"
                </div>

                <div class="bg-white text-slate-800 p-4 rounded-2xl rounded-tl-none text-xs mr-auto max-w-[90%] border border-slate-200 shadow-xs space-y-2">
                  <p class="font-bold text-[#008FD4] flex items-center gap-1.5">
                    <Sparkles class="w-3.5 h-3.5" /> Hermes AI Assistant
                  </p>
                  <p>
                    "Halo! Untuk kebutuhan dapur restoran hotel, kami sangat merekomendasikan <strong>iClean Kitchen Degreaser Pro</strong> (telah bersertifikat Halal & izin Kemenkes RI). Produk ini mampu melarutkan kerak lemak minyak tanpa merusak permukaan stainless steel."
                  </p>
                  <p class="text-slate-600 pt-1 border-t border-slate-100">
                    "Boleh kami minta <strong>Nama</strong> dan <strong>Nomor WhatsApp</strong> aktif Anda agar tim sales regional kami bisa mengirimkan katalog & penawaran khusus hotel?"
                  </p>
                </div>

                <div class="bg-[#008FD4] text-white p-3 rounded-2xl rounded-tr-none text-xs ml-auto max-w-[85%]">
                  "Saya Budi dari Hotel Grand Serpong, nomor WA saya 0812-3456-7890."
                </div>

                <div class="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl text-center text-xs font-semibold border border-emerald-200">
                  ✅ Data Tersimpan ke Database CMS: Lead Baru (Budi - Hotel Grand - WA: 081234567890)
                </div>
              </div>

              <div class="text-center pt-2">
                <button @click="simStep = 2" class="px-6 py-2.5 bg-[#003C80] text-white rounded-xl text-xs font-bold hover:bg-[#002855] transition-all">
                  Lanjut ke Langkah 2: Pindah ke WhatsApp →
                </button>
              </div>
            </div>

            <!-- Step 2 Display -->
            <div v-if="simStep === 2" class="space-y-6">
              <div class="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 class="font-bold text-lg text-slate-900">Langkah 2: Klien Menghubungi WhatsApp CS iClean</h3>
                  <p class="text-xs text-slate-500">Penyatuan identitas otomatis terjadi di background</p>
                </div>
                <span class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200">
                  Channel: WhatsApp Business
                </span>
              </div>

              <div class="bg-[#EFEAE2] p-6 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-4">
                <div class="bg-white p-3.5 rounded-xl shadow-xs text-xs max-w-[85%] ml-auto text-slate-800">
                  <p class="text-[10px] text-slate-400 mb-1">+62 812-3456-7890</p>
                  "Siang mas, saya Budi yang kemarin tanya pembersih kerak dapur di website. Penawaran harganya bisa dikirim ke sini?"
                </div>

                <!-- Behind the Scene Resolution Flow -->
                <div class="bg-white/95 p-4 rounded-xl border border-slate-300 text-xs text-slate-800 space-y-2 shadow-xs">
                  <p class="font-bold text-emerald-800 flex items-center gap-1.5">
                    <Cpu class="w-3.5 h-3.5 text-emerald-600" /> n8n & Chatwoot Identity Resolution Engine:
                  </p>
                  <div class="space-y-1 text-[11px] text-slate-600 pl-4 border-l-2 border-emerald-500">
                    <p>1. Pesan WhatsApp masuk dari pengirim: <code>+6281234567890</code></p>
                    <p>2. Query tabel <code>leads</code> CMS $\rightarrow$ Ditemukan cocok dengan ID #14 (Budi - Hotel Grand).</p>
                    <p>3. Eksekusi <code>POST /api/v1/contacts/{id}/merge</code> $\rightarrow$ Seluruh riwayat Webchat otomatis disatukan!</p>
                  </div>
                </div>

                <div class="bg-[#DCF8C6] p-3.5 rounded-xl shadow-xs text-xs max-w-[90%] mr-auto text-slate-800 space-y-1">
                  <p class="font-bold text-[#003C80] text-[11px]">CS iClean (Andi Pratama)</p>
                  <p>
                    "Selamat siang Pak Budi dari Hotel Grand Serpong! Tentu, untuk Kitchen Degreaser Pro yang kemarin didiskusikan di website, tim sales kami sudah menyiapkan penawarannya..."
                  </p>
                </div>
              </div>

              <div class="text-center pt-2">
                <button @click="simStep = 3" class="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">
                  Lanjut ke Langkah 3: Lihat Layar CS 360° →
                </button>
              </div>
            </div>

            <!-- Step 3 Display -->
            <div v-if="simStep === 3" class="space-y-6">
              <div class="flex items-center justify-between border-b pb-4">
                <div>
                  <h3 class="font-bold text-lg text-slate-900">Langkah 3: Tampilan Layar CS & Sales Saat Menerima Chat</h3>
                  <p class="text-xs text-slate-500">Semua data terintegrasi dalam satu layar tanpa perlu bertanya ulang ke klien</p>
                </div>
                <span class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-200">
                  Layar Customer 360°
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Riwayat Percakapan</p>
                  <p class="text-xs font-bold text-slate-800">Timeline Utuh (Web + WA)</p>
                  <p class="text-[11px] text-slate-600 mt-1">CS dapat membaca persis apa yang ditanyakan klien di website 2 hari lalu.</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Status Pembelian</p>
                  <p class="text-xs font-bold text-slate-800">Tahu Klien Sudah Beli / Belum</p>
                  <p class="text-[11px] text-slate-600 mt-1">Menampilkan riwayat order 12 Okt 2026 (5 pail Degreaser), sehingga CS tahu dosis pemakaian mereka.</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">PIC Sales & Catatan</p>
                  <p class="text-xs font-bold text-slate-800">Andi Pratama (Jabodetabek)</p>
                  <p class="text-[11px] text-slate-600 mt-1">Menampilkan catatan komunikasi sales terakhir: menunggu PO resmi dari direksi hotel.</p>
                </div>
              </div>

              <div class="text-center pt-2">
                <button @click="activeTab = 'inbox'" class="px-6 py-2.5 bg-[#008FD4] text-white rounded-xl text-xs font-bold hover:bg-[#016EA3] transition-all">
                  Coba Langsung di Unified Inbox Live →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. TAB: EXECUTIVE KPI & REVENUE DASHBOARD -->
      <div v-else-if="activeTab === 'analytics'" class="h-full p-8 overflow-y-auto bg-slate-50">
        <div class="max-w-6xl mx-auto space-y-8">
          <div>
            <h2 class="font-heading font-extrabold text-2xl text-[#003C80]">Executive Omnichannel Analytics</h2>
            <p class="text-xs text-slate-500">Metrik real-time kinerja integrasi layanan pelanggan dan akuisisi leads iClean</p>
          </div>

          <!-- Top 4 KPI Metrics -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-[11px] font-bold text-slate-400 block mb-1">Total Chat Masuk (Bulan Ini)</span>
              <div class="flex items-baseline justify-between">
                <strong class="text-2xl font-extrabold text-slate-900">1.842</strong>
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+18.4%</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-2">Gabungan WhatsApp, Web & IG</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-[11px] font-bold text-slate-400 block mb-1">Leads Terkualifikasi (MQL)</span>
              <div class="flex items-baseline justify-between">
                <strong class="text-2xl font-extrabold text-[#008FD4]">429</strong>
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">23.2% Rate</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-2">Tertangkap otomatis oleh AI</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-[11px] font-bold text-slate-400 block mb-1">First Response Time (FRT)</span>
              <div class="flex items-baseline justify-between">
                <strong class="text-2xl font-extrabold text-emerald-600">28 Detik</strong>
                <span class="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">AI 24/7</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-2">Turun drastis dari 4.5 jam</p>
            </div>

            <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-[11px] font-bold text-slate-400 block mb-1">Estimasi Nilai Pipeline</span>
              <div class="flex items-baseline justify-between">
                <strong class="text-2xl font-extrabold text-[#003C80]">Rp 485 Jt</strong>
                <span class="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded">34 Deals</span>
              </div>
              <p class="text-[11px] text-slate-500 mt-2">Prospek dalam tahap negosiasi</p>
            </div>
          </div>

          <!-- Channel Share & Top Inquired Products -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Channel Breakdown Card -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 class="font-heading font-bold text-sm text-slate-900">Distribusi Komunikasi per Channel</h3>
              
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-xs font-semibold mb-1">
                    <span class="flex items-center gap-1.5 text-emerald-700">
                      <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> WhatsApp Business (CS)
                    </span>
                    <span>62% (1.142 chats)</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: 62%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs font-semibold mb-1">
                    <span class="flex items-center gap-1.5 text-[#008FD4]">
                      <span class="w-2.5 h-2.5 rounded-full bg-[#008FD4]"></span> Website Chatbot Widget
                    </span>
                    <span>26% (478 chats)</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-[#008FD4] h-2 rounded-full" style="width: 26%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between text-xs font-semibold mb-1">
                    <span class="flex items-center gap-1.5 text-pink-700">
                      <span class="w-2.5 h-2.5 rounded-full bg-pink-500"></span> Instagram Direct Message
                    </span>
                    <span>12% (222 chats)</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: 12%"></div>
                  </div>
                </div>
              </div>

              <div class="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                💡 <strong>Insight C-Level:</strong> 74% calon klien baru mengawali riset produk di <strong>Website</strong>, tetapi lebih memilih menutup transaksi penawaran harga dan negosiasi melalui <strong>WhatsApp CS</strong>.
              </div>
            </div>

            <!-- Top Products Inquired -->
            <div class="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 class="font-heading font-bold text-sm text-slate-900">Top 5 Produk Paling Sering Ditanyakan (RAG Query)</h3>
              
              <div class="divide-y divide-slate-100">
                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <span class="font-extrabold text-slate-400">#1</span>
                    <div>
                      <p class="font-bold text-slate-800">Kitchen Degreaser Pro</p>
                      <p class="text-[10px] text-slate-500">Kategori: Layanan Makanan (Food Service)</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">384 Kueri</span>
                </div>

                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <span class="font-extrabold text-slate-400">#2</span>
                    <div>
                      <p class="font-bold text-slate-800">Dishwashing Liquid Super</p>
                      <p class="text-[10px] text-slate-500">Kategori: Layanan Makanan (Food Service)</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">291 Kueri</span>
                </div>

                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <span class="font-extrabold text-slate-400">#3</span>
                    <div>
                      <p class="font-bold text-slate-800">Liquid Laundry Detergent System</p>
                      <p class="text-[10px] text-slate-500">Kategori: Laundry Care</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">215 Kueri</span>
                </div>

                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <span class="font-extrabold text-slate-400">#4</span>
                    <div>
                      <p class="font-bold text-slate-800">Surface Hospital Sanitizer</p>
                      <p class="text-[10px] text-slate-500">Kategori: Hospital & Medicare</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">176 Kueri</span>
                </div>

                <div class="py-2.5 flex items-center justify-between text-xs">
                  <div class="flex items-center gap-3">
                    <span class="font-extrabold text-slate-400">#5</span>
                    <div>
                      <p class="font-bold text-slate-800">Floor Cleaner Pine Fresh</p>
                      <p class="text-[10px] text-slate-500">Kategori: Housekeeping & Public Area</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">142 Kueri</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- MODAL: HANDOFF TO SALES PIC -->
    <div v-if="triggerHandoffModal" class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-float border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="font-bold text-sm text-slate-900">Eskalasi / Handoff ke Tim Sales</h3>
          <button @click="triggerHandoffModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <p class="text-xs text-slate-600">
          Prospek dari <strong>{{ selectedConv.name }} ({{ selectedConv.company }})</strong> akan diteruskan ke Sales Representative yang bertugas di wilayahnya.
        </p>

        <div class="space-y-3 text-xs">
          <div>
            <label class="font-semibold text-slate-700 block mb-1">Pilih Sales Representative:</label>
            <select v-model="selectedSalesId" class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg">
              <option value="1">Andi Pratama - Jabodetabek & Banten</option>
              <option value="2">Bambang Wijaya - Jawa Timur & Bali</option>
              <option value="3">Citra Lestari - Jawa Barat & Jateng</option>
            </select>
          </div>

          <div>
            <label class="font-semibold text-slate-700 block mb-1">Catatan Tambahan untuk Sales:</label>
            <textarea 
              v-model="handoffNote"
              rows="3" 
              class="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg"
              placeholder="Contoh: Klien minta sampel produk 5L untuk uji coba dapur hotel..."
            ></textarea>
          </div>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button @click="triggerHandoffModal = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg">
            Batal
          </button>
          <button @click="confirmHandoff" class="px-4 py-2 bg-[#008FD4] hover:bg-[#016EA3] text-white text-xs font-bold rounded-lg flex items-center gap-1.5">
            <Check class="w-3.5 h-3.5" /> Konfirmasi Handoff
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { 
  MessageSquare, GitMerge, BarChart3, Search, PhoneCall, Instagram, Globe,
  ArrowRight, UserCheck, CheckCircle2, User, Sparkles, Send, Plus, Cpu, Check
} from 'lucide-vue-next'

const activeTab = ref('inbox')
const simStep = ref(1)
const searchQuery = ref('')
const channelFilter = ref('all')
const replyMode = ref('cs')
const inputMessage = ref('')
const isAiGenerating = ref(false)
const triggerHandoffModal = ref(false)
const selectedSalesId = ref('1')
const handoffNote = ref('Klien minta diskon 5% untuk pembelian 20 pail Degreaser.')
const chatContainer = ref(null)

const productsCount = ref(317)
const relatedProducts = ref([
  { id: 1, name: 'Kitchen Degreaser Pro', category: 'Food Service' },
  { id: 2, name: 'Dishwashing Liquid Super', category: 'Food Service' },
  { id: 3, name: 'Sanitizer Spray Surface', category: 'Housekeeping' },
  { id: 4, name: 'Floor Cleaner Pine Fresh', category: 'Public Area' },
])

// Mock conversation dataset
const conversations = ref([
  {
    id: 1,
    name: 'Budi Santoso',
    company: 'Hotel Grand Serpong',
    position: 'Purchasing & F&B Facility Manager',
    channel: 'whatsapp',
    phone: '+62 812-3456-7890',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    time: '10:45 AM',
    lastMessage: 'Mas Andi, penawaran Kitchen Degreaser kemarin bisa diskon 5% untuk 20 pail?',
    status: 'Quoted',
    isCustomer: true,
    hasCrossChannel: true,
    totalSpend: 'Rp 14.850.000',
    salesPic: 'Andi Pratama (Jabodetabek)',
    industry: 'Hospitality (Hotel 4-Star)',
    region: 'Tangerang, Banten',
    lastNote: '15 Nov 10:15 - Dikirimkan penawaran via WhatsApp. Klien minta diskon volume 5% untuk 20 pail.',
    messages: [
      {
        isDivider: true,
        dividerText: '14 Nov 2026 — Sesi Website Chatbot (#WEB-8821)',
        channelIcon: Globe,
        channelColor: 'text-[#008FD4]'
      },
      {
        sender: 'user',
        text: 'Halo, hotel kami butuh cairan pembersih kerak lemak dan lantai dapur restoran yang food grade, ada rekomendasi?',
        time: '14 Nov 14:20'
      },
      {
        sender: 'ai',
        text: 'Halo Pak Budi! Untuk dapur komersial hotel, kami sangat merekomendasikan iClean Kitchen Degreaser Pro. Produk ini bersertifikat Halal & izin Kemenkes RI, efektif melarutkan kerak lemak minyak tanpa merusak permukaan stainless steel.\n\nBoleh kami minta nama dan nomor WhatsApp aktif Anda agar tim sales regional kami bisa mengirimkan brosur & penawaran khusus?',
        time: '14 Nov 14:21',
        productCard: {
          name: 'Kitchen Degreaser Pro (20L)',
          category: 'Layanan Makanan (Food Service)',
          image: '/logo_iclean_birru.png'
        }
      },
      {
        sender: 'user',
        text: 'Saya Budi Santoso dari Hotel Grand Serpong, nomor WA saya 0812-3456-7890. Tolong kirimkan penawaran ya.',
        time: '14 Nov 14:23'
      },
      {
        isDivider: true,
        dividerText: 'Hari Ini — Sesi WhatsApp CS (+62 812-3456-7890)',
        channelIcon: PhoneCall,
        channelColor: 'text-emerald-500'
      },
      {
        sender: 'cs',
        agentName: 'Andi Pratama (Sales)',
        text: 'Selamat pagi Pak Budi dari Hotel Grand Serpong! Menindaklanjuti permintaan bapak di website kemarin, berikut kami lampirkan dokumen penawaran harga resmi untuk Kitchen Degreaser Pro (20 Pail) beserta lembar COA & izin Kemenkes.',
        time: '10:15 AM'
      },
      {
        sender: 'user',
        text: 'Pagi Mas Andi, terima kasih penawarannya sudah kami terima. Mau tanya, apakah untuk order 20 pail ini bisa ada tambahan diskon 5%?',
        time: '10:45 AM'
      }
    ]
  },
  {
    id: 2,
    name: 'Dewi Lestari',
    company: 'RSUD Medika Utama',
    position: 'Kepala Sanitasi & PPI',
    channel: 'whatsapp',
    phone: '+62 813-8899-1122',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    time: '09:30 AM',
    lastMessage: 'Mohon kirimkan COA dan MSDS untuk Desinfektan Lantai Hospital Grade',
    status: 'Lead Baru',
    isCustomer: false,
    hasCrossChannel: false,
    salesPic: 'Citra Lestari (Jateng)',
    industry: 'Healthcare / Rumah Sakit',
    region: 'Semarang, Jawa Tengah',
    lastNote: '16 Nov 09:30 - Masuk via WhatsApp Business. Meminta dokumen kepatuhan PPI.',
    messages: [
      {
        isDivider: true,
        dividerText: 'Hari Ini — WhatsApp Business',
        channelIcon: PhoneCall,
        channelColor: 'text-emerald-500'
      },
      {
        sender: 'user',
        text: 'Selamat pagi iClean, kami dari tim Sanitasi RSUD Medika Utama. Apakah produk Surface Hospital Sanitizer sudah memiliki uji efikasi mikrobiologi?',
        time: '09:25 AM'
      },
      {
        sender: 'ai',
        text: 'Selamat pagi Ibu Dewi! Benar sekali, iClean Surface Hospital Sanitizer telah lulus uji efikasi bakterisidal & virusidal standar Kemenkes RI. Sangat aman dan efektif untuk dekontaminasi ruang rawat inap dan kamar operasi.',
        time: '09:26 AM'
      },
      {
        sender: 'user',
        text: 'Mohon kirimkan COA dan MSDS untuk Desinfektan Lantai Hospital Grade tersebut ya mas.',
        time: '09:30 AM'
      }
    ]
  },
  {
    id: 3,
    name: 'Chef Michael Tan',
    company: 'Resto Dapur Nusantara',
    position: 'Executive Chef / Owner',
    channel: 'instagram',
    handle: '@chefmichael_tan',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    time: 'Kemarin',
    lastMessage: 'Halo min, cairan pembersih grill & oven yang aman food grade merk apa?',
    status: 'Follow Up',
    isCustomer: false,
    hasCrossChannel: false,
    salesPic: 'Andi Pratama (Jabodetabek)',
    industry: 'F&B / Restoran',
    region: 'Jakarta Selatan',
    lastNote: '15 Nov 16:00 - Interaksi via Instagram DM dari story mention.',
    messages: [
      {
        isDivider: true,
        dividerText: '15 Nov 2026 — Instagram Direct Message',
        channelIcon: Instagram,
        channelColor: 'text-pink-500'
      },
      {
        sender: 'user',
        text: 'Halo min, cairan pembersih kerak gosong oven dan grill yang aman food grade merk apa ya?',
        time: 'Kemarin 15:58'
      },
      {
        sender: 'ai',
        text: 'Halo Chef Michael! Untuk kerak karbon membandel pada oven dan grill komersial, kami merekomendasikan iClean Heavy Duty Carbon & Oven Cleaner. Aman untuk area F&B dan cepat melarutkan kerak lemak terbakar.',
        time: 'Kemarin 16:00'
      }
    ]
  },
  {
    id: 4,
    name: 'Siti Rahma',
    company: 'Laundry Express Cemerlang',
    position: 'Owner & Operasional',
    channel: 'whatsapp',
    phone: '+62 856-7788-9900',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    time: '12 Nov',
    lastMessage: 'Repeat order 10 pail Liquid Laundry System ke cabang Tangerang ya',
    status: 'Sudah Beli',
    isCustomer: true,
    hasCrossChannel: true,
    totalSpend: 'Rp 28.400.000',
    salesPic: 'Andi Pratama (Jabodetabek)',
    industry: 'Commercial Laundry',
    region: 'Tangerang Kota',
    lastNote: '12 Nov 11:00 - Repeat order rutin bulanan terproses.',
    messages: [
      {
        isDivider: true,
        dividerText: '12 Nov 2026 — WhatsApp Business',
        channelIcon: PhoneCall,
        channelColor: 'text-emerald-500'
      },
      {
        sender: 'user',
        text: 'Halo mas Andi, repeat order 10 pail Liquid Laundry System ke cabang Tangerang seperti biasa ya.',
        time: '12 Nov 10:55'
      },
      {
        sender: 'cs',
        agentName: 'Andi Pratama',
        text: 'Baik Bu Siti, invoice #INV-9921 sudah kami generate dan barang akan dikirim besok pagi. Terima kasih!',
        time: '12 Nov 11:00'
      }
    ]
  }
])

const selectedConv = ref(conversations.value[0])

const filteredConversations = computed(() => {
  return conversations.value.filter(c => {
    const matchChannel = channelFilter.value === 'all' || c.channel === channelFilter.value
    const matchSearch = c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                        c.company.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchChannel && matchSearch
  })
})

function selectConversation(conv) {
  selectedConv.value = conv
  scrollToBottom()
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

// Send Message logic
async function sendMessage() {
  if (!inputMessage.value.trim()) return

  const userText = inputMessage.value
  inputMessage.value = ''

  selectedConv.value.messages.push({
    sender: replyMode.value === 'ai' ? 'ai' : 'cs',
    agentName: replyMode.value === 'cs' ? 'Andi Pratama (CS)' : null,
    text: userText,
    time: 'Baru saja'
  })

  scrollToBottom()
}

// Generate automatic answer with Hermes RAG AI
async function autoDraftWithAi() {
  isAiGenerating.value = true
  scrollToBottom()

  try {
    // Try calling live RAG engine on VM3
    const response = await axios.post('https://engine-clean.shifr.asia/api/chat', {
      query: `Klien ${selectedConv.value.name} dari ${selectedConv.value.company} menanyakan diskon untuk produk Kitchen Degreaser 20 pail. Berikan respons sopan dan profesional dari tim CS iClean.`,
      top_k: 2
    }, { timeout: 4000 }).catch(() => null)

    let reply = ''
    if (response && response.data && (response.data.answer || response.data.response)) {
      reply = response.data.answer || response.data.response
    } else {
      reply = `Halo Pak Budi, terima kasih atas ketertarikan Hotel Grand Serpong. Mengenai pengajuan diskon volume 5% untuk 20 pail Kitchen Degreaser Pro, tim kami siap menyetujui dengan termin pembayaran tempo 14 hari. Surat penawaran yang telah direvisi akan segera kami kirimkan ke email & WhatsApp bapak.`
    }

    selectedConv.value.messages.push({
      sender: 'ai',
      text: reply,
      time: 'Baru saja'
    })
  } finally {
    isAiGenerating.value = false
    scrollToBottom()
  }
}

function insertProductToChat(product) {
  inputMessage.value = `Berikut adalah informasi produk ${product.name} (Kategori: ${product.category}) yang sangat sesuai dengan standar kebutuhan bapak.`
}

function addQuickNote() {
  const note = prompt('Masukkan catatan komunikasi baru:')
  if (note) {
    selectedConv.value.lastNote = `Hari ini - ${note}`
    alert('Catatan berhasil diperbarui ke database CMS iClean!')
  }
}

function markResolved() {
  selectedConv.value.status = 'Resolved'
  alert(`Percakapan ${selectedConv.value.name} ditandai selesai.`)
}

function confirmHandoff() {
  selectedConv.value.salesPic = selectedSalesId.value === '1' ? 'Andi Pratama' : selectedSalesId.value === '2' ? 'Bambang Wijaya' : 'Citra Lestari'
  selectedConv.value.lastNote = `Handoff: ${handoffNote.value}`
  triggerHandoffModal.value = false
  alert(`Prospek berhasil di-handoff ke ${selectedConv.value.salesPic}! Notifikasi dikirimkan ke Sales.`)
}

onMounted(async () => {
  scrollToBottom()
  // Fetch real products count from CMS API
  try {
    const res = await axios.get('https://cms-iclean.shifr.asia/api/products', {
      headers: {
        'x-api-key': 'etpjqfjftpflimjctqjryyhgnzfsdrdatdmcyjlcgjorsadjdxrhiuqmrrwwrolytgosmwetbcypufjyfdozkydrvvaftejdibimkhzhryzzydxejytkyfqhmoookpdf'
      },
      timeout: 3000
    })
    if (res.data && res.data.data && Array.isArray(res.data.data)) {
      productsCount.value = res.data.data.length
      if (res.data.data.length >= 4) {
        relatedProducts.value = res.data.data.slice(0, 4).map(p => ({
          id: p.id,
          name: p.name,
          category: p.category_name || 'Chemical Cleaning'
        }))
      }
    }
  } catch (err) {
    console.log('Using default products data')
  }
})
</script>
