'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold text-[#14162E] mb-4">Termos de Uso</h1>
        <p className="text-[#6B7088] mb-8">
          Em breve disponibilizaremos nossos termos de uso completos.
        </p>
        <Link href="/login" className="text-[#14162E] font-semibold border-b-2 border-[#00F048]">
          Voltar para login
        </Link>
      </div>
    </div>
  )
}