// ============================================
// HOW IT WORKS SECTION - ENHANCED PIXEL ART
// ============================================

export function HowItWorks() {
  const steps = [
    {
      step: '1',
      title: 'Sign Up with Google',
      description: 'Use your Mapua student email to create your account. Quick and secure authentication.',
      icon: '🔐',
      dates: 'Starting Feb 5',
      color: '#FF6B6B'
    },
    {
      step: '2',
      title: 'Complete the Survey',
      description: 'Answer fun questions about your personality, interests, values, and lifestyle. Takes ~15 minutes.',
      icon: '📝',
      dates: 'Feb 5-10',
      color: '#4ECDC4'
    },
    {
      step: '3',
      title: 'Submit Your Crush List',
      description: 'Anonymously list up to 5 people you\'re interested in. Mutual crushes get bonus points!',
      icon: '💕',
      dates: 'Feb 5-10',
      color: '#FFD93D'
    },
    {
      step: '4',
      title: 'Wait for Magic',
      description: 'Our algorithm runs overnight, analyzing compatibility using advanced matching techniques.',
      icon: '⚡',
      dates: 'Feb 10-11',
      color: '#FF6B6B'
    },
    {
      step: '5',
      title: 'Update Your Profile',
      description: 'Add photos, bio, and social links. Start chatting with your matches early!',
      icon: '✨',
      dates: 'Feb 11-13',
      color: '#4ECDC4'
    },
    {
      step: '6',
      title: 'Meet Your Matches',
      description: 'On Valentine\'s Day, discover your top 7 most compatible matches at Mapua!',
      icon: '💝',
      dates: 'Feb 14',
      color: '#D32F2F'
    }
  ]

  return (
    <section className="py-20 px-4" style={{ background: '#FFF8E7' }}>
      <div className="pixel-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="pixel-text-shadow gradient-text-animated pixel-font-heading text-4xl md:text-6xl font-bold mb-4">
            How It Works
          </h2>
          <div className="pixel-divider max-w-md mx-auto" style={{ margin: '16px auto 24px' }}></div>
          <p className="pixel-font-body text-xl" style={{ color: '#2D3436', maxWidth: '600px', margin: '0 auto' }}>
            Six simple steps to find your perfect match
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Step Number Badge */}
              <div className="absolute -top-4 -left-4 w-16 h-16 flex items-center justify-center text-white pixel-border-double z-10 pixel-font-heading"
                style={{ background: step.color }}>
                {step.step}
              </div>

              {/* Step Card */}
              <div className="pixel-card h-full pt-8 hover-lift pixel-shine-effect">
                {/* Icon */}
                <div className="text-6xl mb-4 pixel-bounce">
                  {step.icon}
                </div>

                {/* Date Badge */}
                <div className="pixel-badge mb-3" style={{ fontSize: '10px' }}>
                  {step.dates}
                </div>

                {/* Title */}
                <h3 className="pixel-font-heading text-lg font-bold mb-3" style={{ color: '#1976D2' }}>
                  {step.title}
                </h3>

                {/* Description */}
                <p className="pixel-font-body text-sm leading-relaxed" style={{ color: '#2D3436' }}>
                  {step.description}
                </p>

                {/* Arrow Indicator */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-6 top-1/2 transform -translate-y-1/2 z-20">
                    <div className="pixel-font-heading text-3xl">→</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Visualization */}
        <div className="pixel-card hover-lift" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF8E7 100%)' }}>
          <h3 className="pixel-font-heading text-2xl md:text-3xl font-bold mb-6 text-center" style={{ color: '#D32F2F' }}>
            📅 Important Dates
          </h3>

          <div className="space-y-4">
            {/* Feb 5 */}
            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="pixel-font-heading text-sm font-bold" style={{ color: '#D32F2F' }}>Feb 5</span>
              </div>
              <div className="flex-1 h-6 pixel-progress-container">
                <div className="pixel-progress-bar" style={{ width: '100%' }}></div>
              </div>
              <div className="flex-1 pixel-font-body text-sm">
                <strong>Survey Opens</strong>
              </div>
            </div>

            {/* Feb 10 */}
            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="pixel-font-heading text-sm font-bold" style={{ color: '#1976D2' }}>Feb 10</span>
              </div>
              <div className="flex-1 h-6 pixel-progress-container">
                <div className="pixel-progress-bar" style={{ width: '100%', background: 'repeating-linear-gradient(90deg, #1976D2, #1976D2 8px, #0D47A1 8px, #0D47A1 16px)' }}></div>
              </div>
              <div className="flex-1 pixel-font-body text-sm">
                <strong>Survey Closes (11:59 PM)</strong>
              </div>
            </div>

            {/* Feb 11 */}
            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="pixel-font-heading text-sm font-bold" style={{ color: '#FFD93D' }}>Feb 11</span>
              </div>
              <div className="flex-1 h-6 pixel-progress-container">
                <div className="pixel-progress-bar" style={{ width: '100%', background: 'repeating-linear-gradient(90deg, #FFD93D, #FFD93D 8px, #F5A623 8px, #F5A623 16px)' }}></div>
              </div>
              <div className="flex-1 pixel-font-body text-sm">
                <strong>Profile Updates & Messaging Begin</strong>
              </div>
            </div>

            {/* Feb 14 */}
            <div className="flex items-center gap-4">
              <div className="w-32 text-right">
                <span className="pixel-font-heading text-sm font-bold" style={{ color: '#FF6B6B' }}>Feb 14</span>
              </div>
              <div className="flex-1 h-6 pixel-progress-container">
                <div className="pixel-progress-bar" style={{ width: '100%', background: 'repeating-linear-gradient(90deg, #FF6B6B, #FF6B6B 8px, #C92A2A 8px, #C92A2A 16px)' }}></div>
              </div>
              <div className="flex-1 pixel-font-body text-sm">
                <strong>💕 Valentine's Day Match Reveal!</strong>
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="mt-6 pixel-divider opacity-50"></div>
        </div>
      </div>
    </section>
  )
}
