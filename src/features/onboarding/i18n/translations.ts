export const translations = {
  ptBR: {
    welcome: {
      greeting: 'Olá, {name}!',
      subtitle: 'Vamos configurar seu perfil de corredor em menos de 2 minutos.',
      nameLabel: 'Seu nome',
      namePlaceholder: 'Como quer ser chamado?',
      cta: 'Continuar',
      nameRequired: 'Por favor, informe seu nome',
    },
    questions: {
      goal: {
        question: 'Qual e o seu objetivo principal?',
        options: ['Correr 5km', 'Correr 10km', 'Melhorar tempo nos 5km', 'Melhorar tempo nos 10km'],
      },
      fitness: {
        question: 'Como Você avalia seu condicionamento fisico?',
        labels: ['Sedentario', 'Pouco ativo', 'Moderado', 'Ativo', 'Muito ativo'],
      },
      running: {
        question: 'Você já corre regularmente?',
        options: ['Ate 5km', 'Ate 10km', '11 a 20km', '21 a 30km', 'Mais de 30km'],
      },
      raced: {
        question: 'Ja participou de alguma prova oficial?',
      },
      pace: {
        question: 'Qual e o seu pace medio atual?',
        distanceLabel: 'Pace de referência para qual distância?',
        distanceOptions: ['5km', '10km', '21km', '42km'],
        options: ['Nao sei', 'Acima de 7:00/km', '6:00 a 7:00/km', '5:00 a 6:00/km', 'Abaixo de 5:00/km'],
      },
      days: {
        question: 'Quantos dias por semana voce pode treinar?',
        options: ['2 dias', '3 dias', '4 dias', '5 ou mais dias'],
      },
      otherActivities: {
        question: 'Você pratica outras atividades físicas?',
        hint: 'Selecione todas que pratica (ou nenhuma)',
        options: ['Ciclismo', 'Natação', 'Musculação', 'Funcional', 'Yoga / Pilates', 'Caminhada', 'Trilha', 'Capoeira', 'Futebol', 'Outro'],
      },
      injury: {
        question: 'Possui alguma lesão ou restrição médica?',
        detailsLabel: 'Conta um pouco sobre a lesão',
        detailsPlaceholder: 'Ex: dor no joelho direito há 2 meses, em fisioterapia, libera corrida leve…',
      },
      preference: {
        question: 'Qual sua preferencia de treino?',
        options: ['Curtos e intensos', 'Longos e moderados', 'Tanto faz'],
      },
      strength: {
        question: 'Quer incluir treinos de forca na planilha?',
      },
    },
    navigation: {
      next: 'Continuar',
      back: 'Voltar',
      submit: 'Finalizar perfil',
      progress: 'Pergunta {n} de 10',
    },
    states: {
      submitting: 'Salvando seu perfil...',
      error: 'Erro ao salvar perfil. Tente novamente.',
      selectionRequired: 'Selecione uma opcao para continuar',
    },
    options: {
      yes: 'Sim',
      no: 'Nao',
    },
    planilha: {
      heading: 'Seu plano esta pronto!',
      subtitle: 'Sua planilha personalizada foi gerada com sucesso. Baixe agora e comece a treinar!',
      downloadCta: 'Baixar minha planilha',
      chatCta: 'Ir para o chat',
      loading: 'Gerando sua planilha...',
      error: 'Erro ao gerar planilha. Tente novamente.',
    },
    success: {
      title: 'Perfil salvo!',
      subtitle: 'Preparando seu coach de IA...',
    },
  },
  en: {
    welcome: {
      greeting: 'Hi, {name}!',
      subtitle: "Let's set up your runner profile in less than 2 minutes.",
      nameLabel: 'Your name',
      namePlaceholder: 'What should we call you?',
      cta: 'Continue',
      nameRequired: 'Please enter your name',
    },
    questions: {
      goal: {
        question: 'What is your main goal?',
        options: ['Run 5km', 'Run 10km', 'Improve 5km time', 'Improve 10km time'],
      },
      fitness: {
        question: 'How do you rate your fitness level?',
        labels: ['Sedentary', 'Slightly active', 'Moderate', 'Active', 'Very active'],
      },
      running: {
        question: 'Do you already run regularly?',
        options: ['Up to 5km', 'Up to 10km', '11 to 20km', '21 to 30km', '+30km'],
      },
      raced: {
        question: 'Have you participated in any official race?',
      },
      pace: {
        question: 'What is your current average pace?',
        distanceLabel: 'Reference pace for which distance?',
        distanceOptions: ['5km', '10km', '21km', '42km'],
        options: ["I don't know", 'Above 7:00/km', '6:00 to 7:00/km', '5:00 to 6:00/km', 'Below 5:00/km'],
      },
      days: {
        question: 'How many days per week can you train?',
        options: ['2 days', '3 days', '4 days', '5+ days'],
      },
      otherActivities: {
        question: 'Do you practice other physical activities?',
        hint: 'Select all that apply (or none)',
        options: ['Cycling', 'Swimming', 'Weight training', 'Functional', 'Yoga / Pilates', 'Walking', 'Trail', 'Capoeira', 'Soccer', 'Other'],
      },
      injury: {
        question: 'Do you have any injury or medical restriction?',
        detailsLabel: 'Tell us a bit about the injury',
        detailsPlaceholder: 'E.g. right knee pain for 2 months, in physio, light runs allowed…',
      },
      preference: {
        question: 'What is your training preference?',
        options: ['Short and intense', 'Long and moderate', 'No preference'],
      },
      strength: {
        question: 'Want to include strength training in your plan?',
      },
    },
    navigation: {
      next: 'Continue',
      back: 'Back',
      submit: 'Finish profile',
      progress: 'Question {n} of 10',
    },
    states: {
      submitting: 'Saving your profile...',
      error: 'Error saving profile. Please try again.',
      selectionRequired: 'Select an option to continue',
    },
    options: {
      yes: 'Yes',
      no: 'No',
    },
    planilha: {
      heading: 'Your plan is ready!',
      subtitle: 'Your personalized spreadsheet has been generated. Download it now and start training!',
      downloadCta: 'Download my spreadsheet',
      chatCta: 'Go to chat',
      loading: 'Generating your spreadsheet...',
      error: 'Error generating spreadsheet. Try again.',
    },
    success: {
      title: 'Profile saved!',
      subtitle: 'Preparing your AI coach...',
    },
  },
}

export type OnboardingTranslations = typeof translations.ptBR

export function getTranslations(): OnboardingTranslations {
  if (typeof navigator === 'undefined') return translations.ptBR
  const lang = navigator.language
  if (lang.startsWith('en')) return translations.en
  return translations.ptBR
}
