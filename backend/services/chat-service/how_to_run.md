# How to Run the Chat Service

This guide explains how to run the Chat Service using Docker in different environments.

## Prerequisites

- Docker and Docker Compose installed
- JDK 17 (for local development)
- Maven (for local development)

## Environment Setup

The service uses environment-specific configuration files:

- `.env.template` - Template file showing all required variables
- `.env.development` - Development environment settings
- `.env.production` - Production environment settings
- Custom environment files (e.g., `.env.staging`) as needed

### Setting Up a New Environment

1. Copy the template file:
```bash
cp .env.template .env.<environment_name>
```

2. Edit the new file with your specific values:
```bash
# Database Configuration
DB_HOST=your-db-host
DB_PORT=your-db-port
DB_NAME=your-db-name
DB_USER=your-db-user
DB_PASSWORD=your-db-password

# GCP Configuration
GCP_PROJECT_ID=your-project-id
GCP_REGION=your-region
GEMINI_MODEL_ID=your-model-id

# Application Configuration
SERVER_PORT=8080
SPRING_PROFILES_ACTIVE=your-environment
```

## Running the Service

### Development Environment

To run the service in development mode:

```bash
docker-compose up
```

This will:
- Use `.env.development` by default
- Start the service on the configured port (default: 8080)
- Set up the required network

### Production Environment

To run the service in production mode:

```bash
ENVIRONMENT=production docker-compose up
```

### Custom Environment

To run with a custom environment file:

```bash
ENVIRONMENT=staging docker-compose up
```

### Running in Detached Mode

To run the service in the background:

```bash
docker-compose up -d
```

## Monitoring and Maintenance

### Viewing Logs

To view container logs:

```bash
docker-compose logs -f
```

### Stopping the Service

To stop the service:

```bash
docker-compose down
```

To stop and remove volumes:

```bash
docker-compose down -v
```

### Rebuilding the Service

If you make changes to the application, rebuild the container:

```bash
docker-compose up --build
```

## Environment Variables

### Required Variables

| Variable | Description | Default |
|----------|-------------|---------|
| DB_HOST | Database host address | localhost |
| DB_PORT | Database port | 5432 |
| DB_NAME | Database name | aifaq |
| DB_USER | Database username | postgres |
| DB_PASSWORD | Database password | postgres |
| GCP_PROJECT_ID | Google Cloud Project ID | - |
| GCP_REGION | Google Cloud Region | us-central1 |
| GEMINI_MODEL_ID | Gemini AI Model ID | - |
| SERVER_PORT | Application server port | 8080 |
| SPRING_PROFILES_ACTIVE | Active Spring profile | development |

## Security Notes

1. Never commit environment files (`.env.*`) to version control except for `.env.template`
2. Keep production credentials secure and separate from development
3. Regularly rotate passwords and access keys
4. Use secrets management in production environments

## Troubleshooting

### Common Issues

1. **Container fails to start**
   - Check if all required environment variables are set
   - Verify database connectivity
   - Check container logs using `docker-compose logs`

2. **Database connection issues**
   - Verify DB_HOST is accessible from the container
   - Check if database credentials are correct
   - Ensure database is running and accepting connections

3. **Port conflicts**
   - Change SERVER_PORT in your environment file
   - Check if another service is using the same port

## Best Practices

1. Always use environment-specific configuration files
2. Never store sensitive data in Docker images
3. Use version control for templates and documentation
4. Regularly update dependencies and base images
5. Monitor container health and logs
6. Use appropriate logging levels for different environments
