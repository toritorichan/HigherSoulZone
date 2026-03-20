<template>
  <transition name="fade">
    <div v-if="showOverlay" class="konami-overlay" @click="dismiss">
      <div ref="ufoRef" class="konami__ufo">
        <div class="ufo__dome"></div>
        <div class="ufo__body"></div>
        <div ref="beamRef" class="ufo__beam"></div>
      </div>
      <div ref="alienRef" class="konami__alien">
        <div class="alien__head"></div>
        <div class="alien__body"></div>
        <div class="alien__arm alien__arm--left"></div>
        <div class="alien__arm alien__arm--right"></div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { useEasterEggStore } from '../../stores/easterEgg'
import gsap from 'gsap'

const store = useEasterEggStore()
const showOverlay = ref(false)
const ufoRef = ref(null)
const beamRef = ref(null)
const alienRef = ref(null)

watch(() => store.konamiActivated, async (activated) => {
  if (activated) {
    showOverlay.value = true
    await nextTick()
    playAnimation()
  }
})

function playAnimation() {
  const tl = gsap.timeline()

  tl.fromTo(ufoRef.value,
    { y: -200, opacity: 0 },
    { y: window.innerHeight / 2 - 100, opacity: 1, duration: 2, ease: 'power2.out' }
  )
  .fromTo(beamRef.value,
    { scaleY: 0, opacity: 0 },
    { scaleY: 1, opacity: 1, duration: 0.5 }
  )
  .fromTo(alienRef.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.5 }
  )
  .to({}, { duration: 2 })
  .to([ufoRef.value, beamRef.value, alienRef.value],
    { y: -500, opacity: 0, duration: 1.5, ease: 'power2.in' }
  )
  .call(() => { showOverlay.value = false })
}

function dismiss() {
  showOverlay.value = false
}
</script>

<style scoped>
.konami-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
}

.konami__ufo {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 0;
}

.ufo__body {
  width: 120px;
  height: 30px;
  background: linear-gradient(to bottom, #888, #444);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 255, 136, 0.3);
}

.ufo__dome {
  width: 50px;
  height: 25px;
  background: radial-gradient(ellipse, rgba(0, 255, 136, 0.6), rgba(0, 255, 136, 0.1));
  border-radius: 50% 50% 0 0;
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
}

.ufo__beam {
  width: 40px;
  height: 200px;
  background: linear-gradient(to bottom, rgba(0, 255, 136, 0.4), transparent);
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
  transform-origin: top center;
  margin-top: 2px;
}

.konami__alien {
  position: absolute;
  bottom: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 0;
}

.alien__head {
  width: 20px;
  height: 24px;
  background: #00ff88;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
}

.alien__body {
  width: 14px;
  height: 28px;
  background: #00cc66;
  border-radius: 4px;
  margin-top: 2px;
}

.alien__arm {
  position: absolute;
  width: 6px;
  height: 20px;
  background: #00cc66;
  border-radius: 3px;
  top: 26px;
  animation: wave 0.6s ease-in-out infinite alternate;
}

.alien__arm--left {
  left: -8px;
  transform-origin: top center;
  animation-delay: 0s;
}

.alien__arm--right {
  right: -8px;
  transform-origin: top center;
  animation-delay: 0.3s;
}

@keyframes wave {
  0% {
    transform: rotate(-30deg);
  }
  100% {
    transform: rotate(30deg);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
