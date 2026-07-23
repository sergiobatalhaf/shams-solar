'use client'
import { Zap, AlertCircle, TrendingUp } from 'lucide-react'

interface Props {
  currentKwh: number
  onChange: (kwh: number) => void
}

const KWH_PRICE = 1.04

export default function StepConsumption({ currentKwh, onChange }: Props) {
  const monthlyBill = (currentKwh * KWH_PRICE).toFixed(2)
  const annualBill  = (currentKwh * KWH_PRICE * 12).toFixed(2)

  const referenceValues = [
    { label: 'Casa pequena',  kwh: 150,  desc: '1-2 pessoas' },
    { label: 'Casa média',    kwh: 350,  desc: '3-4 pessoas' },
    { label: 'Casa grande',   kwh: 600,  desc: '5+ pessoas' },
    { label: 'Comércio peq.', kwh: 1000, desc: 'Salão, loja' },
    { label: 'Comércio méd.', kwh: 3000, desc: 'Restaurante, clínica' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <div className="section-subtitle mb-1">Etapa 2</div>
        <h2 className="text-2xl font-bold text-white mb-1">Consumo Atual</h2>
        <p className="text-white/50 text-sm">Informe o consumo mensal de energia em kWh. Você encontra na conta de luz.</p>
      </div>

      {/* Tip */}
      <div className="flex items-start gap-3 bg-shams-teal/10 border border-shams-teal/30 rounded-xl p-4">
        <AlertCircle size={16} className="text-shams-cyan mt-0.5 flex-shrink-0" />
        <p className="text-white/70 text-sm">
          O consumo em kWh está na sua conta de luz, normalmente chamado de <strong className="text-white">"Consumo de Energia Elétrica"</strong>. Use a média dos últimos 3 meses para maior precisão.
        </p>
      </div>

      {/* Main input */}
      <div className="shams-card p-6">
        <div className="flex items-center gap-2 mb-4 text-shams-light">
          <Zap size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Consumo Mensal</span>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div className="relative flex-1">
            <input
              type="number"
              min="0"
              step="10"
              className="input-field text-2xl font-bold text-center pr-16"
              placeholder="0"
              value={currentKwh || ''}
              onChange={e => onChange(Number(e.target.value))}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-semibold">kWh</span>
          </div>
        </div>

        {/* Slider */}
        <input
          type="range" min="0" max="5000" step="50"
          value={currentKwh}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full mt-3 accent-green-400"
        />
        <div className="flex justify-between text-xs text-white/30 mt-1">
          <span>0 kWh</span><span>2.500 kWh</span><span>5.000 kWh</span>
        </div>
      </div>

      {/* Results */}
      {currentKwh > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <div className="shams-card p-4 text-center">
            <div className="text-white/50 text-xs mb-1">Gasto mensal</div>
            <div className="text-shams-neon font-black text-lg">R$ {monthlyBill}</div>
          </div>
          <div className="shams-card p-4 text-center">
            <div className="text-white/50 text-xs mb-1">Gasto anual</div>
            <div className="text-shams-light font-black text-lg">R$ {Number(annualBill).toLocaleString('pt-BR')}</div>
          </div>
          <div className="shams-card p-4 text-center">
            <div className="text-white/50 text-xs mb-1">Em 25 anos*</div>
            <div className="text-white font-black text-lg">R$ {(Number(annualBill) * 25).toLocaleString('pt-BR', {maximumFractionDigits:0})}</div>
          </div>
        </div>
      )}

      {/* Quick select */}
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider mb-3">Referências rápidas</p>
        <div className="flex flex-wrap gap-2">
          {referenceValues.map(ref => (
            <button key={ref.kwh} onClick={() => onChange(ref.kwh)}
              className={`px-3 py-2 rounded-lg text-sm border transition-all ${
                currentKwh === ref.kwh
                  ? 'bg-shams-green border-shams-light text-white'
                  : 'bg-shams-surface border-shams-green/20 text-white/60 hover:border-shams-green/50 hover:text-white'
              }`}>
              <span className="font-semibold">{ref.label}</span>
              <span className="text-xs opacity-60 ml-1">~{ref.kwh} kWh</span>
            </button>
          ))}
        </div>
      </div>

      {currentKwh > 0 && (
        <div className="flex items-center gap-2 text-white/40 text-xs">
          <TrendingUp size={12} />
          <span>*Projeção sem considerar inflação energética (estimada em 5,8% ao ano)</span>
        </div>
      )}
    </div>
  )
}
