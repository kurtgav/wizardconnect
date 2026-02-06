// ============================================
// ADVANCED PARTICLE EFFECTS COMPONENT
// ============================================

'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  emoji?: string
  color?: string
}

interface ParticleEffectsProps {
  type?: 'stars' | 'hearts' | 'sparkles' | 'mixed'
  density?: number
  className?: string
}

export function ParticleEffects({
  type = 'stars',
  density = 20,
  className = ''
}: ParticleEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Initialize particles
    const particles: Particle[] = []
    const emojis = type === 'hearts' ? ['💕', '💖', '💗', '💓'] :
                type === 'sparkles' ? ['✨', '⭐', '💫', '🌟'] :
                ['⭐', '💫', '✨']

    for (let i = 0; i < density; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.2,
        size: Math.random() * 8 + 4,
        opacity: Math.random() * 0.5 + 0.3,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      })
    }

    particlesRef.current = particles

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around
        if (particle.x < -20) particle.x = canvas.width + 20
        if (particle.x > canvas.width + 20) particle.x = -20
        if (particle.y < -20) particle.y = canvas.height + 20
        if (particle.y > canvas.height + 20) particle.y = -20

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.font = `${particle.size}px Arial`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(particle.emoji || '✨', particle.x, particle.y)
        ctx.restore()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [type, density])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ opacity: 0.6 }}
    />
  )
}

// Floating Decoration Component
export function FloatingDecorations() {
  return (
    <>
      {/* Top-left corner */}
      <div className="fixed top-8 left-8 text-5xl animate-bounce" style={{ animationDuration: '2s', animationDelay: '0s' }}>
        ⭐
      </div>
      <div className="fixed top-24 left-16 text-4xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '0.5s' }}>
        ✨
      </div>

      {/* Top-right corner */}
      <div className="fixed top-12 right-12 text-5xl animate-bounce" style={{ animationDuration: '2.5s', animationDelay: '1s' }}>
        💫
      </div>
      <div className="fixed top-32 right-20 text-4xl animate-bounce" style={{ animationDuration: '2.2s', animationDelay: '1.5s' }}>
        ⚡
      </div>

      {/* Bottom-left corner */}
      <div className="fixed bottom-16 left-12 text-5xl animate-bounce" style={{ animationDuration: '2.8s', animationDelay: '0.3s' }}>
        🌟
      </div>
      <div className="fixed bottom-32 left-20 text-4xl animate-bounce" style={{ animationDuration: '2.4s', animationDelay: '0.8s' }}>
        💖
      </div>

      {/* Bottom-right corner */}
      <div className="fixed bottom-12 right-16 text-5xl animate-bounce" style={{ animationDuration: '2.6s', animationDelay: '0.6s' }}>
        ✨
      </div>
      <div className="fixed bottom-28 right-24 text-4xl animate-bounce" style={{ animationDuration: '2.3s', animationDelay: '1.2s' }}>
        💕
      </div>
    </>
  )
}

// Glowing Border Effect Component
export function GlowingBorder({
  children,
  color = '#FFD93D',
  className = ''
}: {
  children: React.ReactNode
  color?: string
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-lg animate-pulse" style={{
        background: `linear-gradient(90deg, ${color}, transparent, ${color})`,
        backgroundSize: '200% 100%',
        padding: '3px',
        animation: 'border-glow 3s linear infinite',
      }} />
      <style jsx>{`
        @keyframes border-glow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>
      {children}
    </div>
  )
}
