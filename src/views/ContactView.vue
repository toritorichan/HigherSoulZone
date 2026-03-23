<template>
  <div class="contact">
    <!-- Hearts floating in background of entire section -->
    <div class="contact__hearts-bg" ref="heartsRef">
      <img
        v-for="heart in hearts"
        :key="heart.id"
        :src="heart.broken ? `${base}media/love2.png` : `${base}media/love.png`"
        :style="heart.style"
        class="contact__heart"
        :class="{ 'contact__heart--broken': heart.broken }"
        @click="breakHeart(heart)"
      />
      <div
        v-for="particle in particles"
        :key="particle.id"
        class="contact__particle"
        :style="{
          '--dx': particle.dx + 'px',
          '--dy': particle.dy + 'px',
          '--color': particle.color,
          left: particle.x + 'px',
          top: particle.y + 'px',
        }"
      />
    </div>

    <!-- Content on top -->
    <div class="contact__content">
      <h2 class="contact__heading">友站連結</h2>
      <div class="contact__links">
        <a href="https://www.space.com/area-51-what-is-it" target="_blank" rel="noopener" class="contact__link-card">
          <span class="contact__link-icon">✦</span>
          <span>51區</span>
        </a>
        <a href="https://www.facebook.com/UFO.TRM/" target="_blank" rel="noopener" class="contact__link-card">
          <span class="contact__link-icon">✧</span>
          <span>台灣雷爾運動</span>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAudio } from '../composables/useAudio.js'

const base = import.meta.env.BASE_URL

const { playExplosion } = useAudio()

const heartsRef = ref(null)
const particles = ref([])

const hearts = ref(
  Array.from({ length: 30 }, (_, i) => ({
    id: i,
    broken: false,
    style: {
      left: Math.random() * 95 + '%',
      top: Math.random() * 95 + '%',
      width: (15 + Math.random() * 40) + 'px',
      transform: `rotate(${(Math.random() - 0.5) * 50}deg)`,
      opacity: 0.15 + Math.random() * 0.4,
      animationDelay: Math.random() * 4 + 's',
      animationDuration: (3 + Math.random() * 4) + 's',
      filter: `hue-rotate(${Math.floor(Math.random() * 360)}deg) saturate(${0.5 + Math.random() * 1.5})`,
    },
  }))
)

function spawnParticles(event) {
  const wrap = heartsRef.value
  if (!wrap) return
  const wrapRect = wrap.getBoundingClientRect()
  const cx = event.clientX - wrapRect.left
  const cy = event.clientY - wrapRect.top
  const colors = ['#ff4488', '#ff6699', '#ff2266', '#cc1144', '#ff88aa', '#ff0044']
  const newParticles = []
  for (let i = 0; i < 20; i++) {
    const angle = (Math.PI * 2 * i) / 20 + (Math.random() - 0.5) * 0.5
    const dist = 40 + Math.random() * 80
    newParticles.push({
      id: Date.now() + i,
      x: cx,
      y: cy,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 20,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
  particles.value = newParticles
  setTimeout(() => { particles.value = [] }, 1000)
}

function breakHeart(heart) {
  if (heart.broken) return
  heart.broken = true
  playExplosion()
}
</script>

<style scoped>
.contact {
  position: relative;
  min-height: 500px;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  animation: fadeIn 0.8s ease-out;
}

.contact__hearts-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.contact__content {
  position: relative;
  z-index: 1;
}

.contact__heading {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.contact__links {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 3rem;
}

.contact__link-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: none;
  border-radius: 4px;
  color: var(--color-text);
  font-size: 1.1rem;
  transition: color 0.3s, text-shadow 0.3s;
  text-decoration: none;
}

.contact__link-card:hover {
  color: var(--color-primary);
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.3);
}

.contact__link-icon {
  font-size: 1.4rem;
  color: var(--color-primary);
}

.contact__heart {
  position: absolute;
  cursor: pointer;
  animation: heartFloat 4s ease-in-out infinite alternate;
  filter: brightness(0.7);
  transition: transform 0.3s, filter 0.3s;
}

.contact__heart:hover {
  transform: scale(1.4) !important;
  filter: brightness(1);
}

.contact__heart--broken {
  animation: heartShatter 0.5s ease forwards;
  filter: grayscale(0.5);
  cursor: default;
}

.contact__particle {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color);
  pointer-events: none;
  animation: particleFly 0.8s ease-out forwards;
}

@keyframes heartFloat {
  from { transform: translateY(0); }
  to { transform: translateY(-15px); }
}

@keyframes heartShatter {
  0% { transform: scale(1); }
  30% { transform: scale(1.2) rotate(5deg); }
  60% { transform: scale(0.9) rotate(-3deg); }
  100% { transform: scale(1); }
}

@keyframes particleFly {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(var(--dx), var(--dy)) scale(0);
    opacity: 0;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 768px) {
  .contact {
    min-height: 300px;
    padding: 1.5rem 1rem;
  }

  .contact__heading {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .contact__link-card {
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }

  .contact__link-icon {
    font-size: 1.1rem;
  }

  .contact__heart {
    max-width: 30px;
  }
}
</style>
