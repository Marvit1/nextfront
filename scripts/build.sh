#!/bin/bash

# Build script for Render deployment
set -e

echo "🚀 Starting build process..."

# Clean install with legacy peer deps
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --no-audit --no-fund

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Build completed successfully!" 