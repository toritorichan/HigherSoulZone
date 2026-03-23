<template>
  <div class="gate" @click="skipToEnd">
    <!-- Scan lines -->
    <div class="gate__scanlines"></div>

    <!-- Floating particles drifting inward -->
    <span
      v-for="p in particles"
      :key="p.id"
      class="gate__particle"
      :style="p.style"
    ></span>

    <!-- Wormhole concentric rings -->
    <div class="gate__wormhole" :class="{ 'gate__wormhole--collapse': collapsing }">
      <div
        v-for="ring in rings"
        :key="ring.id"
        class="gate__ring"
        :style="ring.style"
      ></div>
    </div>

    <!-- Center text -->
    <div class="gate__text">
      <span v-if="phase === 'dots'" class="gate__dots">{{ dots }}</span>
      <span v-else-if="phase === 'typing'" class="gate__typed">{{ displayText }}</span>
      <span v-else-if="phase === 'ready'" class="gate__ready">✦</span>
    </div>

    <!-- Skip hint -->
    <div v-if="phase !== 'collapsing'" class="gate__skip">click anywhere</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { garble } from '../utils/garble.js'

const emit = defineEmits(['enter'])

const phase = ref('dots')
const dots = ref('')
const displayText = ref('')
const collapsing = ref(false)
const fullMessage = '你準備好了嗎'

let timers = []

function schedule(fn, ms) {
  const id = setTimeout(fn, ms)
  timers.push(id)
  return id
}

function startSequence() {
  phase.value = 'dots'
  dots.value = ''

  schedule(() => { dots.value = '.' }, 400)
  schedule(() => { dots.value = '..' }, 800)
  schedule(() => { dots.value = '...' }, 1200)

  schedule(() => {
    phase.value = 'typing'
    displayText.value = ''
    const chars = [...fullMessage]

    chars.forEach((_, idx) => {
      schedule(() => {
        displayText.value = garble(fullMessage.slice(0, idx + 1), 0.4)
      }, idx * 160)
      schedule(() => {
        displayText.value = fullMessage.slice(0, idx + 1)
      }, idx * 160 + 110)
    })

    const done = chars.length * 160 + 500
    // Garble flicker
    schedule(() => { displayText.value = garble(fullMessage, 0.6) }, done)
    schedule(() => { displayText.value = fullMessage }, done + 150)
    schedule(() => { displayText.value = garble(fullMessage, 0.8) }, done + 350)
    schedule(() => { displayText.value = fullMessage }, done + 500)

    // Show ready star then collapse
    schedule(() => { phase.value = 'ready' }, done + 1200)
    schedule(() => { doCollapse() }, done + 2800)
  }, 2000)
}

function doCollapse() {
  phase.value = 'collapsing'
  collapsing.value = true
  schedule(() => { emit('enter') }, 800)
}

function skipToEnd() {
  timers.forEach(clearTimeout)
  timers = []
  doCollapse()
}

// --- Rings ---
const RING_COUNT = 14
const rings = []
for (let i = 0; i < RING_COUNT; i++) {
  const size = 95 - i * 5.5
  const duration = 7 + i * 1.2
  const delay = i * 0.25
  const opacity = 0.12 + (i / RING_COUNT) * 0.5
  const hue = i < RING_COUNT / 2 ? '152, 100%, 50%' : `${300 + i * 4}, 100%, 60%`
  rings.push({
    id: i,
    style: {
      width: `${size}%`,
      height: `${size}%`,
      borderColor: `hsla(${hue}, ${opacity})`,
      boxShadow: `0 0 ${6 + i * 2}px hsla(${hue}, ${opacity * 0.5}), inset 0 0 ${3 + i}px hsla(${hue}, ${opacity * 0.25})`,
      animationDuration: `${duration}s`,
      animationDelay: `-${delay}s`,
    },
  })
}

// --- Particles ---
const PARTICLE_COUNT = 50
const particles = []
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const angle = Math.random() * 360
  const dist = 35 + Math.random() * 55
  const size = 1 + Math.random() * 3
  const duration = 3 + Math.random() * 7
  const delay = Math.random() * duration
  const color = Math.random() > 0.3 ? '#00ff88' : '#ff00c8'
  particles.push({
    id: i,
    style: {
      '--angle': `${angle}deg`,
      '--dist': `${dist}vh`,
      '--size': `${size}px`,
      '--color': color,
      animationDuration: `${duration}s`,
      animationDelay: `-${delay}s`,
    },
  })
}

onMounted(() => { startSequence() })
onUnmounted(() => { timers.forEach(clearTimeout); timers = [] })
</script>

<style scoped>
.gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  cursor: pointer;
}

/* Scan lines */
.gate__scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 255, 136, 0.012) 2px,
    rgba(0, 255, 136, 0.012) 4px
  );
}

/* Wormhole */
.gate__wormhole {
  position: absolute;
  width: min(90vw, 90vh);
  height: min(90vw, 90vh);
  transition: transform 0.8s cubic-bezier(0.5, 0, 1, 0.5), opacity 0.8s ease;
}
.gate__wormhole--collapse {
  transform: scale(15);
  opacity: 0;
}

/* Rings */
.gate__ring {
  position: absolute;
  border: 1px solid;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(0deg);
  animation: gateRingRotate linear infinite;
}
.gate__ring:nth-child(odd) {
  animation-direction: reverse;
}

@keyframes gateRingRotate {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Text */
.gate__text {
  position: relative;
  z-index: 20;
  text-align: center;
  pointer-events: none;
}

.gate__dots {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--color-primary);
  text-shadow: 0 0 20px #00ff88, 0 0 50px #00ff8866;
  letter-spacing: 0.4em;
}

.gate__typed {
  font-family: var(--font-heading);
  font-size: clamp(1.5rem, 4vw, 3rem);
  color: #fff;
  text-shadow: 0 0 15px #00ff88, 0 0 40px #ff00c855;
  letter-spacing: 0.15em;
  white-space: nowrap;
}
.gate__typed::after {
  content: '▌';
  color: var(--color-primary);
  animation: cursorBlink 0.6s step-end infinite;
  margin-left: 2px;
}

.gate__ready {
  font-size: clamp(3rem, 7vw, 6rem);
  color: var(--color-primary);
  text-shadow: 0 0 30px #00ff88, 0 0 60px #00ff88, 0 0 100px #ff00c8;
  animation: starPulse 1.5s ease-in-out infinite;
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes starPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

/* Particles */
.gate__particle {
  position: absolute;
  width: var(--size);
  height: var(--size);
  background: var(--color);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  box-shadow: 0 0 4px var(--color);
  animation: gateDrift linear infinite;
  pointer-events: none;
  z-index: 5;
}

@keyframes gateDrift {
  0% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(var(--dist)) scale(1);
    opacity: 0;
  }
  15% { opacity: 0.8; }
  85% { opacity: 0.3; }
  100% {
    transform: translate(-50%, -50%) rotate(var(--angle)) translateX(0) scale(0);
    opacity: 0;
  }
}

/* Skip hint */
.gate__skip {
  position: absolute;
  bottom: 5vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  font-family: var(--font-display);
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.15);
  letter-spacing: 0.3em;
  text-transform: uppercase;
  animation: skipPulse 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes skipPulse {
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.25; }
}
</style>
