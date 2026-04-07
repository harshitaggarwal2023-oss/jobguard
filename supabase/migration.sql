CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'google',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  job_title TEXT NOT NULL,
  company_name TEXT NOT NULL,
  form_data JSONB NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('REAL','FAKE','SUSPICIOUS')),
  fraud_probability NUMERIC(5,4) NOT NULL,
  risk_scores JSONB NOT NULL,
  top_shap_features JSONB NOT NULL,
  red_flags JSONB NOT NULL DEFAULT '[]',
  explanation TEXT,
  is_public BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_analyses_user ON analyses(user_id);
CREATE INDEX idx_analyses_verdict ON analyses(verdict);
CREATE INDEX idx_analyses_created ON analyses(created_at DESC);
CREATE INDEX idx_analyses_active ON analyses(deleted_at) WHERE deleted_at IS NULL;

ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read_own_or_public" ON analyses FOR SELECT
  USING (user_id = auth.uid() OR is_public = true);
CREATE POLICY "insert_own" ON analyses FOR INSERT
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
CREATE POLICY "delete_own" ON analyses FOR DELETE
  USING (user_id = auth.uid());
