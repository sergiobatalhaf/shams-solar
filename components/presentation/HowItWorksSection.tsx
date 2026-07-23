import { FileText, Truck, HardHat, CheckCircle, Monitor, Settings } from 'lucide-react'

const steps = [
  {
    number: '1',
    icon: FileText,
    title: 'Projeto',
    desc: 'Seu projeto será desenvolvido por nosso time de engenheiros e atenderá todas as exigências normativas.',
    color: 'from-shams-teal to-shams-green',
  },
  {
    number: '2',
    icon: Truck,
    title: 'Logística',
    desc: 'Cuidaremos para que seu equipamento seja entregue com segurança no local da instalação.',
    color: 'from-shams-green to-shams-mid',
  },
  {
    number: '3',
    icon: HardHat,
    title: 'Instalação',
    desc: 'Agendaremos a instalação para um momento conveniente à sua rotina.',
    color: 'from-shams-mid to-shams-light',
  },
  {
    number: '4',
    icon: CheckCircle,
    title: 'Homologação',
    desc: 'Cuidaremos de toda a papelada da homologação do seu sistema junto à concessionária.',
    color: 'from-shams-teal to-shams-mid',
  },
  {
    number: '5',
    icon: Monitor,
    title: 'Monitoramento',
    desc: 'Acompanhamos a geração de energia do seu sistema frequentemente para identificar possíveis falhas e evitar prejuízos.',
    color: 'from-shams-light to-shams-neon/80',
  },
  {
    number: '6',
    icon: Settings,
    title: 'Manutenção',
    desc: 'Conheça nossos planos de manutenção e operação para máxima performance do sistema.',
    color: 'from-shams-green to-shams-teal',
  },
]

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="py-24 bg-shams-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-subtitle">Processo</div>
          <h2 className="section-title mb-6">Como Funciona</h2>
          <div className="w-16 h-0.5 shams-gradient mx-auto rounded-full" />
          <p className="text-white/50 mt-6 max-w-xl mx-auto">
            Da proposta à energia gerada — acompanhamos cada etapa do seu projeto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.number}
              className="shams-card shams-card-hover p-6 relative overflow-hidden group"
              style={{animationDelay: `${i * 0.1}s`}}>
              {/* Background number */}
              <div className="absolute -top-4 -right-2 text-8xl font-black text-shams-green/5 select-none">
                {step.number}
              </div>

              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <step.icon size={22} className="text-white" />
              </div>

              {/* Step badge */}
              <div className="inline-flex items-center gap-1.5 mb-3">
                <span className="text-shams-cyan text-xs font-bold uppercase tracking-widest">Etapa {step.number}</span>
              </div>

              <h3 className="text-white font-bold text-xl mb-3">{step.title}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="mt-16 shams-card p-8">
          <h3 className="text-center text-white font-bold text-xl mb-8">🛡️ Garantias do Sistema</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: 'Inversores',       value: '10 anos' },
              { title: 'Painel (defeito)',  value: '12 anos' },
              { title: 'Painel (vida útil)',value: '25 anos' },
              { title: 'Estrutura',        value: '10 anos' },
            ].map((g) => (
              <div key={g.title} className="text-center p-4 bg-shams-surface rounded-xl border border-shams-green/20">
                <div className="text-2xl font-black shams-gradient-text mb-1">{g.value}</div>
                <div className="text-white/60 text-xs">{g.title}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
