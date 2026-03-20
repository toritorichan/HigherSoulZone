<template>
  <canvas v-if="active" ref="canvasRef" class="matrix-canvas" :class="{ 'matrix-canvas--fading': fading }"></canvas>
</template>

<script setup>
import { ref, watch, onUnmounted, nextTick } from 'vue'
import { useEasterEggStore } from '../../stores/easterEgg'

const store = useEasterEggStore()
const canvasRef = ref(null)
const active = ref(false)
const fading = ref(false)
let animationId = null
const originalTexts = new Map()
let textReplaceTimeouts = []

const CHARS = []
for (let i = 0x30A0; i <= 0x30FF; i++) CHARS.push(String.fromCharCode(i))
for (let i = 0; i <= 9; i++) CHARS.push(String(i))

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

function getTextNodes(root) {
  const nodes = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent || !node.textContent.trim()) return NodeFilter.FILTER_REJECT
      const parent = node.parentElement
      if (parent && (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'CANVAS')) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    }
  })
  let node = walker.nextNode()
  while (node) {
    nodes.push(node)
    node = walker.nextNode()
  }
  return nodes
}

function startTextReplace() {
  const textNodes = getTextNodes(document.body)
  originalTexts.clear()

  textNodes.forEach((node) => {
    const original = node.textContent
    if (!original) return
    originalTexts.set(node, original)

    const chars = original.split('')
    let charIndex = 0

    function replaceNext() {
      if (charIndex >= chars.length) return
      if (chars[charIndex] === ' ' || chars[charIndex] === '\n' || chars[charIndex] === '\t') {
        charIndex++
        const tid = setTimeout(replaceNext, 20)
        textReplaceTimeouts.push(tid)
        return
      }
      chars[charIndex] = randomChar()
      node.textContent = chars.join('')
      charIndex++
      if (charIndex < chars.length) {
        const tid = setTimeout(replaceNext, 20)
        textReplaceTimeouts.push(tid)
      }
    }

    const startDelay = Math.floor(Math.random() * 300)
    const tid = setTimeout(replaceNext, startDelay)
    textReplaceTimeouts.push(tid)
  })

  const restoreTimeout = setTimeout(() => {
    restoreText()
  }, 2000)
  textReplaceTimeouts.push(restoreTimeout)
}

function restoreText() {
  let delay = 0
  originalTexts.forEach((original, node) => {
    const current = node.textContent
    if (!current) return
    const chars = current.split('')
    const origChars = original.split('')

    for (let i = 0; i < origChars.length; i++) {
      const idx = i
      const tid = setTimeout(() => {
        chars[idx] = origChars[idx]
        try {
          node.textContent = chars.join('')
        } catch {
          // Node may have been removed from DOM
        }
      }, delay + idx * 20)
      textReplaceTimeouts.push(tid)
    }
    delay += 50
  })
}

function startRain() {
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  const fontSize = 16
  const columnCount = Math.floor(canvas.width / fontSize)
  const drops = new Array(columnCount).fill(0)
  const speeds = Array.from({ length: columnCount }, () => 0.5 + Math.random() * 1.5)

  function handleResize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  window.addEventListener('resize', handleResize)

  function draw() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < columnCount; i++) {
      const char = randomChar()
      const opacity = 0.5 + Math.random() * 0.5
      ctx.fillStyle = `rgba(0, 255, 136, ${opacity})`
      const x = i * fontSize
      const y = drops[i] * fontSize
      ctx.fillText(char, x, y)

      drops[i] += speeds[i]

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
    }

    animationId = requestAnimationFrame(draw)
  }

  animationId = requestAnimationFrame(draw)

  return () => {
    window.removeEventListener('resize', handleResize)
  }
}

function cleanup() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  textReplaceTimeouts.forEach((tid) => clearTimeout(tid))
  textReplaceTimeouts = []
  originalTexts.clear()
}

let cleanupResize = null

watch(() => store.matrixMode, async (isActive) => {
  if (isActive) {
    active.value = true
    fading.value = false
    await nextTick()
    cleanupResize = startRain()
    startTextReplace()
  } else {
    fading.value = true
    setTimeout(() => {
      active.value = false
      fading.value = false
      if (cleanupResize) {
        cleanupResize()
        cleanupResize = null
      }
      cleanup()
    }, 500)
  }
})

onUnmounted(() => {
  if (cleanupResize) {
    cleanupResize()
    cleanupResize = null
  }
  cleanup()
})
</script>

<style scoped>
.matrix-canvas {
  position: fixed;
  inset: 0;
  z-index: 9998;
  pointer-events: none;
  width: 100vw;
  height: 100vh;
  transition: opacity 0.5s ease-out;
}

.matrix-canvas--fading {
  opacity: 0;
}
</style>
