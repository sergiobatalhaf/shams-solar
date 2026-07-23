// ============================================================
// SHAMS Solar — Type Definitions
// ============================================================

export type ProductLine = 'premium' | 'standard'

export interface KitEntry {
  plates:         number
  economyMonthly: number   // R$/mês de economia (= kWh gerado × 1.04)
  priceAVista:    number   // Preço à vista linha premium
  kwhMonth:       number   // kWh gerados por mês
}

export interface PricingTable {
  kwhPrice:         number
  standardDiscount: number
  cashDiscount:     number
  kits:             KitEntry[]
}

export interface ClientData {
  name:         string
  company?:     string
  city:         string
  neighborhood: string
  address?:     string
  phone?:       string
  email?:       string
  roofType:     'telha_ceramica' | 'telha_metalica' | 'laje' | 'fibrocimento' | 'outro'
  roofFace:     'norte' | 'sul' | 'leste' | 'oeste' | 'nordeste' | 'noroeste' | 'sudeste' | 'sudoeste'
}

export interface ConsumptionData {
  currentKwh:     number
  hasAC:          boolean
  acUnits?:       number
  acKwh?:         number
  hasEV:          boolean
  evKwh?:         number
  hasHeatedPool:  boolean
  heatedPoolKwh?: number
  hasHeatedFloor: boolean
  heatedFloorKwh?: number
  hasOthers:      boolean
  othersDesc?:    string
  othersKwh?:     number
  totalKwh:       number
}

export type InverterDistance = '<30m' | '<50m' | '<100m'

export interface InstallOptions {
  inverterDistance:   InverterDistance
  metalStructure:     boolean
  metalStructureM2:   number
  metalStructureCost: number
  productLine:        ProductLine
}

export type PaymentMethod = 'avista' | 'boleto' | 'cartao' | 'financiamento'

export interface PaymentOption {
  method:           PaymentMethod
  installments:     number
  entryValue:       number
  installmentValue: number
  totalValue:       number
  interestRate:     number
}

export interface SelectedKit {
  primary:      KitEntry
  secondary?:   KitEntry
  totalPlates:  number
  totalKwh:     number
  totalPrice:   number
  finalPrice:   number
  line:         ProductLine
  coverage:     number
}

export interface CashflowRow {
  year:       number
  energyCost: number
  cashflow:   number
  balance:    number
}

export interface ROIResult {
  annualSavings:   number
  paybackYears:    number
  roiPercent:      number
  returnIn25Years: number
  cashflowTable:   CashflowRow[]
}

export interface ProposalData {
  id?:             string
  proposalNumber?: string
  createdAt?:      string
  vendorName?:     string
  client:          ClientData
  consumption:     ConsumptionData
  options:         InstallOptions
  kit:             SelectedKit
  selectedPayment: PaymentOption
  allPayments:     PaymentOption[]
  annualSavings:   number
  paybackYears:    number
  roiPercent:      number
  returnIn25Years: number
  roi?:            ROIResult
  status:          'draft' | 'sent' | 'approved' | 'rejected'
}

// ── Labels ──────────────────────────────────────────────────

export const ROOF_TYPE_LABELS: Record<ClientData['roofType'], string> = {
  telha_ceramica: 'Telha Cerâmica',
  telha_metalica: 'Telha Metálica',
  laje:           'Laje',
  fibrocimento:   'Fibrocimento (Eternit)',
  outro:          'Outro',
}

export const ROOF_FACE_LABELS: Record<ClientData['roofFace'], string> = {
  norte:    'Norte',    sul:      'Sul',
  leste:    'Leste',   oeste:    'Oeste',
  nordeste: 'Nordeste', noroeste: 'Noroeste',
  sudeste:  'Sudeste', sudoeste: 'Sudoeste',
}

export const INVERTER_DISTANCE_LABELS: Record<InverterDistance, string> = {
  '<30m':  'Menos de 30 metros',
  '<50m':  'Entre 30 e 50 metros',
  '<100m': 'Entre 50 e 100 metros',
}
