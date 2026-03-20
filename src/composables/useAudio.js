let audioCtx = null
let initialized = false

function getContext() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  if (audioCtx.state === 'suspended') audioCtx.resume()
  return audioCtx
}

function showAudioToast() {
  if (initialized) return
  initialized = true
  const toast = document.createElement('div')
  toast.textContent = '🔊 已啟用音效'
  toast.style.cssText = 'position:fixed;top:20px;right:20px;padding:8px 16px;background:rgba(0,255,136,0.15);color:#0f8;border:1px solid #0f8;border-radius:4px;font-size:13px;z-index:99999;transition:opacity 0.5s;pointer-events:none;'
  document.body.appendChild(toast)
  setTimeout(() => { toast.style.opacity = '0' }, 1500)
  setTimeout(() => toast.remove(), 2000)
}

const ALIEN_SOUNDS = {
  pleiadian: { type: 'chord', notes: [261.63, 329.63, 392.00], wave: 'sine' },
  lyran: { type: 'arpeggio', notes: [440, 523, 659, 784], wave: 'triangle' },
  greys: { type: 'vibrato', freq: 2000, wave: 'sine', rate: 8 },
  reptilians: { type: 'pulse', freq: 80, wave: 'sawtooth', rate: 2 },
  orions: { type: 'cluster', count: 5, wave: 'sine' },
  dracos: { type: 'chord', notes: [261.63, 369.99], wave: 'square' },
  sirians: { type: 'echo', freq: 440, wave: 'sine', delay: 0.15 },
  mothmen: { type: 'tremolo', freq: 1200, wave: 'sine', rate: 20 },
}

function createEnvelope(ctx, gainNode, attack = 0.05, release = 0.3, duration = 0.8) {
  const now = ctx.currentTime
  gainNode.gain.setValueAtTime(0, now)
  gainNode.gain.linearRampToValueAtTime(0.3, now + attack)
  gainNode.gain.linearRampToValueAtTime(0, now + duration)
}

function playChord(ctx, notes, wave) {
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  createEnvelope(ctx, gain)
  notes.forEach(freq => {
    const osc = ctx.createOscillator()
    osc.type = wave
    osc.frequency.value = freq
    osc.connect(gain)
    osc.start()
    osc.stop(ctx.currentTime + 0.8)
  })
}

function playArpeggio(ctx, notes, wave) {
  notes.forEach((freq, i) => {
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    const now = ctx.currentTime + i * 0.12
    gain.gain.setValueAtTime(0, now)
    gain.gain.linearRampToValueAtTime(0.25, now + 0.03)
    gain.gain.linearRampToValueAtTime(0, now + 0.3)
    const osc = ctx.createOscillator()
    osc.type = wave
    osc.frequency.value = freq
    osc.connect(gain)
    osc.start(now)
    osc.stop(now + 0.3)
  })
}

function playVibrato(ctx, freq, wave, rate) {
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  createEnvelope(ctx, gain)
  const osc = ctx.createOscillator()
  osc.type = wave
  osc.frequency.value = freq
  const lfo = ctx.createOscillator()
  lfo.frequency.value = rate
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 50
  lfo.connect(lfoGain)
  lfoGain.connect(osc.frequency)
  osc.connect(gain)
  osc.start()
  lfo.start()
  osc.stop(ctx.currentTime + 0.8)
  lfo.stop(ctx.currentTime + 0.8)
}

function playPulse(ctx, freq, wave, rate) {
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  const osc = ctx.createOscillator()
  osc.type = wave
  osc.frequency.value = freq
  const lfo = ctx.createOscillator()
  lfo.frequency.value = rate
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.3
  lfo.connect(lfoGain)
  lfoGain.connect(gain.gain)
  gain.gain.value = 0.3
  osc.connect(gain)
  osc.start()
  lfo.start()
  osc.stop(ctx.currentTime + 0.8)
  lfo.stop(ctx.currentTime + 0.8)
}

function playCluster(ctx, count, wave) {
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  createEnvelope(ctx, gain, 0.05, 0.3, 0.6)
  for (let i = 0; i < count; i++) {
    const osc = ctx.createOscillator()
    osc.type = wave
    osc.frequency.value = 200 + Math.random() * 800
    osc.connect(gain)
    osc.start()
    osc.stop(ctx.currentTime + 0.6)
  }
}

function playEcho(ctx, freq, wave, delayTime) {
  const gain = ctx.createGain()
  const delay = ctx.createDelay()
  const feedback = ctx.createGain()
  delay.delayTime.value = delayTime
  feedback.gain.value = 0.4
  gain.connect(ctx.destination)
  gain.connect(delay)
  delay.connect(feedback)
  feedback.connect(delay)
  delay.connect(ctx.destination)
  createEnvelope(ctx, gain)
  const osc = ctx.createOscillator()
  osc.type = wave
  osc.frequency.value = freq
  osc.connect(gain)
  osc.start()
  osc.stop(ctx.currentTime + 0.8)
}

function playTremolo(ctx, freq, wave, rate) {
  const gain = ctx.createGain()
  gain.connect(ctx.destination)
  gain.gain.value = 0.3
  const lfo = ctx.createOscillator()
  lfo.frequency.value = rate
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.3
  lfo.connect(lfoGain)
  lfoGain.connect(gain.gain)
  createEnvelope(ctx, gain, 0.02, 0.2, 0.6)
  const osc = ctx.createOscillator()
  osc.type = wave
  osc.frequency.value = freq
  osc.connect(gain)
  osc.start()
  lfo.start()
  osc.stop(ctx.currentTime + 0.6)
  lfo.stop(ctx.currentTime + 0.6)
}

export function useAudio() {
  function playAlienSound(alienId) {
    const config = ALIEN_SOUNDS[alienId]
    if (!config) return
    const ctx = getContext()
    showAudioToast()
    switch (config.type) {
      case 'chord': playChord(ctx, config.notes, config.wave); break
      case 'arpeggio': playArpeggio(ctx, config.notes, config.wave); break
      case 'vibrato': playVibrato(ctx, config.freq, config.wave, config.rate); break
      case 'pulse': playPulse(ctx, config.freq, config.wave, config.rate); break
      case 'cluster': playCluster(ctx, config.count, config.wave); break
      case 'echo': playEcho(ctx, config.freq, config.wave, config.delay); break
      case 'tremolo': playTremolo(ctx, config.freq, config.wave, config.rate); break
    }
  }

  function playExplosion() {
    const ctx = getContext()
    showAudioToast()
    // Low-frequency burst
    const gain1 = ctx.createGain()
    gain1.connect(ctx.destination)
    gain1.gain.setValueAtTime(0.5, ctx.currentTime)
    gain1.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
    const osc1 = ctx.createOscillator()
    osc1.type = 'sawtooth'
    osc1.frequency.value = 60
    osc1.connect(gain1)
    osc1.start()
    osc1.stop(ctx.currentTime + 0.3)
    // High-frequency flash
    const gain2 = ctx.createGain()
    gain2.connect(ctx.destination)
    gain2.gain.setValueAtTime(0.2, ctx.currentTime)
    gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1)
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.value = 4000
    osc2.connect(gain2)
    osc2.start()
    osc2.stop(ctx.currentTime + 0.1)
  }

  return { playAlienSound, playExplosion }
}
