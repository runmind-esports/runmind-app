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
    features: 'Funcionalidades',
    journey: 'Jornada',
    profiles: 'Perfis',
    login: 'Entrar',
    signup: 'Criar Conta',
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
    title: 'Como Funciona',
    subtitle: 'Em poucos passos voce esta treinando com inteligencia',
    steps: [
      { title: 'Conecte com Strava', description: 'Login social com sua conta Strava. Seus dados de corrida alimentam o coach desde o primeiro dia.', metric: '' },
      { title: 'Complete seu Perfil', description: 'Objetivos, nivel de condicionamento, rotina e limitacoes. Dados que o Strava nao captura mas que fazem toda diferenca no seu treino.', metric: 'Dados exclusivos RunMind' },
      { title: 'Escolha sua Distancia', description: 'De 5K a maratona, o coach adapta tudo para o seu momento. 82% dos corredores brasileiros focam em 5K-10K.', metric: '82% focam 5K-10K' },
      { title: 'Receba seu Treino', description: 'Planilha do dia personalizada. Frequencia media de 3.4x por semana, volume medio de 9.2km por sessao.', metric: '3.4x/semana | 9.2km/sessao' },
      { title: 'Acompanhe sua Evolucao', description: 'Veja seus numeros crescerem. 43% dos corredores brasileiros treinam antes das 8h -- o coach se adapta ao seu horario.', metric: '43% treinam antes das 8h' },
    ] as const,
  },
  numbers: {
    title: 'Numeros que Impressionam',
    subtitle: 'Resultados reais da comunidade RunMind',
    volume: 'Volume Total',
    volumeSublabel: 'quilometros registrados',
    volumeSuffix: 'km',
    pace: 'Pace Medio',
    paceSublabel: 'minutos por quilometro',
    paceSuffix: 'min/km',
    engagement: 'Engajamento',
    engagementSublabel: 'sessoes de treino concluidas',
    engagementSuffix: '%',
  },
  gap: {
    title: 'O Gap da Corrida Solo',
    subtitle: 'Milhoes correm sozinhos no Brasil. O suporte tecnico de elite sempre foi exclusivo de poucos.',
    stats: [
      { number: '30%', label: 'correm completamente sozinhos' },
      { number: '44%', label: 'sentem-se despreparados tecnicamente' },
      { number: 'R$300+', label: 'custo mensal de um coach humano' },
    ] as const,
    message: 'RunMind democratiza o acesso ao suporte tecnico de elite. IA que entende corrida, acessivel para todos.',
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
    features: 'Features',
    journey: 'Journey',
    profiles: 'Profiles',
    login: 'Log In',
    signup: 'Sign Up',
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
    title: 'How It Works',
    subtitle: 'In a few steps you are training with intelligence',
    steps: [
      { title: 'Connect with Strava', description: 'Social login with your Strava account. Your running data feeds the coach from day one.', metric: '' },
      { title: 'Complete Your Profile', description: 'Goals, fitness level, routine, and limitations. Data Strava doesn\'t capture but that makes all the difference in your training.', metric: 'RunMind-exclusive data' },
      { title: 'Choose Your Distance', description: 'From 5K to marathon, the coach adapts everything for your moment. 82% of Brazilian runners focus on 5K-10K.', metric: '82% focus 5K-10K' },
      { title: 'Get Your Workout', description: 'Personalized daily plan. Average frequency of 3.4x per week, average volume of 9.2km per session.', metric: '3.4x/week | 9.2km/session' },
      { title: 'Track Your Progress', description: 'Watch your numbers grow. 43% of Brazilian runners train before 8am -- the coach adapts to your schedule.', metric: '43% train before 8am' },
    ] as const,
  },
  numbers: {
    title: 'Impressive Numbers',
    subtitle: 'Real results from the RunMind community',
    volume: 'Total Volume',
    volumeSublabel: 'kilometers logged',
    volumeSuffix: 'km',
    pace: 'Average Pace',
    paceSublabel: 'minutes per kilometer',
    paceSuffix: 'min/km',
    engagement: 'Engagement',
    engagementSublabel: 'training sessions completed',
    engagementSuffix: '%',
  },
  gap: {
    title: 'The Solo Running Gap',
    subtitle: 'Millions run alone in Brazil. Elite technical support has always been exclusive to a few.',
    stats: [
      { number: '30%', label: 'run completely alone' },
      { number: '44%', label: 'feel technically unprepared' },
      { number: 'R$300+', label: 'monthly cost of a human coach' },
    ] as const,
    message: 'RunMind democratizes access to elite technical support. AI that understands running, accessible to everyone.',
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
