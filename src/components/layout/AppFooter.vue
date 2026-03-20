<template>
  <footer class="footer">
    <p class="footer__text">✧✦ 外 星 人 大 法 好 ！ ✦✧</p>
    <p class="footer__copy">©2022 HsssUEJSU. All rights reserved.</p>
  </footer>
</template>

<style scoped>
.footer {
  text-align: center;
  padding: 16px 0;
  margin-top: 40px;
  opacity: 0.25;
  transition: opacity 0.8s;
}
.footer:hover { opacity: 0.6; }
.footer__text {
  font-size: 12px;
  color: var(--color-primary);
  letter-spacing: 4px;
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.15);
}
.footer__copy {
  font-size: 11px;
  color: var(--color-text-dim);
  margin-top: 4px;
  opacity: 0.6;
}
</style>
