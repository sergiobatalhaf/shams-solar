'use client'
import { useState } from 'react'
import type { SelectedKit, PaymentOption } from '@/lib/types'
import { formatCurrency, calcPaymentOptions } from '@/lib/calculations'
import { Sun, CreditCard, FileText, Building2, Zap, ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  kit: SelectedKit
  entryValue: number
  selectedPayment: PaymentOption | null
  onEntryChange: (v: number) => void
  onSelect: (p: PaymentOption) => void
}

type Method = 'avista' | 'boleto' | 'cartao' | 'financiamento'

const METHOD_CONFIG: Record<Method, { label: string; icon: React.ElementType; color: string; sub: string }> = {
  avista:      { label: 'À Vista',          icon: Sun,       color: 'from-shams-neon/80 to-shams-light',  sub: '15% de desconto' },
  boleto:      { label: 'Boleto 5x',        icon: FileText,  color: 'from-shams-teal to-shams-green',     sub: 'Sem juros' },
  cartao:      { label: 'Cartão de Crédito',icon: CreditCard,color: 'from-purple-500 to-indigo-400',      sub: '1% a.m. · até 21x' },
  financiamento:{ label: 'Financiamento',   icon: Building2, color: 'from-amber-500 to-orange-400',       sub: '1,7% a.m. · até 72x' },
}

const INSTALLMENT_OPTS: Record<Method, number[]> = {
  avista:       [1],
  boleto:       [5],
  cartao:       [2,3,4,5,6,7,8,9,10,12,15,18,21],
  financiamento:[12,18,24,36,48,60,72],
}

export default function StepPayment({ kit, entryValue, selectedPayment, onEntryChange, onSelect }: Props) {
  const [activeMethod, setActiveMethod] = useState<Method>('avista')
  const [installments, setInstallments] = useState(1)
  const [showKitDetail, setShowKitDetail] = useState(false)

  const allPayments = calcPaymentOptions(kit.finalPrice, entryValue)

  const filteredPayments = allPayments.filter(p => {
    if (activeMethod === 'avista') return p.method === 'avista'
    return p.method === activeMethod && INSTALLMENT_OPTS[activeMethod].includes(p.installments)
  })

  const getPayment = (method: Method, n: number) =>
    allPayments.find(p => p.method === method && p.installments === n)

  const currentPayment = activeMethod === 'avista'
    ? getPayment('avista', 1)
    : getPayment(activeMethod, installments)

  return (
    <div className="space-y-6">
      <div>
        <div className="section-subtitle mb-1">Etapa 5</div>
        <h2 className="text-2xl font-bold text-white mb-1">Kit & Pagamento</h2>
        <p className="text-white/50 text-sm">Kit dimensionado para o consumo do cliente. Selecione as condições de pagamento.</p>
      </div>

      {/* Kit summary */}
      <div className="shams-gradient rounded-xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Kit Recomendado</div>
            <div className="text-3xl font-black text-white mb-1">{kit.totalPlates} Placas</div>
            <div className="text-white/80 text-sm">
              {kit.secondary ? `${kit.primary.plates} + ${kit.secondary.plates} placas (composição)` : `Kit único`}
            </div>
            <div className="text-white font-bold mt-2">{kit.totalKwh.toFixed(0)} kWh/mês gerados</div>
          </div>
          <div className="text-right">
            <div className="text-white/60 text-xs">Linha</div>
            <div className="text-shams-neon font-black uppercase">{kit.line}</div>
            <div className="text-white/60 text-xs mt-2">Cobertura</div>
            <div className="text-white font-bold">{kit.coverage}%</div>
          </div>
        </div>
        <button
          className="mt-3 text-white/60 text-xs flex items-center gap-1 hover:text-white transition-colors"
          onClick={() => setShowKitDetail(!showKitDetail)}>
          {showKitDetail ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
          {showKitDetail ? 'Ocultar detalhes' : 'Ver detalhes do kit'}
        </button>
        {showKitDetail && (
          <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-white/50">Kit principal:</span> <span className="text-white font-bold">{kit.primary.plates} placas</span></div>
            <div><span className="text-white/50">Geração:</span> <span className="text-white font-bold">{kit.primary.kwhMonth.toFixed(0)} kWh/mês</span></div>
            <div><span className="text-white/50">Economia mensal:</span> <span className="text-white font-bold">{formatCurrency(kit.primary.economyMonthly)}</span></div>
            <div><span className="text-white/50">Preço base:</span> <span className="text-white font-bold">{formatCurrency(kit.totalPrice)}</span></div>
            {kit.secondary && <>
              <div className="col-span-2 text-white/40 text-xs mt-1">+ Kit complementar: {kit.secondary.plates} placas ({kit.secondary.kwhMonth.toFixed(0)} kWh/mês)</div>
            </>}
            {kit.finalPrice !== kit.totalPrice && (
              <div className="col-span-2"><span className="text-white/50">Estrutura metálica:</span> <span className="text-shams-neon font-bold">+{formatCurrency(kit.finalPrice - kit.totalPrice)}</span></div>
            )}
          </div>
        )}
      </div>

      {/* Entry value */}
      <div className="shams-card p-4">
        <label className="label-field flex items-center gap-1">
          <Zap size={13} className="text-shams-neon" />
          Valor de entrada (opcional — para todas as modalidades)
        </label>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-white/50 font-medium">R$</span>
          <input type="number" min="0" step="500" className="input-field flex-1"
            placeholder="0,00" value={entryValue || ''}
            onChange={e => { onEntryChange(Number(e.target.value)); setInstallments(activeMethod === 'avista' ? 1 : INSTALLMENT_OPTS[activeMethod][0]) }} />
        </div>
        {entryValue > 0 && (
          <p className="text-white/40 text-xs mt-1">Saldo financiado: {formatCurrency(kit.finalPrice - entryValue)}</p>
        )}
      </div>

      {/* Method tabs */}
      <div>
        <div className="text-white/40 text-xs uppercase tracking-wider mb-3">Condição de pagamento</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.entries(METHOD_CONFIG) as [Method, typeof METHOD_CONFIG[Method]][]).map(([key, cfg]) => (
            <button key={key}
              onClick={() => { setActiveMethod(key); setInstallments(INSTALLMENT_OPTS[key][0]); }}
              className={`p-3 rounded-xl border-2 text-left transition-all ${
                activeMethod === key ? 'border-shams-light bg-shams-light/10' : 'border-shams-green/20 hover:border-shams-green/50'
              }`}>
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cfg.color} flex items-center justify-center mb-2`}>
                <cfg.icon size={14} className="text-white" />
              </div>
              <div className={`font-bold text-xs ${activeMethod === key ? 'text-white' : 'text-white/60'}`}>{cfg.label}</div>
              <div className="text-white/40 text-xs">{cfg.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Installments (for cartao/financiamento) */}
      {(activeMethod === 'cartao' || activeMethod === 'financiamento') && (
        <div>
          <div className="text-white/40 text-xs uppercase tracking-wider mb-2">Número de parcelas</div>
          <div className="flex flex-wrap gap-2">
            {INSTALLMENT_OPTS[activeMethod].map(n => {
              const p = getPayment(activeMethod, n)
              return (
                <button key={n}
                  onClick={() => setInstallments(n)}
                  className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                    installments === n
                      ? 'border-shams-light bg-shams-light/10 text-white'
                      : 'border-shams-green/20 text-white/50 hover:border-shams-green/40'
                  }`}>
                  <span className="font-bold">{n}x</span>
                  {p && <span className="text-xs opacity-60 ml-1">{formatCurrency(p.installmentValue)}</span>}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Result card */}
      {currentPayment && (
        <div className="shams-card p-5 border-shams-light/50">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-white/60 text-xs mb-1">Valor da proposta</div>
              <div className="text-3xl font-black text-white">
                {activeMethod === 'avista'
                  ? formatCurrency(currentPayment.totalValue)
                  : `${installments === 5 && activeMethod === 'boleto' ? '5x' : `${installments}x`} de ${formatCurrency(currentPayment.installmentValue)}`
                }
              </div>
              {activeMethod !== 'avista' && (
                <div className="text-white/50 text-sm mt-1">Total: {formatCurrency(currentPayment.totalValue)}</div>
              )}
              {activeMethod === 'avista' && (
                <div className="text-shams-neon text-sm mt-1">15% de desconto aplicado ✓</div>
              )}
              {entryValue > 0 && (
                <div className="text-shams-cyan text-sm mt-0.5">Entrada: {formatCurrency(entryValue)} + {installments}x de {formatCurrency(currentPayment.installmentValue)}</div>
              )}
            </div>
            <button
              onClick={() => onSelect(currentPayment)}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${
                selectedPayment?.method === currentPayment.method && selectedPayment.installments === currentPayment.installments
                  ? 'bg-shams-neon text-shams-black'
                  : 'bg-shams-green/30 text-shams-light hover:bg-shams-green/50'
              }`}>
              {selectedPayment?.method === currentPayment.method && selectedPayment.installments === currentPayment.installments
                ? '✓ Selecionado' : 'Selecionar'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-shams-green/20">
            <div className="text-center">
              <div className="text-white/40 text-xs">Economia/mês</div>
              <div className="text-shams-neon font-bold text-sm">{formatCurrency(kit.primary.economyMonthly + (kit.secondary?.economyMonthly ?? 0))}</div>
            </div>
            <div className="text-center">
              <div className="text-white/40 text-xs">Economia/ano</div>
              <div className="text-shams-light font-bold text-sm">{formatCurrency((kit.primary.economyMonthly + (kit.secondary?.economyMonthly ?? 0)) * 12)}</div>
            </div>
            <div className="text-center">
              <div className="text-white/40 text-xs">Preço base</div>
              <div className="text-white font-bold text-sm">{formatCurrency(kit.finalPrice)}</div>
            </div>
          </div>
        </div>
      )}

      {!selectedPayment && (
        <p className="text-amber-400/70 text-sm text-center">Selecione uma condição de pagamento para prosseguir.</p>
      )}
    </div>
  )
}
