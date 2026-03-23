import { onMounted, nextTick } from 'vue'

/**
 * Scroll-triggered typewriter effect with blinking cursor.
 * Add class "tw" to any text element to opt in.
 * @param {import('vue').Ref} containerRef - ref to the container element
 */
export function useTypewriter(containerRef) {
  function typewrite(el) {
    const text = el.dataset.fullText
    if (!text) return
    el.textContent = ''
    el.classList.add('tw--typing')
    let i = 0
    const interval = setInterval(() => {
      el.textContent = text.slice(0, i + 1)
      i++
      if (i >= text.length) {
        clearInterval(interval)
        el.classList.remove('tw--typing')
        el.classList.add('tw--done')
      }
    }, 20)
  }

  onMounted(async () => {
    await nextTick()
    const elements = containerRef.value?.querySelectorAll('.tw') || []

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          typewrite(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.2 })

    elements.forEach(el => {
      el.dataset.fullText = el.textContent
      el.textContent = ''
      el.style.opacity = '1'
      el.style.minHeight = '1.5em'
      observer.observe(el)
    })
  })
}
