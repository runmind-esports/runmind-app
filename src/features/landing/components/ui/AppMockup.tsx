'use client'

export function AppMockup() {
  return (
    <div className="rounded-2xl border border-border bg-background-secondary aspect-[4/3] p-6 flex flex-col justify-between">
      <div className="space-y-3">
        <div className="bg-background rounded-lg p-3 w-3/4 h-8" />
        <div className="bg-accent-dim rounded-lg p-3 w-2/3 h-8 ml-auto" />
        <div className="bg-background rounded-lg p-3 w-1/2 h-8" />
      </div>
      <div className="flex justify-center">
        <div className="bg-[#FC4C02]/20 rounded-full px-6 py-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-[#FC4C02]/40" />
          <div className="w-24 h-3 rounded bg-[#FC4C02]/30" />
        </div>
      </div>
    </div>
  )
}
