<template>
  <header class="banner">
    <div class="win-frame">
      <!-- XP Title Bar -->
      <div class="win-frame__titlebar">
        <span class="win-frame__title">higher_soul_zone.exe</span>
        <div class="win-frame__buttons">
          <span class="win-frame__btn win-frame__btn--min">─</span>
          <span class="win-frame__btn win-frame__btn--max">□</span>
          <span
            class="win-frame__btn win-frame__btn--close"
            @click="onCloseClick"
          >✕</span>
        </div>
      </div>
      <!-- Window Body -->
      <div class="win-frame__body">
        <img
          :src="`${base}media/logo.png`"
          alt="Higher Soul Zone"
          class="banner__logo"
          :class="{ 'banner__logo--spinning': spinning }"
        />
      </div>
    </div>
    <transition name="banner-msg">
      <div v-if="secretMessage" class="banner__secret">{{ secretMessage }}</div>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { garble } from '../../utils/garble.js'

const base = import.meta.env.BASE_URL

const clickCount = ref(0)
const spinning = ref(false)
const secretMessage = ref('')
const TARGET_CLICKS = 7

let resetTimer = null

function onCloseClick() {
  clearTimeout(resetTimer)
  clickCount.value = clickCount.value + 1

  if (clickCount.value >= TARGET_CLICKS) {
    triggerSecret()
    clickCount.value = 0
    return
  }
  resetTimer = setTimeout(() => { clickCount.value = 0 }, 3000)
}

function triggerSecret() {
  spinning.value = true
  secretMessage.value = garble('第七維度已解鎖', 0.5)
  setTimeout(() => {
    spinning.value = false
    secretMessage.value = ''
  }, 2500)
}
</script>

<style scoped>
.banner {
  text-align: center;
  padding: 20px 0 10px;
  user-select: none;
  -webkit-user-select: none;
  transition: opacity 1.5s ease, max-height 1.5s ease, padding 1.5s ease;
  overflow: hidden;
}

/* === Windows XP Window Frame === */
.win-frame {
  max-width: 520px;
  margin: 0 auto;
  border-radius: 8px 8px 0 0;
  overflow: hidden;
  box-shadow:
    0 0 0 1px #0033a0,
    0 4px 16px rgba(0, 0, 0, 0.6);
}

.win-frame__titlebar {
  background: linear-gradient(
    to bottom,
    #0997ff,
    #0053ee 8%,
    #0050ee 40%,
    #0055e5 88%,
    #1b8bff 93%,
    #3c9aff 95%,
    #65b5ff 96%,
    #6cb6ff
  );
  color: #ffffff;
  font-family: 'Trebuchet MS', 'Tahoma', sans-serif;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.win-frame__title {
  letter-spacing: 0.5px;
}

.win-frame__buttons {
  display: flex;
  gap: 2px;
}

.win-frame__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 21px;
  height: 21px;
  font-size: 11px;
  font-weight: normal;
  background: linear-gradient(to bottom, #f0f0f0, #d4d0c8);
  color: #000;
  border: 1px solid #0033a0;
  border-radius: 3px;
  cursor: default;
  text-shadow: none;
  line-height: 1;
}

.win-frame__btn:hover {
  background: linear-gradient(to bottom, #fff, #e0dcd4);
}

.win-frame__btn--close {
  background: linear-gradient(to bottom, #e88c6c, #d44820);
  color: #fff;
  border-color: #933a1a;
  cursor: pointer;
}

.win-frame__btn--close:hover {
  background: linear-gradient(to bottom, #ff9c7c, #e45830);
}

.win-frame__body {
  background: var(--color-bg, #0a0a12);
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Win98 inset bevel */
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-bottom: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #dfdfdf;
}

.banner__logo {
  max-width: 100%;
  height: auto;
  pointer-events: auto;
  mix-blend-mode: screen;
}

.banner__logo--spinning {
  animation: banner-spin 0.6s ease-in-out 2;
}

.banner__secret {
  margin-top: 8px;
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  color: #00ff88;
  font-family: var(--font-heading, monospace);
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.6), 0 0 20px rgba(0, 255, 136, 0.3);
  letter-spacing: 0.1em;
}

@keyframes banner-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.banner-msg-enter-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.banner-msg-leave-active { transition: opacity 0.5s ease, transform 0.5s ease; }
.banner-msg-enter-from { opacity: 0; transform: translateY(-10px); }
.banner-msg-leave-to { opacity: 0; transform: translateY(10px); }

/* Mobile */
@media (max-width: 768px) {
  .banner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px 0 8px;
  }
  .win-frame {
    width: 100%;
    max-width: 100%;
  }
  .banner__logo {
    max-width: 80%;
  }
}
</style>
