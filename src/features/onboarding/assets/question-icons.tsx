'use client'

interface IconProps {
  className?: string
  size?: number
}

export function GoalIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Target rings */}
      <circle cx="28" cy="28" r="22" stroke="#14162E" strokeWidth="2.5" opacity="0.3" />
      <circle cx="28" cy="28" r="15" stroke="#14162E" strokeWidth="2.5" opacity="0.5" />
      <circle cx="28" cy="28" r="8" stroke="#00F048" strokeWidth="2.5" />
      <circle cx="28" cy="28" r="3" fill="#00F048" />
      {/* Arrow */}
      <line x1="40" y1="16" x2="30" y2="26" stroke="#14162E" strokeWidth="2" strokeLinecap="round" />
      <polyline points="36,14 42,14 42,20" stroke="#14162E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

export function FitnessIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Heart outline */}
      <path
        d="M28 44 C14 34 8 26 8 20 C8 14 12 10 18 10 C22 10 26 13 28 16 C30 13 34 10 38 10 C44 10 48 14 48 20 C48 26 42 34 28 44Z"
        stroke="#14162E"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Pulse line */}
      <polyline
        points="12,28 20,28 23,20 26,34 30,22 33,28 44,28"
        stroke="#00F048"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  )
}

export function RunningIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shoe sole */}
      <path
        d="M10 38 C10 38 12 44 20 44 L40 44 C44 44 46 42 46 40 L46 38 C46 36 44 34 42 34 L14 34 C12 34 10 36 10 38Z"
        fill="#14162E"
      />
      {/* Shoe upper */}
      <path
        d="M14 34 L14 26 C14 24 16 22 18 22 L34 22 C36 22 42 28 42 34Z"
        fill="#6B7088"
        opacity="0.3"
      />
      <path
        d="M14 34 L14 26 C14 24 16 22 18 22 L34 22 C36 22 42 28 42 34"
        stroke="#14162E"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* Lace detail */}
      <line x1="22" y1="26" x2="26" y2="30" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="24" x2="32" y2="28" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      {/* Sole tread */}
      <line x1="16" y1="42" x2="20" y2="42" stroke="#6B7088" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="42" x2="28" y2="42" stroke="#6B7088" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="32" y1="42" x2="36" y2="42" stroke="#6B7088" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function DaysIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Calendar body */}
      <rect x="8" y="14" width="40" height="34" rx="4" stroke="#14162E" strokeWidth="2.5" fill="none" />
      {/* Calendar top bar */}
      <rect x="8" y="14" width="40" height="10" rx="4" fill="#14162E" />
      {/* Calendar hooks */}
      <line x1="20" y1="10" x2="20" y2="18" stroke="#14162E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="10" x2="36" y2="18" stroke="#14162E" strokeWidth="2.5" strokeLinecap="round" />
      {/* Checkmarks */}
      <polyline points="16,32 19,35 24,29" stroke="#00F048" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="32,32 35,35 40,29" stroke="#00F048" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points="16,40 19,43 24,37" stroke="#00F048" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Empty checkbox */}
      <rect x="32" y="37" width="8" height="8" rx="1.5" stroke="#6B7088" strokeWidth="1.5" fill="none" opacity="0.4" />
    </svg>
  )
}

export function RacedIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Medal ribbon */}
      <path d="M20 8 L28 22 L36 8" stroke="#14162E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M20 8 L28 22" stroke="#00F048" strokeWidth="2.5" strokeLinecap="round" />
      {/* Medal circle */}
      <circle cx="28" cy="34" r="14" stroke="#14162E" strokeWidth="2.5" fill="none" />
      <circle cx="28" cy="34" r="10" stroke="#6B7088" strokeWidth="1.5" fill="none" opacity="0.4" />
      {/* Star in medal */}
      <path
        d="M28 26 L30 31 L35 31 L31 34.5 L32.5 39 L28 36 L23.5 39 L25 34.5 L21 31 L26 31Z"
        fill="#00F048"
      />
    </svg>
  )
}

export function PaceIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Stopwatch body */}
      <circle cx="28" cy="32" r="18" stroke="#14162E" strokeWidth="2.5" fill="none" />
      {/* Top button */}
      <rect x="25" y="8" width="6" height="6" rx="1.5" stroke="#14162E" strokeWidth="2" fill="none" />
      {/* Side button */}
      <line x1="42" y1="20" x2="46" y2="17" stroke="#14162E" strokeWidth="2" strokeLinecap="round" />
      {/* Clock hands */}
      <line x1="28" y1="32" x2="28" y2="22" stroke="#14162E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="28" y1="32" x2="36" y2="36" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      {/* Center dot */}
      <circle cx="28" cy="32" r="2" fill="#00F048" />
      {/* Tick marks */}
      <line x1="28" y1="16" x2="28" y2="18" stroke="#6B7088" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="44" y1="32" x2="42" y2="32" stroke="#6B7088" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="28" y1="48" x2="28" y2="46" stroke="#6B7088" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="32" x2="14" y2="32" stroke="#6B7088" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function ActivitiesIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Dumbbell left weight */}
      <rect x="8" y="22" width="8" height="14" rx="2" fill="#14162E" />
      {/* Dumbbell right weight */}
      <rect x="40" y="22" width="8" height="14" rx="2" fill="#14162E" />
      {/* Dumbbell bar */}
      <line x1="16" y1="29" x2="40" y2="29" stroke="#14162E" strokeWidth="3" strokeLinecap="round" />
      {/* Accent spark lines */}
      <line x1="24" y1="14" x2="24" y2="18" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="12" x2="28" y2="16" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="14" x2="32" y2="18" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      {/* Yoga mat hint */}
      <path
        d="M12 44 C18 40 38 40 44 44"
        stroke="#6B7088"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        opacity="0.4"
      />
    </svg>
  )
}

export function InjuryIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shield shape */}
      <path
        d="M28 6 L46 16 L46 30 C46 40 38 48 28 50 C18 48 10 40 10 30 L10 16Z"
        stroke="#14162E"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Inner shield fill */}
      <path
        d="M28 10 L42 18 L42 30 C42 38 36 44 28 46 C20 44 14 38 14 30 L14 18Z"
        fill="#14162E"
        opacity="0.06"
      />
      {/* Medical cross */}
      <rect x="24" y="20" width="8" height="20" rx="2" fill="#00F048" />
      <rect x="18" y="26" width="20" height="8" rx="2" fill="#00F048" />
    </svg>
  )
}

export function PreferenceIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Slider tracks */}
      <line x1="12" y1="16" x2="44" y2="16" stroke="#6B7088" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="12" y1="28" x2="44" y2="28" stroke="#6B7088" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <line x1="12" y1="40" x2="44" y2="40" stroke="#6B7088" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      {/* Active segments */}
      <line x1="12" y1="16" x2="32" y2="16" stroke="#14162E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="28" x2="22" y2="28" stroke="#14162E" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="40" x2="38" y2="40" stroke="#14162E" strokeWidth="2.5" strokeLinecap="round" />
      {/* Slider knobs */}
      <circle cx="32" cy="16" r="4" fill="#00F048" stroke="#14162E" strokeWidth="1.5" />
      <circle cx="22" cy="28" r="4" fill="#00F048" stroke="#14162E" strokeWidth="1.5" />
      <circle cx="38" cy="40" r="4" fill="#00F048" stroke="#14162E" strokeWidth="1.5" />
    </svg>
  )
}

export function StrengthIcon({ className, size = 56 }: IconProps) {
  return (
    <svg
      viewBox="0 0 56 56"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Flexed arm */}
      <path
        d="M14 40 C14 40 16 32 20 28 C24 24 26 20 28 16 C30 12 34 10 36 12 C38 14 36 18 34 22 C32 26 34 28 38 28 C42 28 44 26 44 24"
        stroke="#14162E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* Muscle bulge */}
      <path
        d="M26 20 C30 18 34 20 34 22"
        stroke="#14162E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Strength lines */}
      <line x1="40" y1="14" x2="44" y2="10" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      <line x1="44" y1="16" x2="48" y2="14" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      <line x1="42" y1="20" x2="46" y2="20" stroke="#00F048" strokeWidth="2" strokeLinecap="round" />
      {/* Wrist band */}
      <rect x="12" y="38" width="8" height="4" rx="2" fill="#6B7088" opacity="0.4" />
    </svg>
  )
}
