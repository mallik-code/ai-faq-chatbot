# AI FAQ Chatbot

This repository contains the starter code for an AI-powered FAQ Chatbot. The application is designed to be a full-stack solution with a frontend, backend, and deployment configurations for Google Cloud Platform.

## Project Structure

```
ai-faq-chatbot
├── .github/              # GitHub Actions workflows
├── backend/              # Backend services and libraries
├── docs/                 # Project documentation
├── frontend/             # Frontend application (React + Vite)
├── infra/                # Infrastructure as Code (IaC)
├── GEMINI.md             # Gemini project context
└── README.md             # Project overview (this file)
```

## Requirements

For a detailed breakdown of the project requirements, please see the following documents:

- [Frontend Requirements](./docs/requirements/frontend.md)
- [Backend Requirements](./docs/requirements/backend.md)
- [Deployment Requirements](./docs/requirements/deployment.md)
- [User Stories](./docs/requirements/user_stories.md)

## Architecture and Design

The project's architecture and design are documented in the [Architecture Document](./docs/architecture.md).

## Engineering Guidelines

This project adheres to a set of engineering guidelines to ensure code quality and consistency. For more information, please see the following documents:

- [Coding Guidelines](./docs/guidelines/coding_guidelines.md)
- [Design Principles](./docs/guidelines/design_principles.md)
- [Architectural Guidelines](./docs/guidelines/architectural_patterns.md)
- Language-Specific Guidelines:
    - [Java Guidelines](./docs/guidelines/java_guidelines.md)
    - [Node.js/TypeScript Guidelines](./docs/guidelines/nodejs_guidelines.md)
    - [Python Guidelines](./docs/guidelines/python_guidelines.md)
    - [.NET Guidelines](./docs/guidelines/dotnet_guidelines.md)

## Getting Started

### Prerequisites

- Node.js 18+
- Java JDK 17+
- Maven
- Docker (optional)

## Development

### Backend Development

The backend is a Spring Boot application built with Maven.

#### Environment Setup

Before running the backend services, you need to set up the environment variables. In the `backend/services/chat-service` directory, you will find a `.env.template` file. Copy this file to `.env.development` and fill in the required values for your local development environment.

```bash
cp .env.template .env.development
```

#### Running Locally

To run the chat service locally, navigate to the `backend/services/chat-service` directory and run the following command:

```bash
mvn spring-boot:run
```

This will start the chat service on the port specified in the `application.yml` file.

#### Running with Docker

Alternatively, you can run the backend services using Docker Compose. Make sure you have Docker and Docker Compose installed.

To start the services, run the following command from the `backend/services/chat-service` directory:

```bash
docker-compose up
```

For more detailed instructions on running the backend, including different environments and troubleshooting, please refer to the `backend/services/chat-service/how_to_run.md` file.

### Frontend Development

The frontend is a React application built with Vite.

To run the frontend locally, navigate to the `frontend` directory and run the following commands:

```bash
npm install
npm run dev
```

This will start the frontend development server and open the application in your default browser.

## Deployment

[To be added]

## Contributing

[To be added]

## License

[To be added]