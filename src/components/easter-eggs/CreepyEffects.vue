<template>
  <div>
    <!-- Phantom cursor -->
    <div v-if="phantomVisible" class="phantom-cursor" :style="phantomStyle"></div>
    <!-- Subliminal message -->
    <div v-if="subliminalText" class="subliminal">{{ subliminalText }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const phantomVisible = ref(false)
const phantomStyle = ref({})
const subliminalText = ref('')
const timeoutIds = []
const originals = new Map()
let audioCtx = null
let oscillator = null
let lfo = null
let gainNode = null
let audioStarted = false

// --- Effect 1: Random Text Corruption ---
function corruptRandomText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const textNodes = []
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent.trim()
    if (text.length > 5) {
      textNodes.push(walker.currentNode)
    }
  }
  if (textNodes.length === 0) return

  const count = 3 + Math.floor(Math.random() * 3)
  const chosen = []
  const pool = [...textNodes]
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    chosen.push(pool.splice(idx, 1)[0])
  }

  const glitchChars = '\u0338\u0327\u0321\u031B\u0323\u0324\u0325\u0326\u0329\u032A\u032B\u032C\u032D\u032E\u032F\u0330\u0331\u0332\u0333\u0339\u033A\u033B\u033C\u0347\u0348\u0349\u034D\u034E\u0300\u0301\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030A\u030B\u030C\u030D\u030E\u030F\u0310\u0311\u0312\u0313\u0314\u033D\u033E\u033F\u0340\u0341\u0342\u0343\u0344\u0346\u034A\u034B\u034C\u0315\u0357\u0345\u034F'

  chosen.forEach(node => {
    const original = node.textContent
    originals.set(node, original)
    node.textContent = original.split('').map(c =>
      Math.random() < 0.4
        ? c + glitchChars[Math.floor(Math.random() * glitchChars.length)]
        : c
    ).join('')
  })

  setTimeout(() => {
    chosen.forEach(node => {
      if (originals.has(node) && node.parentNode) {
        node.textContent = originals.get(node)
        originals.delete(node)
      }
    })
  }, 500)
}

// --- Effect 2: Screen Flicker ---
function screenFlicker() {
  document.body.style.opacity = '0.1'
  setTimeout(() => {
    document.body.style.opacity = '1'
  }, 50)
  // Sometimes double-flicker
  if (Math.random() < 0.3) {
    setTimeout(() => {
      document.body.style.opacity = '0.1'
      setTimeout(() => {
        document.body.style.opacity = '1'
      }, 50)
    }, 150)
  }
}

// --- Effect 3: Phantom Cursor ---
function spawnPhantom() {
  const startX = Math.random() * window.innerWidth
  const startY = Math.random() * window.innerHeight
  const endX = startX + (Math.random() - 0.5) * 300
  const endY = startY + (Math.random() - 0.5) * 200

  phantomStyle.value = {
    position: 'fixed',
    left: startX + 'px',
    top: startY + 'px',
    transition: 'all 3s linear, opacity 0.5s',
    opacity: '0.4',
    zIndex: '99999',
    pointerEvents: 'none',
    fontSize: '20px',
    color: '#00ff88',
    filter: 'blur(0.5px)',
  }
  phantomVisible.value = true

  requestAnimationFrame(() => {
    phantomStyle.value = {
      ...phantomStyle.value,
      left: endX + 'px',
      top: endY + 'px',
    }
  })

  setTimeout(() => {
    phantomStyle.value = { ...phantomStyle.value, opacity: '0' }
    setTimeout(() => {
      phantomVisible.value = false
    }, 500)
  }, 2500)
}

// --- Effect 4: Subliminal Messages ---
const messages = [
  '我們在看著你',
  '不要回頭',
  '他們已經來了',
  '你不是一個人',
  '醒來',
  '這不是夢',
]

function flashSubliminal() {
  subliminalText.value = messages[Math.floor(Math.random() * messages.length)]
  setTimeout(() => {
    subliminalText.value = ''
  }, 100)
}

// --- Effect 5: Ambient Background Noise ---
function initAmbientDrone() {
  if (audioStarted) return
  audioStarted = true

  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    oscillator = audioCtx.createOscillator()
    gainNode = audioCtx.createGain()

    oscillator.type = 'sine'
    oscillator.frequency.value = 40

    // LFO for subtle frequency wobble
    lfo = audioCtx.createOscillator()
    const lfoGain = audioCtx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 0.1
    lfoGain.gain.value = 2 // wobble range in Hz
    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)
    lfo.start()

    gainNode.gain.value = 0.02
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.start()
  } catch {
    // Web Audio API not available — silently skip
  }
}

function handleFirstClick() {
  initAmbientDrone()
  document.removeEventListener('click', handleFirstClick)
}

// --- Schedule random intervals ---
function scheduleRandom(fn, minMs, maxMs) {
  const delay = minMs + Math.random() * (maxMs - minMs)
  const id = setTimeout(() => {
    fn()
    scheduleRandom(fn, minMs, maxMs)
  }, delay)
  timeoutIds.push(id)
}

onMounted(() => {
  scheduleRandom(corruptRandomText, 15000, 30000)
  scheduleRandom(screenFlicker, 30000, 60000)
  scheduleRandom(spawnPhantom, 45000, 90000)
  scheduleRandom(flashSubliminal, 60000, 120000)
  document.addEventListener('click', handleFirstClick)
})

onUnmounted(() => {
  timeoutIds.forEach(clearTimeout)
  originals.forEach((original, node) => {
    if (node.parentNode) {
      node.textContent = original
    }
  })
  document.removeEventListener('click', handleFirstClick)
  if (oscillator) {
    oscillator.stop()
  }
  if (lfo) {
    lfo.stop()
  }
  if (audioCtx) {
    audioCtx.close()
  }
})
</script>

<style scoped>
.phantom-cursor::before {
  content: '\27A4';
  display: block;
}

.subliminal {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 8vw;
  color: rgba(255, 255, 255, 0.9);
  font-family: var(--font-heading);
  z-index: 99999;
  pointer-events: none;
  text-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
}
</style>
