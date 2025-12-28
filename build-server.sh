#!/bin/bash
set -e

echo "Building X-Ray Server for deployment..."

# Install all dependencies from root
echo "Installing dependencies..."
npm install

# Build SDK first
echo "Building SDK..."
npm run build --workspace=@xray/sdk

# Build server (which depends on SDK)
echo "Building server..."
npm run build --workspace=@xray/server

echo "Build complete!"

