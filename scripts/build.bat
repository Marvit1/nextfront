@echo off
REM Build script for Render deployment (Windows)

echo 🚀 Starting build process...

REM Install dependencies with legacy peer deps
echo 📦 Installing dependencies...
call npm install --legacy-peer-deps --no-audit --no-fund

REM Build the project
echo 🔨 Building project...
call npm run build

echo ✅ Build completed successfully! 