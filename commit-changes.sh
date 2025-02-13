#!/bin/bash

# Add all changes first
git add .

# Commit changes for configuration files
git commit -m "refactor: remove Swagger dependencies and configuration
- Remove swagger-jsdoc and swagger-ui-express packages
- Delete swagger.ts configuration file
- Clean up app.ts from Swagger setup"

# Commit changes for route files
git commit -m "refactor: clean up route files
- Remove Swagger JSDoc comments from auth.routes.ts
- Clean up unnecessary documentation
- Maintain only essential route documentation"

# Commit changes for documentation
git commit -m "docs: update API documentation
- Remove dynamic Swagger documentation
- Add static swagger.json for API reference
- Update documentation structure"

# Push changes
echo "All changes have been committed. You can now push with:"
echo "git push origin your-branch-name" 