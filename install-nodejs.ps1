# Node.js Installation Helper Script
# This script will help you install Node.js and verify the installation

Write-Host "🚀 Node.js Installation Helper" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is already installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is already installed: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm is available: $(npm --version)" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 You're ready to proceed with deployment!" -ForegroundColor Green
    Read-Host "Press Enter to continue"
    exit 0
} catch {
    Write-Host "❌ Node.js is not installed" -ForegroundColor Red
}

Write-Host ""
Write-Host "📥 Installing Node.js..." -ForegroundColor Yellow
Write-Host ""

# Try to install using winget (Windows 10/11)
try {
    Write-Host "Attempting to install Node.js using winget..." -ForegroundColor Yellow
    winget install OpenJS.NodeJS --accept-package-agreements --accept-source-agreements
    Write-Host "✅ Node.js installation completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Winget installation failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 Manual Installation Required:" -ForegroundColor Yellow
    Write-Host "1. Go to https://nodejs.org/" -ForegroundColor White
    Write-Host "2. Download the LTS version (recommended)" -ForegroundColor White
    Write-Host "3. Run the installer and follow the setup wizard" -ForegroundColor White
    Write-Host "4. Restart your terminal after installation" -ForegroundColor White
    Write-Host ""
    Write-Host "After manual installation, run this script again to verify." -ForegroundColor Cyan
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "🔄 Refreshing environment..." -ForegroundColor Yellow

# Refresh environment variables
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host ""
Write-Host "✅ Verifying installation..." -ForegroundColor Yellow

# Verify installation
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm installed: $npmVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "🎉 Installation successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Run the deployment script: .\deploy.ps1" -ForegroundColor White
    Write-Host "2. Set up Supabase project" -ForegroundColor White
    Write-Host "3. Deploy to Vercel" -ForegroundColor White
} catch {
    Write-Host "❌ Installation verification failed" -ForegroundColor Red
    Write-Host "Please restart your terminal and try again." -ForegroundColor Yellow
}

Write-Host ""
Read-Host "Press Enter to exit"


