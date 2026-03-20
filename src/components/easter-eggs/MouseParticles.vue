<template>
  <teleport to="body">
    <canvas ref="canvasRef" class="particles-canvas"></canvas>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { useEasterEggStore } from '../../stores/easterEgg'

const store = useEasterEggStore()
const canvasRef = ref(null)
const konamiActive = computed(() => store.konamiActivated)

let particles = []
let mouseX = 0
let mouseY = 0
let mouseDownTime = 0
let isMouseDown = false
let blackHoleActive = false
let animationId = null

const MAX_PARTICLES = 100

function createParticle(x, y, color = 'white') {
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 2,
    vy: (Math.random() - 0.5) * 2,
    size: 4 + Math.random() * 4,
    opacity: 1,
    color,
  }
}

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  const count = konamiActive.value
    ? 3 + Math.floor(Math.random() * 2)
    : 1 + Math.floor(Math.random() * 2)
  for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
    particles = [...particles, createParticle(mouseX, mouseY)]
  }
}

function onMouseDown() {
  isMouseDown = true
  mouseDownTime = Date.now()
}

function onMouseUp() {
  if (blackHoleActive) {
    const burstParticles = []
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30
      const p = createParticle(mouseX, mouseY)
      p.vx = Math.cos(angle) * (3 + Math.random() * 3)
      p.vy = Math.sin(angle) * (3 + Math.random() * 3)
      burstParticles.push(p)
    }
    particles = [...particles, ...burstParticles]
  }
  isMouseDown = false
  mouseDownTime = 0
  blackHoleActive = false
}

function updateParticle(p) {
  const updated = { ...p }

  if (blackHoleActive) {
    const dx = mouseX - updated.x
    const dy = mouseY - updated.y
    const dist = Math.sqrt(dx * dx + dy * dy) || 1
    updated.vx = updated.vx + (dx / dist) * 0.5 + (-dy / dist) * 0.2
    updated.vy = updated.vy + (dy / dist) * 0.5 + (dx / dist) * 0.2
  }

  updated.x = updated.x + updated.vx
  updated.y = updated.y + updated.vy
  updated.opacity = updated.opacity - 0.015
  updated.size = updated.size * 0.98

  return updated
}

function drawParticle(ctx, p) {
  ctx.beginPath()
  ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)

  if (p.color === 'white') {
    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)'
  } else {
    ctx.fillStyle = p.color.replace(')', `, ${p.opacity})`).replace('rgb', 'rgba')
    ctx.shadowColor = p.color
  }

  ctx.shadowBlur = 12
  ctx.fill()
  ctx.shadowBlur = 0
}

function animate() {
  const canvas = canvasRef.value
  if (!canvas) {
    animationId = requestAnimationFrame(animate)
    return
  }

  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (isMouseDown && Date.now() - mouseDownTime > 3000) {
    blackHoleActive = true
  }

  particles = particles
    .map(updateParticle)
    .filter(p => p.opacity > 0)

  for (const p of particles) {
    drawParticle(ctx, p)
  }

  if (konamiActive.value && Math.random() < 0.1 && particles.length < MAX_PARTICLES) {
    particles = [
      ...particles,
      createParticle(
        Math.random() * canvas.width,
        Math.random() * canvas.height
      ),
    ]
  }

  animationId = requestAnimationFrame(animate)
}

onMounted(async () => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  await nextTick()
  animate()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style>
.particles-canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 5;
  pointer-events: none;
}
</style>
