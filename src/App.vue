<template>
  <div class="h-screen w-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] font-sans antialiased overflow-hidden">
    
    <!-- TOP NAVIGATION HEADER -->
    <header class="h-14 sm:h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between z-20 shrink-0">
      <div class="flex items-center gap-3 sm:gap-6">
        <div class="flex items-center gap-2.5">
          <img src="/logo_iclean_birru.png" alt="iClean Logo" class="h-7 sm:h-8 object-contain" />
          <div class="flex items-center gap-1.5 sm:gap-2">
            <span class="font-heading font-extrabold text-lg sm:text-xl tracking-tight text-[#003C80]">
              iClean<span class="text-[#008FD4]">Connect</span>
            </span>
            <span class="bg-sky-100 text-[#008FD4] text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border border-sky-200 uppercase tracking-wider hidden xs:inline-block">
              Mockup
            </span>
          </div>
        </div>

        <!-- Desktop Navigation Tabs (Hidden on Mobile, moved to Bottom Nav) -->
        <nav class="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button 
            @click="activeTab = 'inbox'"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2',
              activeTab === 'inbox' ? 'bg-white text-[#003C80] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <MessageSquare class="w-4 h-4 text-[#008FD4]" />
            Unified Inbox
            <span class="bg-[#008FD4] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">4</span>
          </button>

          <button 
            @click="activeTab = 'simulator'"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2',
              activeTab === 'simulator' ? 'bg-white text-[#003C80] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <GitMerge class="w-4 h-4 text-emerald-500" />
            Journey Simulator
          </button>

          <button 
            @click="activeTab = 'analytics'"
            :class="[
              'px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-2',
              activeTab === 'analytics' ? 'bg-white text-[#003C80] shadow-xs' : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <BarChart3 class="w-4 h-4 text-purple-500" />
            Executive Dashboard
          </button>
        </nav>
      </div>

      <!-- Right System Status -->
      <div class="flex items-center gap-3">
        <!-- Live System indicators on Desktop -->
        <div class="hidden lg:flex items-center gap-2.5 text-xs">
          <div class="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg border border-emerald-200">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>CMS: <strong>{{ productsCount }} Produk</strong></span>
          </div>
          <div class="flex items-center gap-1.5 bg-sky-50 text-[#008FD4] px-2.5 py-1 rounded-lg border border-sky-200">
            <Sparkles class="w-3.5 h-3.5 text-[#008FD4]" />
            <span>Hermes RAG: <strong>Ready</strong></span>
          </div>
        </div>

        <!-- User / CS Badge -->
        <div class="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200">
          <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#008FD4] to-[#003C80] text-white flex items-center justify-center font-bold text-xs shadow-xs">
            CS
          </div>
          <div class="text-xs hidden sm:block">
            <p class="font-bold text-slate-800 leading-tight">Customer Support</p>
            <p class="text-slate-500 text-[10px]">Staging Node (VM3)</p>
          </div>
        </div>
      </div>
    </header>

    <!-- MAIN CONTENT CONTAINER (With bottom padding on mobile for Bottom Bar) -->
    <main class="flex-1 overflow-hidden pb-14 md:pb-0 relative">
      
      <!-- 1. TAB: UNIFIED INBOX VIEW (RESPONSIVE 3-COLUMN) -->
      <div v-if="activeTab === 'inbox'" class="h-full flex overflow-hidden relative">
        
        <!-- COLUMN 1: CHANNELS & CONVERSATION LIST (Full width on mobile when mobileActiveView === 'list') -->
        <section 
          :class="[
            'border-r border-slate-200 bg-white flex flex-col shrink-0 transition-all duration-200 z-10',
            'w-full md:w-80 lg:w-88',
            mobileActiveView === 'list' ? 'flex' : 'hidden md:flex'
          ]"
        >
          <!-- Channel Filter Header -->
          <div class="p-3 sm:p-3.5 border-b border-slate-100">
            <div class="relative mb-2.5">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input 
                v-model="searchQuery"
                type="text" 
                placeholder="Cari pelanggan, no. WA..."
                class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#008FD4] focus:bg-white transition-all"
              />
            </div>

            <!-- Channel Pills -->
            <div class="grid grid-cols-4 gap-1">
              <button 
                @click="channelFilter = 'all'"
                :class="[
                  'py-1 rounded-md text-[11px] font-semibold text-center transition-all',
                  channelFilter === 'all' ? 'bg-[#003C80] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]"
              >
                Semua ({{ conversations.length }})
              </button>
              <button 
                @click="channelFilter = 'whatsapp'"
                :class="[
                  'py-1 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all',
                  channelFilter === 'whatsapp' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> WA
              </button>
              <button 
                @click="channelFilter = 'instagram'"
                :class="[
                  'py-1 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all',
                  channelFilter === 'instagram' ? 'bg-pink-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-pink-500"></span> IG
              </button>
              <button 
                @click="channelFilter = 'web'"
                :class="[
                  'py-1 rounded-md text-[11px] font-semibold flex items-center justify-center gap-1 transition-all',
                  channelFilter === 'web' ? 'bg-[#008FD4] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                ]"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-[#008FD4]"></span> Web
              </button>
            </div>
          </div>

          <!-- Conversations Queue List -->
          <div class="flex-1 overflow-y-auto divide-y divide-slate-100">
            <div 
              v-for="conv in filteredConversations" 
              :key="conv.id"
              @click="openConversationMobile(conv)"
              :class="[
                'p-3.5 cursor-pointer transition-all hover:bg-slate-50 relative',
                selectedConv.id === conv.id ? 'bg-sky-50/70 border-l-4 border-l-[#008FD4]' : ''
              ]"
            >
              <div class="flex items-start justify-between gap-2 mb-1">
                <div class="flex items-center gap-2.5">
                  <div class="relative shrink-0">
                    <img :src="conv.avatar" :alt="conv.name" class="w-10 h-10 rounded-full object-cover border border-slate-200" />
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
                  <div class="min-w-0">
                    <h4 class="text-xs font-bold text-slate-900 leading-tight truncate">{{ conv.name }}</h4>
                    <p class="text-[11px] text-slate-500 font-medium truncate">{{ conv.company }}</p>
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
        <section 
          :class="[
            'flex-1 flex flex-col bg-slate-50 overflow-hidden transition-all duration-200',
            mobileActiveView === 'chat' ? 'flex' : 'hidden md:flex'
          ]"
        >
          <!-- Chat Header -->
          <div class="h-14 sm:h-16 px-3 sm:px-6 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2 sm:gap-3 min-w-0">
              <!-- Mobile Back Button to list -->
              <button 
                @click="mobileActiveView = 'list'"
                class="md:hidden p-1.5 -ml-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Kembali ke Daftar Chat"
              >
                <ArrowLeft class="w-5 h-5 text-slate-700" />
              </button>

              <img :src="selectedConv.avatar" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-slate-200 object-cover shrink-0" />
              <div class="min-w-0">
                <div class="flex items-center gap-1.5 truncate">
                  <h3 class="font-heading font-bold text-xs sm:text-sm text-slate-900 truncate">{{ selectedConv.name }}</h3>
                  <span class="text-[10px] sm:text-xs text-slate-500 truncate hidden xs:inline">({{ selectedConv.company }})</span>
                </div>
                <p class="text-[10px] sm:text-xs text-slate-500 flex items-center gap-1.5 truncate">
                  <span class="truncate">{{ selectedConv.phone || selectedConv.handle }}</span>
                  <span>•</span>
                  <span class="font-medium text-slate-700 truncate">PIC: {{ selectedConv.salesPic.split(' ')[0] }}</span>
                </p>
              </div>
            </div>

            <!-- Action Toolbar -->
            <div class="flex items-center gap-1 sm:gap-2 shrink-0">
              <!-- Customer 360 Toggle Button for Mobile / Tablet -->
              <button 
                @click="showMobileProfile = true"
                class="xl:hidden px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#008FD4] border border-sky-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                title="Lihat Profil Customer 360°"
              >
                <Info class="w-4 h-4" />
                <span class="hidden sm:inline">Profil 360°</span>
              </button>

              <button 
                @click="triggerHandoffModal = true"
                class="hidden sm:flex text-xs px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold items-center gap-1.5 transition-all"
              >
                <UserCheck class="w-3.5 h-3.5 text-[#008FD4]" />
                <span>Handoff Sales</span>
              </button>

              <button 
                @click="markResolved"
                class="text-xs px-2 sm:px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg font-semibold flex items-center gap-1 transition-all"
              >
                <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600" />
                <span class="hidden xs:inline">Selesai</span>
              </button>
            </div>
          </div>

          <!-- Cross-Channel Unified Timeline Messages -->
          <div ref="chatContainer" class="flex-1 p-3 sm:p-6 overflow-y-auto space-y-3.5">
            
            <!-- Notice: Unified Identity Banner -->
            <div v-if="selectedConv.hasCrossChannel" class="bg-gradient-to-r from-sky-50 via-emerald-50 to-sky-50 border border-sky-200 p-2.5 sm:p-3 rounded-xl flex items-start sm:items-center gap-2.5 text-xs text-slate-700 shadow-xs">
              <div class="p-1.5 bg-white rounded-lg shadow-xs text-[#008FD4] shrink-0 mt-0.5 sm:mt-0">
                <GitMerge class="w-3.5 h-3.5 text-[#008FD4]" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="font-bold text-[#003C80] text-xs">Identitas Terintegrasi (Identity Merged)</p>
                <p class="text-[10px] sm:text-[11px] text-slate-600">
                  Riwayat chat <strong>Website</strong> (14 Nov) & <strong>WhatsApp</strong> tersambung otomatis.
                </p>
              </div>
              <span class="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded shrink-0">
                #WEB-8821
              </span>
            </div>

            <!-- Chat Bubbles -->
            <div v-for="(msg, index) in selectedConv.messages" :key="index" class="space-y-1">
              <!-- Channel & Date Divider -->
              <div v-if="msg.isDivider" class="flex items-center gap-2 sm:gap-3 my-3">
                <div class="h-px bg-slate-200 flex-1"></div>
                <div class="flex items-center gap-1.5 px-2.5 py-0.5 bg-white border border-slate-200 rounded-full text-[9px] sm:text-[10px] font-bold text-slate-600 shadow-xs">
                  <component :is="msg.channelIcon" class="w-3 h-3 shrink-0" :class="msg.channelColor" />
                  <span class="truncate max-w-[220px] sm:max-w-none">{{ msg.dividerText }}</span>
                </div>
                <div class="h-px bg-slate-200 flex-1"></div>
              </div>

              <!-- Message Item -->
              <div 
                v-else
                :class="[
                  'flex gap-2 max-w-[92%] sm:max-w-[80%]',
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                ]"
              >
                <!-- Avatar -->
                <div 
                  :class="[
                    'w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold shrink-0 mt-0.5',
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
                <div class="min-w-0">
                  <div 
                    :class="[
                      'p-2.5 sm:p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs break-words',
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
                      <span>{{ msg.agentName || 'CS Agent' }}</span>
                    </div>

                    <p class="whitespace-pre-line">{{ msg.text }}</p>

                    <!-- Product Attachment Card if AI recommend product -->
                    <div v-if="msg.productCard" class="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                      <img :src="msg.productCard.image" class="w-8 h-8 object-contain rounded bg-white p-0.5 border border-slate-100 shrink-0" />
                      <div class="flex-1 min-w-0">
                        <p class="font-bold text-[11px] text-slate-900 truncate">{{ msg.productCard.name }}</p>
                        <p class="text-[10px] text-slate-500 truncate">{{ msg.productCard.category }}</p>
                      </div>
                      <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">Ready</span>
                    </div>
                  </div>

                  <span class="text-[9px] sm:text-[10px] text-slate-400 px-1 mt-0.5 block" :class="msg.sender === 'user' ? 'text-right' : 'text-left'">
                    {{ msg.time }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Live Bot Typing Indicator if waiting -->
            <div v-if="isAiGenerating" class="flex gap-2 max-w-[85%] mr-auto items-center">
              <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#008FD4] text-white flex items-center justify-center shrink-0">
                <Sparkles class="w-3.5 h-3.5 animate-spin" />
              </div>
              <div class="bg-white border border-sky-100 p-2.5 sm:p-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 bg-[#008FD4] rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-[#008FD4] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span class="w-1.5 h-1.5 bg-[#008FD4] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                <span class="text-[10px] sm:text-[11px] text-slate-500 ml-1 font-medium">Hermes AI menyusun balasan...</span>
              </div>
            </div>
          </div>

          <!-- Bottom Live Chat Input Bar -->
          <div class="p-2.5 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            <!-- AI Assist Suggestion Bar -->
            <div class="flex items-center justify-between mb-2 text-xs">
              <div class="flex items-center gap-1">
                <button 
                  @click="replyMode = 'cs'" 
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-all',
                    replyMode === 'cs' ? 'bg-[#003C80] text-white' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  Manusia (CS)
                </button>
                <button 
                  @click="replyMode = 'ai'" 
                  :class="[
                    'px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-all',
                    replyMode === 'ai' ? 'bg-[#008FD4] text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                  ]"
                >
                  <Sparkles class="w-3 h-3" />
                  Hermes AI
                </button>
              </div>

              <!-- Quick AI Assistant Action -->
              <button 
                @click="autoDraftWithAi"
                :disabled="isAiGenerating"
                class="text-[11px] sm:text-xs text-[#008FD4] hover:text-[#003C80] font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles class="w-3 h-3" />
                <span class="hidden xs:inline">Draf Jawaban RAG</span>
                <span class="xs:hidden">Draf AI</span>
              </button>
            </div>

            <!-- Chat Form -->
            <form @submit.prevent="sendMessage" class="flex gap-1.5 sm:gap-2 items-center">
              <input 
                v-model="inputMessage"
                type="text" 
                placeholder="Ketik balasan Anda..."
                class="flex-1 px-3 sm:px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#008FD4] focus:bg-white transition-all"
              />
              <button 
                type="submit"
                :disabled="!inputMessage.trim() || isAiGenerating"
                class="px-3.5 sm:px-5 py-2 bg-[#008FD4] hover:bg-[#016EA3] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
              >
                <span class="hidden xs:inline">Kirim</span>
                <Send class="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        <!-- COLUMN 3: CUSTOMER 360° PANEL (Desktop Sidebar & Mobile Drawer) -->
        <!-- Desktop Sidebar (>= xl) -->
        <aside class="w-80 lg:w-88 border-l border-slate-200 bg-white hidden xl:flex flex-col shrink-0 overflow-y-auto">
          <CustomerProfilePanel 
            :selectedConv="selectedConv" 
            :relatedProducts="relatedProducts"
            @insertProduct="insertProductToChat"
            @quickNote="addQuickNote"
          />
        </aside>

        <!-- Mobile / Tablet Slide-over Drawer (< xl) -->
        <div v-if="showMobileProfile" class="xl:hidden fixed inset-0 z-50 flex justify-end">
          <!-- Backdrop -->
          <div @click="showMobileProfile = false" class="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"></div>
          
          <!-- Drawer Content -->
          <div class="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div class="p-3.5 border-b flex items-center justify-between bg-slate-50 sticky top-0 z-20">
              <span class="font-heading font-bold text-sm text-[#003C80] flex items-center gap-1.5">
                <Info class="w-4 h-4 text-[#008FD4]" />
                Customer 360° Profile
              </span>
              <button @click="showMobileProfile = false" class="p-1 rounded-md text-slate-500 hover:bg-slate-200">
                <X class="w-5 h-5" />
              </button>
            </div>

            <CustomerProfilePanel 
              :selectedConv="selectedConv" 
              :relatedProducts="relatedProducts"
              @insertProduct="p => { insertProductToChat(p); showMobileProfile = false; }"
              @quickNote="addQuickNote"
            />
          </div>
        </div>

      </div>

      <!-- 2. TAB: CROSS-CHANNEL JOURNEY SIMULATOR -->
      <div v-else-if="activeTab === 'simulator'" class="h-full p-4 sm:p-8 overflow-y-auto bg-slate-50">
        <div class="max-w-5xl mx-auto space-y-6 sm:space-y-8">
          <div class="text-center space-y-1.5 sm:space-y-2">
            <span class="bg-emerald-100 text-emerald-800 text-[10px] sm:text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider inline-block">
              Bahan Presentasi C-Level
            </span>
            <h2 class="font-heading font-extrabold text-xl sm:text-3xl text-[#003C80]">
              Bagaimana Percakapan Tetap "Nyambung" Lintas Channel?
            </h2>
            <p class="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto">
              Simulasi interaktif bagaimana <strong>Calon Klien A (Budi Santoso)</strong> berpindah dari Website Chatbot $\rightarrow$ WhatsApp CS tanpa kehilangan riwayat percakapan dan status transaksi.
            </p>
          </div>

          <!-- Step Progression Navigator -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            <div 
              @click="simStep = 1"
              :class="[
                'p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all',
                simStep === 1 ? 'bg-white border-[#008FD4] shadow-sm ring-2 ring-sky-200' : 'bg-white/60 border-slate-200 hover:bg-white'
              ]"
            >
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-6 h-6 rounded-full bg-[#008FD4] text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <span class="font-bold text-xs sm:text-sm text-slate-900">Hari 1: Website Chatbot</span>
              </div>
              <p class="text-xs text-slate-500">
                Klien bertanya di web `main-iclean.shifr.asia`. Hermes AI menjawab produk dan menangkap nomor WhatsApp untuk penawaran.
              </p>
            </div>

            <div 
              @click="simStep = 2"
              :class="[
                'p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all',
                simStep === 2 ? 'bg-white border-emerald-500 shadow-sm ring-2 ring-emerald-200' : 'bg-white/60 border-slate-200 hover:bg-white'
              ]"
            >
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <span class="font-bold text-xs sm:text-sm text-slate-900">Hari 3: Pindah ke WhatsApp</span>
              </div>
              <p class="text-xs text-slate-500">
                Klien chat nomor CS via WhatsApp. Sistem mencocokkan nomor HP / token referensi dan melakukan <strong>Auto-Merge</strong>.
              </p>
            </div>

            <div 
              @click="simStep = 3"
              :class="[
                'p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all',
                simStep === 3 ? 'bg-white border-purple-500 shadow-sm ring-2 ring-purple-200' : 'bg-white/60 border-slate-200 hover:bg-white'
              ]"
            >
              <div class="flex items-center gap-2 mb-1.5">
                <span class="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <span class="font-bold text-xs sm:text-sm text-slate-900">Layar CS (Customer 360°)</span>
              </div>
              <p class="text-xs text-slate-500">
                CS langsung melihat riwayat webchat + data apakah sudah beli + sales PIC yang bertanggung jawab dalam 1 layar.
              </p>
            </div>
          </div>

          <!-- Step Display Card -->
          <div class="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-xs">
            <!-- Step 1 Display -->
            <div v-if="simStep === 1" class="space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3.5 gap-2">
                <div>
                  <h3 class="font-bold text-base sm:text-lg text-slate-900">Langkah 1: Calon Klien Bertanya di Website iClean</h3>
                  <p class="text-xs text-slate-500">Klien masih berstatus pengunjung web anonim</p>
                </div>
                <span class="px-3 py-1 bg-sky-50 text-[#008FD4] rounded-full text-xs font-bold border border-sky-200 self-start sm:self-auto">
                  Channel: Website Widget
                </span>
              </div>

              <div class="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-3.5">
                <div class="bg-[#008FD4] text-white p-3 rounded-2xl rounded-tr-none text-xs ml-auto max-w-[85%]">
                  "Halo, hotel kami butuh cairan pembersih kerak lemak dan lantai dapur restoran yang food grade, ada rekomendasi?"
                </div>

                <div class="bg-white text-slate-800 p-3.5 rounded-2xl rounded-tl-none text-xs mr-auto max-w-[90%] border border-slate-200 shadow-xs space-y-2">
                  <p class="font-bold text-[#008FD4] flex items-center gap-1.5">
                    <Sparkles class="w-3.5 h-3.5" /> Hermes AI Assistant
                  </p>
                  <p>
                    "Halo! Untuk dapur komersial hotel, kami sangat merekomendasikan <strong>iClean Kitchen Degreaser Pro</strong> (Halal & Kemenkes RI). Produk ini efektif melarutkan kerak lemak tanpa merusak stainless steel."
                  </p>
                  <p class="text-slate-600 pt-1 border-t border-slate-100">
                    "Boleh kami minta <strong>Nama</strong> dan <strong>Nomor WhatsApp</strong> aktif Anda agar tim sales kami bisa mengirimkan penawaran khusus?"
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
                <button @click="simStep = 2" class="w-full sm:w-auto px-6 py-2.5 bg-[#003C80] text-white rounded-xl text-xs font-bold hover:bg-[#002855] transition-all">
                  Lanjut ke Langkah 2: Pindah ke WhatsApp →
                </button>
              </div>
            </div>

            <!-- Step 2 Display -->
            <div v-if="simStep === 2" class="space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3.5 gap-2">
                <div>
                  <h3 class="font-bold text-base sm:text-lg text-slate-900">Langkah 2: Klien Menghubungi WhatsApp CS iClean</h3>
                  <p class="text-xs text-slate-500">Penyatuan identitas otomatis terjadi di background</p>
                </div>
                <span class="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200 self-start sm:self-auto">
                  Channel: WhatsApp Business
                </span>
              </div>

              <div class="bg-[#EFEAE2] p-4 sm:p-6 rounded-2xl border border-slate-200 max-w-xl mx-auto space-y-3.5">
                <div class="bg-white p-3 rounded-xl shadow-xs text-xs max-w-[85%] ml-auto text-slate-800">
                  <p class="text-[10px] text-slate-400 mb-0.5">+62 812-3456-7890</p>
                  "Siang mas, saya Budi yang kemarin tanya pembersih kerak dapur di website. Penawaran harganya bisa dikirim ke sini?"
                </div>

                <div class="bg-white/95 p-3.5 rounded-xl border border-slate-300 text-xs text-slate-800 space-y-1.5 shadow-xs">
                  <p class="font-bold text-emerald-800 flex items-center gap-1.5">
                    <Cpu class="w-3.5 h-3.5 text-emerald-600" /> n8n & Chatwoot Identity Resolution Engine:
                  </p>
                  <div class="space-y-1 text-[11px] text-slate-600 pl-3 border-l-2 border-emerald-500">
                    <p>1. Nomor pengirim: <code>+6281234567890</code></p>
                    <p>2. Cocok dengan Lead ID #14 di database CMS.</p>
                    <p>3. Auto-Merge: Riwayat Webchat disatukan ke kontak WA!</p>
                  </div>
                </div>

                <div class="bg-[#DCF8C6] p-3 rounded-xl shadow-xs text-xs max-w-[90%] mr-auto text-slate-800 space-y-1">
                  <p class="font-bold text-[#003C80] text-[11px]">CS iClean (Andi Pratama)</p>
                  <p>
                    "Selamat siang Pak Budi dari Hotel Grand Serpong! Untuk Kitchen Degreaser Pro yang kemarin didiskusikan di website, tim sales kami sudah menyiapkan penawarannya..."
                  </p>
                </div>
              </div>

              <div class="text-center pt-2">
                <button @click="simStep = 3" class="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all">
                  Lanjut ke Langkah 3: Lihat Layar CS 360° →
                </button>
              </div>
            </div>

            <!-- Step 3 Display -->
            <div v-if="simStep === 3" class="space-y-5">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3.5 gap-2">
                <div>
                  <h3 class="font-bold text-base sm:text-lg text-slate-900">Langkah 3: Tampilan Layar CS & Sales Saat Menerima Chat</h3>
                  <p class="text-xs text-slate-500">Semua data terintegrasi dalam satu layar</p>
                </div>
                <span class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-bold border border-purple-200 self-start sm:self-auto">
                  Layar Customer 360°
                </span>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Riwayat Percakapan</p>
                  <p class="text-xs font-bold text-slate-800">Timeline Utuh (Web + WA)</p>
                  <p class="text-[11px] text-slate-600 mt-1">CS dapat membaca persis apa yang ditanyakan klien di website sebelumnya.</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-1.5">Status Pembelian</p>
                  <p class="text-xs font-bold text-slate-800">Tahu Klien Sudah Beli / Belum</p>
                  <p class="text-[11px] text-slate-600 mt-1">Menampilkan riwayat order 12 Okt 2026 (5 pail Degreaser), sehingga CS paham riwayat produk mereka.</p>
                </div>
                <div class="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p class="text-[10px] font-bold text-slate-400 uppercase mb-1.5">PIC Sales & Catatan</p>
                  <p class="text-xs font-bold text-slate-800">Andi Pratama (Jabodetabek)</p>
                  <p class="text-[11px] text-slate-600 mt-1">Menampilkan catatan komunikasi sales terakhir: menunggu PO resmi dari direksi hotel.</p>
                </div>
              </div>

              <div class="text-center pt-2">
                <button @click="activeTab = 'inbox'; mobileActiveView = 'chat'" class="w-full sm:w-auto px-6 py-2.5 bg-[#008FD4] text-white rounded-xl text-xs font-bold hover:bg-[#016EA3] transition-all">
                  Coba Langsung di Unified Inbox Live →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. TAB: EXECUTIVE KPI & REVENUE DASHBOARD -->
      <div v-else-if="activeTab === 'analytics'" class="h-full p-4 sm:p-8 overflow-y-auto bg-slate-50">
        <div class="max-w-6xl mx-auto space-y-6 sm:space-y-8">
          <div>
            <h2 class="font-heading font-extrabold text-xl sm:text-2xl text-[#003C80]">Executive Omnichannel Analytics</h2>
            <p class="text-xs text-slate-500">Metrik real-time kinerja integrasi layanan pelanggan dan akuisisi leads iClean</p>
          </div>

          <!-- Top 4 KPI Metrics -->
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 block mb-1">Total Chat Masuk</span>
              <div class="flex items-baseline justify-between">
                <strong class="text-xl sm:text-2xl font-extrabold text-slate-900">1.842</strong>
                <span class="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">+18%</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">WhatsApp, Web & IG</p>
            </div>

            <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 block mb-1">Leads (MQL)</span>
              <div class="flex items-baseline justify-between">
                <strong class="text-xl sm:text-2xl font-extrabold text-[#008FD4]">429</strong>
                <span class="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">23.2%</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">Tertangkap via AI</p>
            </div>

            <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 block mb-1">First Response Time</span>
              <div class="flex items-baseline justify-between">
                <strong class="text-xl sm:text-2xl font-extrabold text-emerald-600">28 Detik</strong>
                <span class="text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">AI 24/7</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">Respon instan</p>
            </div>

            <div class="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs">
              <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 block mb-1">Pipeline Deals</span>
              <div class="flex items-baseline justify-between">
                <strong class="text-xl sm:text-2xl font-extrabold text-[#003C80]">Rp 485 Jt</strong>
                <span class="text-[10px] sm:text-xs font-bold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded">34 Deals</span>
              </div>
              <p class="text-[10px] text-slate-500 mt-1.5">Tahap negosiasi</p>
            </div>
          </div>

          <!-- Channel Share & Top Inquired Products -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <!-- Channel Breakdown Card -->
            <div class="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
              <h3 class="font-heading font-bold text-sm text-slate-900">Distribusi Komunikasi per Channel</h3>
              
              <div class="space-y-3 text-xs">
                <div>
                  <div class="flex justify-between font-semibold mb-1">
                    <span class="flex items-center gap-1.5 text-emerald-700">
                      <span class="w-2 h-2 rounded-full bg-emerald-500"></span> WhatsApp Business (CS)
                    </span>
                    <span>62% (1.142 chats)</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-emerald-500 h-2 rounded-full" style="width: 62%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between font-semibold mb-1">
                    <span class="flex items-center gap-1.5 text-[#008FD4]">
                      <span class="w-2 h-2 rounded-full bg-[#008FD4]"></span> Website Chatbot Widget
                    </span>
                    <span>26% (478 chats)</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-[#008FD4] h-2 rounded-full" style="width: 26%"></div>
                  </div>
                </div>

                <div>
                  <div class="flex justify-between font-semibold mb-1">
                    <span class="flex items-center gap-1.5 text-pink-700">
                      <span class="w-2 h-2 rounded-full bg-pink-500"></span> Instagram Direct Message
                    </span>
                    <span>12% (222 chats)</span>
                  </div>
                  <div class="w-full bg-slate-100 rounded-full h-2">
                    <div class="bg-pink-500 h-2 rounded-full" style="width: 12%"></div>
                  </div>
                </div>
              </div>

              <div class="p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] sm:text-xs text-slate-600">
                💡 <strong>Insight C-Level:</strong> 74% calon klien mengawali riset di <strong>Website</strong>, tetapi konversi negosiasi terjadi di <strong>WhatsApp CS</strong>.
              </div>
            </div>

            <!-- Top Products Inquired -->
            <div class="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
              <h3 class="font-heading font-bold text-sm text-slate-900">Top 5 Produk Paling Sering Ditanyakan (RAG Query)</h3>
              
              <div class="divide-y divide-slate-100 text-xs">
                <div class="py-2 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="font-extrabold text-slate-400 text-xs">#1</span>
                    <div>
                      <p class="font-bold text-slate-800 text-[11px]">Kitchen Degreaser Pro</p>
                      <p class="text-[10px] text-slate-500">Layanan Makanan (Food Service)</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">384 Kueri</span>
                </div>

                <div class="py-2 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="font-extrabold text-slate-400 text-xs">#2</span>
                    <div>
                      <p class="font-bold text-slate-800 text-[11px]">Dishwashing Liquid Super</p>
                      <p class="text-[10px] text-slate-500">Layanan Makanan (Food Service)</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">291 Kueri</span>
                </div>

                <div class="py-2 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="font-extrabold text-slate-400 text-xs">#3</span>
                    <div>
                      <p class="font-bold text-slate-800 text-[11px]">Liquid Laundry Detergent</p>
                      <p class="text-[10px] text-slate-500">Laundry Care</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">215 Kueri</span>
                </div>

                <div class="py-2 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="font-extrabold text-slate-400 text-xs">#4</span>
                    <div>
                      <p class="font-bold text-slate-800 text-[11px]">Surface Hospital Sanitizer</p>
                      <p class="text-[10px] text-slate-500">Hospital & Medicare</p>
                    </div>
                  </div>
                  <span class="font-bold text-[#003C80]">176 Kueri</span>
                </div>

                <div class="py-2 flex items-center justify-between">
                  <div class="flex items-center gap-2.5">
                    <span class="font-extrabold text-slate-400 text-xs">#5</span>
                    <div>
                      <p class="font-bold text-slate-800 text-[11px]">Floor Cleaner Pine Fresh</p>
                      <p class="text-[10px] text-slate-500">Housekeeping & Public Area</p>
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

    <!-- MOBILE BOTTOM NAVIGATION BAR -->
    <nav class="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-white border-t border-slate-200 z-30 flex items-center justify-around px-2">
      <button 
        @click="activeTab = 'inbox'; mobileActiveView = 'list'"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-1 transition-all',
          activeTab === 'inbox' ? 'text-[#008FD4] font-bold' : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <div class="relative">
          <MessageSquare class="w-4 h-4" />
          <span class="absolute -top-1 -right-2 bg-[#008FD4] text-white text-[8px] font-bold px-1 rounded-full">4</span>
        </div>
        <span class="text-[10px] mt-0.5">Inbox</span>
      </button>

      <button 
        @click="activeTab = 'simulator'"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-1 transition-all',
          activeTab === 'simulator' ? 'text-emerald-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <GitMerge class="w-4 h-4" />
        <span class="text-[10px] mt-0.5">Simulator</span>
      </button>

      <button 
        @click="activeTab = 'analytics'"
        :class="[
          'flex flex-col items-center justify-center flex-1 py-1 transition-all',
          activeTab === 'analytics' ? 'text-purple-600 font-bold' : 'text-slate-500 hover:text-slate-800'
        ]"
      >
        <BarChart3 class="w-4 h-4" />
        <span class="text-[10px] mt-0.5">Executive</span>
      </button>
    </nav>

    <!-- MODAL: HANDOFF TO SALES PIC -->
    <div v-if="triggerHandoffModal" class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 space-y-4">
        <div class="flex items-center justify-between border-b pb-3">
          <h3 class="font-bold text-sm text-slate-900">Eskalasi / Handoff ke Tim Sales</h3>
          <button @click="triggerHandoffModal = false" class="text-slate-400 hover:text-slate-600">✕</button>
        </div>

        <p class="text-xs text-slate-600">
          Prospek dari <strong>{{ selectedConv.name }} ({{ selectedConv.company }})</strong> akan diteruskan ke Sales Representative.
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
            <Check class="w-3.5 h-3.5" /> Konfirmasi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, defineComponent, h } from 'vue'
import axios from 'axios'
import { 
  MessageSquare, GitMerge, BarChart3, Search, PhoneCall, Instagram, Globe,
  ArrowRight, ArrowLeft, UserCheck, CheckCircle2, User, Sparkles, Send, Plus, Cpu, Check, Info, X
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

// Mobile Responsiveness State
const mobileActiveView = ref('list') // 'list' | 'chat'
const showMobileProfile = ref(false)

const productsCount = ref(317)
const relatedProducts = ref([
  { id: 1, name: 'Kitchen Degreaser Pro', category: 'Food Service' },
  { id: 2, name: 'Dishwashing Liquid Super', category: 'Food Service' },
  { id: 3, name: 'Sanitizer Spray Surface', category: 'Housekeeping' },
  { id: 4, name: 'Floor Cleaner Pine Fresh', category: 'Public Area' },
])

// Reusable Customer 360 Component
const CustomerProfilePanel = defineComponent({
  props: ['selectedConv', 'relatedProducts'],
  emits: ['insertProduct', 'quickNote'],
  setup(props, { emit }) {
    return () => h('div', { class: 'divide-y divide-slate-100 text-xs' }, [
      // 1. Header Profile
      h('div', { class: 'p-4 bg-gradient-to-b from-slate-50 to-white' }, [
        h('div', { class: 'flex items-center justify-between mb-2.5' }, [
          h('span', { class: 'text-[10px] uppercase font-extrabold tracking-wider text-slate-400' }, 'Customer 360° Profile'),
          h('span', { 
            class: [
              'text-[10px] px-2 py-0.5 rounded-full font-bold',
              props.selectedConv.isCustomer ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
            ]
          }, props.selectedConv.isCustomer ? 'Pelanggan Aktif' : 'Prospek Hangat')
        ]),
        h('div', { class: 'flex items-center gap-3 mb-3' }, [
          h('img', { src: props.selectedConv.avatar, class: 'w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0' }),
          h('div', { class: 'min-w-0' }, [
            h('h4', { class: 'font-heading font-bold text-sm text-slate-900 leading-tight truncate' }, props.selectedConv.name),
            h('p', { class: 'text-[11px] font-medium text-[#008FD4] truncate' }, props.selectedConv.position || 'Purchasing / Facility'),
            h('p', { class: 'text-[11px] text-slate-500 truncate' }, props.selectedConv.company)
          ])
        ]),
        h('div', { class: 'grid grid-cols-2 gap-2 text-xs' }, [
          h('div', { class: 'bg-slate-50 p-2 rounded-lg border border-slate-100' }, [
            h('span', { class: 'text-[9px] text-slate-400 block' }, 'Sektor Industri'),
            h('strong', { class: 'text-slate-800 text-[11px]' }, props.selectedConv.industry || 'Hospitality')
          ]),
          h('div', { class: 'bg-slate-50 p-2 rounded-lg border border-slate-100' }, [
            h('span', { class: 'text-[9px] text-slate-400 block' }, 'Region'),
            h('strong', { class: 'text-slate-800 text-[11px]' }, props.selectedConv.region || 'Jabodetabek')
          ])
        ])
      ]),

      // 2. Status Pembelian
      h('div', { class: 'p-4' }, [
        h('div', { class: 'flex items-center justify-between mb-2.5' }, [
          h('h5', { class: 'text-xs font-bold text-[#003C80]' }, 'Status Pembelian & Produk'),
          props.selectedConv.isCustomer ? h('span', { class: 'text-[10px] text-emerald-600 font-bold' }, props.selectedConv.totalSpend) : null
        ]),
        props.selectedConv.isCustomer ? h('div', { class: 'space-y-2' }, [
          h('div', { class: 'p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100' }, [
            h('div', { class: 'flex items-center justify-between text-[10px] font-bold text-emerald-900 mb-1' }, [
              h('span', 'Order #IC-2026-081'),
              h('span', { class: 'text-emerald-600' }, '12 Okt 2026')
            ]),
            h('ul', { class: 'text-[10px] text-slate-600 space-y-0.5 list-disc pl-4' }, [
              h('li', '5x Kitchen Degreaser Pro (20L)'),
              h('li', '3x Dishwashing Liquid Super (20L)')
            ])
          ]),
          h('div', { class: 'p-2.5 bg-slate-50 rounded-xl border border-slate-100' }, [
            h('div', { class: 'flex items-center justify-between text-[10px] font-bold text-slate-700 mb-1' }, [
              h('span', 'Order #IC-2026-044'),
              h('span', { class: 'text-slate-400' }, '28 Agt 2026')
            ]),
            h('ul', { class: 'text-[10px] text-slate-500 space-y-0.5 list-disc pl-4' }, [
              h('li', '2x Floor Cleaner Pine Fresh (20L)')
            ])
          ])
        ]) : h('div', { class: 'p-2.5 bg-purple-50 rounded-xl border border-purple-100' }, [
          h('p', { class: 'font-bold text-purple-900 text-[11px] mb-1' }, 'Menunggu Keputusan PO (#Q-994)'),
          h('p', { class: 'text-[10px] text-purple-700' }, 'Kitchen Degreaser & Floor Sanitizer (~Rp 18.5 Jt)')
        ])
      ]),

      // 3. PIC Sales & Log
      h('div', { class: 'p-4' }, [
        h('h5', { class: 'text-xs font-bold text-[#003C80] mb-2' }, 'PIC Sales & Log Terakhir'),
        h('div', { class: 'p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5' }, [
          h('div', { class: 'flex justify-between' }, [
            h('span', { class: 'text-slate-500 text-[10px]' }, 'Sales Rep:'),
            h('strong', { class: 'text-slate-800 text-[10px]' }, props.selectedConv.salesPic)
          ]),
          h('div', { class: 'flex justify-between' }, [
            h('span', { class: 'text-slate-500 text-[10px]' }, 'Kontak Terakhir:'),
            h('span', { class: 'text-slate-700 font-medium text-[10px]' }, '15 Nov 2026 (WhatsApp)')
          ]),
          h('div', { class: 'pt-1.5 border-t border-slate-200' }, [
            h('p', { class: 'text-[10px] text-slate-700 italic bg-white p-2 rounded border border-slate-100' }, `"${props.selectedConv.lastNote}"`)
          ])
        ]),
        h('button', { 
          onClick: () => emit('quickNote'),
          class: 'w-full mt-2.5 py-1.5 border border-dashed border-slate-300 hover:border-[#008FD4] hover:text-[#008FD4] rounded-lg text-[11px] font-semibold text-slate-600 transition-all flex items-center justify-center gap-1'
        }, [
          h(Plus, { class: 'w-3 h-3' }),
          h('span', 'Tambah Catatan Follow-Up')
        ])
      ]),

      // 4. Rekomendasi Produk Terkait
      h('div', { class: 'p-4' }, [
        h('h5', { class: 'text-xs font-bold text-[#003C80] mb-2 flex justify-between' }, [
          h('span', 'Katalog Produk Terkait'),
          h('span', { class: 'text-[9px] text-slate-400 font-normal' }, 'Dari CMS')
        ]),
        h('div', { class: 'space-y-1.5' }, props.relatedProducts.map(p => 
          h('div', { class: 'p-2 bg-slate-50 hover:bg-sky-50 rounded-lg border border-slate-100 hover:border-sky-200 flex items-center justify-between text-xs transition-all' }, [
            h('div', { class: 'min-w-0 pr-2' }, [
              h('p', { class: 'font-bold text-slate-800 text-[10px] truncate' }, p.name),
              h('p', { class: 'text-[9px] text-slate-500 truncate' }, p.category)
            ]),
            h('button', { 
              onClick: () => emit('insertProduct', p),
              class: 'px-2 py-0.5 bg-white hover:bg-[#008FD4] hover:text-white border border-slate-200 rounded text-[9px] font-bold text-slate-600 shrink-0 transition-all'
            }, 'Sisipkan')
          ])
        ))
      ])
    ])
  }
})

// Mock conversation dataset
const conversations = ref([
  {
    id: 1,
    name: 'Budi Santoso',
    company: 'Hotel Grand Serpong',
    position: 'Purchasing & F&B Manager',
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
        text: 'Halo Pak Budi! Untuk dapur komersial hotel, kami sangat merekomendasikan iClean Kitchen Degreaser Pro (bersertifikat Halal & Kemenkes RI). Produk ini efektif melarutkan kerak lemak minyak tanpa merusak permukaan stainless steel.\n\nBoleh kami minta nama dan nomor WhatsApp aktif Anda agar tim sales regional kami bisa mengirimkan brosur & penawaran khusus?',
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
    region: 'Semarang, Jateng',
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
    position: 'Executive Chef',
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

function openConversationMobile(conv) {
  selectedConv.value = conv
  mobileActiveView.value = 'chat'
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
