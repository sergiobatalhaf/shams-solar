import Link from 'next/link'
import { Sun, Mail, Instagram, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-shams-dark border-t border-shams-green/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 shams-gradient rounded-lg flex items-center justify-center">
                <Sun size={18} className="text-white" />
              </div>
              <div>
                <div className="font-black text-white text-lg tracking-widest">SHAMS</div>
                <div className="text-shams-cyan text-[9px] tracking-[0.2em]">SOLUÇÕES EM ENERGIA</div>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              Especialistas em sistemas fotovoltaicos com mais de 500 projetos executados em todo o Brasil.
            </p>
          </div>

          {/* Curitiba */}
          <div>
            <h3 className="text-shams-cyan font-semibold text-sm uppercase tracking-wider mb-4">Curitiba</h3>
            <div className="space-y-2 text-white/60 text-sm">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 text-shams-light flex-shrink-0" />
                <span>Rua Dr. Roberto Barrozo 528, Centro Cívico, Curitiba - PR · CEP 80520-092</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-shams-light flex-shrink-0" />
                <span>(41) 99665-9223</span>
              </div>
            </div>
          </div>

          {/* Contatos */}
          <div>
            <h3 className="text-shams-cyan font-semibold text-sm uppercase tracking-wider mb-4">Contatos</h3>
            <div className="space-y-2 text-white/60 text-sm">
              <a href="mailto:comercial@shamsolar.net" className="flex items-center gap-2 hover:text-shams-light transition-colors">
                <Mail size={14} className="text-shams-light" />
                comercial@shamsolar.net
              </a>
              <a href="https://instagram.com/shamsenergiasolar" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 hover:text-shams-light transition-colors">
                <Instagram size={14} className="text-shams-light" />
                @shamsenergiasolar
              </a>
              <a href="https://www.shamsenergia.com.br" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 hover:text-shams-light transition-colors">
                <span className="text-shams-light font-bold text-xs">WWW</span>
                www.shamsenergia.com.br
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-shams-green/10 flex flex-col md:flex-row items-center justify-between gap-4 text-white/30 text-xs">
          <span>© {new Date().getFullYear()} SHAMS Energia Solar. Todos os direitos reservados.</span>
          <div className="flex gap-4">
            <Link href="/admin" className="hover:text-white/60 transition-colors">Área Admin</Link>
            <Link href="/simulator" className="hover:text-white/60 transition-colors">Simulador</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
