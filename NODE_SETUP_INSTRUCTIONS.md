# Node.js Setup Instructions

## Current Issue
Node.js 24.11.0 is installed, but Next.js 13.5.6 requires Node.js 20 LTS for proper SWC compiler support.

## Solution: Install Node.js 20 LTS

### Option 1: Manual Download (Recommended)
1. Visit: https://nodejs.org/en/download/
2. Download the **Windows Installer (.msi)** for **Node.js 20.x LTS**
3. Run the installer and follow the prompts
4. Restart your terminal/PowerShell
5. Verify: `node --version` should show `v20.x.x`

### Option 2: Using nvm-windows (For Multiple Node Versions)
1. Download nvm-windows from: https://github.com/coreybutler/nvm-windows/releases
2. Install nvm-windows
3. Open a new terminal and run:
   ```powershell
   nvm install 20.11.0
   nvm use 20.11.0
   ```

## After Installing Node.js 20
1. Open a new PowerShell terminal
2. Navigate to your project: `cd c:\Users\user\gourd`
3. Run: `npm run dev`
4. The server should start successfully!

## Why This Is Needed
- Next.js 13.5.6 was designed for Node.js 18-20
- Node.js 24 has OpenSSL compatibility issues with npm
- SWC compiler binary for Next.js 13.5.6 doesn't support Node.js 24

## Alternative: Upgrade Next.js (Not Recommended)
If you want to keep Node.js 24, you'd need to upgrade Next.js to version 14+, but this may require code changes.



