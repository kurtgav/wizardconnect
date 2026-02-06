'use client'

import { useState } from 'react'
import { PixelIcon, PixelIconName } from '@/components/ui/PixelIcon'

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
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="pixel-font text-3xl md:text-5xl font-bold mb-4 text-[var(--retro-navy)] uppercase tracking-tighter">
          Player <span className="text-[var(--retro-red)]">Profile</span>
        </h1>
        <div className="inline-block bg-[var(--retro-white)] border-2 border-[var(--retro-navy)] px-4 py-1 shadow-[4px_4px_0_0_var(--retro-navy)]">
          <p className="pixel-font-body font-bold text-[var(--retro-navy)]">
            CUSTOMIZE YOUR AVATAR
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Settings */}
        <div className="lg:col-span-1 space-y-8">
          {/* Avatar Card */}
          <div className="pixel-card text-center">
            <div className="w-32 h-32 mx-auto mb-6 bg-[var(--retro-blue)] border-4 border-[var(--retro-navy)] flex items-center justify-center relative shadow-[4px_4px_0_0_rgba(0,0,0,0.2)]">
              <PixelIcon name="smiley" size={64} className="text-white" />
              <div className="absolute -bottom-2 -right-2 bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)] p-1">
                <PixelIcon name="palette" size={16} />
              </div>
            </div>

            <h3 className="pixel-font text-sm mb-2 text-[var(--retro-navy)]">Profile Photo</h3>
            <button className="pixel-btn pixel-btn-secondary w-full text-xs">
              Upload New
            </button>
          </div>

          {/* Visibility Settings */}
          <div className="pixel-card bg-[var(--retro-pink)] text-[var(--retro-navy)]">
            <div className="flex items-center gap-2 mb-4 border-b-2 border-[var(--retro-navy)] pb-2">
              <PixelIcon name="lock" size={20} />
              <h3 className="pixel-font text-sm">Privacy Level</h3>
            </div>

            <div className="space-y-4">
              {[
                { val: 'public', label: 'Public Server', desc: 'Everyone can see' },
                { val: 'matches_only', label: 'Guild Only', desc: 'Matches only (Recommended)' },
                { val: 'private', label: 'Offline Mode', desc: 'No one can see' }
              ].map((option) => (
                <label key={option.val} className="flex items-start gap-3 cursor-pointer group">
                  <div className={`
                    w-6 h-6 border-2 border-[var(--retro-navy)] bg-white flex items-center justify-center
                    ${profile.visibility === option.val ? 'bg-[var(--retro-navy)]' : ''}
                  `}>
                    {profile.visibility === option.val && <div className="w-2 h-2 bg-white" />}
                  </div>
                  <input
                    type="radio"
                    name="visibility"
                    value={option.val}
                    checked={profile.visibility === option.val}
                    onChange={(e) => setProfile({ ...profile, visibility: e.target.value as any })}
                    className="hidden"
                  />
                  <div>
                    <span className="pixel-font text-xs block group-hover:underline">{option.label}</span>
                    <span className="pixel-font-body text-xs opacity-80">{option.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="pixel-card h-full">
            <div className="flex items-center gap-3 mb-6 border-b-4 border-[var(--retro-navy)] pb-4">
              <div className="p-2 bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)]">
                <PixelIcon name="sparkle" size={20} />
              </div>
              <h2 className="pixel-font text-lg text-[var(--retro-navy)]">
                Character Stats
              </h2>
            </div>

            <div className="space-y-6">
              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="pixel-font text-xs mb-2 block text-[var(--retro-navy)]">First Name</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="pixel-input w-full"
                    placeholder="PLAYER 1"
                  />
                </div>
                <div>
                  <label className="pixel-font text-xs mb-2 block text-[var(--retro-navy)]">Last Name</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="pixel-input w-full"
                    placeholder="ENTER NAME"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="pixel-font text-xs mb-2 block text-[var(--retro-navy)]">
                  Character Bio <span className="text-[var(--text-secondary)] pixel-font-body text-sm">(Max 500 XP)</span>
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="pixel-input w-full h-32 resize-none"
                  placeholder="Insert lore here..."
                  maxLength={500}
                />
              </div>

              {/* Social Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="pixel-font text-xs mb-2 block text-[var(--retro-navy)]">Instagram</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-[var(--text-secondary)]">@</span>
                    <input
                      type="text"
                      value={profile.instagram}
                      onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                      className="pixel-input w-full pl-8"
                      placeholder="username"
                    />
                  </div>
                </div>
                <div>
                  <label className="pixel-font text-xs mb-2 block text-[var(--retro-navy)]">Contact Method</label>
                  <select
                    value={profile.contactPreference}
                    onChange={(e) => setProfile({ ...profile, contactPreference: e.target.value as any })}
                    className="pixel-input w-full"
                  >
                    <option value="email">Email Scroll</option>
                    <option value="phone">Phone Signal</option>
                    <option value="instagram">DM Raven</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t-2 border-dashed border-[var(--retro-navy)] mt-6">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="pixel-btn flex-1 text-sm py-4"
                >
                  {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
                </button>
                <button className="pixel-btn pixel-btn-secondary flex-1 text-sm py-4">
                  PREVIEW CARD
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Support function for button content
function SelectedIcon(icon: PixelIconName, text: string) {
  return (
    <>
      <PixelIcon name={icon} size={16} /> {text}
    </>
  )
}

// Tip Item Component
function TipItem({ icon, text }: { icon: PixelIconName; text: string }) {
  return (
    <li className="flex items-start gap-2">
      <div className="flex-shrink-0 mt-0.5">
        <PixelIcon name={icon} size={16} />
      </div>
      <span style={{ color: '#34495E' }}>{text}</span>
    </li>
  )
}
