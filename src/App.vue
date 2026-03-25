<template>
  <div class="app" @click="onClick">
    <!-- Boot sequence entrance -->
    <WormholeGate v-if="!entered" @enter="entered = true" />

    <!-- Main site -->
    <template v-if="entered">
      <div class="app__crt-vignette"></div>
      <div class="app__layout">
        <AppNav />
        <main class="app__content">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
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

const entered = ref(false)

useKonamiCode()
const { onClick } = useRapidClick()
</script>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
}
.app__crt-vignette {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9000;
  background: radial-gradient(
    ellipse at center,
    transparent 55%,
    rgba(0, 0, 0, 0.35) 80%,
    rgba(0, 0, 0, 0.7) 100%
  );
}
.app__layout {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}
.app__content {
  min-height: 60vh;
  padding: 30px 0;
}
@media (max-width: 768px) {
  .app__layout {
    padding: 0 10px;
    padding-bottom: 70px;
  }
}
</style>
