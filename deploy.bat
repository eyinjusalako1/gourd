@echo off
echo 🙏 Gathered Deployment Script
echo ================================

echo.
echo Step 1: Checking prerequisites...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    echo Download the LTS version and restart this script.
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed!
    pause
    exit /b 1
)

echo ✅ npm is installed
npm --version

echo.
echo Step 2: Installing dependencies...
echo.

REM Install dependencies
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    pause
    exit /b 1
)

echo ✅ Dependencies installed successfully

echo.
echo Step 3: Checking environment configuration...
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo ⚠️  .env.local not found!
    echo Creating from template...
    copy .env.local.example .env.local
    echo.
    echo 📝 Please edit .env.local with your Supabase credentials:
    echo    - NEXT_PUBLIC_SUPABASE_URL
    echo    - NEXT_PUBLIC_SUPABASE_ANON_KEY
    echo    - SUPABASE_SERVICE_ROLE_KEY
    echo.
    echo Press any key to open .env.local for editing...
    pause
    notepad .env.local
) else (
    echo ✅ .env.local found
)

echo.
echo Step 4: Building the application...
echo.

REM Build the application
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed!
    echo Please check your code and try again.
    pause
    exit /b 1
)

echo ✅ Build successful!

echo.
echo Step 5: Testing locally...
echo.

echo Starting development server...
echo Visit http://localhost:3000 to test your app
echo Press Ctrl+C to stop the server when done testing
echo.
npm run dev

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Test your app at http://localhost:3000
echo 2. Set up Supabase database (see DEPLOYMENT_SETUP.md)
echo 3. Deploy to Vercel: npm run deploy
echo.
pause










