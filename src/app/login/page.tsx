'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ParallaxBackground, ScanlineEffect } from '@/components/effects/ParallaxBackground'
import { ParticleEffects } from '@/components/effects/ParticleEffects'

export default function LoginPage() {
  const router = useRouter()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        // After signup, user needs to verify email or will be signed in
      } else {
        await signIn(email, password)
      }
      router.push('/survey')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithGoogle()
      // OAuth will redirect automatically
    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative">
      <ParallaxBackground />
      <ParticleEffects type="stars" density="10" className="opacity-30" />
      <ScanlineEffect />

      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4" style={{ background: 'rgba(255, 248, 240, 0.9)' }}>
        <div className="pixel-container max-w-md w-full">
          <div className="text-center mb-8">
            <div className="mb-4">
              <span className="text-6xl pixel-bounce inline-block">🪄</span>
            </div>
            <h1 className="pixel-text-shadow gradient-text-animated pixel-font-heading text-3xl font-bold mb-2">
              Wizard Connect
            </h1>
            <p className="pixel-font-body text-sm" style={{ color: '#636E72' }}>
              {isSignUp ? 'Create your account' : 'Sign in to your account'}
            </p>
          </div>

          <div className="pixel-card hover-lift pixel-shine-effect">
            {/* Google Sign In */}
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="pixel-btn pixel-ripple w-full mb-4"
              style={{ background: '#DB4437', color: 'white' }}
            >
              📧 Continue with Google
            </button>

            <div className="pixel-divider my-4 opacity-50">
              <span className="px-2 pixel-font-body text-xs" style={{ color: '#636E72' }}>OR</span>
            </div>

            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="pixel-font-heading block font-bold mb-2 text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pixel-input w-full"
                  placeholder="you@mapua.edu.ph"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="pixel-font-heading block font-bold mb-2 text-sm">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pixel-input w-full"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  minLength={6}
                />
              </div>

              {error && (
                <div className="pixel-font-body text-xs p-3 border-2" style={{ borderColor: '#ef4444', background: '#fee2e2', color: '#dc2626' }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="pixel-btn pixel-btn-primary pixel-ripple w-full"
              >
                {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            {/* Toggle Sign In/Sign Up */}
            <div className="mt-6 text-center">
              <p className="pixel-font-body text-sm" style={{ color: '#636E72' }}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp)
                    setError('')
                  }}
                  className="ml-2 font-bold hover:underline"
                  style={{ color: '#1976D2' }}
                  disabled={loading}
                >
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="pixel-font-body text-xs" style={{ color: '#636E72' }}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
