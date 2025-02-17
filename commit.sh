#!/bin/bash

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if git repository
check_git_repo() {
    if [ ! -d .git ]; then
        echo -e "${YELLOW}This is not a git repository. Initializing...${NC}"
        git init
    fi
}

# Function to add and commit files with custom messages
commit_changes() {
    # Check if there are any changes
    if [[ -z $(git status -s) ]]; then
        echo -e "${YELLOW}No changes to commit.${NC}"
        exit 0
    fi

    # Add all changes
    git add .

    # Commit with specific messages for different files
    if git diff --cached --name-only | grep -q "src/routes/health.routes.ts"; then
        git commit -m "fix: Update health routes configuration and routing"
    fi

    if git diff --cached --name-only | grep -q "src/controllers/UserController.ts"; then
        git commit -m "feat: Add getUserByEmail method to UserController"
    fi

    # Add a general commit for other changes
    git commit -m "chore: Various project updates and fixes" || true

    # Push changes
    git push origin main || git push origin master
}

# Main script execution
check_git_repo
commit_changes

echo -e "${GREEN}Commit and push completed successfully!${NC}" 