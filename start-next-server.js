#!/usr/bin/env node

// A helper script to start the Next.js server with TypeScript support
// This uses tsx to run the TypeScript files directly

import { spawn } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set environment variables
process.env.NODE_ENV = 'development';

console.log('Starting the integrated Next.js + Express server with TypeScript support...');

// Use tsx to run the server file
const tsxProcess = spawn('npx', ['tsx', 'server-next.js'], { 
  stdio: 'inherit',
  env: { ...process.env }
});

// Handle process events
tsxProcess.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

tsxProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Received SIGINT. Shutting down server...');
  tsxProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Shutting down server...');
  tsxProcess.kill('SIGTERM');
});