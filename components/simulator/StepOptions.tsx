'use client'
import { Cable, Grid, Star, Award } from 'lucide-react'
import type { ProductLine, InverterDistance } from '@/lib/types'

export interface OptionsState {
  inverterDistance: InverterDistance
  metalStructure: boolean
  metalStructureM2: number
  productLine: ProductLine
}

interface Props {
  state: OptionsState
  onChange: (s: OptionsState) => void
}

const METAL_PRICE = 1000

const distances: { value: InverterDistance; label: string; sub: string }[] = [
  { value: '<30m',  label: 'Menos de 30 metros',   sub: 'Sem custo adicional de cabeamento' },
  { value: '<50m',  label: 'Entre 30 e 50 metros',  sub: 'Cabeamento médio' },
  { value: '<100m', label: 'Entre 50 e 100 metros', sub: 'Cabeamento longo' },
]

export default function StepOptions({ state, onChange }: Props) {
  const s = state
  const set = (patch: Partial<OptionsState>) => onChange({ ...s, ...patch })

  const metalCost = s.metalStructure ? s.metalStructureM2 * METAL_PRICE : 0

  return (
    <div className="space-y-6">
      <div>
        <div className="section-subtitle mb-1">Etapa 4</div>
        <h2 className="text-2xl font-bold text-white mb-1">Opções de Instalação</h2>
        <p className="text-white/50 text-sm">Configure as condições da instalação e escolha a linha do produto.</p>
      </div>

      {/* Inverter distance */}
      <div className="shams-card p-5">
        <div className="flex items-center gap-2 mb-4 text-shams-cyan">
          <Cable size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Distância: Inversor → Quadro de Energia</span>
        </div>
        <div className="space-y-2">
          {distances.map(d => (
            <label key={d.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                s.inverterDistance === d.value
                  ? 'border-shams-light bg-shams-light/10'
                  : 'border-shams-green/20 hover:border-shams-green/50'
              }`}>
              <input type="radio" name="dist" className="hidden" checked={s.inverterDistance === d.value}
                onChange={() => set({ inverterDistance: d.value })} />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                s.inverterDistance === d.value ? 'border-shams-light' : 'border-white/30'
              }`}>
                {s.inverterDistance === d.value && <div className="w-2 h-2 rounded-full bg-shams-light" />}
              </div>
              <div>
                <div className={`font-medium text-sm ${s.inverterDistance === d.value ? 'text-white' : 'text-white/60'}`}>{d.label}</div>
                <div className="text-white/40 text-xs">{d.sub}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Metal structure */}
      <div className="shams-card p-5">
        <div className="flex items-center gap-2 mb-4 text-shams-cyan">
          <Grid size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Estrutura Metálica (Cobertura / Pergolado)</span>
        </div>
        <label className="flex items-center gap-3 cursor-pointer mb-4" onClick={() => set({ metalStructure: !s.metalStructure, metalStructureM2: s.metalStructure ? 0 : 20 })}>
          <div className={`w-10 h-6 rounded-full transition-all duration-200 flex items-center ${s.metalStructure ? 'bg-shams-light' : 'bg-shams-surface'}`}>
            <div className={`w-4 h-4 rounded-full bg-white transition-all duration-200 mx-1 ${s.metalStructure ? 'translate-x-4' : ''}`} />
          </div>
          <span className={`font-medium text-sm ${s.metalStructure ? 'text-white' : 'text-white/50'}`}>
            Incluir estrutura metálica para cobertura ou pergolado
          </span>
        </label>
        {s.metalStructure && (
          <div className="bg-shams-surface rounded-lg p-4 space-y-3">
            <div>
              <label className="label-field text-xs">Área coberta (m²)</label>
              <div className="relative">
                <input type="number" min="1" className="input-field pr-10"
                  value={s.metalStructureM2} onChange={e => set({ metalStructureM2: Number(e.target.value) })} />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">m²</span>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Custo adicional da estrutura:</span>
              <span className="text-shams-neon font-bold">+ R$ {metalCost.toLocaleString('pt-BR')}</span>
            </div>
            <div className="text-white/30 text-xs">R$ 1.000,00 por m² coberto</div>
          </div>
        )}
      </div>

      {/* Product line */}
      <div className="shams-card p-5">
        <div className="flex items-center gap-2 mb-4 text-shams-cyan">
          <Star size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Linha do Produto</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {([
            {
              value: 'premium' as ProductLine,
              icon: Award,
              title: 'LINHA PREMIUM',
              sub: 'Melhor custo-benefício',
              desc: 'Equipamentos de primeira linha, maior eficiência e durabilidade.',
              badge: 'Recomendado',
            },
            {
              value: 'standard' as ProductLine,
              icon: Star,
              title: 'LINHA STANDARD',
              sub: '20% abaixo da Premium',
              desc: 'Ótima qualidade a um custo mais acessível para o cliente.',
              badge: 'Mais acessível',
            },
          ]).map(line => (
            <label key={line.value}
              className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                s.productLine === line.value
                  ? line.value === 'premium'
                    ? 'border-shams-neon bg-shams-neon/5'
                    : 'border-shams-cyan bg-shams-cyan/5'
                  : 'border-shams-green/20 hover:border-shams-green/40'
              }`}
              onClick={() => set({ productLine: line.value })}>
              <div className="flex items-start justify-between mb-2">
                <line.icon size={20} className={s.productLine === line.value
                  ? line.value === 'premium' ? 'text-shams-neon' : 'text-shams-cyan'
                  : 'text-white/30'} />
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  s.productLine === line.value ? 'bg-shams-green/30 text-shams-neon' : 'bg-shams-surface text-white/30'
                }`}>{line.badge}</span>
              </div>
              <div className={`font-black text-sm mb-0.5 ${s.productLine === line.value ? 'text-white' : 'text-white/50'}`}>
                {line.title}
              </div>
              <div className={`text-xs mb-2 font-medium ${
                s.productLine === line.value
                  ? line.value === 'premium' ? 'text-shams-neon' : 'text-shams-cyan'
                  : 'text-white/30'
              }`}>{line.sub}</div>
              <div className="text-white/40 text-xs leading-relaxed">{line.desc}</div>
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
