// ============================================
// FOOTER COMPONENT - ENHANCED PIXEL ART
// ============================================

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-4 text-center" style={{ background: '#1A1A2E', color: '#FFFFFF' }}>
      <div className="pixel-container">
        {/* Main Footer Card */}
        <div className="pixel-card mb-8" style={{ background: '#2D3436', border: '4px solid #FFD93D' }}>
          {/* Logo */}
          <div className="mb-6">
            <div className="text-6xl mb-3">🪄</div>
            <h3 className="pixel-text-shadow pixel-font-heading text-2xl md:text-3xl font-bold mb-2" style={{ color: '#FFD93D' }}>
              Wizard Connect
            </h3>
            <div className="pixel-divider opacity-50"></div>
          </div>

          <p className="pixel-font-body text-base mb-6" style={{ color: '#DFE6E9' }}>
            Mapua Malayan Colleges Laguna's Official Valentine's Day Matchmaking Platform
          </p>

          {/* Navigation Links */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <a href="#" className="pixel-tag pixel-font-heading text-xs">
              📖 About
            </a>
            <a href="#" className="pixel-tag pixel-font-heading text-xs">
              ❓ FAQ
            </a>
            <a href="#" className="pixel-tag pixel-font-heading text-xs">
              📧 Contact
            </a>
            <a href="#" className="pixel-tag pixel-font-heading text-xs">
              🔒 Privacy
            </a>
            <a href="#" className="pixel-tag pixel-font-heading text-xs">
              📜 Terms
            </a>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6 mb-6">
            <a href="#" className="pixel-border-thin p-3 bg-white hover:scale-110 transition-transform" style={{ color: '#D32F2F' }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" className="pixel-border-thin p-3 bg-white hover:scale-110 transition-transform" style={{ color: '#D32F2F' }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948.073-3.259 0-3.668-.014-4.948-.072-4.354-.2-6.782-2.618-6.979-6.98-.059-1.28-.073-1.689-.073-4.948 0-3.259.014-3.668.072-4.948.2-4.358 2.617-6.78 6.979-6.98 1.281-.059 1.69-.073 4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
            <a href="#" className="pixel-border-thin p-3 bg-white hover:scale-110 transition-transform" style={{ color: '#D32F2F' }}>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.952-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="pixel-divider mb-8" style={{ opacity: 0.3 }}></div>

        {/* Copyright */}
        <div className="text-sm" style={{ color: '#636E72' }}>
          <p className="pixel-font-body mb-2">
            Made with 💕 for Mapua Cardinals
          </p>
          <p className="pixel-font-body">
            © {currentYear} Wizard Connect. All rights reserved.
          </p>
          <p className="pixel-font-body mt-2" style={{ fontSize: '14px', opacity: 0.7 }}>
            Brought to you by Mapua Malayan Colleges Laguna
          </p>
        </div>

        {/* Mapua Colors Display */}
        <div className="mt-8 flex flex-wrap justify-center gap-6">
          <div className="flex items-center gap-3 pixel-border-thin p-3" style={{ background: '#2D3436' }}>
            <div className="w-8 h-8 border-2 border-white" style={{ background: 'linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%)' }}></div>
            <span className="pixel-font-heading text-xs">Mapua Red</span>
          </div>
          <div className="flex items-center gap-3 pixel-border-thin p-3" style={{ background: '#2D3436' }}>
            <div className="w-8 h-8 border-2 border-white" style={{ background: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)' }}></div>
            <span className="pixel-font-heading text-xs">Mapua Blue</span>
          </div>
          <div className="flex items-center gap-3 pixel-border-thin p-3" style={{ background: '#2D3436' }}>
            <div className="w-8 h-8 border-2 border-white" style={{ background: 'linear-gradient(135deg, #FFD93D 0%, #F5A623 100%)' }}></div>
            <span className="pixel-font-heading text-xs">Magic Gold</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
