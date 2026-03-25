<template>
  <div class="diary">
    <div ref="contentRef" class="diary__content">

      <header class="diary__header">
        <span class="diary__header-noise">{{ headerNoise }}</span>
        <h1 class="diary__title">外 星 日 誌</h1>
        <span class="diary__header-noise">{{ headerNoise2 }}</span>
        <div class="diary__scanline"></div>
      </header>

      <div class="diary__terminal">
        <div class="diary__terminal-bar">
          <span class="diary__terminal-dot"></span>
          <span class="diary__terminal-dot"></span>
          <span class="diary__terminal-dot"></span>
          <span class="diary__terminal-label">alien_log.dat — [CORRUPTED]</span>
        </div>

        <div class="diary__entries">
          <article
            v-for="(entry, i) in displayEntries"
            :key="i"
            class="diary__entry"
            :style="{ animationDelay: i * 0.2 + 's' }"
          >
            <div class="diary__entry-header">
              <span class="diary__entry-date">{{ entry.garbledDate }}</span>
              <span class="diary__entry-weather">{{ entry.garbledWeather }}</span>
            </div>
            <div class="diary__entry-divider"></div>
            <p class="diary__entry-content tw">{{ entry.garbledContent }}</p>
            <span class="diary__entry-noise">{{ entry.noise }}</span>
          </article>
        </div>

        <div class="diary__cursor-line">
          <span class="diary__prompt">&gt;_</span>
          <span class="diary__cursor"></span>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { garble, garbleNoise } from '../utils/garble.js'
import { useTypewriter } from '../composables/useTypewriter.js'

const contentRef = ref(null)
useTypewriter(contentRef)

const entries = [
  {
    date: '6202/03/x3',
    weather: '天氣晴',
    content: '晴天的竹科 漢堡好吃 說教男還真是不分宇宙 到處都是',
  },
  {
    date: '6202/0x/18',
    weather: '天氣 陰',
    content: '今天在仙女座星雲看到一個超新星爆炸 美得不像話 可惜沒帶相機',
  },
  {
    date: '6202/02/⊘9',
    weather: '太陽風暴',
    content: '地球的WIFI真的好慢 等一個網頁要等三個光年 懷念家鄉的量子網路',
  },
]

const headerNoise = ref('')
const headerNoise2 = ref('')

const displayEntries = reactive(
  entries.map((entry) => ({
    garbledDate: garble(entry.date, 0.3),
    garbledWeather: garble(entry.weather, 0.3),
    garbledContent: garble(entry.content, 0.45),
    noise: garbleNoise(8),
  }))
)

function refreshGarble() {
  entries.forEach((entry, i) => {
    displayEntries[i] = {
      garbledDate: garble(entry.date, 0.3),
      garbledWeather: garble(entry.weather, 0.25 + Math.random() * 0.1),
      garbledContent: garble(entry.content, 0.4 + Math.random() * 0.1),
      noise: garbleNoise(6 + Math.floor(Math.random() * 6)),
    }
  })
  headerNoise.value = garbleNoise(10)
  headerNoise2.value = garbleNoise(10)
}

let garbleInterval = null

onMounted(() => {
  refreshGarble()
  garbleInterval = setInterval(refreshGarble, 3000)
})

onUnmounted(() => {
  if (garbleInterval) clearInterval(garbleInterval)
})
</script>

<style scoped>
.diary {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.diary__content {
  animation: slideIn 0.8s ease-out;
  position: relative;
}

/* --- Header --- */
.diary__header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.diary__title {
  font-family: var(--font-system);
  font-size: 2.4rem;
  color: var(--color-primary);
  letter-spacing: 0.3em;
  text-shadow:
    0 0 10px rgba(0, 255, 0, 0.6),
    0 0 30px rgba(0, 255, 0, 0.2);
  animation: glitchFlicker 4s infinite;
}

.diary__header-noise {
  display: block;
  color: rgba(0, 255, 0, 0.04);
  font-family: var(--font-system);
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  user-select: none;
  pointer-events: none;
  line-height: 1.6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.diary__scanline {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.015) 2px,
    rgba(0, 255, 0, 0.015) 4px
  );
  pointer-events: none;
  animation: scanlineScroll 8s linear infinite;
}

/* --- Terminal frame --- */
.diary__terminal {
  border: 1px dashed rgba(0, 255, 0, 0.2);
  background: rgba(0, 10, 5, 0.6);
  overflow: hidden;
  position: relative;
}

.diary__terminal::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 0, 0.02) 2px,
    rgba(0, 255, 0, 0.02) 4px
  );
  pointer-events: none;
  z-index: 1;
}

.diary__terminal-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: rgba(0, 255, 0, 0.05);
  border-bottom: 1px dashed rgba(0, 255, 0, 0.15);
}

.diary__terminal-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-primary);
  opacity: 0.5;
}

.diary__terminal-label {
  margin-left: 8px;
  font-family: var(--font-system);
  font-size: 0.7rem;
  color: var(--color-primary);
  letter-spacing: 0.1em;
  opacity: 0.4;
}

/* --- Entries --- */
.diary__entries {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: relative;
  z-index: 2;
}

.diary__entry {
  border: 1px dashed rgba(0, 255, 0, 0.15);
  border-left: 3px dashed var(--color-primary);
  padding: 1rem 1.2rem;
  background: rgba(0, 255, 0, 0.02);
  position: relative;
  animation: entrySlideIn 0.8s ease-out both;
}

.diary__entry-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 0.5rem;
}

.diary__entry-date {
  font-family: var(--font-system);
  font-size: 0.85rem;
  color: var(--color-primary);
  letter-spacing: 0.15em;
  text-shadow: 0 0 6px rgba(0, 255, 0, 0.3);
}

.diary__entry-weather {
  font-family: var(--font-body);
  font-size: 0.78rem;
  color: var(--color-accent);
  letter-spacing: 0.1em;
  opacity: 0.7;
}

.diary__entry-divider {
  height: 1px;
  background: linear-gradient(
    90deg,
    rgba(0, 255, 0, 0.3),
    rgba(0, 255, 0, 0.1),
    transparent
  );
  margin-bottom: 0.8rem;
}

.diary__entry-content {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-primary);
  line-height: 1.9;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.diary__entry-noise {
  display: block;
  margin-top: 0.6rem;
  font-family: var(--font-system);
  font-size: 0.65rem;
  color: rgba(0, 255, 0, 0.06);
  letter-spacing: 0.2em;
  user-select: none;
  pointer-events: none;
  text-align: right;
}

/* --- Cursor line --- */
.diary__cursor-line {
  padding: 0.8rem 1.5rem 1rem;
  position: relative;
  z-index: 2;
}

.diary__prompt {
  font-family: var(--font-system);
  font-size: 0.8rem;
  color: var(--color-primary);
  opacity: 0.6;
}

.diary__cursor {
  display: inline-block;
  width: 8px;
  height: 1rem;
  background: var(--color-primary);
  margin-left: 4px;
  vertical-align: text-bottom;
  animation: cursorBlink 1s step-end infinite;
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

@keyframes entrySlideIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

@keyframes glitchFlicker {
  0%, 100% { opacity: 1; }
  7% { opacity: 0.85; transform: translate(-1px, 0); }
  8% { opacity: 1; transform: translate(1px, 0); }
  9% { opacity: 0.9; }
  10% { opacity: 1; }
  47% { opacity: 1; }
  48% { opacity: 0.7; transform: translate(2px, -1px); }
  49% { opacity: 0.85; }
  50% { opacity: 1; transform: translate(0); }
  82% { opacity: 1; }
  83% { opacity: 0.6; }
  84% { opacity: 0.9; transform: translate(-2px, 1px); }
  85% { opacity: 1; transform: translate(0); }
}

@keyframes scanlineScroll {
  0% { background-position: 0 0; }
  100% { background-position: 0 100vh; }
}

/* --- Responsive --- */
@media (max-width: 768px) {
  .diary {
    padding: 1rem 0.8rem;
  }

  .diary__title {
    font-size: 1.6rem;
    letter-spacing: 0.2em;
  }

  .diary__entries {
    padding: 1rem 0.8rem;
    gap: 1rem;
  }

  .diary__entry {
    padding: 0.8rem 0.9rem;
  }

  .diary__entry-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .diary__entry-content {
    font-size: 0.88rem;
    line-height: 1.7;
  }

  .diary__terminal-label {
    display: none;
  }
}
</style>
