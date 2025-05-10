#!/bin/sh

set -e

echo ">>> Installing Node.js via Homebrew..."
brew install node

echo ">>> Running pod install..."
pod install

echo "✅ Node.js and CocoaPods setup complete."
