const cuneiform = Array.from({ length: 100 }, (_, i) => String.fromCodePoint(0x12000 + i))
const mathSymbols = '∀∂∃∅∇∈∉∋∏∑−∗√∝∞∠∡∢∣∤∥∦§∨∩∪∫∬∭∮∯∰∱∲∳'.split('')

export function toAlienText(text) {
  return text.split('').map(char => {
    if (/[\u4e00-\u9fff]/.test(char)) {
      const code = char.charCodeAt(0)
      const pool = [...cuneiform, ...mathSymbols]
      return pool[code % pool.length]
    }
    return char
  }).join('')
}

export function isChineseChar(char) {
  return /[\u4e00-\u9fff]/.test(char)
}
