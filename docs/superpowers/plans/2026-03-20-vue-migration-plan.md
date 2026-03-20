# Higher Soul Zone Vue Migration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate Higher Soul Zone from static HTML to a Vue 3 SPA with Cyberpunk styling and 9 interactive easter eggs.

**Architecture:** Vue 3 + Vite SPA with Vue Router for 7 routes, Pinia for global easter egg state, GSAP for complex animations, Canvas API for particle systems, and Web Audio API for synthesized sound effects. All CSS is hand-crafted (no UI framework).

**Tech Stack:** Vue 3, Vite 5, Vue Router 4, Pinia 2, GSAP 3, Canvas API, Web Audio API

**Spec:** `docs/superpowers/specs/2026-03-20-vue-migration-design.md`

---

## File Structure

```
src/
├── main.js                          # App entry, mount Vue + plugins
├── App.vue                          # Root: layout + global easter egg layers
├── router/
│   └── index.js                     # Vue Router config (7 routes)
├── stores/
│   └── easterEgg.js                 # Pinia store for all easter egg state
├── composables/
│   ├── useAudio.js                  # Web Audio API singleton + alien sounds
│   ├── useCopyProtection.js         # Copy event detection → /dead redirect
│   ├── useKonamiCode.js             # Keyboard sequence detector
│   └── useRapidClick.js             # Rapid click counter (Matrix trigger)
├── components/
│   ├── layout/
│   │   ├── AppBanner.vue            # logo.png banner
│   │   ├── AppNav.vue               # Navigation with garbled text easter egg
│   │   └── AppFooter.vue            # Footer bar
│   └── easter-eggs/
│       ├── KonamiOverlay.vue        # UFO landing animation (CSS + GSAP)
│       ├── MatrixRain.vue           # Green character rain (Canvas)
│       ├── MouseParticles.vue       # Star trail + black hole (Canvas)
│       ├── UfoFlyby.vue             # Scroll-triggered UFO flyby (CSS)
│       └── AlienLanguageFilter.vue  # Alt+A alien text overlay
├── views/
│   ├── HomeView.vue                 # Landing page
│   ├── IntroduceView.vue            # Fermi paradox content + copy protection
│   ├── AlienTypesView.vue           # 8 alien species cards + sound effects
│   ├── AuthorsView.vue              # Author profiles + third eye easter egg
│   ├── ContactView.vue              # Links + heart break easter egg
│   ├── FormView.vue                 # Contact form with neon button
│   └── DeadSiteView.vue             # Secret page with explosion animation
├── data/
│   └── aliens.js                    # Alien species data (name, desc, image, sound config)
├── styles/
│   ├── global.css                   # Reset, fonts, CSS variables, base styles
│   ├── transitions.css              # Wormhole page transition keyframes
│   └── glitch.css                   # Glitch text animation (from style3.css)
├── utils/
│   └── alienFont.js                 # Chinese → alien symbol character mapping
index.html                           # Vite entry HTML
vite.config.js                       # Vite config
package.json                         # Dependencies
public/
├── media/
│   ├── logo.png                     # (copied from Media/)
│   ├── alien.png                    # (copied from Media/)
│   ├── love.png                     # (copied from Media/)
│   └── love2.png                    # (copied from Media/)
```

---

## Task 1: Scaffold Vue Project + Move Assets

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.js`, `src/App.vue`
- Create: `public/media/` (copy assets)

- [ ] **Step 1: Initialize Vite + Vue project**

```bash
cd D:/Angel/HigherSoulZone
npm create vite@latest vue-app -- --template vue
```

- [ ] **Step 2: Move scaffolded files to project root**

Move contents of `vue-app/` to project root (merge `package.json`, `vite.config.js`, `index.html`, `src/`). Remove `vue-app/` shell.

- [ ] **Step 3: Install dependencies**

```bash
npm install vue-router@4 pinia gsap
```

- [ ] **Step 4: Copy media assets to public/**

```bash
mkdir -p public/media
cp Media/logo.png Media/alien.png Media/love.png Media/love2.png public/media/
```

- [ ] **Step 5: Download alien species images**

Download the 8 alien images from the original external URLs in `alien_type.html` into `public/media/aliens/`:

```bash
mkdir -p public/media/aliens
curl -L -o public/media/aliens/pleiadian.jpg "https://i.pinimg.com/736x/50/08/81/5008816dcbaeddf8676b20b4f42dea35.jpg"
curl -L -o public/media/aliens/lyran.jpg "https://static.wixstatic.com/media/b4af52_a3d123f7c3b0462daba2c2b82a0e12df~mv2.jpg/v1/crop/x_0,y_271,w_1000,h_396/fill/w_996,h_396,al_c,q_85,enc_auto/Lyrans.jpg"
curl -L -o public/media/aliens/greys.jpg "https://cdnb.artstation.com/p/assets/images/images/004/897/475/medium/oleg-egorov-1-3-zbr.jpg?1487068411"
curl -L -o public/media/aliens/reptilians.jpg "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/7800898c-4551-4a81-a4c7-4e21132a6da1/dde2tzc-a83849f8-26f0-4287-a549-0364b93009f6.jpg"
curl -L -o public/media/aliens/orions.jpg "https://i.pinimg.com/originals/ac/d4/5b/acd45b113d9437b3ac24b20c64762e68.jpg"
curl -L -o public/media/aliens/dracos.jpg "https://artignition.com/wp-content/uploads/2017/06/Mark-Akopov-Alien-Artwork.jpg"
curl -L -o public/media/aliens/sirians.jpg "https://posercontent.com/sites/default/files/products/17/0629/0236/nenana-alien-hd-for-genesis.jpg"
curl -L -o public/media/aliens/mothmen.jpg "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/1e507d04-d52a-4d2d-8a43-90e84cf45fd8/daesgc1-ccad0915-f319-4851-983c-47cb1c8cdb30.jpg"
```

If any download fails (hotlink protection), use a placeholder image or find a replacement. Verify all 8 files exist and have non-zero size.

- [ ] **Step 6: Create .gitignore**

Ensure `.gitignore` includes `node_modules/`, `dist/`, `.vite/`. The `npm create vite` template provides one, but verify it survived the file move step.

- [ ] **Step 7: Configure vite.config.js**

```js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: { port: 3000 }
})
```

- [ ] **Step 6: Set up index.html with Google Fonts**

```html
<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>✧༝◦‥‥◦༝✦ Higher Soul Zone</title>
  <link href="https://fonts.googleapis.com/css2?family=Russo+One&family=Staatliches&display=swap" rel="stylesheet">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 7: Verify dev server starts**

```bash
npm run dev
```

Expected: Vite dev server on http://localhost:3000 with default Vue page.

- [ ] **Step 8: Commit**

```bash
git add package.json vite.config.js index.html src/ public/media/
git commit -m "feat: scaffold Vue 3 + Vite project with assets"
```

---

## Task 2: Global Styles + CSS Variables

**Files:**
- Create: `src/styles/global.css`
- Create: `src/styles/transitions.css`
- Create: `src/styles/glitch.css`

- [ ] **Step 1: Create global.css with Cyberpunk theme**

```css
/* src/styles/global.css */
:root {
  --color-bg: #000;
  --color-primary: #00ff88;
  --color-accent: #ff00c8;
  --color-text: #fff;
  --color-text-dim: rgba(255, 255, 255, 0.5);
  --color-border: rgba(255, 255, 255, 0.08);
  --font-display: 'Russo One', sans-serif;
  --font-heading: 'Staatliches', sans-serif;
  --font-body: '微軟正黑體', 'Microsoft JhengHei', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-body);
  overflow-x: hidden;
}

a {
  color: var(--color-primary);
  text-decoration: none;
  transition: color 0.3s;
}
a:hover {
  color: var(--color-accent);
}

::selection {
  background: var(--color-accent);
  color: var(--color-bg);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Create transitions.css for wormhole page transition**

```css
/* src/styles/transitions.css */
.wormhole-enter-active,
.wormhole-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.wormhole-enter-from {
  opacity: 0;
  transform: scale(0.6) rotate(8deg);
}
.wormhole-enter-to {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}

.wormhole-leave-from {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
.wormhole-leave-to {
  opacity: 0;
  transform: scale(0.6) rotate(-8deg);
}
```

- [ ] **Step 3: Create glitch.css (ported from style3.css)**

Port the `.jt` glitch text animation from the original `style3.css` for use in DeadSiteView. Keep the clip-path multi-row glitch effect with keyframes.

```css
/* src/styles/glitch.css */
.glitch-text {
  position: relative;
  font-size: 8vmin;
  font-family: var(--font-heading);
  text-transform: uppercase;
  color: var(--color-accent);
  text-shadow: 0 0 10px var(--color-accent);
}

.glitch-text__row {
  display: block;
}
.glitch-text__row:nth-child(1) {
  clip-path: polygon(-10% 75%, 110% 75%, 110% 110%, -10% 110%);
}
.glitch-text__row:nth-child(2) {
  clip-path: polygon(-10% 50%, 110% 50%, 110% 75.3%, -10% 75.3%);
}
.glitch-text__row:nth-child(3) {
  clip-path: polygon(-10% 25%, 110% 25%, 110% 50.3%, -10% 50.3%);
}
.glitch-text__row:nth-child(4) {
  clip-path: polygon(-10% 0%, 110% 0%, 110% 25.3%, -10% 25.3%);
}

.glitch-text__row--sibling {
  position: absolute;
  top: 0;
  left: 0;
  user-select: none;
}

.glitch-text__inner {
  display: block;
  transform-origin: bottom left;
  animation: glitchMove 2s cubic-bezier(.36,0,.06,1) alternate infinite;
}
.glitch-text__row:nth-child(2) .glitch-text__inner { transform: translateY(-0.3em) scaleY(1.1); }
.glitch-text__row:nth-child(3) .glitch-text__inner { transform: translateY(-0.5em) scaleY(1.2); }
.glitch-text__row:nth-child(4) .glitch-text__inner { transform: translateY(-0.7em) scaleY(1.3); }

@keyframes glitchMove {
  0% { opacity: 0; filter: blur(10px); }
  50%, 100% { transform: translateY(0); opacity: 1; filter: blur(0); }
}
```

- [ ] **Step 4: Import global.css in main.js**

Note: `main.js` is progressively built across Tasks 2 and 3. This version adds styles and Pinia. Task 3 will add the router import.

```js
// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import './styles/global.css'
import './styles/transitions.css'
import './styles/glitch.css'

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
```

- [ ] **Step 5: Verify styles load**

```bash
npm run dev
```

Expected: Black page with no errors in console.

- [ ] **Step 6: Commit**

```bash
git add src/styles/ src/main.js
git commit -m "feat: add Cyberpunk global styles and page transitions"
```

---

## Task 3: Router + Layout Components

**Files:**
- Create: `src/router/index.js`
- Create: `src/components/layout/AppBanner.vue`
- Create: `src/components/layout/AppNav.vue`
- Create: `src/components/layout/AppFooter.vue`
- Modify: `src/App.vue`
- Create: placeholder views (all 7)

- [ ] **Step 1: Create router with 7 routes**

```js
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'home', component: () => import('../views/HomeView.vue') },
  { path: '/introduce', name: 'introduce', component: () => import('../views/IntroduceView.vue') },
  { path: '/alien-types', name: 'alienTypes', component: () => import('../views/AlienTypesView.vue') },
  { path: '/authors', name: 'authors', component: () => import('../views/AuthorsView.vue') },
  { path: '/contact', name: 'contact', component: () => import('../views/ContactView.vue') },
  { path: '/form', name: 'form', component: () => import('../views/FormView.vue') },
  { path: '/dead', name: 'dead', component: () => import('../views/DeadSiteView.vue') },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
```

- [ ] **Step 2: Register router in main.js**

Add `import router from './router'` and `app.use(router)` to `src/main.js`.

- [ ] **Step 3: Create AppBanner.vue**

```vue
<!-- src/components/layout/AppBanner.vue -->
<template>
  <header class="banner">
    <router-link to="/">
      <img src="/media/logo.png" alt="Higher Soul Zone" class="banner__logo" />
    </router-link>
  </header>
</template>

<style scoped>
.banner {
  text-align: center;
  padding: 20px 0 10px;
}
.banner__logo {
  max-width: 100%;
  height: auto;
  filter: drop-shadow(0 0 20px rgba(0, 255, 136, 0.3));
  transition: filter 0.3s;
}
.banner__logo:hover {
  filter: drop-shadow(0 0 30px rgba(255, 0, 200, 0.5));
}
</style>
```

- [ ] **Step 4: Create AppNav.vue**

Navigation with 5 items. The 3rd item (`くぁwせfふじこ`) has a click handler for the garbled text easter egg (#1). When clicked, `preventDefault` stops navigation and triggers the text-change animation across all nav items.

```vue
<!-- src/components/layout/AppNav.vue -->
<template>
  <nav class="nav">
    <ul class="nav__list">
      <li v-for="(item, i) in displayItems" :key="i" class="nav__item">
        <router-link
          v-if="!item.isEasterEgg"
          :to="item.to"
          class="nav__link"
        >
          <span
            v-for="(char, ci) in item.displayText.split('')"
            :key="ci"
            class="nav__char"
            :style="{ animationDelay: glitchActive ? `${ci * 30}ms` : '0ms' }"
            :class="{ 'nav__char--glitch': glitchActive }"
          >{{ char }}</span>
        </router-link>
        <a
          v-else
          href="#"
          class="nav__link nav__link--garbled"
          @click.prevent="triggerGarbledEgg"
        >
          <span
            v-for="(char, ci) in item.displayText.split('')"
            :key="ci"
            class="nav__char"
            :style="{ animationDelay: glitchActive ? `${ci * 30}ms` : '0ms' }"
            :class="{ 'nav__char--glitch': glitchActive }"
          >{{ char }}</span>
        </a>
      </li>
    </ul>
    <transition name="fade">
      <span v-if="alienLanguage" class="nav__indicator">👽 外星語模式</span>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useEasterEggStore } from '../../stores/easterEgg'

const store = useEasterEggStore()
const alienLanguage = computed(() => store.alienLanguage)
const garbledTriggered = ref(false)
const glitchActive = ref(false)

const navItems = [
  { label: '✦ 網 站 介 紹', to: '/introduce', isEasterEgg: false },
  { label: '✦ 我 們 是 誰', to: '/alien-types', isEasterEgg: false },
  { label: 'くぁwせfふじこ', to: '/form', isEasterEgg: true },
  { label: '✦ 作 者 介 紹', to: '/authors', isEasterEgg: false },
  { label: '✦ 友 站 連 結', to: '/contact', isEasterEgg: false },
]

const garbledTexts = [
  '快點 聯絡我們',
  '我們在 等你唷',
  '快點快點快點',
  '快來跟我們玩',
  '快點快點快點',
]

const displayItems = computed(() =>
  navItems.map((item, i) => ({
    ...item,
    displayText: garbledTriggered.value ? garbledTexts[i] : item.label,
  }))
)

function triggerGarbledEgg() {
  glitchActive.value = true
  setTimeout(() => {
    garbledTriggered.value = true
    setTimeout(() => { glitchActive.value = false }, 500)
  }, 400)
}
</script>

<style scoped>
.nav__list {
  display: flex;
  list-style: none;
  gap: 6px;
  justify-content: center;
  padding: 0;
}
.nav__item { position: relative; }
.nav__link {
  display: block;
  padding: 0 24px;
  line-height: 42px;
  color: rgba(255, 255, 255, 0.6);
  font-family: var(--font-display);
  font-size: 14px;
  letter-spacing: 3px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  transition: all 0.3s;
  white-space: nowrap;
}
.nav__link:hover {
  color: var(--color-primary);
  border-color: rgba(0, 255, 136, 0.3);
  box-shadow: 0 0 12px rgba(0, 255, 136, 0.15);
}
.nav__link--garbled {
  color: var(--color-primary);
  border-color: rgba(0, 255, 136, 0.2);
}
.nav__char--glitch {
  display: inline-block;
  animation: charGlitch 0.4s ease forwards;
}
@keyframes charGlitch {
  0%, 30% { opacity: 0; transform: translateY(-4px); }
  60% { opacity: 0.5; content: '█'; }
  100% { opacity: 1; transform: translateY(0); }
}
.nav__indicator {
  display: block;
  text-align: center;
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 2px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
```

- [ ] **Step 5: Create AppFooter.vue**

```vue
<!-- src/components/layout/AppFooter.vue -->
<template>
  <footer class="footer">
    <p class="footer__text">
      ✧✦ 外 星 人 大 法 好 ！ ✦✧
    </p>
    <p class="footer__copy">©2022 HsssUEJSU. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 16px 0;
  margin-top: 40px;
  border-top: 1px solid var(--color-border);
  opacity: 0.4;
  transition: opacity 0.5s;
}
.footer:hover { opacity: 1; }
.footer__text {
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 4px;
}
.footer__copy {
  font-size: 11px;
  color: var(--color-text-dim);
  margin-top: 4px;
}
</style>
```

- [ ] **Step 6: Create 7 placeholder views**

Create each view file in `src/views/` with minimal template:

```vue
<template>
  <div class="view">
    <h2>[PageName] — placeholder</h2>
  </div>
</template>
```

Files: `HomeView.vue`, `IntroduceView.vue`, `AlienTypesView.vue`, `AuthorsView.vue`, `ContactView.vue`, `FormView.vue`, `DeadSiteView.vue`

- [ ] **Step 7: Wire up App.vue with layout + router-view + transition**

```vue
<!-- src/App.vue -->
<template>
  <div class="app">
    <div class="app__geometric app__geometric--circle"></div>
    <div class="app__geometric app__geometric--square"></div>
    <div class="app__layout">
      <AppBanner />
      <AppNav />
      <main class="app__content">
        <router-view v-slot="{ Component }">
          <transition name="wormhole" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
      <AppFooter />
    </div>
  </div>
</template>

<script setup>
import AppBanner from './components/layout/AppBanner.vue'
import AppNav from './components/layout/AppNav.vue'
import AppFooter from './components/layout/AppFooter.vue'
</script>

<style scoped>
.app {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}
.app__geometric {
  position: fixed;
  pointer-events: none;
  border: 1px solid rgba(255, 255, 255, 0.04);
  z-index: 0;
}
.app__geometric--circle {
  width: 300px; height: 300px;
  border-radius: 50%;
  top: 10%; left: 5%;
}
.app__geometric--square {
  width: 150px; height: 150px;
  bottom: 15%; right: 8%;
  transform: rotate(45deg);
}
.app__layout {
  position: relative;
  z-index: 1;
  max-width: 900px;
  margin: 0 auto;
  padding: 0 20px;
}
.app__content {
  min-height: 60vh;
  padding: 30px 0;
}
</style>
```

- [ ] **Step 8: Verify routing works**

```bash
npm run dev
```

Navigate to `/`, `/introduce`, `/alien-types` etc. All should show placeholder text with wormhole transition animation.

- [ ] **Step 9: Commit**

```bash
git add src/router/ src/components/layout/ src/views/ src/App.vue src/main.js
git commit -m "feat: add router, layout components, and placeholder views"
```

---

## Task 4: Pinia Easter Egg Store

**Files:**
- Create: `src/stores/easterEgg.js`

- [ ] **Step 1: Create the easter egg store**

```js
// src/stores/easterEgg.js
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
    konamiSequence.value.push(code)
    if (konamiSequence.value.length > KONAMI.length) {
      konamiSequence.value.shift()
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
    clickTimestamps.value.push(now)
    clickTimestamps.value = clickTimestamps.value.filter(t => now - t < 1000)
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
      triggeredUfoPositions.value.push(positionKey)
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
```

- [ ] **Step 2: Verify store imports correctly**

Import store in App.vue temporarily and log a value to confirm Pinia is wired up. Remove after verification.

- [ ] **Step 3: Commit**

```bash
git add src/stores/
git commit -m "feat: add Pinia easter egg state store"
```

---

## Task 5: Composables (Audio, Copy Protection, Konami, Rapid Click)

**Files:**
- Create: `src/composables/useAudio.js`
- Create: `src/composables/useCopyProtection.js`
- Create: `src/composables/useKonamiCode.js`
- Create: `src/composables/useRapidClick.js`

- [ ] **Step 1: Create useAudio.js**

Web Audio API singleton. Creates AudioContext on first user gesture. Provides `playAlienSound(alienType)` and `playExplosion()` functions.

Alien sound definitions (8 species):
- Pleiadian: C+E+G sine chord
- Lyran: ascending triangle arpeggio
- Greys: 2kHz sine with vibrato
- Reptilians: 80Hz sawtooth with LFO
- Orions: random frequency cluster
- Dracos: tritone square wave
- Sirians: sine with delay feedback
- Mothmen: high sine with fast tremolo

Each sound plays for ~0.8s with GainNode envelope (attack 0.05s, release 0.3s).

- [ ] **Step 2: Create useCopyProtection.js**

```js
// src/composables/useCopyProtection.js
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
```

- [ ] **Step 3: Create useKonamiCode.js**

```js
// src/composables/useKonamiCode.js
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
```

- [ ] **Step 4: Create useRapidClick.js**

```js
// src/composables/useRapidClick.js
import { useEasterEggStore } from '../stores/easterEgg'

export function useRapidClick() {
  const store = useEasterEggStore()
  return { onClick: () => store.registerClick() }
}
```

- [ ] **Step 5: Commit**

```bash
git add src/composables/
git commit -m "feat: add composables for audio, copy protection, konami, rapid click"
```

---

## Task 6: Alien Data + Utility

**Files:**
- Create: `src/data/aliens.js`
- Create: `src/utils/alienFont.js`

- [ ] **Step 1: Create aliens.js with all 8 species data**

Extract content from original `alien_type.html`. Each entry:
```js
{
  id: 'pleiadian',
  nameCn: '昴宿星人',
  nameEn: 'Pleiadian',
  image: '/media/aliens/pleiadian.jpg', // placeholder path
  description: '七姐妹星人，是居住在...',
  soundConfig: { type: 'chord', notes: [261.63, 329.63, 392.00], wave: 'sine' }
}
```

All 8 species with full Chinese descriptions from original HTML.

- [ ] **Step 2: Create alienFont.js character mapping**

```js
// src/utils/alienFont.js
// Maps common Chinese characters to Cuneiform / math symbol Unicode ranges
const alienMap = {}
const cuneiform = Array.from({ length: 100 }, (_, i) => String.fromCodePoint(0x12000 + i))
const mathSymbols = '∀∂∃∅∇∈∉∋∏∑−∗√∝∞∠∡∢∣∤∥∦§∨∩∪∫∬∭∮∯∰∱∲∳'.split('')

export function toAlienText(text) {
  return text.split('').map(char => {
    if (/[\u4e00-\u9fff]/.test(char)) {
      const code = char.charCodeAt(0)
      const pool = [...cuneiform, ...mathSymbols]
      return pool[code % pool.length]
    }
    return char
  }).join('')
}

export function isChineseChar(char) {
  return /[\u4e00-\u9fff]/.test(char)
}
```

- [ ] **Step 3: Commit**

```bash
git add src/data/ src/utils/
git commit -m "feat: add alien species data and alien font utility"
```

---

## Task 7: Content Views (Home, Introduce, AlienTypes, Authors, Contact, Form)

**Files:**
- Modify: `src/views/HomeView.vue`
- Modify: `src/views/IntroduceView.vue`
- Modify: `src/views/AlienTypesView.vue`
- Modify: `src/views/AuthorsView.vue`
- Modify: `src/views/ContactView.vue`
- Modify: `src/views/FormView.vue`

- [ ] **Step 1: Implement HomeView.vue**

Minimal landing page. Content area with a subtle geometric animation or tagline text. No table — the original was empty.

- [ ] **Step 2: Implement IntroduceView.vue**

Port Fermi paradox text content from `introduce.html`. Use `useCopyProtection` composable on the content `ref`. Style text with Cyberpunk theme: dim white body text, purple accent for English quotes, green for the final quote.

- [ ] **Step 3: Implement AlienTypesView.vue**

Render 8 alien cards from `src/data/aliens.js`. Each card shows image + name + description. On click, plays alien sound via `useAudio`. Cards have Cyberpunk styling: dark background, thin border, glow on hover. Integrate `useCopyProtection`.

- [ ] **Step 4: Implement AuthorsView.vue**

Port author data from `author.html`. Two author cards (EJ_SU and HsssU). Add hidden third-eye trigger: triple-click on the `<span>` containing "致力於第三隻眼的研究" calls `store.toggleThirdEye()`. When `thirdEyeOpen`, apply CSS `filter: invert(1) hue-rotate(180deg)` to page and show hidden elements (coordinates, messages). Use `useCopyProtection`.

- [ ] **Step 5: Implement ContactView.vue**

Two link cards (Area 51 and Taiwan Raelian Movement). Heart image (`love.png`) with click handler. On click: trigger shake animation → Canvas particle burst → swap to `love2.png`. External links open in new tab.

- [ ] **Step 6: Implement FormView.vue**

Port form from `form_final.html`. Three fields: human name (text, required), human email (email, required), save body (checkbox). Submit button with animated neon border spans (4 traveling light spans, ported from original CSS but recolored to `#0f8`). On submit: `preventDefault`, show Cyberpunk success animation ("訊號已發送至外太空..."), auto-dismiss after 3s. Organ donation link → `target="_blank"`. Back to home link → `router-link to="/"`.

- [ ] **Step 7: Verify all pages render with content**

Navigate through all routes manually. Confirm text content matches original, Cyberpunk styling is applied.

- [ ] **Step 8: Commit**

```bash
git add src/views/
git commit -m "feat: implement all 6 content views with Cyberpunk styling"
```

---

## Task 8: DeadSite View (Explosion Animation)

**Files:**
- Modify: `src/views/DeadSiteView.vue`

- [ ] **Step 1: Implement DeadSiteView.vue**

Full-screen dark page. Glitch text "會幫我們保密嗎?" using classes from `glitch.css`. Alien images at top and bottom. Starfield background (CSS, ported from `style2.css`). "我會保密!" button.

- [ ] **Step 2: Implement GSAP explosion timeline**

On button click, execute GSAP Timeline (ported from `script2.js`):
1. Button text opacity → 0 (0.6s)
2. Button shrink, opacity 0.5, purple glow `boxShadow: 0 0 35px 7px #cd28fa` (0.8s, delay 0.25)
3. Green flash `background: #26ff92` (0.1s)
4. Width → 1px (delay 0.2)
5. Red explosion `boxShadow: 0 0 100px 55px #fa2856`, y: 90, height: 100 (0.1s, delay 0.23)
6. Height → 1000, y → -1500 (0.3s, delay 0.2)
7. "THANK YOU! (> <)" fade in opacity → 1 (1s, delay 0.3)

After animation, `setTimeout(() => router.push('/'), 5000)`.

- [ ] **Step 3: Add explosion sound effect**

Call `useAudio().playExplosion()` when button is clicked (low-freq burst + high-freq flash).

- [ ] **Step 4: Verify explosion animation plays correctly**

Navigate to `/dead`, click button, confirm full animation sequence plays and redirects to `/` after 5 seconds.

- [ ] **Step 5: Commit**

```bash
git add src/views/DeadSiteView.vue
git commit -m "feat: implement DeadSite explosion animation with GSAP"
```

---

## Task 9: Easter Egg — Konami Code UFO Landing

**Files:**
- Create: `src/components/easter-eggs/KonamiOverlay.vue`
- Modify: `src/App.vue` (add overlay)

- [ ] **Step 1: Create KonamiOverlay.vue**

Full-screen overlay (z-index: 9999). Shows when `store.konamiActivated` is true. Animation sequence:
1. UFO appears at top (CSS-drawn saucer shape with radial gradient glow)
2. UFO descends to center (2s GSAP ease)
3. Light beam extends downward (expanding trapezoid, yellow-green gradient)
4. Small alien silhouette walks out of beam (CSS figure, 1s)
5. Alien waves (CSS animation)
6. After 5s: UFO + alien ascend and fly away
7. Hide overlay but keep `konamiActivated = true` (per spec: persistent enhanced starfield effect across pages — add subtle extra star particles to MouseParticles when konamiActivated is true)

- [ ] **Step 2: Register useKonamiCode in App.vue**

Import and call `useKonamiCode()` in App.vue setup. Add `<KonamiOverlay />` to template.

- [ ] **Step 3: Test Konami code**

Press ↑↑↓↓←→←→BA on any page. UFO should appear and animate.

- [ ] **Step 4: Commit**

```bash
git add src/components/easter-eggs/KonamiOverlay.vue src/App.vue
git commit -m "feat: add Konami Code UFO landing easter egg"
```

---

## Task 10: Easter Egg — Matrix Rain

**Files:**
- Create: `src/components/easter-eggs/MatrixRain.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create MatrixRain.vue**

Full-screen Canvas overlay. Triggers when `store.matrixMode` is true. Canvas renders falling green characters (katakana + digits). Columns of characters fall at different speeds. Fades out after 4 seconds.

Implementation:
- Create array of column positions
- Each frame: draw semi-transparent black rect (trail effect), then draw random characters at column positions
- Character set: カタカナ (U+30A0-U+30FF) + digits 0-9
- Color: `#0f8` with varying opacity
- On mount: start `requestAnimationFrame` loop
- On `matrixMode` becoming false: fade canvas opacity to 0

Additionally, implement real-text-replacement per spec:
- When Matrix mode activates, walk `document.body` text nodes
- Replace visible characters with random katakana/digits (one character per 20ms, staggered)
- Store original text in a Map
- After 2 seconds, restore original text character-by-character
- This runs concurrently with the Canvas rain effect

- [ ] **Step 2: Wire rapid-click detection in App.vue**

Add `@click="onRapidClick"` to the app root div. Import `useRapidClick`.

- [ ] **Step 3: Test 5 rapid clicks**

Click page 5 times quickly. Matrix rain should appear for 4 seconds.

- [ ] **Step 4: Commit**

```bash
git add src/components/easter-eggs/MatrixRain.vue src/App.vue
git commit -m "feat: add Matrix rain easter egg on rapid click"
```

---

## Task 11: Easter Egg — Mouse Particles

**Files:**
- Create: `src/components/easter-eggs/MouseParticles.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create MouseParticles.vue**

Full-screen Canvas, always active (pointer-events: none). Tracks mouse position.

Particle system:
- On mousemove: spawn 1-2 particles at cursor position
- Each particle: x, y, vx, vy (small random), size (3-6px), opacity (1→0), color (white default)
- Max 100 particles. On each frame: update positions, decrease opacity, remove dead particles.
- Draw as circles with `ctx.arc` and radial gradient for glow.

Black hole mechanic:
- Track mousedown duration
- After 3 seconds held: particles start moving toward mouse position (gravity attraction)
- Particles spiral inward, forming rotating vortex
- On mouseup: particles explode outward (velocity burst)

Route-aware color:
- Listen to `route.name`. On `alienTypes` page, emit events when hovering alien cards to change particle color.

- [ ] **Step 2: Add to App.vue**

```vue
<MouseParticles />
```

- [ ] **Step 3: Test mouse trail and black hole**

Move mouse — particles follow. Hold mouse 3 seconds — vortex forms. Release — burst.

- [ ] **Step 4: Commit**

```bash
git add src/components/easter-eggs/MouseParticles.vue src/App.vue
git commit -m "feat: add mouse star particles with black hole effect"
```

---

## Task 12: Easter Egg — UFO Flyby

**Files:**
- Create: `src/components/easter-eggs/UfoFlyby.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create UfoFlyby.vue**

CSS-only UFO that flies across screen. Uses IntersectionObserver to detect when user scrolls to 40% and 70% of page height (only on introduce and alien-types routes).

UFO element: CSS-drawn saucer (ellipse + dome) with light beam trailing underneath. Positioned fixed, animated with CSS `@keyframes` flying from one side to the other along an arc path (`translateX` + `translateY` with sine-wave offset).

On trigger:
1. Check `store.markUfoTriggered(positionKey)` — if already triggered, skip
2. Randomly choose direction (left→right or right→left) and vertical position
3. Add UFO element, play fly animation (3s), remove element

Reset `triggeredUfoPositions` on route change via `watch(route)`.

- [ ] **Step 2: Add to App.vue**

- [ ] **Step 3: Test on /introduce page**

Scroll down. UFO should fly across at ~40% scroll position.

- [ ] **Step 4: Commit**

```bash
git add src/components/easter-eggs/UfoFlyby.vue src/App.vue
git commit -m "feat: add scroll-triggered UFO flyby easter egg"
```

---

## Task 13: Easter Egg — Alien Language (Alt+A)

**Files:**
- Create: `src/components/easter-eggs/AlienLanguageFilter.vue`
- Modify: `src/App.vue`

- [ ] **Step 1: Create AlienLanguageFilter.vue**

Listens for `Alt+A` keydown globally. On trigger:
1. `store.toggleAlienLanguage()`
2. If activating: walk all text nodes in `document.body`, replace Chinese characters with alien symbols using `toAlienText()` from `alienFont.js`. Store originals in a WeakMap.
3. If deactivating: restore originals from WeakMap.
4. Add per-character flicker animation during transition (CSS class toggled briefly).

Nav indicator "👽 外星語模式" is handled by AppNav.vue (already wired to `store.alienLanguage`).

- [ ] **Step 2: Add to App.vue**

- [ ] **Step 3: Test Alt+A toggle**

Press Alt+A — all Chinese text transforms to alien symbols. Press again — restores.

- [ ] **Step 4: Commit**

```bash
git add src/components/easter-eggs/AlienLanguageFilter.vue src/App.vue
git commit -m "feat: add Alt+A alien language translator easter egg"
```

---

## Task 14: Easter Egg — Third Eye + Heart Break + Audio Integration

**Files:**
- Modify: `src/views/AuthorsView.vue` (third eye already partially wired in Task 7)
- Modify: `src/views/ContactView.vue` (heart break already partially wired in Task 7)
- Modify: `src/views/AlienTypesView.vue` (audio click handlers)
- Finalize: `src/composables/useAudio.js`

- [ ] **Step 1: Finalize useAudio.js implementation**

Complete Web Audio API implementation. Core structure:

```js
// src/composables/useAudio.js
let audioCtx = null
let initialized = false

function getContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function showAudioToast() {
  if (initialized) return
  initialized = true
  // Create temporary DOM element: "🔊 已啟用音效"
  // Position fixed, top-right, fade in/out over 2 seconds
  const toast = document.createElement('div')
  toast.textContent = '🔊 已啟用音效'
  toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:8px 16px;background:rgba(0,255,136,0.15);color:#0f8;border:1px solid #0f8;border-radius:4px;font-size:13px;z-index:99999;transition:opacity 0.5s;'
  document.body.appendChild(toast)
  setTimeout(() => { toast.style.opacity = '0' }, 1500)
  setTimeout(() => toast.remove(), 2000)
}

const ALIEN_SOUNDS = {
  pleiadian: { type: 'chord', notes: [261.63, 329.63, 392.00], wave: 'sine' },
  lyran: { type: 'arpeggio', notes: [440, 523, 659, 784], wave: 'triangle' },
  greys: { type: 'vibrato', freq: 2000, wave: 'sine', vibratoRate: 8 },
  reptilians: { type: 'pulse', freq: 80, wave: 'sawtooth', lfoRate: 2 },
  orions: { type: 'cluster', count: 5, wave: 'sine' },
  dracos: { type: 'chord', notes: [261.63, 369.99], wave: 'square' }, // tritone
  sirians: { type: 'echo', freq: 440, wave: 'sine', delay: 0.15 },
  mothmen: { type: 'tremolo', freq: 1200, wave: 'sine', tremoloRate: 20 },
}

export function useAudio() {
  function playAlienSound(alienId) { /* build oscillator graph per ALIEN_SOUNDS[alienId] config */ showAudioToast() }
  function playExplosion() { /* low-freq burst (60Hz sawtooth, 0.3s) + high-freq flash (4kHz sine, 0.1s) */ showAudioToast() }
  return { playAlienSound, playExplosion }
}
```

Each `playAlienSound` implementation creates OscillatorNode(s) + GainNode with 0.05s attack, 0.3s release envelope, total ~0.8s. The `playExplosion` creates two simultaneous oscillators.

- [ ] **Step 2: Wire alien card click → sound in AlienTypesView**

Each alien card's `@click` calls `playAlienSound(alien.id)`.

- [ ] **Step 3: Polish third eye effect in AuthorsView**

Ensure triple-click detection works on "致力於第三隻眼的研究" span. Hidden elements appear with fade-in animation. Page filter transition is smooth (0.5s ease).

- [ ] **Step 4: Polish heart break in ContactView**

Implement Canvas particle burst on heart click:
1. Heart image shakes (CSS animation, 0.3s)
2. Create temporary Canvas overlay at heart position
3. Sample heart image colors, spawn ~50 particles from center
4. Particles fly outward with gravity (fall down)
5. After particles fade, swap image src to `love2.png`

- [ ] **Step 5: Test all three easter eggs**

- Click alien cards → hear different sounds
- Triple-click "第三隻眼" → page inverts, hidden text appears
- Click heart → shatter animation → broken heart

- [ ] **Step 6: Commit**

```bash
git add src/composables/useAudio.js src/views/AlienTypesView.vue src/views/AuthorsView.vue src/views/ContactView.vue
git commit -m "feat: add third eye, heart break, and alien sound easter eggs"
```

---

## Task 15: Final Integration + Polish

**Files:**
- Modify: `src/App.vue` (final assembly)
- All files (polish pass)

- [ ] **Step 1: Verify all 9 easter eggs work**

Test checklist:
1. ☐ Click `くぁwせfふじこ` → nav text changes with glitch animation
2. ☐ Click heart on /contact → shatter → broken heart
3. ☐ ↑↑↓↓←→←→BA → UFO landing
4. ☐ 5 rapid clicks → Matrix rain
5. ☐ Mouse trail particles visible
6. ☐ Hold mouse 3s → black hole → release → burst
7. ☐ Click alien cards → different sounds
8. ☐ Triple-click "第三隻眼" on /authors → inverted page + hidden text
9. ☐ Scroll on /introduce → UFO flies across
10. ☐ Alt+A → alien language toggle

- [ ] **Step 2: Verify copy protection**

On /introduce, /alien-types, /authors: select text → Ctrl+C → alert → redirect to /dead.
On /contact, /form, /: no copy protection.

- [ ] **Step 3: Verify page transitions**

Navigate between all routes. Wormhole transition should play smoothly (0.3s in/out).

- [ ] **Step 4: Check prefers-reduced-motion**

In browser devtools, enable "prefers-reduced-motion: reduce". Particle effects, transitions, and glitch animations should be disabled.

- [ ] **Step 5: Clean up any unused files**

Remove original static HTML/CSS/JS files if desired (keep in git history), or move to an `_archive/` directory.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: complete Vue migration with 9 easter eggs and Cyberpunk theme"
```

---

## Summary

| Task | Description | Est. Files |
|------|------------|-----------|
| 1 | Scaffold Vite + Vue project | 5 |
| 2 | Global styles + CSS variables | 3 |
| 3 | Router + Layout + Placeholder views | 12 |
| 4 | Pinia store | 1 |
| 5 | Composables | 4 |
| 6 | Data + Utility | 2 |
| 7 | Content views (6 pages) | 6 |
| 8 | DeadSite explosion | 1 |
| 9 | Konami Code UFO | 1 |
| 10 | Matrix Rain | 1 |
| 11 | Mouse Particles | 1 |
| 12 | UFO Flyby | 1 |
| 13 | Alien Language | 1 |
| 14 | Third Eye + Heart + Audio | 4 |
| 15 | Integration + Polish | all |

Tasks 1-6 are sequential (foundation). Tasks 7-8 depend on 1-6 but are independent of each other. Tasks 9-13 (easter eggs) are all independent and can be parallelized. Task 14 integrates easter eggs into views. Task 15 is the final pass.
