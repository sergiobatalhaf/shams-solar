'use client'

import { useState, useMemo, useCallback } from 'react'
import StepProgress from './StepProgress'
import StepClient from './StepClient'
import StepConsumption from './StepConsumption'
import StepAdditions, { type AdditionsState } from './StepAdditions'
import StepOptions, { type OptionsState } from './StepOptions'
import StepPayment from './StepPayment'
import StepSummary from './StepSummary'

import type { ClientData, ConsumptionData, ProposalData, PaymentOption } from '@/lib/types'
import { calcTotalConsumption, selectKit, calcPaymentOptions, calcROI, generateProposalNumber } from '@/lib/calculations'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, ArrowRight, Sun } from 'lucide-react'

const STEP_LABELS = ['Cliente', 'Consumo', 'Adições', 'Opções', 'Pagamento', 'Proposta']
const TOTAL_STEPS = 6

// Default additions state
const DEFAULT_ADDITIONS: AdditionsState = {
  hasAC: false, acUnits: 1, acKwh: 300,
  hasEV: false, evKwh: 200,
  hasHeatedPool: false, heatedPoolKwh: 400,
  hasHeatedFloor: false, heatedFloorKwh: 300,
  hasOthers: false, othersDesc: '', othersKwh: 0,
}

const DEFAULT_OPTIONS: OptionsState = {
  inverterDistance: '<30m',
  metalStructure: false,
  metalStructureM2: 0,
  productLine: 'premium',
}

export default function SimulatorWizard() {
  const [step, setStep] = useState(1)
  const [vendorName, setVendorName] = useState('')
  const [client, setClient] = useState<Partial<ClientData>>({})
  const [currentKwh, setCurrentKwh] = useState(0)
  const [additions, setAdditions] = useState<AdditionsState>(DEFAULT_ADDITIONS)
  const [options, setOptions] = useState<OptionsState>(DEFAULT_OPTIONS)
  const [entryValue, setEntryValue] = useState(0)
  const [selectedPayment, setSelectedPayment] = useState<PaymentOption | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [proposalNumber] = useState(generateProposalNumber())

  // Computed consumption
  const totalKwh = useMemo(() => calcTotalConsumption({
    currentKwh,
    hasAC: additions.hasAC, acUnits: additions.acUnits, acKwh: additions.acKwh,
    hasEV: additions.hasEV, evKwh: additions.evKwh,
    hasHeatedPool: additions.hasHeatedPool, heatedPoolKwh: additions.heatedPoolKwh,
    hasHeatedFloor: additions.hasHeatedFloor, heatedFloorKwh: additions.heatedFloorKwh,
    hasOthers: additions.hasOthers, othersKwh: additions.othersKwh,
  }), [currentKwh, additions])

  // Select kit based on consumption + options
  const kit = useMemo(() => {
    if (totalKwh <= 0) return null
    return selectKit(totalKwh, options.productLine, {
      metalStructure: options.metalStructure,
      metalStructureM2: options.metalStructureM2,
    })
  }, [totalKwh, options])

  // ROI calculation
  const roi = useMemo(() => {
    if (!kit) return null
    return calcROI(kit, kit.finalPrice)
  }, [kit])

  // Full consumption data object
  const consumptionData: ConsumptionData = {
    currentKwh,
    hasAC: additions.hasAC, acUnits: additions.acUnits, acKwh: additions.acKwh,
    hasEV: additions.hasEV, evKwh: additions.evKwh,
    hasHeatedPool: additions.hasHeatedPool, heatedPoolKwh: additions.heatedPoolKwh,
    hasHeatedFloor: additions.hasHeatedFloor, heatedFloorKwh: additions.heatedFloorKwh,
    hasOthers: additions.hasOthers, othersDesc: additions.othersDesc, othersKwh: additions.othersKwh,
    totalKwh,
  }

  // Full install options
  const installOptions = {
    inverterDistance: options.inverterDistance,
    metalStructure: options.metalStructure,
    metalStructureM2: options.metalStructureM2,
    metalStructureCost: options.metalStructureM2 * 1000,
    productLine: options.productLine,
  }

  // Build full proposal object
  const proposal: ProposalData = {
    proposalNumber,
    createdAt: new Date().toISOString(),
    vendorName,
    client: client as ClientData,
    consumption: consumptionData,
    options: installOptions,
    kit: kit!,
    selectedPayment: selectedPayment!,
    allPayments: kit ? calcPaymentOptions(kit.finalPrice, entryValue) : [],
    annualSavings: roi?.annualSavings ?? 0,
    paybackYears: roi?.paybackYears ?? 0,
    roiPercent: roi?.roiPercent ?? 0,
    returnIn25Years: roi?.returnIn25Years ?? 0,
    status: 'draft',
  }
  if (roi) (proposal as any).roi = roi

  // Validation per step
  const canProceed = useMemo(() => {
    if (step === 1) return !!client.name && !!client.city && !!client.neighborhood && !!client.roofType && !!client.roofFace && !!vendorName
    if (step === 2) return currentKwh > 0
    if (step === 3) return true
    if (step === 4) return true
    if (step === 5) return !!selectedPayment
    return true
  }, [step, client, vendorName, currentKwh, selectedPayment])

  const next = () => { if (canProceed && step < TOTAL_STEPS) setStep(s => s + 1) }
  const back = () => { if (step > 1) setStep(s => s - 1) }

  // Save proposal to Supabase
  const handleSave = useCallback(async () => {
    if (!kit || !selectedPayment) return
    setSaving(true)
    try {
      // Save client
      const { data: clientRow, error: clientErr } = await supabase.from('clientes').insert({
        nome: client.name,
        empresa: client.company,
        cidade: client.city,
        bairro: client.neighborhood,
        endereco: client.address,
        telefone: client.phone,
        email: client.email,
        tipo_telhado: client.roofType,
        face_telhado: client.roofFace,
      }).select('id').single()

      if (clientErr) throw clientErr

      // Save proposal
      await supabase.from('propostas').insert({
        numero_proposta: proposalNumber,
        cliente_id: clientRow.id,
        vendedor_nome: vendorName,
        consumo_atual_kwh: currentKwh,
        tem_ar_condicionado: additions.hasAC,
        qtd_ar_condicionado: additions.acUnits,
        kwh_ar_condicionado: additions.acKwh,
        tem_carro_eletrico: additions.hasEV,
        kwh_carro_eletrico: additions.evKwh,
        tem_piscina_aquecida: additions.hasHeatedPool,
        kwh_piscina_aquecida: additions.heatedPoolKwh,
        tem_piso_aquecido: additions.hasHeatedFloor,
        kwh_piso_aquecido: additions.heatedFloorKwh,
        tem_outros: additions.hasOthers,
        desc_outros: additions.othersDesc,
        kwh_outros: additions.othersKwh,
        consumo_total_kwh: totalKwh,
        distancia_inversor: options.inverterDistance,
        estrutura_metalica: options.metalStructure,
        estrutura_m2: options.metalStructureM2,
        estrutura_custo: options.metalStructure ? options.metalStructureM2 * 1000 : 0,
        linha_produto: options.productLine,
        kit_placas_principal: kit.primary.plates,
        kit_economia_principal: kit.primary.economyMonthly,
        kit_preco_principal: kit.primary.priceAVista,
        kit_kwh_principal: kit.primary.kwhMonth,
        kit_placas_secundario: kit.secondary?.plates,
        kit_economia_secundario: kit.secondary?.economyMonthly,
        kit_preco_secundario: kit.secondary?.priceAVista,
        kit_kwh_secundario: kit.secondary?.kwhMonth,
        kit_total_placas: kit.totalPlates,
        kit_total_kwh: kit.totalKwh,
        kit_preco_total: kit.totalPrice,
        kit_preco_final: kit.finalPrice,
        kit_cobertura_pct: kit.coverage,
        pagamento_metodo: selectedPayment.method,
        pagamento_parcelas: selectedPayment.installments,
        pagamento_entrada: selectedPayment.entryValue,
        pagamento_valor_parcela: selectedPayment.installmentValue,
        pagamento_total: selectedPayment.totalValue,
        economia_anual: roi?.annualSavings,
        payback_anos: roi?.paybackYears,
        roi_pct_ano: roi?.roiPercent,
        retorno_25_anos: roi?.returnIn25Years,
        fluxo_caixa_json: roi?.cashflowTable,
        status: 'draft',
      })
      setSaved(true)
    } catch (e) {
      console.error('Error saving proposal:', e)
    } finally {
      setSaving(false)
    }
  }, [kit, selectedPayment, client, vendorName, currentKwh, additions, options, totalKwh, proposalNumber, roi])

  return (
    <div className="min-h-screen bg-shams-black pt-20 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-shams-green/10 border border-shams-green/30 rounded-full px-4 py-1.5 mb-4">
            <Sun size={14} className="text-shams-neon" />
            <span className="text-shams-neon text-xs font-semibold uppercase tracking-wider">Simulador SHAMS</span>
          </div>
          <h1 className="text-3xl font-black text-white">Proposta Comercial</h1>
          <p className="text-white/40 text-sm mt-1">Sistema Fotovoltaico · Proposta nº {proposalNumber}</p>
        </div>

        {/* Progress */}
        <StepProgress step={step} total={TOTAL_STEPS} labels={STEP_LABELS} />

        {/* Step content */}
        <div className="animate-fade-in">
          {step === 1 && <StepClient data={client} vendorName={vendorName} onChange={setClient} onVendorChange={setVendorName} />}
          {step === 2 && <StepConsumption currentKwh={currentKwh} onChange={setCurrentKwh} />}
          {step === 3 && <StepAdditions currentKwh={currentKwh} state={additions} onChange={setAdditions} />}
          {step === 4 && <StepOptions state={options} onChange={setOptions} />}
          {step === 5 && kit && (
            <StepPayment
              kit={kit}
              entryValue={entryValue}
              selectedPayment={selectedPayment}
              onEntryChange={setEntryValue}
              onSelect={setSelectedPayment}
            />
          )}
          {step === 6 && kit && selectedPayment && (
            <StepSummary
              proposal={proposal}
              onSave={handleSave}
              saving={saving}
              saved={saved}
            />
          )}
          {step === 5 && !kit && (
            <div className="text-center py-12 text-white/50">
              <p>Por favor, informe o consumo no passo 2 para dimensionar o kit.</p>
              <button onClick={() => setStep(2)} className="btn-outline mt-4 mx-auto">Voltar ao Consumo</button>
            </div>
          )}
        </div>

        {/* Navigation */}
        {step < TOTAL_STEPS && (
          <div className={`flex mt-8 gap-3 ${step === 1 ? 'justify-end' : 'justify-between'}`}>
            {step > 1 && (
              <button onClick={back} className="btn-outline flex items-center gap-2 px-6">
                <ArrowLeft size={16} /> Voltar
              </button>
            )}
            <button
              onClick={next}
              disabled={!canProceed}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-bold transition-all ${
                canProceed
                  ? 'btn-primary'
                  : 'bg-shams-surface text-white/30 cursor-not-allowed'
              }`}>
              {step === TOTAL_STEPS - 1 ? 'Ver Proposta' : 'Continuar'}
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {step === TOTAL_STEPS && (
          <div className="flex justify-center mt-6">
            <button onClick={() => setStep(TOTAL_STEPS - 1)} className="btn-outline flex items-center gap-2">
              <ArrowLeft size={16} /> Ajustar Pagamento
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
