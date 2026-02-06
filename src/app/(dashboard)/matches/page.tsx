// ============================================
// MATCHES PAGE - PREMIUM PIXEL ART
// ============================================

'use client'

import { useState } from 'react'
import { ParallaxBackground, ScanlineEffect } from '@/components/effects/ParallaxBackground'
import { ParticleEffects } from '@/components/effects/ParticleEffects'

// Mock data for matches
const mockMatches = [
  {
    id: '1',
    name: 'Maria Santos',
    year: '3rd Year',
    major: 'Computer Science',
    compatibility: 92,
    rank: 1,
    isMutualCrush: true,
    bio: 'Coffee addict, coding enthusiast, and adventure seeker. Looking for someone to explore Laguna with! ☕💻',
    interests: ['Gaming', 'Music', 'Travel', 'Photography'],
    avatar: '👩‍💻',
  },
  {
    id: '2',
    name: 'Jose Reyes',
    year: '3rd Year',
    major: 'Information Technology',
    compatibility: 88,
    rank: 2,
    isMutualCrush: false,
    bio: 'Sports lover and tech geek. I play basketball and love building things with code.',
    interests: ['Sports', 'Technology', 'Gaming', 'Fitness'],
    avatar: '👨‍💻',
  },
  {
    id: '3',
    name: 'Ana Cruz',
    year: '2nd Year',
    major: 'Architecture',
    compatibility: 85,
    rank: 3,
    isMutualCrush: false,
    bio: 'Creative soul with a passion for design. I love sketching, painting, and exploring new places.',
    interests: ['Art', 'Travel', 'Photography', 'Music'],
    avatar: '👩‍🎨',
  },
  {
    id: '4',
    name: 'Carlos Mendoza',
    year: '4th Year',
    major: 'Mechanical Engineering',
    compatibility: 82,
    rank: 4,
    isMutualCrush: false,
    bio: 'Future engineer with a love for cars and robotics. Let\'s build something amazing together!',
    interests: ['Technology', 'Gaming', 'Fitness', 'Movies'],
    avatar: '👨‍🔧',
  },
  {
    id: '5',
    name: 'Sofia Garcia',
    year: '2nd Year',
    major: 'Business Administration',
    compatibility: 79,
    rank: 5,
    isMutualCrush: false,
    bio: 'Entrepreneur at heart. I love reading business books and planning my next startup idea.',
    interests: ['Reading', 'Writing', 'Travel', 'Music'],
    avatar: '👩‍💼',
  },
]

export default function MatchesPage() {
  const [selectedMatch, setSelectedMatch] = useState<typeof mockMatches[0] | null>(null)

  return (
    <main className="min-h-screen relative">
      {/* Premium Background Effects */}
      <ParallaxBackground />
      <ParticleEffects type="mixed" density="12" className="opacity-30" />
      <ScanlineEffect />

      <div className="relative z-10 py-12 px-4" style={{ background: 'rgba(255, 248, 240, 0.9)' }}>
        <div className="pixel-container">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <span className="text-6xl pixel-bounce inline-block">💕</span>
            </div>
            <h1 className="pixel-text-shadow gradient-text-animated pixel-font-heading text-4xl md:text-5xl font-bold mb-4">
              Your Matches
            </h1>
            <div className="pixel-divider max-w-md mx-auto mb-6"></div>
            <p className="pixel-font-body text-xl" style={{ color: '#2D3436' }}>
              Based on your compatibility, here are your top matches at Mapua!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Matches Grid */}
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockMatches.map((match) => (
                  <div
                    key={match.id}
                    className="pixel-card hover-lift pixel-shine-effect group cursor-pointer relative"
                    onClick={() => setSelectedMatch(match)}
                    style={{ animationDelay: `${match.rank * 0.1}s` }}
                  >
                    {/* Rank Badge */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 flex items-center justify-center text-white font-bold pixel-border-double z-10 pixel-font-heading"
                      style={{ background: '#FFD700' }}>
                      #{match.rank}
                    </div>

                    {/* Mutual Crush Badge */}
                    {match.isMutualCrush && (
                      <div className="absolute -top-4 -left-4 pixel-badge pixel-pulse">
                        💕 Mutual Crush!
                      </div>
                    )}

                    {/* Avatar */}
                    <div className="text-center mb-4">
                      <div className="text-6xl mb-2 pixel-bounce">{match.avatar}</div>
                    </div>

                    {/* Name & Info */}
                    <h3 className="pixel-font-heading text-xl font-bold mb-1 text-center" style={{ color: '#1976D2' }}>
                      {match.name}
                    </h3>
                    <p className="pixel-font-body text-sm text-center mb-4" style={{ color: '#636E72' }}>
                      {match.year} • {match.major}
                    </p>

                    {/* Compatibility Score */}
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="relative w-20 h-20">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke="#E5E7EB"
                            strokeWidth="8"
                            fill="none"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="36"
                            stroke={match.compatibility >= 80 ? '#22c55e' : match.compatibility >= 60 ? '#eab308' : '#ef4444'}
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 36}`}
                            strokeDashoffset={`${2 * Math.PI * 36 * (1 - match.compatibility / 100)}`}
                            strokeLinecap="square"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="pixel-font-heading text-2xl font-bold" style={{ color: '#D32F2F' }}>
                            {match.compatibility}%
                          </span>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="pixel-font-heading font-bold">Compatibility</div>
                        <div className="pixel-font-body text-xs" style={{ color: '#636E72' }}>
                          {match.compatibility >= 80 ? 'Excellent Match!' : match.compatibility >= 60 ? 'Great Match!' : 'Good Match!'}
                        </div>
                      </div>
                    </div>

                    {/* Shared Interests Preview */}
                    <div className="flex flex-wrap gap-1 justify-center mb-4">
                      {match.interests.slice(0, 3).map((interest) => (
                        <span key={interest} className="pixel-tag text-xs">
                          {interest}
                        </span>
                      ))}
                      {match.interests.length > 3 && (
                        <span className="pixel-font-body text-xs" style={{ color: '#636E72' }}>+{match.interests.length - 3}</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="pixel-btn pixel-btn-primary pixel-ripple flex-1 text-xs py-2">
                        View Profile
                      </button>
                      <button className="pixel-btn pixel-btn-secondary pixel-ripple flex-1 text-xs py-2">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Match Details Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                {selectedMatch ? (
                  <div className="pixel-card hover-lift">
                    <h2 className="pixel-font-heading text-2xl font-bold mb-4 text-center" style={{ color: '#D32F2F' }}>
                      ✨ Match Details
                    </h2>

                    {/* Avatar */}
                    <div className="text-center mb-4">
                      <div className="text-8xl pixel-bounce">{selectedMatch.avatar}</div>
                    </div>

                    {/* Name */}
                    <h3 className="pixel-font-heading text-2xl font-bold text-center mb-2" style={{ color: '#1976D2' }}>
                      {selectedMatch.name}
                    </h3>

                    {/* Info */}
                    <div className="space-y-2 mb-4 text-center text-sm">
                      <p className="pixel-font-body" style={{ color: '#636E72' }}>
                        📚 {selectedMatch.year} {selectedMatch.major}
                      </p>
                      <div className="flex justify-center items-center gap-2">
                        <span className="pixel-font-heading font-bold" style={{ color: '#D32F2F' }}>
                          {selectedMatch.compatibility}% Compatible
                        </span>
                      </div>
                      {selectedMatch.isMutualCrush && (
                        <div className="pixel-badge mx-auto">
                          💕 Mutual Crush!
                        </div>
                      )}
                    </div>

                    <div className="pixel-divider my-4"></div>

                    {/* Bio */}
                    <div className="mb-4">
                      <h4 className="pixel-font-heading font-bold mb-2">About</h4>
                      <p className="pixel-font-body text-sm leading-relaxed" style={{ color: '#2D3436' }}>
                        {selectedMatch.bio}
                      </p>
                    </div>

                    {/* Interests */}
                    <div className="mb-6">
                      <h4 className="pixel-font-heading font-bold mb-2">Interests</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMatch.interests.map((interest) => (
                          <span key={interest} className="pixel-tag">
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <button className="pixel-btn pixel-btn-primary pixel-ripple w-full">
                        💬 Send Message
                      </button>
                      <button className="pixel-btn pixel-btn-secondary pixel-ripple w-full">
                        📱 Contact Info
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pixel-card hover-lift text-center">
                    <div className="text-6xl mb-4 pixel-bounce">👆</div>
                    <h3 className="pixel-font-heading font-bold text-lg mb-2" style={{ color: '#1976D2' }}>
                      Select a Match
                    </h3>
                    <p className="pixel-font-body text-sm" style={{ color: '#636E72' }}>
                      Click on a match card to see their full profile
                    </p>
                  </div>
                )}

                {/* Tips Card */}
                <div className="pixel-card hover-lift mt-6" style={{ background: 'linear-gradient(135deg, #FFF8E7 0%, #FFE5D9 100%)' }}>
                  <h3 className="pixel-font-heading font-bold mb-3" style={{ color: '#1976D2' }}>
                    💡 Next Steps
                  </h3>
                  <ul className="space-y-2 pixel-font-body text-sm">
                    <li className="flex items-start gap-2">
                      <span>📖</span>
                      <span style={{ color: '#2D3436' }}>Read their profile carefully</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>💬</span>
                      <span style={{ color: '#2D3436' }}>Send a friendly message</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>🤝</span>
                      <span style={{ color: '#2D3436' }}>Be respectful and kind</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>💕</span>
                      <span style={{ color: '#2D3436' }}>Take your time getting to know them</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
