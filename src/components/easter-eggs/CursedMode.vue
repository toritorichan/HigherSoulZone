<template>
  <div v-if="cursed">
    <!-- Red vignette overlay -->
    <div class="cursed-vignette"></div>
    <!-- Scan lines -->
    <div class="cursed-scanlines"></div>
    <!-- Random blood drip elements -->
    <div v-for="drip in drips" :key="drip.id" class="cursed-drip" :style="drip.style"></div>
    <!-- Floating threat messages -->
    <div v-if="threatMsg" class="cursed-threat" :style="threatStyle">{{ threatMsg }}</div>
    <!-- Prevent close overlay -->
    <div v-if="showCloseWarning" class="cursed-close-warning">
      <p>你以為你可以離開？</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useEasterEggStore } from '../../stores/easterEgg'

const store = useEasterEggStore()
const cursed = computed(() => store.cursedMode)

const drips = ref([])
const threatMsg = ref('')
const threatStyle = ref({})
const showCloseWarning = ref(false)
const timeoutIds = []

const threats = [
  '你不該拒絕的',
  '我們說過了',
  '你逃不掉',
  '我們無處不在',
  '後悔了嗎',
  '已經太遲了',
  '你屬於我們',
  '不要試圖離開',
  '我們在每個角落',
  '你的選擇是錯的',
  '回不去了',
  '這就是代價',
]

// ── Apply cursed theme to document ──
function applyCursedTheme() {
  const root = document.documentElement
  root.style.setProperty('--color-primary', '#ff0000')
  root.style.setProperty('--color-accent', '#8b0000')
  root.style.setProperty('--color-text', '#ffcccc')
  root.style.setProperty('--color-text-dim', 'rgba(255, 100, 100, 0.5)')
  root.style.setProperty('--color-border', 'rgba(255, 0, 0, 0.15)')
  root.style.setProperty('--color-bg', '#0a0000')
  document.body.style.background = '#0a0000'

  // Add red filter to banner
  const banner = document.querySelector('.banner__logo')
  if (banner) {
    banner.style.filter = 'hue-rotate(300deg) saturate(3) brightness(0.7)'
  }
}

// ── Prevent tab close ──
function onBeforeUnload(e) {
  e.preventDefault()
  e.returnValue = '你確定要離開嗎？我們會記住的。'
  return e.returnValue
}

// ── Show warning when trying to close ──
function onVisibilityChange() {
  if (document.hidden && cursed.value) {
    showCloseWarning.value = true
    setTimeout(() => { showCloseWarning.value = false }, 2000)
  }
}

// ── Blood drip effect ──
function spawnDrip() {
  if (!cursed.value) return
  const id = Date.now() + Math.random()
  const drip = {
    id,
    style: {
      position: 'fixed',
      top: '0',
      left: Math.random() * 100 + 'vw',
      width: (2 + Math.random() * 4) + 'px',
      height: (50 + Math.random() * 200) + 'px',
      background: 'linear-gradient(to bottom, transparent, rgba(139, 0, 0, 0.6), transparent)',
      zIndex: '9994',
      pointerEvents: 'none',
      animation: `dripFall ${3 + Math.random() * 4}s linear forwards`,
      opacity: String(0.3 + Math.random() * 0.4),
    },
  }
  drips.value = [...drips.value, drip]
  setTimeout(() => {
    drips.value = drips.value.filter(d => d.id !== id)
  }, 7000)
}

// ── Random floating threat ──
function showThreat() {
  if (!cursed.value) return
  threatMsg.value = threats[Math.floor(Math.random() * threats.length)]
  threatStyle.value = {
    position: 'fixed',
    top: (10 + Math.random() * 70) + 'vh',
    left: (5 + Math.random() * 80) + 'vw',
    zIndex: '9995',
    pointerEvents: 'none',
    fontSize: (1 + Math.random() * 2.5) + 'rem',
  }
  setTimeout(() => { threatMsg.value = '' }, 1500 + Math.random() * 1500)
}

// ── Aggressive text corruption in cursed mode ──
function cursedCorruption() {
  if (!cursed.value) return
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  const textNodes = []
  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim().length > 2) {
      textNodes.push(walker.currentNode)
    }
  }

  const count = 2 + Math.floor(Math.random() * 4)
  for (let i = 0; i < count && textNodes.length > 0; i++) {
    const idx = Math.floor(Math.random() * textNodes.length)
    const node = textNodes.splice(idx, 1)[0]
    const original = node.textContent
    // Replace with creepy version
    const creepy = ['他們來了', '不要不要不要', '你逃不掉', '█████', '...你還在？', '已經結束了']
    node.textContent = creepy[Math.floor(Math.random() * creepy.length)]
    setTimeout(() => {
      if (node.parentNode) node.textContent = original
    }, 800 + Math.random() * 600)
  }
}

// ── Red flash ──
function redFlash() {
  if (!cursed.value) return
  document.body.style.boxShadow = 'inset 0 0 100px rgba(255, 0, 0, 0.3)'
  setTimeout(() => {
    document.body.style.boxShadow = ''
  }, 150)
}

function scheduleRandom(fn, minMs, maxMs) {
  const delay = minMs + Math.random() * (maxMs - minMs)
  const id = setTimeout(() => {
    fn()
    if (cursed.value) scheduleRandom(fn, minMs, maxMs)
  }, delay)
  timeoutIds.push(id)
}

// Watch for cursed mode activation
watch(cursed, (isCursed) => {
  if (isCursed) {
    applyCursedTheme()
    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('visibilitychange', onVisibilityChange)

    // Start cursed effects
    scheduleRandom(spawnDrip, 2000, 5000)
    scheduleRandom(showThreat, 5000, 12000)
    scheduleRandom(cursedCorruption, 3000, 8000)
    scheduleRandom(redFlash, 8000, 20000)

    // Change page title
    document.title = '你不該拒絕的'
    setInterval(() => {
      if (!cursed.value) return
      const titles = ['你不該拒絕的', '我們在看著你', '👁', '不要離開', '...', '已經太遲了', '█████']
      document.title = titles[Math.floor(Math.random() * titles.length)]
    }, 3000)
  }
})

onUnmounted(() => {
  timeoutIds.forEach(clearTimeout)
  window.removeEventListener('beforeunload', onBeforeUnload)
  document.removeEventListener('visibilitychange', onVisibilityChange)
})
</script>

<style>
/* Cursed mode global styles - intentionally unscoped */
@keyframes dripFall {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}

.cursed-vignette {
  position: fixed;
  inset: 0;
  z-index: 9993;
  pointer-events: none;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(80, 0, 0, 0.6) 100%);
}

.cursed-scanlines {
  position: fixed;
  inset: 0;
  z-index: 9993;
  pointer-events: none;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
}

.cursed-threat {
  color: rgba(255, 0, 0, 0.7);
  font-family: var(--font-heading);
  letter-spacing: 0.2em;
  text-shadow: 0 0 15px rgba(255, 0, 0, 0.4);
  animation: cursedThreatFade 2s ease-out forwards;
}

@keyframes cursedThreatFade {
  0% { opacity: 0; transform: scale(0.9); }
  15% { opacity: 1; transform: scale(1); }
  70% { opacity: 1; }
  100% { opacity: 0; transform: scale(1.05) translateY(-10px); }
}

.cursed-close-warning {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.95);
  pointer-events: none;
}

.cursed-close-warning p {
  font-family: var(--font-heading);
  font-size: 5vw;
  color: #ff0000;
  letter-spacing: 0.3em;
  text-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
  animation: cursedPulse 0.5s ease-in-out infinite alternate;
}

@keyframes cursedPulse {
  from { opacity: 0.7; transform: scale(1); }
  to { opacity: 1; transform: scale(1.03); }
}
</style>
