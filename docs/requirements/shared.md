# Shared Requirements
Application Summary
1. Purpose

	We are building a Fullstack RAG-powered Knowledge Assistant that allows employees to:

		1. Ask questions in natural language.
		2. Get answers from internal FAQs, policy documents, and workflow guidelines.
		3. If no exact match is found, the system leverages Google Vertex AI (Gemini) to generate a reliable answer.

	This app helps organizations provide faster self-service support and reduces dependency on manual query handling.


2. High-Level Architecture

	Frontend (React + Vite)

		1. Modern SPA (Single Page Application).
		2. Chat interface for users to ask questions.
		3. Admin dashboard to manage FAQs & documents.
		4. User authentication & role-based access.
	
	Backend (Spring Boot + PostgreSQL):

		1. REST APIs for chat, FAQs, documents, and metrics.
		2. Ingestion pipeline for uploading and chunking documents.
		3. RAG (Retrieval-Augmented Generation) pipeline:
		4. Embed user query.
		5. Retrieve relevant FAQs & document chunks.
		6. Rank/filter for confidence.
		7. Answer from DB or fallback to Gemini.
		8. Stores chat history for analytics.

3. Core Features

	End Users:
		1.Conversational Q&A chat.
		2. View sources/references for answers.
		3.Mobile & desktop responsive UI.

	Admins:
		1. CRUD operations for FAQs.
		2. Upload new documents/policies.
		3. Monitor system health & usage.
		4. Configure thresholds for RAG confidence.

4. Security & Config

	1. .env files for local development.
	2. GCP Secret Manager for cloud secrets.
	3. HTTPS everywhere.
	4. Role-based access (user/admin).
	
Backend Project Summary:

	The backend service is a Spring Boot + PostgreSQL application that powers the RAG-based knowledge assistant.
	
	It provides APIs for:

		1. Chat/Q&A (retrieval-augmented generation with Gemini fallback).
		2. FAQs management (CRUD for admin).
		3. Document ingestion (upload, chunk, store embeddings).
		4. Chat history & analytics storage.
		5. Authentication & role-based access (user/admin).

	It connects to:
		1. Postgres (for structured storage).
		2. Vector store (Postgres pgvector or Pinecone/Weaviate if needed).
		3. Google Vertex AI (Gemini) for LLM inference.
		4. Cloud Storage for document files.
		
Backend Repo Setup Prompts:

	Step 1: Generate Repo Skeleton
		
		Create a backend project skeleton using Spring Boot + Maven.
		Include empty folders and files for:
		- src/main/java (core application code)
		- src/main/resources (config, application.yml)
		- src/test/java (unit tests)
		- docs/ (design, architecture notes)
	

Tech stack  
- Frontend ReactJS + Vite + TailwindCSS (for styling)  
- Backend Java (Spring Boot) + PostgreSQL  
- Deployment Google Cloud Platform (Cloud Run + Cloud SQL)  

Project Structure
ai-faq-chatbot
│── shared.md                # Master requirements file
├── frontend                       # React + Vite app
├── backend                        # Java Spring Boot app
├── deployment                     # Deployment configs
└── README.md                       # Project overview and setup instructions

Environment & Configuration Guidelines
- Use `.env` files for sensitive configs and API keys (never commit real secrets).
- Provide `.env.example` templates in each module (frontend, backend, deployment).
- Frontend loads env vars using `import.meta.env` via Vite.
- Backend uses Spring Boot `.properties` with dotenv integration or Spring Config.
- Deployment scripts load environment variables securely from GCP Secret Manager.
- `.gitignore` must exclude `.env` files to prevent leaks.
- Master requirements.md links to scoped requirements in frontend, backend, and deployment.