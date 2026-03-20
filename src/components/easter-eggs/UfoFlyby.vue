<template>
  <div class="ufo-flyby">
    <div
      v-for="ufo in activeUfos"
      :key="ufo.id"
      class="ufo-flyby__ufo"
      :class="ufo.direction"
      :style="{ top: ufo.top + 'vh' }"
    >
      <div class="ufo-flyby__body"></div>
      <div class="ufo-flyby__beam"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useEasterEggStore } from '../../stores/easterEgg'

const route = useRoute()
const store = useEasterEggStore()
const activeUfos = ref([])

const ELIGIBLE_ROUTES = ['introduce', 'alienTypes']
const SENTINEL_POSITIONS = [0.4, 0.7]

let sentinelElements = []
let observers = []
let ufoIdCounter = 0

function isEligibleRoute() {
  return ELIGIBLE_ROUTES.includes(route.name)
}

function spawnUfo(positionKey) {
  const triggered = store.markUfoTriggered(positionKey)
  if (!triggered) return

  const direction = Math.random() > 0.5 ? 'ufo-flyby__ufo--ltr' : 'ufo-flyby__ufo--rtl'
  const top = 20 + Math.random() * 60
  const id = ++ufoIdCounter

  const ufo = { id, direction, top }
  activeUfos.value = [...activeUfos.value, ufo]

  setTimeout(() => {
    activeUfos.value = activeUfos.value.filter(u => u.id !== id)
  }, 3000)
}

function createSentinels() {
  cleanupSentinels()

  if (!isEligibleRoute()) return

  nextTick(() => {
    const content = document.querySelector('.app__content')
    if (!content) return

    SENTINEL_POSITIONS.forEach((ratio, index) => {
      const sentinel = document.createElement('div')
      sentinel.style.position = 'absolute'
      sentinel.style.top = `${ratio * 100}%`
      sentinel.style.height = '1px'
      sentinel.style.width = '1px'
      sentinel.style.pointerEvents = 'none'
      sentinel.dataset.ufoSentinel = String(index)
      content.style.position = 'relative'
      content.appendChild(sentinel)
      sentinelElements.push(sentinel)

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              spawnUfo(`${route.name}-${index}`)
            }
          })
        },
        { threshold: 0 }
      )
      observer.observe(sentinel)
      observers.push(observer)
    })
  })
}

function cleanupSentinels() {
  observers.forEach(obs => obs.disconnect())
  observers = []
  sentinelElements.forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el)
  })
  sentinelElements = []
}

watch(
  () => route.name,
  () => {
    store.resetUfoPositions()
    activeUfos.value = []
    createSentinels()
  }
)

onMounted(() => {
  createSentinels()
})

onUnmounted(() => {
  cleanupSentinels()
})
</script>

<style scoped>
.ufo-flyby {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9999;
  overflow: hidden;
}

.ufo-flyby__ufo {
  position: absolute;
  width: 60px;
  height: 30px;
}

.ufo-flyby__ufo--ltr {
  animation: ufo-fly-ltr 3s ease-in-out forwards;
}

.ufo-flyby__ufo--rtl {
  animation: ufo-fly-rtl 3s ease-in-out forwards;
}

.ufo-flyby__body {
  width: 60px;
  height: 20px;
  background: radial-gradient(ellipse at center, #7afcff 0%, #3a8f91 60%, #1a4a4c 100%);
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 12px rgba(122, 252, 255, 0.6);
}

.ufo-flyby__body::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 14px;
  background: radial-gradient(ellipse at center, #b0fffc 0%, #5ad4d6 100%);
  border-radius: 50% 50% 0 0;
  box-shadow: 0 0 8px rgba(180, 255, 252, 0.5);
}

.ufo-flyby__beam {
  width: 20px;
  height: 30px;
  margin: 0 auto;
  background: linear-gradient(
    to bottom,
    rgba(122, 252, 255, 0.5),
    rgba(122, 252, 255, 0)
  );
  clip-path: polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%);
}

@keyframes ufo-fly-ltr {
  0% {
    left: -80px;
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    left: calc(100vw + 80px);
    transform: translateY(0);
  }
}

@keyframes ufo-fly-rtl {
  0% {
    right: -80px;
    left: auto;
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
  100% {
    right: calc(100vw + 80px);
    left: auto;
    transform: translateY(0);
  }
}
</style>
