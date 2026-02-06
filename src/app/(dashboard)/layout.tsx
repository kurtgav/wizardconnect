// ============================================
// DASHBOARD LAYOUT - PREMIUM PIXEL ART
// ============================================

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut, user } = useAuth()

  const navItems = [
    { href: '/survey', label: '📝 Survey', icon: '📝' },
    { href: '/profile', label: '👤 Profile', icon: '👤' },
    { href: '/matches', label: '💕 Matches', icon: '💕' },
    { href: '/messages', label: '💬 Messages', icon: '💬' },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Navigation Bar */}
        <nav className="sticky top-0 z-50 border-b-4 border-gray-800" style={{ background: 'linear-gradient(135deg, #D32F2F 0%, #1976D2 100%)' }}>
          <div className="pixel-container">
            <div className="flex items-center justify-between py-4">
              {/* Logo */}
              <Link href="/survey" className="flex items-center gap-3 hover:scale-105 transition-transform">
                <div className="text-4xl pixel-bounce">🪄</div>
                <div>
                  <h1 className="pixel-font-heading text-xl font-bold text-white pixel-text-shadow">
                    Wizard Connect
                  </h1>
                  <p className="pixel-font-body text-xs text-white" style={{ opacity: 0.9 }}>
                    Mapua Valentine's Day Matchmaker
                  </p>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-4">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        pixel-btn px-4 py-2 text-sm transition-all
                        ${isActive
                          ? 'bg-white text-gray-900 scale-105'
                          : 'bg-transparent text-white hover:bg-white hover:text-gray-900'
                        }
                      `}
                    >
                      <span className="pixel-font-heading">{item.label}</span>
                    </Link>
                  )
                })}
                {/* Logout Button */}
                <button
                  onClick={handleSignOut}
                  className="pixel-btn px-4 py-2 text-sm bg-red-600 text-white hover:bg-red-700"
                >
                  🚪 Logout
                </button>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden flex items-center gap-2">
                <button
                  onClick={handleSignOut}
                  className="pixel-btn bg-white text-gray-900 px-3 py-2 text-xs"
                >
                  🚪
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden pb-4">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`
                        pixel-btn px-3 py-2 text-sm text-center transition-all
                        ${isActive
                          ? 'bg-white text-gray-900 scale-105'
                          : 'bg-transparent text-white hover:bg-white hover:text-gray-900'
                        }
                      `}
                    >
                      <span className="pixel-font-heading text-xs">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        {children}
      </div>
    </ProtectedRoute>
  )
}
