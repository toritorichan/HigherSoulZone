<template>
  <div class="alien-types">
    <!-- Scan-line overlay -->
    <div class="alien-types__scanlines" />

    <div ref="contentRef" class="alien-types__content">
      <h2 class="alien-types__heading">我們是誰</h2>

      <div class="alien-types__intro-scatter">
        <p class="alien-types__intro alien-types__intro--left tw">{{ alienIntro }}</p>
        <span class="noise-symbol noise-symbol--a">✧</span>
        <p class="alien-types__intro alien-types__intro--right tw">{{ alienIntro2 }}</p>
      </div>

      <div class="noise-divider">◦ ✦ ▽ △ ✧ ◦ ✦ ▽ △ ✧</div>

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
            <div
              class="alien-card__image-wrap"
              :class="`alien-card__image-wrap--${imageVariants[index % imageVariants.length]}`"
              :style="imageWrapStyle(index)"
            >
              <img
                :src="`${base}${alien.image}`"
                :alt="alien.nameCn"
                class="alien-card__image"
              >
            </div>
            <div class="alien-card__body">
              <h3 class="alien-card__name-cn" :style="{ color: alien.color }">{{ alien.nameCn }}</h3>
              <p class="alien-card__name-en">{{ alien.nameEn }}</p>
              <p class="alien-card__desc tw">{{ alien.description }}</p>
            </div>
            <div
              class="alien-card__glow"
              :style="glowStyle(index, alien.color)"
            />
          </div>
        </template>
      </div>

      <div class="noise-divider noise-divider--bottom">△ ✧ ◦ ✦ ▽ △ ✧ ◦ ✦ ▽</div>
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
  const rotations = [-1.5, 0.8, -0.5, 1.2, -0.8, 0.5, -1, 0.7]
  const offsets = [0, 30, -20, 40, -10, 25, -30, 15]
  const paddings = ['1.5rem', '2rem 1.5rem', '1.2rem', '1.8rem', '1.5rem 2rem', '1.3rem', '2rem', '1.5rem']
  return {
    '--alien-color': aliens[index]?.color ?? '#888',
    transform: `rotate(${rotations[index % rotations.length]}deg)`,
    marginLeft: `${offsets[index % offsets.length]}px`,
    padding: paddings[index % paddings.length],
    animationDelay: `${index * 0.15}s`,
  }
}

function imageWrapStyle(index) {
  const sizes = [140, 180, 120, 200, 150, 170, 130, 160]
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

/* Scan-line overlay */
.alien-types__scanlines {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.03) 2px,
    rgba(0, 0, 0, 0.03) 3px
  );
}

.alien-types__heading {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  letter-spacing: 0.15em;
  transform: rotate(-0.5deg);
}

/* Scattered intro text */
.alien-types__intro-scatter {
  position: relative;
}

.alien-types__intro {
  color: var(--color-text-dim);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.alien-types__intro--left {
  transform: rotate(-0.3deg);
  margin-right: 40px;
}

.alien-types__intro--right {
  transform: rotate(0.4deg);
  margin-left: 30px;
}

.noise-symbol {
  display: block;
  text-align: center;
  color: var(--color-primary);
  opacity: 0.3;
  font-size: 1.2rem;
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
  font-size: 0.9rem;
  letter-spacing: 0.5em;
  margin: 2rem 0;
  user-select: none;
}

.noise-divider--bottom {
  margin-top: 3rem;
}

.noise-between {
  text-align: center;
  color: var(--color-primary);
  opacity: 0.25;
  font-size: 1.1rem;
  letter-spacing: 0.8em;
  padding: 0.5rem 0;
  user-select: none;
}

/* Grid — no longer uniform */
.alien-types__grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

/* Base card */
.alien-card {
  display: flex;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: none;
  border-radius: 4px;
  transition: box-shadow 0.3s, transform 0.3s;
  cursor: pointer;
  position: relative;
  animation-duration: 0.7s;
  animation-timing-function: ease-out;
  animation-fill-mode: both;
}

.alien-card:hover {
  box-shadow: 0 0 20px color-mix(in srgb, var(--alien-color) 35%, transparent);
  z-index: 2;
}

/* Card size variants */
.alien-card--size-wide {
  max-width: 100%;
}

.alien-card--size-tall .alien-card__body {
  min-height: 180px;
}

.alien-card--size-normal {
  max-width: 90%;
}

/* Glow layer */
.alien-card__glow {
  position: absolute;
  inset: 0;
  border-radius: 4px;
  pointer-events: none;
}

/* Image wrap variants */
.alien-card__image-wrap {
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 4px;
}

.alien-card__image-wrap--torn-a {
  clip-path: polygon(2% 0%, 98% 3%, 100% 95%, 3% 100%);
  border-radius: 0;
}

.alien-card__image-wrap--torn-b {
  clip-path: polygon(0% 4%, 95% 0%, 100% 98%, 5% 96%);
  border-radius: 0;
}

.alien-card__image-wrap--torn-c {
  clip-path: polygon(4% 2%, 100% 0%, 96% 100%, 0% 97%);
  border-radius: 0;
}

.alien-card__image-wrap--round {
  border-radius: 50%;
}

.alien-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.alien-card__body {
  flex: 1;
  min-width: 0;
}

.alien-card__name-cn {
  font-family: var(--font-heading);
  font-size: 1.3rem;
  margin-bottom: 0.25rem;
}

.alien-card__name-en {
  font-size: 0.85rem;
  color: var(--color-text-dim);
  margin-bottom: 0.75rem;
  letter-spacing: 0.1em;
}

.alien-card__desc {
  color: var(--color-text-dim);
  font-size: 0.9rem;
  line-height: 1.7;
}

/* Unique entry animations per direction */
.alien-card--entry-left {
  animation-name: slideFromLeft;
}

.alien-card--entry-right {
  animation-name: slideFromRight;
}

.alien-card--entry-top {
  animation-name: slideFromTop;
}

.alien-card--entry-bottom {
  animation-name: slideFromBottom;
}

@keyframes slideFromLeft {
  from {
    opacity: 0;
    transform: translateX(-60px) rotate(-3deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
}

@keyframes slideFromRight {
  from {
    opacity: 0;
    transform: translateX(60px) rotate(3deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
}

@keyframes slideFromTop {
  from {
    opacity: 0;
    transform: translateY(-40px) rotate(-2deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

@keyframes slideFromBottom {
  from {
    opacity: 0;
    transform: translateY(40px) rotate(2deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotate(0deg);
  }
}

@media (max-width: 600px) {
  .alien-card {
    flex-direction: column;
    margin-left: 0 !important;
  }

  .alien-card__image-wrap {
    width: 100% !important;
    height: 200px !important;
  }

  .alien-card--size-normal {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .alien-types {
    padding: 1.5rem 1rem;
  }
  .alien-types__heading {
    font-size: 1.5rem;
  }
  .alien-types__intro--left {
    margin-right: 0;
  }
  .alien-types__intro--right {
    margin-left: 0;
  }
  .alien-card {
    flex-direction: column;
    margin-left: 0 !important;
  }
  .alien-card__image-wrap {
    width: 100% !important;
    height: 180px !important;
  }
  .alien-card--size-normal {
    max-width: 100%;
  }
  .alien-card__name-cn {
    font-size: 1.1rem;
  }
  .alien-card__desc {
    font-size: 0.85rem;
  }
}
</style>
