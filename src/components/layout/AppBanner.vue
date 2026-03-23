<template>
  <header class="banner">
    <img :src="`${base}media/logo.png`" alt="Higher Soul Zone" class="banner__logo" />
  </header>
</template>

<script setup>
const base = import.meta.env.BASE_URL
</script>

<style scoped>
.banner {
  text-align: center;
  padding: 20px 0 10px;
  user-select: none;
  -webkit-user-select: none;
}
.banner__logo {
  max-width: 100%;
  height: auto;
  pointer-events: none;
}
</style>
