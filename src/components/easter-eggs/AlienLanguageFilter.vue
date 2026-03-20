<template>
  <!-- No visible template needed, this is a behavior-only component -->
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useEasterEggStore } from '../../stores/easterEgg'
import { toAlienText } from '../../utils/alienFont'

const store = useEasterEggStore()
const originalTexts = new Map()

function getTextNodes(root) {
  const nodes = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
  while (walker.nextNode()) {
    if (walker.currentNode.textContent.trim()) {
      nodes.push(walker.currentNode)
    }
  }
  return nodes
}

function activate() {
  const textNodes = getTextNodes(document.body)
  textNodes.forEach(node => {
    if (/[\u4e00-\u9fff]/.test(node.textContent)) {
      originalTexts.set(node, node.textContent)
      node.textContent = toAlienText(node.textContent)
    }
  })
}

function deactivate() {
  originalTexts.forEach((original, node) => {
    if (node.parentNode) {
      node.textContent = original
    }
  })
  originalTexts.clear()
}

function onKeyDown(e) {
  if (e.altKey && e.code === 'KeyA') {
    e.preventDefault()
    if (store.alienLanguage) {
      deactivate()
      store.toggleAlienLanguage()
    } else {
      store.toggleAlienLanguage()
      activate()
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  if (store.alienLanguage) {
    deactivate()
  }
})
</script>
