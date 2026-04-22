type DeepStringify<T> = {
  [K in keyof T]: T[K] extends string
    ? string
    : T[K] extends readonly []
      ? readonly []
      : T[K] extends readonly (infer U)[]
        ? readonly DeepStringify<U>[]
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
    title: 'Treinamento de Elite ao Seu Alcance',
    subtitle: 'O gap entre querer correr melhor e ter um coach de elite esta prestes a fechar. IA que entende seu ritmo, adapta seus treinos e conecta com Strava.',
    cta: 'Comece Gratis',
    ctaSecondary: 'Saiba Mais',
  },
  features: {
    title: 'Tudo que Voce Precisa para Evoluir',
    subtitle: 'Tecnologia de ponta a servico do seu treino',
    badge: 'Parceiro Oficial',
    chat: {
      title: 'Coach IA 24/7',
      description: 'Converse com seu coach a qualquer hora. Respostas personalizadas baseadas no seu historico e objetivos.',
    },
    plans: {
      title: 'Planilhas Dinamicas',
      description: 'Treinos personalizados que se adaptam ao seu progresso, rotina e feedback em tempo real.',
    },
    sync: {
      title: 'Sincronizacao Inteligente',
      description: 'Conecte Strava e Garmin automaticamente. Seus dados alimentam o coach para recomendacoes mais precisas.',
    },
  },
  profiles: {
    title: 'Qual e o Seu Perfil?',
    items: [
      { name: 'Corpo & Alma', emoji: '\u{1F3C3}', stat: '88% influenciam amigos a correr', description: 'Corrida como estilo de vida. Busca equilibrio entre performance e bem-estar.' },
      { name: 'Mestre Zen', emoji: '\u{1F9D8}', stat: '98% buscam equilibrio', description: 'Corre para a mente e o corpo. Valoriza consistencia sobre velocidade.' },
      { name: 'Competidor Nato', emoji: '\u{1F3C6}', stat: 'Foco total em provas', description: 'Vive para a proxima prova. Quer planilha otimizada e pace preciso.' },
      { name: 'Espirito Livre', emoji: '\u{1F32C}\u{FE0F}', stat: '81% sem regras rigidas', description: 'Corre quando quer, como quer. Precisa de flexibilidade, nao rigidez.' },
    ] as const,
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
    title: 'Pronto para Treinar com Inteligencia?',
    subtitle: 'Junte-se a corredores que ja treinam com IA. Sem cartao, sem compromisso.',
    button: 'Comece Gratis',
  },
  footer: {
    tagline: 'Inteligencia que move voce',
    links: [
      { label: 'Funcionalidades', href: '#features' },
      { label: 'Como Funciona', href: '#flow' },
      { label: 'Precos', href: '#pricing' },
      { label: 'Entrar', href: '/login' },
      { label: 'Criar Conta', href: '/signup' },
    ] as const,
    rights: '2026 RunMind. Todos os direitos reservados.',
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
    title: 'Elite Training Within Your Reach',
    subtitle: 'The gap between wanting to run better and having an elite coach is about to close. AI that understands your pace, adapts your workouts, and syncs with Strava.',
    cta: 'Start Free',
    ctaSecondary: 'Learn More',
  },
  features: {
    title: 'Everything You Need to Level Up',
    subtitle: 'Cutting-edge technology at your training\'s service',
    badge: 'Official Partner',
    chat: {
      title: '24/7 AI Coach',
      description: 'Chat with your coach anytime. Personalized responses based on your history and goals.',
    },
    plans: {
      title: 'Dynamic Plans',
      description: 'Personalized workouts that adapt to your progress, routine, and real-time feedback.',
    },
    sync: {
      title: 'Smart Sync',
      description: 'Connect Strava and Garmin automatically. Your data feeds the coach for more precise recommendations.',
    },
  },
  profiles: {
    title: 'What\'s Your Profile?',
    items: [
      { name: 'Body & Soul', emoji: '\u{1F3C3}', stat: '88% influence friends to run', description: 'Running as a lifestyle. Seeks balance between performance and well-being.' },
      { name: 'Zen Master', emoji: '\u{1F9D8}', stat: '98% seek balance', description: 'Runs for mind and body. Values consistency over speed.' },
      { name: 'Born Competitor', emoji: '\u{1F3C6}', stat: 'Total focus on races', description: 'Lives for the next race. Wants optimized plans and precise pacing.' },
      { name: 'Free Spirit', emoji: '\u{1F32C}\u{FE0F}', stat: '81% without rigid rules', description: 'Runs when they want, how they want. Needs flexibility, not rigidity.' },
    ] as const,
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
    title: 'Ready to Train with Intelligence?',
    subtitle: 'Join runners already training with AI. No card, no commitment.',
    button: 'Start Free',
  },
  footer: {
    tagline: 'Intelligence that moves you',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#flow' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Log In', href: '/login' },
      { label: 'Sign Up', href: '/signup' },
    ] as const,
    rights: '2026 RunMind. All rights reserved.',
  },
} as const satisfies DeepStringify<typeof ptBR>

export const translations = { 'pt-BR': ptBR, en } as const
