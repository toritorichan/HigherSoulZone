<template>
  <footer class="footer">
    <span class="footer__rec">REC</span>
    <span class="footer__dot">●</span>
    <span class="footer__sep">|</span>
    <span class="footer__copy">&copy;2002 HsssUEJSU</span>
    <span class="footer__sep">|</span>
    <span class="footer__time">--:--:--</span>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 12px 0;
  margin-top: 40px;
  font-family: var(--font-system, 'VT323', monospace);
  font-size: 13px;
  color: rgba(160, 160, 160, 0.4);
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.footer__rec {
  color: rgba(255, 0, 0, 0.6);
  font-weight: bold;
}

.footer__dot {
  color: #ff0000;
  font-size: 10px;
  animation: rec-blink 1s steps(1) infinite;
}

.footer__sep {
  color: rgba(160, 160, 160, 0.2);
}

.footer__copy {
  color: rgba(0, 255, 0, 0.25);
}

.footer__time {
  color: rgba(160, 160, 160, 0.3);
}

@keyframes rec-blink {
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
}
</style>
