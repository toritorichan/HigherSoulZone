# Higher Soul Zone — Vue 改造設計文件

## 概述

將 Higher Soul Zone 從純 HTML/CSS/JS 靜態網站改造為 Vue 3 SPA，採用暗黑極簡 Cyberpunk 視覺風格，保留原始 banner 圖片，並加入 9 個隱藏彩蛋互動。

## 技術棧

- **框架**: Vue 3 (Composition API + `<script setup>`)
- **建置工具**: Vite
- **路由**: Vue Router 4
- **狀態管理**: Pinia（彩蛋全域狀態）
- **動畫**: GSAP + CSS animations + Canvas API
- **音效**: Web Audio API（OscillatorNode 合成，零音檔依賴）
- **字體**: Google Fonts（Russo One、Staatliches）+ 微軟正黑體

## 視覺風格：暗黑極簡 Cyberpunk

- 背景：純黑 `#000`
- 主色：螢光綠 `#0f8`
- 輔色：品紅 `#ff00c8`
- 文字：白色 `#fff`，低對比 `rgba(255,255,255,0.4-0.6)`
- 幾何線條裝飾（圓形、方形、三角形），低透明度
- Banner 保留原始 `logo.png`
- 大量留白、字體 letter-spacing 加大
- 滑鼠互動觸發 glitch 和光線微效果
- 字體用途：`Russo One` 用於導航和按鈕，`Staatliches` 用於標題和 deadSite glitch 文字，微軟正黑體用於中文內文
- 響應式：此專案以桌面體驗為主，不特別做 mobile 適配。鍵盤彩蛋（Konami Code、Alt+A）僅限桌面環境
- `prefers-reduced-motion`：偵測到時停用粒子效果、頁面轉場動畫和 glitch 效果

## 頁面路由

| 路由 | 元件 | 對應原頁面 | 說明 |
|------|------|-----------|------|
| `/` | HomeView | index.html | 首頁，Banner + 導航 |
| `/introduce` | IntroduceView | introduce.html | 費米悖論介紹 |
| `/alien-types` | AlienTypesView | alien_type.html | 8 種外星人資料表 |
| `/authors` | AuthorsView | author.html | 作者介紹 |
| `/contact` | ContactView | contact.html | 友站連結 + 愛心互動 |
| `/form` | FormView | form_final.html | 聯繫外星人表單 |
| `/dead` | DeadSiteView | deadSite.html | 秘密頁面（爆炸動畫） |

## 元件架構

```
App.vue
├── AppLayout.vue（共用外殼）
│   ├── AppBanner.vue（logo.png banner）
│   ├── AppNav.vue（導航列，含亂碼彩蛋）
│   └── AppFooter.vue（頁尾）
├── <router-view>（頁面內容）
│   ├── HomeView.vue
│   ├── IntroduceView.vue
│   ├── AlienTypesView.vue
│   ├── AuthorsView.vue
│   ├── ContactView.vue
│   ├── FormView.vue
│   └── DeadSiteView.vue
└── 全域彩蛋層（覆蓋在所有頁面上方）
    ├── KonamiOverlay.vue（UFO 降落動畫）
    ├── MatrixRain.vue（字元雨 Canvas）
    ├── MouseParticles.vue（星光粒子 Canvas）
    ├── UfoFlyby.vue（滾動觸發 UFO）
    └── AlienLanguageFilter.vue（外星語覆蓋層）
```

## 頁面轉場

使用 Vue Router + `<Transition>` 實現蟲洞穿越效果：

1. 離開頁面：內容從中心螺旋收縮 + 透明度降低（0.3s）
2. 進入頁面：內容從中心螺旋展開 + 透明度升高（0.3s）
3. 轉場期間背景閃爍紫色光暈
4. 總轉場時間 0.6s，進出動畫可重疊以減少感知延遲

## 彩蛋設計（共 9 個）

### 1. 亂碼變文字（保留升級）

- **觸發**: 點選導航中的 `くぁwせfふじこ` 項目
- **行為**: 點擊時 `preventDefault` 阻止路由跳轉，純粹執行動畫效果
- **效果**: 所有導航文字逐字 glitch 動畫後變成催促訊息（「快點聯絡我們」「我們在等你唷」等）
- **升級**: 加入逐字替換動畫，每個字元先顯示隨機亂碼再定格

### 2. 愛心破碎（保留升級）

- **觸發**: contact 頁點擊愛心圖片
- **效果**: 愛心先震動，然後碎裂成粒子飛散，粒子消散後顯示破碎愛心圖（love2.png）
- **升級**: 用 Canvas 粒子系統實現碎裂動畫，而非單純換圖

### 3. Konami Code UFO 降落

- **觸發**: 依序按下 ↑↑↓↓←→←→BA
- **效果**:
  - 畫面頂部出現 UFO（CSS 繪製 + 光暈）
  - UFO 緩慢降落到畫面中央，帶有光束照射地面
  - 一個小外星人剪影從光束中走出，揮手打招呼
  - 5 秒後 UFO 帶著外星人飛走
- **狀態**: `konamiActivated` 標記在 Pinia，跨頁保持背景星空增強效果

### 4. Matrix Rain

- **觸發**: 在 1 秒內快速點擊頁面 5 次
- **效果**:
  - 全螢幕 Canvas 覆蓋層，綠色日文/數字字元雨從上方落下
  - 頁面上的真實文字逐字替換為隨機字元，2 秒後逐字還原
  - 持續 4 秒後字元雨淡出
- **實現**: Canvas 2D，字元陣列逐幀繪製

### 5. 滑鼠星光粒子

- **觸發**: 滑鼠移動（全域啟用）
- **效果**:
  - 滑鼠拖曳出星光粒子尾巴，粒子逐漸縮小消失
  - 預設顏色：白色微光
  - 在 alien-types 頁面：粒子顏色隨當前 hover 的外星人種類變化
  - 長按不動 3 秒：粒子向滑鼠位置聚集，形成旋轉的黑洞漩渦，鬆開後漩渦爆散
- **實現**: Canvas 2D 粒子系統，requestAnimationFrame 驅動

### 6. 隱藏音效

- **觸發**: 點擊外星人種類卡片 / deadSite 爆炸
- **效果**:
  - 8 種外星人各有對應音色：
    - Pleiadian: 柔和和弦（C+E+G, sine wave）
    - Lyran: 明亮琶音（上行音階, triangle wave）
    - Greys: 高頻嗡鳴（2kHz sine + vibrato）
    - Reptilians: 低沉脈衝（80Hz sawtooth + LFO）
    - Orions: 混合音叢（隨機頻率 cluster）
    - Dracos: 不和諧音程（tritone, square wave）
    - Sirians: 水波迴音（sine + delay feedback）
    - Mothmen: 顫抖高音（高頻 sine + fast tremolo）
  - deadSite 爆炸配合低頻爆裂音 + 高頻閃光音
  - 首次觸發時顯示小提示「🔊 已啟用音效」
- **實現**: Web Audio API，OscillatorNode + GainNode 合成

### 7. 第三眼開啟

- **觸發**: 在作者頁面，對 HsssU 簡介中「致力於第三隻眼的研究」這段文字區域快速點擊 3 次
- **效果**:
  - CSS `filter: invert(1) hue-rotate(180deg)` 過渡到負片色調
  - 頁面上浮現原本隱藏的文字（座標 `25.0330° N, 121.5654° E`、「我們一直在看著你」等）
  - 頁面微微持續晃動（CSS transform oscillation）
  - 再點 3 次或 10 秒後自動還原
- **狀態**: `thirdEyeOpen` 在 Pinia

### 8. 滾動觸發 UFO

- **觸發**: 滾動到頁面 40%、70% 位置（僅在有長內容的頁面：introduce、alien-types）
- **效果**:
  - 一架小型 UFO（CSS 繪製）從畫面左側或右側邊緣飛入
  - 飛行路徑帶弧度，UFO 下方有淡淡光束掃過內容
  - 每次出現的方向、高度、速度隨機
  - 同一頁面滾動只觸發一次（用 Set 記錄已觸發位置）
- **實現**: CSS animation + JS IntersectionObserver

### 9. 外星語翻譯器

- **觸發**: 按下 Alt+A
- **效果**:
  - 所有可見中文文字逐字替換為 Unicode 外星符號（如 Wingdings 區段、數學符號、楔形文字 Unicode block）
  - 替換過程有逐字閃爍動畫
  - 再按 Alt+A 還原，同樣逐字動畫
  - 導航列出現小指示燈「👽 外星語模式」
- **狀態**: `alienLanguage` 在 Pinia

## 複製保護

- **僅** introduce、alien-types、authors 頁面監聽 `copy` 事件（home、contact、form 頁面不設複製保護）
- 觸發時顯示 glitch 風格警告訊息「WHaT aRE U DoiNG Now」
- 自動導航到 `/dead` 路由
- deadSite 爆炸動畫用 GSAP Timeline 重寫，原始動畫階段：
  1. 按鈕文字淡出（opacity → 0）
  2. 按鈕縮小 + 紫色光暈脈衝（boxShadow #cd28fa）
  3. 綠色閃光（boxShadow #26ff92）
  4. 收縮到 1px
  5. 粉紅爆炸向上擴張（boxShadow #fa2856, height 擴展到全螢幕）
  6. 「THANK YOU! (> <)」文字淡入
  7. 5 秒後自動導航回首頁 `/`

## Pinia Store 結構

```
useEasterEggStore
├── konamiActivated: boolean
├── matrixMode: boolean
├── alienLanguage: boolean
├── thirdEyeOpen: boolean
├── soundEnabled: boolean
├── clickCount: number（連點計數）
├── konamiSequence: string[]（按鍵序列緩衝）
├── triggeredUfoPositions: string[]（已觸發的 UFO 位置，用 array 確保可序列化）
├── activateKonami()
├── toggleMatrix()
├── toggleAlienLanguage()
├── toggleThirdEye()
├── registerClick()
├── resetClickCount()
└── checkKonamiCode(key: string): boolean
```

## 靜態資源

保留原有 `Media/` 資料夾，移至 `public/media/`：
- `logo.png` — Banner 圖片（必要）
- `alien.png` — 外星人頭像（必要，用於 deadSite）
- `love.png` — 愛心圖（必要）
- `love2.png` — 破碎愛心圖（必要）
- `bg.png` — 不遷移（Cyberpunk 風格用純黑背景）
- `black.png` — 不遷移（不再需要）

### 外星人種類圖片

原站 alien_type.html 中的 8 張外星人圖片來自外部 URL（Pinterest、ArtStation 等），存在 hotlink 失效風險。處理方式：
- 將所有外部圖片下載至 `public/media/aliens/` 目錄
- 以種類命名：`pleiadian.jpg`, `lyran.jpg`, `greys.jpg` 等
- 在 Vue 元件中引用本地路徑

## FormView 行為規格

- 保留原有表單欄位：人類名稱（text）、人類 email（email）、保存肉體（checkbox）
- 表單提交行為：`preventDefault`，顯示一個 Cyberpunk 風格的成功動畫（螢光綠文字閃爍「訊號已發送至外太空...」），3 秒後自動消失
- 不保留原本的 Reddit 重導向
- 保留器官捐贈連結（外部連結，新分頁開啟）
- 提交按鈕保留霓虹邊框旅行光效果，配色改為螢光綠 `#0f8`
- 表單驗證：HTML5 `required` + email 格式驗證即可

## AudioContext 注意事項

瀏覽器要求使用者手勢（click/tap）後才能建立 AudioContext。實作時：
- 在第一次使用者點擊事件中建立並 resume AudioContext
- 首次成功啟用時顯示提示「🔊 已啟用音效」
- AudioContext 實例存為全域 singleton，避免重複建立

## Canvas 效能策略

同時最多 3 層 Canvas（MatrixRain、MouseParticles、心碎粒子）。策略：
- MatrixRain 為全螢幕但僅持續 4 秒
- MouseParticles 常駐但粒子數上限 100
- 心碎粒子為局部區域且一次性
- 實際上不會同時全速運行，無需互斥機制

## 外部依賴

- `vue` ^3.4
- `vue-router` ^4
- `pinia` ^2
- `gsap` ^3（動畫）
- `vite` ^5（建置）

不使用任何 UI 框架（Vuetify、Element 等），全部手刻 CSS 以保持 Cyberpunk 風格一致性。
