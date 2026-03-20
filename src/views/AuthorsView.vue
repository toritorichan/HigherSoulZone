<template>
  <div class="authors">
    <div ref="contentRef" class="authors__content">
      <h2 class="authors__heading">作者介紹</h2>

      <div class="authors__grid">
        <div class="author-block author-block--left author-block--float-a">
          <div class="author-block__avatar author-block__avatar--pink">
            <span class="author-block__initial">E</span>
          </div>
          <div class="author-block__info">
            <h3 class="author-block__name author-block__name--pink">EJ_SU</h3>
            <p class="author-block__id">蘇怡倢 / B34071149</p>
            <ul class="author-block__points">
              <li>致力於第三文明的美學</li>
              <li>探討埃及文化與外星文明的學術研究</li>
              <li>成大外星文明探索大使</li>
            </ul>
          </div>
        </div>

        <div class="author-block author-block--right author-block--float-b">
          <div class="author-block__avatar author-block__avatar--blue">
            <span class="author-block__initial">H</span>
          </div>
          <div class="author-block__info">
            <h3 class="author-block__name author-block__name--blue">HsssU</h3>
            <p class="author-block__id">許語宸 / F14061232</p>
            <ul class="author-block__points">
              <li>
                <span ref="thirdEyeRef" class="authors__third-eye" @click="onThirdEyeClick">致力於第三隻眼的研究</span>
              </li>
              <li>探討麥田圈與外星繪畫創作之關聯的學術研究</li>
              <li>雷爾運動的協助創辦人（台灣分部）</li>
            </ul>
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
import { useEasterEggStore } from '../stores/easterEgg.js'

const contentRef = ref(null)
const thirdEyeRef = ref(null)
useCopyProtection(contentRef)

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
  animation: slideIn 0.8s ease-out;
}

.authors__heading {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2.5rem;
  letter-spacing: 0.1em;
}

.authors__grid {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* --- Author block layout --- */
.author-block {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1.5rem;
}

.author-block--left {
  margin-right: 6rem;
}

.author-block--right {
  margin-left: 6rem;
  flex-direction: row-reverse;
  text-align: right;
}

.author-block--right .author-block__points {
  direction: rtl;
}

.author-block--right .author-block__points li {
  padding-left: 0;
  padding-right: 1.2rem;
}

.author-block--right .author-block__points li::before {
  left: auto;
  right: 0;
}

/* --- Floating animation --- */
.author-block--float-a {
  animation: floatA 6s ease-in-out infinite;
}

.author-block--float-b {
  animation: floatB 7s ease-in-out infinite;
}

/* --- Neon circle avatar --- */
.author-block__avatar {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.author-block__avatar--pink {
  border: none;
  box-shadow: 0 0 15px rgba(255, 0, 200, 0.2);
}

.author-block__avatar--blue {
  border: none;
  box-shadow: 0 0 15px rgba(68, 136, 255, 0.2);
}

.author-block__initial {
  font-family: var(--font-display, monospace);
  font-size: 2.2rem;
  font-weight: 700;
  letter-spacing: 0;
}

.author-block__avatar--pink .author-block__initial {
  color: var(--color-accent, #ff00c8);
  text-shadow: 0 0 10px rgba(255, 0, 200, 0.5);
}

.author-block__avatar--blue .author-block__initial {
  color: #4488ff;
  text-shadow: 0 0 10px rgba(68, 136, 255, 0.5);
}

/* --- Info --- */
.author-block__name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.author-block__name--pink {
  color: var(--color-accent);
  text-shadow: 0 0 10px rgba(255, 0, 200, 0.3);
}

.author-block__name--blue {
  color: #4488ff;
  text-shadow: 0 0 10px rgba(68, 136, 255, 0.3);
}

.author-block__id {
  color: var(--color-text-dim);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.author-block__points {
  list-style: none;
  padding: 0;
}

.author-block__points li {
  color: var(--color-text-dim);
  padding: 0.4rem 0;
  padding-left: 1.2rem;
  position: relative;
  line-height: 1.6;
}

.author-block__points li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

/* --- Easter egg states --- */
.authors__third-eye {
  cursor: pointer;
  user-select: none;
}

/* --- Responsive --- */
@media (max-width: 600px) {
  .author-block--left {
    margin-right: 1rem;
  }
  .author-block--right {
    margin-left: 1rem;
  }
}

/* --- Keyframes --- */
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes floatA {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@keyframes floatB {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
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
  color: rgba(0, 255, 136, 0.8);
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.5);
  letter-spacing: 0.2em;
  animation: thirdEyePulse 1.5s ease-in-out infinite alternate;
  text-align: center;
  margin: 0;
  line-height: 1.2;
}
.third-eye-overlay__text--coord {
  font-size: 2vw;
  color: rgba(255, 0, 0, 0.7);
  text-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
  letter-spacing: 0.4em;
}
.third-eye-overlay__text--main {
  font-size: 7vw;
  color: rgba(255, 255, 255, 0.95);
  text-shadow:
    0 0 40px rgba(255, 0, 0, 0.6),
    0 0 80px rgba(255, 0, 0, 0.3);
  animation: thirdEyeRedPulse 1.2s ease-in-out infinite alternate;
  white-space: nowrap;
}
.third-eye-overlay__text--jp {
  font-size: 2.5vw;
  color: rgba(255, 200, 200, 0.7);
  text-shadow: 0 0 25px rgba(255, 0, 0, 0.4);
}
.third-eye-overlay__text--small {
  font-size: 1.5vw;
  color: rgba(255, 255, 255, 0.4);
  letter-spacing: 0.8em;
  text-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
}
@keyframes thirdEyePulse {
  from { opacity: 0.6; transform: scale(1); }
  to { opacity: 1; transform: scale(1.02); }
}
@keyframes thirdEyeRedPulse {
  from { opacity: 0.7; transform: scale(1); text-shadow: 0 0 40px rgba(255, 0, 0, 0.6), 0 0 80px rgba(255, 0, 0, 0.3); }
  to { opacity: 1; transform: scale(1.03); text-shadow: 0 0 60px rgba(255, 0, 0, 0.8), 0 0 120px rgba(255, 0, 0, 0.5); }
}
</style>
