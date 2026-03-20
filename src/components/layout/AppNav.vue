<template>
  <transition name="nav-fade">
    <nav v-if="visible" class="nav">
      <ul class="nav__list">
        <li v-for="(item, i) in displayItems" :key="i" class="nav__item">
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
        </li>
      </ul>
    </nav>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const visible = ref(false)
const garbledTriggered = ref(false)
const glitchActive = ref(false)

onMounted(() => {
  setTimeout(() => { visible.value = true }, 2000)
})

watch(() => route.path, (newPath) => {
  if (newPath === '/') {
    visible.value = false
    setTimeout(() => { visible.value = true }, 2000)
  }
})

const navItems = [
  { label: '✦ 網 站 介 紹', to: '/introduce', isEasterEgg: false },
  { label: '✦ 我 們 是 誰', to: '/alien-types', isEasterEgg: false },
  { label: 'くぁwせfふじこ', to: '/form', isEasterEgg: true },
  { label: '✦ 作 者 介 紹', to: '/authors', isEasterEgg: false },
  { label: '✦ 友 站 連 結', to: '/contact', isEasterEgg: false },
]

const garbledTexts = [
  '快點 聯絡我們',
  '我們在 等你唷',
  '快點快點快點',
  '快來跟我們玩',
  '快點快點快點',
]

const displayItems = computed(() =>
  navItems.map((item, i) => ({
    ...item,
    displayText: garbledTriggered.value ? garbledTexts[i] : item.label,
  }))
)

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
.nav__list {
  display: flex;
  list-style: none;
  gap: 6px;
  justify-content: center;
  padding: 0;
}
.nav__item { position: relative; }
.nav__link {
  display: block;
  padding: 0 24px;
  line-height: 42px;
  color: rgba(255, 255, 255, 0.6);
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 3px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: all 0.3s;
  white-space: nowrap;
}
.nav__link:hover {
  color: var(--color-primary);
  border-color: rgba(0, 255, 136, 0.3);
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.15);
}
.nav__link--garbled {
  color: var(--color-primary);
  border-color: rgba(0, 255, 136, 0.2);
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
</style>
