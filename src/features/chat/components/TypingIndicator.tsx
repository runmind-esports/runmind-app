export function TypingIndicator() {
  return (
    <div className="flex items-center gap-3 py-2">
      {/* Green dots */}
      <div className="flex items-center gap-1">
        <span className="typing-dot h-2 w-2 rounded-full bg-[#00F048]" style={{ animationDelay: '0s' }} />
        <span className="typing-dot h-2 w-2 rounded-full bg-[#00F048]" style={{ animationDelay: '0.2s' }} />
        <span className="typing-dot h-2 w-2 rounded-full bg-[#00F048]" style={{ animationDelay: '0.4s' }} />
      </div>

      {/* Gray dots */}
      <div className="flex items-center gap-1">
        <span className="typing-dot h-2 w-2 rounded-full bg-foreground-muted/50" style={{ animationDelay: '0s' }} />
        <span className="typing-dot h-2 w-2 rounded-full bg-foreground-muted/50" style={{ animationDelay: '0.2s' }} />
        <span className="typing-dot h-2 w-2 rounded-full bg-foreground-muted/50" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}
