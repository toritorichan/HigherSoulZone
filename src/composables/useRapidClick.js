import { useEasterEggStore } from '../stores/easterEgg'

export function useRapidClick() {
  const store = useEasterEggStore()
  return { onClick: () => store.registerClick() }
}
