# Gathered Deployment Script (PowerShell)
# Run this script to set up and deploy Gathered

Write-Host "🙏 Gathered Deployment Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "Download the LTS version and restart this script." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm is installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 2: Installing dependencies..." -ForegroundColor Yellow
Write-Host ""

# Install dependencies
try {
    npm install
    Write-Host "✅ Dependencies installed successfully" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 3: Checking environment configuration..." -ForegroundColor Yellow
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local found" -ForegroundColor Green
} else {
    Write-Host "⚠️  .env.local not found!" -ForegroundColor Yellow
    Write-Host "Creating from template..." -ForegroundColor Yellow
    Copy-Item ".env.local.example" ".env.local"
    Write-Host ""
    Write-Host "📝 Please edit .env.local with your Supabase credentials:" -ForegroundColor Cyan
    Write-Host "   - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor White
    Write-Host "   - NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor White
    Write-Host "   - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to open .env.local for editing"
    notepad .env.local
}

Write-Host ""
Write-Host "Step 4: Building the application..." -ForegroundColor Yellow
Write-Host ""

# Build the application
try {
    npm run build
    Write-Host "✅ Build successful!" -ForegroundColor Green
} catch {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host "Please check your code and try again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Step 5: Testing locally..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Starting development server..." -ForegroundColor Cyan
Write-Host "Visit http://localhost:3000 to test your app" -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server when done testing" -ForegroundColor Cyan
Write-Host ""

# Start development server
npm run dev

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Test your app at http://localhost:3000" -ForegroundColor White
Write-Host "2. Set up Supabase database (see DEPLOYMENT_SETUP.md)" -ForegroundColor White
Write-Host "3. Deploy to Vercel: npm run deploy" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"