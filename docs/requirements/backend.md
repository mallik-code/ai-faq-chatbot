# Backend Requirements

# Backend Requirements — AI FAQ Chatbot

## Summary
Microservices-based application providing REST APIs for chat, FAQs, document ingestion and admin tasks. Implements a **Retrieval-Augmented Generation (RAG)** pipeline that retrieves relevant document chunks, constructs a constrained prompt, calls Gemini via Vertex AI, and returns a grounded response with provenance.

---

## Tech & Runtime

### Common Requirements
- Java 17+, Spring Boot 3.x
- Docker and Docker Compose for containerization
- Environment-based configuration management
- Secrets management via environment files (local) and Secret Manager (production)

### Chat Service
- Spring Boot web application
- Spring Data JPA + PostgreSQL (Cloud SQL)
- Environment-specific configuration (.env files)
- Docker-based deployment
- Vertex AI integration for Gemini

### RAG Service
- Spring Boot web application
- pgvector extension for embeddings
- Document processing and chunk management
- Vertex AI integration for embeddings
- Docker-based deployment

### Infrastructure
- Docker containers for all services
- Docker Compose for local development
- PostgreSQL (Cloud SQL in production)
- Optional Redis caching (Memorystore)
- Secret Manager for production credentials

## Project Structure

### Chat Service Structure
```
chat-service/
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   │       └── application.yml
│   └── test/
├── Dockerfile                 # Multi-stage Docker build
├── docker-compose.yml        # Local development setup
├── .env.template            # Environment variables template
├── .env.development        # Development environment config
├── .env.production        # Production environment config
└── how_to_run.md         # Service documentation
```

### Environment Configuration
Each service follows a standardized environment configuration:

1. **Environment Files:**
   - `.env.template` - Documented template of all variables
   - `.env.development` - Development environment settings
   - `.env.production` - Production environment settings

2. **Docker Configuration:**
   - Multi-stage Dockerfile for optimized builds
   - Docker Compose for local development
   - Environment-specific configurations

3. **Documentation:**
   - Service-specific setup instructions
   - Environment configuration guide
   - Troubleshooting information

---

## Database Schema (detailed)
> Use migrations (Flyway or Liquibase) and include schema.sql for dev.

```sql
-- Enable pgvector extension (requires admin)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(512) NOT NULL,
  department VARCHAR(128),
  source_url TEXT,           -- Cloud Storage path
  content TEXT,              -- optional full text copy
  uploaded_by VARCHAR(128),
  uploaded_at TIMESTAMPTZ DEFAULT now(),
  version INT DEFAULT 1,
  status VARCHAR(32) DEFAULT 'INGESTED' -- INGESTED, PROCESSING, FAILED
);

-- Embeddings stored per-chunk; vector dimension is configurable via env.
CREATE TABLE embeddings (
  id SERIAL PRIMARY KEY,
  document_id INT REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INT,
  chunk_text TEXT,
  embedding vector(1536),   -- adjust dim to embedding model (configurable)
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (embedding) WITH (lists = 100);
-- create pg_trgm full-text indexes for search if needed

CREATE TABLE faqs (
  id SERIAL PRIMARY KEY,
  question TEXT,
  answer TEXT,
  department VARCHAR(128),
  curated BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chat_history (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(128),
  question TEXT,
  answer TEXT,
  sources JSONB,  -- list of {docId, chunk_index, snippet}
  confidence NUMERIC,
  llm_used BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);


API Specifications (detailed)
Request:
POST /chat
{
  "userId": "emp123",
  "query": "What is the travel reimbursement limit?",
  "sessionId": "optional-session-id"
}

Response:
{
  "answer": "The travel reimbursement limit is INR 50,000 per trip. [source: Travel Policy 2023]",
  "sources": [
    { "docId": 12, "title": "Travel Policy 2023", "chunk_index": 4, "snippet": "...", "score": 0.92 }
  ],
  "confidence": 0.86,
  "llm_used": true,
  "chatId": 4532
}


Error codes:

400 bad request

401 unauthorized

429 rate-limited

500 internal error

Flow (detailed):

Sanitize incoming query: remove PII, trim whitespace; optionally redact sensitive keys.

Embed Query: call embeddings endpoint to get vector.

Similarity Search: query embeddings table for top-K (K=10 default) nearest neighbors via cosine similarity (use vector ops).

Rank & Filter:

Apply heuristics: filter docs older than TTL (optional), boost curated faqs.

Keep top 3 chunks where cosine similarity >= SIMILARITY_THRESHOLD (configurable).

Heuristic DB Answer Shortcut:

If top candidate has curated=true and similarity >= DB_SHORTCUT_THRESHOLD (e.g., 0.85), return DB answer directly (no LLM call) with llm_used = false.

Prompt Construction:

Use SYSTEM preamble instructing assistant to base answers on provided snippets, cite sources, be concise, and avoid hallucination (see prompt template below).

Insert retrieved snippets: include doc title, docId, chunk_index, chunk_text (truncate each chunk to N tokens).

LLM Call:

Call Vertex AI / Gemini with prompt, max tokens and temperature tuned for conservative answers.

Request structured output: JSON { answer: "...", citations: [ {docId, chunk_index} ], confidence: 0.0-1.0 } if model supports structured output; else parse text.

Post-process:

Validate the LLM's cited docIds exist in sources list.

If model returns no sources, mark llm_used = true and sources = [] with "no source" flag.

Persist: Save to chat_history (sanitized) with metadata, token usage (optional).

Return to client.


RAG Design — Deep Details (the USP)
Document ingestion pipeline

Upload

Admin uploads file to POST /upload-doc (multipart). Backend stores raw file in Cloud Storage (private bucket), creates documents record with status=PROCESSING.

Text Extraction

Extract text from PDF/DOCX/TXT:

PDF: use PDF text extraction + fallback OCR for images (Tesseract or Cloud Vision).

DOCX: Apache POI or similar.

TXT: read as-is.

Normalization

Normalize whitespace, remove non-printables, detect language, strip footers/headers where possible.

Chunking

Chunk strategy:

Chunk size: approx. 800–1200 characters (or ~200–300 tokens) — configurable.

Overlap: 20–30% overlap between chunks to preserve context across boundaries.

Keep chunk metadata: document_id, chunk_index, char_range, sentence boundaries.

Embedding Generation

Generate embeddings per chunk via Vertex AI Embedding model (embedding model name in env).

Config: batch requests, exponential backoff for rate limits.

Storage

Store chunk_text and embedding in embeddings table with index.

Deduplication & Versioning

Compute a chunk hash (sha256). If same chunk exists, skip duplicate insertion; tag with multiple document_ids if necessary.

Version control at document level. When document updated -> create new doc version; optionally mark old version deprecated.

Retrieval & Ranking

Nearest Neighbor search:

Use cosine similarity by normalizing vectors.

Retrieve top-K (10) and re-rank by combination of similarity, recency, department match, curated flag.

Similarity threshold:

SIMILARITY_THRESHOLD_DEFAULT = 0.7 (tune via eval).

DB_SHORTCUT_THRESHOLD = 0.85 (if high-confidence DB match, skip LLM).

Reranking via LLM:

Optional: send short candidate list to Gemini for re-ranking or summarization to produce a final top-3 context.


Prompt Engineering (templates)

	System prompt (preamble):
	
	System: You are an assistant that MUST base answers on the provided policy snippets. Always cite snippet titles and chunk indexes. If the policy does not answer the question, say “I don’t know” and suggest next steps. Be concise and list exact policy references.


	Context block:
	=== CONTEXT START ===
	[DOC: {title} | id={docId} | chunk={chunk_index}]
	{chunk_text}
	=== CONTEXT END ===

	User Question:

	Question: {user question}
	
Assistant behavior:

	Prefer quoting policy text verbatim where appropriate with quotes and citation.

	If contradictory documents, call out the conflict and cite both.
	
	Add a short reproducible source list at the end in JSON format: { "sources": [ {"docId":12, "chunk":4, "title":"Travel Policy 2023"} ], "confidence": 0.86 }
	
	
	
	
Safety & Hallucination Mitigation

Hard rule: if no retrieved snippets pass threshold, either:

Return a short fallback that encourages user to consult admin (no invented facts).

Or call LLM but include "This answer is not grounded in policy documents; verify with HR" and mark llm_used = true.

Redaction: before sending user query, redact personally identifiable info (PII) unless explicitly allowed for processing.

Rate-limit interactive LLM calls to avoid runaway cost.

Provenance & UI contract

Response MUST include:

sources[]: each with docId, title, chunk_index, snippet.

confidence: float [0,1]

llm_used: boolean

Frontend displays these and enables click-through to highlighted snippet viewer.

Metrics to collect

Retrieval latency (db search), LLM latency, total end-to-end latency

of LLM calls vs DB shortcuts

Average similarity scores

Feedback ratio (thumbs up/down)

Token usage & cost per request

Error rates and ingestion failure counts

Operational & Security Requirements

Use GCP Secret Manager for GEMINI API keys and DB passwords; do not store secrets in DB or logs.

Service account roles: Cloud Run needs Cloud SQL Client, Storage Object Viewer/Creator, Secret Manager access.

Network: use Serverless VPC connector to connect Cloud Run to Cloud SQL privately.

Logging: store sanitized queries & responses in Cloud Logging; persist chat_history but consider PII masking policies.

Backups: daily Cloud SQL automated backups; retention policy defined in deployment file.

Testing & Acceptance Criteria

Unit tests: repository + service layer.

Integration: ingestion pipeline (sample PDF) -> verify embeddings created -> search returns the chunk.

RAG-specific tests:

Known Q that should be answered directly from DB => DB shortcut triggered.

Ambiguous Q requiring multi-doc synthesis => LLM used and cites two docs.

Hallucination case: LLM-only answers should be flagged and fallback message shown.

Performance: 95% of DB-only queries < 500ms; RAG queries (including LLM) < 3s for demo SLA.

Developer tasks (backend sprint)

Setup Spring Boot skeleton + application.properties to read env.

Implement Entities + Repositories (Faq, Document, Embedding, ChatHistory).

Implement DocumentService: upload -> extract -> chunk -> embed -> store.

Implement RAGService: embed query -> search -> rank -> prompt -> call LLM -> postprocess.

Implement ChatController /chat and Admin endpoints /upload-doc, /faqs.

Add caching layer (optional) and metrics.

Add tests and sample seed data.