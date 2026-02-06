// ============================================
// PROFILE PAGE - PREMIUM PIXEL ART
// ============================================

'use client'

import { useState } from 'react'
import { ParallaxBackground, ScanlineEffect } from '@/components/effects/ParallaxBackground'
import { ParticleEffects } from '@/components/effects/ParticleEffects'

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    instagram: '',
    phone: '',
    contactPreference: 'email' as 'email' | 'phone' | 'instagram',
    visibility: 'matches_only' as 'public' | 'matches_only' | 'private',
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
      alert('Profile saved successfully!')
    }, 1500)
  }

  return (
    <main className="min-h-screen relative">
      {/* Premium Background Effects */}
      <ParallaxBackground />
      <ParticleEffects type="hearts" density="8" className="opacity-30" />
      <ScanlineEffect />

      <div className="relative z-10 py-12 px-4" style={{ background: 'rgba(255, 248, 240, 0.9)' }}>
        <div className="pixel-container max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <span className="text-6xl pixel-bounce inline-block">👤</span>
            </div>
            <h1 className="pixel-text-shadow gradient-text-animated pixel-font-heading text-4xl md:text-5xl font-bold mb-4">
              Your Profile
            </h1>
            <div className="pixel-divider max-w-md mx-auto mb-6"></div>
            <p className="pixel-font-body text-xl" style={{ color: '#2D3436' }}>
              Customize your profile that your matches will see
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Avatar Section */}
            <div className="lg:col-span-1">
              <div className="pixel-card hover-lift text-center">
                <div className="pixel-avatar w-32 h-32 mx-auto mb-4">
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
                  </svg>
                </div>
                <h3 className="pixel-font-heading font-bold text-lg mb-2" style={{ color: '#1976D2' }}>
                  Profile Photo
                </h3>
                <p className="pixel-font-body text-sm mb-4" style={{ color: '#636E72' }}>
                  Upload a photo to let your matches see you
                </p>
                <button className="pixel-btn pixel-btn-secondary pixel-ripple w-full">
                  Upload Photo
                </button>
              </div>

              {/* Visibility Settings */}
              <div className="pixel-card hover-lift mt-6">
                <h3 className="pixel-font-heading font-bold text-lg mb-4" style={{ color: '#D32F2F' }}>
                  🔒 Privacy Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={profile.visibility === 'public'}
                      onChange={(e) => setProfile({ ...profile, visibility: e.target.value as any })}
                      className="pixel-radio"
                    />
                    <span className="pixel-font-body text-sm group-hover:translate-x-1 transition-transform">
                      <strong>Public</strong> - Everyone can see your profile
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="visibility"
                      value="matches_only"
                      checked={profile.visibility === 'matches_only'}
                      onChange={(e) => setProfile({ ...profile, visibility: e.target.value as any })}
                      className="pixel-radio"
                    />
                    <span className="pixel-font-body text-sm group-hover:translate-x-1 transition-transform">
                      <strong>Matches Only</strong> - Only your matches can see
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={profile.visibility === 'private'}
                      onChange={(e) => setProfile({ ...profile, visibility: e.target.value as any })}
                      className="pixel-radio"
                    />
                    <span className="pixel-font-body text-sm group-hover:translate-x-1 transition-transform">
                      <strong>Private</strong> - No one can see (not recommended)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <div className="pixel-card hover-lift pixel-shine-effect">
                <h2 className="pixel-font-heading text-2xl font-bold mb-6" style={{ color: '#1976D2' }}>
                  ✨ Edit Profile
                </h2>

                <div className="space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="pixel-font-heading block font-bold mb-2">First Name</label>
                      <input
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        className="pixel-input w-full"
                        placeholder="Juan"
                      />
                    </div>
                    <div>
                      <label className="pixel-font-heading block font-bold mb-2">Last Name</label>
                      <input
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        className="pixel-input w-full"
                        placeholder="Dela Cruz"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="pixel-font-heading block font-bold mb-2">About Me</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="pixel-textarea w-full"
                      placeholder="Tell your matches about yourself... (max 500 characters)"
                      maxLength={500}
                      rows={5}
                    />
                    <p className="pixel-font-body text-xs mt-1" style={{ color: '#636E72' }}>
                      {profile.bio.length}/500 characters
                    </p>
                  </div>

                  {/* Contact Info */}
                  <div>
                    <label className="pixel-font-heading block font-bold mb-2">Instagram Handle</label>
                    <input
                      type="text"
                      value={profile.instagram}
                      onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                      className="pixel-input w-full"
                      placeholder="@username"
                    />
                  </div>

                  <div>
                    <label className="pixel-font-heading block font-bold mb-2">Phone Number (optional)</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pixel-input w-full"
                      placeholder="09XX XXX XXXX"
                    />
                  </div>

                  {/* Contact Preference */}
                  <div>
                    <label className="pixel-font-heading block font-bold mb-2">
                      Preferred Contact Method
                    </label>
                    <select
                      value={profile.contactPreference}
                      onChange={(e) => setProfile({ ...profile, contactPreference: e.target.value as any })}
                      className="pixel-select w-full"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Phone</option>
                      <option value="instagram">Instagram</option>
                    </select>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="pixel-btn pixel-btn-primary pixel-ripple flex-1 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : '💾 Save Profile'}
                    </button>
                    <button className="pixel-btn pixel-btn-secondary pixel-ripple">
                      Preview
                    </button>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="pixel-card hover-lift mt-6" style={{ background: 'linear-gradient(135deg, #E8F8F5 0%, #B2DFDB 100%)' }}>
                <h3 className="pixel-font-heading font-bold mb-3" style={{ color: '#1976D2' }}>
                  💡 Profile Tips
                </h3>
                <ul className="space-y-2 pixel-font-body text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-xl">📸</span>
                    <span style={{ color: '#2D3436' }}>Use a clear, friendly photo that shows your face</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">✍️</span>
                    <span style={{ color: '#2D3436' }}>Write a bio that reflects your personality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">🎯</span>
                    <span style={{ color: '#2D3436' }}>Mention your hobbies and interests</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-xl">💬</span>
                    <span style={{ color: '#2D3436' }}>Keep it positive and welcoming</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
