#!/bin/bash

# Create and switch to dev_eren branch
git checkout -b dev_eren 2>/dev/null || git checkout dev_eren

# Stage and commit auth-related changes
git add src/middlewares/auth.ts
git commit -m "feat(auth): add username to JWT token payload and update token verification
- Add username field to JWT payload structure
- Update token verification to check for username presence
- Enhance type definitions for better TypeScript support"

# Stage and commit service-related changes
git add src/services/UserService.ts
git commit -m "feat(user-service): update token generation to include username
- Modify generateToken method to include username in payload
- Update login flow to pass username to token generation
- Enhance type safety in token handling"

# Stage and commit swagger changes
git add swagger.json
git commit -m "docs(swagger): update API documentation for JWT changes
- Add username field to JWT token description
- Update security scheme documentation
- Enhance response examples for authentication endpoints"

# Stage and commit any remaining changes
git add .
git commit -m "chore: update remaining files and configurations
- Update type definitions
- Fix linting issues
- Update documentation"

# Push all changes to dev_eren branch
echo "Pushing changes to dev_eren branch..."
git push origin dev_eren

echo "Done! All changes have been committed and pushed to dev_eren branch." 