#!/bin/bash

# Deployment script for Gourd
echo "🚀 Starting deployment process for Gourd..."

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ node_modules not found. Please run 'npm install' first."
    exit 1
fi

# Run linting
echo "🔍 Running ESLint..."
npm run lint

# Build the project
echo "🏗️ Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo "📦 Ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Deploy to Vercel: vercel --prod"
    echo "2. Deploy to Netlify: netlify deploy --prod --dir=out"
    echo "3. Or upload the 'out' folder to your hosting provider"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi






