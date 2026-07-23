import { Users, Sun, MapPin, Wrench } from 'lucide-react'

const stats = [
  { icon: Users, value: 'Mais de 500', label: 'Projetos Executados', color: 'text-shams-neon' },
  { icon: Sun,   value: '10.000',      label: 'Placas Instaladas',    color: 'text-shams-cyan' },
  { icon: MapPin,value: 'Atuação em 6', label: 'Estados do Brasil',   color: 'text-shams-light' },
  { icon: Wrench,value: 'Equipe',      label: 'Técnica Especializada', color: 'text-shams-neon' },
]

const clients = [
  'Schwan Cosmetics','CSN','RANDON','Gestamp','WEG','Grupo Boticário',
  'Innova','Continental','Club Vibe','CTG Brasil','Floripa Shopping','Baldo',
  'Positivo','Frisia','Legado','Walmart','Mondelez','Capital Realty',
]

export default function AboutSection() {
  return (
    <section id="quem-somos" className="py-24 bg-shams-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-subtitle">Nossa Empresa</div>
          <h2 className="section-title mb-6">Quem Somos</h2>
          <div className="w-16 h-0.5 shams-gradient mx-auto rounded-full" />
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="space-y-4 text-white/70 leading-relaxed">
            <p>
              A <strong className="text-white">SHAMS Energia Solar</strong> é uma empresa especializada em sistemas de geração distribuída de energia solar fotovoltaica, com atuação em todo o Brasil. Nosso objetivo é levar soluções energéticas sustentáveis, eficientes e economicamente vantajosas para residências, comércios e propriedades rurais, contribuindo para um futuro mais sustentável e inteligente.
            </p>
            <p>
              Nossos projetos são desenvolvidos de forma personalizada, considerando as necessidades específicas de cada cliente e as características de cada imóvel. Trabalhamos sempre com foco em eficiência energética, redução de custos na conta de luz e maior autonomia energética, proporcionando economia a longo prazo e valorização do patrimônio.
            </p>
            <p>
              Mais do que instalar sistemas solares, buscamos construir relações de confiança e entregar soluções que realmente façam a diferença na vida das pessoas e nos resultados das empresas. Acreditamos no poder da energia solar como ferramenta de transformação econômica e ambiental.
            </p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="shams-card p-6 text-center">
                <stat.icon className={`mx-auto mb-3 ${stat.color}`} size={28} />
                <div className={`text-2xl font-black ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Clients section */}
        <div className="shams-card p-8">
          <h3 className="text-center text-white font-bold text-lg mb-8 flex items-center justify-center gap-2">
            <span className="text-shams-neon">🤝</span>
            Clientes do Grupo
          </h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {clients.map((client) => (
              <div key={client}
                className="bg-shams-surface/50 rounded-lg px-3 py-2.5 text-center text-white/60 text-xs font-medium hover:text-white hover:bg-shams-surface transition-all cursor-default">
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
