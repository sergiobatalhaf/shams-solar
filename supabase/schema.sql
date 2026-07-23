-- ============================================================
-- SHAMS Solar Simulator — Schema Supabase (PostgreSQL)
-- Execute este SQL no Supabase SQL Editor
-- ============================================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tabela: clientes
-- ============================================================
CREATE TABLE IF NOT EXISTS clientes (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome          TEXT NOT NULL,
  empresa       TEXT,
  cidade        TEXT NOT NULL,
  bairro        TEXT NOT NULL,
  endereco      TEXT,
  telefone      TEXT,
  email         TEXT,
  tipo_telhado  TEXT CHECK (tipo_telhado IN ('telha_ceramica','telha_metalica','laje','fibrocimento','outro')),
  face_telhado  TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Tabela: propostas
-- ============================================================
CREATE TABLE IF NOT EXISTS propostas (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_proposta     TEXT UNIQUE NOT NULL,
  cliente_id          UUID REFERENCES clientes(id) ON DELETE CASCADE,
  vendedor_nome       TEXT,

  -- Consumo
  consumo_atual_kwh       NUMERIC(10,2) NOT NULL,
  tem_ar_condicionado     BOOLEAN DEFAULT FALSE,
  qtd_ar_condicionado     INT DEFAULT 0,
  kwh_ar_condicionado     NUMERIC(10,2),
  tem_carro_eletrico      BOOLEAN DEFAULT FALSE,
  kwh_carro_eletrico      NUMERIC(10,2),
  tem_piscina_aquecida    BOOLEAN DEFAULT FALSE,
  kwh_piscina_aquecida    NUMERIC(10,2),
  tem_piso_aquecido       BOOLEAN DEFAULT FALSE,
  kwh_piso_aquecido       NUMERIC(10,2),
  tem_outros              BOOLEAN DEFAULT FALSE,
  desc_outros             TEXT,
  kwh_outros              NUMERIC(10,2),
  consumo_total_kwh       NUMERIC(10,2) NOT NULL,

  -- Opções de instalação
  distancia_inversor      TEXT CHECK (distancia_inversor IN ('<30m','<50m','<100m')),
  estrutura_metalica      BOOLEAN DEFAULT FALSE,
  estrutura_m2            NUMERIC(8,2),
  estrutura_custo         NUMERIC(10,2),
  linha_produto           TEXT CHECK (linha_produto IN ('premium','standard')) DEFAULT 'premium',

  -- Kit selecionado
  kit_placas_principal    INT NOT NULL,
  kit_economia_principal  NUMERIC(10,2) NOT NULL,
  kit_preco_principal     NUMERIC(10,2) NOT NULL,
  kit_kwh_principal       NUMERIC(10,2) NOT NULL,
  kit_placas_secundario   INT,
  kit_economia_secundario NUMERIC(10,2),
  kit_preco_secundario    NUMERIC(10,2),
  kit_kwh_secundario      NUMERIC(10,2),
  kit_total_placas        INT NOT NULL,
  kit_total_kwh           NUMERIC(10,2) NOT NULL,
  kit_preco_total         NUMERIC(10,2) NOT NULL,
  kit_preco_final         NUMERIC(10,2) NOT NULL,  -- com estrutura metálica
  kit_cobertura_pct       INT,

  -- Pagamento selecionado
  pagamento_metodo        TEXT CHECK (pagamento_metodo IN ('avista','boleto','cartao','financiamento')),
  pagamento_parcelas      INT,
  pagamento_entrada       NUMERIC(10,2) DEFAULT 0,
  pagamento_valor_parcela NUMERIC(10,2),
  pagamento_total         NUMERIC(10,2),

  -- ROI
  economia_anual          NUMERIC(12,2),
  payback_anos            INT,
  roi_pct_ano             NUMERIC(8,2),
  retorno_25_anos         NUMERIC(14,2),
  fluxo_caixa_json        JSONB,

  -- Status
  status                  TEXT CHECK (status IN ('draft','sent','approved','rejected')) DEFAULT 'draft',
  observacoes             TEXT,

  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Tabela: parametros_precos
-- ============================================================
CREATE TABLE IF NOT EXISTS parametros_precos (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome              TEXT NOT NULL DEFAULT 'default',
  kwh_price         NUMERIC(6,4) NOT NULL DEFAULT 1.04,
  standard_discount NUMERIC(4,3) NOT NULL DEFAULT 0.20,
  cash_discount     NUMERIC(4,3) NOT NULL DEFAULT 0.15,
  metal_structure_price NUMERIC(8,2) NOT NULL DEFAULT 1000.00,
  kits_json         JSONB NOT NULL,  -- array de KitEntry
  ativo             BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Tabela: configuracoes
-- ============================================================
CREATE TABLE IF NOT EXISTS configuracoes (
  chave   TEXT PRIMARY KEY,
  valor   TEXT NOT NULL,
  descricao TEXT
);

INSERT INTO configuracoes VALUES
  ('admin_password_hash', 'shams2024', 'Senha de acesso à área admin'),
  ('empresa_nome',        'SHAMS Energia Solar', 'Nome da empresa'),
  ('empresa_telefone',    '(41) 99665-9223', 'Telefone comercial'),
  ('empresa_email',       'comercial@shamsolar.net', 'Email comercial'),
  ('empresa_site',        'www.shamsenergia.com.br', 'Site da empresa'),
  ('empresa_instagram',   '@shamsenergiasolar', 'Instagram')
ON CONFLICT (chave) DO NOTHING;

-- ============================================================
-- Inserir tabela de preços padrão (linha premium)
-- ============================================================
INSERT INTO parametros_precos (nome, kwh_price, standard_discount, cash_discount, metal_structure_price, kits_json, ativo)
VALUES (
  'Tabela Julho 2024',
  1.04,
  0.20,
  0.15,
  1000.00,
  '[
    {"plates":4,  "economyMonthly":250,  "priceAVista":10923.59, "kwhMonth":240.38},
    {"plates":6,  "economyMonthly":350,  "priceAVista":13570.11, "kwhMonth":336.54},
    {"plates":8,  "economyMonthly":450,  "priceAVista":17279.80, "kwhMonth":432.69},
    {"plates":10, "economyMonthly":550,  "priceAVista":22129.66, "kwhMonth":528.85},
    {"plates":12, "economyMonthly":650,  "priceAVista":25256.08, "kwhMonth":625.00},
    {"plates":14, "economyMonthly":750,  "priceAVista":28545.68, "kwhMonth":721.15},
    {"plates":16, "economyMonthly":850,  "priceAVista":32204.00, "kwhMonth":817.31},
    {"plates":18, "economyMonthly":950,  "priceAVista":35175.03, "kwhMonth":913.46},
    {"plates":20, "economyMonthly":1050, "priceAVista":40482.84, "kwhMonth":1009.62},
    {"plates":24, "economyMonthly":1250, "priceAVista":46670.73, "kwhMonth":1201.92},
    {"plates":30, "economyMonthly":1550, "priceAVista":61075.89, "kwhMonth":1490.38},
    {"plates":40, "economyMonthly":2000, "priceAVista":79846.02, "kwhMonth":1923.08}
  ]'::jsonb,
  true
);

-- ============================================================
-- Índices para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_propostas_cliente   ON propostas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_propostas_numero    ON propostas(numero_proposta);
CREATE INDEX IF NOT EXISTS idx_propostas_status    ON propostas(status);
CREATE INDEX IF NOT EXISTS idx_propostas_created   ON propostas(created_at DESC);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================
ALTER TABLE clientes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas         ENABLE ROW LEVEL SECURITY;
ALTER TABLE parametros_precos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes     ENABLE ROW LEVEL SECURITY;

-- Políticas: leitura e escrita pública (ajuste conforme necessidade de auth)
CREATE POLICY "allow_all_clientes"          ON clientes          FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_all_propostas"         ON propostas         FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_read_parametros"       ON parametros_precos FOR SELECT USING (true);
CREATE POLICY "allow_all_parametros_admin"  ON parametros_precos FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "allow_read_configuracoes"    ON configuracoes     FOR SELECT USING (true);
