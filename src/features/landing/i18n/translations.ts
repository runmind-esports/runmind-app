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
    description: 'Treinamento de elite acessível. Planilhas personalizadas, coach IA 24/7, sincronização com Strava e Garmin.',
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
    subtitle: 'O gap entre querer correr melhor e ter um coach de elite está prestes a fechar. IA que entende seu ritmo, adapta seus treinos e conecta com Strava.',
    cta: 'Comece Grátis',
    ctaSecondary: 'Saiba Mais',
  },
  features: {
    title: 'Tudo que Você Precisa para Evoluir',
    subtitle: 'Tecnologia de ponta a serviço do seu treino',
    badge: 'Parceiro Oficial',
    chat: {
      title: 'Coach IA 24/7',
      description: 'Converse com seu coach a qualquer hora. Respostas personalizadas baseadas no seu histórico e objetivos.',
    },
    plans: {
      title: 'Planilhas Dinâmicas',
      description: 'Treinos personalizados que se adaptam ao seu progresso, rotina e feedback em tempo real.',
    },
    sync: {
      title: 'Sincronização Inteligente',
      description: 'Conecte Strava e Garmin automaticamente. Seus dados alimentam o coach para recomendações mais precisas.',
    },
  },
  profiles: {
    title: 'Qual é o Seu Perfil?',
    items: [
      { name: 'Corpo & Alma', emoji: '\u{1F3C3}', stat: '88% influenciam amigos a correr', description: 'Corrida como estilo de vida. Busca equilíbrio entre performance e bem-estar.' },
      { name: 'Mestre Zen', emoji: '\u{1F9D8}', stat: '98% buscam equilíbrio', description: 'Corre para a mente e o corpo. Valoriza consistência sobre velocidade.' },
      { name: 'Competidor Nato', emoji: '\u{1F3C6}', stat: 'Foco total em provas', description: 'Vive para a próxima prova. Quer planilha otimizada e pace preciso.' },
      { name: 'Espírito Livre', emoji: '\u{1F32C}\u{FE0F}', stat: '81% sem regras rígidas', description: 'Corre quando quer, como quer. Precisa de flexibilidade, não rigidez.' },
    ] as const,
  },
  flow: {
    title: 'Como Funciona',
    subtitle: 'Em poucos passos você está treinando com inteligência',
    steps: [
      { title: 'Conecte com Strava', description: 'Login social com sua conta Strava. Seus dados de corrida alimentam o coach desde o primeiro dia.', metric: '' },
      { title: 'Complete seu Perfil', description: 'Objetivos, nível de condicionamento, rotina e limitações. Dados que o Strava não captura mas que fazem toda diferença no seu treino.', metric: 'Dados exclusivos RunMind' },
      { title: 'Escolha sua Distância', description: 'De 5K a maratona, o coach adapta tudo para o seu momento. 82% dos corredores brasileiros focam em 5K-10K.', metric: '82% focam 5K-10K' },
      { title: 'Receba seu Treino', description: 'Planilha do dia personalizada. Frequência média de 3.4x por semana, volume médio de 9.2km por sessão.', metric: '3.4x/semana | 9.2km/sessão' },
      { title: 'Acompanhe sua Evolução', description: 'Veja seus números crescerem. 43% dos corredores brasileiros treinam antes das 8h — o coach se adapta ao seu horário.', metric: '43% treinam antes das 8h' },
    ] as const,
  },
  numbers: {
    title: 'Números que Impressionam',
    subtitle: 'Resultados reais da comunidade RunMind',
    volume: 'Volume Total',
    volumeSublabel: 'quilômetros registrados',
    volumeSuffix: 'km',
    pace: 'Pace Médio',
    paceSublabel: 'minutos por quilômetro',
    paceSuffix: 'min/km',
    engagement: 'Engajamento',
    engagementSublabel: 'sessões de treino concluídas',
    engagementSuffix: '%',
  },
  gap: {
    title: 'O Gap da Corrida Solo',
    subtitle: 'Milhões correm sozinhos no Brasil sem nenhum suporte técnico. A tecnologia pode ser o primeiro passo.',
    stats: [
      { number: '30%', label: 'correm completamente sozinhos' },
      { number: '44%', label: 'sentem-se despreparados tecnicamente' },
      { number: '3.4x', label: 'treinos por semana do amador brasileiro' },
    ] as const,
    message: 'RunMind é o parceiro digital para quem quer começar com orientação. Um complemento inteligente para a sua jornada de corrida.',
  },
  cta: {
    title: 'Pronto para Treinar com Inteligência?',
    subtitle: 'Junte-se a corredores que já treinam com IA. Sem cartão, sem compromisso.',
    button: 'Comece Grátis',
  },
  footer: {
    tagline: 'Inteligência que move você',
    links: [
      { label: 'Funcionalidades', href: '#features' },
      { label: 'Como Funciona', href: '#flow' },
      { label: 'Preços', href: '#pricing' },
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
    subtitle: 'Millions run alone in Brazil with no technical support. Technology can be the first step.',
    stats: [
      { number: '30%', label: 'run completely alone' },
      { number: '44%', label: 'feel technically unprepared' },
      { number: '3.4x', label: 'weekly workouts of the Brazilian amateur' },
    ] as const,
    message: 'RunMind is the digital partner for those who want to start with guidance. A smart complement for your running journey.',
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
