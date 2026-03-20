<template>
  <div class="introduce">
    <div ref="contentRef" class="introduce__content">

      <span class="introduce__noise introduce__noise--top-right">✦ ◦ ✧</span>
      <span class="introduce__noise introduce__noise--left">༝ ✦</span>

      <p class="introduce__text introduce__text--tilt-left introduce__text--large tw">
        在我們的銀河系中有數以千億計的恆星，根據研究指出，平均每顆恆星至少有一個行星。
      </p>

      <span class="introduce__noise introduce__noise--inline">◦ ✧ ◦</span>

      <p class="introduce__text introduce__text--tilt-right introduce__text--small introduce__text--offset-right tw">
        在這些行星中，有些位於「適居帶」，也就是條件可能允許液態水存在的區域。
        這意味著在我們的銀河系中，可能有數十億個適合生命存在的世界。
      </p>

      <p class="introduce__highlight introduce__glitch tw">
        但是到底外星人在哪裡？
      </p>

      <span class="introduce__noise introduce__noise--mid-left">✧ ༝ ✦ ◦</span>

      <p class="introduce__text introduce__text--tilt-left introduce__text--offset-left tw">
        宇宙的年齡大約是138億年，而人類文明的歷史不過幾千年。
        如果將宇宙的歷史壓縮成一年，人類的存在只占最後一秒鐘的極小部分。
        在如此漫長的時間尺度中，其他文明有足夠的時間發展出遠超我們想像的技術。
      </p>

      <p class="introduce__text introduce__text--tilt-right introduce__text--small tw">
        這就是著名的費米悖論（Fermi Paradox）的核心問題：
      </p>

      <blockquote class="introduce__quote introduce__quote--bleed introduce__flicker tw">
        <em>"Where is everybody?"</em>
        <br>
        「如果宇宙中存在大量的先進文明，那為什麼我們沒有發現任何外星生命的證據？」
      </blockquote>

      <span class="introduce__noise introduce__noise--right">✦ ✧</span>

      <p class="introduce__text introduce__text--tilt-left introduce__text--large introduce__text--offset-left tw">
        對於外星文明的存在，有兩種可能性，而兩種都同樣令人不安：
      </p>

      <p class="introduce__text introduce__text--tilt-right introduce__text--offset-right introduce__flicker tw">
        第一種可能：我們在宇宙中是孤獨的。在數十億個星系、數萬億顆恆星中，
        只有地球孕育了智慧生命。如果這是真的，那麼生命的誕生是一個近乎不可能的奇蹟，
        而我們肩負著宇宙中唯一文明的責任。
      </p>

      <span class="introduce__noise introduce__noise--inline">༝ ◦ ✦ ✧ ◦ ༝</span>

      <p class="introduce__text introduce__text--tilt-left introduce__text--small tw">
        第二種可能：我們並不孤獨。宇宙中存在其他文明，但出於某種原因，
        我們還無法與他們接觸。也許他們在觀察我們，也許我們的技術太過原始，
        也許有某種我們尚未理解的「大過濾器」在阻止文明之間的接觸。
      </p>

      <p class="introduce__text introduce__text--tilt-right introduce__text--large introduce__text--offset-right tw">
        無論哪種可能性為真，它們都指向同一個令人敬畏的結論：
        我們對宇宙的認識還非常有限，而探索的旅程才剛剛開始。
      </p>

      <span class="introduce__noise introduce__noise--bottom">✦ ◦ ✧ ༝ ✦</span>

      <p class="introduce__final-quote introduce__pulse tw">
        "live forever, or die to dush."
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useCopyProtection } from '../composables/useCopyProtection.js'

const contentRef = ref(null)
useCopyProtection(contentRef)

function typewrite(el) {
  const text = el.dataset.fullText
  let i = 0
  const interval = setInterval(() => {
    el.textContent = text.slice(0, i + 1)
    i++
    if (i >= text.length) clearInterval(interval)
  }, 20)
}

onMounted(async () => {
  await nextTick()
  const paragraphs = contentRef.value?.querySelectorAll('.tw') || []

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        typewrite(entry.target)
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.2 })

  paragraphs.forEach(p => {
    p.dataset.fullText = p.textContent
    p.textContent = ''
    p.style.opacity = '1'
    p.style.minHeight = '1.5em'
    observer.observe(p)
  })
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

/* --- Text blocks --- */
.introduce__text {
  color: var(--color-text-dim);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.introduce__text--large {
  font-size: 1.15rem;
}

.introduce__text--small {
  font-size: 0.88rem;
}

.introduce__text--tilt-left {
  transform: rotate(-1.2deg);
}

.introduce__text--tilt-right {
  transform: rotate(1.5deg);
}

.introduce__text--offset-left {
  margin-left: -1.5rem;
  margin-right: 3rem;
}

.introduce__text--offset-right {
  margin-left: 3rem;
  margin-right: -1rem;
}

/* --- Big glitchy highlight --- */
.introduce__highlight {
  color: var(--color-primary);
  font-size: 2.6rem;
  font-weight: 900;
  text-align: center;
  margin: 2.5rem 0;
  letter-spacing: 0.15em;
  text-shadow:
    0 0 8px rgba(0, 255, 136, 0.6),
    2px 2px 0 rgba(255, 0, 200, 0.3),
    -2px -1px 0 rgba(68, 136, 255, 0.3);
  transform: rotate(-0.5deg);
}

/* --- Quote bleeding / overlapping --- */
.introduce__quote {
  border-left: 2px solid var(--color-accent);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  color: var(--color-accent);
  font-style: italic;
  line-height: 1.8;
}

.introduce__quote--bleed {
  position: relative;
  margin-left: -1rem;
  margin-right: -1rem;
  padding: 1.5rem 2rem;
  transform: rotate(0.8deg);
  letter-spacing: 0.05em;
  text-shadow:
    1px 0 0 rgba(255, 0, 200, 0.25),
    -1px 0 0 rgba(68, 136, 255, 0.25);
}

/* --- Final quote pulsing --- */
.introduce__final-quote {
  text-align: center;
  font-size: 1.5rem;
  color: var(--color-text);
  font-weight: bold;
  margin-top: 3rem;
  letter-spacing: 0.12em;
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

/* --- Decorative noise --- */
.introduce__noise {
  display: block;
  color: rgba(255, 255, 255, 0.08);
  font-size: 1.2rem;
  letter-spacing: 0.6em;
  user-select: none;
  pointer-events: none;
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
  7% { opacity: 0.85; transform: rotate(-0.5deg) translate(-1px, 0); }
  8% { opacity: 1; transform: rotate(-0.5deg) translate(1px, 0); }
  9% { opacity: 0.9; }
  10% { opacity: 1; }
  47% { opacity: 1; }
  48% { opacity: 0.7; transform: rotate(-0.5deg) translate(2px, -1px); }
  49% { opacity: 0.85; }
  50% { opacity: 1; transform: rotate(-0.5deg); }
  82% { opacity: 1; }
  83% { opacity: 0.6; }
  84% { opacity: 0.9; transform: rotate(-0.5deg) translate(-2px, 1px); }
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
    text-shadow: 0 0 4px rgba(255, 255, 255, 0.1);
  }
  50% {
    opacity: 1;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(0, 255, 136, 0.15);
  }
}
</style>
