import Link from 'next/link'
import { ArrowRight, Zap, TrendingDown, Shield } from 'lucide-react'

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-hero-pattern bg-shams-black">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-shams-teal/5 blur-3xl animate-pulse-slow" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-shams-green/8 blur-3xl animate-pulse-slow" style={{animationDelay:'1.5s'}} />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] rounded-full bg-shams-neon/3 blur-2xl animate-pulse-slow" style={{animationDelay:'3s'}} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5"
        style={{backgroundImage: 'linear-gradient(rgba(76,175,80,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(76,175,80,0.5) 1px, transparent 1px)',
               backgroundSize: '80px 80px'}} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column */}
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 bg-shams-green/10 border border-shams-green/30 rounded-full px-4 py-1.5 mb-6">
              <Zap size={14} className="text-shams-neon" />
              <span className="text-shams-neon text-xs font-semibold tracking-wider uppercase">Energia Solar Fotovoltaica</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-none mb-6">
              <span className="text-white">PROPOSTA</span>
              <br />
              <span className="shams-gradient-text">COMERCIAL</span>
              <br />
              <span className="text-white/60 text-3xl md:text-4xl font-light tracking-widest">SISTEMA FOTOVOLTAICO</span>
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-lg">
              Gere uma proposta comercial personalizada em minutos. Calcule sua economia, escolha a linha ideal e receba o documento completo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/simulator" className="btn-primary flex items-center justify-center gap-2 text-base py-4 px-8">
                Simular Minha Proposta
                <ArrowRight size={18} />
              </Link>
              <a href="#quem-somos" className="btn-outline flex items-center justify-center gap-2 text-base py-4 px-8">
                Conhecer a SHAMS
              </a>
            </div>

            {/* Stats row */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-shams-green/20">
              {[
                { value: '500+', label: 'Projetos' },
                { value: '10.000', label: 'Placas instaladas' },
                { value: '6', label: 'Estados do Brasil' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-black shams-gradient-text">{stat.value}</div>
                  <div className="text-white/50 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — feature cards */}
          <div className="hidden lg:grid grid-cols-1 gap-4 animate-fade-in" style={{animationDelay:'0.3s'}}>
            {[
              {
                icon: TrendingDown,
                title: 'Reduza sua conta de luz',
                desc: 'Economize até 95% na sua conta de energia elétrica com um sistema dimensionado para o seu consumo.',
                color: 'text-shams-neon',
              },
              {
                icon: Shield,
                title: 'Garantia de 25 anos',
                desc: 'Painéis com 25 anos de vida útil garantida pelo fabricante. Inversores com 10 anos de garantia.',
                color: 'text-shams-cyan',
              },
              {
                icon: Zap,
                title: 'Retorno em até 3 anos',
                desc: 'Payback médio de 3 anos com rendimento de investimento superior a 40% ao ano.',
                color: 'text-shams-light',
              },
            ].map((card) => (
              <div key={card.title} className="shams-card shams-card-hover p-5 flex items-start gap-4">
                <div className={`p-2.5 rounded-lg bg-white/5 ${card.color} flex-shrink-0`}>
                  <card.icon size={22} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{card.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}

            {/* Price card */}
            <div className="shams-gradient rounded-xl p-5">
              <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">A partir de</div>
              <div className="text-4xl font-black text-white">R$ 10.923</div>
              <div className="text-white/70 text-sm mt-1">Kit com 4 placas · Linha Premium</div>
              <div className="mt-3 text-white/60 text-xs">ou em até 21x no cartão · financiamento em 72x</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
        <span className="text-xs uppercase tracking-widest">Role para baixo</span>
        <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-bounce" />
      </div>
    </section>
  )
}
