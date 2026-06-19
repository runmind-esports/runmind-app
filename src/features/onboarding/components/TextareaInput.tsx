'use client'

interface TextareaInputProps {
  label: string
  placeholder: string
  value: string
  onChange: (next: string) => void
  maxLength?: number
}

export function TextareaInput({ label, placeholder, value, onChange, maxLength = 500 }: TextareaInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-[#14162E]">{label}</label>
      <textarea
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-xl bg-[#F5F6F7] border-[1.5px] border-[rgba(20,22,46,0.09)] px-4 py-3 text-[15px] text-[#14162E] placeholder:text-[#A8ADBE] resize-none focus:outline-none focus:border-[#00F048] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,240,72,0.15)] transition-all"
      />
      <span className="text-xs text-[#6B7088] self-end">
        {value.length} / {maxLength}
      </span>
    </div>
  )
}
