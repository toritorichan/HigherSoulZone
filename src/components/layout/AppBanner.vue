<template>
  <header class="banner" :class="{ 'banner--hidden': hiddenOnMobile }">
    <img
      :src="`${base}media/logo.png`"
      alt="Higher Soul Zone"
      class="banner__logo"
      :class="{ 'banner__logo--spinning': spinning }"
      @click="onLogoClick"
    />
    <transition name="banner-msg">
      <div v-if="secretMessage" class="banner__secret">{{ secretMessage }}</div>
    </transition>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { garble } from '../../utils/garble.js'

const base = import.meta.env.BASE_URL

const clickCount = ref(0)
const spinning = ref(false)
const secretMessage = ref('')
const hiddenOnMobile = ref(false)
const TARGET_CLICKS = 7

let resetTimer = null
let hideTimer = null

function onLogoClick() {
  clearTimeout(resetTimer)
  clickCount.value = clickCount.value + 1

  if (clickCount.value >= TARGET_CLICKS) {
    triggerSecret()
    clickCount.value = 0
    return
  }
  resetTimer = setTimeout(() => { clickCount.value = 0 }, 3000)
}

function triggerSecret() {
  spinning.value = true
  secretMessage.value = garble('第七維度已解鎖', 0.5)
  setTimeout(() => {
    spinning.value = false
    secretMessage.value = ''
  }, 2500)
}

function checkMobile() {
  return window.innerWidth <= 768
}

onMounted(() => {
  // On mobile: show banner centered for 3s, then fade out
  if (checkMobile()) {
    hideTimer = setTimeout(() => {
      hiddenOnMobile.value = true
    }, 3000)
  }
})

onUnmounted(() => {
  if (hideTimer) clearTimeout(hideTimer)
})
</script>

<style scoped>
.banner {
  text-align: center;
  padding: 20px 0 10px;
  user-select: none;
  -webkit-user-select: none;
  transition: opacity 1.5s ease, max-height 1.5s ease, padding 1.5s ease;
  overflow: hidden;
}
.banner__logo {
  max-width: 100%;
  height: auto;
  pointer-events: auto;
  cursor: pointer;
  mix-blend-mode: screen;
}
.banner__logo--spinning {
  animation: banner-spin 0.6s ease-in-out 2;
}
.banner__secret {
  margin-top: 8px;
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  color: #00ff88;
  font-family: var(--font-heading, monospace);
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.6), 0 0 20px rgba(0, 255, 136, 0.3);
  letter-spacing: 0.1em;
}

@keyframes banner-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.banner-msg-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.banner-msg-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.banner-msg-enter-from { opacity: 0; transform: translateY(-10px); }
.banner-msg-leave-to { opacity: 0; transform: translateY(10px); }

/* Mobile: fade out after 3s */
@media (max-width: 768px) {
  .banner--hidden {
    opacity: 0;
    max-height: 0;
    padding: 0;
    pointer-events: none;
  }
}
</style>
