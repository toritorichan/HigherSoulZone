<template>
  <transition name="nav-fade">
    <nav v-if="visible" class="nav">
      <!-- Desktop: scattered over banner -->
      <div
        v-for="(item, i) in displayItems"
        :key="'d-' + i"
        class="nav__item nav__item--desktop"
        :style="positions[i]"
      >
        <router-link
          v-if="!item.isEasterEgg"
          :to="item.to"
          class="nav__link"
        >{{ item.displayText }}</router-link>
        <a
          v-else
          href="#"
          class="nav__link nav__link--garbled"
          @click.prevent="triggerGarbledEgg"
        >{{ item.displayText }}</a>
      </div>

      <!-- Mobile: bottom floating bar -->
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

// Desktop scattered positions
const positions = [
  { top: '8%', left: '2%', transform: 'rotate(-6deg)' },
  { top: '12%', right: '3%', transform: 'rotate(4deg)' },
  { top: '55%', left: '8%', transform: 'rotate(2deg)' },
  { top: '70%', right: '12%', transform: 'rotate(-3deg)' },
  { top: '38%', right: '1%', transform: 'rotate(-5deg)' },
  { top: '82%', left: '18%', transform: 'rotate(7deg)' },
]

const mobileIcons = ['✦', '◎', '◈', '⊘', '✧', '⟐']

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
  { label: '✦ 網 站 介 紹', short: '介紹', to: '/introduce', isEasterEgg: false },
  { label: '✦ 我 們 是 誰', short: '外星人', to: '/alien-types', isEasterEgg: false },
  { label: '✦ 外 星 日 誌', short: '日誌', to: '/diary', isEasterEgg: false },
  { label: 'くぁwせfふじこ', short: '?̶̡?̷̢', to: '/form', isEasterEgg: true },
  { label: '✦ 作 者 介 紹', short: '作者', to: '/authors', isEasterEgg: false },
  { label: '✦ 友 站 連 結', short: '友站', to: '/contact', isEasterEgg: false },
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
.nav-fade-enter-active { transition: opacity 1.5s ease; }
.nav-fade-enter-from { opacity: 0; }

/* ===== Desktop: scattered over banner ===== */
.nav {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
.nav__item--desktop {
  position: absolute;
  white-space: nowrap;
  pointer-events: auto;
}
.nav__link {
  display: block;
  padding: 4px 10px;
  color: rgba(255, 255, 255, 0.45);
  font-family: var(--font-display);
  font-size: 13px;
  letter-spacing: 3px;
  transition: all 0.3s;
  white-space: nowrap;
  text-decoration: none;
}
.nav__link:hover {
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.2);
}
.nav__link--garbled {
  color: rgba(255, 80, 80, 0.08);
  text-shadow: none;
  transition: color 0.2s, text-shadow 0.2s;
}
.nav__link--garbled:hover {
  color: rgba(255, 80, 80, 0.85);
  text-shadow: 0 0 8px rgba(255, 50, 50, 0.5);
}

/* Hide mobile bar on desktop */
.nav__mobile-bar { display: none; }

/* ===== Mobile: bottom floating bar ===== */
@media (max-width: 768px) {
  .nav {
    position: fixed;
    inset: auto 0 0 0;
    z-index: 9990;
    pointer-events: auto;
  }
  .nav__item--desktop { display: none; }
  .nav__mobile-bar {
    display: block;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-top: 1px solid rgba(0, 255, 136, 0.1);
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
    transition: color 0.2s;
    -webkit-tap-highlight-color: transparent;
  }
  .nav__mobile-icon {
    font-size: 18px;
    line-height: 1;
    filter: grayscale(0.3);
    transition: filter 0.2s, transform 0.2s;
  }
  .nav__mobile-label {
    font-family: var(--font-body);
    font-size: 9px;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.5px;
    white-space: nowrap;
    transition: color 0.2s;
  }
  .nav__mobile-link--active .nav__mobile-icon {
    filter: grayscale(0) drop-shadow(0 0 4px rgba(0, 255, 136, 0.5));
    transform: scale(1.15);
  }
  .nav__mobile-link--active .nav__mobile-label {
    color: var(--color-primary);
  }
  /* Easter egg link — very subtle */
  .nav__mobile-link--egg .nav__mobile-icon {
    opacity: 0.15;
  }
  .nav__mobile-link--egg .nav__mobile-label {
    color: rgba(255, 80, 80, 0.12);
  }
  .nav__mobile-link--egg:active .nav__mobile-icon {
    opacity: 0.8;
    filter: drop-shadow(0 0 6px rgba(255, 50, 50, 0.5));
  }
}
</style>
