// ============================================================
// SHAMS Solar — Motor de Cálculos
// ============================================================
import type {
  KitEntry, SelectedKit, PaymentOption, ConsumptionData,
  InstallOptions, ProductLine, ROIResult
} from './types'
import {
  PREMIUM_KITS, STANDARD_KITS, CASH_DISCOUNT,
  INTEREST_RATES, INSTALLMENT_OPTIONS, METAL_STRUCTURE_PRICE
} from './pricing'

// ── 1. Consumo Total ─────────────────────────────────────────
export function calcTotalConsumption(c: Partial<ConsumptionData>): number {
  let total = c.currentKwh ?? 0
  if (c.hasAC)          total += (c.acUnits ?? 1) * (c.acKwh ?? 300)
  if (c.hasEV)          total += c.evKwh ?? 200
  if (c.hasHeatedPool)  total += c.heatedPoolKwh ?? 400
  if (c.hasHeatedFloor) total += c.heatedFloorKwh ?? 300
  if (c.hasOthers)      total += c.othersKwh ?? 0
  return Math.round(total)
}

// ── 2. Seleção de Kit ────────────────────────────────────────
export function selectKit(
  targetKwh: number,
  line: ProductLine,
  options: Partial<Pick<InstallOptions, 'metalStructure' | 'metalStructureM2'>>
): SelectedKit {
  const kits = line === 'premium' ? PREMIUM_KITS : STANDARD_KITS

  // Menor kit que cobre o consumo
  const covering = kits.filter(k => k.kwhMonth >= targetKwh)
  let primary:   KitEntry
  let secondary: KitEntry | undefined

  if (covering.length > 0) {
    primary = covering[0]
  } else {
    // Acima do maior kit — composição de dois kits
    const largest   = kits[kits.length - 1]
    const remaining = targetKwh - largest.kwhMonth
    primary = largest
    const secCovering = kits.filter(k => k.kwhMonth >= remaining)
    secondary = secCovering.length > 0 ? secCovering[0] : kits[kits.length - 1]
  }

  const basePrice  = primary.priceAVista + (secondary?.priceAVista ?? 0)
  const metalCost  = (options.metalStructure && options.metalStructureM2)
    ? options.metalStructureM2 * METAL_STRUCTURE_PRICE : 0
  const totalKwh   = primary.kwhMonth + (secondary?.kwhMonth ?? 0)
  const totalPlates = primary.plates   + (secondary?.plates   ?? 0)
  const finalPrice  = basePrice + metalCost

  return {
    primary, secondary, totalPlates, totalKwh,
    totalPrice: basePrice, finalPrice, line,
    coverage: Math.min(100, Math.round((totalKwh / targetKwh) * 100)),
  }
}

// ── 3. PMT (Price Table / Parcela) ──────────────────────────
export function calcPMT(principal: number, rate: number, months: number): number {
  if (rate === 0) return principal / months
  return principal * rate / (1 - Math.pow(1 + rate, -months))
}

// ── 4. Todas as condições de pagamento ──────────────────────
export function calcPaymentOptions(basePrice: number, entryValue = 0): PaymentOption[] {
  const financed = Math.max(0, basePrice - entryValue)
  const options: PaymentOption[] = []

  // À vista
  const aVista = basePrice * (1 - CASH_DISCOUNT)
  options.push({ method: 'avista', installments: 1, entryValue: 0,
    installmentValue: parseFloat(aVista.toFixed(2)),
    totalValue:       parseFloat(aVista.toFixed(2)),
    interestRate: 0 })

  // Boleto 5x
  const boletoParc = financed / 5
  options.push({ method: 'boleto', installments: 5, entryValue,
    installmentValue: parseFloat(boletoParc.toFixed(2)),
    totalValue:       parseFloat((entryValue + boletoParc * 5).toFixed(2)),
    interestRate: 0 })

  // Cartão (1% a.m., até 21x)
  for (const n of INSTALLMENT_OPTIONS.cartao) {
    const rate = INTEREST_RATES.cartao
    const parc = calcPMT(financed, rate, n)
    options.push({ method: 'cartao', installments: n, entryValue,
      installmentValue: parseFloat(parc.toFixed(2)),
      totalValue:       parseFloat((entryValue + parc * n).toFixed(2)),
      interestRate: rate })
  }

  // Financiamento (1,7% a.m., até 72x)
  for (const n of INSTALLMENT_OPTIONS.financiamento) {
    const rate = INTEREST_RATES.financiamento
    const parc = calcPMT(financed, rate, n)
    options.push({ method: 'financiamento', installments: n, entryValue,
      installmentValue: parseFloat(parc.toFixed(2)),
      totalValue:       parseFloat((entryValue + parc * n).toFixed(2)),
      interestRate: rate })
  }

  return options
}

// ── 5. ROI / Payback / 25 anos ───────────────────────────────
export function calcROI(kit: SelectedKit, investment: number): ROIResult {
  const INFLATION      = 0.058
  const DEGRADATION_25 = 0.20
  const monthlyEconomy = kit.primary.economyMonthly + (kit.secondary?.economyMonthly ?? 0)
  const annualSavings  = monthlyEconomy * 12

  let cumulative    = -investment
  let paybackYears  = 0
  const cashflowTable = []

  for (let year = 0; year <= 25; year++) {
    const degradFactor    = 1 - (DEGRADATION_25 * year / 25)
    const inflatedCost    = annualSavings * Math.pow(1 + INFLATION, year)
    const adjustedSavings = inflatedCost * degradFactor
    if (year > 0) cumulative += adjustedSavings
    if (year > 0 && cumulative >= 0 && paybackYears === 0) paybackYears = year
    cashflowTable.push({
      year,
      energyCost: parseFloat(inflatedCost.toFixed(2)),
      cashflow:   parseFloat(adjustedSavings.toFixed(2)),
      balance:    parseFloat(cumulative.toFixed(2)),
    })
  }

  return {
    annualSavings:   parseFloat(annualSavings.toFixed(2)),
    paybackYears:    paybackYears || 25,
    roiPercent:      investment > 0 ? parseFloat(((annualSavings / investment) * 100).toFixed(2)) : 0,
    returnIn25Years: parseFloat((cashflowTable[25]?.balance ?? 0).toFixed(2)),
    cashflowTable,
  }
}

// ── 6. Número da proposta ────────────────────────────────────
export function generateProposalNumber(): string {
  const now    = new Date()
  const year   = now.getFullYear().toString().slice(-2)
  const month  = String(now.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 9000) + 1000
  return `${year}${month}${random}`
}

// ── 7. Formatadores ──────────────────────────────────────────
export function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
}
