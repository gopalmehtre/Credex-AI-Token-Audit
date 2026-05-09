CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS audits (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id      TEXT UNIQUE NOT NULL,        
  tools_input   JSONB NOT NULL,  
  audit_result  JSONB NOT NULL,            
  ai_summary    TEXT,                           
  total_monthly_savings NUMERIC(10,2) NOT NULL DEFAULT 0,
  total_annual_savings  NUMERIC(10,2) NOT NULL DEFAULT 0,
  use_case      TEXT NOT NULL DEFAULT 'mixed',
  team_size     INTEGER NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_hash       TEXT,
  email_captured BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_id      UUID REFERENCES audits(id) ON DELETE SET NULL,
  email         TEXT NOT NULL,
  company_name  TEXT,
  role          TEXT,
  team_size     INTEGER,
  monthly_savings NUMERIC(10,2),
  high_value    BOOLEAN NOT NULL DEFAULT FALSE,
  email_sent    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rate_limits (
  key           TEXT PRIMARY KEY,
  count         INTEGER NOT NULL DEFAULT 1,
  window_start  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audits_share_id ON audits(share_id);
CREATE INDEX IF NOT EXISTS idx_audits_created_at ON audits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_audit_id ON leads(audit_id);
CREATE INDEX IF NOT EXISTS idx_leads_high_value ON leads(high_value) WHERE high_value = TRUE;
