<template>
  <div class="app" @click="onClick">
    <!-- Phase 1: Wormhole entrance -->
    <transition name="gate-fade">
      <WormholeGate v-if="phase === 'wormhole'" @enter="onWormholeDone" />
    </transition>

    <!-- Phase 2: Banner reveal (mobile: centered, fades in then out) -->
    <div v-if="phase === 'banner'" class="app__banner-reveal">
      <AppBanner />
    </div>

    <!-- Phase 3: Full site -->
    <template v-if="phase === 'site'">
      <div class="app__geometric app__geometric--circle"></div>
      <div class="app__geometric app__geometric--square"></div>
      <div class="app__layout">
        <div class="app__header">
          <AppBanner />
          <AppNav />
        </div>
        <main class="app__content">
          <router-view v-slot="{ Component }">
            <transition name="wormhole" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
        <AppFooter />
      </div>
      <KonamiOverlay />
      <MatrixRain />
      <UfoFlyby />
      <AlienLanguageFilter />
      <CreepyEffects />
      <CreepySelect />
      <CursedMode />
      <MorseCodeEgg />
      <SecretWordEgg />
      <MobileEggs />
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import WormholeGate from './components/WormholeGate.vue'
import AppBanner from './components/layout/AppBanner.vue'
import AppNav from './components/layout/AppNav.vue'
import AppFooter from './components/layout/AppFooter.vue'
import KonamiOverlay from './components/easter-eggs/KonamiOverlay.vue'
import MatrixRain from './components/easter-eggs/MatrixRain.vue'
import UfoFlyby from './components/easter-eggs/UfoFlyby.vue'
import AlienLanguageFilter from './components/easter-eggs/AlienLanguageFilter.vue'
import CreepyEffects from './components/easter-eggs/CreepyEffects.vue'
import CreepySelect from './components/easter-eggs/CreepySelect.vue'
import CursedMode from './components/easter-eggs/CursedMode.vue'
import MorseCodeEgg from './components/easter-eggs/MorseCodeEgg.vue'
import SecretWordEgg from './components/easter-eggs/SecretWordEgg.vue'
import MobileEggs from './components/easter-eggs/MobileEggs.vue'
import { useKonamiCode } from './composables/useKonamiCode'
import { useRapidClick } from './composables/useRapidClick'

const phase = ref('wormhole') // 'wormhole' → 'banner' → 'site'

function onWormholeDone() {
  phase.value = 'banner'
  // Banner fades in, stays 2.5s, fades out, then show site
  setTimeout(() => {
    phase.value = 'site'
  }, 3500)
}

useKonamiCode()
const { onClick } = useRapidClick()
</script>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
}
.app__geometric {
  position: fixed;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.04);
  z-index: 0;
}
.app__geometric--circle {
  width: 300px; height: 300px;
  border-radius: 50%;
  top: 10%; left: 5%;
}
.app__geometric--square {
  width: 150px; height: 150px;
  bottom: 15%; right: 8%;
  transform: rotate(45deg);
}

/* Banner reveal phase */
.app__banner-reveal {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: bannerReveal 3.5s ease-in-out forwards;
}

@keyframes bannerReveal {
  0% { opacity: 0; }
  15% { opacity: 1; }
  70% { opacity: 1; }
  100% { opacity: 0; }
}

.app__layout {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
  animation: siteEnter 1s ease-out;
}
.app__content {
  min-height: 60vh;
  padding: 30px 0;
}
.app__header {
  position: relative;
}

/* Gate fade out */
.gate-fade-leave-active {
  transition: opacity 0.8s ease;
}
.gate-fade-leave-to {
  opacity: 0;
}

@keyframes siteEnter {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .app__layout {
    padding: 0 10px;
    padding-bottom: 70px;
  }
}
</style>
