-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Documents table
CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(512) NOT NULL,
  department VARCHAR(128),
  source_url TEXT,
  content TEXT,
  uploaded_by VARCHAR(128),
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  status VARCHAR(32) DEFAULT 'INGESTED'
);

-- Embeddings table
CREATE TABLE embeddings (
  id SERIAL PRIMARY KEY,
  document_id INT REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INT,
  chunk_text TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create vector search index
CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (embedding) WITH (lists = 100);

-- FAQs table
CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT,
  answer TEXT,
  department VARCHAR(128),
  curated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat history table
CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(128),
  question TEXT,
  answer TEXT,
  sources JSONB,
  confidence NUMERIC,
  llm_used BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
