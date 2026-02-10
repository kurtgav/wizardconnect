'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { Search, User, Heart, Sparkles, RefreshCcw, ArrowRight } from 'lucide-react'
import { ViewProfileModal } from './ViewProfileModal'
import { apiClient } from '@/lib/api-client'

export function AIMatchesTab() {
    const [users, setUsers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    // Data State
    const [males, setMales] = useState<any[]>([])
    const [females, setFemales] = useState<any[]>([])
    const [matchesMap, setMatchesMap] = useState<Record<string, any>>({})
    const [allMatches, setAllMatches] = useState<any[]>([])
    const [generating, setGenerating] = useState(false)
    const [activeCampaign, setActiveCampaign] = useState<any>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        const supabase = createClient()
        setLoading(true)

        try {
            // Parallel Fetch - Mix of Direct Supabase for real-time and API Client for logic
            const [usersRes, surveysRes, matchesRes, campaignsRes] = await Promise.all([
                supabase.from('users').select('*'),
                supabase.from('surveys').select('user_id, responses'),
                apiClient.adminGetMatches(),
                apiClient.adminGetCampaigns()
            ])

            // Process Gender
            const userGenderMap: Record<string, string> = {}
            surveysRes.data?.forEach((survey: any) => {
                if (survey.responses?.gender) {
                    userGenderMap[survey.user_id] = survey.responses.gender
                }
            })

            // Process Matches
            const matchData = matchesRes.matches || []
            setAllMatches(matchData)

            const matchMap: Record<string, any> = {}
            matchData.forEach((match: any) => {
                matchMap[match.user_id] = match
                matchMap[match.matched_user_id] = match
            })
            setMatchesMap(matchMap)

            // Split Users
            const maleList: any[] = []
            const femaleList: any[] = []

            usersRes.data?.forEach((user: any) => {
                const gender = userGenderMap[user.id]
                const userWithMatch = { ...user, match: matchMap[user.id] }

                if (gender === 'male') {
                    maleList.push(userWithMatch)
                } else {
                    femaleList.push(userWithMatch)
                }
            })

            // Set Campaigns
            const active = campaignsRes.find((c: any) => c.is_active)
            setActiveCampaign(active)

            setMales(maleList)
            setFemales(femaleList)
            setUsers(usersRes.data || [])
        } catch (error) {
            console.error('Failed to fetch AI match data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleGenerateMatches = async () => {
        if (!activeCampaign) {
            alert('No active campaign found to run algorithm on.')
            return
        }

        if (!confirm('This will run the matching algorithm for all participants. Existing matches will be recalculated. Continue?')) {
            return
        }

        try {
            setGenerating(true)
            await apiClient.adminRunMatchingAlgorithm(activeCampaign.id)
            alert('Matching algorithm started! Results will populate shortly.')
            // Refresh after a delay to allow algorithm to work
            setTimeout(fetchData, 3000)
        } catch (error) {
            console.error('Failed to generate matches:', error)
            alert('Failed to generate matches: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setGenerating(false)
        }
    }

    const filterUser = (user: any) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        return (
            user.first_name?.toLowerCase().includes(q) ||
            user.last_name?.toLowerCase().includes(q) ||
            user.email?.toLowerCase().includes(q)
        )
    }

    const renderUserCard = (user: any) => {
        const isMatched = !!user.match
        return (
            <div
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={`p-4 border-2 border-[#1E3A8A] cursor-pointer transition-all hover:-translate-y-1 shadow-[2px_2px_0_#1E3A8A] flex items-center justify-between ${isMatched ? 'bg-[#FFF0F5] border-pink-400' : 'bg-white hover:bg-blue-50'}`}
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-[#1E3A8A] flex items-center justify-center overflow-hidden bg-gray-100">
                        {user.avatar_url ? (
                            <img src={user.avatar_url} className="w-full h-full object-cover" />
                        ) : (
                            <PixelIcon name="smiley" size={24} />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-[#1E3A8A] text-sm">{user.first_name} {user.last_name}</p>
                        <p className="text-[10px] text-gray-500 truncate w-32">{user.email}</p>
                    </div>
                </div>
                {isMatched && (
                    <div className="text-pink-500">
                        <Heart size={16} fill="currentColor" />
                    </div>
                )}
            </div>
        )
    }

    if (loading) return <div className="p-12 text-center animate-pulse font-[family-name:var(--font-press-start)] text-xs text-[#1E3A8A]">LOADING MATCH DATA...</div>

    return (
        <div className="space-y-6">
            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border-2 border-[#1E3A8A] p-4 shadow-[4px_4px_0_#1E3A8A]">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Participants</p>
                    <p className="text-2xl font-black text-[#1E3A8A]">{users.length}</p>
                </div>
                <div className="bg-white border-2 border-[#1E3A8A] p-4 shadow-[4px_4px_0_#1E3A8A]">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Matches Made</p>
                    <p className="text-2xl font-black text-[#1E3A8A]">{allMatches.length}</p>
                </div>
                <div className="bg-white border-2 border-[#1E3A8A] p-4 shadow-[4px_4px_0_#1E3A8A]">
                    <p className="text-[10px] font-bold text-gray-500 uppercase">Avg. Compatibility</p>
                    <p className="text-2xl font-black text-[#1E3A8A]">
                        {allMatches.length > 0
                            ? Math.round(allMatches.reduce((acc, m) => acc + m.compatibility_score, 0) / allMatches.length)
                            : 0}%
                    </p>
                </div>
                <button
                    onClick={handleGenerateMatches}
                    disabled={generating || !activeCampaign}
                    className={`h-full border-4 border-[#1E3A8A] font-[family-name:var(--font-press-start)] text-[10px] shadow-[4px_4px_0_#1E3A8A] transition-all flex items-center justify-center gap-3
                        ${generating ? 'bg-gray-100 opacity-50' : 'bg-[#FFD700] hover:translate-y-1 hover:shadow-none active:scale-95'}
                    `}
                >
                    {generating ? (
                        <RefreshCcw className="w-4 h-4 animate-spin" />
                    ) : (
                        <Sparkles className="w-4 h-4" />
                    )}
                    {generating ? 'PROCESSING...' : 'GENERATE MATCHES'}
                </button>
            </div>

            {/* Search & Header */}
            <div className="flex justify-between items-center bg-white p-4 border-2 border-[#1E3A8A] shadow-[4px_4px_0_#1E3A8A]">
                <h2 className="text-lg font-black text-[#1E3A8A] flex items-center gap-2">
                    <PixelIcon name="potion" size={24} />
                    AI MATCH RESULTS
                </h2>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search profiles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-[#1E3A8A] font-[family-name:var(--font-vt323)] text-lg placeholder:text-gray-400 focus:outline-none focus:bg-blue-50"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Males Column */}
                <div className="space-y-4">
                    <div className="bg-[#E0F2FE] p-3 border-2 border-[#1E3A8A] text-center font-bold text-[#1E3A8A] shadow-[4px_4px_0_#1E3A8A] flex items-center justify-center gap-2">
                        <User size={16} />
                        MALES ({males.length})
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {males.filter(filterUser).map(renderUserCard)}
                    </div>
                </div>

                {/* Females Column */}
                <div className="space-y-4">
                    <div className="bg-[#FCE7F3] p-3 border-2 border-[#1E3A8A] text-center font-bold text-[#1E3A8A] shadow-[4px_4px_0_#1E3A8A] flex items-center justify-center gap-2">
                        <User size={16} />
                        FEMALES ({females.length})
                    </div>
                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {females.filter(filterUser).map(renderUserCard)}
                    </div>
                </div>

                {/* Matched Pairs Column */}
                <div className="space-y-4">
                    <div className="bg-[#FEF3C7] p-3 border-2 border-[#1E3A8A] text-center font-bold text-[#1E3A8A] shadow-[4px_4px_0_#1E3A8A] flex items-center justify-center gap-2">
                        <Heart size={16} className="text-pink-500" />
                        MATCHED PAIRS ({allMatches.length})
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {allMatches.length === 0 ? (
                            <div className="text-center py-10 bg-white border-2 border-dashed border-[#1E3A8A]/20">
                                <p className="text-[#1E3A8A] font-medium opacity-50">No matches found yet.</p>
                                <button
                                    onClick={handleGenerateMatches}
                                    className="mt-4 text-xs font-bold text-[#1E3A8A] underline hover:text-blue-600"
                                >
                                    Run Algorithm Now
                                </button>
                            </div>
                        ) : (
                            allMatches.map((match) => (
                                <div
                                    key={match.id}
                                    className="p-3 border-2 border-[#1E3A8A] bg-[#FDFCF0] shadow-[2px_2px_0_#1E3A8A] relative overflow-hidden group"
                                >
                                    <div className="absolute top-0 right-0 bg-[#1E3A8A] text-white text-[8px] px-2 py-0.5 font-bold uppercase tracking-widest">
                                        Score: {Math.round(match.compatibility_score)}%
                                    </div>
                                    <div className="flex items-center justify-between gap-2 mt-2">
                                        {/* User 1 */}
                                        <div className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-8 h-8 border border-[#1E3A8A] bg-white overflow-hidden">
                                                {match.user1_avatar_url ? (
                                                    <img src={match.user1_avatar_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <PixelIcon name="smiley" size={16} />
                                                )}
                                            </div>
                                            <p className="text-[9px] font-bold text-[#1E3A8A] truncate w-full text-center">
                                                {match.user1_first_name} {match.user1_last_name.charAt(0)}.
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center text-pink-500">
                                            <ArrowRight size={14} />
                                            <Heart size={10} fill="currentColor" />
                                        </div>

                                        {/* User 2 */}
                                        <div className="flex-1 flex flex-col items-center gap-1">
                                            <div className="w-8 h-8 border border-[#1E3A8A] bg-white overflow-hidden">
                                                {match.user2_avatar_url ? (
                                                    <img src={match.user2_avatar_url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <PixelIcon name="smiley" size={16} />
                                                )}
                                            </div>
                                            <p className="text-[9px] font-bold text-[#1E3A8A] truncate w-full text-center">
                                                {match.user2_first_name} {match.user2_last_name.charAt(0)}.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-[8px] text-gray-400 text-center font-mono italic">
                                        Matched at {new Date(match.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {!activeCampaign && (
                        <p className="text-[8px] text-red-500 font-bold text-center">⚠ NO ACTIVE CAMPAIGN DETECTED</p>
                    )}
                </div>
            </div>

            <ViewProfileModal
                userId={selectedUserId}
                isOpen={!!selectedUserId}
                onClose={() => setSelectedUserId(null)}
            />
        </div>
    )
}
