import React from 'react'
import {
  Document, Page, Text, View, StyleSheet, Image, Font, Svg, Path, Rect, Line, G
} from '@react-pdf/renderer'
import type { ProposalData } from '@/lib/types'
import { ROOF_TYPE_LABELS, ROOF_FACE_LABELS, INVERTER_DISTANCE_LABELS } from '@/lib/types'
import { calcROI } from '@/lib/calculations'

// --------------------------------------------------
// Styles
// --------------------------------------------------
const C = {
  black:   '#060D06',
  dark:    '#0D1A0D',
  surface: '#132613',
  card:    '#1A3320',
  green:   '#2E7D32',
  light:   '#4CAF50',
  neon:    '#76FF03',
  teal:    '#00ACC1',
  white:   '#FFFFFF',
  gray:    '#B0BEC5',
  grayDark:'#546E7A',
  accent:  '#26C6DA',
  accentGreen: '#43A047',
}

const s = StyleSheet.create({
  page: { backgroundColor: C.white, fontFamily: 'Helvetica', padding: 0 },
  pageDark: { backgroundColor: C.black, fontFamily: 'Helvetica', padding: 0 },

  /* Cover */
  coverBg:    { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: C.dark },
  coverOverlay:{ position: 'absolute', top: 0, left: 0, width: '40%', bottom: 0, backgroundColor: C.green, opacity: 0.12 },
  coverContent:{ padding: 48, flex: 1, justifyContent: 'space-between' },
  logoArea:   { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  logoBox:    { width: 32, height: 32, backgroundColor: C.teal, borderRadius: 6, marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  logoText:   { fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 3 },
  logoSub:    { fontSize: 8, color: C.teal, letterSpacing: 2 },
  coverTag:   { fontSize: 10, color: C.teal, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 8 },
  coverTitle1:{ fontSize: 52, fontFamily: 'Helvetica-Bold', color: C.white, lineHeight: 1.1, marginBottom: 4 },
  coverTitle2:{ fontSize: 24, color: C.gray, letterSpacing: 4, marginBottom: 32 },
  coverClient:{ fontSize: 22, fontFamily: 'Helvetica-Bold', color: C.neon, marginBottom: 4 },
  coverPropN: { fontSize: 10, color: C.grayDark, marginBottom: 4 },
  coverDate:  { fontSize: 10, color: C.grayDark },
  coverFooter:{ flexDirection: 'row', justifyContent: 'space-between' },
  coverFootCol:{ flex: 1 },
  coverFootTitle:{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.teal, letterSpacing: 2, marginBottom: 6 },
  coverFootText: { fontSize: 9, color: C.gray, lineHeight: 1.6 },
  coverDivider:  { width: 1, backgroundColor: C.green, marginHorizontal: 24, opacity: 0.4 },

  /* Standard page */
  header: { backgroundColor: C.dark, paddingHorizontal: 32, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLogoRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerLogoBox: { width: 22, height: 22, backgroundColor: C.teal, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  headerLogo: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.white, letterSpacing: 2 },
  headerSub:  { fontSize: 7, color: C.teal, letterSpacing: 1 },
  headerProp: { fontSize: 9, color: C.grayDark },
  body:       { padding: 32, flex: 1 },
  footer:     { backgroundColor: C.dark, paddingHorizontal: 32, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: 8, color: C.grayDark },
  footerPage: { fontSize: 8, color: C.light },
  greenBar:   { height: 3, backgroundColor: C.green, marginBottom: 0 },
  tealBar:    { height: 3, backgroundColor: C.teal, marginBottom: 0 },

  /* Typography */
  sectionTag:  { fontSize: 9, color: C.teal, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 },
  sectionTitle:{ fontSize: 26, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 16 },
  body1:       { fontSize: 10, color: '#37474F', lineHeight: 1.7 },
  label:       { fontSize: 9, color: C.grayDark, marginBottom: 2 },
  value:       { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 8 },
  valueGreen:  { fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.green, marginBottom: 8 },
  valueNeon:   { fontSize: 14, fontFamily: 'Helvetica-Bold', color: C.green },

  /* Cards */
  card:        { backgroundColor: '#F5F7F5', borderRadius: 8, padding: 14, marginBottom: 10, borderLeft: `3px solid ${C.green}` },
  cardDark:    { backgroundColor: C.dark, borderRadius: 8, padding: 14, marginBottom: 10 },
  cardRow:     { flexDirection: 'row', gap: 10, marginBottom: 10 },
  statCard:    { flex: 1, backgroundColor: C.surface, borderRadius: 8, padding: 12, alignItems: 'center' },
  statValue:   { fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.neon, marginBottom: 2 },
  statLabel:   { fontSize: 8, color: C.gray, textAlign: 'center' },
  gradientCard:{ borderRadius: 8, padding: 14, marginBottom: 10, backgroundColor: C.green },

  /* Table */
  table:       { marginBottom: 12 },
  tableHeader: { flexDirection: 'row', backgroundColor: C.dark, borderRadius: 4, padding: 8, marginBottom: 4 },
  tableRow:    { flexDirection: 'row', borderBottom: `1px solid #E0E0E0`, paddingVertical: 7, paddingHorizontal: 8 },
  tableRowAlt: { flexDirection: 'row', borderBottom: `1px solid #E0E0E0`, paddingVertical: 7, paddingHorizontal: 8, backgroundColor: '#F9FBF9' },
  th:          { fontSize: 9, fontFamily: 'Helvetica-Bold', color: C.white },
  td:          { fontSize: 10, color: '#37474F' },
  tdBold:      { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark },
  tdGreen:     { fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.green },

  /* Two-col layout */
  row:         { flexDirection: 'row', gap: 12 },
  col:         { flex: 1 },
  col2:        { flex: 2 },
})

// --------------------------------------------------
// Helpers
// --------------------------------------------------
const fmt = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtN = (v: number, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d })

function Header({ propNum, page, title }: { propNum: string; page: string; title: string }) {
  return (
    <>
      <View style={s.header}>
        <View style={s.headerLogoRow}>
          <View style={s.headerLogoBox}><Text style={{ fontSize: 10, color: C.white, fontFamily: 'Helvetica-Bold' }}>S</Text></View>
          <View>
            <Text style={s.headerLogo}>SHAMS</Text>
            <Text style={s.headerSub}>SOLUÇÕES EM ENERGIA</Text>
          </View>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.headerProp}>Proposta nº {propNum}</Text>
          <Text style={{ fontSize: 9, color: C.light, fontFamily: 'Helvetica-Bold', marginTop: 2 }}>{title}</Text>
        </View>
      </View>
      <View style={s.greenBar} />
    </>
  )
}

function Footer({ page }: { page: string }) {
  return (
    <>
      <View style={s.tealBar} />
      <View style={s.footer}>
        <Text style={s.footerText}>www.shamsenergia.com.br · comercial@shamsolar.net · (41) 99665-9223</Text>
        <Text style={s.footerPage}>Pág. {page}</Text>
      </View>
    </>
  )
}

// --------------------------------------------------
// Pages
// --------------------------------------------------

function CoverPage({ proposal }: { proposal: ProposalData }) {
  const { client, proposalNumber, createdAt } = proposal
  const date = createdAt ? new Date(createdAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR')
  return (
    <Page size="A4" style={s.pageDark}>
      <View style={s.coverBg} />
      <View style={s.coverOverlay} />
      <View style={{ position: 'absolute', bottom: 0, right: 0, width: 200, height: 200, backgroundColor: C.teal, opacity: 0.06, borderRadius: 100 }} />

      <View style={s.coverContent}>
        {/* Logo */}
        <View>
          <View style={s.logoArea}>
            <View style={s.logoBox}><Text style={{ fontSize: 14, color: C.white, fontFamily: 'Helvetica-Bold' }}>S</Text></View>
            <View>
              <Text style={s.logoText}>SHAMS</Text>
              <Text style={s.logoSub}>SOLUÇÕES EM ENERGIA</Text>
            </View>
          </View>
        </View>

        {/* Center content */}
        <View>
          <Text style={s.coverTag}>Sistema Fotovoltaico</Text>
          <Text style={s.coverTitle1}>PROPOSTA{'\n'}COMERCIAL</Text>
          <Text style={s.coverTitle2}>SISTEMA FOTOVOLTAICO</Text>
          <View style={{ width: 60, height: 3, backgroundColor: C.teal, marginBottom: 24 }} />
          <Text style={s.coverClient}>{client.name?.toUpperCase()}</Text>
          {client.company && <Text style={{ fontSize: 13, color: C.gray, marginBottom: 8 }}>{client.company}</Text>}
          <Text style={{ fontSize: 11, color: C.grayDark, marginBottom: 4 }}>{client.city} — {client.neighborhood}</Text>
          {client.address && <Text style={{ fontSize: 10, color: C.grayDark, marginBottom: 8 }}>{client.address}</Text>}
          <Text style={s.coverPropN}>Proposta nº {proposalNumber}</Text>
          <Text style={s.coverDate}>Data: {date}</Text>
          {proposal.vendorName && <Text style={{ fontSize: 10, color: C.grayDark, marginTop: 4 }}>Vendedor: {proposal.vendorName}</Text>}
        </View>

        {/* Footer */}
        <View>
          <View style={{ height: 1, backgroundColor: C.green, opacity: 0.3, marginBottom: 20 }} />
          <View style={s.coverFooter}>
            <View style={s.coverFootCol}>
              <Text style={s.coverFootTitle}>CURITIBA</Text>
              <Text style={s.coverFootText}>Rua Dr. Roberto Barrozo 528{'\n'}Centro Cívico, Curitiba – PR{'\n'}CEP: 80520-092{'\n'}Tel: (41) 99665-9223</Text>
            </View>
            <View style={s.coverDivider} />
            <View style={[s.coverFootCol, { paddingLeft: 24 }]}>
              <Text style={s.coverFootTitle}>CONTATOS</Text>
              <Text style={s.coverFootText}>www.shamsenergia.com.br{'\n'}comercial@shamsolar.net{'\n'}@shamsenergiasolar</Text>
            </View>
          </View>
        </View>
      </View>
    </Page>
  )
}

function AboutPage({ proposal }: { proposal: ProposalData }) {
  const stats = [
    { v: '500+',    l: 'Projetos\nExecutados' },
    { v: '10.000',  l: 'Placas\nInstaladas' },
    { v: '6',       l: 'Estados\ndo Brasil' },
    { v: '100%',    l: 'Equipe\nEspecializada' },
  ]
  const clients = ['Schwan Cosmetics','CSN','RANDON','Gestamp','WEG','Grupo Boticário','Innova','Continental','Club Vibe','CTG Brasil','Floripa Shopping','Positivo','Frisia','Legado','Walmart','Mondelez']

  return (
    <Page size="A4" style={s.page}>
      <Header propNum={proposal.proposalNumber!} page="02" title="QUEM SOMOS" />
      <View style={s.body}>
        <Text style={s.sectionTag}>Nossa Empresa</Text>
        <Text style={s.sectionTitle}>Quem Somos</Text>

        <View style={s.row}>
          <View style={s.col2}>
            <Text style={s.body1}>
              A <Text style={{ fontFamily: 'Helvetica-Bold', color: C.dark }}>SHAMS Energia Solar</Text> é uma empresa especializada em sistemas de geração distribuída de energia solar fotovoltaica, com atuação em todo o Brasil. Nosso objetivo é levar soluções energéticas sustentáveis, eficientes e economicamente vantajosas para residências, comércios e propriedades rurais.
            </Text>
            <Text style={[s.body1, { marginTop: 8 }]}>
              Nossos projetos são desenvolvidos de forma personalizada, considerando as necessidades específicas de cada cliente. Trabalhamos sempre com foco em eficiência energética, redução de custos na conta de luz e maior autonomia energética, proporcionando economia a longo prazo e valorização do patrimônio.
            </Text>
            <Text style={[s.body1, { marginTop: 8 }]}>
              Mais do que instalar sistemas solares, buscamos construir relações de confiança e entregar soluções que realmente façam a diferença na vida das pessoas e nos resultados das empresas.
            </Text>
          </View>
          <View style={s.col}>
            {stats.map(st => (
              <View key={st.v} style={[s.card, { marginBottom: 8, borderLeftColor: C.teal }]}>
                <Text style={{ fontSize: 20, fontFamily: 'Helvetica-Bold', color: C.green, marginBottom: 2 }}>{st.v}</Text>
                <Text style={{ fontSize: 8, color: C.grayDark }}>{st.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Clients */}
        <View style={{ marginTop: 20 }}>
          <View style={{ backgroundColor: C.dark, borderRadius: 8, padding: 16 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.teal, textAlign: 'center', marginBottom: 14, letterSpacing: 2 }}>🤝  CLIENTES DO GRUPO</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {clients.map(c => (
                <View key={c} style={{ backgroundColor: '#1A3320', borderRadius: 4, paddingHorizontal: 8, paddingVertical: 4 }}>
                  <Text style={{ fontSize: 8, color: C.gray }}>{c}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
      <Footer page="02" />
    </Page>
  )
}

function SystemPage({ proposal }: { proposal: ProposalData }) {
  const { kit, consumption } = proposal
  const monthlyEconomy = kit.primary.economyMonthly + (kit.secondary?.economyMonthly ?? 0)
  const annualGeneration = kit.totalKwh * 12
  const areaM2 = kit.totalPlates * 2.5  // ~2.5m² por placa

  // Simple bar chart data (generation vs consumption by month)
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
  const factors = [1.1, 1.05, 1.0, 0.95, 0.9, 0.85, 0.88, 0.92, 0.96, 1.02, 1.07, 1.1]
  const chartMax = kit.totalKwh * 1.15

  return (
    <Page size="A4" style={s.page}>
      <Header propNum={proposal.proposalNumber!} page="03" title="DADOS DO SISTEMA" />
      <View style={s.body}>
        <Text style={s.sectionTag}>Dimensionamento</Text>
        <Text style={s.sectionTitle}>Dados do seu Sistema</Text>

        {/* Headline banner */}
        <View style={{ backgroundColor: C.dark, borderRadius: 8, paddingHorizontal: 20, paddingVertical: 12, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 13, color: C.white }}>Geração estimada:</Text>
          <Text style={{ fontSize: 18, fontFamily: 'Helvetica-Bold', color: C.neon }}>{fmtN(kit.totalKwh, 0)} kWh/mês</Text>
        </View>

        {/* System specs */}
        <View style={s.row}>
          <View style={s.col}>
            <Text style={{ fontSize: 10, color: C.teal, fontFamily: 'Helvetica-Bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>⚡ Sistema</Text>
            <View style={s.card}>
              <Text style={s.label}>Quantidade de placas</Text>
              <Text style={s.valueNeon}>{kit.totalPlates} unidades</Text>
              {kit.secondary && <Text style={{ fontSize: 8, color: C.grayDark, marginTop: -6 }}>Composição: {kit.primary.plates} + {kit.secondary.plates} placas</Text>}
              <Text style={[s.label, { marginTop: 8 }]}>Linha do produto</Text>
              <Text style={s.valueGreen}>{kit.line.toUpperCase()}</Text>
              <Text style={s.label}>Área mínima de instalação</Text>
              <Text style={s.value}>{fmtN(areaM2, 0)} m²</Text>
            </View>
          </View>
          <View style={s.col}>
            <Text style={{ fontSize: 10, color: C.teal, fontFamily: 'Helvetica-Bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>📊 Geração</Text>
            <View style={s.card}>
              <Text style={s.label}>Geração mensal</Text>
              <Text style={s.valueNeon}>{fmtN(kit.totalKwh, 0)} kWh</Text>
              <Text style={s.label}>Consumo considerado</Text>
              <Text style={s.value}>{fmtN(consumption.totalKwh, 0)} kWh</Text>
              <Text style={s.label}>Produção anual</Text>
              <Text style={s.value}>{fmtN(annualGeneration, 0)} kWh</Text>
              <Text style={s.label}>Cobertura do consumo</Text>
              <Text style={s.valueGreen}>{kit.coverage}%</Text>
            </View>
          </View>
          <View style={s.col}>
            <Text style={{ fontSize: 10, color: C.teal, fontFamily: 'Helvetica-Bold', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>🏠 Instalação</Text>
            <View style={s.card}>
              <Text style={s.label}>Tipo de telhado</Text>
              <Text style={s.value}>{ROOF_TYPE_LABELS[proposal.client.roofType] ?? '—'}</Text>
              <Text style={s.label}>Face do telhado</Text>
              <Text style={s.value}>{ROOF_FACE_LABELS[proposal.client.roofFace] ?? '—'}</Text>
              <Text style={s.label}>Dist. inversor/rede</Text>
              <Text style={s.value}>{INVERTER_DISTANCE_LABELS[proposal.options.inverterDistance]}</Text>
              {proposal.options.metalStructure && <>
                <Text style={s.label}>Estrutura metálica</Text>
                <Text style={s.value}>{proposal.options.metalStructureM2} m²</Text>
              </>}
            </View>
          </View>
        </View>

        {/* Bar chart */}
        <View style={{ marginTop: 8, marginBottom: 14 }}>
          <Text style={{ fontSize: 10, color: C.grayDark, marginBottom: 8, fontFamily: 'Helvetica-Bold' }}>Geração Estimada por Mês (kWh)</Text>
          <View style={{ backgroundColor: '#F5F7F5', borderRadius: 8, padding: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 60, gap: 4 }}>
              {months.map((m, i) => {
                const genH = (kit.totalKwh * factors[i] / chartMax) * 60
                const conH = (consumption.totalKwh / chartMax) * 60
                return (
                  <View key={m} style={{ flex: 1, alignItems: 'center' }}>
                    <View style={{ width: '100%', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 60 }}>
                      <View style={{ width: '45%', height: genH, backgroundColor: C.dark, borderRadius: 2 }} />
                    </View>
                  </View>
                )
              })}
            </View>
            <View style={{ flexDirection: 'row', marginTop: 4, gap: 4 }}>
              {months.map(m => (
                <View key={m} style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontSize: 6, color: C.grayDark }}>{m}</Text>
                </View>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 16, marginTop: 8, justifyContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <View style={{ width: 10, height: 6, backgroundColor: C.dark, borderRadius: 1 }} />
                <Text style={{ fontSize: 8, color: C.grayDark }}>Geração</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Guarantees */}
        <View style={{ backgroundColor: C.dark, borderRadius: 8, padding: 14 }}>
          <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: C.teal, marginBottom: 10, letterSpacing: 1 }}>🛡️  GARANTIAS DO SISTEMA</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { g: 'Inversores',       v: '10 anos' },
              { g: 'Painel (defeito)', v: '12 anos' },
              { g: 'Painel (vida)',    v: '25 anos' },
              { g: 'Instalação',       v: '12 meses' },
            ].map(item => (
              <View key={item.g} style={[s.statCard, { borderRadius: 6 }]}>
                <Text style={s.statValue}>{item.v}</Text>
                <Text style={[s.statLabel, { fontSize: 7 }]}>{item.g}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <Footer page="03" />
    </Page>
  )
}

function InvestmentPage({ proposal }: { proposal: ProposalData }) {
  const { kit, selectedPayment, options } = proposal
  const roiData = proposal.roi ?? calcROI(kit, kit.finalPrice)
  const monthlyEconomy = kit.primary.economyMonthly + (kit.secondary?.economyMonthly ?? 0)
  const annualBillWithout = monthlyEconomy * 12 + monthlyEconomy * 12 * 0.05
  const annualBillWith = (kit.totalKwh * 12 * 1.04) - (monthlyEconomy * 12)

  const payMethod =
    selectedPayment.method === 'avista'       ? 'À Vista (15% desconto)' :
    selectedPayment.method === 'boleto'       ? 'Boleto 5x sem juros' :
    selectedPayment.method === 'cartao'       ? `Cartão de Crédito ${selectedPayment.installments}x (1% a.m.)` :
    `Financiamento Bancário ${selectedPayment.installments}x (1,7% a.m.)`

  return (
    <Page size="A4" style={s.page}>
      <Header propNum={proposal.proposalNumber!} page="04" title="VALOR DO INVESTIMENTO" />
      <View style={s.body}>
        <Text style={s.sectionTag}>Proposta Financeira</Text>
        <Text style={s.sectionTitle}>Valor do Investimento</Text>

        {/* Investment value */}
        <View style={{ backgroundColor: C.dark, borderRadius: 10, padding: 20, marginBottom: 14 }}>
          <Text style={{ fontSize: 11, color: C.gray, marginBottom: 4 }}>Valor Total do Investimento</Text>
          <Text style={{ fontSize: 36, fontFamily: 'Helvetica-Bold', color: C.neon, marginBottom: 4 }}>{fmt(kit.finalPrice)}</Text>
          {options.metalStructure && (
            <Text style={{ fontSize: 9, color: C.grayDark }}>Inclui estrutura metálica de {options.metalStructureM2}m² (+{fmt(options.metalStructureM2 * 1000)})</Text>
          )}
          <Text style={{ fontSize: 11, color: C.teal, marginTop: 8 }}>Condição: {payMethod}</Text>
          {selectedPayment.method !== 'avista' && (
            <Text style={{ fontSize: 14, color: C.white, fontFamily: 'Helvetica-Bold', marginTop: 4 }}>
              {selectedPayment.installments}x de {fmt(selectedPayment.installmentValue)}
            </Text>
          )}
          {selectedPayment.entryValue > 0 && (
            <Text style={{ fontSize: 10, color: C.gray, marginTop: 2 }}>Entrada: {fmt(selectedPayment.entryValue)}</Text>
          )}
        </View>

        {/* Payment options table */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>Condições de Pagamento</Text>
          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={[s.th, { flex: 2 }]}>Modalidade</Text>
              <Text style={[s.th, { flex: 1, textAlign: 'center' }]}>Parcelas</Text>
              <Text style={[s.th, { flex: 1.5, textAlign: 'right' }]}>Valor Parcela</Text>
              <Text style={[s.th, { flex: 1.5, textAlign: 'right' }]}>Total</Text>
            </View>
            {[
              { desc: 'À Vista (15% desconto)',       n: '1',  parc: fmt(kit.finalPrice * 0.85), total: fmt(kit.finalPrice * 0.85) },
              { desc: 'Boleto (5x s/ juros)',          n: '5',  parc: fmt(kit.finalPrice / 5),    total: fmt(kit.finalPrice) },
              { desc: 'Cartão de Crédito (1% a.m.)',  n: '12', parc: fmt(kit.finalPrice * 0.01 / (1 - Math.pow(1.01, -12))), total: fmt(kit.finalPrice * 0.01 / (1 - Math.pow(1.01, -12)) * 12) },
              { desc: 'Cartão de Crédito (1% a.m.)',  n: '21', parc: fmt(kit.finalPrice * 0.01 / (1 - Math.pow(1.01, -21))), total: fmt(kit.finalPrice * 0.01 / (1 - Math.pow(1.01, -21)) * 21) },
              { desc: 'Financiamento (1,7% a.m.)',    n: '36', parc: fmt(kit.finalPrice * 0.017 / (1 - Math.pow(1.017, -36))), total: fmt(kit.finalPrice * 0.017 / (1 - Math.pow(1.017, -36)) * 36) },
              { desc: 'Financiamento (1,7% a.m.)',    n: '60', parc: fmt(kit.finalPrice * 0.017 / (1 - Math.pow(1.017, -60))), total: fmt(kit.finalPrice * 0.017 / (1 - Math.pow(1.017, -60)) * 60) },
              { desc: 'Financiamento (1,7% a.m.)',    n: '72', parc: fmt(kit.finalPrice * 0.017 / (1 - Math.pow(1.017, -72))), total: fmt(kit.finalPrice * 0.017 / (1 - Math.pow(1.017, -72)) * 72) },
            ].map((row, i) => (
              <View key={i} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                <Text style={[s.td, { flex: 2 }]}>{row.desc}</Text>
                <Text style={[s.td, { flex: 1, textAlign: 'center' }]}>{row.n}x</Text>
                <Text style={[s.tdBold, { flex: 1.5, textAlign: 'right' }]}>{row.parc}</Text>
                <Text style={[s.td, { flex: 1.5, textAlign: 'right' }]}>{row.total}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Savings comparison */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          <View style={{ flex: 1, backgroundColor: '#FFEBEE', borderRadius: 8, padding: 12 }}>
            <Text style={{ fontSize: 9, color: '#B71C1C', marginBottom: 4 }}>Conta de luz SEM Solar (ano)</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: '#C62828' }}>{fmt(roiData.annualSavings)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: '#E8F5E9', borderRadius: 8, padding: 12 }}>
            <Text style={{ fontSize: 9, color: C.green, marginBottom: 4 }}>Economia anual com Solar</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.green }}>{fmt(roiData.annualSavings)}</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: C.dark, borderRadius: 8, padding: 12 }}>
            <Text style={{ fontSize: 9, color: C.neon, marginBottom: 4 }}>Payback estimado</Text>
            <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.neon }}>{roiData.paybackYears} anos</Text>
          </View>
        </View>

        {/* ROI table */}
        <View>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: C.dark, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            Rendimento: {roiData.roiPercent}% ao ano · Retorno em 25 anos: {fmt(roiData.returnIn25Years)}
          </Text>
          <View style={s.table}>
            <View style={s.tableHeader}>
              <Text style={[s.th, { flex: 1 }]}>Período</Text>
              <Text style={[s.th, { flex: 2, textAlign: 'right' }]}>Fluxo de Caixa</Text>
              <Text style={[s.th, { flex: 2, textAlign: 'right' }]}>Saldo Acumulado</Text>
            </View>
            {roiData.cashflowTable.filter(r => [0, 5, 10, 15, 20, 25].includes(r.year)).map((row, i) => (
              <View key={row.year} style={i % 2 === 0 ? s.tableRow : s.tableRowAlt}>
                <Text style={[s.td, { flex: 1 }]}>{row.year === 0 ? '0º ano' : `${row.year}º ano`}</Text>
                <Text style={[s.td, { flex: 2, textAlign: 'right' }]}>{fmt(row.cashflow)}</Text>
                <Text style={[row.balance >= 0 ? s.tdGreen : s.td, { flex: 2, textAlign: 'right' }]}>{fmt(row.balance)}</Text>
              </View>
            ))}
          </View>
          <Text style={{ fontSize: 8, color: C.grayDark, marginTop: 4 }}>* Inflação anual: 5,8% · Degradação dos módulos: 20% em 25 anos · Rendimento da poupança: 4,38% ao ano</Text>
        </View>
      </View>
      <Footer page="04" />
    </Page>
  )
}

function HowItWorksPage({ proposal }: { proposal: ProposalData }) {
  const steps = [
    { n: '1', t: 'Projeto',        d: 'Seu projeto será desenvolvido por nosso time de engenheiros e atenderá todas as exigências normativas.' },
    { n: '2', t: 'Logística',      d: 'Cuidaremos para que seu equipamento seja entregue com segurança no local da instalação.' },
    { n: '3', t: 'Instalação',     d: 'Agendaremos a instalação para um momento conveniente à sua rotina.' },
    { n: '4', t: 'Homologação',    d: 'Cuidaremos de toda a papelada da homologação do seu sistema junto à concessionária.' },
    { n: '5', t: 'Monitoramento',  d: 'Acompanhamos a geração de energia do seu sistema frequentemente para identificar possíveis falhas.' },
    { n: '6', t: 'Manutenção',     d: 'Conheça nossos planos de manutenção e operação para máxima performance do sistema.' },
  ]

  return (
    <Page size="A4" style={s.page}>
      <Header propNum={proposal.proposalNumber!} page="05" title="COMO FUNCIONA" />
      <View style={s.body}>
        <Text style={s.sectionTag}>Processo</Text>
        <Text style={s.sectionTitle}>Como Funciona</Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {steps.map((step, i) => (
            <View key={step.n} style={{ width: '47%', backgroundColor: '#F5F7F5', borderRadius: 8, padding: 14, borderLeft: `3px solid ${i % 2 === 0 ? C.teal : C.green}` }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: i % 2 === 0 ? C.teal : C.green, justifyContent: 'center', alignItems: 'center', marginRight: 8 }}>
                  <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: C.white }}>{step.n}</Text>
                </View>
                <Text style={{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: C.dark }}>{step.t}</Text>
              </View>
              <Text style={{ fontSize: 9, color: C.grayDark, lineHeight: 1.6 }}>{step.d}</Text>
            </View>
          ))}
        </View>

        {/* Closing message */}
        <View style={{ marginTop: 24, backgroundColor: C.dark, borderRadius: 10, padding: 20, alignItems: 'center' }}>
          <Text style={{ fontSize: 16, fontFamily: 'Helvetica-Bold', color: C.white, textAlign: 'center', marginBottom: 6 }}>
            Pronto para economizar com energia solar?
          </Text>
          <Text style={{ fontSize: 10, color: C.gray, textAlign: 'center', marginBottom: 12 }}>
            Entre em contato e dê o primeiro passo rumo à independência energética.
          </Text>
          <View style={{ flexDirection: 'row', gap: 24 }}>
            <Text style={{ fontSize: 10, color: C.teal, fontFamily: 'Helvetica-Bold' }}>(41) 99665-9223</Text>
            <Text style={{ fontSize: 10, color: C.teal, fontFamily: 'Helvetica-Bold' }}>comercial@shamsolar.net</Text>
            <Text style={{ fontSize: 10, color: C.teal, fontFamily: 'Helvetica-Bold' }}>@shamsenergiasolar</Text>
          </View>
        </View>
      </View>
      <Footer page="05" />
    </Page>
  )
}

// --------------------------------------------------
// Main document
// --------------------------------------------------
export default function ProposalDocument({ proposal }: { proposal: ProposalData }) {
  if (!proposal.kit || !proposal.selectedPayment) return null
  return (
    <Document title={`Proposta SHAMS ${proposal.proposalNumber} — ${proposal.client.name}`} author="SHAMS Energia Solar">
      <CoverPage proposal={proposal} />
      <AboutPage proposal={proposal} />
      <SystemPage proposal={proposal} />
      <InvestmentPage proposal={proposal} />
      <HowItWorksPage proposal={proposal} />
    </Document>
  )
}
