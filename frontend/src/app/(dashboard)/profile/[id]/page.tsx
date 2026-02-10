'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    Mail, Instagram, Shield, Eye, EyeOff, MessageSquare,
    ChevronLeft, Book, Star, Zap, Info, Share2, Heart
} from 'lucide-react'
import Image from 'next/image'
import { apiClient } from '@/lib/api-client'
import { PixelIcon } from '@/components/ui/PixelIcon'
import type { User } from '@/types/api'

export default function PublicProfilePage() {
    const params = useParams()
    const router = useRouter()
    const [profile, setProfile] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (params.id) {
            fetchProfile(params.id as string)
        }
    }, [params.id])

    const fetchProfile = async (id: string) => {
        try {
            setLoading(true)
            const data = await apiClient.getUserProfileByID(id)
            setProfile(data)
        } catch (err) {
            console.error('Failed to fetch profile:', err)
            setError('User not found or profile is private.')
        } finally {
            setLoading(false)
        }
    }

    const handleMessage = async () => {
        if (!profile) return
        try {
            await apiClient.createConversation(profile.id)
            router.push('/messages')
        } catch (err) {
            console.error('Failed to start conversation:', err)
            alert('Failed to start conversation')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh]">
                <div className="pixel-spinner mb-4" />
                <p className="pixel-font text-[var(--retro-navy)] animate-pulse uppercase">Searching character archives...</p>
            </div>
        )
    }

    if (error || !profile) {
        return (
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
                <div className="pixel-card inline-block max-w-md bg-white border-4 border-[var(--retro-navy)] p-8 shadow-[8px_8px_0_0_var(--retro-navy)]">
                    <PixelIcon name="chick" size={48} className="mx-auto mb-4" />
                    <h2 className="pixel-font text-xl text-[var(--retro-navy)] mb-2 uppercase">ARCHIVE_ERROR</h2>
                    <p className="pixel-font-body text-gray-600 mb-6">{error || '404: WIZARD_NOT_FOUND'}</p>
                    <button
                        onClick={() => router.back()}
                        className="pixel-btn pixel-btn-secondary px-8 py-3"
                    >
                        GO BACK
                    </button>
                </div>
            </div>
        )
    }

    const getVisibilityInfo = (val: string) => {
        switch (val) {
            case 'public': return { label: 'PUBLIC_SERVER', icon: Eye, color: 'text-green-500' }
            case 'private': return { label: 'OFFLINE_MODE', icon: EyeOff, color: 'text-gray-500' }
            default: return { label: 'GUILD_ONLY', icon: Shield, color: 'text-blue-500' }
        }
    }

    const visibility = getVisibilityInfo(profile.visibility || 'matches_only')

    return (
        <div className="max-w-5xl mx-auto py-8 px-4">
            {/* Back Button */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                className="mb-6 flex items-center gap-3 text-[var(--retro-navy)] hover:text-[var(--retro-red)] transition-colors group"
            >
                <div className="bg-white border-2 border-[var(--retro-navy)] p-2 shadow-[2px_2px_0_0_var(--retro-navy)] group-hover:bg-[var(--retro-yellow)] transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                </div>
                <span className="pixel-font text-xs uppercase tracking-wider">EXIT_TO_WIZARD_LIST</span>
            </motion.button>

            {/* Profile Window */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border-4 border-[var(--retro-navy)] shadow-[12px_12px_0_0_var(--retro-navy)] overflow-hidden"
            >
                {/* Title Bar */}
                <div className="bg-[var(--retro-navy)] p-3 flex items-center justify-between border-b-4 border-[var(--retro-navy)]">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-[var(--retro-blue)] flex items-center justify-center border-2 border-[var(--retro-navy)]">
                            <Star className="w-4 h-4 text-white" />
                        </div>
                        <span className="pixel-font text-white text-xs tracking-widest uppercase">WIZARD_PROFILE_PREVIEW</span>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row divide-y-4 lg:divide-y-0 lg:divide-x-4 divide-[var(--retro-navy)]">

                    {/* Left Column */}
                    <div className="lg:w-80 flex-shrink-0 p-8 flex flex-col items-center bg-[#fdfdfd]">
                        <div className="relative mb-8">
                            <div className="w-48 h-48 border-4 border-[var(--retro-navy)] bg-white shadow-[8px_8px_0_0_rgba(0,0,0,0.1)] relative overflow-hidden">
                                {profile.avatar_url ? (
                                    <Image src={profile.avatar_url} alt="Avatar" fill className="object-cover pixelated" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-[var(--retro-blue)]/10">
                                        <PixelIcon name="smiley" size={80} className="text-[var(--retro-navy)] opacity-40" />
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-[var(--retro-yellow)] border-4 border-[var(--retro-navy)] px-4 py-2 shadow-lg">
                                <div className="pixel-font text-xs text-[var(--retro-navy)]">WIZARD</div>
                                <div className="pixel-font text-lg text-[var(--retro-navy)] font-bold">LVL??</div>
                            </div>
                        </div>

                        <div className="w-full space-y-6">
                            <div className="bg-[var(--retro-navy)] text-white p-3 border-2 border-[var(--retro-navy)] text-center relative">
                                <div className="pixel-font text-[10px] mb-1">SOCIAL_STATUS</div>
                                <div className="flex items-center justify-center gap-2">
                                    <visibility.icon className={`w-4 h-4 ${visibility.color}`} />
                                    <span className="pixel-font-body text-base uppercase">{visibility.label}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end mb-1">
                                    <span className="pixel-font text-[10px] text-[var(--retro-navy)]">AURA_LEVEL</span>
                                </div>
                                <div className="h-6 w-full border-2 border-[var(--retro-navy)] p-1 bg-white">
                                    <div className="h-full bg-[var(--retro-blue)] w-[85%] relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.3) 25%, rgba(255,255,255,0.3) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.3) 75%)', backgroundSize: '20px 20px' }} />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleMessage}
                                className="w-full bg-[var(--retro-pink)] text-white p-4 border-b-8 border-pink-800 border-x-0 border-t-0 active:border-b-0 active:translate-y-2 transition-all flex items-center justify-center gap-3"
                            >
                                <MessageSquare className="w-5 h-5 text-white" />
                                <span className="pixel-font text-sm uppercase">SEND_MESSAGE</span>
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex-1 p-8 md:p-12 space-y-10 group bg-white">
                        <div className="space-y-4 text-center md:text-left">
                            <div className="inline-block px-3 py-1 bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)] mb-2">
                                <span className="pixel-font text-[10px] text-[var(--retro-navy)]">ENCOUNTER_DATA</span>
                            </div>
                            <h1 className="pixel-font text-3xl md:text-6xl text-[var(--retro-navy)] leading-[1.1] uppercase tracking-tighter">
                                {profile.first_name} <span className="text-[var(--retro-blue)]">{profile.last_name}</span>
                            </h1>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <div className="flex items-center gap-2 px-3 py-1 border-2 border-[var(--retro-navy)] bg-[var(--retro-blue)]/10">
                                    <Book className="w-4 h-4 text-[var(--retro-navy)]" />
                                    <span className="pixel-font-body text-lg font-bold uppercase">{profile.major || 'MYSTIC_ARTS'}</span>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1 border-2 border-[var(--retro-navy)] bg-[var(--retro-yellow)]/10">
                                    <Star className="w-4 h-4 text-[var(--retro-navy)]" />
                                    <span className="pixel-font-body text-lg font-bold uppercase">{profile.year || 'YEAR_LEVEL_??'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="relative pt-8 p-6 border-4 border-[var(--retro-navy)] bg-white shadow-[8px_8px_0_0_var(--retro-blue)] transition-all">
                            <div className="absolute -top-6 left-6 px-4 py-2 bg-white border-4 border-[var(--retro-navy)] shadow-[4px_4px_0_0_var(--retro-navy)]">
                                <span className="pixel-font text-xs text-[var(--retro-navy)] flex items-center gap-2">
                                    <Zap className="w-4 h-4 text-[var(--retro-yellow)] fill-[var(--retro-yellow)]" />
                                    CHARACTER_LORE
                                </span>
                            </div>
                            <p className="pixel-font-body text-xl md:text-2xl text-[var(--retro-navy)] leading-relaxed italic opacity-90 first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:text-[var(--retro-blue)]">
                                {profile.bio || "Legend says this wizard is full of mysteries yet to be revealed."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Contact Attributes */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Share2 className="w-4 h-4 text-[var(--retro-pink)]" />
                                    <span className="pixel-font text-xs text-[var(--retro-navy)] opacity-70">CONTACT_MODULES</span>
                                </div>
                                <div className="space-y-3">
                                    {profile.instagram && (
                                        <div className="flex items-center gap-3 p-3 border-2 border-[var(--retro-navy)] border-dashed hover:border-solid hover:bg-[var(--retro-pink)]/5 transition-all">
                                            <div className="w-10 h-10 bg-[var(--retro-pink)] border-2 border-[var(--retro-navy)] flex items-center justify-center flex-shrink-0">
                                                <Instagram className="w-5 h-5 text-white" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="pixel-font text-[8px] opacity-60 leading-none mb-1 uppercase tracking-widest">SOCIAL_HANDLE</div>
                                                <div className="pixel-font-body text-base font-bold truncate">@{profile.instagram}</div>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-3 border-2 border-[var(--retro-navy)] border-dashed hover:border-solid hover:bg-[var(--retro-yellow)]/5 transition-all">
                                        <div className="w-10 h-10 bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)] flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-[var(--retro-navy)]" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="pixel-font text-[8px] opacity-60 leading-none mb-1 uppercase tracking-widest">TRANSMISSION_ID</div>
                                            <div className="pixel-font-body text-base font-bold truncate">{profile.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Preferences */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-[var(--retro-blue)]" />
                                    <span className="pixel-font text-xs text-[var(--retro-navy)] opacity-70">WIZARD_TRAITS</span>
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
                                            <span className="pixel-font-body text-lg font-bold uppercase">{profile.gender_preference === 'both' ? 'ANYONE' : profile.gender_preference || 'UNDEFINED'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t-2 border-dashed border-[var(--retro-navy)]/30 text-center opacity-40">
                            <span className="pixel-font text-[8px]">END_OF_RECORD_V1.0</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            <style jsx global>{`
                .pixelated {
                    image-rendering: pixelated;
                }
            `}</style>
        </div>
    )
}
