<template>
  <div>
    <div v-if="invertActive" class="secret-word__invert"></div>
    <transition name="secret-word-float">
      <div v-if="messageVisible" class="secret-word__message">
        {{ messageText }}
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { garble } from '../../utils/garble.js'

const SECRET = ['a', 'l', 'i', 'e', 'n']

const typed = ref([])
const invertActive = ref(false)
const messageVisible = ref(false)
const messageText = ref('')

let dismissTimer = null

function onKeyDown(e) {
  if (e.repeat) return

  const key = e.key.toLowerCase()
  if (key.length !== 1 || !/[a-z]/.test(key)) return

  const nextExpected = SECRET[typed.value.length]
  if (key === nextExpected) {
    typed.value = [...typed.value, key]
  } else if (key === SECRET[0]) {
    typed.value = [key]
  } else {
    typed.value = []
  }

  if (typed.value.length === SECRET.length) {
    triggerEffect()
    typed.value = []
  }
}

function triggerEffect() {
  // Phase 1: invert colors
  invertActive.value = true

  setTimeout(() => {
    invertActive.value = false

    // Phase 2: floating garbled message
    messageText.value = garble('\u6211\u5011\u6536\u5230\u4e86\u4f60\u7684\u8a0a\u865f', 0.5)
    messageVisible.value = true

    dismissTimer = setTimeout(() => {
      messageVisible.value = false
    }, 2500)
  }, 500)
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  clearTimeout(dismissTimer)
})
</script>

<style scoped>
.secret-word__invert {
  position: fixed;
  inset: 0;
  z-index: 99998;
  pointer-events: none;
  backdrop-filter: invert(1);
  -webkit-backdrop-filter: invert(1);
}

.secret-word__message {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  pointer-events: none;
  font-size: clamp(1rem, 3vw, 1.8rem);
  color: #00ff88;
  font-family: var(--font-heading, monospace);
  text-shadow:
    0 0 8px rgba(0, 255, 136, 0.7),
    0 0 30px rgba(0, 255, 136, 0.3);
  white-space: nowrap;
  animation: secret-word-rise 2.5s ease-out forwards;
}

@keyframes secret-word-rise {
  0% {
    bottom: -2rem;
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    bottom: 50vh;
    opacity: 0;
  }
}

.secret-word-float-enter-active {
  transition: opacity 0.2s ease;
}

.secret-word-float-leave-active {
  transition: opacity 0.5s ease;
}

.secret-word-float-enter-from,
.secret-word-float-leave-to {
  opacity: 0;
}
</style>
