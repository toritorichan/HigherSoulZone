<template>
  <div v-if="showMessage" class="creepy-select" :style="messageStyle">
    {{ creepyMessage }}
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const showMessage = ref(false)
const creepyMessage = ref('')
const messageStyle = ref({})

const messages = [
  '你不該看到這個',
  '停下來',
  '他們知道了',
  '已經太遲了',
  '不要複製',
  '我們看到你了',
  '這些文字不屬於你',
  '你在尋找什麼？',
  '真相會找到你的',
  '別再看了',
]

function onMouseUp() {
  const selection = window.getSelection()
  if (!selection || selection.toString().trim().length < 3) return

  // Only trigger 40% of the time for unpredictability
  if (Math.random() > 0.4) return

  const range = selection.getRangeAt(0)
  const rect = range.getBoundingClientRect()

  creepyMessage.value = messages[Math.floor(Math.random() * messages.length)]
  messageStyle.value = {
    position: 'fixed',
    left: rect.left + rect.width / 2 + 'px',
    top: rect.top - 30 + 'px',
    transform: 'translateX(-50%)',
    zIndex: '99999',
  }
  showMessage.value = true

  setTimeout(() => { showMessage.value = false }, 800)
}

onMounted(() => document.addEventListener('mouseup', onMouseUp))
onUnmounted(() => document.removeEventListener('mouseup', onMouseUp))
</script>

<style scoped>
.creepy-select {
  pointer-events: none;
  font-family: var(--font-heading);
  font-size: 0.9rem;
  color: rgba(255, 0, 0, 0.8);
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
  letter-spacing: 0.15em;
  white-space: nowrap;
  animation: creepyFade 0.8s ease-out forwards;
}
@keyframes creepyFade {
  0% { opacity: 0; transform: translateX(-50%) translateY(0); }
  20% { opacity: 1; }
  100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
}
</style>
