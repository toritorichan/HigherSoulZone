<template>
  <div>
    <div v-if="phantomVisible" class="phantom-cursor" :style="phantomStyle"></div>
    <div v-if="subliminalText" class="subliminal">{{ subliminalText }}</div>
    <div v-if="eyeVisible" class="watching-eye" :style="eyeStyle">👁</div>
    <div v-if="staticOverlay" class="static-overlay"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { garble, garbleRandom, garbleNoise } from '../../utils/garble.js'

const phantomVisible = ref(false)
const phantomStyle = ref({})
const subliminalText = ref('')
const eyeVisible = ref(false)
const eyeStyle = ref({})
const staticOverlay = ref(false)
const timeoutIds = []
const originals = new Map()
let audioCtx = null
let oscillator = null
let lfo = null
let gainNode = null
let audioStarted = false

// --- Effect 1: Random Text Corruption (more frequent, more aggressive) ---
function corruptRandomText() {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const textNodes = []
  while (walker.nextNode()) {
    const text = walker.currentNode.textContent.trim()
    if (text.length > 3) textNodes.push(walker.currentNode)
  }
  if (textNodes.length === 0) return

  const count = 4 + Math.floor(Math.random() * 5)
  const chosen = []
  const pool = [...textNodes]
  for (let i = 0; i < count && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length)
    chosen.push(pool.splice(idx, 1)[0])
  }

  const glitchChars = '\u0338\u0327\u0321\u031B\u0323\u0324\u0325\u0326\u0329\u032A\u032B\u032C\u032D\u032E\u032F\u0330\u0331\u0332\u0333\u0339\u033A\u033B\u033C\u0347\u0348\u0349\u034D\u034E\u0300\u0301\u0302\u0303\u0304\u0305\u0306\u0307\u0308\u0309\u030A\u030B\u030C\u030D\u030E\u030F'
  const creepySources = [
    '他們來了', '快跑', '不要看', '聽到了嗎', '就在你身後',
    'HELP', '不要不要不要', '敲門聲', '窗外有東西',
    '有人在看著你', '資料損壞', '他們已經在這裡了',
  ]
  const creepyReplacements = creepySources.map(s => garble(s, 0.7))

  chosen.forEach(node => {
    const original = node.textContent
    originals.set(node, original)
    // Sometimes replace entire text with creepy message
    if (Math.random() < 0.25) {
      node.textContent = creepyReplacements[Math.floor(Math.random() * creepyReplacements.length)]
    } else {
      node.textContent = original.split('').map(c =>
        Math.random() < 0.5
          ? c + glitchChars[Math.floor(Math.random() * glitchChars.length)] + glitchChars[Math.floor(Math.random() * glitchChars.length)]
          : c
      ).join('')
    }
  })

  setTimeout(() => {
    chosen.forEach(node => {
      if (originals.has(node) && node.parentNode) {
        node.textContent = originals.get(node)
        originals.delete(node)
      }
    })
  }, 600)
}

// --- Effect 2: Screen Flicker (more aggressive) ---
function screenFlicker() {
  const flickerCount = 1 + Math.floor(Math.random() * 3)
  let i = 0
  const doFlick = () => {
    document.body.style.opacity = '0.05'
    setTimeout(() => {
      document.body.style.opacity = '1'
      i++
      if (i < flickerCount) setTimeout(doFlick, 80 + Math.random() * 100)
    }, 40 + Math.random() * 30)
  }
  doFlick()
}

// --- Effect 3: Phantom Cursor ---
function spawnPhantom() {
  const startX = Math.random() * window.innerWidth
  const startY = Math.random() * window.innerHeight
  const endX = startX + (Math.random() - 0.5) * 400
  const endY = startY + (Math.random() - 0.5) * 300

  phantomStyle.value = {
    position: 'fixed',
    left: startX + 'px',
    top: startY + 'px',
    transition: 'all 3s linear, opacity 0.5s',
    opacity: '0.5',
    zIndex: '99999',
    pointerEvents: 'none',
    fontSize: '20px',
    color: '#00ff88',
    filter: 'blur(0.5px)',
  }
  phantomVisible.value = true

  requestAnimationFrame(() => {
    phantomStyle.value = { ...phantomStyle.value, left: endX + 'px', top: endY + 'px' }
  })

  setTimeout(() => {
    phantomStyle.value = { ...phantomStyle.value, opacity: '0' }
    setTimeout(() => { phantomVisible.value = false }, 500)
  }, 2500)
}

// --- Effect 4: Subliminal Messages (more frequent, more varied) ---
const subliminalSources = [
  '我們在看著你', '不要回頭', '他們已經來了', '你不是一個人',
  '醒來', '這不是夢', '他們就在門外', '信號已被攔截',
  '不要相信你看到的', '你的位置已被標記', '你還在這裡',
  '離開', '太遲了', '第三隻眼已經睜開', '這個網頁不存在',
  '螢幕後面有人', '不要動', '你聽到那個聲音了嗎',
  '攝影機已開啟', 'HELP', 'SIGNAL LOST', 'ERROR',
]

function flashSubliminal() {
  subliminalText.value = garbleRandom(subliminalSources, 0.5 + Math.random() * 0.3)
  setTimeout(() => { subliminalText.value = '' }, 80 + Math.random() * 60)
}

// --- Effect 5: Watching Eye (appears at random screen edge) ---
function spawnEye() {
  const side = Math.floor(Math.random() * 4)
  const pos = {}
  if (side === 0) { pos.top = '10px'; pos.left = Math.random() * 90 + '%' }
  else if (side === 1) { pos.bottom = '10px'; pos.left = Math.random() * 90 + '%' }
  else if (side === 2) { pos.left = '10px'; pos.top = Math.random() * 90 + '%' }
  else { pos.right = '10px'; pos.top = Math.random() * 90 + '%' }

  eyeStyle.value = {
    position: 'fixed',
    ...pos,
    zIndex: '99998',
    pointerEvents: 'none',
    fontSize: (1 + Math.random() * 2) + 'rem',
    opacity: '0',
    transition: 'opacity 0.3s',
  }
  eyeVisible.value = true
  requestAnimationFrame(() => {
    eyeStyle.value = { ...eyeStyle.value, opacity: String(0.3 + Math.random() * 0.4) }
  })

  setTimeout(() => {
    eyeStyle.value = { ...eyeStyle.value, opacity: '0' }
    setTimeout(() => { eyeVisible.value = false }, 300)
  }, 1500 + Math.random() * 2000)
}

// --- Effect 6: Static/noise burst ---
function staticBurst() {
  staticOverlay.value = true
  setTimeout(() => { staticOverlay.value = false }, 150 + Math.random() * 200)
}

// --- Effect 7: Random scroll jitter ---
function scrollJitter() {
  const offset = (Math.random() - 0.5) * 30
  window.scrollBy({ top: offset, behavior: 'auto' })
  setTimeout(() => {
    window.scrollBy({ top: -offset, behavior: 'auto' })
  }, 50)
}

// --- Effect 8: Cursor glitch (briefly change cursor) ---
function cursorGlitch() {
  document.body.style.cursor = 'none'
  setTimeout(() => {
    document.body.style.cursor = 'crosshair'
    setTimeout(() => {
      document.body.style.cursor = ''
    }, 200)
  }, 300)
}

// --- Effect 9: Reverse scroll ---
let reverseScrollActive = false
let reverseScrollHandler = null

function reverseScroll() {
  if (reverseScrollActive) return
  reverseScrollActive = true
  reverseScrollHandler = (e) => {
    e.preventDefault()
    window.scrollBy({ top: -e.deltaY * 2, behavior: 'auto' })
  }
  window.addEventListener('wheel', reverseScrollHandler, { passive: false })
  setTimeout(() => {
    window.removeEventListener('wheel', reverseScrollHandler)
    reverseScrollHandler = null
    reverseScrollActive = false
  }, 1000)
}

// --- Effect 10: Text shadow creep ---
function textShadowCreep() {
  const elements = document.querySelectorAll('p, h1, h2, h3, li, span, a')
  if (elements.length === 0) return
  const count = 2 + Math.floor(Math.random() * 4)
  const chosen = []
  for (let i = 0; i < count; i++) {
    chosen.push(elements[Math.floor(Math.random() * elements.length)])
  }
  chosen.forEach(el => {
    const orig = el.style.textShadow
    el.style.textShadow = '0 0 8px rgba(255,0,0,0.6), 0 0 20px rgba(255,0,0,0.3)'
    el.style.transition = 'text-shadow 0.3s'
    setTimeout(() => {
      el.style.textShadow = orig
    }, 2000)
  })
}

// --- Ambient drone ---
function initAmbientDrone() {
  if (audioStarted) return
  audioStarted = true
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    oscillator = audioCtx.createOscillator()
    gainNode = audioCtx.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = 40
    lfo = audioCtx.createOscillator()
    const lfoGain = audioCtx.createGain()
    lfo.type = 'sine'
    lfo.frequency.value = 0.1
    lfoGain.gain.value = 2
    lfo.connect(lfoGain)
    lfoGain.connect(oscillator.frequency)
    lfo.start()
    gainNode.gain.value = 0.015
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.start()
  } catch { /* skip */ }
}

function handleFirstClick() {
  initAmbientDrone()
  document.removeEventListener('click', handleFirstClick)
}

function scheduleRandom(fn, minMs, maxMs) {
  const delay = minMs + Math.random() * (maxMs - minMs)
  const id = setTimeout(() => {
    fn()
    scheduleRandom(fn, minMs, maxMs)
  }, delay)
  timeoutIds.push(id)
}

onMounted(() => {
  // Core unsettling effects — more frequent and aggressive
  scheduleRandom(corruptRandomText, 5000, 12000)
  scheduleRandom(screenFlicker, 12000, 25000)
  scheduleRandom(spawnPhantom, 30000, 60000)
  scheduleRandom(flashSubliminal, 15000, 30000)
  // Intensified effects
  scheduleRandom(spawnEye, 12000, 30000)
  scheduleRandom(staticBurst, 20000, 40000)
  scheduleRandom(scrollJitter, 25000, 50000)
  scheduleRandom(cursorGlitch, 15000, 35000)
  // New effects
  scheduleRandom(reverseScroll, 40000, 80000)
  scheduleRandom(textShadowCreep, 10000, 20000)
  document.addEventListener('click', handleFirstClick)
})

onUnmounted(() => {
  timeoutIds.forEach(clearTimeout)
  originals.forEach((original, node) => {
    if (node.parentNode) node.textContent = original
  })
  document.removeEventListener('click', handleFirstClick)
  if (reverseScrollHandler) {
    window.removeEventListener('wheel', reverseScrollHandler)
  }
  if (oscillator) oscillator.stop()
  if (lfo) lfo.stop()
  if (audioCtx) audioCtx.close()
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

.watching-eye {
  filter: grayscale(1);
}

.static-overlay {
  position: fixed;
  inset: 0;
  z-index: 99997;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 128px 128px;
  opacity: 0.15;
  mix-blend-mode: overlay;
}
</style>
