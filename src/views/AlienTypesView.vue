<template>
  <div class="alien-types">
    <div ref="contentRef" class="alien-types__content">
      <h2 class="alien-types__heading">我們是誰</h2>

      <p class="alien-types__intro">{{ alienIntro }}</p>
      <p class="alien-types__intro">{{ alienIntro2 }}</p>

      <div class="alien-types__grid">
        <div
          v-for="(alien, index) in aliens"
          :key="alien.id"
          class="alien-card"
          :style="{
            '--alien-color': alien.color,
            animationDelay: `${index * 0.1}s`
          }"
          @click="playAlienSound(alien.soundType)"
        >
          <div class="alien-card__image-wrap">
            <img
              :src="alien.image"
              :alt="alien.nameCn"
              class="alien-card__image"
            >
          </div>
          <div class="alien-card__body">
            <h3 class="alien-card__name-cn">{{ alien.nameCn }}</h3>
            <p class="alien-card__name-en">{{ alien.nameEn }}</p>
            <p class="alien-card__desc">{{ alien.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { aliens, alienIntro, alienIntro2 } from '../data/aliens.js'
import { useCopyProtection } from '../composables/useCopyProtection.js'
import { useAudio } from '../composables/useAudio.js'

const contentRef = ref(null)
useCopyProtection(contentRef)

const { playAlienSound } = useAudio()
</script>

<style scoped>
.alien-types {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.alien-types__heading {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.alien-types__intro {
  color: var(--color-text-dim);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.alien-types__grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 2rem;
}

.alien-card {
  display: flex;
  gap: 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 1.5rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  animation: slideIn 0.6s ease-out both;
}

.alien-card:hover {
  border-color: var(--alien-color);
  box-shadow: 0 0 15px color-mix(in srgb, var(--alien-color) 30%, transparent);
}

.alien-card__image-wrap {
  flex-shrink: 0;
  width: 160px;
  height: 160px;
  overflow: hidden;
  border-radius: 4px;
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
  color: var(--alien-color);
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

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@media (max-width: 600px) {
  .alien-card {
    flex-direction: column;
  }
  .alien-card__image-wrap {
    width: 100%;
    height: 200px;
  }
}
</style>
