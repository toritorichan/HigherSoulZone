<template>
  <div class="authors" :class="{ 'authors--inverted': thirdEyeOpen, 'authors__shake': thirdEyeOpen }">
    <div ref="contentRef" class="authors__content">
      <h2 class="authors__heading">作者介紹</h2>

      <div class="authors__grid">
        <div class="author-card author-card--ej">
          <h3 class="author-card__name author-card__name--pink">EJ_SU</h3>
          <p class="author-card__id">蘇怡倢 / B34071149</p>
          <ul class="author-card__points">
            <li>致力於第三文明的美學</li>
            <li>探討埃及文化與外星文明的學術研究</li>
            <li>成大外星文明探索大使</li>
          </ul>
        </div>

        <div class="author-card author-card--hs">
          <h3 class="author-card__name author-card__name--blue">HsssU</h3>
          <p class="author-card__id">許語宸 / F14061232</p>
          <ul class="author-card__points">
            <li>
              <span ref="thirdEyeRef" class="authors__third-eye" @click="onThirdEyeClick">致力於第三隻眼的研究</span>
            </li>
            <li>探討麥田圈與外星繪畫創作之關聯的學術研究</li>
            <li>雷爾運動的協助創辦人（台灣分部）</li>
          </ul>
        </div>
      </div>

      <div v-if="thirdEyeOpen" class="authors__hidden">
        <p>25.0330° N, 121.5654° E</p>
        <p>我們一直在看著你</p>
        <p>真相就在你眼前</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.authors__grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.author-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 2rem;
  transition: border-color 0.3s;
}

.author-card:hover {
  border-color: rgba(255, 255, 255, 0.2);
}

.author-card__name {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  letter-spacing: 0.1em;
}

.author-card__name--pink {
  color: var(--color-accent);
  text-shadow: 0 0 10px rgba(255, 0, 200, 0.3);
}

.author-card__name--blue {
  color: #4488ff;
  text-shadow: 0 0 10px rgba(68, 136, 255, 0.3);
}

.author-card__id {
  color: var(--color-text-dim);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.author-card__points {
  list-style: none;
  padding: 0;
}

.author-card__points li {
  color: var(--color-text-dim);
  padding: 0.4rem 0;
  padding-left: 1.2rem;
  position: relative;
  line-height: 1.6;
}

.author-card__points li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.authors--inverted {
  filter: invert(1) hue-rotate(180deg);
  transition: filter 0.5s ease;
}

.authors__shake {
  animation: authorShake 0.5s infinite;
}

.authors__third-eye {
  cursor: pointer;
  user-select: none;
}

.authors__hidden {
  margin-top: 2rem;
  padding: 1.5rem;
  border: 1px solid var(--color-primary);
  background: rgba(0, 255, 136, 0.05);
  border-radius: 4px;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

.authors__hidden p {
  color: var(--color-primary);
  margin: 0.5rem 0;
  letter-spacing: 0.1em;
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes authorShake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-2px) translateY(1px); }
  75% { transform: translateX(2px) translateY(-1px); }
}
</style>
