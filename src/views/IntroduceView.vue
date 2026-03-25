<template>
  <div class="introduce">
    <div ref="contentRef" class="introduce__content">

      <!-- Fake Notepad window -->
      <div class="notepad">
        <div class="notepad__titlebar">
          <span class="notepad__titlebar-text">介紹.txt - 記事本</span>
          <div class="notepad__titlebar-buttons">
            <span class="notepad__btn notepad__btn--minimize">_</span>
            <span class="notepad__btn notepad__btn--maximize">□</span>
            <span class="notepad__btn notepad__btn--close">×</span>
          </div>
        </div>
        <div class="notepad__menubar">
          <span>檔案(F)</span>
          <span>編輯(E)</span>
          <span>格式(O)</span>
          <span>檢視(V)</span>
          <span>說明(H)</span>
        </div>
        <div class="notepad__body">

          <span class="introduce__noise introduce__noise--top-right">✦ ◦ ✧</span>
          <span class="introduce__noise introduce__noise--left">༝ ✦</span>

          <p class="introduce__text tw">
            在我們的銀河系中有數以千億計的恆星，根據研究指出，平均每顆恆星至少有一個行星。
          </p>

          <span class="introduce__noise introduce__noise--inline">◦ ✧ ◦</span>

          <p class="introduce__text introduce__text--indent tw">
            在這些行星中，有些位於「適居帶」，也就是條件可能允許液態水存在的區域。
            這意味著在我們的銀河系中，可能有數十億個適合生命存在的世界。
          </p>

          <p class="introduce__highlight introduce__glitch tw">
            但是到底外星人在哪裡？
          </p>

          <span class="introduce__noise introduce__noise--mid-left">✧ ༝ ✦ ◦</span>

          <p class="introduce__text tw">
            宇宙的年齡大約是138億年，而人類文明的歷史不過幾千年。
            如果將宇宙的歷史壓縮成一年，人類的存在只占最後一秒鐘的極小部分。
            在如此漫長的時間尺度中，其他文明有足夠的時間發展出遠超我們想像的技術。
          </p>

          <p class="introduce__text introduce__text--indent tw">
            這就是著名的費米悖論（Fermi Paradox）的核心問題：
          </p>

          <blockquote class="introduce__quote introduce__flicker tw">
            <em>"Where is everybody?"</em>
            <br>
            「如果宇宙中存在大量的先進文明，那為什麼我們沒有發現任何外星生命的證據？」
          </blockquote>

          <span class="introduce__noise introduce__noise--right">✦ ✧</span>

          <p class="introduce__text tw">
            對於外星文明的存在，有兩種可能性，而兩種都同樣令人不安：
          </p>

          <p class="introduce__text introduce__text--indent introduce__flicker tw">
            第一種可能：我們在宇宙中是孤獨的。在數十億個星系、數萬億顆恆星中，
            只有地球孕育了智慧生命。如果這是真的，那麼生命的誕生是一個近乎不可能的奇蹟，
            而我們肩負著宇宙中唯一文明的責任。
          </p>

          <span class="introduce__noise introduce__noise--inline">༝ ◦ ✦ ✧ ◦ ༝</span>

          <p class="introduce__text tw">
            第二種可能：我們並不孤獨。宇宙中存在其他文明，但出於某種原因，
            我們還無法與他們接觸。也許他們在觀察我們，也許我們的技術太過原始，
            也許有某種我們尚未理解的「大過濾器」在阻止文明之間的接觸。
          </p>

          <p class="introduce__text tw">
            無論哪種可能性為真，它們都指向同一個令人敬畏的結論：
            我們對宇宙的認識還非常有限，而探索的旅程才剛剛開始。
          </p>

          <span class="introduce__noise introduce__noise--bottom">✦ ◦ ✧ ༝ ✦</span>

          <div class="introduce__final-wrap">
            <p class="introduce__final-quote introduce__pulse tw">
              "live forever, or die to dush."
            </p>
            <div class="introduce__final-horror">
              <span class="introduce__garble-line" data-src="you will die"></span>
              <span class="introduce__garble-line" data-src="你已經死了"></span>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useCopyProtection } from '../composables/useCopyProtection.js'
import { useTypewriter } from '../composables/useTypewriter.js'
import { garble } from '../utils/garble.js'

const contentRef = ref(null)
useCopyProtection(contentRef)
useTypewriter(contentRef)

let garbleInterval = null

onMounted(async () => {
  await nextTick()

  // Continuously re-garble horror text for living corruption effect
  const garbleLines = contentRef.value?.querySelectorAll('.introduce__garble-line') || []
  function refreshGarble() {
    garbleLines.forEach(el => {
      el.textContent = garble(el.dataset.src, 0.6 + Math.random() * 0.3)
    })
  }
  refreshGarble()
  garbleInterval = setInterval(refreshGarble, 800)
})

onUnmounted(() => {
  if (garbleInterval) clearInterval(garbleInterval)
})
</script>

<style scoped>
.introduce {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
}

.introduce__content {
  animation: slideIn 0.8s ease-out;
  position: relative;
}

/* --- Notepad Window --- */
.notepad {
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
  box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
  background: #0a0a12;
}

.notepad__titlebar {
  background: linear-gradient(to right, #000080, #1084d0);
  color: #ffffff;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.notepad__titlebar-text {
  letter-spacing: 0.02em;
}

.notepad__titlebar-buttons {
  display: flex;
  gap: 2px;
}

.notepad__btn {
  width: 16px;
  height: 14px;
  background: #c0c0c0;
  border-top: 1px solid #ffffff;
  border-left: 1px solid #ffffff;
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-family: 'Tahoma', sans-serif;
  color: #000;
  line-height: 1;
  cursor: default;
}

.notepad__btn--close {
  background: #c0c0c0;
}

.notepad__menubar {
  display: flex;
  gap: 0;
  padding: 2px 4px;
  background: #c0c0c0;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
  color: #000;
  border-bottom: 1px solid #808080;
  user-select: none;
}

.notepad__menubar span {
  padding: 1px 6px;
}

.notepad__body {
  padding: 1.5rem;
  background: var(--color-bg);
  min-height: 300px;
  position: relative;
}

/* --- Text blocks --- */
.introduce__text {
  color: var(--color-primary);
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.9;
  margin-bottom: 1.5rem;
  opacity: 0.85;
}

.introduce__text--indent {
  padding-left: 1.5rem;
}

/* --- Big glitchy highlight --- */
.introduce__highlight {
  color: var(--color-primary);
  font-family: var(--font-system);
  font-size: 2.2rem;
  font-weight: 900;
  text-align: center;
  margin: 2.5rem 0;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 8px rgba(0, 255, 0, 0.6),
    2px 2px 0 rgba(255, 0, 0, 0.3),
    -2px -1px 0 rgba(0, 30, 255, 0.3);
}

/* --- Quote --- */
.introduce__quote {
  border-left: 2px solid var(--color-accent);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  color: var(--color-accent);
  font-family: var(--font-body);
  font-style: italic;
  line-height: 1.8;
  text-shadow:
    1px 0 0 rgba(255, 0, 0, 0.25),
    -1px 0 0 rgba(0, 30, 255, 0.25);
}

/* --- Final quote with horror hover --- */
.introduce__final-wrap {
  position: relative;
  margin-top: 3rem;
  text-align: center;
}

.introduce__final-quote {
  font-family: var(--font-cursive);
  font-size: 1.8rem;
  color: var(--color-text);
  font-weight: 700;
  letter-spacing: 0.05em;
  cursor: default;
  transition: opacity 0.3s, filter 0.3s;
}

.introduce__final-horror {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  opacity: 0;
  transition: opacity 0.2s;
  pointer-events: none;
}

.introduce__final-horror span {
  font-family: var(--font-heading);
  color: #ff0000;
  text-shadow: 0 0 15px rgba(255, 0, 0, 0.7), 0 0 40px rgba(255, 0, 0, 0.3);
  letter-spacing: 0.15em;
}

.introduce__final-horror span:nth-child(1) {
  font-size: 1.8rem;
}
.introduce__final-horror span:nth-child(2) {
  font-size: 1.3rem;
  color: rgba(255, 100, 100, 0.8);
  animation: horrorPulse 0.8s ease-in-out infinite alternate;
}

.introduce__final-wrap:hover .introduce__final-quote {
  opacity: 0;
  filter: blur(4px);
}

.introduce__final-wrap:hover .introduce__final-horror {
  opacity: 1;
}

@keyframes horrorPulse {
  from { opacity: 0.6; transform: scale(1); }
  to { opacity: 1; transform: scale(1.05); }
}

.introduce__pulse {
  animation: eerePulse 3s ease-in-out infinite;
}

/* --- Glitch flicker --- */
.introduce__glitch {
  animation: glitchFlicker 4s infinite;
}

.introduce__flicker {
  animation: subtleFlicker 5s infinite;
}

/* --- Decorative noise (dimmed more) --- */
.introduce__noise {
  display: block;
  color: rgba(0, 255, 0, 0.04);
  font-size: 1rem;
  letter-spacing: 0.6em;
  user-select: none;
  pointer-events: none;
  font-family: var(--font-system);
}

.introduce__noise--top-right {
  text-align: right;
  margin-bottom: 1rem;
}

.introduce__noise--left {
  text-align: left;
  margin-bottom: 0.5rem;
  margin-left: -0.5rem;
}

.introduce__noise--mid-left {
  margin-left: -1rem;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
}

.introduce__noise--right {
  text-align: right;
  margin-right: -0.5rem;
}

.introduce__noise--inline {
  text-align: center;
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.introduce__noise--bottom {
  text-align: center;
  margin-top: 1.5rem;
  margin-bottom: -0.5rem;
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
  85% { opacity: 1; }
}

@keyframes subtleFlicker {
  0%, 100% { opacity: 1; }
  20% { opacity: 0.92; }
  21% { opacity: 1; }
  55% { opacity: 0.85; }
  56% { opacity: 1; }
  78% { opacity: 0.88; }
  80% { opacity: 1; }
}

@keyframes eerePulse {
  0%, 100% {
    opacity: 0.6;
    text-shadow: 0 0 4px rgba(0, 255, 0, 0.1);
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 20px rgba(0, 255, 0, 0.3), 0 0 40px rgba(0, 255, 0, 0.15);
  }
}

@media (max-width: 768px) {
  .introduce {
    padding: 1rem 0.5rem;
  }
  .introduce__highlight {
    font-size: 1.4rem;
  }
  .notepad__menubar {
    display: none;
  }
  .notepad__body {
    padding: 1rem;
  }
}
</style>
