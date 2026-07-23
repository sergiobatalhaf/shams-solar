export default function ProjectsSection() {
  const projects = [
    { title: 'Residencial – Curitiba PR', type: 'Residencial', capacity: '8 kWp', color: 'from-shams-teal to-shams-green' },
    { title: 'Comercial – Galpão SC',     type: 'Comercial',   capacity: '50 kWp', color: 'from-shams-green to-shams-mid' },
    { title: 'Rural – Fazenda PR',        type: 'Agronegócio', capacity: '30 kWp', color: 'from-shams-mid to-shams-light' },
    { title: 'Industrial – Fábrica SP',   type: 'Industrial',  capacity: '150 kWp', color: 'from-shams-teal to-shams-mid' },
    { title: 'Estádio – Campo SC',        type: 'Esportivo',   capacity: '40 kWp', color: 'from-shams-green to-shams-light' },
    { title: 'Ground Mount – SC',         type: 'Usina',       capacity: '500 kWp', color: 'from-shams-mid to-shams-teal' },
  ]

  return (
    <section id="projetos" className="py-24 bg-shams-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="section-subtitle">Portfólio</div>
          <h2 className="section-title mb-6">Projetos Executados</h2>
          <div className="w-16 h-0.5 shams-gradient mx-auto rounded-full" />
          <p className="text-white/50 text-base mt-6 max-w-xl mx-auto">
            Mais de 500 instalações entregues — residencial, comercial, agronegócio e industrial.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <div key={i}
              className="group shams-card shams-card-hover overflow-hidden aspect-[4/3] relative flex flex-col justify-end p-6 cursor-default"
              style={{animationDelay: `${i * 0.1}s`}}>
              {/* Placeholder gradient background (would be photo in production) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-30 transition-opacity`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-24 h-24 rounded-xl bg-gradient-to-br ${project.color} opacity-30 flex items-center justify-center`}>
                  <svg viewBox="0 0 64 64" className="w-16 h-16 opacity-80" fill="none">
                    <rect x="4" y="20" width="56" height="36" rx="2" stroke="white" strokeWidth="2"/>
                    <line x1="4" y1="32" x2="60" y2="32" stroke="white" strokeWidth="1.5"/>
                    <line x1="4" y1="44" x2="60" y2="44" stroke="white" strokeWidth="1.5"/>
                    <line x1="22" y1="20" x2="22" y2="56" stroke="white" strokeWidth="1.5"/>
                    <line x1="40" y1="20" x2="40" y2="56" stroke="white" strokeWidth="1.5"/>
                    <path d="M4 8 L32 2 L60 8" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="relative z-10">
                <div className="inline-block bg-shams-teal/20 border border-shams-teal/30 rounded-full px-3 py-1 text-shams-cyan text-xs font-medium mb-2">
                  {project.type}
                </div>
                <h3 className="text-white font-bold">{project.title}</h3>
                <div className="text-shams-neon font-semibold text-sm mt-1">{project.capacity}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/40 text-sm">
            Fotos dos projetos reais serão adicionadas na versão de produção.
          </p>
        </div>
      </div>
    </section>
  )
}
