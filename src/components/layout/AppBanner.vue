<template>
  <header class="banner">
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
import { ref } from 'vue'
import { garble } from '../../utils/garble.js'

const base = import.meta.env.BASE_URL

const clickCount = ref(0)
const spinning = ref(false)
const secretMessage = ref('')
const TARGET_CLICKS = 7

let resetTimer = null
let dismissTimer = null

function onLogoClick() {
  clearTimeout(resetTimer)

  clickCount.value = clickCount.value + 1

  if (clickCount.value >= TARGET_CLICKS) {
    triggerSecret()
    clickCount.value = 0
    return
  }

  // Reset counter if user stops clicking for 3 seconds
  resetTimer = setTimeout(() => {
    clickCount.value = 0
  }, 3000)
}

function triggerSecret() {
  spinning.value = true
  secretMessage.value = garble('\u7b2c\u4e03\u7dad\u5ea6\u5df2\u89e3\u9396', 0.5)

  dismissTimer = setTimeout(() => {
    spinning.value = false
    secretMessage.value = ''
  }, 2500)
}
</script>

<style scoped>
.banner {
  text-align: center;
  padding: 20px 0 10px;
  user-select: none;
  -webkit-user-select: none;
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
  text-shadow:
    0 0 8px rgba(0, 255, 136, 0.6),
    0 0 20px rgba(0, 255, 136, 0.3);
  letter-spacing: 0.1em;
}

@keyframes banner-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.banner-msg-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.banner-msg-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.banner-msg-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.banner-msg-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
