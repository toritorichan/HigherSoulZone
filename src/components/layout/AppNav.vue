<template>
  <transition name="nav-fade">
    <nav v-if="visible" class="nav">
      <div
        v-for="(item, i) in displayItems"
        :key="i"
        class="nav__item"
        :style="positions[i]"
      >
        <router-link
          v-if="!item.isEasterEgg"
          :to="item.to"
          class="nav__link"
        >
          <span
            v-for="(char, ci) in item.displayText.split('')"
            :key="ci"
            class="nav__char"
            :style="{ animationDelay: glitchActive ? ci * 30 + 'ms' : '0ms' }"
            :class="{ 'nav__char--glitch': glitchActive }"
          >{{ char }}</span>
        </router-link>
        <a
          v-else
          href="#"
          class="nav__link nav__link--garbled"
          @click.prevent="triggerGarbledEgg"
        >
          <span
            v-for="(char, ci) in item.displayText.split('')"
            :key="ci"
            class="nav__char"
            :style="{ animationDelay: glitchActive ? ci * 30 + 'ms' : '0ms' }"
            :class="{ 'nav__char--glitch': glitchActive }"
          >{{ char }}</span>
        </a>
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

// Chaotic scattered positions overlaying the banner
const positions = [
  { top: '8%', left: '2%', transform: 'rotate(-6deg)' },
  { top: '12%', right: '3%', transform: 'rotate(4deg)' },
  { top: '55%', left: '8%', transform: 'rotate(2deg)' },
  { top: '70%', right: '12%', transform: 'rotate(-3deg)' },   // garbled link
  { top: '38%', right: '1%', transform: 'rotate(-5deg)' },
  { top: '82%', left: '18%', transform: 'rotate(7deg)' },
]

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
  { label: '✦ 網 站 介 紹', to: '/introduce', isEasterEgg: false },
  { label: '✦ 我 們 是 誰', to: '/alien-types', isEasterEgg: false },
  { label: '✦ 外 星 日 誌', to: '/diary', isEasterEgg: false },
  { label: 'くぁwせfふじこ', to: '/form', isEasterEgg: true },
  { label: '✦ 作 者 介 紹', to: '/authors', isEasterEgg: false },
  { label: '✦ 友 站 連 結', to: '/contact', isEasterEgg: false },
]

const garbledTexts = [
  '快點 聯絡我們',
  '我們在 等你唷',
  '他們在 寫日記',
  '快點快點快點',
  '快來跟我們玩',
  '快點快點快點',
]

// Garble tick — re-garble nav labels periodically
const garbleTick = ref(0)
let garbleTimer = null

onMounted(() => {
  garbleTimer = setInterval(() => { garbleTick.value++ }, 2000)
})
onUnmounted(() => { if (garbleTimer) clearInterval(garbleTimer) })

const displayItems = computed(() => {
  // touch garbleTick to trigger reactivity
  void garbleTick.value
  return navItems.map((item, i) => ({
    ...item,
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
.nav-fade-enter-active {
  transition: opacity 1.5s ease;
}
.nav-fade-enter-from {
  opacity: 0;
}
.nav {
  position: absolute;
  inset: 0;
  z-index: 10;
  pointer-events: none;
}
.nav__item {
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
}
.nav__link:hover {
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5), 0 0 20px rgba(0, 255, 136, 0.2);
}

/* Garbled link: nearly invisible until hovered at its exact spot */
.nav__link--garbled {
  color: rgba(255, 80, 80, 0.08);
  text-shadow: none;
  transition: color 0.2s, text-shadow 0.2s;
}
.nav__link--garbled:hover {
  color: rgba(255, 80, 80, 0.85);
  text-shadow: 0 0 8px rgba(255, 50, 50, 0.5);
}

.nav__char--glitch {
  display: inline-block;
  animation: charGlitch 0.4s ease forwards;
}
@keyframes charGlitch {
  0%, 30% { opacity: 0; transform: translateY(-4px); }
  60% { opacity: 0.5; }
  100% { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .nav__link {
    font-size: 10px;
    letter-spacing: 1px;
    padding: 2px 6px;
  }
}
</style>
