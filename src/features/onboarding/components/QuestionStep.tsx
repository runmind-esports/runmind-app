'use client'

import { getTranslations } from '../i18n/translations'
import { OptionButton } from './OptionButton'
import { ScaleInput } from './ScaleInput'
import { YesNoInput } from './YesNoInput'
import { ChipSelect } from './ChipSelect'
import { TextareaInput } from './TextareaInput'
import { GoalIcon, FitnessIcon, RunningIcon, RacedIcon, PaceIcon, DaysIcon, ActivitiesIcon, InjuryIcon, PreferenceIcon, StrengthIcon } from '../assets'
import { cn } from '@/lib/utils'

interface QuestionConfig {
  key: string
  type: 'single-select' | 'scale' | 'yes-no' | 'yes-no-conditional' | 'pace-with-distance' | 'multi-select' | 'yes-no-with-details'
  optionKeys?: string[]
}

export const QUESTIONS: QuestionConfig[] = [
  { key: 'goal', type: 'single-select', optionKeys: ['run5k', 'run10k', 'improve5k', 'improve10k'] },
  { key: 'fitness', type: 'scale' },
  { key: 'running', type: 'yes-no-conditional', optionKeys: ['upTo5', 'upTo10', '11to20', '21to30', 'over30'] },
  { key: 'raced', type: 'yes-no' },
  { key: 'pace', type: 'pace-with-distance', optionKeys: ['dontKnow', 'above7', '6to7', '5to6', 'below5'] },
  { key: 'days', type: 'single-select', optionKeys: ['2days', '3days', '4days', '5plus'] },
  { key: 'otherActivities', type: 'multi-select', optionKeys: ['cycling', 'swimming', 'gym', 'functional', 'yogaPilates', 'walking', 'trail', 'capoeira', 'soccer', 'other'] },
  { key: 'injury', type: 'yes-no-with-details' },
  { key: 'preference', type: 'single-select', optionKeys: ['shortIntense', 'longModerate', 'any'] },
  { key: 'strength', type: 'yes-no' },
]

const PACE_DISTANCE_KEYS = ['5k', '10k', '21k', '42k']

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

export interface QuestionStepProps {
  questionIndex: number
  value: string | boolean | number | null
  onChange: (key: string, value: string | boolean | number | null) => void
  // pace-with-distance
  paceDistance?: string | null
  onPaceDistanceChange?: (value: string | null) => void
  // yes-no-conditional (existing running question)
  conditionalValue?: string | null
  onConditionalChange?: (value: string | null) => void
  // multi-select
  multiValue?: string[]
  onMultiChange?: (values: string[]) => void
  // yes-no-with-details
  detailsValue?: string
  onDetailsChange?: (value: string) => void
}

export function QuestionStep({
  questionIndex,
  value,
  onChange,
  paceDistance,
  onPaceDistanceChange,
  conditionalValue,
  onConditionalChange,
  multiValue,
  onMultiChange,
  detailsValue,
  onDetailsChange,
}: QuestionStepProps) {
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

        {config.type === 'pace-with-distance' && config.optionKeys && (
          <div className="flex flex-col gap-5">
            <div>
              <p className="text-sm font-semibold text-[#14162E] mb-2">
                {'distanceLabel' in questionData ? questionData.distanceLabel : ''}
              </p>
              {'distanceOptions' in questionData && (
                <ChipSelect
                  options={(questionData.distanceOptions as string[]).map((label, i) => ({
                    key: PACE_DISTANCE_KEYS[i],
                    label,
                  }))}
                  value={paceDistance ? [paceDistance] : []}
                  onChange={(arr) => onPaceDistanceChange?.(arr[0] ?? null)}
                  multi={false}
                />
              )}
            </div>
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
          </div>
        )}

        {config.type === 'multi-select' && config.optionKeys && (
          <div className="flex flex-col gap-3">
            {'hint' in questionData && (
              <p className="text-sm text-[#6B7088]">{questionData.hint}</p>
            )}
            {'options' in questionData && (
              <ChipSelect
                options={(questionData.options as string[]).map((label, i) => ({
                  key: config.optionKeys![i],
                  label,
                }))}
                value={multiValue ?? []}
                onChange={(arr) => onMultiChange?.(arr)}
                multi
              />
            )}
          </div>
        )}

        {config.type === 'yes-no-with-details' && (
          <div>
            <YesNoInput
              value={typeof value === 'boolean' ? value : null}
              onChange={(v) => onChange(config.key, v)}
              yesLabel={t.options.yes}
              noLabel={t.options.no}
            />

            <div
              className={`transition-all duration-300 overflow-hidden ${
                value === true ? 'max-h-[400px] opacity-100 mt-4' : 'max-h-0 opacity-0'
              }`}
            >
              {'detailsLabel' in questionData && (
                <TextareaInput
                  label={questionData.detailsLabel as string}
                  placeholder={'detailsPlaceholder' in questionData ? (questionData.detailsPlaceholder as string) : ''}
                  value={detailsValue ?? ''}
                  onChange={(v) => onDetailsChange?.(v)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
