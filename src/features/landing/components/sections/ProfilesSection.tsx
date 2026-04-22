'use client'

import { useLanguage } from '@/features/landing/hooks/useLanguage'
import { SectionWrapper } from '../ui/SectionWrapper'
import { ProfileCard } from '../ui/ProfileCard'

export function ProfilesSection() {
  const { t } = useLanguage()

  return (
    <SectionWrapper id="profiles">
      <h2 className="text-2xl font-bold font-display leading-[1.2] text-center mb-12">
        {t.profiles.title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {t.profiles.items.map((profile, i) => (
          <ProfileCard key={i} emoji={profile.emoji} name={profile.name} stat={profile.stat} description={profile.description} />
        ))}
      </div>
    </SectionWrapper>
  )
}
