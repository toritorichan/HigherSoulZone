<template>
  <div class="app" @click="onClick">
    <div class="app__geometric app__geometric--circle"></div>
    <div class="app__geometric app__geometric--square"></div>
    <div class="app__layout">
      <AppBanner />
      <AppNav />
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
    <MouseParticles />
    <CreepyEffects />
    <CreepySelect />
    <CursedMode />
  </div>
</template>

<script setup>
import AppBanner from './components/layout/AppBanner.vue'
import AppNav from './components/layout/AppNav.vue'
import AppFooter from './components/layout/AppFooter.vue'
import KonamiOverlay from './components/easter-eggs/KonamiOverlay.vue'
import MatrixRain from './components/easter-eggs/MatrixRain.vue'
import UfoFlyby from './components/easter-eggs/UfoFlyby.vue'
import AlienLanguageFilter from './components/easter-eggs/AlienLanguageFilter.vue'
import MouseParticles from './components/easter-eggs/MouseParticles.vue'
import CreepyEffects from './components/easter-eggs/CreepyEffects.vue'
import CreepySelect from './components/easter-eggs/CreepySelect.vue'
import CursedMode from './components/easter-eggs/CursedMode.vue'
import { useKonamiCode } from './composables/useKonamiCode'
import { useRapidClick } from './composables/useRapidClick'

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
</style>
