// ============================================
// ADVANCED PARALLAX BACKGROUND
// ============================================

'use client'

import { useEffect, useRef } from 'react'

interface ParallaxLayer {
  speed: number
  image: string
  y: number
}

export function ParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden -z-10"
      style={{
        background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE5D9 50%, #E8F8F5 100%)',
      }}
    >
      {/* Animated Grid Pattern */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(211, 47, 47, 0.1) 1px, transparent 1px),
            linear-gradient(rgba(211, 47, 47, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px',
          transform: `translate(${mouseRef.current.x}px, ${mouseRef.current.y}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      {/* Floating Pixel Art Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large pixel art decorations */}
        <div
          className="absolute text-9xl opacity-10"
          style={{
            top: '10%',
            left: '5%',
            transform: `translate(${mouseRef.current.x * 0.5}px, ${mouseRef.current.y * 0.5}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          🎮
        </div>
        <div
          className="absolute text-8xl opacity-10"
          style={{
            top: '20%',
            right: '10%',
            transform: `translate(${mouseRef.current.x * -0.3}px, ${mouseRef.current.y * 0.3}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          🎲
        </div>
        <div
          className="absolute text-8xl opacity-10"
          style={{
            bottom: '15%',
            left: '8%',
            transform: `translate(${mouseRef.current.x * 0.4}px, ${mouseRef.current.y * -0.4}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          🕹️
        </div>
        <div
          className="absolute text-9xl opacity-10"
          style={{
            bottom: '25%',
            right: '15%',
            transform: `translate(${mouseRef.current.x * -0.5}px, ${mouseRef.current.y * -0.5}px)`,
            transition: 'transform 0.5s ease-out',
          }}
        >
          👾
        </div>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5" style={{
        background: 'radial-gradient(circle, #FF6B6B 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full opacity-5" style={{
        background: 'radial-gradient(circle, #4ECDC4 0%, transparent 70%)',
        filter: 'blur(60px)',
        animation: 'float 8s ease-in-out infinite 4s',
      }} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }
      `}</style>
    </div>
  )
}

// Scanline Effect
export function ScanlineEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0" style={{
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.03) 2px)',
        backgroundSize: '100% 4px',
      }} />
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.02) 50%, rgba(0,0,0,0) 100%)',
      }} />
    </div>
  )
}
