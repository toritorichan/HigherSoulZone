<template>
  <div class="dead-site">
    <div class="stars">
      <div class="stars__layer"></div>
    </div>

    <div class="dead-site__content">
      <img
        src="/media/alien.png"
        alt="Alien"
        class="dead-site__alien dead-site__alien--top"
      />

      <h1 class="glitch-text">
        <span class="glitch-text__row">
          <span class="glitch-text__inner">會幫我們保密嗎?</span>
        </span>
        <span class="glitch-text__row glitch-text__row--sibling" aria-hidden="true">
          <span class="glitch-text__inner">會幫我們保密嗎?</span>
        </span>
        <span class="glitch-text__row glitch-text__row--sibling" aria-hidden="true">
          <span class="glitch-text__inner">會幫我們保密嗎?</span>
        </span>
        <span class="glitch-text__row glitch-text__row--sibling" aria-hidden="true">
          <span class="glitch-text__inner">會幫我們保密嗎?</span>
        </span>
      </h1>

      <button ref="buttonRef" class="dead-site__btn" @click="handleClick">
        <span ref="buttonTextRef" class="dead-site__btn-text">我會保密!</span>
      </button>

      <p ref="thankRef" class="dead-site__thank">THANK YOU! (&gt; &lt;)</p>

      <img
        src="/media/alien.png"
        alt="Alien"
        class="dead-site__alien dead-site__alien--bottom"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import gsap from 'gsap'
import { useAudio } from '../composables/useAudio'

const router = useRouter()
const { playExplosion } = useAudio()

const buttonRef = ref(null)
const buttonTextRef = ref(null)
const thankRef = ref(null)

function handleClick() {
  playExplosion()
  const tl = gsap.timeline()
  tl.to(buttonTextRef.value, { opacity: 0, duration: 0.6 })
    .to(buttonRef.value, {
      height: 0.2,
      opacity: 0.5,
      boxShadow: '0px 0px 35px 7px #cd28fa',
      delay: 0.25,
      duration: 0.8,
    })
    .to(buttonRef.value, {
      opacity: 0.5,
      background: '#26ff92',
      duration: 0.1,
    })
    .to(buttonRef.value, {
      width: 1,
      delay: 0.2,
      duration: 0,
    })
    .to(buttonRef.value, {
      boxShadow: '0px 0px 100px 55px #fa2856',
      y: 90,
      height: 100,
      delay: 0.23,
      duration: 0.1,
    })
    .to(buttonRef.value, {
      height: 1000,
      y: -1500,
      boxShadow: '0px 0px 85px 17px #fa2856',
      delay: 0.2,
      duration: 0.3,
    })
    .to(thankRef.value, {
      opacity: 1,
      delay: 0.3,
      duration: 1,
    })

  setTimeout(() => router.push('/'), 5000)
}
</script>

<style scoped>
/* ── Starfield ── */
.stars {
  position: fixed;
  inset: 0;
  z-index: 0;
  background: #000;
}

.stars::before,
.stars::after,
.stars .stars__layer {
  content: '';
  position: absolute;
  inset: 0;
}

/* Layer 1 — small 1px stars */
.stars::before {
  box-shadow:
    25px 50px #fff, 100px 180px #fff, 210px 30px #fff, 350px 120px #fff,
    450px 250px #fff, 530px 70px #fff, 620px 310px #fff, 710px 40px #fff,
    80px 400px #fff, 190px 500px #fff, 300px 350px #fff, 420px 480px #fff,
    550px 180px #fff, 650px 400px #fff, 740px 280px #fff, 830px 90px #fff,
    920px 350px #fff, 1010px 150px #fff, 1100px 420px #fff, 1200px 60px #fff,
    45px 600px #fff, 170px 720px #fff, 280px 640px #fff, 400px 700px #fff,
    520px 580px #fff, 640px 660px #fff, 760px 530px #fff, 880px 710px #fff,
    960px 590px #fff, 1050px 680px #fff, 1150px 550px #fff, 1250px 740px #fff,
    60px 820px #fff, 180px 900px #fff, 320px 830px #fff, 470px 910px #fff,
    590px 860px #fff, 700px 940px #fff, 820px 800px #fff, 950px 870px #fff,
    1080px 920px #fff, 1180px 810px #fff, 130px 1000px #fff, 350px 1050px #fff,
    550px 1020px #fff, 750px 1070px #fff, 900px 1010px #fff, 1100px 1060px #fff;
  width: 1px;
  height: 1px;
  animation: starTwinkle 4s ease-in-out infinite alternate;
}

/* Layer 2 — medium 2px stars */
.stars::after {
  box-shadow:
    120px 90px #fff, 260px 220px #fff, 400px 60px #fff, 540px 330px #fff,
    680px 150px #fff, 810px 420px #fff, 950px 260px #fff, 1070px 380px #fff,
    60px 300px #fff, 200px 450px #fff, 340px 580px #fff, 480px 150px #fff,
    600px 500px #fff, 730px 620px #fff, 870px 180px #fff, 1000px 540px #fff,
    150px 650px #fff, 310px 770px #fff, 460px 850px #fff, 620px 730px #fff,
    770px 880px #fff, 910px 650px #fff, 1060px 790px #fff, 1190px 340px #fff,
    80px 950px #fff, 240px 1030px #fff, 440px 970px #fff, 660px 1040px #fff,
    850px 950px #fff, 1050px 1000px #fff;
  width: 2px;
  height: 2px;
  animation: starTwinkle 6s ease-in-out infinite alternate-reverse;
}

/* Layer 3 — large 3px stars */
.stars .stars__layer {
  box-shadow:
    180px 140px #fff, 370px 290px #fff, 560px 80px #fff, 720px 450px #fff,
    900px 310px #fff, 1050px 120px #fff, 130px 530px #fff, 320px 680px #fff,
    510px 410px #fff, 690px 590px #fff, 870px 760px #fff, 1020px 640px #fff,
    220px 860px #fff, 440px 730px #fff, 640px 920px #fff, 830px 1000px #fff,
    1100px 880px #fff, 70px 1060px #fff, 350px 980px #fff, 580px 1050px #fff;
  width: 3px;
  height: 3px;
  animation: starTwinkle 8s ease-in-out infinite alternate;
}

@keyframes starTwinkle {
  0% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* ── Page layout ── */
.dead-site {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
}

.dead-site__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  text-align: center;
}

/* ── Alien images ── */
.dead-site__alien {
  width: 160px;
  height: auto;
  filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.4));
}

.dead-site__alien--top {
  animation: alienFloat 3s ease-in-out infinite alternate;
}

.dead-site__alien--bottom {
  animation: alienFloat 3s ease-in-out 1.5s infinite alternate;
}

@keyframes alienFloat {
  0% { transform: translateY(0); }
  100% { transform: translateY(-12px); }
}

/* ── Button ── */
.dead-site__btn {
  position: relative;
  padding: 1rem 3rem;
  font-size: 1.5rem;
  font-family: var(--font-heading, 'Orbitron', monospace);
  color: #fff;
  background: transparent;
  border: 2px solid #cd28fa;
  border-radius: 4px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  box-shadow: 0 0 15px 3px rgba(205, 40, 250, 0.4), inset 0 0 15px 1px rgba(205, 40, 250, 0.15);
  transition: box-shadow 0.2s;
  overflow: hidden;
}

.dead-site__btn:hover {
  box-shadow: 0 0 25px 6px rgba(205, 40, 250, 0.6), inset 0 0 25px 3px rgba(205, 40, 250, 0.25);
}

.dead-site__btn-text {
  display: inline-block;
}

/* ── Thank you ── */
.dead-site__thank {
  opacity: 0;
  font-size: 2.5rem;
  font-family: var(--font-heading, 'Orbitron', monospace);
  color: #26ff92;
  text-shadow: 0 0 20px rgba(38, 255, 146, 0.6);
}
</style>
