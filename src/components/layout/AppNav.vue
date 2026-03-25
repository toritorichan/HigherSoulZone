<template>
  <transition name="nav-fade">
    <nav v-if="visible" class="nav">
      <!-- Desktop: file explorer listing -->
      <div class="nav__file-list">
        <div class="nav__file-header">C:\HIGHER_SOUL_ZONE\</div>
        <div
          v-for="(item, i) in displayItems"
          :key="'d-' + i"
          class="nav__file-entry"
        >
          <router-link
            v-if="!item.isEasterEgg"
            :to="item.to"
            class="nav__file-link"
          ><span class="nav__file-icon">▸</span> {{ item.displayText }}</router-link>
          <a
            v-else
            href="#"
            class="nav__file-link nav__file-link--garbled"
            @click.prevent="triggerGarbledEgg"
          ><span class="nav__file-icon">▸</span> {{ item.displayText }}</a>
        </div>
      </div>

      <!-- Mobile: bottom bar -->
      <div class="nav__mobile-bar">
        <div class="nav__mobile-scroll">
          <template v-for="(item, i) in displayItems" :key="'m-' + i">
            <router-link
              v-if="!item.isEasterEgg"
              :to="item.to"
              class="nav__mobile-link"
              active-class="nav__mobile-link--active"
            >
              <span class="nav__mobile-icon">{{ mobileIcons[i] }}</span>
              <span class="nav__mobile-label">{{ item.shortLabel }}</span>
            </router-link>
            <a
              v-else
              href="#"
              class="nav__mobile-link nav__mobile-link--egg"
              @click.prevent="triggerGarbledEgg"
            >
              <span class="nav__mobile-icon">{{ mobileIcons[i] }}</span>
              <span class="nav__mobile-label">{{ item.shortLabel }}</span>
            </a>
          </template>
        </div>
      </div>
    </nav>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { garble } from '../../utils/garble.js'

const router = useRouter()
const route = useRoute()

const visible = ref(false)
const garbledTriggered = ref(false)
const glitchActive = ref(false)

// Desktop scattered positions (kept for reference but no longer used in template)
const positions = [
  { top: '8%', left: '2%', transform: 'rotate(-6deg)' },
  { top: '12%', right: '3%', transform: 'rotate(4deg)' },
  { top: '55%', left: '8%', transform: 'rotate(2deg)' },
  { top: '70%', right: '12%', transform: 'rotate(-3deg)' },
  { top: '38%', right: '1%', transform: 'rotate(-5deg)' },
  { top: '82%', left: '18%', transform: 'rotate(7deg)' },
]

const mobileIcons = ['▸', '◎', '◈', '⊘', '✧', '⟐']

onMounted(() => {
  setTimeout(() => { visible.value = true }, 2000)
})

watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    garbledTriggered.value = false
    glitchActive.value = false
    visible.value = false
    setTimeout(() => { visible.value = true }, 2000)
  }
})

const navItems = [
  { label: '▸ 介紹.sys', short: '介紹', to: '/introduce', isEasterEgg: false },
  { label: '▸ 外星人.dat', short: '外星人', to: '/alien-types', isEasterEgg: false },
  { label: '▸ 日誌.log', short: '日誌', to: '/diary', isEasterEgg: false },
  { label: '▸ ???.exe', short: '?̶̡?̷̢', to: '/form', isEasterEgg: true },
  { label: '▸ 作者.txt', short: '作者', to: '/authors', isEasterEgg: false },
  { label: '▸ 友站.lnk', short: '友站', to: '/contact', isEasterEgg: false },
]

const garbledTexts = [
  '快點 聯絡我們', '我們在 等你唷', '他們在 寫日記',
  '快點快點快點', '快來跟我們玩', '快點快點快點',
]

// Re-garble periodically
const garbleTick = ref(0)
let garbleTimer = null
onMounted(() => { garbleTimer = setInterval(() => { garbleTick.value++ }, 2000) })
onUnmounted(() => { if (garbleTimer) clearInterval(garbleTimer) })

const displayItems = computed(() => {
  void garbleTick.value
  return navItems.map((item, i) => ({
    ...item,
    shortLabel: garbledTriggered.value
      ? garble(garbledTexts[i].slice(0, 3), 0.5)
      : item.isEasterEgg ? garble(item.short, 0.6) : item.short,
    displayText: garbledTriggered.value
      ? garble(garbledTexts[i], 0.4)
      : garble(item.label, 0.25),
  }))
})

function triggerGarbledEgg() {
  glitchActive.value = true
  setTimeout(() => {
    garbledTriggered.value = true
    setTimeout(() => { glitchActive.value = false }, 500)
  }, 400)
  setTimeout(() => { router.push('/dead') }, 800)
}
</script>

<style scoped>

/* ===== Desktop: file explorer listing ===== */
.nav {
  position: relative;
  z-index: 10;
  pointer-events: none;
}

.nav__file-list {
  pointer-events: auto;
  padding: 8px 0;
  border: 1px solid rgba(136, 204, 136, 0.1);
  background: rgba(0, 0, 0, 0.3);
  margin-top: 4px;
}

.nav__file-header {
  font-family: var(--font-system, monospace);
  font-size: 11px;
  color: rgba(136, 204, 136, 0.3);
  padding: 2px 12px 6px;
  border-bottom: 1px solid rgba(136, 204, 136, 0.08);
  margin-bottom: 4px;
  letter-spacing: 1px;
}

.nav__file-entry {
  white-space: nowrap;
}

.nav__file-icon {
  color: var(--color-primary);
  opacity: 0.6;
}

.nav__file-link {
  display: block;
  padding: 4px 12px;
  color: rgba(136, 204, 136, 0.55);
  font-family: var(--font-system, monospace);
  font-size: 14px;
  letter-spacing: 2px;
  white-space: nowrap;
  text-decoration: none;
}

.nav__file-link:hover {
  color: var(--color-primary);
  background: rgba(136, 204, 136, 0.05);
}

.nav__file-link--garbled {
  color: rgba(204, 0, 0, 0.08);
}

.nav__file-link--garbled:hover {
  color: rgba(204, 0, 0, 0.7);
  background: rgba(204, 0, 0, 0.03);
}

/* Hide mobile bar on desktop */
.nav__mobile-bar { display: none; }

/* ===== Mobile: bottom bar ===== */
@media (max-width: 768px) {
  .nav {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 9990;
    pointer-events: auto;
  }
  .nav__file-list { display: none; }
  .nav__mobile-bar {
    display: block;
    background: rgba(5, 5, 10, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid rgba(136, 204, 136, 0.15);
    padding: 6px 0;
    padding-bottom: max(6px, env(safe-area-inset-bottom));
  }
  .nav__mobile-scroll {
    display: flex;
    justify-content: space-around;
    align-items: center;
    max-width: 100%;
    padding: 0 4px;
  }
  .nav__mobile-link {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    padding: 6px 4px;
    min-width: 50px;
    text-decoration: none;
    -webkit-tap-highlight-color: transparent;
  }
  .nav__mobile-icon {
    font-size: 18px;
    line-height: 1;
    color: rgba(136, 204, 136, 0.4);
    font-family: var(--font-system, monospace);
  }
  .nav__mobile-label {
    font-family: var(--font-body, monospace);
    font-size: 9px;
    color: rgba(136, 204, 136, 0.35);
    letter-spacing: 0.5px;
    white-space: nowrap;
  }
  .nav__mobile-link--active .nav__mobile-icon {
    color: var(--color-primary);
    transform: scale(1.15);
  }
  .nav__mobile-link--active .nav__mobile-label {
    color: var(--color-primary);
  }
  /* Easter egg link — very subtle */
  .nav__mobile-link--egg .nav__mobile-icon {
    opacity: 0.15;
    color: rgba(204, 0, 0, 0.3);
  }
  .nav__mobile-link--egg .nav__mobile-label {
    color: rgba(204, 0, 0, 0.1);
  }
  .nav__mobile-link--egg:active .nav__mobile-icon {
    opacity: 0.8;
  }
}
</style>
