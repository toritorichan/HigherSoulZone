<template>
  <div class="gate" @click="skip">
    <div class="gate__screen">
      <div v-for="(line, i) in visibleLines" :key="i" class="gate__line" :class="line.cls">{{ line.text }}</div>
      <span v-if="showCursor" class="gate__cursor">_</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { garble } from '../utils/garble.js'

const emit = defineEmits(['enter'])

const visibleLines = ref([])
const showCursor = ref(true)
let timers = []
let done = false

const bootLines = [
  { text: 'BIOS v2.04 — HIGHER SOUL ZONE SYSTEMS', cls: '', delay: 0 },
  { text: 'MEMORY TEST.......... 640K OK', cls: '', delay: 200 },
  { text: 'LOADING SECTOR 0x7C00', cls: '', delay: 400 },
  { text: '[OK] DISK 0 DETECTED', cls: '', delay: 600 },
  { text: '[OK] SIGNAL DECODER LOADED', cls: '', delay: 800 },
  { text: '[WARN] UNKNOWN DEVICE AT IRQ 7', cls: 'gate__line--warn', delay: 1100 },
  { text: '[ERR] SIGNAL SOURCE: ????????', cls: 'gate__line--err', delay: 1400 },
  { text: '', cls: '', delay: 1700 },
  { text: garble('INCOMING TRANSMISSION...', 0.4), cls: 'gate__line--err', delay: 2000 },
  { text: '', cls: '', delay: 2300 },
  { text: garble('你 準 備 好 了 嗎', 0.3), cls: 'gate__line--msg', delay: 2600 },
  { text: '', cls: '', delay: 3200 },
  { text: '> _', cls: 'gate__line--prompt', delay: 3500 },
]

function run() {
  bootLines.forEach((line) => {
    const id = setTimeout(() => {
      visibleLines.value = [...visibleLines.value, { text: line.text, cls: line.cls }]
    }, line.delay)
    timers.push(id)
  })
  const id = setTimeout(() => {
    if (!done) { done = true; emit('enter') }
  }, 4500)
  timers.push(id)
}

function skip() {
  if (!done) {
    done = true
    timers.forEach(clearTimeout)
    emit('enter')
  }
}

onMounted(() => { run() })
onUnmounted(() => { timers.forEach(clearTimeout) })
</script>

<style scoped>
.gate {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #000;
  cursor: pointer;
  overflow: hidden;
}
.gate__screen {
  padding: 40px 30px;
  max-width: 700px;
}
.gate__line {
  font-family: var(--font-system, 'VT323', monospace);
  font-size: 14px;
  color: #00ff00;
  line-height: 1.6;
  white-space: pre-wrap;
  min-height: 1.4em;
}
.gate__line--warn { color: #cccc00; }
.gate__line--err { color: #ff0000; }
.gate__line--msg {
  color: #ffffff;
  font-size: 20px;
  letter-spacing: 0.2em;
  margin: 8px 0;
}
.gate__line--prompt { color: #00ff00; opacity: 0.5; }
.gate__cursor {
  color: #00ff00;
  font-family: var(--font-system, monospace);
  font-size: 14px;
}
@media (max-width: 768px) {
  .gate__screen { padding: 30px 15px; }
  .gate__line { font-size: 12px; }
  .gate__line--msg { font-size: 16px; }
}
</style>
