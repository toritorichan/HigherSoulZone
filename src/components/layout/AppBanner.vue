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
