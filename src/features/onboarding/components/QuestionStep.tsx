'use client'

import { getTranslations } from '../i18n/translations'
import { OptionButton } from './OptionButton'
import { ScaleInput } from './ScaleInput'
import { YesNoInput } from './YesNoInput'
import { GoalIcon, FitnessIcon, RunningIcon, RacedIcon, PaceIcon, DaysIcon, ActivitiesIcon, InjuryIcon, PreferenceIcon, StrengthIcon } from '../assets'
import { cn } from '@/lib/utils'

interface QuestionConfig {
  key: string
  type: 'single-select' | 'scale' | 'yes-no' | 'yes-no-conditional'
  optionKeys?: string[]
}

export const QUESTIONS: QuestionConfig[] = [
  { key: 'goal', type: 'single-select', optionKeys: ['run5k', 'run10k', 'improve5k', 'improve10k'] },
  { key: 'fitness', type: 'scale' },
  { key: 'running', type: 'yes-no-conditional', optionKeys: ['upTo5', 'upTo10', '11to20', '21to30', 'over30'] },
  { key: 'raced', type: 'yes-no' },
  { key: 'pace', type: 'single-select', optionKeys: ['dontKnow', 'above7', '6to7', '5to6', 'below5'] },
  { key: 'days', type: 'single-select', optionKeys: ['2days', '3days', '4days', '5plus'] },
  { key: 'otherActivities', type: 'yes-no' },
  { key: 'injury', type: 'yes-no' },
  { key: 'preference', type: 'single-select', optionKeys: ['shortIntense', 'longModerate', 'any'] },
  { key: 'strength', type: 'yes-no' },
]

const QUESTION_ICONS: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  goal: GoalIcon,
  fitness: FitnessIcon,
  running: RunningIcon,
  raced: RacedIcon,
  pace: PaceIcon,
  days: DaysIcon,
  otherActivities: ActivitiesIcon,
  injury: InjuryIcon,
  preference: PreferenceIcon,
  strength: StrengthIcon,
}

export function QuestionStep({
  questionIndex,
  value,
  onChange,
  conditionalValue,
  onConditionalChange,
}: {
  questionIndex: number
  value: string | boolean | number | null
  onChange: (key: string, value: string | boolean | number | null) => void
  conditionalValue?: string | null
  onConditionalChange?: (value: string | null) => void
}) {
  const t = getTranslations()
  const config = QUESTIONS[questionIndex]
  const questionData = t.questions[config.key as keyof typeof t.questions]

  const IconComponent = QUESTION_ICONS[config.key]

  return (
    <div>
      {IconComponent && <IconComponent size={56} className="mb-4 motion-safe:animate-fade-in-up" />}

      <h2 className="text-2xl font-bold font-display leading-[1.2] text-[#14162E]">
        {questionData.question}
      </h2>

      <div className="mt-6" role="radiogroup" aria-label={questionData.question}>
        {config.type === 'single-select' && config.optionKeys && (
          <div className="flex flex-col gap-2">
            {'options' in questionData && (questionData.options as string[]).map((label: string, i: number) => (
              <div
                key={config.optionKeys![i]}
                className={cn('option-stagger-item motion-safe:animate-option-fade-in', `stagger-delay-${i + 1}`)}
              >
                <OptionButton
                  label={label}
                  selected={value === config.optionKeys![i]}
                  onClick={() => onChange(config.key, config.optionKeys![i])}
                />
              </div>
            ))}
          </div>
        )}

        {config.type === 'scale' && 'labels' in questionData && (
          <ScaleInput
            value={typeof value === 'number' ? value : null}
            onChange={(v) => onChange(config.key, v)}
            labels={questionData.labels as string[]}
          />
        )}

        {config.type === 'yes-no' && (
          <YesNoInput
            value={typeof value === 'boolean' ? value : null}
            onChange={(v) => onChange(config.key, v)}
            yesLabel={t.options.yes}
            noLabel={t.options.no}
          />
        )}

        {config.type === 'yes-no-conditional' && (
          <div>
            <YesNoInput
              value={typeof value === 'boolean' ? value : null}
              onChange={(v) => onChange(config.key, v)}
              yesLabel={t.options.yes}
              noLabel={t.options.no}
            />

            <div
              className={`transition-all duration-200 overflow-hidden ${
                value === true ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              {'options' in questionData && (
                <div className="flex flex-col gap-2">
                  {(questionData.options as string[]).map((label: string, i: number) => (
                    <div
                      key={config.optionKeys![i]}
                      className={cn('option-stagger-item motion-safe:animate-option-fade-in', `stagger-delay-${i + 1}`)}
                    >
                      <OptionButton
                        label={label}
                        selected={conditionalValue === config.optionKeys![i]}
                        onClick={() => onConditionalChange?.(config.optionKeys![i])}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
