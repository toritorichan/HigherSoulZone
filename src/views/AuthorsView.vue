<template>
  <div class="authors">
    <div ref="contentRef" class="authors__content">
      <h2 class="authors__heading">[CLASSIFIED] PERSONNEL DATABASE</h2>
      <div class="authors__status">ACCESS LEVEL: ██████ | CLEARANCE: OMEGA-7</div>

      <div class="authors__grid">
        <div class="author-block">
          <div class="author-block__header">[CLASSIFIED] PERSONNEL FILE #001</div>
          <div class="author-block__row">
            <div class="author-block__avatar">
              <span class="author-block__initial">E</span>
              <div class="author-block__redacted-overlay">PHOTO<br>REDACTED</div>
            </div>
            <div class="author-block__info">
              <h3 class="author-block__name">EJ_SU</h3>
              <p class="author-block__id tw">蘇怡倢 / B34071149</p>
              <ul class="author-block__points">
                <li class="tw">&gt; 致力於第三文明的美學</li>
                <li class="tw">&gt; 探討埃及文化與外星文明的學術研究</li>
                <li class="tw">&gt; 成大外星文明探索大使</li>
              </ul>
            </div>
          </div>
        </div>

        <div class="author-block">
          <div class="author-block__header">[CLASSIFIED] PERSONNEL FILE #002</div>
          <div class="author-block__row">
            <div class="author-block__avatar">
              <span class="author-block__initial">H</span>
              <div class="author-block__redacted-overlay">PHOTO<br>REDACTED</div>
            </div>
            <div class="author-block__info">
              <h3 class="author-block__name">HsssU</h3>
              <p class="author-block__id tw">許語宸 / F14061232</p>
              <ul class="author-block__points">
                <li>
                  <span ref="thirdEyeRef" class="authors__third-eye" @click="onThirdEyeClick">&gt; 致力於第三隻眼的研究</span>
                </li>
                <li class="tw">&gt; 探討麥田圈與外星繪畫創作之關聯的學術研究</li>
                <li class="tw">&gt; 雷爾運動的協助創辦人（台灣分部）</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <teleport to="body">
      <div v-if="thirdEyeOpen" class="third-eye-overlay">
        <p class="third-eye-overlay__text third-eye-overlay__text--coord">25.0330° N, 121.5654° E</p>
        <p class="third-eye-overlay__text third-eye-overlay__text--main">我們一直在看著你</p>
        <p class="third-eye-overlay__text">真相就在你眼前</p>
        <p class="third-eye-overlay__text third-eye-overlay__text--jp">第三の目が開いた</p>
        <p class="third-eye-overlay__text third-eye-overlay__text--small">THE THIRD EYE IS OPEN</p>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useCopyProtection } from '../composables/useCopyProtection.js'
import { useTypewriter } from '../composables/useTypewriter.js'
import { useEasterEggStore } from '../stores/easterEgg.js'

const contentRef = ref(null)
const thirdEyeRef = ref(null)
useCopyProtection(contentRef)
useTypewriter(contentRef)

const store = useEasterEggStore()
const thirdEyeOpen = computed(() => store.thirdEyeOpen)

const thirdEyeClicks = ref([])
function onThirdEyeClick() {
  const now = Date.now()
  thirdEyeClicks.value = [...thirdEyeClicks.value.filter(t => now - t < 1000), now]
  if (thirdEyeClicks.value.length >= 3) {
    store.toggleThirdEye()
    thirdEyeClicks.value = []
  }
}

watch(thirdEyeOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.transition = 'background 0.3s'
    document.body.style.background = '#000'
    if (contentRef.value) {
      contentRef.value.style.transition = 'opacity 0.3s'
      contentRef.value.style.opacity = '0'
    }
  } else {
    document.body.style.transition = 'background 1.5s'
    document.body.style.background = ''
    if (contentRef.value) {
      contentRef.value.style.transition = 'opacity 1.5s'
      contentRef.value.style.opacity = '1'
    }
  }
})
</script>

<style scoped>
.authors {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.authors__content {
}

.authors__heading {
  font-family: var(--font-system);
  font-size: 1.6rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.authors__status {
  font-family: var(--font-system);
  font-size: 0.7rem;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  margin-bottom: 2.5rem;
  opacity: 0.6;
}

.authors__grid {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* --- Author block / classified file style --- */
.author-block {
  border: 1px dashed rgba(136, 204, 136, 0.2);
  background: rgba(136, 204, 136, 0.02);
}

.author-block__header {
  font-family: var(--font-system);
  font-size: 0.8rem;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  padding: 0.6rem 1rem;
  background: rgba(204, 0, 0, 0.05);
  border-bottom: 1px dashed rgba(136, 204, 136, 0.15);
}

.author-block__row {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
}

/* --- Avatar with PHOTO REDACTED overlay --- */
.author-block__avatar {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border: 1px dashed rgba(136, 204, 136, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: rgba(136, 204, 136, 0.03);
}

.author-block__initial {
  font-family: var(--font-system);
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-primary);
  opacity: 0.3;
}

.author-block__redacted-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-family: var(--font-system);
  font-size: 0.55rem;
  color: var(--color-accent);
  letter-spacing: 0.15em;
  line-height: 1.4;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0.7;
}

/* --- Info --- */
.author-block__name {
  font-family: var(--font-system);
  font-size: 1.4rem;
  color: var(--color-primary);
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.author-block__id {
  font-family: var(--font-body);
  color: var(--color-text-dim);
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.author-block__points {
  list-style: none;
  padding: 0;
}

.author-block__points li {
  font-family: var(--font-body);
  color: var(--color-primary);
  padding: 0.35rem 0;
  line-height: 1.6;
  font-size: 0.9rem;
  opacity: 0.8;
}

/* --- Easter egg states --- */
.authors__third-eye {
  cursor: pointer;
  user-select: none;
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .authors {
    padding: 1.5rem 1rem;
  }
  .authors__heading {
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }
  .authors__grid {
    gap: 1.5rem;
  }
  .author-block__row {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
  }
  .author-block__avatar {
    width: 56px;
    height: 56px;
  }
  .author-block__initial {
    font-size: 1.6rem;
  }
  .author-block__redacted-overlay {
    font-size: 0.45rem;
  }
  .author-block__name {
    font-size: 1.2rem;
  }
  .author-block__id {
    font-size: 0.8rem;
  }
  .author-block__points li {
    font-size: 0.82rem;
    line-height: 1.5;
  }
}

</style>

<style>
/* Third eye overlay — global styles (teleported outside scoped root) */
.third-eye-overlay {
  position: fixed;
  inset: 0;
  z-index: 9995;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  gap: 1.5vh;
  padding: 5vh 5vw;
  overflow: hidden;
}
.third-eye-overlay__text {
  font-family: var(--font-heading);
  font-size: 3vw;
  color: rgba(136, 204, 136, 0.8);
  letter-spacing: 0.2em;
  text-align: center;
  margin: 0;
  line-height: 1.2;
}
.third-eye-overlay__text--coord {
  font-size: 2vw;
  color: rgba(204, 0, 0, 0.7);
  letter-spacing: 0.4em;
}
.third-eye-overlay__text--main {
  font-size: 7vw;
  color: rgba(255, 255, 255, 0.95);
  white-space: nowrap;
}
.third-eye-overlay__text--jp {
  font-size: 2.5vw;
  color: rgba(255, 200, 200, 0.7);
}
.third-eye-overlay__text--small {
  font-size: 1.5vw;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.8em;
}
</style>
