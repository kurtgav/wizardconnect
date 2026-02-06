import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  // Create a Supabase client with the cookie store
  const cookieStore = cookies()
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storage: {
          getItem: (key: string) => cookieStore.get(key)?.value,
          setItem: (key: string, value: string) => {
            cookieStore.set({ name: key, value, ...getCookieOptions() })
          },
          removeItem: (key: string) => {
            cookieStore.delete({ name: key, ...getCookieOptions() })
          },
        },
      },
    }
  )

  if (code) {
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/survey', requestUrl.origin))
}

function getCookieOptions() {
  return {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
  }
}
