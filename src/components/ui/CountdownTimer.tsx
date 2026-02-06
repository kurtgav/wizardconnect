// ============================================
// COUNTDOWN TIMER - ENHANCED PIXEL STYLE
// ============================================

'use client'

import { useEffect, useState } from 'react'
import { getTimeRemaining } from '@/lib/utils'

interface CountdownTimerProps {
  targetDate: Date | string
  className?: string
}

export function CountdownTimer({ targetDate, className = '' }: CountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(targetDate))

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getTimeRemaining(targetDate))
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  if (timeRemaining.isExpired) {
    return (
      <div className={`pixel-card text-center ${className}`} style={{ background: 'linear-gradient(135deg, #6BCB77 0%, #4ECDC4 100%)' }}>
        <div className="text-6xl mb-4 pixel-bounce">🎉</div>
        <h3 className="pixel-text-shadow pixel-font-heading text-3xl font-bold mb-2 text-white">
          LAUNCHED!
        </h3>
        <p className="pixel-font-body text-lg text-white">
          The survey is now open!
        </p>
      </div>
    )
  }

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="pixel-card p-4 text-center min-w-[100px] hover-lift pixel-shine-effect">
      <div className="text-6xl font-bold mb-2 pixel-font-heading" style={{
        color: '#D32F2F',
        textShadow: '2px 2px 0 #1A1A2E'
      }}>
        {value.toString().padStart(2, '0')}
      </div>
      <div className="pixel-font-body text-sm uppercase tracking-wide" style={{ color: '#636E72' }}>
        {label}
      </div>
    </div>
  )

  return (
    <div className={`pixel-container ${className}`}>
      <div className="flex gap-4 justify-center flex-wrap">
        <TimeBlock value={timeRemaining.days} label="Days" />
        <TimeBlock value={timeRemaining.hours} label="Hours" />
        <TimeBlock value={timeRemaining.minutes} label="Minutes" />
        <TimeBlock value={timeRemaining.seconds} label="Seconds" />
      </div>
    </div>
  )
}
