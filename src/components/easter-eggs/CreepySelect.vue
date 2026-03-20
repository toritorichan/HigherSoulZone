<template>
  <div v-if="showMessage" class="creepy-select" :style="messageStyle">
    {{ creepyMessage }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { garbleRandom } from '../../utils/garble.js'

const showMessage = ref(false)
const creepyMessage = ref('')
const messageStyle = ref({})

const selectSources = [
  '你不該看到這個', '停下來', '他們知道了', '已經太遲了',
  '不要複製', '我們看到你了', '這些文字不屬於你',
  '你在尋找什麼', '真相會找到你', '別再看了',
  '為什麼要選這段', '不要再碰了', '你的手指在發抖嗎',
  '每選一次他們就靠近一步', '你以為這是真的嗎',
  '他們已經在你身後了', '繼續看 我們不介意',
]

function onMouseUp() {
  const selection = window.getSelection()
  if (!selection || selection.toString().trim().length < 2) return

  // 70% trigger rate
  if (Math.random() > 0.7) return

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  creepyMessage.value = garbleRandom(selectSources, 0.5 + Math.random() * 0.3)
  messageStyle.value = {
    position: 'fixed',
    left: rect.left + rect.width / 2 + 'px',
    top: rect.top - 40 + 'px',
    transform: 'translateX(-50%)',
    zIndex: '99999',
  }
  showMessage.value = true
  setTimeout(() => { showMessage.value = false }, 1200)

  // Also replace the selected text temporarily
  try {
    const container = range.startContainer
    if (container.nodeType === Node.TEXT_NODE && container.parentNode) {
      const originalText = container.textContent
      const msg = garbleRandom(selectSources, 0.6 + Math.random() * 0.3)
      container.textContent = msg
      // Restore after 1.5s with flicker
      setTimeout(() => {
        container.textContent = ''
        setTimeout(() => {
          container.textContent = originalText
        }, 100)
      }, 1500)
    }
  } catch (e) {
    // ignore if DOM manipulation fails
  }

  // Clear selection
  selection.removeAllRanges()
}

onMounted(() => document.addEventListener('mouseup', onMouseUp))
onUnmounted(() => document.removeEventListener('mouseup', onMouseUp))
</script>

<style scoped>
.creepy-select {
  pointer-events: none;
  font-family: var(--font-heading);
  font-size: 1.8rem;
  color: rgba(255, 0, 0, 0.9);
  text-shadow: 0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.2);
  letter-spacing: 0.2em;
  white-space: nowrap;
  animation: creepyFade 1.2s ease-out forwards;
}
@keyframes creepyFade {
  0% { opacity: 0; transform: translateX(-50%) translateY(5px) scale(0.8); }
  15% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
  70% { opacity: 1; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-25px) scale(1.05); }
}
</style>
