<template>
  <div class="home">
    <!-- Scan lines overlay -->
    <div class="scanlines"></div>

    <!-- Floating particles drifting inward -->
    <div class="particles">
      <span
        v-for="p in particles"
        :key="p.id"
        class="particle"
        :style="p.style"
      ></span>
    </div>

    <!-- Wormhole concentric rings -->
    <div class="wormhole">
      <div
        v-for="ring in rings"
        :key="ring.id"
        class="ring"
        :style="ring.style"
      ></div>

      <!-- Center text -->
      <div class="center-text">
        <span v-if="phase === 'dots'" class="dots">{{ dots }}</span>
        <span v-else-if="phase === 'typing'" class="typed" v-html="displayText"></span>
        <span v-else-if="phase === 'star'" class="star">✦</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { garble } from '../utils/garble.js'

// --- Rings ---
const RING_COUNT = 12
const rings = []
for (let i = 0; i < RING_COUNT; i++) {
  const size = 90 - i * 6
  const duration = 8 + i * 1.5
  const delay = i * 0.3
  const opacity = 0.15 + (i / RING_COUNT) * 0.55
  const hue = i < RING_COUNT / 2 ? '152, 100%, 50%' : `${300 + i * 3}, 100%, 60%`
  rings.push({
    id: i,
    style: {
      width: `${size}%`,
      height: `${size}%`,
      borderColor: `hsla(${hue}, ${opacity})`,
      boxShadow: `0 0 ${8 + i * 2}px hsla(${hue}, ${opacity * 0.6}), inset 0 0 ${4 + i}px hsla(${hue}, ${opacity * 0.3})`,
      animationDuration: `${duration}s`,
      animationDelay: `-${delay}s`,
    },
  })
}

// --- Particles ---
const PARTICLE_COUNT = 40
const particles = []
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const angle = Math.random() * 360
  const dist = 40 + Math.random() * 50
  const size = 1 + Math.random() * 3
  const duration = 4 + Math.random() * 8
  const delay = Math.random() * duration
  const isGreen = Math.random() > 0.35
  const color = isGreen ? '#00ff88' : '#ff00c8'
  particles.push({
    id: i,
    style: {
      '--angle': `${angle}deg`,
      '--dist': `${dist}%`,
      '--size': `${size}px`,
      '--color': color,
      animationDuration: `${duration}s`,
      animationDelay: `-${delay}s`,
    },
  })
}

// --- Typing sequence ---
const phase = ref('dots')
const dots = ref('')
const displayText = ref('')
const fullMessage = '你準備好了嗎'

let timers = []

function scheduleTimer(fn, ms) {
  const id = setTimeout(fn, ms)
  timers.push(id)
  return id
}

function startSequence() {
  // Phase 1: dots
  phase.value = 'dots'
  dots.value = ''

  scheduleTimer(() => { dots.value = '.' }, 400)
  scheduleTimer(() => { dots.value = '..' }, 800)
  scheduleTimer(() => { dots.value = '...' }, 1200)

  // Phase 2: typing with garble
  scheduleTimer(() => {
    phase.value = 'typing'
    displayText.value = ''
    const chars = [...fullMessage]
    chars.forEach((char, idx) => {
      // Show garbled version first
      scheduleTimer(() => {
        const partial = fullMessage.slice(0, idx + 1)
        displayText.value = garble(partial, 0.4)
      }, idx * 180)
      // Settle to clean version
      scheduleTimer(() => {
        displayText.value = fullMessage.slice(0, idx + 1)
      }, idx * 180 + 120)
    })

    // After full text shown, do a brief garble flicker
    const flickerStart = chars.length * 180 + 600
    scheduleTimer(() => {
      displayText.value = garble(fullMessage, 0.5)
    }, flickerStart)
    scheduleTimer(() => {
      displayText.value = fullMessage
    }, flickerStart + 150)
    scheduleTimer(() => {
      displayText.value = garble(fullMessage, 0.7)
    }, flickerStart + 400)
    scheduleTimer(() => {
      displayText.value = fullMessage
    }, flickerStart + 550)

    // Phase 3: star
    scheduleTimer(() => {
      phase.value = 'star'
    }, flickerStart + 1800)

    // Loop the whole thing
    scheduleTimer(() => {
      startSequence()
    }, flickerStart + 7000)
  }, 2000)
}

onMounted(() => {
  startSequence()
})

onUnmounted(() => {
  timers.forEach(clearTimeout)
  timers = []
})
</script>

<style scoped>
.home {
  position: relative;
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: radial-gradient(ellipse at center, #050510 0%, #000 70%);
  animation: breathe 6s ease-in-out infinite;
}

/* Screen breathing */
@keyframes breathe {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.06); }
}

/* Scan lines */
.scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 255, 136, 0.015) 2px,
    rgba(0, 255, 136, 0.015) 4px
  );
}

/* Wormhole container */
.wormhole {
  position: relative;
  width: min(80vw, 600px);
  height: min(80vw, 600px);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Rings */
.ring {
  position: absolute;
  border: 1px solid;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(0deg);
  animation: ringRotate linear infinite, ringPulse 3s ease-in-out infinite alternate;
}

.ring:nth-child(odd) {
  animation-direction: reverse, alternate;
}

@keyframes ringRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes ringPulse {
  0% { opacity: 0.6; transform: translate(-50%, -50%) rotate(0deg) scale(1); }
  100% { opacity: 1; transform: translate(-50%, -50%) rotate(0deg) scale(1.03); }
}

/* Center text */
.center-text {
  position: relative;
  z-index: 5;
  text-align: center;
  min-height: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dots {
  font-family: var(--font-display, 'Russo One', sans-serif);
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: var(--color-primary, #00ff88);
  text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff8866;
  letter-spacing: 0.3em;
  animation: textGlow 1.5s ease-in-out infinite alternate;
}

.typed {
  font-family: var(--font-heading, 'Staatliches', sans-serif);
  font-size: clamp(1.2rem, 3.5vw, 2.5rem);
  color: var(--color-text, #fff);
  text-shadow: 0 0 15px #00ff88, 0 0 30px #ff00c855;
  letter-spacing: 0.15em;
  white-space: nowrap;
}

.star {
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--color-primary, #00ff88);
  text-shadow: 0 0 20px #00ff88, 0 0 50px #00ff88, 0 0 80px #ff00c8;
  animation: starPulse 2s ease-in-out infinite, fadeIn 0.8s ease-out;
}

@keyframes textGlow {
  0% { text-shadow: 0 0 10px #00ff8844, 0 0 20px #00ff8822; }
  100% { text-shadow: 0 0 20px #00ff88, 0 0 40px #00ff8866; }
}

@keyframes starPulse {
  0%, 100% {
    transform: scale(1);
    text-shadow: 0 0 20px #00ff88, 0 0 50px #00ff88, 0 0 80px #ff00c8;
  }
  50% {
    transform: scale(1.2);
    text-shadow: 0 0 30px #00ff88, 0 0 70px #00ff88, 0 0 120px #ff00c8;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}

/* Particles */
.particles {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
}

.particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  box-shadow: 0 0 4px var(--color);
  animation: drift linear infinite;
}

@keyframes drift {
  0% {
    transform:
      translate(-50%, -50%)
      rotate(var(--angle))
      translateX(var(--dist))
      scale(1);
    opacity: 0;
  }
  15% {
    opacity: 0.8;
  }
  85% {
    opacity: 0.4;
  }
  100% {
    transform:
      translate(-50%, -50%)
      rotate(var(--angle))
      translateX(0)
      scale(0);
    opacity: 0;
  }
}

/* Responsive */
@media (max-width: 600px) {
  .wormhole {
    width: 95vw;
    height: 95vw;
  }

  .home {
    min-height: 60vh;
  }
}
</style>
