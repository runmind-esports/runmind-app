interface StatCardProps {
  number: string
  label: string
}

export function StatCard({ number, label }: StatCardProps) {
  return (
    <div className="bg-background rounded-xl border border-border p-6 text-center">
      <p className="text-2xl font-bold font-display text-accent">{number}</p>
      <p className="text-[13px] text-foreground-muted mt-2">{label}</p>
    </div>
  )
}
