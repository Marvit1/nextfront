@echo off
REM Deployment script for News Scraper Frontend (Windows)
REM This script automates the build and deployment process

echo 🚀 Starting deployment process...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Please run this script from the project root.
    exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js version: %NODE_VERSION%

REM Check npm version
for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm version: %NPM_VERSION%

REM Clean previous builds
echo [INFO] Cleaning previous builds...
call npm run clean

REM Install dependencies
echo [INFO] Installing dependencies...
call npm ci

REM Type checking
echo [INFO] Running TypeScript type checking...
call npm run type-check

REM Linting
echo [INFO] Running ESLint...
call npm run lint

REM Build the project
echo [INFO] Building the project...
call npm run build

REM Check if build was successful
if exist "out" (
    echo [SUCCESS] Build completed successfully!
    echo [INFO] Static files are ready in the 'out' directory
    
    REM Show build contents
    echo [INFO] Main files in build:
    dir out
    
) else (
    echo [ERROR] Build failed! 'out' directory not found.
    exit /b 1
)

REM Check environment variables
echo [INFO] Checking environment variables...
if "%NEXT_PUBLIC_API_URL%"=="" (
    echo [WARNING] NEXT_PUBLIC_API_URL is not set. Using default: https://beackkayq.onrender.com
) else (
    echo [SUCCESS] NEXT_PUBLIC_API_URL is set to: %NEXT_PUBLIC_API_URL%
)

echo [SUCCESS] Deployment preparation completed!
echo.
echo [INFO] Next steps:
echo 1. Push your code to GitHub
echo 2. Deploy on Render using the configuration in render.yaml
echo 3. Set environment variables in Render dashboard
echo 4. Test the deployment at your Render URL
echo.
echo [INFO] For detailed instructions, see DEPLOYMENT.md

pause 