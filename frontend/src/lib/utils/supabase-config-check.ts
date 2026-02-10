// ============================================
// SUPABASE CONFIG CHECK
// ============================================

export function checkSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

  console.group('🔧 Supabase Configuration Check')
  console.log('URL Set:', !!supabaseUrl)
  console.log('Anon Key Set:', !!supabaseAnonKey)

  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set!')
    return false
  }

  if (!supabaseAnonKey) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is not set!')
    return false
  }

  console.log('✅ Configuration looks good')
  console.groupEnd()

  return true
}

// Run on import
if (typeof window !== 'undefined') {
  checkSupabaseConfig()
}
