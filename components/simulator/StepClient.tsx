'use client'
import type { ClientData } from '@/lib/types'
import { ROOF_TYPE_LABELS, ROOF_FACE_LABELS } from '@/lib/types'
import { User, MapPin, Phone, Mail, Home, Compass } from 'lucide-react'

interface Props {
  data: Partial<ClientData>
  vendorName: string
  onChange: (data: Partial<ClientData>) => void
  onVendorChange: (name: string) => void
}

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="label-field">{label}</label>
    {children}
  </div>
)

export default function StepClient({ data, vendorName, onChange, onVendorChange }: Props) {
  const set = (key: keyof ClientData, val: string) => onChange({ ...data, [key]: val })

  return (
    <div className="space-y-6">
      <div>
        <div className="section-subtitle mb-1">Etapa 1</div>
        <h2 className="text-2xl font-bold text-white mb-1">Dados do Cliente</h2>
        <p className="text-white/50 text-sm">Preencha as informações do cliente e da visita.</p>
      </div>

      {/* Vendor */}
      <div className="shams-card p-4 border-shams-teal/40">
        <div className="flex items-center gap-2 mb-3 text-shams-cyan">
          <User size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Vendedor</span>
        </div>
        <Field label="Seu nome (vendedor)">
          <input className="input-field" placeholder="Nome do vendedor" value={vendorName}
            onChange={e => onVendorChange(e.target.value)} />
        </Field>
      </div>

      {/* Client info */}
      <div className="shams-card p-4">
        <div className="flex items-center gap-2 mb-3 text-shams-light">
          <User size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Informações do Cliente</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Nome / Razão Social *">
            <input className="input-field" placeholder="Nome completo ou empresa" value={data.name ?? ''}
              onChange={e => set('name', e.target.value)} />
          </Field>
          <Field label="Empresa (opcional)">
            <input className="input-field" placeholder="Razão social se PJ" value={data.company ?? ''}
              onChange={e => set('company', e.target.value)} />
          </Field>
          <Field label="Telefone / WhatsApp">
            <input className="input-field" placeholder="(00) 00000-0000" value={data.phone ?? ''}
              onChange={e => set('phone', e.target.value)} />
          </Field>
          <Field label="E-mail">
            <input className="input-field" type="email" placeholder="email@exemplo.com" value={data.email ?? ''}
              onChange={e => set('email', e.target.value)} />
          </Field>
        </div>
      </div>

      {/* Location */}
      <div className="shams-card p-4">
        <div className="flex items-center gap-2 mb-3 text-shams-light">
          <MapPin size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Localização</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Cidade *">
            <input className="input-field" placeholder="Ex: Curitiba" value={data.city ?? ''}
              onChange={e => set('city', e.target.value)} />
          </Field>
          <Field label="Bairro *">
            <input className="input-field" placeholder="Ex: Centro" value={data.neighborhood ?? ''}
              onChange={e => set('neighborhood', e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Endereço completo (opcional)">
              <input className="input-field" placeholder="Rua, número, complemento" value={data.address ?? ''}
                onChange={e => set('address', e.target.value)} />
            </Field>
          </div>
        </div>
      </div>

      {/* Roof */}
      <div className="shams-card p-4">
        <div className="flex items-center gap-2 mb-3 text-shams-light">
          <Home size={16} />
          <span className="text-xs font-semibold uppercase tracking-wider">Telhado</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Tipo de telhado *">
            <select className="input-field" value={data.roofType ?? ''} onChange={e => set('roofType', e.target.value as ClientData['roofType'])}>
              <option value="">Selecione...</option>
              {(Object.entries(ROOF_TYPE_LABELS) as [ClientData['roofType'], string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
          <Field label="Face do telhado *">
            <select className="input-field" value={data.roofFace ?? ''} onChange={e => set('roofFace', e.target.value as ClientData['roofFace'])}>
              <option value="">Selecione...</option>
              {(Object.entries(ROOF_FACE_LABELS) as [ClientData['roofFace'], string][]).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </Field>
        </div>
      </div>
    </div>
  )
}
