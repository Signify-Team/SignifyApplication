#!/bin/sh

# Fail on any command error
set -e

# Go to iOS directory
cd ios

# Install CocoaPods
brew install cocoapods

# Install Pods (this generates xcconfig and xcfilelist files)
pod install
