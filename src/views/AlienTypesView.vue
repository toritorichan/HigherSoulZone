<template>
  <div class="alien-types">
    <!-- CRT scan-line overlay -->
    <div class="alien-types__scanlines" />

    <div ref="contentRef" class="alien-types__content">
      <h2 class="alien-types__heading">[FILE: aliens.dat]</h2>
      <div class="alien-types__status">STATUS: LOADING... ████████ CORRUPTED</div>

      <div class="alien-types__intro-scatter">
        <p class="alien-types__intro tw">{{ alienIntro }}</p>
        <span class="noise-symbol noise-symbol--a">✧</span>
        <p class="alien-types__intro tw">{{ alienIntro2 }}</p>
      </div>

      <div class="noise-divider">─── ✦ ── ✧ ── ◦ ── ✦ ───</div>

      <div class="alien-types__grid">
        <template v-for="(alien, index) in aliens" :key="alien.id">
          <!-- Noise symbols between cards -->
          <div v-if="index > 0" class="noise-between">
            {{ noiseSymbols[index % noiseSymbols.length] }}
          </div>

          <div
            class="alien-card"
            :class="[
              `alien-card--entry-${entryDirections[index % entryDirections.length]}`,
              `alien-card--size-${cardSizes[index % cardSizes.length]}`
            ]"
            :style="cardStyle(index)"
            @click="playAlienSound(alien.soundType)"
          >
            <div class="alien-card__record-header">
              <span class="alien-card__record-id">RECORD #{{ String(index + 1).padStart(3, '0') }}</span>
              <span class="alien-card__record-sep">|</span>
              <span class="alien-card__record-name" :style="{ color: alien.color }">{{ alien.nameEn.toUpperCase() }}</span>
              <span class="alien-card__record-sep">|</span>
              <span class="alien-card__record-status">STATUS: ████████</span>
            </div>

            <div class="alien-card__content-row">
              <div
                class="alien-card__image-wrap"
                :style="imageWrapStyle(index)"
              >
                <img
                  :src="`${base}${alien.image}`"
                  :alt="alien.nameCn"
                  class="alien-card__image"
                >
                <div class="alien-card__image-scanlines"></div>
              </div>
              <div class="alien-card__body">
                <h3 class="alien-card__name-cn" :style="{ color: alien.color }">{{ alien.nameCn }}</h3>
                <p class="alien-card__name-en">{{ alien.nameEn }}</p>
                <p class="alien-card__desc tw">{{ alien.description }}</p>
              </div>
            </div>
            <div
              class="alien-card__glow"
              :style="glowStyle(index, alien.color)"
            />
          </div>
        </template>
      </div>

      <div class="noise-divider noise-divider--bottom">─── ✧ ── ◦ ── ✦ ── ✧ ───</div>
      <div class="alien-types__eof">[EOF] — aliens.dat — {{ aliens.length }} records found</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { aliens, alienIntro, alienIntro2 } from '../data/aliens.js'

const base = import.meta.env.BASE_URL
import { useCopyProtection } from '../composables/useCopyProtection.js'
import { useTypewriter } from '../composables/useTypewriter.js'
import { useAudio } from '../composables/useAudio.js'

const contentRef = ref(null)
useCopyProtection(contentRef)
useTypewriter(contentRef)

const { playAlienSound } = useAudio()

const noiseSymbols = ['✧', '◦', '✦', '▽', '△', '✧ ◦', '▽ ✦', '△ ✧']

const entryDirections = ['left', 'right', 'top', 'bottom', 'left', 'right', 'top', 'bottom']

const cardSizes = ['wide', 'tall', 'normal', 'wide', 'tall', 'normal', 'wide', 'normal']

const imageVariants = ['torn-a', 'torn-b', 'round', 'torn-a', 'torn-c', 'round', 'torn-b', 'torn-c']

function cardStyle(index) {
  const offsets = [0, 15, -10, 20, -5, 12, -15, 8]
  return {
    '--alien-color': aliens[index]?.color ?? '#888',
    marginLeft: `${offsets[index % offsets.length]}px`,
    animationDelay: `${index * 0.15}s`,
  }
}

function imageWrapStyle(index) {
  const sizes = [140, 160, 120, 180, 140, 160, 130, 150]
  const size = sizes[index % sizes.length]
  return {
    width: `${size}px`,
    height: `${size}px`,
  }
}

function glowStyle(index, color) {
  const intensities = [0.15, 0.35, 0.1, 0.4, 0.2, 0.3, 0.12, 0.25]
  const spreads = [10, 20, 8, 25, 12, 18, 9, 15]
  const intensity = intensities[index % intensities.length]
  const spread = spreads[index % spreads.length]
  return {
    boxShadow: `0 0 ${spread}px rgba(${hexToRgb(color)}, ${intensity})`,
  }
}

function hexToRgb(hex) {
  if (!hex) return '136, 136, 136'
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '136, 136, 136'
  return `${r}, ${g}, ${b}`
}

onMounted(async () => {
  await nextTick()
})
</script>

<style scoped>
.alien-types {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
}

/* CRT Scan-line overlay */
.alien-types__scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.04) 2px,
      rgba(0, 0, 0, 0.04) 3px
    ),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.02),
      rgba(0, 255, 0, 0.01),
      rgba(0, 0, 255, 0.02)
    );
  background-size: 100% 3px, 3px 100%;
}

.alien-types__heading {
  font-family: var(--font-system);
  font-size: 1.8rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
}

.alien-types__status {
  font-family: var(--font-body);
  font-size: 0.75rem;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  margin-bottom: 2rem;
  opacity: 0.7;
}

/* Intro text */
.alien-types__intro-scatter {
  position: relative;
}

.alien-types__intro {
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  opacity: 0.75;
}

.noise-symbol {
  display: block;
  text-align: center;
  color: var(--color-primary);
  opacity: 0.15;
  font-size: 1rem;
  letter-spacing: 1em;
  user-select: none;
}

.noise-symbol--a {
  margin: -0.5rem 0 0.5rem 0;
}

.noise-divider {
  text-align: center;
  color: var(--color-primary);
  opacity: 0.2;
  font-family: var(--font-system);
  font-size: 0.8rem;
  letter-spacing: 0.3em;
  margin: 2rem 0;
  user-select: none;
}

.noise-divider--bottom {
  margin-top: 3rem;
}

.noise-between {
  text-align: center;
  color: var(--color-primary);
  opacity: 0.15;
  font-size: 0.9rem;
  letter-spacing: 0.8em;
  padding: 0.5rem 0;
  user-select: none;
}

/* Grid */
.alien-types__grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

/* Base card — corrupted database record style */
.alien-card {
  display: flex;
  flex-direction: column;
  gap: 0;
  background: rgba(0, 255, 0, 0.02);
  border: 1px dashed rgba(0, 255, 0, 0.2);
  padding: 0;
  cursor: pointer;
  position: relative;
}

.alien-card:hover {
  border-color: rgba(0, 255, 0, 0.5);
  box-shadow: 0 0 15px rgba(0, 255, 0, 0.1);
  z-index: 2;
}

/* Record header */
.alien-card__record-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.6rem 1rem;
  background: rgba(0, 255, 0, 0.05);
  border-bottom: 1px dashed rgba(0, 255, 0, 0.15);
  font-family: var(--font-system);
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  flex-wrap: wrap;
}

.alien-card__record-id {
  color: var(--color-primary);
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.alien-card__record-sep {
  color: rgba(0, 255, 0, 0.3);
}

.alien-card__record-name {
  font-weight: bold;
  letter-spacing: 0.15em;
}

.alien-card__record-status {
  color: var(--color-accent);
  opacity: 0.6;
}

/* Content row */
.alien-card__content-row {
  display: flex;
  gap: 1.5rem;
  padding: 1.2rem;
}

/* Card size variants */
.alien-card--size-wide {
  max-width: 100%;
}

.alien-card--size-tall .alien-card__body {
  min-height: 160px;
}

.alien-card--size-normal {
  max-width: 95%;
}

/* Glow layer */
.alien-card__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

/* Image wrap with CRT scanlines + green tint */
.alien-card__image-wrap {
  flex-shrink: 0;
  overflow: hidden;
  position: relative;
  border: 1px dashed rgba(0, 255, 0, 0.15);
}

.alien-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: saturate(0.4) brightness(0.85) sepia(0.15) hue-rotate(80deg);
}

.alien-card__image-scanlines {
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.2) 2px,
      rgba(0, 0, 0, 0.2) 3px
    );
  pointer-events: none;
  mix-blend-mode: multiply;
}

.alien-card__body {
  flex: 1;
  min-width: 0;
}

.alien-card__name-cn {
  font-family: var(--font-heading);
  font-size: 1.2rem;
  margin-bottom: 0.25rem;
}

.alien-card__name-en {
  font-family: var(--font-system);
  font-size: 0.8rem;
  color: var(--color-text-dim);
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
}

.alien-card__desc {
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: 0.88rem;
  line-height: 1.7;
  opacity: 0.75;
}

/* EOF marker */
.alien-types__eof {
  font-family: var(--font-system);
  font-size: 0.7rem;
  color: var(--color-text-dim);
  text-align: center;
  margin-top: 1rem;
  letter-spacing: 0.1em;
  opacity: 0.4;
}

@media (max-width: 600px) {
  .alien-card__content-row {
    flex-direction: column;
  }
  .alien-card__image-wrap {
    width: 100% !important;
    height: 180px !important;
  }
  .alien-card--size-normal {
    max-width: 100%;
  }
  .alien-card__record-header {
    font-size: 0.65rem;
    gap: 0.4rem;
  }
}

@media (max-width: 768px) {
  .alien-types {
    padding: 1.5rem 1rem;
  }
  .alien-types__heading {
    font-size: 1.3rem;
  }
  .alien-card__content-row {
    flex-direction: column;
    padding: 0.8rem;
  }
  .alien-card__image-wrap {
    width: 100% !important;
    height: 160px !important;
  }
  .alien-card--size-normal {
    max-width: 100%;
  }
  .alien-card {
    margin-left: 0 !important;
  }
  .alien-card__name-cn {
    font-size: 1.1rem;
  }
  .alien-card__desc {
    font-size: 0.82rem;
  }
}
</style>
