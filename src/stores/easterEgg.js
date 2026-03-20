import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useEasterEggStore = defineStore('easterEgg', () => {
  const konamiActivated = ref(false)
  const matrixMode = ref(false)
  const alienLanguage = ref(false)
  const thirdEyeOpen = ref(false)
  const soundEnabled = ref(false)

  const clickTimestamps = ref([])
  const konamiSequence = ref([])
  const triggeredUfoPositions = ref([])

  const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','KeyB','KeyA']

  function checkKonamiCode(code) {
    konamiSequence.value = [...konamiSequence.value, code]
    if (konamiSequence.value.length > KONAMI.length) {
      konamiSequence.value = konamiSequence.value.slice(1)
    }
    if (konamiSequence.value.length === KONAMI.length &&
        konamiSequence.value.every((k, i) => k === KONAMI[i])) {
      konamiActivated.value = true
      konamiSequence.value = []
      return true
    }
    return false
  }

  function registerClick() {
    const now = Date.now()
    clickTimestamps.value = [...clickTimestamps.value.filter(t => now - t < 1000), now]
    if (clickTimestamps.value.length >= 5) {
      matrixMode.value = true
      clickTimestamps.value = []
      setTimeout(() => { matrixMode.value = false }, 4000)
      return true
    }
    return false
  }

  function toggleAlienLanguage() {
    alienLanguage.value = !alienLanguage.value
  }

  function toggleThirdEye() {
    thirdEyeOpen.value = !thirdEyeOpen.value
    if (thirdEyeOpen.value) {
      setTimeout(() => { thirdEyeOpen.value = false }, 10000)
    }
  }

  function markUfoTriggered(positionKey) {
    if (!triggeredUfoPositions.value.includes(positionKey)) {
      triggeredUfoPositions.value = [...triggeredUfoPositions.value, positionKey]
      return true
    }
    return false
  }

  function resetUfoPositions() {
    triggeredUfoPositions.value = []
  }

  return {
    konamiActivated, matrixMode, alienLanguage, thirdEyeOpen, soundEnabled,
    clickTimestamps, konamiSequence, triggeredUfoPositions,
    checkKonamiCode, registerClick, toggleAlienLanguage, toggleThirdEye,
    markUfoTriggered, resetUfoPositions,
  }
})
