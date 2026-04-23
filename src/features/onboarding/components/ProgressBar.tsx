'use client'

export function ProgressBar({ current, total }: { current: number; total: number }) {
  const percentage = (current / total) * 100

  return (
    <div className="mt-4">
      <div className="h-1 bg-[#F5F6F7] rounded-full w-full">
        <div
          className="h-1 bg-[#00F048] rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={current}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  )
}
