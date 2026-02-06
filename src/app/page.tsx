import { Hero } from '@/components/ui/Hero'
import { Features } from '@/components/ui/Features'
import { HowItWorks } from '@/components/ui/HowItWorks'
import { Footer } from '@/components/ui/Footer'
import { ParallaxBackground, ScanlineEffect } from '@/components/effects/ParallaxBackground'
import { ParticleEffects, FloatingDecorations } from '@/components/effects/ParticleEffects'

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Premium Background Effects */}
      <ParallaxBackground />
      <ParticleEffects type="mixed" density="15" className="opacity-40" />
      <ScanlineEffect />

      {/* Floating Corner Decorations */}
      <FloatingDecorations />

      {/* Main Content */}
      <div className="relative z-10">
        <Hero />
        <Features />
        <HowItWorks />
        <Footer />
      </div>
    </main>
  )
}
