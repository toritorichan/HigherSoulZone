<template>
  <div class="contact">
    <h2 class="contact__heading">友站連結</h2>

    <div class="contact__links">
      <a
        href="https://www.space.com/area-51-what-is-it"
        target="_blank"
        rel="noopener"
        class="contact__link-card"
      >
        <span class="contact__link-icon">✦</span>
        <span>51區</span>
      </a>

      <a
        href="https://www.facebook.com/UFO.TRM/"
        target="_blank"
        rel="noopener"
        class="contact__link-card"
      >
        <span class="contact__link-icon">✧</span>
        <span>台灣雷爾運動</span>
      </a>
    </div>

    <div class="contact__heart-wrap" ref="heartWrapRef">
      <img
        :src="heartBroken ? '/media/love2.png' : '/media/love.png'"
        alt="heart"
        class="contact__heart"
        :class="{ 'contact__heart--shake': shaking, 'contact__heart--broken': heartBroken }"
        @click="onHeartClick"
      >
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
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useAudio } from '../composables/useAudio.js'

const { playExplosion } = useAudio()

const heartBroken = ref(false)
const shaking = ref(false)
const particles = ref([])
const heartWrapRef = ref(null)

function spawnParticles() {
  const wrap = heartWrapRef.value
  if (!wrap) return
  const img = wrap.querySelector('.contact__heart')
  if (!img) return
  const cx = img.offsetLeft + img.offsetWidth / 2
  const cy = img.offsetTop + img.offsetHeight / 2
  const colors = ['#ff4488', '#ff6699', '#ff2266', '#cc1144', '#ff88aa', '#ff0044']
  const newParticles = []
  for (let i = 0; i < 25; i++) {
    const angle = (Math.PI * 2 * i) / 25 + (Math.random() - 0.5) * 0.5
    const dist = 60 + Math.random() * 100
    newParticles.push({
      id: i,
      x: cx,
      y: cy,
      dx: Math.cos(angle) * dist,
      dy: Math.sin(angle) * dist - 30,
      color: colors[Math.floor(Math.random() * colors.length)],
    })
  }
  particles.value = newParticles
  setTimeout(() => { particles.value = [] }, 1000)
}

function onHeartClick() {
  if (heartBroken.value) return
  shaking.value = true
  playExplosion()
  setTimeout(() => {
    shaking.value = false
    spawnParticles()
    nextTick(() => {
      heartBroken.value = true
    })
  }, 300)
}
</script>

<style scoped>
.contact {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  animation: fadeIn 0.8s ease-out;
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
  border: 1px solid var(--color-border);
  border-radius: 4px;
  color: var(--color-text);
  font-size: 1.1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  text-decoration: none;
}

.contact__link-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.15);
  color: var(--color-primary);
}

.contact__link-icon {
  font-size: 1.4rem;
  color: var(--color-primary);
}

.contact__heart-wrap {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  position: relative;
}

.contact__heart {
  width: 120px;
  cursor: pointer;
  transition: transform 0.3s;
}

.contact__heart:hover {
  transform: scale(1.1);
}

.contact__heart--shake {
  animation: shake 0.3s ease-in-out;
}

.contact__heart--broken {
  cursor: default;
  filter: grayscale(0.3);
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

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-8px); }
  40% { transform: translateX(8px); }
  60% { transform: translateX(-5px); }
  80% { transform: translateX(5px); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
