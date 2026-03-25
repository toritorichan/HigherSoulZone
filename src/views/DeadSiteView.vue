<template>
  <div class="dead" ref="deadRef">
    <div class="dead__grain"></div>

    <!-- Single large alien background -->
    <img :src="`${base}media/alien.png`" ref="alienBgRef" class="dead__alien-bg" />

    <div class="dead__stars">
      <div class="dead__stars-layer"></div>
    </div>

    <!-- CRT scanlines -->
    <div class="dead__crt-overlay"></div>

    <div class="dead__content" ref="contentRef">
      <!-- VHS timestamp style question -->
      <div class="dead__vhs-timestamp">REC ● 19██/██/██ ██:██:██</div>
      <h1 ref="headingRef" class="dead__heading">會幫我們保密嗎?</h1>

      <div v-if="!animating" class="dead__choices">
        <button class="dead__choice" @click="handleAccept">我會保密</button>
        <button class="dead__choice dead__choice--danger" @click="handleReject">不要</button>
      </div>

      <p ref="messageRef" class="dead__message"></p>
    </div>

    <!-- Reject: scattered "不要" in multiple languages -->
    <div
      v-for="(nope, i) in scatteredNopes"
      :key="'nope-' + i"
      class="dead__scattered"
      :style="nope.style"
    >
      {{ nope.text }}
    </div>

    <div v-if="screenPulse" class="dead__pulse"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useEasterEggStore } from '../stores/easterEgg'
import { garble, garbleRandom } from '../utils/garble.js'

const base = import.meta.env.BASE_URL

const router = useRouter()
const store = useEasterEggStore()

const deadRef = ref(null)
const headingRef = ref(null)
const alienBgRef = ref(null)
const contentRef = ref(null)
const messageRef = ref(null)

const animating = ref(false)
const scatteredNopes = ref([])
const screenPulse = ref(false)

let driftTimer = null

function driftHeading() {
  const x = (Math.random() - 0.5) * 10
  const y = (Math.random() - 0.5) * 5
  if (headingRef.value) {
    headingRef.value.style.transform = `translate(${x}px, ${y}px)`
  }
  driftTimer = setTimeout(driftHeading, 3000 + Math.random() * 2000)
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const nopeSources = [
  '不要', 'NO', 'STOP', '停下來', '不要不要不要',
  '離開', '夠了', '別再來了', '拜託', '放過我',
]

function generateNopes(count) {
  const items = []
  for (let i = 0; i < count; i++) {
    const isRed = Math.random() > 0.5
    items.push({
      text: garbleRandom(nopeSources, 0.5 + Math.random() * 0.4),
      style: {
        top: `${Math.random() * 90}vh`,
        left: `${Math.random() * 90}vw`,
        fontSize: `${0.8 + Math.random() * 3}rem`,
        transform: `rotate(${(Math.random() - 0.5) * 60}deg)`,
        color: isRed ? '#ff0000' : '#00ff00',
        textShadow: isRed
          ? '0 0 8px rgba(255, 0, 0, 0.5)'
          : '0 0 8px rgba(0, 255, 0, 0.5)',
      },
    })
  }
  return items
}

function typewriter(el, text, speed = 120) {
  return new Promise(resolve => {
    el.textContent = ''
    let idx = 0
    const interval = setInterval(() => {
      if (idx < text.length) {
        el.textContent += text[idx]
        idx++
      } else {
        clearInterval(interval)
        resolve()
      }
    }, speed)
  })
}

// ── Accept: clean, eerie exit ──
async function handleAccept() {
  animating.value = true

  // Content fades out
  if (contentRef.value) {
    gsap.to(contentRef.value, { opacity: 0, duration: 2 })
  }
  await wait(2500)

  // "..." appears
  if (messageRef.value) {
    messageRef.value.textContent = '...'
    gsap.set(messageRef.value, { opacity: 0 })
    if (contentRef.value) gsap.set(contentRef.value, { opacity: 1 })
    gsap.to(messageRef.value, { opacity: 1, duration: 0.5 })
  }
  await wait(1500)

  // "我們會記住你的"
  if (messageRef.value) {
    gsap.to(messageRef.value, {
      opacity: 0, duration: 0.3,
      onComplete: () => {
        if (messageRef.value) {
          messageRef.value.textContent = '我們會記住你的'
          gsap.to(messageRef.value, { opacity: 1, duration: 0.5 })
        }
      },
    })
  }
  await wait(2000)

  // Fade out and go directly home (no repeat)
  if (deadRef.value) {
    gsap.to(deadRef.value, {
      opacity: 0, duration: 1.5,
      onComplete: () => {
        // Skip dead site on next garbled egg click — go straight home
        router.push('/')
      },
    })
  } else {
    router.push('/')
  }
}

// ── Reject: 不要不要不要 ──
async function handleReject() {
  animating.value = true

  // Wave 1: 25 scattered "不要"
  scatteredNopes.value = generateNopes(25)

  // Alien zooms in aggressively
  if (alienBgRef.value) {
    gsap.to(alienBgRef.value, {
      opacity: 0.8,
      scale: 2,
      duration: 4,
      ease: 'power1.inOut',
    })
  }

  await wait(500)

  // Wave 2: 25 more
  scatteredNopes.value = [...scatteredNopes.value, ...generateNopes(25)]

  await wait(500)

  // All nopes stay static — pasted on feeling

  screenPulse.value = true

  await wait(300)

  // Garbled horror sequence
  const horrorSequence = [
    { text: garble('你確定嗎？', 0.4), dur: 800 },
    { text: garble('你確定嗎', 0.6), dur: 600 },
    { text: garble('ARE YOU SURE?', 0.5), dur: 600 },
    { text: garble('你確定', 0.8), dur: 500 },
    { text: garble('確定？', 0.9), dur: 500 },
  ]
  for (const msg of horrorSequence) {
    if (messageRef.value) {
      messageRef.value.textContent = msg.text
      gsap.to(messageRef.value, { opacity: 1, duration: 0.2 })
    }
    await wait(msg.dur)
    if (messageRef.value) gsap.set(messageRef.value, { opacity: 0 })
    await wait(100)
  }

  // Typewriter: final threat
  if (messageRef.value) {
    gsap.set(messageRef.value, { opacity: 1 })
    await typewriter(messageRef.value, garble('我們會找到你的', 0.5), 150)
  }
  await wait(800)
  if (messageRef.value) {
    gsap.set(messageRef.value, { opacity: 0 })
    await wait(200)
    gsap.set(messageRef.value, { opacity: 1 })
    await typewriter(messageRef.value, garble('你逃不掉的', 0.6), 120)
  }
  await wait(1000)

  // Fade to black
  screenPulse.value = false
  if (deadRef.value) {
    gsap.to(deadRef.value, { opacity: 0, duration: 3 })
  }
  await wait(3500)

  // Show eye briefly
  if (deadRef.value) {
    deadRef.value.style.opacity = '1'
    deadRef.value.style.background = '#000'
    deadRef.value.innerHTML = ''
    const eyeEl = document.createElement('div')
    eyeEl.textContent = '\uD83D\uDC41'
    eyeEl.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:2rem;opacity:0;transition:opacity 0.5s;color:red;'
    deadRef.value.appendChild(eyeEl)
    requestAnimationFrame(() => { eyeEl.style.opacity = '1' })
    await wait(1500)
    eyeEl.style.opacity = '0'
    await wait(500)
  }

  // Activate CURSED MODE and go back to site
  store.activateCursedMode()
  router.push('/')
}

onMounted(() => { driftHeading() })
onUnmounted(() => { if (driftTimer) clearTimeout(driftTimer) })
</script>

<style scoped>
.dead {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: #000;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: crosshair;
  overflow: hidden;
}

.dead__grain {
  position: fixed;
  inset: 0;
  opacity: 0.03;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-size: 128px 128px;
  pointer-events: none;
  z-index: 1;
}

.dead__alien-bg {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80vw;
  max-width: 800px;
  opacity: 0.08;
  pointer-events: none;
  z-index: 0;
  filter: grayscale(1) brightness(0.8) sepia(0.1) hue-rotate(80deg);
}

/* CRT overlay for green tint */
.dead__crt-overlay {
  position: fixed;
  inset: 0;
  background:
    linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.15) 50%
    ),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.03),
      rgba(0, 255, 0, 0.01),
      rgba(0, 0, 255, 0.03)
    );
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
  z-index: 5;
}

.dead__stars {
  position: fixed;
  inset: 0;
  z-index: 0;
  opacity: 0.3;
  pointer-events: none;
}

.dead__stars::before,
.dead__stars::after,
.dead__stars .dead__stars-layer {
  content: '';
  position: absolute;
  inset: 0;
}

.dead__stars::before {
  box-shadow:
    25px 50px #fff, 100px 180px #fff, 210px 30px #fff, 350px 120px #fff,
    450px 250px #fff, 530px 70px #fff, 620px 310px #fff, 710px 40px #fff,
    80px 400px #fff, 190px 500px #fff, 300px 350px #fff, 420px 480px #fff,
    550px 180px #fff, 650px 400px #fff, 740px 280px #fff, 830px 90px #fff,
    920px 350px #fff, 1010px 150px #fff, 1100px 420px #fff, 1200px 60px #fff;
  width: 1px;
  height: 1px;
}

.dead__stars::after {
  box-shadow:
    120px 90px #fff, 260px 220px #fff, 400px 60px #fff, 540px 330px #fff,
    680px 150px #fff, 810px 420px #fff, 950px 260px #fff, 1070px 380px #fff,
    60px 300px #fff, 200px 450px #fff, 340px 580px #fff, 480px 150px #fff;
  width: 2px;
  height: 2px;
}

.dead__stars .dead__stars-layer {
  box-shadow:
    180px 140px #fff, 370px 290px #fff, 560px 80px #fff, 720px 450px #fff,
    900px 310px #fff, 1050px 120px #fff, 130px 530px #fff, 320px 680px #fff;
  width: 3px;
  height: 3px;
}

.dead__content {
  position: relative;
  z-index: 6;
  text-align: center;
}

/* VHS timestamp */
.dead__vhs-timestamp {
  font-family: var(--font-system);
  font-size: 0.8rem;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.dead__heading {
  font-family: var(--font-system);
  font-size: 6vw;
  color: var(--color-accent);
  letter-spacing: 0.2em;
  margin-bottom: 3rem;
  text-shadow:
    0 0 10px rgba(255, 0, 0, 0.4),
    2px 2px 0 rgba(255, 0, 0, 0.2);
}

.dead__choices {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
}

/* Windows-style beveled buttons */
.dead__choice {
  background: #c0c0c0;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
  box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf;
  color: #000;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 12px;
  cursor: pointer;
  letter-spacing: 0.05em;
  padding: 6px 24px;
  min-width: 85px;
  min-height: 25px;
}

.dead__choice:active {
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  border-bottom: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf;
  padding: 7px 23px 5px 25px;
}

.dead__choice:hover {
  opacity: 1;
}

.dead__choice--danger {
  color: #cc0000;
}

.dead__message {
  font-family: var(--font-system);
  font-size: 1.5rem;
  color: var(--color-primary);
  letter-spacing: 0.2em;
  opacity: 0;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.3);
}

.dead__scattered {
  position: fixed;
  font-family: var(--font-system);
  pointer-events: none;
  z-index: 7;
  opacity: 0.7;
}

.dead__pulse {
  position: fixed;
  inset: 0;
  z-index: 10;
  pointer-events: none;
  background: rgba(0, 255, 0, 0.02);
}

@media (max-width: 768px) {
  .dead__heading {
    font-size: 8vw;
  }
  .dead__choice {
    font-size: 11px;
    padding: 5px 16px;
    min-width: 70px;
  }
}
</style>
