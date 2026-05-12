'use client'

import confetti from 'canvas-confetti'
import { useCallback } from 'react'

export function useConfetti() {
  const fireConfetti = useCallback((options?: {
    particleCount?: number
    spread?: number
    colors?: string[]
    origin?: { x: number; y: number }
  }) => {
    const defaults = {
      particleCount: 100,
      spread: 70,
      colors: ['#FF6B9D', '#6BCB77', '#4D96FF', '#FFD93D', '#A66CFF', '#FF9F43'],
      origin: { x: 0.5, y: 0.6 },
      ...options,
    }

    confetti({
      ...defaults,
      disableForReducedMotion: true,
    })
  }, [])

  const fireStars = useCallback(() => {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      colors: ['#FFD93D', '#FF9F43', '#FFF'],
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
        disableForReducedMotion: true,
      })
    }

    fire(0.25, { spread: 26, startVelocity: 55 })
    fire(0.2, { spread: 60 })
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
    fire(0.1, { spread: 120, startVelocity: 45 })
  }, [])

  const fireSideCannons = useCallback(() => {
    const end = Date.now() + 1000
    const colors = ['#FF6B9D', '#6BCB77', '#4D96FF', '#FFD93D', '#A66CFF']

    function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors,
        disableForReducedMotion: true,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  const fireSchoolPride = useCallback(() => {
    const end = Date.now() + 2000
    const colors = ['#FF6B9D', '#6BCB77', '#4D96FF', '#FFD93D', '#A66CFF']

    function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
        disableForReducedMotion: true,
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
        disableForReducedMotion: true,
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }, [])

  return {
    fireConfetti,
    fireStars,
    fireSideCannons,
    fireSchoolPride,
  }
}
