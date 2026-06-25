'use client'

import Link from 'next/link'

/**
 * Data-deletion landing page exposed to Meta App Review.
 *
 * Meta requires every app that processes user data via WhatsApp Business or
 * Facebook Login to publish a "User Data Deletion" URL in App Settings →
 * Basic. Reviewers fetch this page directly (no JS execution needed for the
 * key information), so content must be visible in the initial HTML — keep
 * the copy specific and avoid "we'll publish soon" placeholders that get the
 * URL rejected as non-compliant.
 *
 * The page documents:
 *   1. Two clear paths to delete (in-app + email),
 *   2. What is deleted across our stack (Strava token, Google Health token,
 *      training plans, WhatsApp link, conversations, mana balance),
 *   3. SLA (30 days) — Meta's reviewer guide expects a concrete deadline.
 *
 * Bilingual (PT + EN summary at the bottom) so a reviewer outside Brazil can
 * confirm the page meets the policy without translating.
 */
export default function DataDeletionPage() {
  return (
    <div className="min-h-screen bg-white text-[#14162E]">
      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        {/* Header */}
        <Link href="/" className="inline-flex items-center gap-2 text-[#6B7088] hover:text-[#14162E] mb-8 text-sm">
          <span aria-hidden>←</span> Voltar
        </Link>

        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-3">
          Exclusão de Dados / Encerramento de Conta
        </h1>
        <p className="text-[#6B7088] text-sm mb-10">
          Última atualização: 7 de junho de 2026
        </p>

        {/* Section 1 — what you can delete */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">
            O que você pode excluir
          </h2>
          <p className="text-[#3F4356] leading-relaxed mb-4">
            Como pessoa titular dos seus dados, você pode solicitar a qualquer
            momento a exclusão completa da sua conta Runmind e de todos os dados
            pessoais associados a ela. Ao receber sua solicitação, removemos:
          </p>
          <ul className="list-disc list-inside text-[#3F4356] space-y-2 leading-relaxed">
            <li>Seu perfil de corredor (nome, e-mail, foto, preferências, objetivos).</li>
            <li>Seus tokens de acesso ao Strava e ao Google Health (revogamos o consentimento dentro de cada provedor).</li>
            <li>Seu histórico de atividades importadas, planos de treino, métricas e insights gerados pela IA.</li>
            <li>Seu vínculo com o WhatsApp Business e todo o histórico de conversas com o coach virtual.</li>
            <li>Saldo e histórico de RunPoints, transações e métricas de uso.</li>
            <li>Assinatura ativa (a assinatura é cancelada na Stripe; cobranças futuras são interrompidas imediatamente).</li>
          </ul>
        </section>

        {/* Section 2 — how to delete */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">
            Como solicitar a exclusão
          </h2>
          <p className="text-[#3F4356] leading-relaxed mb-4">
            Escolha qualquer uma das opções abaixo. As duas têm o mesmo efeito.
          </p>

          <div className="space-y-4">
            <div className="border border-[rgba(20,22,46,0.1)] rounded-xl p-5">
              <h3 className="font-semibold mb-1">Opção 1 — Pelo aplicativo (recomendado)</h3>
              <ol className="list-decimal list-inside text-sm text-[#3F4356] space-y-1.5 mt-2">
                <li>
                  Acesse{' '}
                  <Link href="/settings" className="text-[#14162E] font-medium underline underline-offset-2">
                    runmind.com.br/settings
                  </Link>{' '}
                  e faça login com sua conta Google.
                </li>
                <li>Role até a aba <strong>Conta</strong>.</li>
                <li>Clique em <strong>Excluir minha conta</strong> e confirme.</li>
                <li>A exclusão é processada na hora; você recebe um e-mail de confirmação.</li>
              </ol>
            </div>

            <div className="border border-[rgba(20,22,46,0.1)] rounded-xl p-5">
              <h3 className="font-semibold mb-1">Opção 2 — Por e-mail</h3>
              <p className="text-sm text-[#3F4356] mt-2 leading-relaxed">
                Envie um e-mail para{' '}
                <a href="mailto:contato@runmind.com.br?subject=Solicita%C3%A7%C3%A3o%20de%20exclus%C3%A3o%20de%20conta%20Runmind" className="text-[#14162E] font-medium underline underline-offset-2">
                  contato@runmind.com.br
                </a>{' '}
                com o assunto <em>&ldquo;Solicitação de exclusão de conta Runmind&rdquo;</em>, a partir do mesmo endereço de e-mail
                usado para cadastro. Você receberá uma confirmação em até 2 dias úteis e a exclusão é executada em até{' '}
                <strong>30 dias corridos</strong> após o pedido.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 — what is kept (for compliance) */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">
            O que pode ser retido por obrigação legal
          </h2>
          <p className="text-[#3F4356] leading-relaxed">
            Em alguns casos a legislação brasileira (LGPD, art. 16) e regras
            fiscais nos obrigam a manter por prazo determinado um conjunto mínimo
            de informações — por exemplo, registros de transações de pagamento
            (Stripe / Receita Federal: 5 anos) e logs de auditoria de segurança.
            Esses dados ficam segregados, são acessados apenas para cumprimento
            da obrigação legal e são descartados ao final do prazo.
          </p>
        </section>

        {/* Section 4 — contact + DPO */}
        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">
            Dúvidas, recursos e DPO
          </h2>
          <p className="text-[#3F4356] leading-relaxed">
            Se você não recebeu a confirmação de exclusão dentro do prazo, ou
            quer exercer qualquer outro direito previsto na LGPD (acesso,
            correção, portabilidade, oposição), entre em contato com nosso
            encarregado de proteção de dados (DPO) pelo e-mail{' '}
            <a href="mailto:contato@runmind.com.br" className="text-[#14162E] font-medium underline underline-offset-2">
              contato@runmind.com.br
            </a>
            .
          </p>
        </section>

        {/* English summary for Meta reviewer */}
        <section className="border-t border-[rgba(20,22,46,0.1)] pt-8 mt-12">
          <h2 className="font-display font-semibold text-lg mb-3 text-[#6B7088]">
            English summary (for Meta App Review)
          </h2>
          <p className="text-sm text-[#6B7088] leading-relaxed mb-3">
            Runmind users can request full deletion of their personal data at any
            time through one of two paths:
          </p>
          <ul className="list-disc list-inside text-sm text-[#6B7088] space-y-1.5 leading-relaxed mb-3">
            <li>
              <strong>In-app:</strong> sign in at{' '}
              <a href="https://runmind.com.br/settings" className="underline">runmind.com.br/settings</a>,
              go to the <em>Account</em> tab, and click <em>Delete my account</em>. Deletion is processed immediately.
            </li>
            <li>
              <strong>By email:</strong> send a deletion request from the registered email address to{' '}
              <a href="mailto:contato@runmind.com.br" className="underline">contato@runmind.com.br</a>. We acknowledge
              within 2 business days and complete deletion within <strong>30 calendar days</strong>.
            </li>
          </ul>
          <p className="text-sm text-[#6B7088] leading-relaxed">
            Deletion removes the runner profile, Strava and Google Health
            tokens, training history, WhatsApp Business linkage and message
            history, RunPoints balance, and cancels any active Stripe
            subscription. Payment records and security audit logs may be retained
            for the legally mandated period (5 years under Brazilian tax law).
          </p>
        </section>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[rgba(20,22,46,0.1)] flex flex-wrap items-center gap-4 text-xs text-[#A8ADBE]">
          <Link href="/privacy" className="hover:text-[#14162E]">Política de Privacidade</Link>
          <span>·</span>
          <Link href="/terms" className="hover:text-[#14162E]">Termos de Uso</Link>
          <span>·</span>
          <Link href="/" className="hover:text-[#14162E]">Início</Link>
        </div>
      </div>
    </div>
  )
}
