'use client'

import Link from 'next/link'
import Image from 'next/image'
import { PixelIcon } from '@/components/ui/PixelIcon'
import { motion } from 'framer-motion'

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 md:pt-0">

      {/* 1. Dynamic Background Layers */}
      <div className="absolute inset-0 z-0 bg-[#E6F3FF]" />

      {/* City Skyline Background Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/bg1.gif"
          alt="Pixel City Skyline"
          fill
          className="object-cover object-center"
          priority
          unoptimized
        />
      </div>

      {/* 3. Main Content Wrapper */}
      <div className="relative z-30 w-full max-w-7xl px-4 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

        {/* Left Column: Text Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#FF6B9D] border-3 border-[#2C3E50] shadow-[4px_4px_0_#2C3E50] px-4 py-2 rotate-[-2deg]"
          >
            <span className="pixel-font text-white text-xs md:text-sm tracking-widest">EST. 2026</span>
          </motion.div>

          {/* Headings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="pixel-font text-xl md:text-2xl mb-2 opacity-90 drop-shadow-md [4px_4px_0_#000000]" style={{ color: '#FF6B9D' }}>
              WELCOME TO
            </h2>
            <h1 className="pixel-font text-3xl md:text-5xl leading-tight drop-shadow-[4px_4px_0_#000000] [-webkit-text-stroke:2px_#000000]" style={{ color: '#FF6B9D' }}>
              WIZARD<br />CONNECT
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ delay: 0.6 }}
            className="max-w-xl space-y-6 font-mono text-[#000000] text-sm md:text-base leading-relaxed bg-white/90 p-6 border-2 border-[#2C3E50] rounded-lg shadow-[4px_4px_0_rgba(44,62,80,0.2)] backdrop-blur-sm"
          >
            <p className="font-bold">Are you tired of endless swiping?</p>
            <p>
              We bring the <span className="bg-[#E6F3FF] px-1 font-bold border-b-2 border-[#FF6B9D]">magic back to dating</span> at Mapua. Using our advanced algorithm (and a little bit of pixel dust), we calculate compatibility based on what truly matters: your values, personality, and interests.
            </p>
          </motion.div>

          {/* Stats / Waitlist */}
          <Link href="/login">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-4 p-4 rounded-xl border-2 border-[#2C3E50] cursor-pointer hover:scale-[1.02] transition-all group shadow-[4px_4px_0_#2C3E50]"
              style={{
                background: 'linear-gradient(90deg, #FFD1DC 0%, #FFB7C5 100%)'
              }}
            >
              <div className="flex -space-x-4">
                {[
                  '/images/vince.jpg',
                  '/images/adrian-developer.jpg',
                  '/images/kurt-founder.jpg',
                  '/images/nicole-pres.jpg'
                ].map((src, i) => (
                  <div key={i} className="relative w-10 h-10 rounded-full border-2 border-[#2C3E50] overflow-hidden group-hover:scale-110 transition-transform bg-[#2C3E50]" style={{ transitionDelay: `${i * 50}ms` }}>
                    <Image
                      src={src}
                      alt={`Member ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-col text-left">
                <span className="pixel-font text-xs md:text-sm text-[#2C3E50]">4+ Students</span>
                <span className="font-mono text-xs text-[#2C3E50] font-bold">Joined the waitlist</span>
              </div>
            </motion.div>
          </Link>

        </div>

        {/* Right Column: connection.exe Window */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="relative w-full max-w-sm mx-auto lg:mx-60"
        >
          <div className="bg-[#2C3E50] border-4 border-[#2C3E50] shadow-[12px_12px_0_rgba(44,62,80,0.4)] rounded-lg overflow-hidden">
            {/* Window Header */}
            <div className="bg-[#2C3E50] p-2 flex items-center justify-between border-b-2 border-white/10">
              <div className="flex items-center gap-2">
                <PixelIcon name="heart_solid" size={16} className="text-[#FF6B9D]" />
                <span className="font-mono text-white text-sm font-bold">connection.exe</span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF6B9D] border border-black/20" />
                <div className="w-3 h-3 rounded-full bg-[#FFFB96] border border-black/20" />
                <div className="w-3 h-3 rounded-full bg-[#9FF99F] border border-black/20" />
              </div>
            </div>

            {/* Window Content */}
            <div className="p-1 bg-[#2C3E50]">
              {/* Pink Arcade Container */}
              <div className="bg-[#FF90B3] p-4 rounded-t-lg relative overflow-hidden">
                {/* Main Image Area */}
                <div className="relative border-2 border-[#2C3E50] bg-white rounded-lg overflow-hidden shadow-[4px_4px_0_rgba(0,0,0,0.1)]">
                  <Image
                    src="/images/hero1.jpg"
                    alt="Hero1"
                    width={800}
                    height={1000}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                {/* Decorative Buttons */}
                <div className="mt-4 flex justify-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#FFE66D] border-2 border-[#2C3E50] shadow-[0_2px_0_rgba(0,0,0,0.2)]"></div>
                  <div className="w-8 h-8 rounded-full bg-[#9FF99F] border-2 border-[#2C3E50] shadow-[0_2px_0_rgba(0,0,0,0.2)]"></div>
                </div>
              </div>

              {/* Terminal Output */}
              <div className="bg-[#1A2634] p-4 text-xs md:text-sm font-mono leading-relaxed border-t-4 border-[#2C3E50]">
                <div className="space-y-1">
                  <p className="text-[#9FF99F] typing-effect-1">{'>'} Initializing matchmaking protocol...</p>
                  <p className="text-[#9FF99F] typing-effect-2">{'>'} Scanning Single Mapuans...</p>
                  <p className="text-[#FF6B9D] font-bold typing-effect-3">{'>'} MATCH FOUND! <span className="inline-block"><PixelIcon name="heart_solid" size={12} /></span></p>
                  <p className="text-[#9FF99F] animate-pulse">{'>'} Ready to pair. _</p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

