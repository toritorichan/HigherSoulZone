import { onMounted, onUnmounted } from 'vue'
import { useEasterEggStore } from '../stores/easterEgg'

export function useKonamiCode() {
  const store = useEasterEggStore()

  function onKeyDown(e) {
    store.checkKonamiCode(e.code)
  }

  onMounted(() => window.addEventListener('keydown', onKeyDown))
  onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
}
