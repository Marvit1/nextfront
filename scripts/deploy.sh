#!/bin/bash

# Deployment script for News Scraper Frontend
# This script automates the build and deployment process

set -e  # Exit on any error

echo "🚀 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version: $(node --version)"

# Check npm version
NPM_VERSION=$(npm --version | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 8 ]; then
    print_error "npm 8+ is required. Current version: $(npm --version)"
    exit 1
fi

print_success "npm version: $(npm --version)"

# Clean previous builds
print_status "Cleaning previous builds..."
npm run clean

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Type checking
print_status "Running TypeScript type checking..."
npm run type-check

# Linting
print_status "Running ESLint..."
npm run lint

# Build the project
print_status "Building the project..."
npm run build

# Check if build was successful
if [ -d "out" ]; then
    print_success "Build completed successfully!"
    print_status "Static files are ready in the 'out' directory"
    
    # Show build size
    BUILD_SIZE=$(du -sh out | cut -f1)
    print_status "Build size: $BUILD_SIZE"
    
    # List main files
    print_status "Main files in build:"
    ls -la out/
    
else
    print_error "Build failed! 'out' directory not found."
    exit 1
fi

# Check environment variables
print_status "Checking environment variables..."
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    print_warning "NEXT_PUBLIC_API_URL is not set. Using default: https://beackkayq.onrender.com"
else
    print_success "NEXT_PUBLIC_API_URL is set to: $NEXT_PUBLIC_API_URL"
fi

print_success "Deployment preparation completed!"
echo ""
print_status "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Deploy on Render using the configuration in render.yaml"
echo "3. Set environment variables in Render dashboard"
echo "4. Test the deployment at your Render URL"
echo ""
print_status "For detailed instructions, see DEPLOYMENT.md" 