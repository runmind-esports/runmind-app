'use client'

export function WelcomeHeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="runner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#14162E" />
          <stop offset="100%" stopColor="#00F048" />
        </linearGradient>
        <linearGradient id="ground-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#14162E" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#00F048" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#14162E" stopOpacity="0.1" />
        </linearGradient>
      </defs>

      {/* Background circles - motion energy */}
      <circle cx="160" cy="120" r="90" fill="#14162E" opacity="0.04" />
      <circle cx="160" cy="120" r="65" fill="#00F048" opacity="0.06" />
      <circle cx="160" cy="120" r="40" fill="#14162E" opacity="0.04" />

      {/* Motion lines behind runner */}
      <line x1="60" y1="100" x2="100" y2="100" stroke="#6B7088" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="50" y1="120" x2="95" y2="120" stroke="#6B7088" strokeWidth="2.5" strokeLinecap="round" opacity="0.3" />
      <line x1="65" y1="140" x2="105" y2="140" stroke="#6B7088" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="55" y1="110" x2="90" y2="110" stroke="#00F048" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <line x1="70" y1="130" x2="100" y2="130" stroke="#00F048" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />

      {/* Runner silhouette - mid-stride */}
      {/* Head */}
      <circle cx="170" cy="72" r="14" fill="url(#runner-gradient)" />

      {/* Torso */}
      <path
        d="M170 86 L170 86 Q168 100 165 120 L175 120 Q172 100 170 86Z"
        fill="url(#runner-gradient)"
      />

      {/* Left arm (back swing) */}
      <path
        d="M168 92 L150 108 L148 104 L166 90Z"
        fill="#14162E"
        opacity="0.8"
      />

      {/* Right arm (forward swing) */}
      <path
        d="M172 92 L192 102 L190 106 L170 96Z"
        fill="url(#runner-gradient)"
      />

      {/* Left leg (extended back) */}
      <path
        d="M165 120 L140 160 L145 162 L167 124Z"
        fill="#14162E"
        opacity="0.8"
      />
      {/* Left foot */}
      <path
        d="M140 160 L132 162 L134 166 L145 162Z"
        fill="#14162E"
        opacity="0.8"
      />

      {/* Right leg (forward stride) */}
      <path
        d="M175 120 L198 158 L193 160 L172 124Z"
        fill="url(#runner-gradient)"
      />
      {/* Right foot */}
      <path
        d="M198 158 L206 156 L205 160 L193 160Z"
        fill="url(#runner-gradient)"
      />

      {/* Ground line */}
      <ellipse cx="170" cy="172" rx="80" ry="4" fill="url(#ground-gradient)" />

      {/* Accent dots - energy particles */}
      <circle cx="120" cy="85" r="3" fill="#00F048" opacity="0.5" />
      <circle cx="108" cy="105" r="2" fill="#00F048" opacity="0.4" />
      <circle cx="115" cy="145" r="2.5" fill="#00F048" opacity="0.3" />
      <circle cx="210" cy="95" r="2" fill="#00F048" opacity="0.4" />
      <circle cx="220" cy="130" r="3" fill="#00F048" opacity="0.3" />

      {/* Small speed indicators */}
      <rect x="85" y="98" width="8" height="2" rx="1" fill="#6B7088" opacity="0.3" />
      <rect x="78" y="118" width="12" height="2" rx="1" fill="#6B7088" opacity="0.25" />
      <rect x="88" y="138" width="10" height="2" rx="1" fill="#6B7088" opacity="0.3" />
    </svg>
  )
}
