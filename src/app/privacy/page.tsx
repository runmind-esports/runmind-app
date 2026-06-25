'use client'

import Link from 'next/link'

/**
 * Privacy Policy page exposed publicly. Meta App Review fetches this URL
 * during evaluation; LGPD requires it to be available to any data subject
 * who interacts with the service. Content is intentionally specific —
 * generic "we collect data for various purposes" copy gets the URL flagged
 * as non-compliant both by Meta and by any future ANPD inspection.
 *
 * Update procedure: bump the "Última atualização" line, document the
 * change in a short note at the bottom under a "Histórico" heading if the
 * change is material (e.g. new processor, new data category, new purpose).
 */
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white text-[#14162E]">
      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#6B7088] hover:text-[#14162E] mb-8 text-sm">
          <span aria-hidden>←</span> Voltar
        </Link>

        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-3">Política de Privacidade</h1>
        <p className="text-[#6B7088] text-sm mb-10">Última atualização: 19 de junho de 2026</p>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">1. Quem somos</h2>
          <p className="text-[#3F4356] leading-relaxed">
            O Runmind é um coach virtual de corrida operado por <strong>CNPJ 65.760.091/0001-09</strong>,
            localizado em Recife/PE, Brasil. Para fins da LGPD (Lei 13.709/2018), somos o{' '}
            <strong>controlador</strong> dos dados pessoais coletados ao longo do uso do serviço.
            Dúvidas ou solicitações relacionadas a esta política devem ser direcionadas a{' '}
            <a href="mailto:contato@runmind.com.br" className="text-[#14162E] font-medium underline underline-offset-2">
              contato@runmind.com.br
            </a>
            .
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">2. Dados que coletamos</h2>
          <p className="text-[#3F4356] leading-relaxed mb-3">
            Coletamos somente o necessário para que o coach funcione. Em resumo:
          </p>
          <ul className="list-disc list-inside text-[#3F4356] space-y-2 leading-relaxed">
            <li>
              <strong>Identificação:</strong> nome, e-mail e foto de perfil fornecidos pela sua conta Google
              ao usar o login social.
            </li>
            <li>
              <strong>Dados de treino do Strava:</strong> atividades, ritmo, frequência cardíaca, rotas,
              quilometragem e estatísticas agregadas, obtidos via OAuth depois do seu consentimento.
            </li>
            <li>
              <strong>Dados de saúde do Google Health:</strong> passos, sono, frequência cardíaca de
              repouso, HRV, peso e demais métricas que você autorize ao conectar a integração.
            </li>
            <li>
              <strong>Conversas com o coach via WhatsApp:</strong> mensagens enviadas e recebidas, número
              de telefone, identificador da conta WhatsApp Business.
            </li>
            <li>
              <strong>Dados de uso:</strong> data e hora das interações, planos de treino gerados, saldo
              de RunPoints, métricas técnicas de performance e logs de erro.
            </li>
            <li>
              <strong>Dados de pagamento:</strong> processados pela Stripe; armazenamos o customer_id e o
              status da assinatura, mas não o número do cartão.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">3. Por que coletamos (finalidade e base legal)</h2>
          <ul className="list-disc list-inside text-[#3F4356] space-y-2 leading-relaxed">
            <li><strong>Execução do contrato</strong> (LGPD art. 7º, V) — para autenticar você, gerar planos de treino personalizados, responder mensagens no WhatsApp e cobrar a assinatura.</li>
            <li><strong>Consentimento</strong> (LGPD art. 7º, I) — para acessar Strava e Google Health, sempre revogável a qualquer momento dentro de cada plataforma.</li>
            <li><strong>Legítimo interesse</strong> (LGPD art. 7º, IX) — para detectar fraude, melhorar a qualidade das respostas da IA e calcular métricas agregadas de uso.</li>
            <li><strong>Obrigação legal</strong> (LGPD art. 7º, II) — registros fiscais de pagamento mantidos pelo prazo da legislação tributária aplicável.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">4. Com quem compartilhamos</h2>
          <p className="text-[#3F4356] leading-relaxed mb-3">
            Não vendemos seus dados. Compartilhamos somente com os processadores essenciais para o serviço
            funcionar, todos sob contrato de proteção de dados:
          </p>
          <ul className="list-disc list-inside text-[#3F4356] space-y-2 leading-relaxed">
            <li><strong>Google LLC</strong> (EUA) — autenticação Google, Cloud Run (hospedagem), Secret Manager, Cloud Logging.</li>
            <li><strong>Neon Inc.</strong> (EUA) — banco de dados PostgreSQL gerenciado.</li>
            <li><strong>DeepSeek</strong> (China) ou <strong>OpenAI, LLC</strong> (EUA) — inferência de IA usada para gerar as respostas do coach. As mensagens enviadas no WhatsApp são transmitidas ao provedor de IA configurado no momento da resposta. Não usamos seus dados para treinar modelos: ambos os contratos vigentes incluem opt-out de uso para treinamento.</li>
            <li><strong>Meta Platforms, Inc.</strong> (EUA) — entrega de mensagens via WhatsApp Business Cloud API.</li>
            <li><strong>Stripe, Inc.</strong> (EUA) — processamento de pagamentos.</li>
            <li><strong>Strava, Inc.</strong> (EUA) e <strong>Google Health</strong> (EUA) — somente quando você ativa a integração; a transferência é bidirecional e regida pelos termos de cada provedor.</li>
          </ul>
          <p className="text-[#3F4356] leading-relaxed mt-3">
            Transferências internacionais (EUA / China) ocorrem com base nas cláusulas-padrão previstas em
            LGPD art. 33.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">5. Uso de dados das APIs do Google</h2>
          <p className="text-[#3F4356] leading-relaxed mb-3">
            Esta seção descreve, em conformidade com a{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#14162E] font-medium underline underline-offset-2"
            >
              Google API Services User Data Policy
            </a>
            , como o Runmind acessa e usa dados que você autoriza via OAuth do Google.
          </p>

          <h3 className="font-display font-semibold text-base mt-5 mb-2">Escopos solicitados</h3>
          <ul className="list-disc list-inside text-[#3F4356] space-y-2 leading-relaxed">
            <li>
              <strong>Identidade (Sign-In):</strong> <code className="text-[13px] bg-[#F5F6F7] px-1 py-0.5 rounded">openid</code>,{' '}
              <code className="text-[13px] bg-[#F5F6F7] px-1 py-0.5 rounded">email</code>,{' '}
              <code className="text-[13px] bg-[#F5F6F7] px-1 py-0.5 rounded">profile</code> — para criar e autenticar sua conta no Runmind.
            </li>
            <li>
              <strong>Google Fit / Health Connect</strong> (somente se você conectar a integração): leitura de atividades, frequência cardíaca,
              sono, peso e métricas correlatas. Os escopos exatos são apresentados na tela de consentimento do Google no momento da conexão e
              podem ser revogados a qualquer momento em{' '}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#14162E] font-medium underline underline-offset-2"
              >
                myaccount.google.com/permissions
              </a>
              .
            </li>
          </ul>

          <h3 className="font-display font-semibold text-base mt-5 mb-2">Como usamos esses dados</h3>
          <p className="text-[#3F4356] leading-relaxed mb-3">
            Dados recebidos das APIs do Google são usados <strong>exclusivamente</strong> para fornecer e melhorar as funcionalidades do
            Runmind solicitadas por você — gerar planos de treino personalizados, calcular cargas, sugerir pace e responder perguntas
            sobre seu condicionamento.
          </p>

          <h3 className="font-display font-semibold text-base mt-5 mb-2">O que não fazemos com dados do Google</h3>
          <ul className="list-disc list-inside text-[#3F4356] space-y-2 leading-relaxed">
            <li>Não vendemos dados obtidos das APIs do Google a terceiros.</li>
            <li>Não usamos dados das APIs do Google para publicidade, retargeting, data brokers ou avaliação de crédito.</li>
            <li>
              Não enviamos dados das APIs do Google (em particular Google Fit / Health Connect) para os provedores de IA que geram
              as respostas do coach (OpenAI / DeepSeek). Apenas métricas derivadas (ex: pace alvo, faixa de FC) entram no prompt — nunca
              o registro bruto do Google.
            </li>
            <li>Nenhum dado das APIs do Google é usado para treinar modelos de IA, nossos ou de terceiros.</li>
          </ul>

          <h3 className="font-display font-semibold text-base mt-5 mb-2">Limited Use</h3>
          <p className="text-[#3F4356] leading-relaxed">
            O uso e a transferência de qualquer informação recebida das APIs do Google por parte do Runmind para qualquer outro app
            estará em conformidade com a Google API Services User Data Policy, incluindo os requisitos de Limited Use.
          </p>
          <p className="text-[#3F4356] leading-relaxed mt-2 text-[14px] italic">
            Versão em inglês (requerida pelo Google para revisão): &ldquo;Runmind&apos;s use and transfer of information received from
            Google APIs to any other app will adhere to{' '}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#14162E] font-medium underline underline-offset-2"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.&rdquo;
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">6. Retenção</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Mantemos seus dados enquanto sua conta está ativa. Após a solicitação de exclusão (ver{' '}
            <Link href="/data-deletion" className="text-[#14162E] font-medium underline underline-offset-2">/data-deletion</Link>
            ), removemos tudo em até 30 dias corridos. Registros fiscais de pagamento são retidos por 5
            anos (legislação tributária brasileira); logs técnicos de segurança por 90 dias.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">7. Seus direitos (LGPD)</h2>
          <p className="text-[#3F4356] leading-relaxed mb-3">
            A qualquer momento você pode pedir, sem custo:
          </p>
          <ul className="list-disc list-inside text-[#3F4356] space-y-1.5 leading-relaxed">
            <li>Confirmação da existência de tratamento;</li>
            <li>Acesso aos dados que mantemos sobre você;</li>
            <li>Correção de dados incompletos ou desatualizados;</li>
            <li>Anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos;</li>
            <li>Portabilidade dos dados a outro fornecedor;</li>
            <li>Eliminação dos dados tratados com base em consentimento;</li>
            <li>Informação sobre com quem compartilhamos seus dados;</li>
            <li>Revogação do consentimento.</li>
          </ul>
          <p className="text-[#3F4356] leading-relaxed mt-3">
            Para exercer qualquer um desses direitos, escreva para{' '}
            <a href="mailto:contato@runmind.com.br" className="text-[#14162E] font-medium underline underline-offset-2">contato@runmind.com.br</a>{' '}
            a partir do e-mail cadastrado.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">8. Cookies e armazenamento local</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Usamos apenas armazenamento local estritamente necessário (token JWT de sessão, preferências de
            interface). Não usamos cookies de rastreamento publicitário nem ferramentas de analytics
            que identifiquem o usuário individualmente.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">9. Segurança</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Tráfego sempre em HTTPS. Tokens armazenados criptografados. Acesso aos sistemas restrito por
            JWT + chaves de serviço. Em caso de incidente de segurança que afete seus dados, comunicaremos
            você e a ANPD no prazo razoável previsto em lei.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">10. Alterações nesta política</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Quando houver mudança material (novo processador, nova categoria de dado, nova finalidade),
            atualizamos a data acima e, se for o caso, comunicamos você por e-mail antes da vigência.
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-[rgba(20,22,46,0.1)] flex flex-wrap items-center gap-4 text-xs text-[#A8ADBE]">
          <Link href="/terms" className="hover:text-[#14162E]">Termos de Uso</Link>
          <span>·</span>
          <Link href="/data-deletion" className="hover:text-[#14162E]">Exclusão de Dados</Link>
          <span>·</span>
          <Link href="/" className="hover:text-[#14162E]">Início</Link>
        </div>
      </div>
    </div>
  )
}
