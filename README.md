# User Management Service

A TypeScript-based microservice for user management with authentication, built using Node.js, Express, and Sequelize.

## Features

- User registration and authentication
- JWT-based authentication
- API key authentication for internal services
- Rate limiting
- PostgreSQL database with Sequelize ORM
- Swagger API documentation
- Comprehensive logging
- Docker support for development and production
- Unit and integration testing setup

## Prerequisites

- Node.js (v18 or later)
- Docker and Docker Compose
- PostgreSQL (if running locally)

## Environment Variables

Create the following environment files:

- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Testing environment

Example environment variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=user_service_dev
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# API Key for Internal Service Communication
X_API_KEY=your_internal_api_key_here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_WINDOW_MS=900000
AUTH_RATE_LIMIT_MAX_REQUESTS=5

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=logs/app.log
```

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-service-api
```

2. Install dependencies:
```bash
npm install
```

3. Run database migrations:
```bash
npm run migrate
```

## Development

Start the development server with hot-reloading:

```bash
npm run dev
```

Or using Docker Compose:

```bash
docker-compose -f docker-compose.dev.yml up
```

## Production

Build and start the production server:

```bash
npm run build
npm start
```

Or using Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Testing

Run tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:3000/api-docs
```

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot-reloading
- `npm run build` - Build the TypeScript code
- `npm test` - Run tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last database migration
- `npm run seed` - Run database seeders

## Project Structure

```
src/
├── config/         # Configuration files
├── controllers/    # Request handlers
├── middlewares/    # Express middlewares
├── models/         # Sequelize models
├── repositories/   # Database operations
├── routes/         # Express routes
├── services/       # Business logic
├── types/          # TypeScript types and interfaces
├── utils/          # Utility functions
└── test/          # Test files
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 