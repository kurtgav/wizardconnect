'use client'

import { useState } from 'react'
import { PixelIcon, PixelIconName } from '@/components/ui/PixelIcon'

// Mock data for matches
const mockMatches = [
  {
    id: '1',
    name: 'Player One',
    year: '3rd Year',
    major: 'Computer Science',
    compatibility: 92,
    rank: 1,
    isMutualCrush: true,
    bio: 'Looking for a duo partner for life and ranking up together.',
    interests: ['Gaming', 'Coding', 'Coffee'],
    avatar: 'smiley' as PixelIconName,
  },
  {
    id: '2',
    name: 'Pixel Artist',
    year: '2nd Year',
    major: 'Multimedia Arts',
    compatibility: 88,
    rank: 2,
    isMutualCrush: false,
    bio: 'I draw things and aesthetics. Let\'s make something cool.',
    interests: ['Art', 'Design', 'Music'],
    avatar: 'smiley' as PixelIconName,
  },
  {
    id: '3',
    name: 'Tech Wizard',
    year: '4th Year',
    major: 'IT',
    compatibility: 85,
    rank: 3,
    isMutualCrush: false,
    bio: 'System.out.println("Hello World")',
    interests: ['Tech', 'Gadgets', 'Sci-Fi'],
    avatar: 'smiley' as PixelIconName,
  },
]

export default function MatchesPage() {
  const [selectedMatch, setSelectedMatch] = useState<typeof mockMatches[0] | null>(null)

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="pixel-font text-3xl md:text-5xl font-bold mb-4 text-[var(--retro-navy)] uppercase tracking-tighter">
          Match <span className="text-[var(--retro-red)]">Results</span>
        </h1>
        <div className="inline-block bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)] px-4 py-1 transform rotate-2">
          <p className="pixel-font-body font-bold text-[var(--retro-navy)]">
            COMPATIBILITY FOUND
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMatches.map((match) => (
          <div key={match.id} className="pixel-card hover:translate-y-[-4px] transition-transform">
            {/* Rank Badge */}
            <div className="absolute -top-3 -right-3 w-10 h-10 bg-[var(--retro-navy)] text-white flex items-center justify-center border-2 border-white pixel-font text-xs">
              #{match.rank}
            </div>

            {/* Content */}
            <div className="flex flex-col items-center mb-4">
              <div className="w-24 h-24 bg-[var(--retro-cream)] border-4 border-[var(--retro-navy)] mb-4 flex items-center justify-center">
                <PixelIcon name={match.avatar} size={48} />
              </div>
              <h3 className="pixel-font text-lg text-[var(--retro-navy)]">{match.name}</h3>
              <p className="pixel-font-body text-sm text-[var(--text-secondary)]">{match.major}</p>
            </div>

            {/* Stats */}
            <div className="bg-[var(--retro-cream)] border-2 border-[var(--retro-navy)] p-3 mb-4 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--retro-navy)] pixel-font">
                <span>SYNC RATE</span>
                <span>{match.compatibility}%</span>
              </div>
              <div className="h-4 bg-white border-2 border-[var(--retro-navy)] relative">
                <div
                  className="absolute top-0 left-0 bottom-0 bg-[var(--retro-red)]"
                  style={{ width: `${match.compatibility}%` }}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button className="pixel-btn pixel-btn-primary text-xs py-2">
                Message
              </button>
              <button className="pixel-btn pixel-btn-secondary text-xs py-2">
                Profile
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
