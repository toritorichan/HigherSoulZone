import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export function useCopyProtection(elementRef) {
  const router = useRouter()

  function onCopy(e) {
    e.preventDefault()
    alert('WHaT aRE U DoiNG Now')
    router.push('/dead')
  }

  onMounted(() => {
    const el = elementRef.value
    if (el) el.addEventListener('copy', onCopy)
  })

  onUnmounted(() => {
    const el = elementRef.value
    if (el) el.removeEventListener('copy', onCopy)
  })
}
