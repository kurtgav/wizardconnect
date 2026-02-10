'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  Edit2, Save, X, Mail, Phone, Instagram, Eye, EyeOff,
  Shield, Check, Heart, ChevronDown,
  Terminal, Zap, Star, Layout, Settings, Camera,
  Book, Info, Share2
} from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { useAuth } from '@/contexts/AuthContext'
import { useProfileUpdates } from '@/hooks/useProfileUpdates'
import type { User } from '@/types/api'

interface SelectOption {
  value: string
  label: string
  icon: LucideIcon | null
}

const YEAR_OPTIONS: SelectOption[] = [
  { value: 'Freshman (1st Year)', label: 'Freshman', icon: Star },
  { value: 'Sophomore (2nd Year)', label: 'Sophomore', icon: Star },
  { value: 'Junior (3rd Year)', label: 'Junior', icon: Star },
  { value: 'Senior (4th Year)', label: 'Senior', icon: Star },
  { value: 'Super Senior+', label: 'Super Senior+', icon: Star },
  { value: 'Graduate Student', label: 'Graduate', icon: Star },
]

const MAJOR_OPTIONS: string[] = [
  'BSCS', 'BSIT', 'BSIS', 'BSCE', 'BSEE', 'BSME', 'BSA', 'BSBA', 'BSHM', 'BSTM', 'BSPsych', 'BSBio', 'BSN'
]

export default function ProfilePage() {
  const { userProfile: contextProfile, loading: authLoading } = useAuth()
  const [selectOpenStates, setSelectOpenStates] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    instagram: '',
    phone: '',
    email: '',
    year: '',
    major: '',
    contactPreference: 'email' as 'email' | 'phone' | 'instagram',
    visibility: 'matches_only' as 'public' | 'matches_only' | 'private',
    gender: '' as 'male' | 'female' | 'non-binary' | 'prefer_not_to_say' | 'other' | '',
    genderPreference: 'both' as 'male' | 'female' | 'both',
    avatarUrl: '',
  })

  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Sync state with context
  useEffect(() => {
    if (contextProfile) {
      setProfile({
        firstName: contextProfile.first_name || '',
        lastName: contextProfile.last_name || '',
        bio: contextProfile.bio || '',
        instagram: contextProfile.instagram || '',
        phone: contextProfile.phone || '',
        email: contextProfile.email || '',
        year: contextProfile.year || '',
        major: contextProfile.major || '',
        contactPreference: contextProfile.contact_preference || 'email',
        visibility: contextProfile.visibility || 'matches_only',
        gender: contextProfile.gender || '',
        genderPreference: contextProfile.gender_preference || 'both',
        avatarUrl: contextProfile.avatar_url || '',
      })
      setLoading(false)
    } else if (!authLoading) {
      fetchUserProfile()
    }
  }, [contextProfile, authLoading])

  useProfileUpdates(async () => {
    const user = await apiClient.getProfile()
    setProfile({
      firstName: user.first_name || '',
      lastName: user.last_name || '',
      bio: user.bio || '',
      instagram: user.instagram || '',
      phone: user.phone || '',
      email: user.email || '',
      year: user.year || '',
      major: user.major || '',
      contactPreference: user.contact_preference || 'email',
      visibility: user.visibility || 'matches_only',
      gender: user.gender || '',
      genderPreference: user.gender_preference || 'both',
      avatarUrl: user.avatar_url || '',
    })
  })

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      const user = await apiClient.getProfile()
      setProfile({
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        bio: user.bio || '',
        instagram: user.instagram || '',
        phone: user.phone || '',
        email: user.email || '',
        year: user.year || '',
        major: user.major || '',
        contactPreference: user.contact_preference || 'email',
        visibility: user.visibility || 'matches_only',
        gender: user.gender || '',
        genderPreference: user.gender_preference || 'both',
        avatarUrl: user.avatar_url || '',
      })
    } catch (error) {
      console.error('Failed to load profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      let finalAvatarUrl = profile.avatarUrl

      if (selectedFile) {
        try {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          const fileExt = selectedFile.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `${fileName}`

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, selectedFile)

          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(filePath)

          finalAvatarUrl = publicUrl
          setProfile(prev => ({ ...prev, avatarUrl: publicUrl }))
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr)
          alert('Failed to upload profile picture.')
          setIsSaving(false)
          return
        }
      }

      const updateData: Partial<User> = {
        first_name: profile.firstName,
        last_name: profile.lastName,
        bio: profile.bio,
        instagram: profile.instagram,
        phone: profile.phone,
        year: profile.year,
        major: profile.major,
        avatar_url: finalAvatarUrl,
        contact_preference: profile.contactPreference,
        visibility: profile.visibility,
        gender: profile.gender || undefined,
        gender_preference: profile.genderPreference,
      }

      await apiClient.updateProfile(updateData)
      setSelectedFile(null)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save profile:', error)
      alert('Failed to save profile.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setProfile(prev => ({ ...prev, avatarUrl: url }))
    }
  }

  const getVisibilityInfo = (val: string) => {
    switch (val) {
      case 'public': return { label: 'PUBLIC_SERVER', icon: Eye, color: 'text-green-500', bg: 'bg-green-500/10' }
      case 'private': return { label: 'OFFLINE_MODE', icon: EyeOff, color: 'text-gray-500', bg: 'bg-gray-500/10' }
      default: return { label: 'GUILD_ONLY', icon: Shield, color: 'text-blue-500', bg: 'bg-blue-500/10' }
    }
  }

  const CustomSelect = ({ value, onChange, options, placeholder = 'Select...' }: { value: string, onChange: (val: string) => void, options: SelectOption[], placeholder?: string }) => {
    const isOpen = selectOpenStates[placeholder] || false
    const setIsOpen = (open: boolean) => setSelectOpenStates(prev => ({ ...prev, [placeholder]: open }))
    const selectedOption = options.find(opt => opt.value === value)
    const IconComponent = selectedOption?.icon

    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="pixel-input w-full flex items-center justify-between bg-white text-left h-12"
        >
          <div className="flex items-center gap-3 overflow-hidden">
            {IconComponent && <IconComponent className="w-4 h-4 text-[var(--retro-navy)] flex-shrink-0" />}
            <span className="pixel-font-body text-base text-[var(--retro-navy)] truncate uppercase">
              {selectedOption?.label || placeholder}
            </span>
          </div>
          <ChevronDown className={`w-4 h-4 text-[var(--retro-navy)] flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white border-4 border-[var(--retro-navy)] shadow-[8px_8px_0_rgba(0,0,0,0.2)] overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto custom-scrollbar">
                {options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 text-left
                      hover:bg-[var(--retro-blue)]/20 transition-colors
                      ${option.value === value ? 'bg-[var(--retro-yellow)]/30 border-l-4 border-[var(--retro-navy)]' : 'border-l-4 border-transparent'}
                    `}
                  >
                    {option.icon && <option.icon className="w-4 h-4 text-[var(--retro-navy)]" />}
                    <span className="pixel-font-body text-sm uppercase text-[var(--retro-navy)]">{option.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      <div className="pixel-spinner mb-4" />
      <p className="pixel-font text-[var(--retro-navy)] animate-pulse uppercase">Syncing character data...</p>
    </div>
  )

  const visibility = getVisibilityInfo(profile.visibility)

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 relative overflow-hidden">
      {/* Redesign: WIZARD_OS_2026 Window */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[var(--retro-white)] border-4 border-[var(--retro-navy)] shadow-[12px_12px_0_0_var(--retro-navy)] overflow-hidden"
      >
        {/* Title Bar */}
        <div className="bg-[var(--retro-navy)] p-3 flex items-center justify-between border-b-4 border-[var(--retro-navy)] relative">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-[var(--retro-yellow)] flex items-center justify-center border-2 border-[var(--retro-navy)]">
              <Terminal className="w-4 h-4 text-[var(--retro-navy)]" />
            </div>
            <span className="pixel-font text-white text-xs tracking-widest hidden md:inline">WIZARD_IDENTITY_SHEET_V1.0</span>
            <span className="pixel-font text-white text-xs tracking-widest md:hidden">WIZARD_SHEET</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-2 border-white/30 flex items-center justify-center cursor-not-allowed opacity-50">
              <div className="w-3 h-0.5 bg-white/30" />
            </div>
            <div className="w-6 h-6 border-2 border-white/30 flex items-center justify-center cursor-not-allowed opacity-50">
              <div className="w-3 h-3 border-2 border-white/30" />
            </div>
            <button onClick={() => isEditing ? setIsEditing(false) : null} className="w-6 h-6 bg-[var(--retro-red)] flex items-center justify-center border-2 border-[var(--retro-navy)] hover:bg-red-400 transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        <div className="p-1 bg-[var(--retro-yellow)] h-1 w-full animate-pulse" />

        {!isEditing ? (
          /* VIEW MODE */
          <div className="flex flex-col lg:flex-row divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-[var(--retro-navy)] bg-white min-h-[600px]">

            {/* Left Column: Personality & Avatar */}
            <div className="lg:w-80 flex-shrink-0 p-8 flex flex-col items-center bg-[#fdfdfd]">
              <div className="relative mb-8 group">
                <div className="w-48 h-48 border-4 border-[var(--retro-navy)] bg-[var(--retro-blue)]/10 shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] relative overflow-hidden">
                  {profile.avatarUrl ? (
                    <Image src={profile.avatarUrl} alt="Avatar" fill className="object-cover pixelated" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <PixelIcon name="smiley" size={80} className="text-[var(--retro-navy)] opacity-40 p-10" />
                    </div>
                  )}
                  {/* Decorative Scanlines */}
                  <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                </div>
                {/* Level Badge */}
                <div className="absolute -bottom-4 -right-4 bg-[var(--retro-yellow)] border-4 border-[var(--retro-navy)] px-4 py-2 shadow-lg">
                  <div className="pixel-font text-xs text-[var(--retro-navy)]">WIZARD</div>
                  <div className="pixel-font text-lg text-[var(--retro-navy)] font-bold">LVL99</div>
                </div>
              </div>

              <div className="w-full space-y-6">
                <div className="bg-[var(--retro-navy)] text-white p-3 border-2 border-[var(--retro-navy)] text-center relative">
                  <div className="pixel-font text-[10px] mb-1">SOCIAL_STATUS</div>
                  <div className="flex items-center justify-center gap-2">
                    <visibility.icon className={`w-4 h-4 ${visibility.color}`} />
                    <span className="pixel-font-body text-base uppercase">{visibility.label}</span>
                  </div>
                  <div className="absolute -top-1 -left-1 w-2 h-2 bg-[var(--retro-red)]" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-[var(--retro-red)]" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end mb-1">
                    <span className="pixel-font text-[10px] text-[var(--retro-navy)]">SOCIAL_ENERGY</span>
                    <span className="pixel-font text-[10px] text-[var(--retro-navy)]">MAX_HP</span>
                  </div>
                  <div className="h-6 w-full border-2 border-[var(--retro-navy)] p-1 bg-white shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: profile.bio ? '100%' : '30%' }}
                      className="h-full bg-[var(--retro-pink)] border-b-2 border-pink-600 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-[move-right_3s_linear_infinite]" style={{ backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.3) 75%)', backgroundSize: '20px 20px' }} />
                    </motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="border-2 border-[var(--retro-navy)] p-2 text-center bg-[var(--retro-blue)]/10 hover:bg-[var(--retro-blue)]/20 transition-colors">
                    <div className="pixel-font text-[8px] opacity-60">STR</div>
                    <div className="pixel-font text-base">{profile.firstName.length + profile.lastName.length}</div>
                  </div>
                  <div className="border-2 border-[var(--retro-navy)] p-2 text-center bg-[var(--retro-yellow)]/10 hover:bg-[var(--retro-yellow)]/20 transition-colors">
                    <div className="pixel-font text-[8px] opacity-60">INT</div>
                    <div className="pixel-font text-base">{profile.major ? '99' : '??'}</div>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-[var(--retro-navy)] text-white p-4 border-b-8 border-[var(--retro-navy)] border-t-0 border-x-0 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
                >
                  <Edit2 className="w-5 h-5 text-[var(--retro-yellow)]" />
                  <span className="pixel-font text-sm uppercase">EDIT_WIZARD</span>
                </button>
              </div>
            </div>

            {/* Right Column: Character Lore & Stats */}
            <div className="flex-1 p-8 md:p-12 space-y-10 group overflow-y-auto">

              {/* Header: Name */}
              <div className="space-y-4 text-center md:text-left">
                <div className="inline-block px-3 py-1 bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)] mb-2">
                  <span className="pixel-font text-[10px] text-[var(--retro-navy)]">PROFILE_ENTRY_LATEST</span>
                </div>
                <h1 className="pixel-font text-3xl md:text-6xl text-[var(--retro-navy)] leading-[1.1] uppercase tracking-tighter">
                  {profile.firstName} <span className="text-[var(--retro-pink)]">{profile.lastName}</span>
                </h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <div className="flex items-center gap-2 px-3 py-1 border-2 border-[var(--retro-navy)] bg-[var(--retro-blue)]/10">
                    <Book className="w-4 h-4 text-[var(--retro-navy)]" />
                    <span className="pixel-font-body text-lg font-bold uppercase">{profile.major || 'UNDECLARED'}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 border-2 border-[var(--retro-navy)] bg-[var(--retro-yellow)]/10">
                    <Star className="w-4 h-4 text-[var(--retro-navy)]" />
                    <span className="pixel-font-body text-lg font-bold uppercase">{profile.year || 'UNKNOWN_LEVEL'}</span>
                  </div>
                </div>
              </div>

              {/* Bio: Character Lore */}
              <div className="relative pt-8 p-6 border-4 border-[var(--retro-navy)] bg-white shadow-[8px_8px_0_0_var(--retro-blue)] group-hover:shadow-[8px_8px_0_0_var(--retro-pink)] transition-all">
                <div className="absolute -top-6 left-6 px-4 py-2 bg-white border-4 border-[var(--retro-navy)] shadow-[4px_4px_0_0_var(--retro-navy)]">
                  <span className="pixel-font text-xs text-[var(--retro-navy)] flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[var(--retro-yellow)] fill-[var(--retro-yellow)]" />
                    CHARACTER_LORE
                  </span>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--retro-navy)] opacity-20" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--retro-navy)] opacity-40" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--retro-navy)] opacity-60" />
                </div>
                <p className="pixel-font-body text-xl md:text-2xl text-[var(--retro-navy)] leading-relaxed italic opacity-90 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:text-[var(--retro-pink)]">
                  {profile.bio || "No backstory has been written for this wizard. Legend has it they are currently on a quest to update their profile."}
                </p>
                <div className="mt-6 flex justify-end">
                  <div className="bg-[var(--retro-navy)] w-12 h-1 animate-pulse" />
                </div>
              </div>

              {/* Stats Grid: Attributes & Equipment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Contact Attributes */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-[var(--retro-pink)]" />
                    <span className="pixel-font text-xs text-[var(--retro-navy)] opacity-70">CONTACT_LINKS</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border-2 border-[var(--retro-navy)] border-dashed hover:border-solid hover:bg-[var(--retro-yellow)]/5 transition-all group/stat">
                      <div className="w-10 h-10 bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)] flex items-center justify-center flex-shrink-0 group-hover/stat:rotate-6 transition-transform">
                        <Mail className="w-5 h-5 text-[var(--retro-navy)]" />
                      </div>
                      <div className="min-w-0">
                        <div className="pixel-font text-[8px] opacity-60 leading-none mb-1 uppercase tracking-widest">TRANSMISSION_ID</div>
                        <div className="pixel-font-body text-base font-bold truncate">{profile.email}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border-2 border-[var(--retro-navy)] border-dashed hover:border-solid hover:bg-[var(--retro-pink)]/5 transition-all group/stat">
                      <div className="w-10 h-10 bg-[var(--retro-pink)] border-2 border-[var(--retro-navy)] flex items-center justify-center flex-shrink-0 group-hover/stat:rotate-6 transition-transform">
                        <Instagram className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="pixel-font text-[8px] opacity-60 leading-none mb-1 uppercase tracking-widest">SOCIAL_HANDLE</div>
                        <div className="pixel-font-body text-base font-bold truncate">@{profile.instagram || 'NONE'}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 border-2 border-[var(--retro-navy)] border-dashed hover:border-solid hover:bg-[var(--retro-blue)]/5 transition-all group/stat">
                      <div className="w-10 h-10 bg-[var(--retro-blue)] border-2 border-[var(--retro-navy)] flex items-center justify-center flex-shrink-0 group-hover/stat:rotate-6 transition-transform">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <div className="pixel-font text-[8px] opacity-60 leading-none mb-1 uppercase tracking-widest">VOICE_CHANNEL</div>
                        <div className="pixel-font-body text-base font-bold truncate">{profile.phone || 'DISCONNECTED'}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preferences */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Layout className="w-4 h-4 text-[var(--retro-blue)]" />
                    <span className="pixel-font text-xs text-[var(--retro-navy)] opacity-70">WIZARD_PREFS</span>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-4 border-2 border-[var(--retro-navy)] bg-[#f9f9f9] relative">
                      <div className="pixel-font text-[8px] opacity-60 mb-2">IDENTIFIES_AS</div>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 border-2 border-[var(--retro-navy)] bg-[var(--retro-pink)]" />
                        <span className="pixel-font-body text-lg font-bold uppercase">{profile.gender || 'UNDEFINED'}</span>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-[var(--retro-navy)] bg-[#f9f9f9] relative">
                      <div className="pixel-font text-[8px] opacity-60 mb-2">SEEKING_ALIGNMENT</div>
                      <div className="flex items-center gap-3">
                        <Heart className="w-5 h-5 text-[var(--retro-red)] fill-[var(--retro-red)]" />
                        <span className="pixel-font-body text-lg font-bold uppercase">{profile.genderPreference === 'both' ? 'ANYONE' : profile.genderPreference}</span>
                      </div>
                    </div>
                    <div className="p-4 border-2 border-[var(--retro-navy)] bg-[#f9f9f9] relative overflow-hidden">
                      <div className="pixel-font text-[8px] opacity-60 mb-2">PREFERRED_CONTACT</div>
                      <span className="pixel-font text-xs text-[var(--retro-navy)] bg-[var(--retro-yellow)] px-2 py-1 border border-[var(--retro-navy)]">{profile.contactPreference}</span>
                      <Share2 className="absolute -bottom-2 -right-2 w-12 h-12 text-[var(--retro-navy)] opacity-5 rotate-12" />
                    </div>
                  </div>
                </div>

              </div>

              {/* Decorative Footer */}
              <div className="pt-6 border-t-2 border-dashed border-[var(--retro-navy)]/30 flex justify-between items-center opacity-40">
                <span className="pixel-font text-[8px]">ID: {profile.email.split('@')[0].toUpperCase()}</span>
                <span className="pixel-font text-[8px]">© 2026 WIZARD_CONNECT_CORP</span>
              </div>
            </div>
          </div>
        ) : (
          /* EDIT MODE */
          <div className="flex flex-col lg:flex-row divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-[var(--retro-navy)] bg-white min-h-[600px] animate-in fade-in duration-300">
            {/* Left: Avatar Picker */}
            <div className="lg:w-80 p-8 flex flex-col items-center gap-6 bg-[#fdfdfd]">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-48 h-48 border-4 border-[var(--retro-navy)] bg-[var(--retro-blue)]/20 relative overflow-hidden">
                  {profile.avatarUrl ? (
                    <Image src={profile.avatarUrl} alt="Preview" fill className="object-cover pixelated" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-12">
                      <PixelIcon name="smiley" size={60} className="text-[var(--retro-navy)] opacity-40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)] px-4 py-1 text-[8px] pixel-font whitespace-nowrap shadow-md">
                  REPLACE_MODULE
                </div>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

              <div className="w-full p-4 border-2 border-[var(--retro-navy)] bg-[var(--retro-pink)]/10">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-4 h-4 text-[var(--retro-navy)]" />
                  <span className="pixel-font text-[10px] text-[var(--retro-navy)] font-bold">SYSTEM_SECURITY</span>
                </div>
                <div className="space-y-3">
                  {[
                    { val: 'public', label: 'PUBLIC', icon: Eye, color: 'text-green-600' },
                    { val: 'matches_only', label: 'GUILD', icon: Shield, color: 'text-blue-600' },
                    { val: 'private', label: 'OFFLINE', icon: EyeOff, color: 'text-gray-500' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() => setProfile({ ...profile, visibility: opt.val as "public" | "matches_only" | "private" })}
                      className={`w-full p-3 border-2 flex items-center gap-3 transition-all ${profile.visibility === opt.val ? 'bg-[var(--retro-yellow)] border-[var(--retro-navy)] shadow-[4px_4px_0_0_rgba(0,0,0,0.1)]' : 'bg-white border-[var(--retro-navy)] opacity-60 hover:opacity-100'}`}
                    >
                      <opt.icon className={`w-4 h-4 ${opt.color}`} />
                      <span className="pixel-font text-[10px]">{opt.label}</span>
                      {profile.visibility === opt.val && <Check className="w-3 h-3 ml-auto text-[var(--retro-navy)]" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <p className="pixel-font-body text-xs text-gray-500 max-w-[200px]">Ensure your alignment settings are correct before deployment.</p>
              </div>
            </div>

            {/* Right: Input Fields */}
            <div className="flex-1 p-8 md:p-12 space-y-8 overflow-y-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-10 h-10 bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)] flex items-center justify-center">
                  <Settings className="w-6 h-6 text-[var(--retro-navy)]" />
                </div>
                <h2 className="pixel-font text-xl text-[var(--retro-navy)] uppercase tracking-tight">Configuration_Manager</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="pixel-font text-[10px] text-[var(--retro-navy)] ml-1">IDENTITY_PREFIX</label>
                  <input
                    type="text"
                    value={profile.firstName}
                    onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    className="pixel-input w-full h-12 uppercase"
                    placeholder="FIRST_NAME"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="pixel-font text-[10px] text-[var(--retro-navy)] ml-1">IDENTITY_SUFFIX</label>
                  <input
                    type="text"
                    value={profile.lastName}
                    onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    className="pixel-input w-full h-12 uppercase"
                    placeholder="LAST_NAME"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="pixel-font text-[10px] text-[var(--retro-navy)] ml-1">ACADEMIC_LEVEL</label>
                  <CustomSelect
                    value={profile.year}
                    onChange={(val) => setProfile({ ...profile, year: val })}
                    options={YEAR_OPTIONS}
                    placeholder="SELECT_YEAR"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="pixel-font text-[10px] text-[var(--retro-navy)] ml-1">CORE_MAJOR</label>
                  <div className="relative">
                    <input
                      list="majors"
                      type="text"
                      value={profile.major}
                      onChange={(e) => setProfile({ ...profile, major: e.target.value })}
                      className="pixel-input w-full h-12 uppercase"
                      placeholder="SELECT_MAJOR"
                    />
                    <datalist id="majors">
                      {MAJOR_OPTIONS.map(m => <option key={m} value={m} />)}
                    </datalist>
                    <Book className="absolute right-3 top-3.5 w-5 h-5 text-[var(--retro-navy)] opacity-30 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="pixel-font text-[10px] text-[var(--retro-navy)]">CHARACTER_BACKSTORY</label>
                  <span className="pixel-font text-[8px] opacity-40">{profile.bio.length}/500</span>
                </div>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  className="pixel-input w-full h-32 resize-none pt-4"
                  maxLength={500}
                  placeholder="ENTER_YOUR_TALE_HERE..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="pixel-font text-[10px] text-[var(--retro-navy)] ml-1">SOCIAL_HUB</label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3.5 w-5 h-5 text-[var(--retro-navy)] opacity-30" />
                    <input
                      type="text"
                      value={profile.instagram}
                      onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                      className="pixel-input w-full h-1 pl-10"
                      placeholder="@USERNAME"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="pixel-font text-[10px] text-[var(--retro-navy)] ml-1">VOICE_CHANNEL</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-[var(--retro-navy)] opacity-30" />
                    <input
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pixel-input w-full h-12 pl-10"
                      placeholder="+63 000 000 0000"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t-2 border-dashed border-[var(--retro-navy)]/20">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-[var(--retro-yellow)] text-[var(--retro-navy)] h-14 border-4 border-[var(--retro-navy)] shadow-[6px_6px_0_0_var(--retro-navy)] hover:shadow-[2px_2px_0_0_var(--retro-navy)] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[var(--retro-navy)] animate-bounce" />
                      <div className="w-2 h-2 bg-[var(--retro-navy)] animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-[var(--retro-navy)] animate-bounce [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span className="pixel-font text-sm uppercase">DEPLOY_PROFILE</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-white text-[var(--retro-navy)] h-14 border-4 border-[var(--retro-navy)] shadow-[6px_6px_0_0_#999] hover:shadow-[2px_2px_0_0_#999] hover:translate-x-1 hover:translate-y-1 active:shadow-none active:translate-x-1.5 active:translate-y-1.5 transition-all flex items-center justify-center uppercase pixel-font text-sm"
                >
                  DISCARD_CHANGES
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Background Decorative Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 opacity-5">
        <div className="absolute top-10 right-10 w-96 h-96 border-8 border-[var(--retro-navy)] rotate-12" />
        <div className="absolute bottom-20 left-10 w-64 h-64 border-8 border-[var(--retro-pink)] -rotate-12" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://www.transparenttextures.com/patterns/p6.png')] opacity-20" />
      </div>

      <style jsx global>{`
        @keyframes move-right {
          from { background-position: 0 0; }
          to { background-position: 40px 0; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--retro-navy);
        }
        .pixelated {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  )
}
