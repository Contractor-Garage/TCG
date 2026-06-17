import { useCallback } from 'react'

export default function useTextScramble() {
  return useCallback((text) => {
    if (!text) return null
    const chunks = []
    for (let i = 0; i < text.length; i += 2) {
      chunks.push(text.slice(i, i + 2))
    }
    return chunks.map((chunk, i) => <span key={i}>{chunk}</span>)
  }, [])
}
