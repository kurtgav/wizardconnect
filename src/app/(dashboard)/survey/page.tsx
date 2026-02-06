// ============================================
// SURVEY PAGE - PREMIUM PIXEL ART
// ============================================

'use client'

import { SurveyForm } from '@/components/features/survey/SurveyForm'
import { useRouter } from 'next/navigation'
import { ParallaxBackground, ScanlineEffect } from '@/components/effects/ParallaxBackground'
import { ParticleEffects } from '@/components/effects/ParticleEffects'

export default function SurveyPage() {
  const router = useRouter()

  const handleSurveyComplete = (responses: Record<string, any>) => {
    // In production, this would save to Supabase
    console.log('Survey completed:', responses)

    // Show success message and redirect
    alert('Survey completed successfully! You can now update your profile.')
    router.push('/profile')
  }

  return (
    <main className="min-h-screen relative">
      {/* Premium Background Effects */}
      <ParallaxBackground />
      <ParticleEffects type="stars" density="10" className="opacity-30" />
      <ScanlineEffect />

      <div className="relative z-10 py-12 px-4" style={{ background: 'rgba(255, 248, 240, 0.9)' }}>
        <div className="pixel-container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <span className="text-6xl pixel-bounce inline-block">📝</span>
            </div>
            <h1 className="pixel-text-shadow gradient-text-animated pixel-font-heading text-4xl md:text-5xl font-bold mb-4">
              Wizard Connect Survey
            </h1>
            <div className="pixel-divider max-w-md mx-auto mb-6"></div>
            <p className="pixel-font-body text-xl max-w-2xl mx-auto" style={{ color: '#2D3436' }}>
              Help us find your perfect match by answering these questions about yourself.
              Your responses will be used to calculate compatibility with other Mapua students.
            </p>
          </div>

          {/* Survey Form */}
          <SurveyForm onComplete={handleSurveyComplete} />

          {/* Info Card */}
          <div className="mt-12 pixel-card hover-lift max-w-3xl mx-auto" style={{ background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)' }}>
            <h3 className="pixel-font-heading font-bold mb-4 text-lg" style={{ color: '#1976D2' }}>
              ℹ️ Tips for Completing the Survey
            </h3>
            <ul className="space-y-3 pixel-font-body text-sm">
              <li className="flex items-start gap-3">
                <span className="text-2xl">💾</span>
                <span style={{ color: '#2D3436' }}>Your progress is saved automatically. You can come back anytime before Feb 10.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">⏱️</span>
                <span style={{ color: '#2D3436' }}>The survey takes about 15-20 minutes to complete.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎯</span>
                <span style={{ color: '#2D3436' }}>Be honest - our algorithm works best with genuine responses.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">💕</span>
                <span style={{ color: '#2D3436' }}>The crush list is optional but highly recommended!</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <span style={{ color: '#2D3436' }}>All responses are confidential and only used for matching.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
}
