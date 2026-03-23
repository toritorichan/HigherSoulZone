<template>
  <Teleport to="body">
    <!-- Shake to Glitch overlay -->
    <transition name="glitch-fade">
      <div v-if="shakeActive" class="glitch-overlay">
        <div class="glitch-overlay__text">{{ shakeMessage }}</div>
      </div>
    </transition>

    <!-- Tilt to Reveal edge text -->
    <div
      v-if="tiltVisible"
      class="tilt-text"
      :class="tiltSide === 'left' ? 'tilt-text--left' : 'tilt-text--right'"
      :style="{ opacity: tiltOpacity }"
    >
      {{ tiltMessage }}
    </div>

    <!-- Long Press ripple + message -->
    <div
      v-if="longPressActive"
      class="longpress-ripple"
      :style="{ left: longPressX + 'px', top: longPressY + 'px' }"
    >
      <div class="longpress-ripple__ring"></div>
      <div class="longpress-ripple__text">{{ longPressMessage }}</div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { garble } from '../../utils/garble.js'

const isTouchDevice = ref(false)
let sensorsReady = false

// ---- Easter Egg 1: Shake to Glitch ----
const shakeActive = ref(false)
const shakeMessage = ref('')
let lastShakeTime = 0
const SHAKE_COOLDOWN = 5000
const SHAKE_THRESHOLD = 15
let lastAccel = { x: 0, y: 0, z: 0 }

function handleMotion(event) {
  const acc = event.accelerationIncludingGravity
  if (!acc || acc.x == null) return

  const dx = Math.abs(acc.x - lastAccel.x)
  const dy = Math.abs(acc.y - lastAccel.y)
  const dz = Math.abs(acc.z - lastAccel.z)
  const delta = dx + dy + dz

  lastAccel = { x: acc.x, y: acc.y, z: acc.z }

  const now = Date.now()
  if (delta > SHAKE_THRESHOLD && now - lastShakeTime > SHAKE_COOLDOWN) {
    lastShakeTime = now
    triggerShakeGlitch()
  }
}

function triggerShakeGlitch() {
  shakeMessage.value = garble('通訊干擾中...', 0.6)
  shakeActive.value = true
  if (navigator.vibrate) navigator.vibrate([50, 30, 50])
  setTimeout(() => { shakeActive.value = false }, 1500)
}

// ---- Easter Egg 2: Tilt to Reveal ----
const tiltVisible = ref(false)
const tiltSide = ref('left')
const tiltOpacity = ref(0)
const tiltMessage = ref('')
const TILT_THRESHOLD = 35

function handleOrientation(event) {
  const gamma = event.gamma
  if (gamma == null) return

  const absGamma = Math.abs(gamma)

  if (absGamma > TILT_THRESHOLD) {
    tiltSide.value = gamma < 0 ? 'left' : 'right'
    const rawOpacity = (absGamma - TILT_THRESHOLD) / (90 - TILT_THRESHOLD)
    tiltOpacity.value = Math.min(rawOpacity, 0.85)
    if (!tiltVisible.value) {
      tiltMessage.value = garble('他們就在你旁邊', 0.5)
    }
    tiltVisible.value = true
  } else {
    tiltVisible.value = false
    tiltOpacity.value = 0
  }
}

// ---- Easter Egg 3: Long Press Secret ----
const longPressActive = ref(false)
const longPressX = ref(0)
const longPressY = ref(0)
const longPressMessage = ref('')
const LONG_PRESS_DURATION = 2000
const LONG_PRESS_MOVE_TOLERANCE = 10

let pressTimer = null
let pressStartX = 0
let pressStartY = 0
let pressStarted = false

function handleTouchStart(event) {
  if (event.touches.length !== 1) return
  const touch = event.touches[0]
  pressStartX = touch.clientX
  pressStartY = touch.clientY
  pressStarted = true

  pressTimer = setTimeout(() => {
    if (!pressStarted) return
    triggerLongPress(pressStartX, pressStartY)
  }, LONG_PRESS_DURATION)
}

function handleTouchMove(event) {
  if (!pressStarted || !pressTimer) return
  const touch = event.touches[0]
  const dx = Math.abs(touch.clientX - pressStartX)
  const dy = Math.abs(touch.clientY - pressStartY)
  if (dx > LONG_PRESS_MOVE_TOLERANCE || dy > LONG_PRESS_MOVE_TOLERANCE) {
    cancelPress()
  }
}

function handleTouchEnd() {
  cancelPress()
}

function cancelPress() {
  pressStarted = false
  if (pressTimer) {
    clearTimeout(pressTimer)
    pressTimer = null
  }
}

function triggerLongPress(x, y) {
  pressStarted = false
  longPressX.value = x
  longPressY.value = y
  longPressMessage.value = garble('你觸碰到了裂縫', 0.5)
  longPressActive.value = true
  if (navigator.vibrate) navigator.vibrate(100)
  setTimeout(() => { longPressActive.value = false }, 2000)
}

// ---- iOS requires permission request for DeviceMotion/Orientation ----
async function requestSensorPermissions() {
  // iOS 13+ requires explicit permission
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    try {
      const motionPerm = await DeviceMotionEvent.requestPermission()
      if (motionPerm === 'granted') {
        window.addEventListener('devicemotion', handleMotion)
      }
    } catch { /* denied or error */ }
  } else if ('DeviceMotionEvent' in window) {
    window.addEventListener('devicemotion', handleMotion)
  }

  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    try {
      const orientPerm = await DeviceOrientationEvent.requestPermission()
      if (orientPerm === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation)
      }
    } catch { /* denied or error */ }
  } else if ('DeviceOrientationEvent' in window) {
    window.addEventListener('deviceorientation', handleOrientation)
  }

  sensorsReady = true
}

// ---- Lifecycle ----
onMounted(() => {
  isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  if (!isTouchDevice.value) return

  // Request sensor permissions on first user interaction (required by iOS)
  function onFirstInteraction() {
    if (!sensorsReady) requestSensorPermissions()
    document.removeEventListener('touchstart', onFirstInteraction)
    document.removeEventListener('click', onFirstInteraction)
  }
  document.addEventListener('touchstart', onFirstInteraction, { once: true })
  document.addEventListener('click', onFirstInteraction, { once: true })

  // Long press detection
  document.addEventListener('touchstart', handleTouchStart, { passive: true })
  document.addEventListener('touchmove', handleTouchMove, { passive: true })
  document.addEventListener('touchend', handleTouchEnd, { passive: true })
  document.addEventListener('touchcancel', handleTouchEnd, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('devicemotion', handleMotion)
  window.removeEventListener('deviceorientation', handleOrientation)
  document.removeEventListener('touchstart', handleTouchStart)
  document.removeEventListener('touchmove', handleTouchMove)
  document.removeEventListener('touchend', handleTouchEnd)
  document.removeEventListener('touchcancel', handleTouchEnd)
  cancelPress()
})
</script>

<style scoped>
/* ===== Shake to Glitch ===== */
.glitch-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.6);
  animation: glitchScreen 1.5s ease-out forwards;
}
.glitch-overlay__text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  color: var(--color-primary);
  text-shadow: 2px 0 #ff0044, -2px 0 #00ffcc, 0 0 20px rgba(0, 255, 136, 0.6);
  animation: glitchText 0.15s infinite alternate;
  letter-spacing: 4px;
}
@keyframes glitchScreen {
  0% { filter: invert(1) hue-rotate(90deg); opacity: 1; }
  15% { filter: invert(0) hue-rotate(0deg); }
  30% { filter: invert(1) hue-rotate(180deg); }
  45% { filter: invert(0); }
  100% { filter: none; opacity: 0; }
}
@keyframes glitchText {
  0% { transform: translate(-2px, 1px) skewX(-2deg); }
  100% { transform: translate(2px, -1px) skewX(2deg); }
}
.glitch-fade-enter-active { transition: opacity 0.05s; }
.glitch-fade-leave-active { transition: opacity 0.3s ease-out; }
.glitch-fade-enter-from, .glitch-fade-leave-to { opacity: 0; }

/* ===== Tilt to Reveal ===== */
.tilt-text {
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  z-index: 99998;
  pointer-events: none;
  font-family: var(--font-display);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 0 10px rgba(0, 255, 136, 0.4);
  writing-mode: vertical-rl;
  letter-spacing: 6px;
  padding: 1rem 0.5rem;
  transition: opacity 0.3s ease;
}
.tilt-text--left { left: 4px; }
.tilt-text--right { right: 4px; }

/* ===== Long Press Secret ===== */
.longpress-ripple {
  position: fixed;
  z-index: 99998;
  pointer-events: none;
  transform: translate(-50%, -50%);
}
.longpress-ripple__ring {
  position: absolute;
  top: 50%; left: 50%;
  width: 20px; height: 20px;
  transform: translate(-50%, -50%);
  border: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: rippleExpand 1.2s ease-out forwards;
  opacity: 0.8;
}
.longpress-ripple__text {
  position: absolute;
  top: -30px; left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: 0.8rem;
  color: var(--color-primary);
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.5);
  animation: longpressTextFade 2s ease-out forwards;
  letter-spacing: 2px;
}
@keyframes rippleExpand {
  0% { width: 20px; height: 20px; opacity: 0.8; border-width: 2px; }
  100% { width: 200px; height: 200px; opacity: 0; border-width: 1px; }
}
@keyframes longpressTextFade {
  0% { opacity: 0; transform: translateX(-50%) translateY(0); }
  20% { opacity: 1; }
  80% { opacity: 1; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}
</style>
