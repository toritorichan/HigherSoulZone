<template>
  <div class="dead-site" :class="{ 'dead-site--shake': shaking, 'dead-site--red': redFlash }">
    <div class="stars">
      <div class="stars__layer"></div>
    </div>

    <div class="dead-site__content">
      <img
        ref="alienTopRef"
        src="/media/alien.png"
        alt="Alien"
        class="dead-site__alien dead-site__alien--top"
      />

      <h1 ref="glitchHeadingRef" class="glitch-text">
        <span class="glitch-text__row">
          <span class="glitch-text__inner">{{ headingText }}</span>
        </span>
        <span class="glitch-text__row glitch-text__row--sibling" aria-hidden="true">
          <span class="glitch-text__inner">{{ headingText }}</span>
        </span>
        <span class="glitch-text__row glitch-text__row--sibling" aria-hidden="true">
          <span class="glitch-text__inner">{{ headingText }}</span>
        </span>
        <span class="glitch-text__row glitch-text__row--sibling" aria-hidden="true">
          <span class="glitch-text__inner">{{ headingText }}</span>
        </span>
      </h1>

      <div v-if="!animating" class="dead-site__buttons">
        <button class="dead-site__btn dead-site__btn--accept" @click="handleAccept">
          我確定不會說出去
        </button>
        <button class="dead-site__btn dead-site__btn--reject" @click="handleReject">
          不要
        </button>
      </div>

      <p ref="thankRef" class="dead-site__thank">THANK YOU! (&gt; &lt;)</p>

      <img
        ref="alienBottomRef"
        src="/media/alien.png"
        alt="Alien"
        class="dead-site__alien dead-site__alien--bottom"
      />
    </div>

    <!-- Matrix rain canvas -->
    <canvas ref="matrixCanvasRef" class="dead-site__matrix"></canvas>

    <!-- Full screen flash overlay -->
    <div v-if="flashColor" class="dead-site__flash" :style="{ background: flashColor }"></div>

    <!-- Threatening text overlay -->
    <div v-if="threatText" class="dead-site__threat">{{ threatText }}</div>

    <!-- Full screen alien scare -->
    <div v-if="showAlienScare" class="dead-site__alien-scare">
      <img src="/media/alien.png" alt="" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { playExplosion } = useAudio()

const thankRef = ref(null)
const glitchHeadingRef = ref(null)
const alienTopRef = ref(null)
const alienBottomRef = ref(null)
const matrixCanvasRef = ref(null)

const animating = ref(false)
const shaking = ref(false)
const redFlash = ref(false)
const flashColor = ref(null)
const threatText = ref(null)
const showAlienScare = ref(false)
const headingText = ref('會幫我們保密嗎?')

// ── Ambient hum (40Hz oscillator, very quiet) ──
let audioCtx = null
let oscillator = null

function startAmbientHum() {
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    oscillator = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = 40
    gain.gain.value = 0.04
    oscillator.connect(gain)
    gain.connect(audioCtx.destination)
    oscillator.start()
  } catch (_) {
    // Web Audio not available — silent fallback
  }
}

function stopAmbientHum() {
  try {
    if (oscillator) oscillator.stop()
    if (audioCtx) audioCtx.close()
  } catch (_) {
    // ignore
  }
}

// ── Random heading flicker ──
const originalHeading = '會幫我們保密嗎?'
const garbledChars = '亡死鬼魂怨呪闇滅裂崩壊'
let flickerInterval = null

function startHeadingFlicker() {
  flickerInterval = setInterval(() => {
    if (animating.value) return
    const chars = originalHeading.split('')
    const idx = Math.floor(Math.random() * chars.length)
    chars[idx] = garbledChars[Math.floor(Math.random() * garbledChars.length)]
    headingText.value = chars.join('')
    setTimeout(() => {
      if (!animating.value) headingText.value = originalHeading
    }, 150)
  }, Math.random() * 5000 + 3000)
}

// ── Alien image random zoom pulse ──
let alienPulseInterval = null

function startAlienPulse() {
  const pulse = () => {
    const target = Math.random() > 0.5 ? alienTopRef.value : alienBottomRef.value
    if (target) {
      gsap.to(target, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 })
    }
    alienPulseInterval = setTimeout(pulse, Math.random() * 5000 + 3000)
  }
  alienPulseInterval = setTimeout(pulse, Math.random() * 5000 + 3000)
}

// ── Star red flash ──
let starFlashInterval = null

function startStarFlash() {
  starFlashInterval = setInterval(() => {
    if (animating.value) return
    const starsEl = document.querySelector('.stars')
    if (starsEl) {
      starsEl.style.filter = 'hue-rotate(300deg) saturate(3)'
      setTimeout(() => { starsEl.style.filter = '' }, 200)
    }
  }, Math.random() * 5000 + 4000)
}

// ── Matrix rain ──
function playMatrixRain(duration) {
  const canvas = matrixCanvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  canvas.style.display = 'block'

  const fontSize = 14
  const columns = Math.floor(canvas.width / fontSize)
  const drops = Array.from({ length: columns }, () => Math.random() * -50)
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'

  const interval = setInterval(() => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#0f0'
    ctx.font = `${fontSize}px monospace`

    for (let i = 0; i < drops.length; i++) {
      const char = chars[Math.floor(Math.random() * chars.length)]
      ctx.fillText(char, i * fontSize, drops[i] * fontSize)
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0
      }
      drops[i]++
    }
  }, 33)

  setTimeout(() => {
    clearInterval(interval)
    canvas.style.display = 'none'
  }, duration)
}

// ── Flash helper ──
function flash(color, duration) {
  return new Promise(resolve => {
    flashColor.value = color
    setTimeout(() => {
      flashColor.value = null
      resolve()
    }, duration)
  })
}

// ── Accept handler — SUPER FLASHY sequence ──
async function handleAccept() {
  animating.value = true
  playExplosion()

  // 1. White flash
  await flash('#fff', 50)

  // 2. Violent glitch on heading text
  const glitchInterval = setInterval(() => {
    const chars = originalHeading.split('')
    headingText.value = chars.map(() =>
      garbledChars[Math.floor(Math.random() * garbledChars.length)]
    ).join('')
  }, 50)

  // 3. Button morph / purple explosion (GSAP on heading as focal point)
  if (glitchHeadingRef.value) {
    gsap.to(glitchHeadingRef.value, {
      scale: 1.3,
      textShadow: '0 0 40px #cd28fa, 0 0 80px #cd28fa',
      duration: 0.5,
    })
  }

  await new Promise(r => setTimeout(r, 500))

  // 4. Green flash
  await flash('#26ff92', 100)

  // 5. Red explosion expanding upward
  await flash('#fa2856', 150)

  // 6. Violent screen shake
  shaking.value = true
  await new Promise(r => setTimeout(r, 800))
  shaking.value = false

  clearInterval(glitchInterval)
  headingText.value = originalHeading

  // 7. "THANK YOU!" dramatic zoom-in + glow
  if (thankRef.value) {
    gsap.fromTo(thankRef.value,
      { opacity: 0, scale: 0.2 },
      { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(2)' }
    )
    gsap.to(thankRef.value, {
      textShadow: '0 0 30px #26ff92, 0 0 60px #26ff92, 0 0 100px #26ff92',
      duration: 1,
      delay: 0.3,
    })
  }

  // 8. Matrix rain
  playMatrixRain(2000)

  // 9. After 3 seconds, fade to black then navigate home
  await new Promise(r => setTimeout(r, 3000))

  const siteEl = document.querySelector('.dead-site')
  if (siteEl) {
    gsap.to(siteEl, {
      opacity: 0,
      duration: 1,
      onComplete: () => router.push('/'),
    })
  } else {
    router.push('/')
  }
}

// ── Reject handler — TERRIFYING sequence ──
async function handleReject() {
  animating.value = true

  // 1. Screen goes red
  redFlash.value = true
  await new Promise(r => setTimeout(r, 200))
  redFlash.value = false

  // 2. Threatening messages
  const threats = ['你確定嗎？', '不要離開', '我們會找到你的']
  for (const msg of threats) {
    threatText.value = msg
    await new Promise(r => setTimeout(r, 400))
  }
  threatText.value = null

  // 3. Violent shake
  shaking.value = true
  await new Promise(r => setTimeout(r, 1000))
  shaking.value = false

  // 4. All text garbled / corrupted
  headingText.value = garbledChars.split('').sort(() => Math.random() - 0.5).join('')

  // 5. Rapid flicker
  const siteEl = document.querySelector('.dead-site')
  let flickCount = 0
  const flickerAnim = setInterval(() => {
    if (siteEl) siteEl.style.opacity = flickCount % 2 === 0 ? '0' : '1'
    flickCount++
    if (flickCount > 12) {
      clearInterval(flickerAnim)
      if (siteEl) siteEl.style.opacity = '1'
    }
  }, 80)

  await new Promise(r => setTimeout(r, 1200))

  // 6. Final alien scare — zoomed in filling screen
  showAlienScare.value = true
  await new Promise(r => setTimeout(r, 600))
  showAlienScare.value = false

  // 7. Attempt to close tab; fallback to black screen
  try {
    window.close()
  } catch (_) {
    // ignore
  }

  // If window.close() was blocked, show black screen with fading "..."
  await new Promise(r => setTimeout(r, 200))
  if (siteEl) {
    siteEl.innerHTML = '<p class="dead-site__dots">...</p>'
    siteEl.style.opacity = '1'
    siteEl.style.background = '#000'
    siteEl.style.display = 'flex'
    siteEl.style.alignItems = 'center'
    siteEl.style.justifyContent = 'center'

    const dotsEl = siteEl.querySelector('.dead-site__dots')
    if (dotsEl) {
      dotsEl.style.color = '#333'
      dotsEl.style.fontSize = '12px'
      dotsEl.style.fontFamily = 'monospace'
      gsap.to(dotsEl, { opacity: 0, duration: 3 })
    }
  }
}

onMounted(() => {
  startAmbientHum()
  startHeadingFlicker()
  startAlienPulse()
  startStarFlash()
})

onUnmounted(() => {
  stopAmbientHum()
  if (flickerInterval) clearInterval(flickerInterval)
  if (alienPulseInterval) clearTimeout(alienPulseInterval)
  if (starFlashInterval) clearInterval(starFlashInterval)
})
</script>

<style scoped>
/* ── Starfield ── */
.stars {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: #000;
  transition: filter 0.2s;
}

.stars::before,
.stars::after,
.stars .stars__layer {
  content: '';
  position: absolute;
  inset: 0;
}

/* Layer 1 — small 1px stars */
.stars::before {
  box-shadow:
    25px 50px #fff, 100px 180px #fff, 210px 30px #fff, 350px 120px #fff,
    450px 250px #fff, 530px 70px #fff, 620px 310px #fff, 710px 40px #fff,
    80px 400px #fff, 190px 500px #fff, 300px 350px #fff, 420px 480px #fff,
    550px 180px #fff, 650px 400px #fff, 740px 280px #fff, 830px 90px #fff,
    920px 350px #fff, 1010px 150px #fff, 1100px 420px #fff, 1200px 60px #fff,
    45px 600px #fff, 170px 720px #fff, 280px 640px #fff, 400px 700px #fff,
    520px 580px #fff, 640px 660px #fff, 760px 530px #fff, 880px 710px #fff,
    960px 590px #fff, 1050px 680px #fff, 1150px 550px #fff, 1250px 740px #fff,
    60px 820px #fff, 180px 900px #fff, 320px 830px #fff, 470px 910px #fff,
    590px 860px #fff, 700px 940px #fff, 820px 800px #fff, 950px 870px #fff,
    1080px 920px #fff, 1180px 810px #fff, 130px 1000px #fff, 350px 1050px #fff,
    550px 1020px #fff, 750px 1070px #fff, 900px 1010px #fff, 1100px 1060px #fff;
  width: 1px;
  height: 1px;
  animation: starTwinkle 4s ease-in-out infinite alternate;
}

/* Layer 2 — medium 2px stars */
.stars::after {
  box-shadow:
    120px 90px #fff, 260px 220px #fff, 400px 60px #fff, 540px 330px #fff,
    680px 150px #fff, 810px 420px #fff, 950px 260px #fff, 1070px 380px #fff,
    60px 300px #fff, 200px 450px #fff, 340px 580px #fff, 480px 150px #fff,
    600px 500px #fff, 730px 620px #fff, 870px 180px #fff, 1000px 540px #fff,
    150px 650px #fff, 310px 770px #fff, 460px 850px #fff, 620px 730px #fff,
    770px 880px #fff, 910px 650px #fff, 1060px 790px #fff, 1190px 340px #fff,
    80px 950px #fff, 240px 1030px #fff, 440px 970px #fff, 660px 1040px #fff,
    850px 950px #fff, 1050px 1000px #fff;
  width: 2px;
  height: 2px;
  animation: starTwinkle 6s ease-in-out infinite alternate-reverse;
}

/* Layer 3 — large 3px stars */
.stars .stars__layer {
  box-shadow:
    180px 140px #fff, 370px 290px #fff, 560px 80px #fff, 720px 450px #fff,
    900px 310px #fff, 1050px 120px #fff, 130px 530px #fff, 320px 680px #fff,
    510px 410px #fff, 690px 590px #fff, 870px 760px #fff, 1020px 640px #fff,
    220px 860px #fff, 440px 730px #fff, 640px 920px #fff, 830px 1000px #fff,
    1100px 880px #fff, 70px 1060px #fff, 350px 980px #fff, 580px 1050px #fff;
  width: 3px;
  height: 3px;
  animation: starTwinkle 8s ease-in-out infinite alternate;
}

@keyframes starTwinkle {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* ── Page layout ── */
.dead-site {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
  cursor: crosshair;
}

.dead-site__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  text-align: center;
}

/* ── Alien images ── */
.dead-site__alien {
  width: 160px;
  height: auto;
  filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.4));
}

.dead-site__alien--top {
  animation: alienFloat 3s ease-in-out infinite alternate;
}

.dead-site__alien--bottom {
  animation: alienFloat 3s ease-in-out 1.5s infinite alternate;
}

@keyframes alienFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-12px); }
}

/* ── Buttons container ── */
.dead-site__buttons {
  display: flex;
  gap: 2rem;
  align-items: center;
}

/* ── Button base ── */
.dead-site__btn {
  position: relative;
  padding: 1rem 2.5rem;
  font-size: 1.3rem;
  font-family: var(--font-heading, 'Orbitron', monospace);
  color: #fff;
  background: transparent;
  border: 2px solid;
  border-radius: 4px;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: box-shadow 0.2s, border-color 0.2s;
  overflow: hidden;
}

/* ── Accept button (green) ── */
.dead-site__btn--accept {
  border-color: #26ff92;
  box-shadow:
    0 0 15px 3px rgba(38, 255, 146, 0.4),
    inset 0 0 15px 1px rgba(38, 255, 146, 0.15);
  animation: neonPulseGreen 2s ease-in-out infinite alternate;
}

.dead-site__btn--accept:hover {
  box-shadow:
    0 0 25px 6px rgba(38, 255, 146, 0.6),
    inset 0 0 25px 3px rgba(38, 255, 146, 0.25);
}

@keyframes neonPulseGreen {
  0% { box-shadow: 0 0 10px 2px rgba(38, 255, 146, 0.3), inset 0 0 10px 1px rgba(38, 255, 146, 0.1); }
  100% { box-shadow: 0 0 20px 5px rgba(38, 255, 146, 0.5), inset 0 0 20px 2px rgba(38, 255, 146, 0.2); }
}

/* ── Reject button (red) ── */
.dead-site__btn--reject {
  border-color: #fa2856;
  box-shadow:
    0 0 15px 3px rgba(250, 40, 86, 0.4),
    inset 0 0 15px 1px rgba(250, 40, 86, 0.15);
  animation: neonPulseRed 2s ease-in-out infinite alternate;
}

.dead-site__btn--reject:hover {
  box-shadow:
    0 0 25px 6px rgba(250, 40, 86, 0.6),
    inset 0 0 25px 3px rgba(250, 40, 86, 0.25);
}

@keyframes neonPulseRed {
  0% { box-shadow: 0 0 10px 2px rgba(250, 40, 86, 0.3), inset 0 0 10px 1px rgba(250, 40, 86, 0.1); }
  100% { box-shadow: 0 0 20px 5px rgba(250, 40, 86, 0.5), inset 0 0 20px 2px rgba(250, 40, 86, 0.2); }
}

/* ── Thank you ── */
.dead-site__thank {
  opacity: 0;
  font-size: 2.5rem;
  font-family: var(--font-heading, 'Orbitron', monospace);
  color: #26ff92;
  text-shadow: 0 0 20px rgba(38, 255, 146, 0.6);
}

/* ── Shake ── */
.dead-site--shake {
  animation: violentShake 0.1s infinite;
}

@keyframes violentShake {
  0% { transform: translate(0); }
  25% { transform: translate(-5px, 3px); }
  50% { transform: translate(5px, -3px); }
  75% { transform: translate(-3px, -5px); }
  100% { transform: translate(3px, 5px); }
}

/* ── Red flash state ── */
.dead-site--red {
  background: #ff0000 !important;
}

/* ── Full-screen flash overlay ── */
.dead-site__flash {
  position: fixed;
  inset: 0;
  z-index: 200;
  pointer-events: none;
}

/* ── Threatening text overlay ── */
.dead-site__threat {
  position: fixed;
  inset: 0;
  z-index: 150;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-family: var(--font-heading, 'Orbitron', monospace);
  color: #fa2856;
  text-shadow: 0 0 30px #fa2856;
  background: rgba(0, 0, 0, 0.85);
  pointer-events: none;
}

/* ── Alien scare overlay ── */
.dead-site__alien-scare {
  position: fixed;
  inset: 0;
  z-index: 250;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
}

.dead-site__alien-scare img {
  width: 90vw;
  height: 90vh;
  object-fit: contain;
  filter: drop-shadow(0 0 40px rgba(0, 255, 136, 0.8)) brightness(1.5);
}

/* ── Matrix rain canvas ── */
.dead-site__matrix {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: none;
  pointer-events: none;
}

/* ── Dots fallback for reject close ── */
.dead-site__dots {
  color: #333;
  font-size: 12px;
  font-family: monospace;
}
</style>
