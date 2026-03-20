// Pure vanilla JS particle system — no Vue, no framework dependency
// Imported directly in main.js

export function initParticles() {
  const canvas = document.createElement('canvas')
  canvas.id = 'particle-canvas'
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:9999;pointer-events:none;'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  let W = window.innerWidth
  let H = window.innerHeight
  canvas.width = W
  canvas.height = H

  window.addEventListener('resize', () => {
    W = window.innerWidth
    H = window.innerHeight
    canvas.width = W
    canvas.height = H
  })

  const particles = []
  let mouseX = 0
  let mouseY = 0
  let mouseDown = false
  let mouseDownStart = 0
  let blackHole = false

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX
    mouseY = e.clientY
    for (let i = 0; i < 3; i++) {
      if (particles.length < 150) {
        particles.push({
          x: mouseX + (Math.random() - 0.5) * 10,
          y: mouseY + (Math.random() - 0.5) * 10,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: 5 + Math.random() * 7,
          life: 1,
        })
      }
    }
  })

  window.addEventListener('mousedown', () => {
    mouseDown = true
    mouseDownStart = Date.now()
  })

  window.addEventListener('mouseup', () => {
    if (blackHole) {
      for (let i = 0; i < 25; i++) {
        const angle = (Math.PI * 2 * i) / 25
        particles.push({
          x: mouseX,
          y: mouseY,
          vx: Math.cos(angle) * (4 + Math.random() * 4),
          vy: Math.sin(angle) * (4 + Math.random() * 4),
          size: 4 + Math.random() * 5,
          life: 1,
        })
      }
    }
    mouseDown = false
    mouseDownStart = 0
    blackHole = false
  })

  function frame() {
    ctx.clearRect(0, 0, W, H)

    if (mouseDown && Date.now() - mouseDownStart > 3000) {
      blackHole = true
    }

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i]

      if (blackHole) {
        const dx = mouseX - p.x
        const dy = mouseY - p.y
        const dist = Math.sqrt(dx * dx + dy * dy) || 1
        p.vx += (dx / dist) * 0.5 + (-dy / dist) * 0.2
        p.vy += (dy / dist) * 0.5 + (dx / dist) * 0.2
      }

      p.x += p.vx
      p.y += p.vy
      p.life -= 0.013
      p.size *= 0.987

      if (p.life <= 0) {
        particles.splice(i, 1)
        continue
      }

      ctx.save()
      ctx.globalAlpha = Math.min(p.life * 1.2, 1)
      ctx.shadowBlur = 20
      ctx.shadowColor = 'rgba(255,255,255,0.8)'
      ctx.fillStyle = '#fff'
      ctx.beginPath()
      ctx.arc(p.x, p.y, Math.max(p.size, 0.5), 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    requestAnimationFrame(frame)
  }

  frame()
}
