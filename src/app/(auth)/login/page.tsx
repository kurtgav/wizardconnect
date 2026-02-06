// ============================================
// LOGIN PAGE - GOOGLE OAUTH
// ============================================

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to Supabase auth
    // For now, we'll show the login page
    // In production, this would redirect to Supabase Google OAuth
  }, [router])

  const handleGoogleLogin = async () => {
    // TODO: Implement Supabase Google OAuth
    // This will be implemented after Supabase setup
    console.log('Google login clicked')
    alert('Authentication will be implemented after Supabase setup!')
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-4" style={{ background: '#FFF8F0' }}>
      <div className="pixel-container max-w-2xl mx-auto">
        <div className="pixel-card">
          {/* Pixel Art Wizard */}
          <div className="mb-8 flex justify-center">
            <div className="pixel-avatar w-40 h-40 pixel-bounce">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Wizard Hat */}
                <rect x="35" y="10" width="30" height="5" fill="#D32F2F" />
                <polygon points="50,0 30,15 70,15" fill="#1976D2" />
                <circle cx="50" cy="5" r="3" fill="#FFD700" />
                {/* Face */}
                <rect x="35" y="20" width="30" height="30" fill="#FFE4C4" />
                {/* Eyes */}
                <rect x="40" y="30" width="5" height="5" fill="#000" />
                <rect x="55" y="30" width="5" height="5" fill="#000" />
                {/* Smile */}
                <rect x="43" y="42" width="14" height="3" fill="#000" />
                {/* Beard */}
                <polygon points="35,50 65,50 50,80" fill="#E0E0E0" />
                {/* Robe */}
                <rect x="30" y="80" width="40" height="20" fill="#1976D2" />
                {/* Stars/Magic */}
                <polygon points="20,30 22,36 28,36 23,40 25,46 20,42 15,46 17,40 12,36 18,36" fill="#FFD700" />
                <polygon points="80,40 81,44 85,44 82,47 83,51 80,48 77,51 78,47 75,44 79,44" fill="#FFD700" />
              </svg>
            </div>
          </div>

          <h1 className="pixel-text-shadow text-4xl md:text-5xl font-bold mb-6 text-center" style={{ color: '#D32F2F' }}>
            Welcome to Wizard Connect
          </h1>

          <div className="pixel-badge mb-6 text-center" style={{ background: '#1976D2' }}>
            Mapua Malayan Colleges Laguna
          </div>

          <p className="text-center text-gray-700 mb-8 text-lg">
            Sign in with your Mapua student email to find your perfect match!
          </p>

          <div className="space-y-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full pixel-btn pixel-btn-primary pixel-glow text-center"
            >
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign in with Google
              </span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t-4 border-gray-800">
            <h3 className="font-bold mb-4 text-center" style={{ color: '#1976D2' }}>
              Why Sign Up?
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-2xl">✨</span>
                <span>Get matched with compatible Mapua students based on personality and interests</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">💕</span>
                <span>Submit your secret crush list and find out if they like you back</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🔒</span>
                <span>Your information is private and only shared with your matches</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-2xl">🎓</span>
                <span>Exclusively for Mapua Malayan Colleges Laguna students</span>
              </li>
            </ul>
          </div>

          <div className="mt-8 text-center">
            <a href="/" className="text-sm hover:underline" style={{ color: '#1976D2' }}>
              ← Back to Home
            </a>
          </div>
        </div>

        {/* Info Card */}
        <div className="pixel-card mt-8 bg-gray-100">
          <h4 className="font-bold mb-3" style={{ color: '#D32F2F' }}>
            📅 Important Dates
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Survey Opens:</span>
              <span className="font-bold">February 5, 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Survey Closes:</span>
              <span className="font-bold">February 10, 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Profile Updates:</span>
              <span className="font-bold">February 11-13, 2026</span>
            </div>
            <div className="flex justify-between">
              <span>Match Reveal:</span>
              <span className="font-bold" style={{ color: '#D32F2F' }}>
                February 14, 2026 💕
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
