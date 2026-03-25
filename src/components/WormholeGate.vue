<template>
  <div class="gate" @click="skipToEnd">
    <!-- CRT scanlines overlay -->
    <div class="gate__scanlines"></div>

    <!-- Static noise SVG filter (hidden) -->
    <svg class="gate__svg-defs" width="0" height="0">
      <filter id="staticNoise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.85"
          numOctaves="4"
          stitchTiles="stitch"
          :seed="noiseSeed"
        />
      </filter>
    </svg>

    <!-- VHS tracking distortion bars -->
    <div v-if="phase === 'tracking'" class="gate__tracking">
      <div
        v-for="bar in trackingBars"
        :key="bar.id"
        class="gate__tracking-bar"
        :style="bar.style"
      ></div>
    </div>

    <!-- Static noise overlay -->
    <div
      v-if="showStatic"
      class="gate__static"
      :style="{ opacity: staticOpacity }"
    ></div>

    <!-- BIOS boot text -->
    <div v-if="phase === 'bios'" class="gate__bios">
      <div
        v-for="(line, idx) in biosLines"
        :key="idx"
        class="gate__bios-line"
        :class="{
          'gate__bios-line--warn': line.startsWith('[WARN]'),
          'gate__bios-line--err': line.startsWith('[ERR]'),
        }"
      >{{ line }}</div>
      <span class="gate__bios-cursor">_</span>
    </div>

    <!-- VHS timestamp + center message -->
    <div v-if="phase === 'message'" class="gate__message-screen">
      <!-- VHS REC indicator -->
      <div class="gate__rec">
        <span class="gate__rec-dot">●</span>
        <span class="gate__rec-text">REC</span>
        <span class="gate__rec-timestamp">2002.03.25 04:44:44</span>
      </div>

      <!-- Center typed message -->
      <div class="gate__center-text">
        <span class="gate__typed">{{ displayText }}</span>
        <span v-if="showTypingCursor" class="gate__cursor">_</span>
      </div>

      <!-- VHS counter bottom -->
      <div class="gate__vhs-counter">{{ vhsCounter }}</div>
    </div>

    <!-- Final static burst -->
    <div v-if="phase === 'burst'" class="gate__burst"></div>

    <!-- Skip hint -->
    <div v-if="phase !== 'burst'" class="gate__skip">click anywhere</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { garble } from '../utils/garble.js'

const emit = defineEmits(['enter'])

const phase = ref('bios')
const biosLines = ref([])
const displayText = ref('')
const showTypingCursor = ref(false)
const vhsCounter = ref('--:--:--')
const showStatic = ref(false)
const staticOpacity = ref(0)
const noiseSeed = ref(0)

let timers = []
let noiseInterval = null

const BIOS_MESSAGES = [
  'AMIBIOS (C) 2001 American Megatrends, Inc.',
  'ASUS P4B-MX ACPI BIOS Revision 1008',
  '',
  'Intel(R) Pentium(R) 4 CPU 1.80GHz',
  'MEMORY TEST... 640K OK',
  'EXTENDED MEMORY: 261120K',
  '',
  'Detecting IDE drives...',
  'Primary Master: MAXTOR 6Y080L0',
  'Primary Slave: SAMSUNG CD-ROM SC-148C',
  '',
  'LOADING SECTOR 0x7C00...',
  'INIT KERNEL MODULES...',
  '[OK] PCI Bus enumeration complete',
  '[OK] USB Host Controller initialized',
  '[WARN] UNKNOWN DEVICE DETECTED',
  '[WARN] IRQ CONFLICT ON CHANNEL 7',
  '[ERR] SIGNAL SOURCE: ????????',
  '[ERR] CANNOT IDENTIFY BROADCAST ORIGIN',
]

const trackingBars = []
for (let i = 0; i < 8; i++) {
  trackingBars.push({
    id: i,
    style: {
      top: `${Math.random() * 100}%`,
      height: `${8 + Math.random() * 30}px`,
      opacity: 0.08 + Math.random() * 0.15,
      animationDuration: `${0.3 + Math.random() * 0.7}s`,
      animationDelay: `${Math.random() * 0.5}s`,
    },
  })
}

function schedule(fn, ms) {
  const id = setTimeout(fn, ms)
  timers.push(id)
  return id
}

function startNoiseAnimation() {
  noiseInterval = setInterval(() => {
    noiseSeed.value = Math.floor(Math.random() * 9999)
  }, 80)
}

function stopNoiseAnimation() {
  if (noiseInterval) {
    clearInterval(noiseInterval)
    noiseInterval = null
  }
}

function startSequence() {
  startNoiseAnimation()

  // Phase 1: BIOS boot text (1.5s)
  phase.value = 'bios'
  biosLines.value = []

  const lineDelay = 1500 / BIOS_MESSAGES.length
  BIOS_MESSAGES.forEach((msg, idx) => {
    schedule(() => {
      const shouldGarble = idx > 14 && Math.random() < 0.3
      const line = shouldGarble ? garble(msg, 0.4) : msg
      biosLines.value = [...biosLines.value, line]
    }, idx * lineDelay)
  })

  // Phase 2: VHS tracking (1s)
  schedule(() => {
    phase.value = 'tracking'
    showStatic.value = true
    staticOpacity.value = 0.3
  }, 1500)

  // Phase 3: Timestamp + message (2.5s)
  schedule(() => {
    phase.value = 'message'
    showStatic.value = false
    staticOpacity.value = 0
    showTypingCursor.value = true
    displayText.value = ''
    vhsCounter.value = '--:--:--'

    // Start VHS counter
    let counterSeconds = 0
    const counterInterval = setInterval(() => {
      counterSeconds++
      const h = String(Math.floor(counterSeconds / 3600)).padStart(2, '0')
      const m = String(Math.floor((counterSeconds % 3600) / 60)).padStart(2, '0')
      const s = String(counterSeconds % 60).padStart(2, '0')
      vhsCounter.value = `${h}:${m}:${s}`
    }, 200)
    timers.push(counterInterval)

    // Type message character by character
    const fullMessage = '你 準 備 好 了 嗎'
    const chars = [...fullMessage]

    chars.forEach((_, idx) => {
      schedule(() => {
        // Show garbled version first
        displayText.value = garble(fullMessage.slice(0, idx + 1), 0.4)
      }, idx * 180)
      schedule(() => {
        // Then reveal correct character
        displayText.value = fullMessage.slice(0, idx + 1)
      }, idx * 180 + 120)
    })

    const typingDone = chars.length * 180 + 300

    // Garble flicker after typing
    schedule(() => { displayText.value = garble(fullMessage, 0.6) }, typingDone)
    schedule(() => { displayText.value = fullMessage }, typingDone + 150)
    schedule(() => { displayText.value = garble(fullMessage, 0.8) }, typingDone + 350)
    schedule(() => {
      displayText.value = fullMessage
      showTypingCursor.value = false
    }, typingDone + 500)
  }, 2500)

  // Phase 4: Static burst -> black -> emit enter (0.8s)
  schedule(() => {
    doBurst()
  }, 5000)
}

function doBurst() {
  phase.value = 'burst'
  showStatic.value = true
  staticOpacity.value = 1

  schedule(() => {
    showStatic.value = false
    staticOpacity.value = 0
    stopNoiseAnimation()
    emit('enter')
  }, 800)
}

function skipToEnd() {
  timers.forEach((id) => {
    clearTimeout(id)
    clearInterval(id)
  })
  timers = []
  doBurst()
}

onMounted(() => { startSequence() })
onUnmounted(() => {
  timers.forEach((id) => {
    clearTimeout(id)
    clearInterval(id)
  })
  timers = []
  stopNoiseAnimation()
})
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

/* SVG defs hidden */
.gate__svg-defs {
  position: absolute;
  width: 0;
  height: 0;
}

/* ---- CRT Scanlines ---- */
.gate__scanlines {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 50;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 0, 0, 0.18) 2px,
    rgba(0, 0, 0, 0.18) 4px
  );
}

/* ---- Static noise overlay ---- */
.gate__static {
  position: absolute;
  inset: -50%;
  width: 200%;
  height: 200%;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E");
  animation: staticMove 0.15s steps(8) infinite;
  pointer-events: none;
  z-index: 40;
}

@keyframes staticMove {
  0%   { transform: translate(0, 0); }
  25%  { transform: translate(-5%, -8%); }
  50%  { transform: translate(8%, 5%); }
  75%  { transform: translate(-8%, 10%); }
  100% { transform: translate(5%, -5%); }
}

/* ---- VHS Tracking bars ---- */
.gate__tracking {
  position: absolute;
  inset: 0;
  z-index: 30;
  pointer-events: none;
}

.gate__tracking-bar {
  position: absolute;
  left: -5%;
  width: 110%;
  background: rgba(255, 255, 255, 0.12);
  filter: blur(2px);
  animation: trackingSlide linear infinite;
}

@keyframes trackingSlide {
  0% { transform: translateY(-100vh); }
  100% { transform: translateY(100vh); }
}

/* ---- BIOS boot text ---- */
.gate__bios {
  position: absolute;
  inset: 0;
  padding: 3vh 4vw;
  z-index: 20;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.gate__bios-line {
  font-family: 'VT323', 'Courier New', monospace;
  font-size: clamp(0.75rem, 1.8vw, 1rem);
  color: #00ff00;
  line-height: 1.5;
  white-space: pre;
  text-shadow: 0 0 4px rgba(0, 255, 0, 0.4);
}

.gate__bios-line--warn {
  color: #ffcc00;
  text-shadow: 0 0 4px rgba(255, 204, 0, 0.4);
}

.gate__bios-line--err {
  color: #ff0000;
  text-shadow: 0 0 6px rgba(255, 0, 0, 0.5);
}

.gate__bios-cursor {
  font-family: 'VT323', 'Courier New', monospace;
  font-size: clamp(0.75rem, 1.8vw, 1rem);
  color: #00ff00;
  animation: biosCursorBlink 0.5s step-end infinite;
}

@keyframes biosCursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* ---- Message screen (VHS playback) ---- */
.gate__message-screen {
  position: absolute;
  inset: 0;
  z-index: 20;
}

/* REC indicator */
.gate__rec {
  position: absolute;
  top: 4vh;
  left: 4vw;
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-family: 'VT323', 'Courier New', monospace;
  font-size: clamp(0.8rem, 1.6vw, 1.1rem);
  color: #ff0000;
  z-index: 25;
  text-shadow: 0 0 6px rgba(255, 0, 0, 0.5);
}

.gate__rec-dot {
  animation: recBlink 1s step-end infinite;
}

@keyframes recBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.gate__rec-text {
  font-weight: bold;
  letter-spacing: 0.15em;
}

.gate__rec-timestamp {
  color: #d0d0d0;
  text-shadow: none;
  margin-left: 1em;
}

/* Center text */
.gate__center-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 25;
}

.gate__typed {
  font-family: 'VT323', 'Courier New', monospace;
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  color: #d0d0d0;
  letter-spacing: 0.2em;
  white-space: nowrap;
  text-shadow:
    0 0 10px rgba(0, 255, 0, 0.3),
    0 0 30px rgba(0, 255, 0, 0.1);
}

.gate__cursor {
  font-family: 'VT323', 'Courier New', monospace;
  font-size: clamp(1.8rem, 5vw, 3.5rem);
  color: #00ff00;
  animation: msgCursorBlink 0.5s step-end infinite;
  margin-left: 2px;
}

@keyframes msgCursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* VHS counter */
.gate__vhs-counter {
  position: absolute;
  bottom: 4vh;
  right: 4vw;
  font-family: 'VT323', 'Courier New', monospace;
  font-size: clamp(0.7rem, 1.4vw, 1rem);
  color: #d0d0d0;
  letter-spacing: 0.1em;
  z-index: 25;
  text-shadow: 0 0 4px rgba(200, 200, 200, 0.2);
}

/* ---- Static burst (final) ---- */
.gate__burst {
  position: absolute;
  inset: 0;
  z-index: 60;
  background: #000;
  animation: burstFlash 0.8s steps(1) forwards;
}

@keyframes burstFlash {
  0%   { background: #fff; }
  10%  { background: #888; }
  20%  { background: #fff; }
  35%  { background: #333; }
  50%  { background: #fff; }
  65%  { background: #111; }
  80%  { background: #000; }
  100% { background: #000; }
}

/* ---- Vignette on entire gate ---- */
.gate::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(0, 0, 0, 0.6) 100%
  );
  pointer-events: none;
  z-index: 45;
}

/* ---- Skip hint ---- */
.gate__skip {
  position: absolute;
  bottom: 5vh;
  left: 50%;
  transform: translateX(-50%);
  z-index: 55;
  font-family: 'VT323', 'Courier New', monospace;
  font-size: 0.7rem;
  color: rgba(200, 200, 200, 0.15);
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
