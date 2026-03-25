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
  overflow: hidden;
}

/* === Windows XP Window Frame === */
.win-frame {
  max-width: 520px;
  margin: 0 auto;
  overflow: hidden;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
}

.win-frame__titlebar {
  background: #000080;
  color: #ffffff;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 12px;
  font-weight: bold;
  padding: 4px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  width: 16px;
  height: 14px;
  font-size: 10px;
  font-weight: normal;
  background: #c0c0c0;
  color: #000;
  border-top: 1px solid #ffffff;
  border-left: 1px solid #ffffff;
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
  cursor: default;
  line-height: 1;
}

.win-frame__btn:hover {
  background: #d0d0d0;
}

.win-frame__btn--close {
  cursor: pointer;
}

.win-frame__btn--close:hover {
  background: #d0d0d0;
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
}

.banner__secret {
  margin-top: 8px;
  font-size: clamp(0.8rem, 2vw, 1.2rem);
  color: var(--color-primary);
  font-family: var(--font-heading, monospace);
  letter-spacing: 0.1em;
}

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
