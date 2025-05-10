#!/bin/sh

set -e

echo ">>> Installing Node.js via Homebrew..."
brew install node

echo ">>> Installing Yarn (optional, safer for RN projects)..."
npm install -g yarn

echo ">>> Installing JS dependencies..."
cd /Volumes/workspace/repository  # Go to repo root (above ios/)
yarn install

echo ">>> Installing iOS pods..."
cd ios
pod install

echo "✅ All dependencies installed successfully!"