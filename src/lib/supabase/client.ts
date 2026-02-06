// ============================================
// SUPABASE CLIENT - BROWSER
// ============================================

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types'

export const createClient = () => {
  return createClientComponentClient<Database>()
}

// Singleton instance
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}
