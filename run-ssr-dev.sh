#!/bin/bash

# This script runs both the Express backend and Next.js frontend with proper SSR
# It's intended for development use

# Start the Express backend
echo "Starting Express backend..."
NODE_ENV=development tsx server/index.ts &
EXPRESS_PID=$!
echo "Express backend running with PID: $EXPRESS_PID"

# Wait for Express to start
echo "Waiting for Express backend to start..."
sleep 5

# Start Next.js in development mode with proper SSR
echo "Starting Next.js with SSR development mode..."
API_URL=http://localhost:5000 npx next dev &
NEXT_PID=$!
echo "Next.js running with PID: $NEXT_PID"

# Function to handle script termination
function cleanup {
  echo "Stopping servers..."
  kill $EXPRESS_PID
  kill $NEXT_PID
  exit
}

# Set up trap for script termination
trap cleanup SIGINT SIGTERM

# Keep the script running
echo "Both servers are running with SSR enabled. Press Ctrl+C to stop."
wait