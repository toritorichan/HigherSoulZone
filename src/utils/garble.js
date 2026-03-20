/**
 * Garble text into corrupted/glitched unicode mess
 * while keeping fragments barely recognizable.
 */

// Zalgo combining marks (above + below)
const ZALGO = [
  '\u0300','\u0301','\u0302','\u0303','\u0304','\u0305','\u0306','\u0307',
  '\u0308','\u0309','\u030A','\u030B','\u030C','\u030D','\u030E','\u030F',
  '\u0310','\u0311','\u0312','\u0313','\u0314','\u0315','\u031A',
  '\u0321','\u0322','\u0323','\u0324','\u0325','\u0326','\u0327','\u0328',
  '\u0329','\u032A','\u032B','\u032C','\u032D','\u032E','\u032F',
  '\u0330','\u0331','\u0332','\u0333','\u0334','\u0335','\u0336','\u0337','\u0338',
  '\u0339','\u033A','\u033B','\u033C','\u034D','\u034E',
  '\u0346','\u0347','\u0348','\u0349',
]

// Junk fill characters
const JUNK = '░▒▓█▄▀■□▪▫◊◌◦●○◎◐◑▲△▼▽◢◣◤◥⊕⊖⊗⊘⌇⌐⌠⌡⎔⎕⏃⏄⏅'
const SYMBOLS = '⟁⟐⟑⟒⟓⟔⟕⟖⟗⧫⧬⧭⧮⧯⨀⨁⨂⨃⩕⩖⩗⩘⬡⬢⬣⭓⭔'
const BINARY = '01'

function randFrom(str) {
  return str[Math.floor(Math.random() * str.length)]
}

function addZalgo(char, intensity = 1) {
  let result = char
  const count = Math.floor(Math.random() * intensity * 3) + 1
  for (let i = 0; i < count; i++) {
    result += ZALGO[Math.floor(Math.random() * ZALGO.length)]
  }
  return result
}

/**
 * Garble a readable string into corrupted text.
 * @param {string} text - Original readable text
 * @param {number} severity - 0.0 (barely garbled) to 1.0 (heavily garbled). Default 0.6
 * @returns {string} Corrupted text with fragments of original visible
 */
export function garble(text, severity = 0.6) {
  const chars = [...text]
  const result = []

  for (let i = 0; i < chars.length; i++) {
    const r = Math.random()

    if (r < severity * 0.3) {
      // Replace with junk
      result.push(randFrom(JUNK))
      if (Math.random() < 0.3) result.push(randFrom(SYMBOLS))
    } else if (r < severity * 0.5) {
      // Zalgo the character
      result.push(addZalgo(chars[i], severity * 2))
    } else if (r < severity * 0.15) {
      // Binary burst
      const len = 2 + Math.floor(Math.random() * 4)
      for (let j = 0; j < len; j++) result.push(randFrom(BINARY))
    } else if (r < severity * 0.65) {
      // Keep char but add zalgo lightly
      result.push(addZalgo(chars[i], 0.5))
    } else {
      // Keep original (recognizable fragment)
      result.push(chars[i])
    }

    // Random junk insertion between chars
    if (Math.random() < severity * 0.15) {
      result.push(randFrom(JUNK))
    }
  }

  return result.join('')
}

/**
 * Pick a random message from array and garble it.
 */
export function garbleRandom(messages, severity = 0.6) {
  const msg = messages[Math.floor(Math.random() * messages.length)]
  return garble(msg, severity)
}

/**
 * Generate a fully garbled string of given length (no source text).
 * Looks like corrupted data with occasional character-like shapes.
 */
export function garbleNoise(length = 12) {
  const result = []
  const fragments = '他們來了不要看逃跑快跑HELPRUNSTOPNO逃げて助けて도와줘'
  for (let i = 0; i < length; i++) {
    const r = Math.random()
    if (r < 0.3) {
      result.push(addZalgo(randFrom(fragments), 2))
    } else if (r < 0.5) {
      result.push(randFrom(JUNK))
    } else if (r < 0.7) {
      result.push(randFrom(SYMBOLS))
    } else {
      result.push(addZalgo(randFrom(BINARY), 1))
    }
  }
  return result.join('')
}
