'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { PREMIUM_KITS } from '@/lib/pricing'
import { formatCurrency } from '@/lib/calculations'
import type { KitEntry } from '@/lib/types'
import {
  Lock, LogOut, Table2, FileText, Settings, Save, RefreshCw,
  ChevronDown, ChevronUp, Eye, Trash2, CheckCircle, AlertCircle, Sun, Loader2
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// Admin password (env var, fallback to 'shams2024')
// ─────────────────────────────────────────────────────────
const ADMIN_PW = process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? 'shams2024'

type Tab = 'precos' | 'propostas' | 'config'

// ─────────────────────────────────────────────────────────
// Login screen
// ─────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pw === ADMIN_PW) { onLogin() }
    else { setErr(true); setTimeout(() => setErr(false), 2000) }
  }

  return (
    <div className="min-h-screen bg-shams-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 shams-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-white" />
          </div>
          <div className="font-black text-white text-2xl tracking-widest mb-1">SHAMS</div>
          <div className="text-shams-cyan text-sm">Área Administrativa</div>
        </div>
        <form onSubmit={submit} className="shams-card p-6 space-y-4">
          <div>
            <label className="label-field">Senha de acesso</label>
            <input
              type="password"
              className={`input-field ${err ? 'border-red-500' : ''}`}
              placeholder="••••••••"
              value={pw}
              onChange={e => setPw(e.target.value)}
              autoFocus
            />
            {err && <p className="text-red-400 text-xs mt-1">Senha incorreta.</p>}
          </div>
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Lock size={16} /> Entrar
          </button>
        </form>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Pricing table editor
// ─────────────────────────────────────────────────────────
const KWH_PRICE = 1.04
const STD_DISCOUNT = 0.20

function PricingTab() {
  const [kits, setKits] = useState<KitEntry[]>(PREMIUM_KITS)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editIdx, setEditIdx] = useState<number | null>(null)

  const update = (i: number, field: keyof KitEntry, val: number) => {
    const next = [...kits]
    next[i] = { ...next[i], [field]: val }
    // Recalculate kwhMonth when economy changes
    if (field === 'economyMonthly') next[i].kwhMonth = parseFloat((val / KWH_PRICE).toFixed(2))
    setKits(next)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await supabase.from('parametros_precos').insert({
        nome: `Atualização ${new Date().toLocaleDateString('pt-BR')}`,
        kwh_price: KWH_PRICE,
        standard_discount: STD_DISCOUNT,
        cash_discount: 0.15,
        metal_structure_price: 1000,
        kits_json: kits,
        ativo: true,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Tabela de Preços</h2>
          <p className="text-white/50 text-sm mt-0.5">Linha Premium — Standard é 20% abaixo automaticamente</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="btn-primary flex items-center gap-2 py-2 px-5 text-sm">
          {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar alterações'}
        </button>
      </div>

      {/* Config row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="shams-card p-4 text-center">
          <div className="text-white/50 text-xs mb-1">Preço do kWh</div>
          <div className="text-shams-neon font-black text-xl">R$ 1,04</div>
          <div className="text-white/30 text-xs mt-1">Fixo (configurável)</div>
        </div>
        <div className="shams-card p-4 text-center">
          <div className="text-white/50 text-xs mb-1">Desconto Standard</div>
          <div className="text-shams-cyan font-black text-xl">20%</div>
          <div className="text-white/30 text-xs mt-1">Sobre preço Premium</div>
        </div>
        <div className="shams-card p-4 text-center">
          <div className="text-white/50 text-xs mb-1">Desconto à Vista</div>
          <div className="text-shams-light font-black text-xl">15%</div>
          <div className="text-white/30 text-xs mt-1">Pagamento à vista</div>
        </div>
      </div>

      {/* Kit table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-shams-dark">
              <th className="text-left px-4 py-3 text-white/60 font-semibold text-xs uppercase tracking-wider">Placas</th>
              <th className="text-right px-4 py-3 text-white/60 font-semibold text-xs uppercase tracking-wider">Economia/mês (R$)</th>
              <th className="text-right px-4 py-3 text-white/60 font-semibold text-xs uppercase tracking-wider">kWh/mês</th>
              <th className="text-right px-4 py-3 text-white/60 font-semibold text-xs uppercase tracking-wider">Premium (à vista)</th>
              <th className="text-right px-4 py-3 text-white/60 font-semibold text-xs uppercase tracking-wider">Standard (à vista)</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {kits.map((kit, i) => (
              <tr key={i} className="border-b border-shams-green/10 hover:bg-shams-surface/30 transition-colors">
                <td className="px-4 py-3 font-bold text-white">{kit.plates}</td>
                {editIdx === i ? (
                  <>
                    <td className="px-4 py-3">
                      <input type="number" className="input-field py-1 text-right text-sm w-28 ml-auto" value={kit.economyMonthly}
                        onChange={e => update(i, 'economyMonthly', Number(e.target.value))} />
                    </td>
                    <td className="px-4 py-3 text-right text-white/60">{kit.kwhMonth.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <input type="number" className="input-field py-1 text-right text-sm w-32 ml-auto" value={kit.priceAVista}
                        onChange={e => update(i, 'priceAVista', Number(e.target.value))} />
                    </td>
                    <td className="px-4 py-3 text-right text-shams-cyan">{formatCurrency(kit.priceAVista * (1 - STD_DISCOUNT))}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setEditIdx(null)} className="text-shams-neon hover:text-white transition-colors text-xs font-bold">✓ OK</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3 text-right text-white">{formatCurrency(kit.economyMonthly)}</td>
                    <td className="px-4 py-3 text-right text-white/60">{kit.kwhMonth.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-shams-neon font-bold">{formatCurrency(kit.priceAVista)}</td>
                    <td className="px-4 py-3 text-right text-shams-cyan">{formatCurrency(kit.priceAVista * (1 - STD_DISCOUNT))}</td>
                    <td className="px-4 py-3 text-center">
                      <button onClick={() => setEditIdx(i)} className="text-white/40 hover:text-shams-light transition-colors text-xs">✏️ editar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-white/30 text-xs mt-4">* Alterações são salvas como nova versão da tabela de preços no Supabase. A tabela ativa é sempre a mais recente.</p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Proposals list
// ─────────────────────────────────────────────────────────
function PropostasTab() {
  const [rows, setRows] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('propostas')
      .select('*, clientes(nome, cidade, email, telefone)')
      .order('created_at', { ascending: false })
      .limit(50)
    setRows(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const statusColor = (s: string) =>
    s === 'approved' ? 'text-shams-neon bg-shams-green/20' :
    s === 'sent'     ? 'text-shams-cyan bg-shams-teal/10' :
    s === 'rejected' ? 'text-red-400 bg-red-900/20' :
                       'text-white/50 bg-white/5'

  const statusLabel = (s: string) =>
    s === 'approved' ? 'Aprovada' :
    s === 'sent'     ? 'Enviada'  :
    s === 'rejected' ? 'Recusada' : 'Rascunho'

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('propostas').update({ status }).eq('id', id)
    load()
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16 gap-3 text-white/50">
      <Loader2 size={20} className="animate-spin" /> Carregando propostas...
    </div>
  )

  if (rows.length === 0) return (
    <div className="text-center py-16 text-white/40">
      <FileText size={40} className="mx-auto mb-3 opacity-30" />
      <p>Nenhuma proposta salva ainda.</p>
      <p className="text-xs mt-1">As propostas aparecem aqui quando o vendedor clica em "Salvar Proposta" no simulador.</p>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Propostas Geradas</h2>
          <p className="text-white/50 text-sm mt-0.5">{rows.length} proposta{rows.length !== 1 ? 's' : ''} encontrada{rows.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={load} className="btn-outline flex items-center gap-2 py-2 px-4 text-sm">
          <RefreshCw size={14} /> Atualizar
        </button>
      </div>

      <div className="space-y-3">
        {rows.map(row => (
          <div key={row.id} className="shams-card overflow-hidden">
            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-shams-surface/30 transition-colors"
              onClick={() => setExpanded(expanded === row.id ? null : row.id)}>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-white font-bold">{row.clientes?.nome ?? '—'}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor(row.status)}`}>{statusLabel(row.status)}</span>
                </div>
                <div className="text-white/50 text-sm mt-0.5">
                  Proposta #{row.numero_proposta} · {row.clientes?.cidade} · {new Date(row.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-shams-neon font-black">{formatCurrency(row.kit_preco_final)}</div>
                <div className="text-white/40 text-xs">{row.kit_total_placas} placas · {row.linha_produto}</div>
              </div>
              {expanded === row.id ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
            </div>

            {expanded === row.id && (
              <div className="border-t border-shams-green/20 p-4 bg-shams-surface/20">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm mb-4">
                  <Info label="Consumo total" value={`${row.consumo_total_kwh} kWh/mês`} />
                  <Info label="Economia/mês" value={formatCurrency(row.kit_economia_principal)} />
                  <Info label="Payback" value={`${row.payback_anos} anos`} />
                  <Info label="ROI" value={`${row.roi_pct_ano}% ao ano`} />
                  <Info label="Pagamento" value={`${row.pagamento_metodo} ${row.pagamento_parcelas}x`} />
                  <Info label="Parcela" value={formatCurrency(row.pagamento_valor_parcela)} />
                  <Info label="Telefone" value={row.clientes?.telefone ?? '—'} />
                  <Info label="E-mail" value={row.clientes?.email ?? '—'} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-white/40 text-xs self-center">Atualizar status:</span>
                  {['draft','sent','approved','rejected'].map(s => (
                    <button key={s} onClick={() => updateStatus(row.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                        row.status === s
                          ? 'bg-shams-green/30 border-shams-light text-white'
                          : 'border-shams-green/20 text-white/40 hover:border-shams-green/50 hover:text-white'
                      }`}>
                      {statusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-white/40 text-xs">{label}</div>
      <div className="text-white font-medium text-sm">{value}</div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Config tab
// ─────────────────────────────────────────────────────────
function ConfigTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-white">Configurações do Sistema</h2>
      <div className="shams-card p-6 space-y-4">
        <h3 className="text-shams-cyan font-semibold text-sm uppercase tracking-wider">Regras de Precificação</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {[
            { label: 'Preço do kWh',          value: 'R$ 1,04',  note: 'Usado para calcular economia/mês' },
            { label: 'Desconto Linha Standard', value: '20%',     note: 'Sobre o preço da linha Premium' },
            { label: 'Desconto à Vista',       value: '15%',      note: 'Aplicado no pagamento à vista' },
            { label: 'Estrutura Metálica',     value: 'R$ 1.000/m²', note: 'Por metro quadrado coberto' },
            { label: 'Juros Cartão',           value: '1% a.m.', note: 'Até 21 parcelas' },
            { label: 'Juros Financiamento',    value: '1,7% a.m.', note: 'Até 72 parcelas' },
          ].map(item => (
            <div key={item.label} className="bg-shams-surface rounded-lg p-3">
              <div className="text-white/50 text-xs">{item.label}</div>
              <div className="text-shams-neon font-bold text-base">{item.value}</div>
              <div className="text-white/30 text-xs mt-0.5">{item.note}</div>
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs mt-2">Para alterar estes valores, edite o arquivo <code className="bg-shams-surface px-1 rounded">lib/pricing.ts</code> e faça push para o GitHub.</p>
      </div>
      <div className="shams-card p-6">
        <h3 className="text-shams-cyan font-semibold text-sm uppercase tracking-wider mb-4">Garantias Padrão</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { g: 'Inversores',       v: '10 anos' },
            { g: 'Painel (defeito)', v: '12 anos' },
            { g: 'Painel (vida)',    v: '25 anos' },
            { g: 'Instalação',       v: '12 meses' },
          ].map(item => (
            <div key={item.g} className="bg-shams-surface rounded-lg p-3 text-center">
              <div className="text-shams-neon font-black">{item.v}</div>
              <div className="text-white/50 text-xs mt-0.5">{item.g}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main admin page
// ─────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [tab, setTab] = useState<Tab>('precos')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setAuthed(sessionStorage.getItem('shams_admin') === '1')
    }
  }, [])

  const login = () => {
    sessionStorage.setItem('shams_admin', '1')
    setAuthed(true)
  }

  const logout = () => {
    sessionStorage.removeItem('shams_admin')
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={login} />

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'precos',   label: 'Tabela de Preços', icon: Table2    },
    { id: 'propostas',label: 'Propostas',         icon: FileText  },
    { id: 'config',   label: 'Configurações',     icon: Settings  },
  ]

  return (
    <div className="min-h-screen bg-shams-black pt-16">
      {/* Top bar */}
      <div className="bg-shams-dark border-b border-shams-green/20 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 shams-gradient rounded-lg flex items-center justify-center">
            <Sun size={14} className="text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-sm">SHAMS</span>
            <span className="text-white/40 text-sm"> · Painel Admin</span>
          </div>
        </div>
        <button onClick={logout} className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm">
          <LogOut size={14} /> Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-shams-green/20 bg-shams-dark">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 flex gap-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all ${
                tab === t.id
                  ? 'border-shams-light text-white'
                  : 'border-transparent text-white/40 hover:text-white/70'
              }`}>
              <t.icon size={15} />{t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        {tab === 'precos'    && <PricingTab />}
        {tab === 'propostas' && <PropostasTab />}
        {tab === 'config'    && <ConfigTab />}
      </div>
    </div>
  )
}
