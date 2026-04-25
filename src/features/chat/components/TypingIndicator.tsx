export function TypingIndicator() {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex h-7 w-7 items-center justify-center">
        <svg className="animate-spin-slow h-5 w-5 text-accent" viewBox="0 0 24 24" fill="none">
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="12" y1="2" x2="12" y2="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              opacity={0.15 + (i * 0.1)}
              transform={`rotate(${i * 45} 12 12)`}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
