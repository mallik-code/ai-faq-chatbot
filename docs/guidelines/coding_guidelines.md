# Coding Guidelines

This document provides the general coding principles and links to language-specific guidelines.

## 1. General Principles

### Naming Conventions
- **Clarity and Consistency:** Names must be descriptive, unambiguous, and consistent across the codebase. Avoid abbreviations that are not widely known.

### Formatting
- **Automation:** Use Prettier, ESLint, Checkstyle, or other language-appropriate tools to automatically enforce formatting rules. These should be integrated into the CI/CD pipeline.

### Comments
- **Why, not What:** Comments should explain *why* a piece of code exists, especially for complex business logic, not *what* the code does. The code itself should be self-documenting.

## 2. Language-Specific Guidelines

Please refer to the specific guidelines for the language you are using:

- [Java Guidelines](./java_guidelines.md)
- [Node.js/TypeScript Guidelines](./nodejs_guidelines.md)
- [Python Guidelines](./python_guidelines.md)
- [.NET Guidelines](./dotnet_guidelines.md)

## 3. Security Best Practices

- **Input Validation:** Always validate and sanitize user input on both the frontend and backend to prevent injection attacks (XSS, SQLi).
- **Parameterized Queries:** Use parameterized queries to prevent SQL injection. Never construct queries using string concatenation with user input.
- **Secrets Management:** Never hardcode secrets (API keys, passwords) in the source code. Use `.env` files for local development and a secure secret management service (like GCP Secret Manager) for deployed environments.