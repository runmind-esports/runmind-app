'use client'

import { Check, Zap } from 'lucide-react'

const PLANS = [
  {
    id: 'free',
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    description: 'Para quem está começando a correr',
    features: [
      'Chat com IA coach',
      'Plano de treino básico',
      'Integração Strava',
    ],
    cta: 'Plano atual',
    current: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'R$ 29,90',
    period: '/mês',
    description: 'Para corredores que querem evoluir',
    features: [
      'Tudo do Gratuito',
      'Planilhas avançadas',
      'Análise de desempenho',
      'Ajustes automáticos de treino',
      'Suporte prioritário',
    ],
    cta: 'Em breve',
    current: false,
    highlighted: true,
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 'R$ 59,90',
    period: '/mês',
    description: 'Para quem compete e quer resultado',
    features: [
      'Tudo do Pro',
      'Coach IA ilimitado',
      'Periodização de provas',
      'Análise de zonas FC/VO2max',
      'Consultoria de nutrição',
      'Acesso antecipado a novidades',
    ],
    cta: 'Em breve',
    current: false,
  },
]

export function PlansSection() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold font-display text-foreground mb-1">Planos</h2>
        <p className="text-sm text-foreground-muted">
          Escolha o plano ideal para o seu treino
        </p>
      </div>

      <div className="space-y-3">
        {PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative p-5 rounded-2xl border transition-all duration-200 ${
              plan.current
                ? 'border-accent/45 bg-accent-dim'
                : plan.highlighted
                ? 'border-[#00F048]/30 bg-background'
                : 'border-border bg-background'
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-2.5 left-5 px-2.5 py-0.5 bg-[#00F048] text-[#14162E] text-[10px] font-bold rounded-full tracking-wide uppercase">
                Recomendado
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-semibold text-sm text-foreground tracking-tight">
                    {plan.name}
                  </h3>
                  {plan.current && (
                    <span className="px-2 py-0.5 bg-accent/15 text-accent text-[10px] font-bold rounded-full">
                      Ativo
                    </span>
                  )}
                </div>
                <p className="text-xs text-foreground-muted mt-0.5">
                  {plan.description}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <span className="font-display font-bold text-xl text-foreground tracking-tight">
                  {plan.price}
                </span>
                <span className="text-xs text-foreground-muted">{plan.period}</span>
              </div>
            </div>

            <ul className="space-y-1.5 mb-4">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs text-foreground-muted">
                  <Check className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>

            {plan.current ? (
              <div className="px-4 py-2.5 rounded-full bg-accent/10 text-accent text-xs font-bold text-center">
                Plano atual
              </div>
            ) : (
              <button
                disabled
                className="w-full px-4 py-2.5 rounded-full bg-background-tertiary text-foreground-muted text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                {plan.cta}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
