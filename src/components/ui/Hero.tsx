// ============================================
// HERO SECTION - ENHANCED PIXEL ART
// ============================================

'use client'

import { CountdownTimer } from './CountdownTimer'
import { MAPUA_INFO } from '@/types'

export function Hero() {
  const surveyOpenDate = '2026-02-05T00:00:00'

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20 px-4 overflow-hidden">
      {/* Animated Pixel Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, #D32F2F 0px, #D32F2F 2px, transparent 2px, transparent 12px),
            repeating-linear-gradient(90deg, #1976D2 0px, #1976D2 2px, transparent 2px, transparent 12px)
          `,
          backgroundSize: '24px 24px',
          animation: 'pixel-scroll 20s linear infinite'
        }} />
      </div>

      {/* Floating Pixel Decorations */}
      <div className="absolute top-20 left-10 text-6xl pixel-bounce" style={{ animationDelay: '0s' }}>
        ⭐
      </div>
      <div className="absolute top-40 right-20 text-5xl pixel-bounce" style={{ animationDelay: '0.5s' }}>
        💫
      </div>
      <div className="absolute bottom-32 left-20 text-5xl pixel-bounce" style={{ animationDelay: '1s' }}>
        ✨
      </div>
      <div className="absolute bottom-40 right-10 text-6xl pixel-bounce" style={{ animationDelay: '1.5s' }}>
        💖
      </div>

      <div className="pixel-container relative z-10">
        <div className="pixel-card max-w-5xl mx-auto text-center" style={{
          background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE5D9 100%)'
        }}>
          {/* Enhanced Pixel Art Wizard Character */}
          <div className="mb-8 flex justify-center">
            <div className="pixel-avatar w-48 h-48 pixel-bounce" style={{
              background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)',
              boxShadow: '8px 8px 0 #1A1A2E, 16px 16px 0 rgba(26, 26, 46, 0.2)'
            }}>
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                style={{ imageRendering: 'pixelated' }}
              >
                {/* Wizard Hat - Enhanced */}
                <rect x="30" y="5" width="40" height="8" fill="#D32F2F" />
                <polygon points="50,0 25,13 75,13" fill="#FF6B6B" />
                <polygon points="50,0 35,10 65,10" fill="#FFD93D" />
                {/* Hat Band */}
                <rect x="30" y="13" width="40" height="4" fill="#1976D2" />
                {/* Stars on Hat */}
                <polygon points="40,8 42,12 46,12 43,15 44,19 40,16 36,19 37,15 34,12 38,12" fill="#FFD93D" />
                <polygon points="60,8 62,12 66,12 63,15 64,19 60,16 56,19 57,15 54,12 58,12" fill="#FFD93D" />

                {/* Face */}
                <rect x="30" y="20" width="40" height="35" fill="#FFE5D9" />
                {/* Cheeks */}
                <rect x="32" y="38" width="12" height="8" fill="#FFB6C1" opacity="0.6" />
                <rect x="56" y="38" width="12" height="8" fill="#FFB6C1" opacity="0.6" />
                {/* Eyes - Big Pixel Style */}
                <rect x="36" y="30" width="8" height="8" fill="#1A1A2E" />
                <rect x="56" y="30" width="8" height="8" fill="#1A1A2E" />
                {/* Eye Shine */}
                <rect x="38" y="31" width="3" height="3" fill="#FFFFFF" />
                <rect x="58" y="31" width="3" height="3" fill="#FFFFFF" />
                {/* Eyebrows */}
                <rect x="35" y="27" width="10" height="2" fill="#1A1A2E" />
                <rect x="55" y="27" width="10" height="2" fill="#1A1A2E" />
                {/* Nose */}
                <rect x="48" y="38" width="4" height="4" fill="#E5B8A7" />
                {/* Smile - Pixel Style */}
                <rect x="40" y="46" width="20" height="4" fill="#1A1A2E" />
                <rect x="38" y="44" width="4" height="4" fill="#1A1A2E" />
                <rect x="58" y="44" width="4" height="4" fill="#1A1A2E" />

                {/* Beard - Enhanced */}
                <polygon points="30,55 70,55 65,75 35,75" fill="#E8E8E8" />
                <polygon points="35,60 65,60 62,72 38,72" fill="#D4D4D4" />
                {/* Beard Details */}
                <rect x="45" y="65" width="10" height="8" fill="#C8C8C8" />
                <rect x="48" y="68" width="4" height="4" fill="#B8B8B8" />

                {/* Robe/Body */}
                <rect x="25" y="75" width="50" height="25" fill="#1976D2" />
                <rect x="20" y="80" width="10" height="20" fill="#1976D2" />
                <rect x="70" y="80" width="10" height="20" fill="#1976D2" />
                {/* Robe Details */}
                <rect x="45" y="80" width="10" height="20" fill="#FFD93D" />
                {/* Robe Collar */}
                <polygon points="30,75 50,85 70,75 65,78 50,88 35,78" fill="#FF6B6B" />

                {/* Staff/Wand */}
                <rect x="75" y="40" width="4" height="55" fill="#8B4513" />
                {/* Staff Orb */}
                <circle cx="77" cy="35" r="6" fill="#FFD93D" />
                <circle cx="77" cy="35" r="3" fill="#FFFFFF" opacity="0.8" />
                {/* Sparkles around Staff */}
                <polygon points="82,28 83,31 86,31 84,33 85,36 82,34 79,36 80,33 77,31 80,31" fill="#FFD93D" />
              </svg>
            </div>
          </div>

          {/* Title - Enhanced Pixel Style */}
          <div className="mb-6">
            <h1 className="pixel-text-shadow pixel-font-heading text-4xl md:text-6xl font-bold mb-2 gradient-text-animated">
              WIZARD CONNECT
            </h1>
            <div className="pixel-divider" style={{ height: '4px', margin: '16px auto' }}></div>
          </div>

          <div className="pixel-badge mb-6" style={{ fontSize: '12px' }}>
            {MAPUA_INFO.COLLEGE_NAME}
          </div>

          <p className="pixel-font-body text-2xl md:text-3xl mb-8" style={{ color: '#2D3436' }}>
            Find your perfect match this Valentine's Day! 💕
          </p>

          {/* Countdown Section - Enhanced */}
          <div className="mb-8">
            <h2 className="pixel-font-heading text-xl md:text-2xl font-bold mb-4" style={{ color: '#1976D2' }}>
              ⏰ Survey Opens In:
            </h2>
            <CountdownTimer targetDate={surveyOpenDate} />
          </div>

          {/* Key Dates - Enhanced Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-10">
            <div className="pixel-card hover-lift pixel-shine-effect">
              <div className="pixel-badge mb-3">Feb 5-10</div>
              <div className="text-4xl mb-3">📝</div>
              <h3 className="pixel-font-heading text-base font-bold mb-2" style={{ color: '#D32F2F' }}>
                Survey Period
              </h3>
              <p className="pixel-font-body text-sm" style={{ color: '#636E72' }}>
                Complete your personality survey and crush list
              </p>
            </div>

            <div className="pixel-card hover-lift pixel-shine-effect" style={{ animationDelay: '0.1s' }}>
              <div className="pixel-badge mb-3" style={{ background: '#4ECDC4' }}>Feb 11-13</div>
              <div className="text-4xl mb-3">💝</div>
              <h3 className="pixel-font-heading text-base font-bold mb-2" style={{ color: '#1976D2' }}>
                Profile Update
              </h3>
              <p className="pixel-font-body text-sm" style={{ color: '#636E72' }}>
                Polish your profile and start messaging matches
              </p>
            </div>

            <div className="pixel-card hover-lift pixel-shine-effect" style={{ animationDelay: '0.2s' }}>
              <div className="pixel-badge mb-3" style={{ background: '#FF6B6B' }}>Feb 14</div>
              <div className="text-4xl mb-3">💖</div>
              <h3 className="pixel-font-heading text-base font-bold mb-2" style={{ color: '#D32F2F' }}>
                Match Reveal
              </h3>
              <p className="pixel-font-body text-sm" style={{ color: '#636E72' }}>
                Valentine's Day reveal of your perfect matches!
              </p>
            </div>
          </div>

          {/* CTA Buttons - Enhanced */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button className="pixel-btn pixel-btn-primary pixel-glow pixel-ripple pixel-font-heading">
              ⚡ Sign in with Google
            </button>
            <button className="pixel-btn pixel-btn-secondary pixel-ripple pixel-font-heading">
              📜 Learn More
            </button>
          </div>

          {/* Stats Section - Enhanced */}
          <div className="pt-8" style={{ borderTop: '4px solid #1A1A2E' }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="pixel-border-thin p-4" style={{ background: '#FFE5D9' }}>
                <div className="pixel-text-shadow pixel-font-heading text-4xl font-bold mb-2" style={{ color: '#D32F2F' }}>
                  500+
                </div>
                <div className="pixel-font-body text-sm" style={{ color: '#2D3436' }}>
                  Students Matched
                </div>
              </div>
              <div className="pixel-border-thin p-4" style={{ background: '#E8F8F5' }}>
                <div className="pixel-text-shadow pixel-font-heading text-4xl font-bold mb-2" style={{ color: '#1976D2' }}>
                  85%
                </div>
                <div className="pixel-font-body text-sm" style={{ color: '#2D3436' }}>
                  Success Rate
                </div>
              </div>
              <div className="pixel-border-thin p-4" style={{ background: '#FFF8E7' }}>
                <div className="pixel-text-shadow pixel-font-heading text-4xl font-bold mb-2" style={{ color: '#D32F2F' }}>
                  100%
                </div>
                <div className="pixel-font-body text-sm" style={{ color: '#2D3436' }}>
                  Free Forever
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pixel-scroll {
          0% {
            background-position: 0 0, 0 0;
          }
          100% {
            background-position: 24px 24px, 24px 24px;
          }
        }
      `}</style>
    </section>
  )
}
