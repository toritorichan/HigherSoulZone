<template>
  <div style="display:none"></div>
</template>

<script setup>
import { onMounted, onUnmounted, computed } from 'vue'
import { useEasterEggStore } from '../../stores/easterEgg'

const store = useEasterEggStore()
const konamiActive = computed(() => store.konamiActivated)

let canvas = null
let ctx = null
let particles = []
let mouseX = 0
let mouseY = 0
let mouseDownTime = 0
let isMouseDown = false
let blackHoleActive = false
let animationId = null
let running = false

const MAX_PARTICLES = 120

function createParticle(x, y) {
  return {
    x, y,
    vx: (Math.random() - 0.5) * 2.5,
    vy: (Math.random() - 0.5) * 2.5,
    size: 3 + Math.random() * 5,
    opacity: 0.8 + Math.random() * 0.2,
    life: 1,
  }
}

function onMouseMove(e) {
  mouseX = e.clientX
  mouseY = e.clientY
  const count = konamiActive.value ? 4 : 2
  for (let i = 0; i < count && particles.length < MAX_PARTICLES; i++) {
    particles.push(createParticle(
      mouseX + (Math.random() - 0.5) * 8,
      mouseY + (Math.random() - 0.5) * 8
    ))
  }
}

function onMouseDown() {
  isMouseDown = true
  mouseDownTime = Date.now()
}

function onMouseUp() {
  if (blackHoleActive) {
    for (let i = 0; i < 30; i++) {
      const angle = (Math.PI * 2 * i) / 30
      const p = createParticle(mouseX, mouseY)
      p.vx = Math.cos(angle) * (4 + Math.random() * 4)
      p.vy = Math.sin(angle) * (4 + Math.random() * 4)
      p.size = 5 + Math.random() * 5
      particles.push(p)
    }
  }
  isMouseDown = false
  mouseDownTime = 0
  blackHoleActive = false
}

function onResize() {
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

function animate() {
  if (!running || !canvas || !ctx) return

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  if (isMouseDown && Date.now() - mouseDownTime > 3000) {
    blackHoleActive = true
  }

  // Update particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i]

    if (blackHoleActive) {
      const dx = mouseX - p.x
      const dy = mouseY - p.y
      const dist = Math.sqrt(dx * dx + dy * dy) || 1
      p.vx += (dx / dist) * 0.6 + (-dy / dist) * 0.25
      p.vy += (dy / dist) * 0.6 + (dx / dist) * 0.25
    }

    p.x += p.vx
    p.y += p.vy
    p.life -= 0.012
    p.opacity = p.life
    p.size *= 0.985

    if (p.life <= 0) {
      particles.splice(i, 1)
      continue
    }

    // Draw
    ctx.save()
    ctx.globalAlpha = p.opacity
    ctx.shadowBlur = 15
    ctx.shadowColor = 'rgba(255, 255, 255, 0.6)'
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // Konami: random twinkle particles
  if (konamiActive.value && Math.random() < 0.15 && particles.length < MAX_PARTICLES) {
    particles.push(createParticle(
      Math.random() * canvas.width,
      Math.random() * canvas.height
    ))
  }

  animationId = requestAnimationFrame(animate)
}

onMounted(() => {
  // Create canvas directly in DOM - bypass Vue entirely
  canvas = document.createElement('canvas')
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:5;pointer-events:none;'
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  document.body.appendChild(canvas)
  ctx = canvas.getContext('2d')

  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('resize', onResize)

  running = true
  animate()
})

onUnmounted(() => {
  running = false
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mousedown', onMouseDown)
  window.removeEventListener('mouseup', onMouseUp)
  window.removeEventListener('resize', onResize)
  if (animationId) cancelAnimationFrame(animationId)
  if (canvas && canvas.parentNode) {
    canvas.parentNode.removeChild(canvas)
  }
  canvas = null
  ctx = null
})
</script>
