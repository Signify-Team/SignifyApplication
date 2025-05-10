#!/bin/sh

set -e  # Exit on first error

echo ">>> Running pod install (using pre-installed CocoaPods)..."
pod install

echo "✅ Pods installed successfully."
