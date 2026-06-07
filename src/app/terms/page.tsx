'use client'

import Link from 'next/link'

/**
 * Terms of Use page exposed publicly. One of the three URLs (Privacy /
 * Terms / Data Deletion) Meta App Review fetches before approving the
 * submission. Brazilian-Portuguese, Brazilian governing law — match the
 * audience and the CNPJ on the WABA portfolio.
 *
 * Update procedure: bump "Última atualização", add a note under "11.
 * Alterações" if the change is material. Avoid silently changing pricing
 * or scope language — those should be communicated by email first.
 */
export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white text-[#14162E]">
      <div className="max-w-3xl mx-auto px-6 py-12 sm:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-[#6B7088] hover:text-[#14162E] mb-8 text-sm">
          <span aria-hidden>←</span> Voltar
        </Link>

        <h1 className="font-display font-bold text-3xl sm:text-4xl mb-3">Termos de Uso</h1>
        <p className="text-[#6B7088] text-sm mb-10">Última atualização: 7 de junho de 2026</p>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">1. Aceitação</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Ao criar uma conta, acessar o site <strong>runmind.com.br</strong> ou iniciar uma conversa com
            o coach pelo WhatsApp Business, você concorda integralmente com estes Termos de Uso. Se você
            não concordar, deve interromper o uso imediatamente.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">2. O serviço</h2>
          <p className="text-[#3F4356] leading-relaxed">
            O Runmind é um coach virtual de corrida que combina dados do Strava e do Google Health com
            inteligência artificial para gerar planos de treino, análises de desempenho e orientações
            personalizadas. As interações acontecem via web (runmind.com.br) e via WhatsApp Business.
            O serviço é operado por <strong>CNPJ 63.581.899/0001-01</strong>, Recife/PE, Brasil.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">3. Cadastro e acesso</h2>
          <ul className="list-disc list-inside text-[#3F4356] space-y-2 leading-relaxed">
            <li>O cadastro é feito exclusivamente via login social do Google.</li>
            <li>Você é responsável por manter a segurança da sua conta Google associada ao Runmind.</li>
            <li>É proibido criar conta em nome de terceiros sem autorização expressa.</li>
            <li>O Runmind é destinado a maiores de 18 anos. Menores precisam de autorização do responsável legal.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">4. Conduta esperada</h2>
          <p className="text-[#3F4356] leading-relaxed mb-3">
            Ao usar o serviço, você concorda em <strong>não</strong>:
          </p>
          <ul className="list-disc list-inside text-[#3F4356] space-y-1.5 leading-relaxed">
            <li>tentar contornar limites de uso, automatizar acesso ou fazer engenharia reversa;</li>
            <li>enviar conteúdo ilegal, abusivo, discriminatório ou que viole direitos de terceiros;</li>
            <li>usar o serviço para enviar spam, mensagens em massa não autorizadas ou phishing;</li>
            <li>compartilhar dados pessoais de outras pessoas sem consentimento;</li>
            <li>integrar o serviço a sistemas que violem os termos da Meta, do Strava ou do Google Health.</li>
          </ul>
          <p className="text-[#3F4356] leading-relaxed mt-3">
            O descumprimento pode resultar em suspensão ou encerramento imediato da conta, sem reembolso.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">5. Conteúdo gerado pela IA</h2>
          <p className="text-[#3F4356] leading-relaxed mb-3">
            O coach é um <strong>auxiliar de treino</strong>, não um profissional de saúde. As recomendações
            são baseadas nos seus dados conectados e em modelos de inteligência artificial, e podem conter
            imprecisões. Você é o responsável final por:
          </p>
          <ul className="list-disc list-inside text-[#3F4356] space-y-1.5 leading-relaxed">
            <li>consultar profissional médico antes de iniciar, modificar ou intensificar treinos;</li>
            <li>avaliar se uma recomendação é apropriada para sua condição física, idade e histórico;</li>
            <li>interromper qualquer atividade que cause dor, desconforto ou risco à saúde.</li>
          </ul>
          <p className="text-[#3F4356] leading-relaxed mt-3">
            O Runmind <strong>não substitui</strong> avaliação médica, fisioterapêutica, nutricional ou
            cardiológica.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">6. Planos, cobrança e cancelamento</h2>
          <ul className="list-disc list-inside text-[#3F4356] space-y-2 leading-relaxed">
            <li>
              O plano <strong>Iniciante</strong> é gratuito. Os planos <strong>Pro</strong> e{' '}
              <strong>Premium</strong> são pagos, com valores publicados em <Link href="/#plans" className="text-[#14162E] font-medium underline underline-offset-2">runmind.com.br/#plans</Link>.
            </li>
            <li>
              Cobranças são processadas pela Stripe, em reais, com renovação automática ao final de cada
              período (mensal ou anual).
            </li>
            <li>
              Você pode cancelar a qualquer momento pelas configurações da conta. O cancelamento é
              imediato e a cobrança não renova; o acesso ao plano permanece até o fim do período já pago.
            </li>
            <li>
              Reembolsos seguem o Código de Defesa do Consumidor (art. 49 — direito de arrependimento em
              até 7 dias da contratação, para serviços contratados fora do estabelecimento comercial).
            </li>
            <li>
              Aumentos de preço, quando ocorrerem, serão comunicados por e-mail com no mínimo 30 dias de
              antecedência e só se aplicam à próxima renovação.
            </li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">7. Propriedade intelectual</h2>
          <p className="text-[#3F4356] leading-relaxed">
            O nome &ldquo;Runmind&rdquo;, o logotipo, o código-fonte e o conteúdo editorial do site são de
            propriedade exclusiva da operadora do serviço. Os dados de treino que você importa do Strava e
            do Google Health continuam sendo seus; o Runmind apenas os utiliza para gerar as
            recomendações descritas nestes Termos.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">8. Disponibilidade</h2>
          <p className="text-[#3F4356] leading-relaxed">
            O serviço é oferecido em regime de melhor esforço (best-effort). Não garantimos
            disponibilidade ininterrupta nem ausência total de falhas. Manutenções programadas serão
            anunciadas com antecedência sempre que possível.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">9. Limitação de responsabilidade</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Salvo nos casos vedados por lei (dolo, culpa grave, lesão corporal), a responsabilidade total
            do Runmind por qualquer perda ou dano relacionado ao serviço fica limitada ao valor pago pelo
            usuário nos 12 meses imediatamente anteriores ao evento. O Runmind não responde por danos
            indiretos, lucros cessantes ou perdas decorrentes de indisponibilidade dos serviços de
            terceiros (Strava, Google Health, Meta, Stripe).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">10. Encerramento</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Você pode encerrar sua conta a qualquer momento seguindo as instruções em{' '}
            <Link href="/data-deletion" className="text-[#14162E] font-medium underline underline-offset-2">
              runmind.com.br/data-deletion
            </Link>
            . Reservamos o direito de suspender ou encerrar contas que descumprirem estes Termos ou que
            apresentarem indícios de fraude.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">11. Alterações destes Termos</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Podemos atualizar estes Termos para refletir mudanças no serviço ou na legislação. Mudanças
            materiais (preço, escopo, novos limites de responsabilidade) serão comunicadas por e-mail com
            no mínimo 30 dias de antecedência. O uso continuado depois da data de vigência implica
            aceitação da nova versão.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">12. Lei aplicável e foro</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro
            da Comarca de Recife/PE para dirimir qualquer controvérsia, sem prejuízo do direito do
            consumidor de propor ação no foro do seu domicílio (CDC art. 101, I).
          </p>
        </section>

        <section className="mb-10">
          <h2 className="font-display font-semibold text-xl mb-3">13. Contato</h2>
          <p className="text-[#3F4356] leading-relaxed">
            Dúvidas, notificações legais e solicitações relacionadas a estes Termos:{' '}
            <a href="mailto:contato@proza.net.br" className="text-[#14162E] font-medium underline underline-offset-2">
              contato@proza.net.br
            </a>
            .
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-[rgba(20,22,46,0.1)] flex flex-wrap items-center gap-4 text-xs text-[#A8ADBE]">
          <Link href="/privacy" className="hover:text-[#14162E]">Política de Privacidade</Link>
          <span>·</span>
          <Link href="/data-deletion" className="hover:text-[#14162E]">Exclusão de Dados</Link>
          <span>·</span>
          <Link href="/" className="hover:text-[#14162E]">Início</Link>
        </div>
      </div>
    </div>
  )
}
