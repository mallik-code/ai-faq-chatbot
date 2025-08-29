# Architecture

The application follows a microservices-based architecture:

-   **Frontend:** A single-page application (SPA) built with React.
-   **Backend Services:**
    - **API Gateway:** Entry point for all client requests
    - **Chat Service:** Handles chat interactions and RAG pipeline
    - **RAG Service:** Manages document processing and retrieval
-   **Database:** A PostgreSQL database for data persistence.
-   **Deployment:** Containerized microservices deployed on GCP.

# Design

### Frontend Design

-   **Component-Based:** The frontend is built using reusable React components.
-   **Styling:** TailwindCSS is used for utility-first styling.
-   **State Management:** (Not specified, but a simple state management like React Context or Zustand could be used).

### Backend Design

#### Service Architecture
Each service follows these architectural principles:

-   **Containerization:** Docker-based deployment with multi-stage builds
-   **Configuration Management:** Environment-based configuration using .env files
-   **Infrastructure as Code:** Docker Compose for local development
-   **Scalability:** Stateless design for horizontal scaling

#### Environment Configuration
Services use a standardized environment configuration approach:
-   Template-based environment files (.env.template)
-   Environment-specific configurations (.env.development, .env.production)
-   Docker Compose for local development and testing
-   Secrets management for sensitive data

#### Layered Architecture
Each service is structured into layers:
    -   `controller`: Handles HTTP requests.
    -   `service`: Contains business logic.
    -   `model`: Defines data structures.
    -   `repository`: Manages data access.
-   **RESTful:** The API follows REST principles.
