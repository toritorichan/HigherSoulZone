<template>
  <div class="home">
    <!-- CRT scanline overlay -->
    <div class="home__crt-overlay"></div>

    <!-- Fake desktop icons -->
    <div class="home__icon home__icon--computer">
      <div class="home__icon-img">🖥️</div>
      <span class="home__icon-label">我的電腦</span>
    </div>

    <div class="home__icon home__icon--secret">
      <div class="home__icon-img">📄</div>
      <span class="home__icon-label">secret.txt</span>
    </div>

    <div class="home__icon home__icon--recycle">
      <div class="home__icon-img">🗑️</div>
      <span class="home__icon-label">資源回收筒</span>
    </div>

    <!-- Blinking cursor in center -->
    <div class="home__cursor-area">
      <span class="home__cursor"></span>
    </div>

    <!-- Subtle VHS timestamp -->
    <div class="home__vhs-timestamp">REC ● 2002/03/25 03:33:33</div>
  </div>
</template>

<style scoped>
.home {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* CRT scanline overlay */
.home__crt-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      rgba(18, 16, 16, 0) 50%,
      rgba(0, 0, 0, 0.15) 50%
    ),
    linear-gradient(
      90deg,
      rgba(255, 0, 0, 0.03),
      rgba(0, 255, 0, 0.01),
      rgba(0, 0, 255, 0.03)
    );
  background-size: 100% 2px, 3px 100%;
  pointer-events: none;
  z-index: 10;
}

/* Desktop icons */
.home__icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  user-select: none;
  cursor: default;
  opacity: 0.5;
  transition: opacity 0.3s;
}

.home__icon:hover {
  opacity: 0.8;
}

.home__icon-img {
  font-size: 2rem;
  filter: saturate(0.5) brightness(0.8);
}

.home__icon-label {
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 11px;
  color: var(--color-text-dim);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  text-align: center;
  max-width: 70px;
}

.home__icon--computer {
  top: 15%;
  left: 8%;
}

.home__icon--secret {
  top: 35%;
  left: 12%;
}

.home__icon--recycle {
  bottom: 20%;
  left: 6%;
}

/* Blinking cursor in center */
.home__cursor-area {
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.home__cursor {
  display: inline-block;
  width: 12px;
  height: 24px;
  background: var(--color-primary);
  animation: cursorBlink 1s step-end infinite;
  box-shadow: 0 0 8px rgba(0, 255, 0, 0.4), 0 0 20px rgba(0, 255, 0, 0.15);
}

@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* VHS timestamp */
.home__vhs-timestamp {
  position: absolute;
  top: 12px;
  right: 16px;
  font-family: var(--font-system);
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
  animation: vhsBlink 3s ease-in-out infinite;
  z-index: 5;
}

@keyframes vhsBlink {
  0%, 90%, 100% { opacity: 0.3; }
  92% { opacity: 0.1; }
  94% { opacity: 0.4; }
}

@media (max-width: 768px) {
  .home__icon--computer {
    top: 10%;
    left: 5%;
  }
  .home__icon--secret {
    top: 30%;
    left: 8%;
  }
  .home__icon--recycle {
    bottom: 15%;
    left: 4%;
  }
  .home__icon-img {
    font-size: 1.6rem;
  }
  .home__icon-label {
    font-size: 10px;
  }
  .home__vhs-timestamp {
    font-size: 0.65rem;
  }
}
</style>
