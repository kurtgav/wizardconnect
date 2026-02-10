'use client'

import { useState, useEffect } from 'react'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { Search, Heart, User, ArrowRight, Trash2 } from 'lucide-react'
import { apiClient } from '@/lib/api-client'
import { createClient } from '@/lib/supabase/client'

export function MatchTrackingTab() {
    const [matches, setMatches] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [userMap, setUserMap] = useState<Record<string, any>>({})

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const supabase = createClient()
            const [matchesRes, usersRes] = await Promise.all([
                apiClient.adminGetMatches(),
                supabase.from('users').select('*')
            ])

            const uMap: Record<string, any> = {}
            usersRes.data?.forEach(u => {
                uMap[u.id] = u
            })
            setUserMap(uMap)
            setMatches(matchesRes.matches || [])
        } catch (error) {
            console.error('Failed to fetch tracking data:', error)
        } finally {
            setLoading(false)
        }
    }

    const filterMatch = (match: any) => {
        if (!searchQuery) return true
        const q = searchQuery.toLowerCase()
        const user1 = userMap[match.user_id]
        const user2 = userMap[match.matched_user_id]

        return (
            user1?.first_name?.toLowerCase().includes(q) ||
            user1?.last_name?.toLowerCase().includes(q) ||
            user1?.email?.toLowerCase().includes(q) ||
            user2?.first_name?.toLowerCase().includes(q) ||
            user2?.last_name?.toLowerCase().includes(q) ||
            user2?.email?.toLowerCase().includes(q)
        )
    }

    if (loading) return <div className="p-12 text-center animate-pulse font-[family-name:var(--font-press-start)] text-xs text-[#1E3A8A]">SCANNING ARCHIVES...</div>

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border-2 border-[#1E3A8A] shadow-[4px_4px_0_#1E3A8A]">
                <h2 className="text-lg font-black text-[#1E3A8A] flex items-center gap-2">
                    <PixelIcon name="crystal" size={24} />
                    GLOBAL MATCH TRACKER
                </h2>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-[#1E3A8A] font-[family-name:var(--font-vt323)] text-lg placeholder:text-gray-400 focus:outline-none focus:bg-blue-50"
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
            </div>

            <div className="bg-white border-4 border-[#1E3A8A] shadow-[8px_8px_0_#1E3A8A] overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#1E3A8A] text-white font-[family-name:var(--font-press-start)] text-[10px]">
                            <th className="p-4 text-left">WIZARD 1</th>
                            <th className="p-4 text-center">CONNECTION</th>
                            <th className="p-4 text-left">WIZARD 2</th>
                            <th className="p-4 text-center">SCORE</th>
                            <th className="p-4 text-center">DATE</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y-2 divide-[#1E3A8A]/10">
                        {matches.filter(filterMatch).map((match) => {
                            const u1 = userMap[match.user_id]
                            const u2 = userMap[match.matched_user_id]

                            return (
                                <tr key={match.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 border border-[#1E3A8A] bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {u1?.avatar_url ? <img src={u1.avatar_url} className="w-full h-full object-cover" /> : <User size={14} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1E3A8A] text-sm">{u1?.first_name} {u1?.last_name}</p>
                                                <p className="text-[10px] text-gray-400">{u1?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <div className="flex items-center justify-center gap-2 text-pink-500">
                                            <Heart size={14} fill={match.is_mutual_crush ? "currentColor" : "none"} />
                                            <ArrowRight size={14} />
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 border border-[#1E3A8A] bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {u2?.avatar_url ? <img src={u2.avatar_url} className="w-full h-full object-cover" /> : <User size={14} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1E3A8A] text-sm">{u2?.first_name} {u2?.last_name}</p>
                                                <p className="text-[10px] text-gray-400">{u2?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 text-center">
                                        <span className={`px-2 py-1 border-2 border-[#1E3A8A] font-bold text-xs ${match.compatibility_score > 80 ? 'bg-[#98FB98]' : 'bg-white'}`}>
                                            {Math.round(match.compatibility_score)}%
                                        </span>
                                    </td>
                                    <td className="p-4 text-center text-[10px] font-mono text-gray-500">
                                        {new Date(match.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {matches.length === 0 && (
                    <div className="p-20 text-center opacity-40">
                        <PixelIcon name="crystal_empty" size={64} className="mx-auto mb-4" />
                        <p className="font-bold">No matches archived in the crystal ball yet.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
