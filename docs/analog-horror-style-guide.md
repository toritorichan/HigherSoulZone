# Analog Horror x Y2K/Windows XP -- Visual Style Guide

A comprehensive design reference for implementing an analog horror aesthetic blended with
Y2K-era and Windows XP visual language on the web.

---

## Table of Contents

1. [Analog Horror Visual Language](#1-analog-horror-visual-language)
2. [Y2K / Windows XP Specific](#2-y2k--windows-xp-specific)
3. [CSS Techniques & Implementations](#3-css-techniques--implementations)
4. [Font Recommendations](#4-font-recommendations)
5. [Putting It Together](#5-putting-it-together)

---

## 1. Analog Horror Visual Language

### 1.1 Color Palettes

Analog horror operates in two tonal modes: the **mundane broadcast** palette (deceptively
normal) and the **corrupted** palette (where things go wrong).

#### Mundane / Broadcast Mode

| Role              | Hex       | RGB             | Usage                                    |
|-------------------|-----------|-----------------|------------------------------------------|
| Background        | `#0a0a0a` | (10, 10, 10)    | Deep black, near-total darkness          |
| CRT Dark          | `#121010` | (18, 16, 16)    | Screen-off / overlay tint                |
| Institutional     | `#c8b89a` | (200, 184, 154) | Beige walls, liminal office spaces       |
| Broadcast Blue    | `#001e5a` | (0, 30, 90)     | EBS/EAS background blue                  |
| Safety Yellow     | `#e8d44d` | (232, 212, 77)  | Warning headers, caution tape            |
| Static White      | `#d4d4d4` | (212, 212, 212) | CRT snow, text overlays                  |
| VHS Timestamp     | `#ffffff` | (255, 255, 255) | Date/time overlays in corners            |

#### Corrupted / Horror Mode

| Role              | Hex       | RGB             | Usage                                    |
|-------------------|-----------|-----------------|------------------------------------------|
| Blood Red         | `#912914` | (145, 41, 20)   | Distorted warning text, alerts           |
| Aberration Blue   | `#001eff` | (0, 30, 255)    | Chromatic aberration left channel        |
| Aberration Red    | `#ff0050` | (255, 0, 80)    | Chromatic aberration right channel       |
| Phosphor Green    | `#33ff00` | (51, 255, 0)    | Terminal text, CRT subpixel              |
| Decay Sepia       | `#8b7355` | (139, 115, 85)  | Faded VHS tape degradation               |
| Signal Loss       | `#1a1a2e` | (26, 26, 46)    | Deep blue-black for "dead air"           |
| Interference      | `#ff0000` | (255, 0, 0)     | CRT subpixel, glitch accents            |
| Desaturated Flesh | `#c4a882` | (196, 168, 130) | Uncanny skin tones in corrupted imagery  |

### 1.2 Typography

Analog horror text follows strict rules of **imitation**: it must look like authentic
broadcast/institutional typography from the 1980s-1990s.

**Primary typeface categories:**

- **Emergency Broadcast / Government:** All-caps, heavy sans-serif (Helvetica, Arial Black,
  Impact). Tightly tracked, sometimes poorly kerned to suggest cheap typesetting.
- **VHS Timestamp:** Monospaced, small, upper-right corner. White on black. Resembles VCR
  OSD (On-Screen Display) fonts.
- **Educational / Instructional:** Medium-weight sans-serif, friendly but clinical. Often
  has wide letter-spacing. Think public school PSA filmstrips.
- **Corrupted Text:** Any of the above, but with characters replaced, misaligned, or
  partially occluded by static. Letters may flicker between two states.

**Typographic "wrongness" techniques:**

- Slightly wrong kerning (too tight or too loose in specific places)
- Mixed case where all-caps is expected
- Timestamps that show impossible dates or times
- Text that changes on second viewing (via animation)
- Sentences that start normal and become threatening
- System font where a display font is expected, or vice versa

### 1.3 Textures and Overlays

These should be layered via CSS pseudo-elements or `<canvas>` overlays.

| Texture             | Description                                                    |
|---------------------|----------------------------------------------------------------|
| VHS Tracking Lines  | Horizontal bands of distortion that drift vertically           |
| CRT Scanlines       | Thin alternating dark/transparent horizontal lines, 2px pitch  |
| Static / Snow       | Random noise pattern, animated, semi-transparent               |
| Color Bleed         | RGB channels slightly offset horizontally (chromatic aberration)|
| Tape Degradation    | Sections of reduced quality, washed-out color, horizontal tear |
| Screen Flicker      | Rapid, irregular opacity changes on the entire viewport        |
| Vignette            | Dark corners, simulating CRT edge falloff                      |
| Screen Door Effect  | Fine RGB subpixel grid visible at macro scale                  |

### 1.4 Layout Patterns -- What Makes It Feel "Wrong"

Analog horror achieves unease through **violated expectations**:

- **Familiar format, wrong content:** A perfectly normal TV listing that includes a
  channel called "DO NOT WATCH." A safety PSA that describes impossible anatomy.
- **Aspect ratio:** 4:3 framing in a 16:9 world. Black pillarboxing on the sides.
- **Asymmetric degradation:** Only part of the screen is corrupted -- the rest is pristine.
  This implies the corruption has a source or intent.
- **Liminal spaces:** Empty rooms, hallways, parking lots at night. Institutional
  environments (schools, hospitals, offices) that are too clean and too empty.
- **Information hierarchy collapse:** Titles, body text, timestamps, and warnings all
  rendered at the same visual weight, as if the system rendering them is breaking down.
- **Temporal inconsistency:** Dates that skip, timestamps that run backward, footage
  labeled 1996 with content that references 2024.

### 1.5 Common UI Elements

| Element                | Description                                                   |
|------------------------|---------------------------------------------------------------|
| Emergency Broadcast    | Colored bars at top/bottom, all-caps white text on blue/red   |
| Fake System Dialog     | Windows-style error boxes with unsettling messages            |
| VHS Timestamp          | `REC` indicator, date/time in corner, battery icon            |
| Channel Number Overlay | Semi-transparent number in upper corner                       |
| TV Guide / Program     | Grid listing of shows, times, and channels                    |
| Progress Bar           | System-style that freezes or runs backward                    |
| Safety Card            | Illustrated instructional diagram with clinical tone          |
| Test Pattern           | Color bars (SMPTE), "Please Stand By" text                   |
| Loading Screen         | Retro progress indicators that never complete                 |

### 1.6 The "Uncanny" Techniques

These are the core mechanisms for creating psychological discomfort:

1. **Mundane + Threatening Juxtaposition:** Cheerful educational narration describing
   something horrifying. A friendly mascot in a scene of destruction.

2. **Slightly Wrong Proportions:** A face where the eyes are 5% too far apart. A hallway
   that is 20% too long. A door that is 90% normal height.

3. **Repetition with Variation:** The same frame repeated, but something changes each loop.
   Text that repeats a line, but one word is different.

4. **Absence Where Presence Is Expected:** An empty chair in a set clearly designed for
   someone to sit in. A name tag with no name. A family photo where one person is missing.

5. **Hyperspecificity:** Detailed instructions for a procedure that does not exist.
   Coordinates to a real location with no significance. A phone number that, if called,
   goes nowhere.

6. **Degraded Authority:** Official-looking documents with misspellings. Government seals
   that are almost correct. A "Do Not Disturb" sign in the wrong font.

---

## 2. Y2K / Windows XP Specific

### 2.1 Windows XP Luna Theme Colors

The default "Luna Blue" visual style:

| Element                  | Hex       | RGB             | Notes                           |
|--------------------------|-----------|-----------------|--------------------------------|
| Desktop Background       | `#004e98` | (0, 78, 152)    | "Bliss" wallpaper default blue |
| Title Bar Start Gradient | `#0054e3` | (0, 84, 227)    | Active window left edge        |
| Title Bar End Gradient   | `#0054e3` to `#3a8cff` |    | Gradient flows left to right   |
| Inactive Title Bar       | `#7f9db9` | (127, 157, 185) | Muted blue-gray                |
| Start Button Green       | `#3c8a2e` | (60, 138, 46)   | The iconic green Start button  |
| Close Button Red         | `#e04343` | (224, 67, 67)   | Window close button            |
| Taskbar                  | `#235dda` to `#1456d3` |  | Blue gradient, horizontal      |
| Button Face              | `#ece9d8` | (236, 233, 216) | Default button/control surface |
| Window Background        | `#ffffff` | (255, 255, 255) | Client area white              |
| Selection Highlight      | `#316ac5` | (49, 106, 197)  | Selected items, focused state  |

#### XP Brand Colors (from the logo/branding)

| Color   | Hex       | RGB             |
|---------|-----------|-----------------|
| Orange  | `#ec722e` | (236, 114, 46)  |
| Green   | `#7dc343` | (125, 195, 67)  |
| Blue    | `#64a2d8` | (100, 162, 216) |
| Yellow  | `#eed842` | (238, 216, 66)  |
| Black   | `#000000` | (0, 0, 0)       |

### 2.2 Windows 95/98 Classic Theme Colors

For a more "horror-appropriate" older aesthetic:

| Element                  | Hex       | RGB             | Notes                           |
|--------------------------|-----------|-----------------|--------------------------------|
| Button Face / Background | `#c0c0c0` | (192, 192, 192) | The iconic Win95 gray          |
| Button Highlight (light) | `#ffffff` | (255, 255, 255) | Top-left bevel edge            |
| Button Shadow (dark)     | `#808080` | (128, 128, 128) | Bottom-right bevel edge        |
| Button Dark Shadow       | `#000000` | (0, 0, 0)       | Outermost dark edge            |
| Window Text              | `#000000` | (0, 0, 0)       | Default text color             |
| Title Bar Active         | `#000080` | (0, 0, 128)     | Navy blue gradient             |
| Title Bar Inactive       | `#808080` | (128, 128, 128) | Gray                           |
| Title Bar Text           | `#ffffff` | (255, 255, 255) | White on blue/gray             |
| Desktop                  | `#008080` | (0, 128, 128)   | Classic teal desktop           |
| Selected Item            | `#000080` | (0, 0, 128)     | Navy highlight                 |
| Selected Text            | `#ffffff` | (255, 255, 255) | White on navy                  |
| Scrollbar                | `#c0c0c0` | (192, 192, 192) | Same as button face            |
| Menu Background          | `#c0c0c0` | (192, 192, 192) | Flat gray                      |
| Info/Tooltip Background  | `#ffffe1` | (255, 255, 225) | Pale yellow                    |
| Link Blue                | `#0000ff` | (0, 0, 255)     | Classic hyperlink blue         |
| Visited Link             | `#800080` | (128, 0, 128)   | Purple                         |

### 2.3 System Fonts

| OS             | Default UI Font        | Fallback              | Size    |
|----------------|------------------------|-----------------------|---------|
| Windows 95/98  | MS Sans Serif          | Tahoma (ME)           | 8pt     |
| Windows XP     | Tahoma                 | MS Sans Serif         | 8pt     |
| Windows Vista+ | Segoe UI               | Tahoma                | 9pt     |

For web recreation: `font-family: 'Tahoma', 'MS Sans Serif', 'Arial', sans-serif;`

### 2.4 Classic UI Elements -- CSS Approach

#### Beveled Border (Windows 95/98 Style)

```css
.win98-raised {
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
  box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
  background: #c0c0c0;
}

.win98-sunken {
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-bottom: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #dfdfdf;
  background: #c0c0c0;
}
```

#### Window Title Bar (Windows 95/98)

```css
.win98-titlebar {
  background: linear-gradient(to right, #000080, #1084d0);
  color: #ffffff;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
  font-weight: bold;
  padding: 3px 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

#### Window Title Bar (Windows XP Luna)

```css
.winxp-titlebar {
  background: linear-gradient(to bottom, #0997ff, #0053ee 8%, #0050ee 40%, #06f 88%, #1b8bff 93%, #3c9aff 95%, #65b5ff 96%, #6cb6ff);
  color: #ffffff;
  font-family: 'Trebuchet MS', 'Tahoma', sans-serif;
  font-size: 13px;
  font-weight: bold;
  padding: 5px 8px;
  border-radius: 8px 8px 0 0;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}
```

#### Classic Button

```css
.win98-button {
  background: #c0c0c0;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
  box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
  padding: 4px 16px;
  min-width: 75px;
  min-height: 23px;
  cursor: pointer;
}

.win98-button:active {
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  border-bottom: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf;
  padding: 5px 15px 3px 17px;
}

.win98-button:focus {
  outline: 1px dotted #000000;
  outline-offset: -4px;
}
```

#### Dialog Box

```css
.win98-dialog {
  background: #c0c0c0;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
  box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
  padding: 3px;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
  max-width: 400px;
}

.win98-dialog .window-body {
  padding: 12px;
}

.win98-dialog .button-row {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  padding: 0 12px 12px;
}
```

#### Progress Bar (Win98)

```css
.win98-progress {
  background: #ffffff;
  border-top: 2px solid #808080;
  border-left: 2px solid #808080;
  border-bottom: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  box-shadow: inset 1px 1px 0 #000000, inset -1px -1px 0 #dfdfdf;
  height: 16px;
  padding: 1px;
}

.win98-progress-fill {
  background: #000080;
  height: 100%;
  /* Animate width for the horror effect of a bar that won't complete */
}
```

### 2.5 Pre-Built CSS Libraries

| Library     | URL                                       | Covers          |
|-------------|-------------------------------------------|-----------------|
| 98.css      | https://jdan.github.io/98.css/            | Windows 98      |
| XP.css      | https://botoxparty.github.io/XP.css/      | Windows XP      |
| 7.css       | https://khang-nd.github.io/7.css/         | Windows 7       |
| Win95.CSS   | https://alexbsoft.github.io/win95.css/    | Windows 95 (Bootstrap) |
| OS GUI      | https://os-gui.js.org/                    | Win98 + JS interactions |

---

## 3. CSS Techniques & Implementations

### 3.1 CRT Scanlines

Creates alternating horizontal lines simulating a cathode ray tube display.

```css
.crt-scanlines::before {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background:
    linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.25) 50%
    ),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.06),
      rgba(0, 255, 0, 0.02),
      rgba(0, 0, 255, 0.06)
    );
  z-index: 2;
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
}
```

The first gradient creates the scanlines (dark line every 2px). The second gradient
creates the RGB subpixel column effect (red-green-blue every 3px).

### 3.2 Screen Flicker

Simulates the irregular brightness variation of an old CRT.

```css
.crt-flicker::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(18, 16, 16, 0.1);
  opacity: 0;
  z-index: 2;
  pointer-events: none;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0%   { opacity: 0.27861; }
  5%   { opacity: 0.34769; }
  10%  { opacity: 0.23604; }
  15%  { opacity: 0.90626; }
  20%  { opacity: 0.18128; }
  25%  { opacity: 0.83891; }
  30%  { opacity: 0.65583; }
  35%  { opacity: 0.67807; }
  40%  { opacity: 0.26559; }
  45%  { opacity: 0.84693; }
  50%  { opacity: 0.96019; }
  55%  { opacity: 0.08594; }
  60%  { opacity: 0.20313; }
  65%  { opacity: 0.71988; }
  70%  { opacity: 0.53455; }
  75%  { opacity: 0.37288; }
  80%  { opacity: 0.71428; }
  85%  { opacity: 0.70419; }
  90%  { opacity: 0.7003;  }
  95%  { opacity: 0.36108; }
  100% { opacity: 0.24387; }
}
```

**Subtlety control:** Multiply the opacity values by 0.3 - 0.5 for a less aggressive
flicker that doesn't cause discomfort. Full values above are intentionally intense.

### 3.3 Chromatic Aberration (Color Separation)

Simulates misaligned RGB channels, as seen on damaged CRTs and VHS tapes.

```css
.crt-colorsep {
  animation: textShadow 1.6s infinite;
}

@keyframes textShadow {
  0%   { text-shadow: 0.44px 0 1px rgba(0,30,255,0.5),
                      -0.44px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  20%  { text-shadow: 3.48px 0 1px rgba(0,30,255,0.5),
                      -3.48px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  40%  { text-shadow: 3.87px 0 1px rgba(0,30,255,0.5),
                      -3.87px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  60%  { text-shadow: 2.20px 0 1px rgba(0,30,255,0.5),
                      -2.20px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  80%  { text-shadow: 0.08px 0 1px rgba(0,30,255,0.5),
                      -0.08px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
  100% { text-shadow: 2.62px 0 1px rgba(0,30,255,0.5),
                      -2.62px 0 1px rgba(255,0,80,0.3), 0 0 3px; }
}
```

### 3.4 Glitch Text Effect

Three-layer technique using pseudo-elements with animated clip-path.

```html
<div class="glitch" data-text="SIGNAL LOST">SIGNAL LOST</div>
```

```css
.glitch {
  position: relative;
  font-size: 4rem;
  font-weight: bold;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.glitch::before,
.glitch::after {
  content: attr(data-text);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #0a0a0a; /* Must match page background */
}

.glitch::before {
  left: 2px;
  text-shadow: -2px 0 #ff0050;  /* Red channel */
  animation: glitch-anim-1 2s infinite linear alternate-reverse;
}

.glitch::after {
  left: -2px;
  text-shadow: 2px 0 #001eff;   /* Blue channel */
  animation: glitch-anim-2 3s infinite linear alternate-reverse;
}

/* Different durations (2s vs 3s) prevent synchronization = more chaos */

@keyframes glitch-anim-1 {
  0%   { clip-path: inset(40% 0 61% 0); transform: translate(-2px, 0); }
  10%  { clip-path: inset(8% 0 75% 0);  transform: translate(3px, 0); }
  20%  { clip-path: inset(92% 0 1% 0);  transform: translate(-1px, 0); }
  30%  { clip-path: inset(15% 0 62% 0); transform: translate(0px, 0); }
  40%  { clip-path: inset(43% 0 1% 0);  transform: translate(5px, 0); }
  50%  { clip-path: inset(70% 0 20% 0); transform: translate(-3px, 0); }
  60%  { clip-path: inset(25% 0 58% 0); transform: translate(2px, 0); }
  70%  { clip-path: inset(80% 0 5% 0);  transform: translate(-4px, 0); }
  80%  { clip-path: inset(54% 0 7% 0);  transform: translate(1px, 0); }
  90%  { clip-path: inset(10% 0 85% 0); transform: translate(3px, 0); }
  100% { clip-path: inset(58% 0 43% 0); transform: translate(-2px, 0); }
}

@keyframes glitch-anim-2 {
  0%   { clip-path: inset(25% 0 58% 0); transform: translate(2px, 0); }
  10%  { clip-path: inset(75% 0 12% 0); transform: translate(-3px, 0); }
  20%  { clip-path: inset(3% 0 40% 0);  transform: translate(1px, 0); }
  30%  { clip-path: inset(62% 0 25% 0); transform: translate(-5px, 0); }
  40%  { clip-path: inset(18% 0 70% 0); transform: translate(4px, 0); }
  50%  { clip-path: inset(50% 0 30% 0); transform: translate(-1px, 0); }
  60%  { clip-path: inset(85% 0 3% 0);  transform: translate(3px, 0); }
  70%  { clip-path: inset(30% 0 55% 0); transform: translate(-2px, 0); }
  80%  { clip-path: inset(5% 0 88% 0);  transform: translate(5px, 0); }
  90%  { clip-path: inset(45% 0 40% 0); transform: translate(-4px, 0); }
  100% { clip-path: inset(68% 0 15% 0); transform: translate(2px, 0); }
}
```

### 3.5 VHS Tracking Distortion

Horizontal bands that drift up the screen, simulating bad VHS tracking.

```css
.vhs-tracking {
  position: relative;
  overflow: hidden;
}

.vhs-tracking::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px,
    transparent 3px,
    rgba(255, 255, 255, 0.03) 3px,
    rgba(255, 255, 255, 0.03) 4px
  );
  animation: vhs-scroll 10s linear infinite;
  pointer-events: none;
  z-index: 10;
}

/* The thick distortion band */
.vhs-tracking::after {
  content: "";
  position: absolute;
  left: -5%;
  width: 110%;
  height: 40px;
  background: rgba(255, 255, 255, 0.08);
  filter: blur(2px);
  animation: vhs-band 8s linear infinite;
  pointer-events: none;
  z-index: 10;
}

@keyframes vhs-scroll {
  0%   { transform: translateY(0); }
  100% { transform: translateY(4px); }
}

@keyframes vhs-band {
  0%   { top: -40px; }
  100% { top: calc(100% + 40px); }
}
```

### 3.6 CRT Screen Curvature

Simulates the barrel distortion of a curved CRT display.

```css
.crt-curve {
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  /* Barrel distortion approximation -- true distortion requires a shader */
  box-shadow:
    inset 0 0 80px rgba(0, 0, 0, 0.4),
    inset 0 0 20px rgba(0, 0, 0, 0.2);
}

/* Vignette overlay for edge darkening */
.crt-curve::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(0, 0, 0, 0.5) 100%
  );
  pointer-events: none;
  z-index: 3;
}
```

### 3.7 Static / Noise Overlay (CSS-only approximation)

True noise requires `<canvas>` or an animated GIF, but a rough CSS version:

```css
.static-noise {
  position: relative;
}

.static-noise::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background-image:
    url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E");
  animation: static-move 0.2s steps(10) infinite;
  pointer-events: none;
  z-index: 5;
  opacity: 0.12;
}

@keyframes static-move {
  0%   { transform: translate(0, 0); }
  10%  { transform: translate(-5%, -5%); }
  20%  { transform: translate(5%, 10%); }
  30%  { transform: translate(-10%, 5%); }
  40%  { transform: translate(10%, -10%); }
  50%  { transform: translate(-5%, 15%); }
  60%  { transform: translate(15%, -5%); }
  70%  { transform: translate(-15%, 10%); }
  80%  { transform: translate(10%, 5%); }
  90%  { transform: translate(5%, -15%); }
  100% { transform: translate(-10%, 0); }
}
```

For higher fidelity, use a JS canvas approach or a small tiling noise GIF.

### 3.8 Complete CRT Container (All Effects Combined)

```css
.crt {
  position: relative;
  overflow: hidden;
  border-radius: 18px;
  background: #0a0a0a;
  box-shadow:
    inset 0 0 80px rgba(0, 0, 0, 0.4),
    0 0 40px rgba(0, 0, 0, 0.8);

  /* Chromatic aberration on all text */
  animation: textShadow 1.6s infinite;
}

/* Scanlines + RGB subpixels */
.crt::before {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(18,16,16,0) 50%, rgba(0,0,0,0.25) 50%),
    linear-gradient(90deg, rgba(255,0,0,0.06), rgba(0,255,0,0.02), rgba(0,0,255,0.06));
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
  z-index: 10;
}

/* Flicker */
.crt::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(18, 16, 16, 0.1);
  opacity: 0;
  pointer-events: none;
  z-index: 10;
  animation: flicker 0.15s infinite;
}
```

### 3.9 Horror Dialog Box (Windows + Analog Horror Fusion)

```css
.horror-dialog {
  background: #c0c0c0;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
  box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
  padding: 3px;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
  max-width: 400px;
  position: relative;

  /* Subtle wrongness: barely perceptible skew */
  transform: rotate(0.3deg);
}

.horror-dialog .titlebar {
  background: linear-gradient(to right, #000080, #1084d0);
  color: #ffffff;
  font-weight: bold;
  padding: 3px 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
}

.horror-dialog .body {
  padding: 16px;
  background: #c0c0c0;
  color: #000000;
  line-height: 1.4;
}

.horror-dialog .body .icon {
  float: left;
  margin-right: 12px;
  font-size: 32px;
}

/* The dialog flickers occasionally */
.horror-dialog {
  animation: dialog-flicker 4s ease-in-out infinite;
}

@keyframes dialog-flicker {
  0%, 97%, 100% { opacity: 1; transform: rotate(0.3deg); }
  98%           { opacity: 0.7; transform: rotate(0.3deg) translateX(2px); }
  99%           { opacity: 0.9; transform: rotate(0.3deg) translateX(-1px); }
}
```

---

## 4. Font Recommendations

### 4.1 Google Fonts (Free, Web-Safe)

| Font            | Category     | Usage                                    | URL                                         |
|-----------------|-------------|------------------------------------------|---------------------------------------------|
| VT323           | Monospace   | VHS timestamps, terminal text            | fonts.google.com/specimen/VT323             |
| Press Start 2P  | Display     | 8-bit pixel text, retro gaming headings  | fonts.google.com/specimen/Press+Start+2P    |
| DotGothic16     | Sans-serif  | 16x16 bitmap style, old screens          | fonts.google.com/specimen/DotGothic16       |
| Share Tech Mono | Monospace   | Technical readouts, system displays      | fonts.google.com/specimen/Share+Tech+Mono   |
| Space Mono      | Monospace   | Retro-modern, clean terminal aesthetic   | fonts.google.com/specimen/Space+Mono        |
| Silkscreen      | Display     | Small pixel font, UI labels              | fonts.google.com/specimen/Silkscreen        |
| IBM Plex Mono   | Monospace   | Professional retro terminal              | fonts.google.com/specimen/IBM+Plex+Mono     |
| Courier Prime   | Monospace   | Typewriter / report documents            | fonts.google.com/specimen/Courier+Prime     |
| Creepster       | Display     | Horror titles (use sparingly)            | fonts.google.com/specimen/Creepster         |
| Special Elite   | Display     | Old typewriter, degraded documents       | fonts.google.com/specimen/Special+Elite     |

### 4.2 Other Notable Fonts (Non-Google, Free or Paid)

| Font            | Source        | Usage                                    |
|-----------------|---------------|------------------------------------------|
| VCR OSD Mono    | dafont.com    | Authentic VCR on-screen display          |
| Home Video      | dafont.com    | VHS label / handwritten tape look        |
| Tahoma          | System font   | Windows XP/2000 UI (pre-installed)       |
| MS Sans Serif   | System font   | Windows 95/98 UI (pre-installed)         |
| Fixedsys        | System font   | Classic Windows fixed-width (BSoD)       |

### 4.3 Font Stack Recommendations

```css
/* VHS / CRT Terminal */
--font-terminal: 'VT323', 'Share Tech Mono', 'Courier New', monospace;

/* Windows System UI */
--font-system: 'Tahoma', 'MS Sans Serif', 'Arial', sans-serif;

/* Pixel / Retro Display */
--font-pixel: 'Press Start 2P', 'Silkscreen', 'DotGothic16', monospace;

/* Horror Headlines */
--font-horror: 'Creepster', 'Special Elite', serif;

/* Technical / Broadcast */
--font-broadcast: 'IBM Plex Mono', 'Space Mono', 'Courier Prime', monospace;
```

---

## 5. Putting It Together

### 5.1 Recommended Layer Stack (bottom to top)

1. **Background:** Dark (`#0a0a0a`) or institutional beige (`#c8b89a`)
2. **Content:** Windows-style dialogs, broadcast text, program listings
3. **VHS Tracking:** Drifting horizontal distortion band
4. **Scanlines:** 2px repeating horizontal gradient
5. **RGB Subpixels:** 3px repeating vertical gradient
6. **Flicker:** Animated opacity overlay
7. **Static/Noise:** SVG or canvas noise, low opacity
8. **Vignette:** Radial gradient darkening at edges

### 5.2 Design Principles for the Fusion Aesthetic

1. **Start normal, degrade gradually.** The page should initially look like a functional
   (if retro) website. Corruption creeps in over time or on interaction.

2. **Windows UI as the "safe" layer.** Familiar dialog boxes and taskbars represent the
   normal world. When they start behaving wrong (flickering, showing disturbing messages,
   refusing to close), the horror begins.

3. **CRT/VHS effects as environmental.** These are the "medium" through which the user
   views the site. They should be persistent but subtle -- intense enough to set the mood,
   not so intense they make text unreadable.

4. **Typography tells the story.** Shifts from clean system fonts to degraded/glitched
   fonts signal escalation. A dialog box in Tahoma is normal. The same dialog in VT323
   with chromatic aberration is not.

5. **Interactivity breaks expectations.** Buttons that do something other than what they
   say. Dialogs that reappear after being closed. Progress bars that go backward. A
   cursor that briefly changes to a different icon.

6. **Sound design matters.** Even in a visual guide: pair visual effects with CRT hum,
   VHS tape noise, dial-up tones, and Windows system sounds (chord.wav, ding.wav).

### 5.3 Accessibility Considerations

- Provide a way to disable flicker/animation effects (respect `prefers-reduced-motion`)
- Ensure critical text remains readable through all overlays
- Glitch effects should not trigger photosensitive seizures -- avoid high-frequency
  full-screen flashes exceeding 3Hz
- Include `pointer-events: none` on all overlay pseudo-elements

```css
@media (prefers-reduced-motion: reduce) {
  .crt::after,
  .crt-flicker::after,
  .glitch::before,
  .glitch::after,
  .vhs-tracking::before,
  .vhs-tracking::after {
    animation: none !important;
  }
}
```

---

## Sources

- [Analog Horror -- Aesthetics Wiki](https://aesthetics.fandom.com/wiki/Analog_Horror)
- [Analog Horror: The Distortion of Nostalgia -- Aesthetics of Design](https://www.aesdes.org/2025/01/23/analog-horror-the-distortion-of-nostalgia/)
- [The Rise of Analog Horror -- StudioBinder](https://www.studiobinder.com/blog/what-is-analog-horror-definition/)
- [Y2K Aesthetic for Web Design -- Webflow](https://webflow.com/blog/y2k-aesthetic)
- [Frutiger Aero -- Aesthetics Wiki](https://aesthetics.fandom.com/wiki/Frutiger_Aero)
- [Frutiger Aero Archive](https://frutigeraeroarchive.org/)
- [Windows XP Visual Styles -- Wikipedia](https://en.wikipedia.org/wiki/Windows_XP_visual_styles)
- [Windows XP Color Palette -- color-hex.com](https://www.color-hex.com/color-palette/44345)
- [XP.css Design System](https://botoxparty.github.io/XP.css/)
- [98.css Design System](https://jdan.github.io/98.css/)
- [Win95.CSS](https://alexbsoft.github.io/win95.css/)
- [OS GUI JS Library](https://os-gui.js.org/)
- [CRT Display in CSS -- Alec Lownes](https://aleclownes.com/2017/02/01/crt-display.html)
- [CRT Scanlines + Flicker CSS -- GitHub Gist](https://gist.github.com/lmas/6a1bd445bc7a7145245085f4a740d3f5)
- [Glitch Effect on Text/Images/SVG -- CSS-Tricks](https://css-tricks.com/glitch-effect-text-images-svg/)
- [CSS Glitch Effect -- TinyMCE](https://www.tiny.cloud/blog/css-glitch-effect/)
- [CSS Glitch Effect -- Codrops](https://tympanus.net/codrops/2017/12/21/css-glitch-effect/)
- [VT323 -- Google Fonts](https://fonts.google.com/specimen/VT323)
- [Press Start 2P -- Google Fonts](https://fonts.google.com/specimen/Press+Start+2P)
- [DotGothic16 -- Google Fonts](https://fonts.google.com/specimen/DotGothic16)
- [7-Aero-Stylesheet -- GitHub](https://github.com/Z2r-YT/7-Aero-Stylesheet)
