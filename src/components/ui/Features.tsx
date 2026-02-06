// ============================================
// FEATURES SECTION - ENHANCED PIXEL ART
// ============================================

export function Features() {
  const features = [
    {
      icon: '🎯',
      title: 'Smart Matching',
      description: 'Our advanced algorithm considers personality, values, interests, and lifestyle to find your most compatible matches.',
      color: '#D32F2F',
      bgColor: '#FFE5D9'
    },
    {
      icon: '💝',
      title: 'Crush List',
      description: 'Secretly submit up to 5 crushes. If it\'s mutual, you\'ll both get a compatibility boost!',
      color: '#1976D2',
      bgColor: '#E8F8F5'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your responses are confidential. Only your matches will see your profile information.',
      color: '#D32F2F',
      bgColor: '#FFF8E7'
    },
    {
      icon: '💬',
      title: 'Early Messaging',
      description: 'Get exclusive early access from Feb 11-13 to message your matches before the public reveal!',
      color: '#1976D2',
      bgColor: '#FFE5D9'
    },
    {
      icon: '🎓',
      title: 'Mapua Exclusive',
      description: 'Exclusively for Mapua Malayan Colleges Laguna students. Connect with your fellow Cardinals!',
      color: '#D32F2F',
      bgColor: '#E8F8F5'
    },
    {
      icon: '📱',
      title: 'Pixel Perfect UI',
      description: 'Beautiful retro pixel art interface optimized for all devices. Mobile-friendly!',
      color: '#1976D2',
      bgColor: '#FFF8E7'
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="pixel-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="pixel-text-shadow gradient-text-animated pixel-font-heading text-4xl md:text-6xl font-bold mb-4">
            Why Wizard Connect?
          </h2>
          <div className="pixel-divider max-w-md mx-auto" style={{ margin: '16px auto 24px' }}></div>
          <p className="pixel-font-body text-xl" style={{ color: '#2D3436', maxWidth: '600px', margin: '0 auto' }}>
            The most magical way to find your Valentine at Mapua!
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="pixel-card hover-lift group pixel-shine-effect"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon Container */}
              <div className="mb-4">
                <div className="text-7xl pixel-bounce" style={{ filter: 'drop-shadow(4px 4px 0 rgba(0,0,0,0.2))' }}>
                  {feature.icon}
                </div>
              </div>

              {/* Title */}
              <h3
                className="pixel-font-heading text-xl font-bold mb-4"
                style={{ color: feature.color }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="pixel-font-body leading-relaxed" style={{ color: '#2D3436' }}>
                {feature.description}
              </p>

              {/* Decorative Element */}
              <div className="mt-4 pixel-divider opacity-30"></div>
            </div>
          ))}
        </div>

        {/* Call to Action Banner */}
        <div className="mt-16 pixel-card hover-lift text-center" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%)' }}>
          <h3 className="pixel-text-shadow pixel-font-heading text-3xl font-bold mb-4 text-white">
            Ready to Find Your Match? 🪄
          </h3>
          <p className="pixel-font-body text-lg text-white mb-6" style={{ opacity: 0.95 }}>
            Join hundreds of Mapua students in the search for love this Valentine's Day!
          </p>
          <button className="pixel-btn pixel-font-heading pixel-ripple" style={{ background: '#FFFFFF', color: '#D32F2F' }}>
            💝 Get Started Now
          </button>
        </div>
      </div>
    </section>
  )
}
