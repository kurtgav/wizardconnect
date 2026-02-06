// ============================================
// DASHBOARD LAYOUT - PIXEL CONCEPT DESIGN
// Dreamy vaporwave navigation with cute elements
// ============================================

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { PixelIcon, PixelIconName } from '@/components/ui/PixelIcon'


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const navItems: { href: string; label: string; icon: PixelIconName }[] = [
    { href: '/survey', label: 'Survey', icon: 'envelope' },
    { href: '/profile', label: 'Profile', icon: 'smiley' },
    { href: '/matches', label: 'Matches', icon: 'heart_solid' },
    { href: '/messages', label: 'Messages', icon: 'bubble' },
  ]

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Navigation Bar - Retro Brutalist Style */}
        <nav className="sticky top-0 z-50 bg-[var(--retro-white)] border-b-[4px] border-[var(--retro-navy)] px-4 py-3 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            {/* Logo */}
            <Link href="/survey" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 transition-transform group-hover:scale-110 group-hover:-rotate-6">
                <Image
                  src="/images/wizardconnect-logo.png"
                  alt="Wizard Connect"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="hidden md:block pixel-font text-[var(--retro-navy)] text-lg tracking-tight">
                Wizard<span className="text-[var(--retro-red)]">Match</span>
              </h1>
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
                      pixel-nav-item flex items-center gap-2
                      ${isActive
                        ? 'pixel-nav-active'
                        : 'text-[var(--text-secondary)] hover:text-[var(--retro-navy)] hover:translate-y-[-2px]'
                      }
                    `}
                  >
                    <PixelIcon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className="pixel-btn pixel-btn-secondary px-3 py-2 text-[10px]"
                title="Sign Out"
              >
                <PixelIcon name="lock" size={14} />
                <span className="ml-2 hidden sm:inline">EXIT</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Nav Bar - Bottom Fixed */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[var(--retro-white)] border-t-[4px] border-[var(--retro-navy)] z-50 pb-safe">
          <div className="grid grid-cols-4 gap-1 p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex flex-col items-center justify-center p-2 rounded-sm
                    ${isActive ? 'bg-[var(--retro-yellow)] border-2 border-[var(--retro-navy)]' : 'opacity-70'}
                  `}
                >
                  <PixelIcon name={item.icon} size={20} />
                  <span className="text-[8px] font-bold mt-1 uppercase font-[family-name:var(--font-press-start)]">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative p-4 mb-20 md:mb-0">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
