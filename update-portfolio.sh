#!/bin/bash

# Portfolio Auto-Update Script
# This script syncs projects from GitHub and commits changes

echo "🚀 Portfolio Auto-Update Script"
echo "==============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if we're in a git repository
if [ ! -d ".git" ]; then
    print_error "Not a git repository. Please run this script from your portfolio root directory."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js to run the sync script."
    exit 1
fi

# Check if sync script exists
if [ ! -f "sync-projects.js" ]; then
    print_error "sync-projects.js not found. Please ensure the script is in the current directory."
    exit 1
fi

print_status "Checking git status..."
if ! git diff --quiet HEAD; then
    print_warning "You have uncommitted changes. Please commit or stash them before running this script."
    echo "Uncommitted files:"
    git status --porcelain
    exit 1
fi

print_status "Fetching latest project data from GitHub..."

# Run the sync script
if node sync-projects.js; then
    print_success "Successfully synced project data"
else
    print_error "Failed to sync project data"
    exit 1
fi

# Check if projects.json was updated
if git diff --quiet projects.json; then
    print_status "No changes detected in projects.json"
    echo "Portfolio is already up to date! 🎉"
    exit 0
fi

print_status "Changes detected in projects.json"

# Show what changed
echo ""
echo "📋 Changes in projects.json:"
git diff --stat projects.json

# Add and commit changes
print_status "Staging changes..."
git add projects.json

print_status "Creating commit..."
COMMIT_MSG="🔄 Auto-update: Sync projects from GitHub

- Updated projects.json with latest repository data
- Total projects: $(node -e "console.log(require('./projects.json').totalProjects)")
- Last updated: $(date '+%Y-%m-%d %H:%M:%S')

🤖 Generated with automated sync script"

git commit -m "$COMMIT_MSG"

print_success "Changes committed successfully!"

# Ask if user wants to push to remote
echo ""
read -p "🚀 Push changes to remote repository? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_status "Pushing to remote repository..."
    if git push; then
        print_success "Changes pushed successfully!"
        echo ""
        echo "🌐 Your portfolio has been updated!"
        echo "   GitHub: https://github.com/miqdad-dev/Portfolio"
        echo "   Website: https://miqdad-dev.github.io/Portfolio/"
    else
        print_error "Failed to push changes"
        exit 1
    fi
else
    print_status "Changes committed locally but not pushed to remote"
    echo "Run 'git push' when you're ready to deploy the changes"
fi

echo ""
print_success "Portfolio update completed! ✨"