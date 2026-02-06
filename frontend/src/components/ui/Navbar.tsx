'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, Gamepad2 } from 'lucide-react'
import { PixelIcon } from '@/components/ui/PixelIcon'

export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '#features', label: 'Features' },
        { href: '#stats', label: 'Stats' },
        { href: '#how-it-works', label: 'How it Works' },
        { href: '#team', label: 'Team' },
    ]

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'py-3 bg-[var(--retro-white)]/90 backdrop-blur-md border-b-4 border-[var(--retro-navy)]'
                    : 'py-5 bg-transparent'
                    }`}
            >
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="relative w-16 h-16 group-hover:scale-110 transition-transform">
                                <Image
                                    src="/images/wizardconnect-logo.png"
                                    alt="Wizard Connect Logo"
                                    fill
                                    className="object-contain drop-shadow-[2px_2px_0_rgba(44,62,80,0.5)]"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="pixel-font font-bold text-lg leading-tight text-[var(--retro-navy)]">
                                    WIZARD
                                </span>
                                <span className="pixel-font font-bold text-sm leading-tight text-[var(--retro-pink)]">
                                    CONNECT
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden md:flex items-center gap-8">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="pixel-font-body font-bold text-sm text-[var(--retro-navy)] hover:text-[var(--retro-blue)] hover:underline decoration-2 underline-offset-4 transition-colors relative group"
                                >
                                    {link.label}
                                    <span className="absolute -top-4 -right-4 opacity-0 group-hover:opacity-100 transition-opacity animate-bounce">
                                        <PixelIcon name="sparkle" size={12} />
                                    </span>
                                </Link>
                            ))}
                        </nav>

                        {/* CTA Buttons */}
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/login">
                                <button className="flex items-center gap-2 font-bold text-sm text-[var(--retro-navy)] hover:text-[var(--retro-pink)] transition-colors pixel-font">
                                    <User className="w-4 h-4" />
                                    Login
                                </button>
                            </Link>
                            <Link href="/login">
                                <button className="pixel-btn px-6 py-3 text-xs flex items-center gap-2 hover:scale-105 transition-transform -translate-y-1">
                                    <Gamepad2 className="w-4 h-4" />
                                    START GAME
                                </button>
                            </Link>
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden text-[var(--retro-navy)]"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-[var(--retro-white)]/95 backdrop-blur-xl pt-24 px-6 md:hidden">
                    <nav className="flex flex-col gap-6 text-center">
                        {navLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="pixel-font text-xl text-[var(--retro-navy)] hover:text-[var(--retro-pink)]"
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="h-px bg-[var(--retro-navy)]/20 my-2" />
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            <button className="w-full pixel-btn py-4 text-sm bg-[var(--retro-pink)] text-white">
                                LOGIN
                            </button>
                        </Link>
                    </nav>
                </div>
            )}
        </>
    )
}
