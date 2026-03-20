<template>
  <div class="home">
    <div class="home__hero">
      <h1 class="home__title">HIGHER SOUL ZONE</h1>
      <p class="home__subtitle">E X T R A T E R R E S T R I A L</p>
      <div class="home__line"></div>
      <p class="home__tagline">探索宇宙的真相，尋找靈魂的歸屬</p>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
}

.home__hero {
  animation: fadeIn 1.5s ease-out;
}

.home__title {
  font-family: var(--font-display);
  font-size: 3.5rem;
  letter-spacing: 0.6em;
  color: var(--color-primary);
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.2);
  margin-bottom: 1rem;
}

.home__subtitle {
  font-family: var(--font-heading);
  font-size: 1rem;
  letter-spacing: 0.4em;
  color: var(--color-text-dim);
  margin-bottom: 2rem;
}

.home__line {
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--color-primary), transparent);
  margin: 0 auto 2rem;
}

.home__tagline {
  font-family: var(--font-body);
  font-size: 1.2rem;
  color: var(--color-text-dim);
  letter-spacing: 0.2em;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .home__title {
    font-size: 2rem;
    letter-spacing: 0.3em;
  }
  .home__subtitle {
    font-size: 0.8rem;
  }
}
</style>
