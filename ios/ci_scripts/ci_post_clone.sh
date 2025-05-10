#!/bin/sh

set -e  # Exit on first error

echo ">>> Installing CocoaPods..."
sudo gem install cocoapods

echo ">>> Running pod install..."
pod install

echo "✅ Pods installed successfully."
