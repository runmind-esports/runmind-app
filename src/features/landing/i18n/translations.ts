type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly []
      ? readonly []
      : DeepStringify<T[K]>
}

const ptBR = {
  meta: {
    title: 'RunMind - Seu Coach de Corrida com IA',
    description: 'Treinamento de elite acessivel. Planilhas personalizadas, coach IA 24/7, sincronizacao com Strava e Garmin.',
  },
  nav: {
    languageToggle: 'EN',
  },
  hero: {
    title: '[Phase 2] Treinamento de Elite ao Seu Alcance',
    subtitle: '[Phase 2] O gap entre querer correr e ter um coach esta prestes a fechar.',
    cta: 'Comece Gratis',
    ctaSecondary: '[Phase 2] Saiba Mais',
  },
  features: {
    title: '[Phase 2] Funcionalidades',
    subtitle: '[Phase 2] Tudo que voce precisa para evoluir na corrida',
    chat: {
      title: '[Phase 2] Coach IA 24/7',
      description: '[Phase 2] Converse com seu coach a qualquer hora',
    },
    plans: {
      title: '[Phase 2] Planilhas Dinamicas',
      description: '[Phase 2] Treinos personalizados que se adaptam ao seu progresso',
    },
    sync: {
      title: '[Phase 2] Sincronizacao Inteligente',
      description: '[Phase 2] Conecte Strava e Garmin automaticamente',
    },
  },
  profiles: {
    title: '[Phase 2] Perfis',
    items: [] as const,
  },
  flow: {
    title: '[Phase 3] Como Funciona',
    subtitle: '[Phase 3] Em poucos passos voce esta treinando',
    steps: [] as const,
  },
  numbers: {
    title: '[Phase 4] Numeros que Impressionam',
    volume: '[Phase 4] Volume Total',
    pace: '[Phase 4] Pace Medio',
    engagement: '[Phase 4] Engajamento',
  },
  gap: {
    title: '[Phase 3] O Gap do Mercado',
    subtitle: '[Phase 3] Coaching humano e caro. Planilhas genericas nao funcionam.',
    stats: [] as const,
  },
  cta: {
    title: '[Phase 2] Pronto para Comecar?',
    subtitle: '[Phase 2] Junte-se a milhares de corredores que ja treinam com IA.',
    button: 'Comece Gratis',
  },
  footer: {
    tagline: 'Inteligencia que move voce',
    links: [] as const,
    rights: 'Todos os direitos reservados.',
  },
} as const

const en = {
  meta: {
    title: 'RunMind - Your AI Running Coach',
    description: 'Elite training made accessible. Personalized plans, 24/7 AI coach, Strava and Garmin sync.',
  },
  nav: {
    languageToggle: 'PT',
  },
  hero: {
    title: '[Phase 2] Elite Training Within Your Reach',
    subtitle: '[Phase 2] The gap between wanting to run and having a coach is about to close.',
    cta: 'Start Free',
    ctaSecondary: '[Phase 2] Learn More',
  },
  features: {
    title: '[Phase 2] Features',
    subtitle: '[Phase 2] Everything you need to level up your running',
    chat: {
      title: '[Phase 2] 24/7 AI Coach',
      description: '[Phase 2] Chat with your coach anytime',
    },
    plans: {
      title: '[Phase 2] Dynamic Plans',
      description: '[Phase 2] Personalized workouts that adapt to your progress',
    },
    sync: {
      title: '[Phase 2] Smart Sync',
      description: '[Phase 2] Connect Strava and Garmin automatically',
    },
  },
  profiles: {
    title: '[Phase 2] Profiles',
    items: [] as const,
  },
  flow: {
    title: '[Phase 3] How It Works',
    subtitle: '[Phase 3] In a few steps you are training',
    steps: [] as const,
  },
  numbers: {
    title: '[Phase 4] Impressive Numbers',
    volume: '[Phase 4] Total Volume',
    pace: '[Phase 4] Average Pace',
    engagement: '[Phase 4] Engagement',
  },
  gap: {
    title: '[Phase 3] The Market Gap',
    subtitle: '[Phase 3] Human coaching is expensive. Generic plans do not work.',
    stats: [] as const,
  },
  cta: {
    title: '[Phase 2] Ready to Start?',
    subtitle: '[Phase 2] Join thousands of runners already training with AI.',
    button: 'Start Free',
  },
  footer: {
    tagline: 'Intelligence that moves you',
    links: [] as const,
    rights: 'All rights reserved.',
  },
} as const satisfies DeepStringify<typeof ptBR>

export const translations = { 'pt-BR': ptBR, en } as const
