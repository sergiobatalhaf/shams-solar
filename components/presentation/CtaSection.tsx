import Link from 'next/link'
import { ArrowRight, Calculator } from 'lucide-react'

export default function CtaSection() {
  return (
    <section className="py-24 bg-shams-black relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-shams-teal/5 blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <div className="section-subtitle mb-4">Comece agora</div>
        <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
          Gere sua{' '}
          <span className="shams-gradient-text">Proposta Comercial</span>
          {' '}em minutos
        </h2>
        <p className="text-white/60 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
          Preencha o formulário interativo e receba uma proposta completa com análise de ROI, fluxo de caixa e condições de pagamento para apresentar ao cliente.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/simulator" className="btn-primary flex items-center justify-center gap-3 text-lg py-4 px-10">
            <Calculator size={22} />
            Iniciar Simulação
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Trust signals */}
        <div className="mt-12 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { label: 'Gratuito', sub: 'Sem custo para simular' },
            { label: 'Rápido',   sub: 'Proposta em 5 minutos' },
            { label: 'Completo', sub: 'PDF com todos os detalhes' },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-shams-neon font-bold">{item.label}</div>
              <div className="text-white/40 text-xs mt-0.5">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
