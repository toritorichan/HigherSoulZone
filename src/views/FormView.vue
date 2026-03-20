<template>
  <div class="form-page">
    <div class="form-box">
      <h2 class="form-box__title">聯繫外星人 / 加入我們</h2>
      <form @submit.prevent="onSubmit">
        <div class="form-box__field">
          <input v-model="name" type="text" required>
          <label>您的人類名稱</label>
        </div>
        <div class="form-box__field">
          <input v-model="email" type="email" required>
          <label>您的人類email</label>
        </div>
        <div class="form-box__submit">
          <button type="submit" class="neon-btn">
            <span></span><span></span><span></span><span></span>
            前往太空!
          </button>
        </div>
        <label class="form-box__checkbox">
          <input type="checkbox" v-model="saveBody">
          保存您位於地球的人類肉體
        </label>
        <div class="form-box__links">
          <a href="https://www.organ.org.tw/Register.aspx" target="_blank" rel="noopener">
            或是您不需要保存您的人類肉體?
          </a>
          <router-link to="/">回首頁</router-link>
        </div>
      </form>
      <transition name="fade">
        <p v-if="submitted" class="form-box__success">訊號已發送至外太空...</p>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const saveBody = ref(true)
const submitted = ref(false)

function onSubmit() {
  submitted.value = true
  setTimeout(() => {
    submitted.value = false
  }, 3000)
}
</script>

<style scoped>
.form-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem 1.5rem;
}

.form-box {
  width: 100%;
  max-width: 450px;
  padding: 2.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  animation: fadeIn 0.8s ease-out;
}

.form-box__title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 0.05em;
}

.form-box__field {
  position: relative;
  margin-bottom: 1.5rem;
}

.form-box__field input {
  width: 100%;
  padding: 12px 10px;
  background: transparent;
  border: none;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.3s;
}

.form-box__field input:focus {
  border-bottom-color: var(--color-primary);
}

.form-box__field label {
  position: absolute;
  top: 12px;
  left: 10px;
  color: var(--color-text-dim);
  font-size: 0.9rem;
  pointer-events: none;
  transition: all 0.3s ease;
}

.form-box__field input:focus ~ label,
.form-box__field input:valid ~ label {
  top: -10px;
  font-size: 0.75rem;
  color: var(--color-primary);
}

.form-box__submit {
  text-align: center;
  margin: 2rem 0 1.5rem;
}

.neon-btn {
  position: relative;
  display: inline-block;
  padding: 12px 40px;
  color: #0f8;
  font-size: 1rem;
  font-family: var(--font-body);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  background: transparent;
  border: none;
  cursor: pointer;
  overflow: hidden;
}

.neon-btn:hover {
  background: #0f8;
  color: #000;
  box-shadow: 0 0 10px #0f8, 0 0 40px #0f8, 0 0 80px #0f8;
  transition: 0.5s;
}

.neon-btn span:nth-child(1) {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, #0f8);
  animation: neon-top 1s linear infinite;
}

.neon-btn span:nth-child(2) {
  position: absolute;
  top: -100%;
  right: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(180deg, transparent, #0f8);
  animation: neon-right 1s linear infinite;
  animation-delay: 0.25s;
}

.neon-btn span:nth-child(3) {
  position: absolute;
  bottom: 0;
  right: -100%;
  width: 100%;
  height: 2px;
  background: linear-gradient(270deg, transparent, #0f8);
  animation: neon-bottom 1s linear infinite;
  animation-delay: 0.5s;
}

.neon-btn span:nth-child(4) {
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 2px;
  height: 100%;
  background: linear-gradient(360deg, transparent, #0f8);
  animation: neon-left 1s linear infinite;
  animation-delay: 0.75s;
}

@keyframes neon-top {
  0% { left: -100%; }
  50%, 100% { left: 100%; }
}
@keyframes neon-right {
  0% { top: -100%; }
  50%, 100% { top: 100%; }
}
@keyframes neon-bottom {
  0% { right: -100%; }
  50%, 100% { right: 100%; }
}
@keyframes neon-left {
  0% { bottom: -100%; }
  50%, 100% { bottom: 100%; }
}

.form-box__checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-dim);
  font-size: 0.9rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.form-box__checkbox input[type="checkbox"] {
  accent-color: var(--color-primary);
}

.form-box__links {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
  font-size: 0.9rem;
}

.form-box__links a {
  color: var(--color-text-dim);
  transition: color 0.3s;
}

.form-box__links a:hover {
  color: var(--color-primary);
}

.form-box__success {
  text-align: center;
  color: var(--color-primary);
  margin-top: 1.5rem;
  font-size: 1rem;
  letter-spacing: 0.1em;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
