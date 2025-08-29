# AI-Powered FAQ Chatbot

## Overview

This is a full-stack AI-powered FAQ chatbot application built with a modern tech stack. The application allows users to interact with an AI assistant that can answer questions based on a managed knowledge base of frequently asked questions. It features a clean, responsive interface with both user-facing chat functionality and administrative tools for managing FAQ content.

The system provides real-time chat interactions powered by OpenAI's GPT models, comprehensive FAQ management capabilities, and analytics to track usage patterns and system performance.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React with TypeScript**: The client-side application is built using React 18 with TypeScript, providing type safety and modern component architecture. The application uses functional components with hooks for state management.

**Vite Build System**: Chosen for fast development builds and hot module replacement, significantly improving developer experience compared to traditional webpack-based solutions.

**Styling Framework**: Implements Tailwind CSS for utility-first styling combined with Radix UI components through shadcn/ui for accessible, pre-built UI primitives. This approach provides both design flexibility and accessibility compliance out of the box.

**Routing**: Uses Wouter for lightweight client-side routing, providing a minimal API surface while supporting the application's simple navigation needs between chat and admin interfaces.

**State Management**: Leverages TanStack Query (React Query) for server state management, handling API calls, caching, and synchronization. Local component state is managed through React hooks.

### Backend Architecture

**Express.js Server**: Node.js backend using Express for handling HTTP requests and serving both API endpoints and static files. The server implements middleware for request logging, JSON parsing, and error handling.

**TypeScript**: Full TypeScript implementation across the backend for type safety and better development experience.

**Modular Route Architecture**: Routes are organized in a dedicated module system with clear separation between FAQ management, chat functionality, and statistics endpoints.

**Storage Layer**: Implements an abstraction layer (IStorage interface) with an in-memory implementation for development. This design allows for easy swapping to database-backed storage without changing business logic.

### Data Storage Solutions

**Drizzle ORM**: Configured for PostgreSQL with schema definitions in TypeScript, providing type-safe database operations and migrations. The schema defines three main entities: users, FAQs, and chat messages.

**Neon Database**: Configured to use Neon's serverless PostgreSQL for production deployment, with connection pooling and automatic scaling capabilities.

**Schema Design**: 
- FAQs table with categories, usage tracking, and timestamps
- Chat messages table storing user queries, AI responses, and confidence scores
- Users table for potential future authentication features

### Authentication and Authorization

**Minimal Auth**: Currently implements a basic user schema structure but authentication is not actively enforced, allowing for future implementation of proper user management and role-based access control.

### AI Integration

**OpenAI Integration**: Uses OpenAI's GPT-5 model for generating contextual responses to user queries. The system provides FAQ context to the AI model to ensure responses are grounded in the knowledge base.

**Confidence Scoring**: Implements confidence tracking for AI responses to help identify when human intervention might be needed.

**Context-Aware Responses**: The AI service receives the full FAQ database as context, allowing it to provide more accurate and relevant responses while maintaining consistency with documented answers.

## External Dependencies

### AI Services
- **OpenAI API**: Core AI functionality using GPT-5 for natural language processing and response generation

### Database Services
- **Neon Database**: Serverless PostgreSQL database for production data storage
- **Drizzle Kit**: Database migration and schema management tools

### UI/UX Libraries
- **Radix UI**: Headless, accessible UI primitives for complex components like dialogs, dropdowns, and form controls
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling
- **Lucide React**: Icon library providing consistent iconography across the application

### Development Tools
- **Vite**: Build tool and development server with hot module replacement
- **TanStack Query**: Server state management and data fetching library
- **React Hook Form**: Form handling with validation and error management
- **Zod**: Runtime type validation and schema parsing for API requests and responses

### Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional CSS class name utility
- **nanoid**: Unique ID generation for entities

### Deployment Platform
- **Replit**: Development and hosting platform with integrated development tools and deployment capabilities