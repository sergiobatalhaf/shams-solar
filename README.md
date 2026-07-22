# SHAMS Solar Simulator

Aplicação web para geração de propostas comerciais de energia solar fotovoltaica.

## Stack
- **Next.js 14** (App Router)
- **TypeScript + Tailwind CSS**
- **Supabase** (PostgreSQL)
- **Vercel** (hospedagem)
- **@react-pdf/renderer** (Fase 3)

---

## Setup Inicial (Fase 1)

### 1. Criar repositório no GitHub

```bash
# No terminal, na pasta do projeto:
git init
git add .
git commit -m "feat: fase 1 — apresentação + estrutura base"

# Criar repo no GitHub em github.com/new
# Depois:
git remote add origin https://github.com/SEU_USUARIO/shams-solar.git
git branch -M main
git push -u origin main
```

### 2. Configurar Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um projeto
2. No painel, vá em **SQL Editor** e execute o arquivo `supabase/schema.sql`
3. Copie as credenciais em **Settings → API**

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU_PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
ADMIN_PASSWORD=shams2024
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Instalar dependências e rodar localmente

```bash
npm install
npm run dev
# Acesse http://localhost:3000
```

### 5. Deploy no Vercel

1. Acesse [vercel.com](https://vercel.com) e conecte sua conta GitHub
2. Importe o repositório `shams-solar`
3. Em **Environment Variables**, adicione as mesmas variáveis do `.env.local`
4. Clique em **Deploy**

A cada `git push origin main`, o Vercel fará deploy automático.

---

## Workflow de Edição (dia a dia)

```bash
# 1. Edite o código conversando com o Claude
# 2. Salve o arquivo
# 3. Suba para o GitHub:
git add .
git commit -m "feat: descrição da mudança"
git push origin main
# → Vercel faz deploy automático em ~30 segundos
```

---

## Estrutura do Projeto

```
shams-solar/
├── app/
│   ├── page.tsx              ← Landing + apresentação
│   ├── simulator/page.tsx    ← Simulador (Fase 2)
│   ├── admin/page.tsx        ← Admin (Fase 2)
│   └── proposta/[id]/        ← Visualizar proposta (Fase 3)
├── components/
│   ├── layout/               ← Header, Footer
│   └── presentation/         ← Seções da landing page
├── lib/
│   ├── types.ts              ← Tipagens TypeScript
│   ├── pricing.ts            ← Tabela de preços + kits
│   ├── calculations.ts       ← Motor de cálculo (ROI, parcelas, kits)
│   └── supabase.ts           ← Cliente Supabase
└── supabase/
    └── schema.sql            ← Schema do banco de dados
```

---

## Roadmap

| Fase | Status | Conteúdo |
|------|--------|----------|
| **Fase 1** | ✅ Completa | Setup + identidade visual + páginas de apresentação + schema SQL + lib de precificação |
| **Fase 2** | 🔜 Próxima | Formulário multi-step + cálculos + admin + Supabase |
| **Fase 3** | 🔜 Futura | Geração de PDF + proposta completa + polish |

---

## Contato
SHAMS Energia Solar · comercial@shamsolar.net · (41) 99665-9223
