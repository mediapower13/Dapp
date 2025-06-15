#!/bin/bash

echo "🎯 UniVote Quick Start Script"
echo "============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Setup development environment
echo "🔧 Setting up development environment..."
node scripts/setup-dev.js

# Test database connection
echo "🔌 Testing database connection..."
node scripts/test-connection.js

# Seed database
echo "🌱 Seeding database with sample data..."
npm run seed

# Start development server
echo "🚀 Starting development server..."
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:5000"
echo "Press Ctrl+C to stop the server"

npm run dev
