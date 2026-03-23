<template>
  <transition name="morse-fade">
    <div v-if="showOverlay" class="morse-overlay" @click="dismiss">
      <div class="morse-overlay__content">
        <div class="morse-overlay__signal">{{ signalText }}</div>
        <div class="morse-overlay__coords">{{ coordsText }}</div>
        <div class="morse-overlay__bars">
          <span v-for="i in 5" :key="i" class="morse-overlay__bar"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { garble } from '../../utils/garble.js'

const SOS_PATTERN = ['S','S','S','L','L','L','S','S','S']
const SHORT_THRESHOLD = 200
const LONG_THRESHOLD = 400
const SEQUENCE_TIMEOUT = 4000

const sequence = ref([])
const showOverlay = ref(false)
const signalText = ref('')
const coordsText = ref('')

let mouseDownTime = 0
let sequenceTimer = null

function onMouseDown() {
  mouseDownTime = Date.now()
}

function onMouseUp() {
  if (mouseDownTime === 0) return
  const duration = Date.now() - mouseDownTime
  mouseDownTime = 0

  let type = null
  if (duration < SHORT_THRESHOLD) {
    type = 'S'
  } else if (duration >= LONG_THRESHOLD) {
    type = 'L'
  } else {
    // Ambiguous duration — ignore
    return
  }

  clearTimeout(sequenceTimer)

  const updated = [...sequence.value, type]
  if (updated.length > SOS_PATTERN.length) {
    sequence.value = updated.slice(-SOS_PATTERN.length)
  } else {
    sequence.value = updated
  }

  if (sequence.value.length === SOS_PATTERN.length &&
      sequence.value.every((v, i) => v === SOS_PATTERN[i])) {
    triggerDistressSignal()
    sequence.value = []
  }

  sequenceTimer = setTimeout(() => {
    sequence.value = []
  }, SEQUENCE_TIMEOUT)
}

function triggerDistressSignal() {
  signalText.value = garble('\u2593\u2593 SIGNAL RECEIVED \u2593\u2593', 0.4)
  coordsText.value = garble(
    `ORIGIN: ${(Math.random() * 360 - 180).toFixed(4)}\u00b0 / ${(Math.random() * 180 - 90).toFixed(4)}\u00b0 // SECTOR ${Math.floor(Math.random() * 9000 + 1000)}-\u03a9`,
    0.5
  )
  showOverlay.value = true

  setTimeout(() => {
    showOverlay.value = false
  }, 3000)
}

function dismiss() {
  showOverlay.value = false
}

onMounted(() => {
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  clearTimeout(sequenceTimer)
})
</script>

<style scoped>
.morse-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.92);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  animation: morse-flicker 0.15s ease-in-out 3;
}

.morse-overlay__content {
  text-align: center;
  max-width: 90vw;
}

.morse-overlay__signal {
  font-size: clamp(1.5rem, 5vw, 3.5rem);
  color: #00ff88;
  font-family: var(--font-heading, monospace);
  text-shadow:
    0 0 10px rgba(0, 255, 136, 0.8),
    0 0 40px rgba(0, 255, 136, 0.4),
    0 0 80px rgba(0, 255, 136, 0.2);
  letter-spacing: 0.15em;
  animation: morse-pulse 0.8s ease-in-out infinite alternate;
}

.morse-overlay__coords {
  margin-top: 1.5rem;
  font-size: clamp(0.7rem, 2vw, 1rem);
  color: rgba(0, 255, 136, 0.5);
  font-family: monospace;
  letter-spacing: 0.1em;
}

.morse-overlay__bars {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 2rem;
}

.morse-overlay__bar {
  display: block;
  width: 3px;
  height: 20px;
  background: #00ff88;
  opacity: 0.6;
  animation: morse-bar 1s ease-in-out infinite;
}

.morse-overlay__bar:nth-child(1) { animation-delay: 0s; }
.morse-overlay__bar:nth-child(2) { animation-delay: 0.15s; }
.morse-overlay__bar:nth-child(3) { animation-delay: 0.3s; }
.morse-overlay__bar:nth-child(4) { animation-delay: 0.45s; }
.morse-overlay__bar:nth-child(5) { animation-delay: 0.6s; }

@keyframes morse-flicker {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes morse-pulse {
  0% { opacity: 0.7; transform: scale(0.98); }
  100% { opacity: 1; transform: scale(1.02); }
}

@keyframes morse-bar {
  0%, 100% { transform: scaleY(0.3); }
  50% { transform: scaleY(1); }
}

.morse-fade-enter-active,
.morse-fade-leave-active {
  transition: opacity 0.3s ease;
}

.morse-fade-enter-from,
.morse-fade-leave-to {
  opacity: 0;
}
</style>
