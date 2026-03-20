<template>
  <div class="introduce">
    <div ref="contentRef" class="introduce__content">
      <h2 class="introduce__heading">網站介紹</h2>

      <p class="introduce__text">
        在我們的銀河系中有數以千億計的恆星，根據研究指出，平均每顆恆星至少有一個行星。
        在這些行星中，有些位於「適居帶」，也就是條件可能允許液態水存在的區域。
        這意味著在我們的銀河系中，可能有數十億個適合生命存在的世界。
      </p>

      <p class="introduce__text introduce__text--highlight">
        但是到底外星人在哪裡？
      </p>

      <p class="introduce__text">
        宇宙的年齡大約是138億年，而人類文明的歷史不過幾千年。
        如果將宇宙的歷史壓縮成一年，人類的存在只占最後一秒鐘的極小部分。
        在如此漫長的時間尺度中，其他文明有足夠的時間發展出遠超我們想像的技術。
      </p>

      <p class="introduce__text">
        這就是著名的費米悖論（Fermi Paradox）的核心問題：
      </p>

      <blockquote class="introduce__quote">
        <em>"Where is everybody?"</em>
        <br>
        「如果宇宙中存在大量的先進文明，那為什麼我們沒有發現任何外星生命的證據？」
      </blockquote>

      <p class="introduce__text">
        對於外星文明的存在，有兩種可能性，而兩種都同樣令人不安：
      </p>

      <p class="introduce__text">
        第一種可能：我們在宇宙中是孤獨的。在數十億個星系、數萬億顆恆星中，
        只有地球孕育了智慧生命。如果這是真的，那麼生命的誕生是一個近乎不可能的奇蹟，
        而我們肩負著宇宙中唯一文明的責任。
      </p>

      <p class="introduce__text">
        第二種可能：我們並不孤獨。宇宙中存在其他文明，但出於某種原因，
        我們還無法與他們接觸。也許他們在觀察我們，也許我們的技術太過原始，
        也許有某種我們尚未理解的「大過濾器」在阻止文明之間的接觸。
      </p>

      <p class="introduce__text">
        無論哪種可能性為真，它們都指向同一個令人敬畏的結論：
        我們對宇宙的認識還非常有限，而探索的旅程才剛剛開始。
      </p>

      <p class="introduce__final-quote">
        "live forever, or die to dush."
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useCopyProtection } from '../composables/useCopyProtection.js'

const contentRef = ref(null)
useCopyProtection(contentRef)
</script>

<style scoped>
.introduce {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.introduce__content {
  animation: slideIn 0.8s ease-out;
}

.introduce__heading {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  letter-spacing: 0.1em;
}

.introduce__text {
  color: var(--color-text-dim);
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.introduce__text--highlight {
  color: var(--color-primary);
  font-size: 1.3rem;
  font-weight: bold;
  text-align: center;
  margin: 2rem 0;
}

.introduce__quote {
  border-left: 2px solid var(--color-accent);
  padding: 1rem 1.5rem;
  margin: 2rem 0;
  color: var(--color-accent);
  font-style: italic;
  line-height: 1.8;
}

.introduce__final-quote {
  text-align: center;
  font-size: 1.4rem;
  color: var(--color-text);
  font-weight: bold;
  margin-top: 3rem;
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
</style>
