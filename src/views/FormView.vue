<template>
  <div class="form-page">
    <!-- Windows dialog box frame -->
    <div class="win-dialog">
      <div class="win-dialog__titlebar">
        <span class="win-dialog__titlebar-text">聯繫外星人.exe</span>
        <div class="win-dialog__titlebar-buttons">
          <span class="win-dialog__btn win-dialog__btn--minimize">_</span>
          <span class="win-dialog__btn win-dialog__btn--maximize">□</span>
          <span class="win-dialog__btn win-dialog__btn--close">×</span>
        </div>
      </div>

      <div class="win-dialog__body">
        <h2 class="form-box__title">聯繫外星人 / 加入我們</h2>
        <form @submit.prevent="onSubmit">
          <div class="form-box__field">
            <input v-model="name" type="text" required placeholder="您的人類名稱">
          </div>
          <div class="form-box__field">
            <input v-model="email" type="email" required placeholder="您的人類email">
          </div>
          <div class="form-box__submit">
            <button type="submit" class="win-btn">
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

/* --- Windows dialog frame --- */
.win-dialog {
  width: 100%;
  max-width: 450px;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
  box-shadow: inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #808080;
  background: #c0c0c0;
  padding: 3px;
  animation: fadeIn 0.8s ease-out;
}

.win-dialog__titlebar {
  background: linear-gradient(to right, #000080, #1084d0);
  color: #ffffff;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 12px;
  font-weight: bold;
  padding: 3px 6px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  user-select: none;
}

.win-dialog__titlebar-text {
  letter-spacing: 0.02em;
}

.win-dialog__titlebar-buttons {
  display: flex;
  gap: 2px;
}

.win-dialog__btn {
  width: 16px;
  height: 14px;
  background: #c0c0c0;
  border-top: 1px solid #ffffff;
  border-left: 1px solid #ffffff;
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-family: 'Tahoma', sans-serif;
  color: #000;
  line-height: 1;
  cursor: default;
}

.win-dialog__body {
  padding: 1.5rem;
  background: var(--color-bg);
  border-top: 1px solid #808080;
  border-left: 1px solid #808080;
  border-bottom: 1px solid #ffffff;
  border-right: 1px solid #ffffff;
}

.form-box__title {
  font-family: var(--font-system);
  font-size: 1.3rem;
  color: var(--color-primary);
  margin-bottom: 2rem;
  text-align: center;
  letter-spacing: 0.05em;
  text-shadow: 0 0 6px rgba(0, 255, 0, 0.3);
}

.form-box__field {
  margin-bottom: 1.5rem;
}

.form-box__field input {
  width: 100%;
  padding: 10px 8px;
  background: transparent;
  border: none;
  border-bottom: 1px solid rgba(0, 255, 0, 0.25);
  color: var(--color-primary);
  font-size: 0.95rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.3s;
  letter-spacing: 0.03em;
}

.form-box__field input::placeholder {
  color: var(--color-text-dim);
  font-size: 0.85rem;
}

.form-box__field input:focus {
  border-bottom-color: var(--color-primary);
  box-shadow: 0 1px 0 0 rgba(0, 255, 0, 0.3);
}

.form-box__submit {
  text-align: center;
  margin: 2rem 0 1.5rem;
}

/* Windows-style button */
.win-btn {
  background: #c0c0c0;
  border-top: 2px solid #ffffff;
  border-left: 2px solid #ffffff;
  border-bottom: 2px solid #000000;
  border-right: 2px solid #000000;
  box-shadow: inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf;
  color: #000;
  font-family: 'Tahoma', 'MS Sans Serif', sans-serif;
  font-size: 12px;
  padding: 6px 30px;
  min-width: 85px;
  min-height: 25px;
  cursor: pointer;
  letter-spacing: 0.05em;
}

.win-btn:active {
  border-top: 2px solid #000000;
  border-left: 2px solid #000000;
  border-bottom: 2px solid #ffffff;
  border-right: 2px solid #ffffff;
  box-shadow: inset 1px 1px 0 #808080, inset -1px -1px 0 #dfdfdf;
  padding: 7px 29px 5px 31px;
}

.win-btn:focus {
  outline: 1px dotted #000;
  outline-offset: -4px;
}

.form-box__checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-dim);
  font-family: var(--font-body);
  font-size: 0.85rem;
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
  font-size: 0.85rem;
}

.form-box__links a {
  color: var(--color-text-dim);
  font-family: var(--font-body);
  transition: color 0.3s;
}

.form-box__links a:hover {
  color: var(--color-primary);
  text-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
}

.form-box__success {
  text-align: center;
  color: var(--color-primary);
  font-family: var(--font-system);
  margin-top: 1.5rem;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  text-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
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

@media (max-width: 768px) {
  .form-page {
    padding: 1.5rem 0.75rem;
  }
  .win-dialog__body {
    padding: 1rem;
  }
  .form-box__title {
    font-size: 1.1rem;
  }
  .win-btn {
    padding: 5px 20px;
    font-size: 11px;
  }
}
</style>
