'use client'
import dynamic from 'next/dynamic'
import type { ProposalData } from '@/lib/types'
import { formatCurrency, calcROI } from '@/lib/calculations'
import { FileDown, Save, Loader2, CheckCircle2, Sun } from 'lucide-react'

// Dynamically import PDF components (client-only)
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then(m => m.PDFDownloadLink),
  { ssr: false, loading: () => <button className="btn-primary opacity-50 cursor-wait flex items-center gap-2"><Loader2 size={18} className="animate-spin"/>Preparando PDF...</button> }
)

interface Props {
  proposal: ProposalData
  onSave: () => Promise<void>
  saving: boolean
  saved: boolean
}

// Lazy import the PDF document
const ProposalDocument = dynamic(() => import('@/lib/pdf/ProposalDocument'), { ssr: false })

export default function StepSummary({ proposal, onSave, saving, saved }: Props) {
  const { client, consumption, options, kit, selectedPayment, roi } = proposal
  const roiData = roi ?? calcROI(kit, kit.finalPrice)

  const lineLabel = kit.line === 'premium' ? '🏆 LINHA PREMIUM' : '⭐ LINHA STANDARD'
  const payLabel = selectedPayment?.method === 'avista' ? 'À Vista (15% desc.)'
    : selectedPayment?.method === 'boleto' ? `Boleto ${selectedPayment.installments}x s/ juros`
    : selectedPayment?.method === 'cartao' ? `Cartão ${selectedPayment.installments}x (1% a.m.)`
    : `Financiamento ${selectedPayment?.installments}x (1,7% a.m.)`

  return (
    <div className="space-y-6">
      <div>
        <div className="section-subtitle mb-1">Proposta Concluída</div>
        <h2 className="text-2xl font-bold text-white mb-1">Resumo da Proposta</h2>
        <p className="text-white/50 text-sm">Proposta nº {proposal.proposalNumber} · {new Date().toLocaleDateString('pt-BR')}</p>
      </div>

      {/* Client header */}
      <div className="shams-gradient rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Sun size={24} className="text-white" />
          </div>
          <div>
            <div className="text-white font-black text-xl">{client.name}</div>
            <div className="text-white/70 text-sm">{client.city} — {client.neighborhood}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 pt-3 border-t border-white/20">
          <div><div className="text-white/50 text-xs">Consumo</div><div className="text-white font-bold">{consumption.totalKwh} kWh/mês</div></div>
          <div><div className="text-white/50 text-xs">Sistema</div><div className="text-white font-bold">{kit.totalPlates} placas</div></div>
          <div><div className="text-white/50 text-xs">Geração</div><div className="text-white font-bold">{kit.totalKwh.toFixed(0)} kWh/mês</div></div>
          <div><div className="text-white/50 text-xs">Cobertura</div><div className="text-white font-bold">{kit.coverage}%</div></div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* System */}
        <div className="shams-card p-4 space-y-2">
          <div className="text-shams-cyan text-xs font-semibold uppercase tracking-wider mb-3">Sistema</div>
          <Row label="Linha" value={lineLabel} />
          <Row label="Placas" value={`${kit.totalPlates} unidades`} />
          <Row label="Geração mensal" value={`${kit.totalKwh.toFixed(0)} kWh`} />
          <Row label="Tipo de telhado" value={client.roofType ?? '—'} />
          <Row label="Face" value={client.roofFace ?? '—'} />
          <Row label="Dist. inversor" value={options.inverterDistance} />
          {options.metalStructure && <Row label="Estrutura metálica" value={`${options.metalStructureM2} m²`} />}
        </div>

        {/* Financial */}
        <div className="shams-card p-4 space-y-2">
          <div className="text-shams-cyan text-xs font-semibold uppercase tracking-wider mb-3">Financeiro</div>
          <Row label="Preço do kit" value={formatCurrency(kit.totalPrice)} />
          {options.metalStructure && <Row label="Estrutura" value={`+ ${formatCurrency(kit.finalPrice - kit.totalPrice)}`} />}
          <Row label="Valor total" value={formatCurrency(kit.finalPrice)} highlight />
          <Row label="Pagamento" value={payLabel} />
          {selectedPayment && selectedPayment.method !== 'avista' && (
            <Row label="Parcela" value={`${selectedPayment.installments}x ${formatCurrency(selectedPayment.installmentValue)}`} />
          )}
          {selectedPayment?.entryValue > 0 && <Row label="Entrada" value={formatCurrency(selectedPayment.entryValue)} />}
          <Row label="Total pago" value={formatCurrency(selectedPayment?.totalValue ?? kit.finalPrice)} />
        </div>

        {/* ROI */}
        <div className="shams-card p-4 space-y-2">
          <div className="text-shams-neon text-xs font-semibold uppercase tracking-wider mb-3">Retorno do Investimento</div>
          <Row label="Economia mensal" value={formatCurrency(kit.primary.economyMonthly + (kit.secondary?.economyMonthly ?? 0))} />
          <Row label="Economia anual" value={formatCurrency(roiData.annualSavings)} />
          <Row label="Payback" value={`${roiData.paybackYears} anos`} highlight />
          <Row label="ROI ao ano" value={`${roiData.roiPercent}%`} />
          <Row label="Retorno em 25 anos" value={formatCurrency(roiData.returnIn25Years)} highlight />
        </div>

        {/* Consumption breakdown */}
        <div className="shams-card p-4 space-y-2">
          <div className="text-shams-cyan text-xs font-semibold uppercase tracking-wider mb-3">Consumo Detalhado</div>
          <Row label="Consumo atual" value={`${consumption.currentKwh} kWh`} />
          {consumption.hasAC && <Row label="Ar-condicionado" value={`+${consumption.acUnits! * consumption.acKwh!} kWh`} />}
          {consumption.hasEV && <Row label="Carro elétrico" value={`+${consumption.evKwh} kWh`} />}
          {consumption.hasHeatedPool && <Row label="Piscina aquecida" value={`+${consumption.heatedPoolKwh} kWh`} />}
          {consumption.hasHeatedFloor && <Row label="Piso aquecido" value={`+${consumption.heatedFloorKwh} kWh`} />}
          {consumption.hasOthers && <Row label="Outros" value={`+${consumption.othersKwh} kWh`} />}
          <div className="border-t border-shams-green/20 pt-2 mt-2">
            <Row label="TOTAL" value={`${consumption.totalKwh} kWh/mês`} highlight />
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="shams-card p-4">
        <div className="text-shams-cyan text-xs font-semibold uppercase tracking-wider mb-3">🛡️ Garantias Incluídas</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          {[
            { g: 'Inversores', v: '10 anos' },
            { g: 'Painel (defeito)', v: '12 anos' },
            { g: 'Painel (vida)', v: '25 anos' },
            { g: 'Instalação', v: '12 meses' },
          ].map(item => (
            <div key={item.g} className="bg-shams-surface rounded-lg p-3">
              <div className="text-shams-neon font-black text-base">{item.v}</div>
              <div className="text-white/50 text-xs mt-0.5">{item.g}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {/* PDF Download */}
        {typeof window !== 'undefined' && ProposalDocument && (
          <PDFDownloadLink
            document={<ProposalDocument proposal={proposal} />}
            fileName={`Proposta_SHAMS_${proposal.proposalNumber}_${client.name?.replace(/\s+/g, '_')}.pdf`}
            className="flex-1"
          >
            {({ loading }) => (
              <button className="w-full btn-primary flex items-center justify-center gap-2 py-4 text-base">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <FileDown size={20} />}
                {loading ? 'Gerando PDF...' : '📄 Baixar Proposta em PDF'}
              </button>
            )}
          </PDFDownloadLink>
        )}

        {/* Save to Supabase */}
        <button
          onClick={onSave}
          disabled={saving || saved}
          className="flex-1 btn-outline flex items-center justify-center gap-2 py-4 text-base">
          {saving ? <Loader2 size={18} className="animate-spin" /> : saved ? <CheckCircle2 size={18} className="text-shams-neon" /> : <Save size={18} />}
          {saving ? 'Salvando...' : saved ? 'Salvo com sucesso!' : 'Salvar Proposta'}
        </button>
      </div>

      <p className="text-white/30 text-xs text-center">
        Proposta nº {proposal.proposalNumber} · Gerada em {new Date().toLocaleString('pt-BR')} · SHAMS Energia Solar
      </p>
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-white/50">{label}</span>
      <span className={highlight ? 'text-shams-neon font-bold' : 'text-white font-medium'}>{value}</span>
    </div>
  )
}
