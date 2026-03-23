<template>
  <div class="home">
    <div class="home__star">✦</div>
  </div>
</template>

<style scoped>
.home {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.home__star {
  font-size: clamp(2rem, 5vw, 4rem);
  color: var(--color-primary);
  text-shadow: 0 0 20px #00ff88, 0 0 50px #00ff88, 0 0 80px #ff00c8;
  animation: homePulse 3s ease-in-out infinite;
  user-select: none;
}
@keyframes homePulse {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 1; }
}
</style>
