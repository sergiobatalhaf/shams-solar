// ============================================================
// SHAMS Solar — Tabela de Preços e Configuração
// ============================================================
import type { PricingTable, KitEntry } from './types'

export const KWH_PRICE            = 1.04
export const STANDARD_DISCOUNT    = 0.20
export const CASH_DISCOUNT        = 0.15
export const METAL_STRUCTURE_PRICE = 1000

export const INTEREST_RATES = {
  avista:        0,
  boleto:        0,
  cartao:        0.01,
  financiamento: 0.017,
}

export const INSTALLMENT_OPTIONS = {
  boleto:        [5],
  cartao:        [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 21],
  financiamento: [12, 18, 24, 36, 48, 60, 72],
}

// Tabela Premium (fonte: tabela fornecida pelo cliente)
const RAW: Array<{ plates: number; economy: number; price: number }> = [
  { plates:  4, economy:  250, price: 10923.59 },
  { plates:  6, economy:  350, price: 13570.11 },
  { plates:  8, economy:  450, price: 17279.80 },
  { plates: 10, economy:  550, price: 22129.66 },
  { plates: 12, economy:  650, price: 25256.08 },
  { plates: 14, economy:  750, price: 28545.68 },
  { plates: 16, economy:  850, price: 32204.00 },
  { plates: 18, economy:  950, price: 35175.03 },
  { plates: 20, economy: 1050, price: 40482.84 },
  { plates: 24, economy: 1250, price: 46670.73 },
  { plates: 30, economy: 1550, price: 61075.89 },
  { plates: 40, economy: 2000, price: 79846.02 },
]

export const PREMIUM_KITS: KitEntry[] = RAW.map(k => ({
  plates:          k.plates,
  economyMonthly:  k.economy,
  priceAVista:     k.price,
  kwhMonth:        parseFloat((k.economy / KWH_PRICE).toFixed(2)),
}))

export const STANDARD_KITS: KitEntry[] = PREMIUM_KITS.map(k => ({
  ...k,
  priceAVista: parseFloat((k.priceAVista * (1 - STANDARD_DISCOUNT)).toFixed(2)),
}))

export function getKits(line: 'premium' | 'standard'): KitEntry[] {
  return line === 'premium' ? PREMIUM_KITS : STANDARD_KITS
}

export const DEFAULT_PRICING: PricingTable = {
  kwhPrice: KWH_PRICE, standardDiscount: STANDARD_DISCOUNT,
  cashDiscount: CASH_DISCOUNT, kits: PREMIUM_KITS,
}
