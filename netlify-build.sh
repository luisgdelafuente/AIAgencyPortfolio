#!/bin/bash

# This script will be called by Netlify during the build process

# Run the main build command
npm run build

# Run the custom script to copy _redirects file
node netlify.js

# Install dependencies for the serverless functions
cd netlify/functions
npm install

echo "Netlify build process completed."