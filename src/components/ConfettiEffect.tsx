import { useEffect } from 'react'

interface ConfettiEffectProps {
  trigger: boolean
  onComplete?: () => void
}

export function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  useEffect(() => {
    if (!trigger) return

    // Simple confetti effect using CSS animations
    const confettiContainer = document.createElement('div')
    confettiContainer.className = 'fixed inset-0 pointer-events-none z-50'
    document.body.appendChild(confettiContainer)

    // Create confetti pieces
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div')
      confetti.className = 'absolute animate-bounce'
      confetti.style.left = Math.random() * 100 + '%'
      confetti.style.top = '-10px'
      confetti.style.width = '10px'
      confetti.style.height = '10px'
      confetti.style.backgroundColor = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b'][Math.floor(Math.random() * 5)]
      confetti.style.animationDelay = Math.random() * 2 + 's'
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's'
      
      // Add fall animation
      confetti.style.animation = `
        confetti-fall ${Math.random() * 3 + 2}s linear forwards,
        confetti-spin ${Math.random() * 2 + 1}s linear infinite
      `
      
      confettiContainer.appendChild(confetti)
    }

    // Clean up after animation
    const cleanup = setTimeout(() => {
      document.body.removeChild(confettiContainer)
      onComplete?.()
    }, 4000)

    return () => {
      clearTimeout(cleanup)
      if (document.body.contains(confettiContainer)) {
        document.body.removeChild(confettiContainer)
      }
    }
  }, [trigger, onComplete])

  return null
}

// Add CSS keyframes for confetti animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes confetti-fall {
      0% { transform: translateY(-100vh) rotateZ(0deg); }
      100% { transform: translateY(100vh) rotateZ(360deg); }
    }
    @keyframes confetti-spin {
      0% { transform: rotateY(0deg); }
      100% { transform: rotateY(360deg); }
    }
  `
  document.head.appendChild(style)
}