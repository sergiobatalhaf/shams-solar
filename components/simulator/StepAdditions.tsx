'use client'
import { Wind, Car, Waves, Thermometer, Plus, Zap } from 'lucide-react'

export interface AdditionsState {
  hasAC: boolean;        acUnits: number;       acKwh: number
  hasEV: boolean;        evKwh: number
  hasHeatedPool: boolean; heatedPoolKwh: number
  hasHeatedFloor: boolean; heatedFloorKwh: number
  hasOthers: boolean;    othersDesc: string;    othersKwh: number
}

interface Props {
  currentKwh: number
  state: AdditionsState
  onChange: (s: AdditionsState) => void
}

const DEFAULTS = { acKwh: 300, evKwh: 200, heatedPoolKwh: 400, heatedFloorKwh: 300 }

interface ItemProps {
  icon: React.ElementType
  label: string
  sub: string
  checked: boolean
  color: string
  onToggle: () => void
  children?: React.ReactNode
}

function AddItem({ icon: Icon, label, sub, checked, color, onToggle, children }: ItemProps) {
  return (
    <div className={`shams-card p-4 transition-all duration-200 ${checked ? 'border-shams-light/50' : ''}`}>
      <div className="flex items-center gap-3 cursor-pointer" onClick={onToggle}>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
          checked ? `bg-gradient-to-br ${color}` : 'bg-shams-surface'
        }`}>
          <Icon size={20} className={checked ? 'text-white' : 'text-white/30'} />
        </div>
        <div className="flex-1">
          <div className={`font-semibold ${checked ? 'text-white' : 'text-white/60'}`}>{label}</div>
          <div className="text-white/40 text-xs">{sub}</div>
        </div>
        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
          checked ? 'bg-shams-light border-shams-light' : 'border-white/20'
        }`}>
          {checked && <svg viewBox="0 0 10 8" className="w-3 h-3 fill-white"><path d="M1 4l3 3 5-6"/></svg>}
        </div>
      </div>
      {checked && children && (
        <div className="mt-4 pt-4 border-t border-shams-green/20 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {children}
        </div>
      )}
    </div>
  )
}

const NumField = ({ label, value, onChange, unit = 'kWh/mês', min = 0 }: any) => (
  <div>
    <label className="label-field text-xs">{label}</label>
    <div className="relative">
      <input type="number" min={min} className="input-field pr-16 text-sm" value={value}
        onChange={e => onChange(Number(e.target.value))} />
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 text-xs">{unit}</span>
    </div>
  </div>
)

export default function StepAdditions({ currentKwh, state, onChange }: Props) {
  const s = state
  const set = (patch: Partial<AdditionsState>) => onChange({ ...s, ...patch })

  const addTotal =
    (s.hasAC    ? s.acUnits * s.acKwh : 0) +
    (s.hasEV    ? s.evKwh : 0) +
    (s.hasHeatedPool  ? s.heatedPoolKwh : 0) +
    (s.hasHeatedFloor ? s.heatedFloorKwh : 0) +
    (s.hasOthers      ? s.othersKwh : 0)

  const total = currentKwh + addTotal

  return (
    <div className="space-y-6">
      <div>
        <div className="section-subtitle mb-1">Etapa 3</div>
        <h2 className="text-2xl font-bold text-white mb-1">Adições Futuras</h2>
        <p className="text-white/50 text-sm">Selecione equipamentos que o cliente pretende adicionar. Incluímos a média de consumo de cada um.</p>
      </div>

      <div className="space-y-3">
        <AddItem icon={Wind} label="Ar-condicionado" sub="~300 kWh/mês por unidade (12.000 BTU)"
          checked={s.hasAC} color="from-blue-500 to-cyan-400"
          onToggle={() => set({ hasAC: !s.hasAC, acUnits: 1, acKwh: DEFAULTS.acKwh })}>
          <NumField label="Quantidade de unidades" unit="unid." min={1} value={s.acUnits}
            onChange={(v: number) => set({ acUnits: Math.max(1, v) })} />
          <NumField label="kWh por unidade (editável)" value={s.acKwh}
            onChange={(v: number) => set({ acKwh: v })} />
        </AddItem>

        <AddItem icon={Car} label="Carro Elétrico" sub="~200 kWh/mês"
          checked={s.hasEV} color="from-purple-500 to-indigo-400"
          onToggle={() => set({ hasEV: !s.hasEV, evKwh: DEFAULTS.evKwh })}>
          <NumField label="Consumo estimado" value={s.evKwh}
            onChange={(v: number) => set({ evKwh: v })} />
        </AddItem>

        <AddItem icon={Waves} label="Piscina Aquecida" sub="~400 kWh/mês"
          checked={s.hasHeatedPool} color="from-teal-500 to-cyan-400"
          onToggle={() => set({ hasHeatedPool: !s.hasHeatedPool, heatedPoolKwh: DEFAULTS.heatedPoolKwh })}>
          <NumField label="Consumo estimado" value={s.heatedPoolKwh}
            onChange={(v: number) => set({ heatedPoolKwh: v })} />
        </AddItem>

        <AddItem icon={Thermometer} label="Piso Aquecido" sub="~300 kWh/mês"
          checked={s.hasHeatedFloor} color="from-orange-500 to-amber-400"
          onToggle={() => set({ hasHeatedFloor: !s.hasHeatedFloor, heatedFloorKwh: DEFAULTS.heatedFloorKwh })}>
          <NumField label="Consumo estimado" value={s.heatedFloorKwh}
            onChange={(v: number) => set({ heatedFloorKwh: v })} />
        </AddItem>

        <AddItem icon={Plus} label="Outros Consumidores" sub="Informe o consumo estimado"
          checked={s.hasOthers} color="from-green-500 to-emerald-400"
          onToggle={() => set({ hasOthers: !s.hasOthers, othersKwh: 0, othersDesc: '' })}>
          <div className="sm:col-span-2">
            <label className="label-field text-xs">Descrição</label>
            <input className="input-field text-sm mb-2" placeholder="Ex: Bomba de irrigação, câmara fria..."
              value={s.othersDesc} onChange={e => set({ othersDesc: e.target.value })} />
          </div>
          <NumField label="Consumo total estimado" value={s.othersKwh}
            onChange={(v: number) => set({ othersKwh: v })} />
        </AddItem>
      </div>

      {/* Total */}
      <div className="shams-gradient rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white/80 text-sm font-medium mb-0.5 flex items-center gap-1">
              <Zap size={14} /> Consumo total estimado
            </div>
            <div className="text-4xl font-black text-white">{total.toLocaleString('pt-BR')} <span className="text-xl font-medium opacity-80">kWh/mês</span></div>
          </div>
          {addTotal > 0 && (
            <div className="text-right">
              <div className="text-white/60 text-xs">Atual</div>
              <div className="text-white font-bold">{currentKwh} kWh</div>
              <div className="text-white/60 text-xs mt-1">Adições</div>
              <div className="text-white font-bold">+{addTotal} kWh</div>
            </div>
          )}
        </div>
        <div className="mt-3 text-white/70 text-sm">
          Custo atual estimado: <strong className="text-white">R$ {(total * 1.04).toFixed(2)}/mês</strong>
        </div>
      </div>
    </div>
  )
}
