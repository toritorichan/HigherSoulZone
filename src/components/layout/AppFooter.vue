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
