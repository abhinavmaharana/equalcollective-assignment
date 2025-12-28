#!/bin/bash
set -e

# Build SDK first (if not already built)
echo "Building SDK..."
cd ../xray-sdk
npm install
npm run build
cd ../xray-server

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Build server
echo "Building server..."
npm run build

echo "Build complete!"

