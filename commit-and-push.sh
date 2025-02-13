#!/bin/bash

# Create and checkout dev_eren branch
git checkout -b dev_eren

# Project configuration files
git add .eslintrc.js .prettierrc tsconfig.json nodemon.json jest.config.js
git commit -m "chore(config): add TypeScript, ESLint, Prettier, and Jest configurations"

# Package files
git add package.json package-lock.json
git commit -m "chore(deps): initialize project dependencies"

# Main application files
git add src/app.ts src/index.ts
git commit -m "feat(core): implement main application setup and server initialization"

# Config files
git add src/config/database.ts src/config/config.ts src/config/swagger.ts
git commit -m "feat(config): implement database configuration and environment setup"

# Models
git add src/models/User.ts
git commit -m "feat(models): implement User model with Sequelize and TypeScript types"

# DTOs
git add src/types/dto/*
git commit -m "feat(dto): add user data transfer objects for type safety"

# Repositories
git add src/repositories/UserRepository.ts
git commit -m "feat(repository): implement UserRepository with CRUD operations"

# Services
git add src/services/*
git commit -m "feat(service): add user service layer with business logic"

# Controllers
git add src/controllers/*
git commit -m "feat(controller): implement REST endpoints for user management"

# Middleware
git add src/middlewares/*
git commit -m "feat(middleware): add authentication, validation, and error handling middleware"

# Routes
git add src/routes/*
git commit -m "feat(routes): set up API routes with validation and authentication"

# Error handling
git add src/errors/*
git commit -m "feat(error): implement custom error classes and handlers"

# Utils
git add src/utils/*
git commit -m "feat(utils): add utility functions for validation and logging"

# Tests
git add src/test/*
git commit -m "test: add unit and integration tests"

# Docker files
git add Dockerfile.* docker-compose.*.yml
git commit -m "feat(docker): add Docker configuration for development and production"

# Environment and config files
git add .env.* .sequelizerc .cursorrules
git commit -m "chore(config): add environment configuration files"

# Logs directory
git add logs/
git commit -m "chore: add logs directory for application logging"

# Documentation
git add README.md
git commit -m "docs: add comprehensive README with setup and usage instructions"

# Push to remote
git push origin dev_eren 