#!/bin/bash

# Start the Express server in the background
echo "Starting Express API server..."
NODE_ENV=development tsx server/index.ts &
EXPRESS_PID=$!
echo "Express server running with PID: $EXPRESS_PID"

# Wait for Express to start
echo "Waiting for Express server to start..."
sleep 5

# Start the Next.js custom server
echo "Starting Next.js custom server..."
NODE_ENV=development API_URL=http://localhost:5000 node server-next.js &
NEXT_PID=$!
echo "Next.js server running with PID: $NEXT_PID"

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
echo "Both servers are running. Press Ctrl+C to stop."
wait