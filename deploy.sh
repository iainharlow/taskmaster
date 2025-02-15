#!/bin/bash

# deploy.sh
# This script installs dependencies, builds the frontend,
# and deploys the app and functions to Firebase.

set -e

echo "Installing dependencies in app/..."
cd app
npm install
cd ..

echo "Installing dependencies in functions/..."
cd functions
npm install
cd ..

echo "Running frontend development server (optional)..."
# Uncomment the next two lines if you want to test locally before building
# cd app
# npm run dev
# (Press Ctrl+C when done testing and then continue)

echo "Building frontend..."
cd app
npm run build
cd ..

echo "Deploying to Firebase (Hosting and Functions)..."
firebase deploy

echo "Deployment complete!"