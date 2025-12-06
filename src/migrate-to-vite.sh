#!/bin/bash

# Migration Script for Vite Setup
# This script moves files to src/ directory for Vite project structure

echo "🚀 Starting migration to Vite structure..."

# Create src directories
echo "📁 Creating src directories..."
mkdir -p src/components/figma
mkdir -p src/components/ui
mkdir -p src/styles

# Copy components
echo "📦 Copying components..."
if [ -d "components" ]; then
  cp -r components/* src/components/
  echo "✅ Components copied"
else
  echo "⚠️  components/ directory not found"
fi

# Copy styles
echo "🎨 Copying styles..."
if [ -d "styles" ]; then
  cp -r styles/* src/styles/
  echo "✅ Styles copied"
else
  echo "⚠️  styles/ directory not found"
fi

# Remove old files (optional - uncomment if needed)
# echo "🗑️  Removing old files..."
# rm -rf components styles App.tsx

echo ""
echo "✨ Migration complete!"
echo ""
echo "Next steps:"
echo "1. npm install"
echo "2. npm run dev"
echo ""
echo "Your Vite project should now be ready! 🎉"
