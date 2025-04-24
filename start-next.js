// start-next.js - Script to run Next.js in development mode
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the Next.js server script
const serverPath = join(__dirname, 'server-next.js');

console.log('Starting Next.js server...');
console.log(`Using server script: ${serverPath}`);

// Run the Next.js server
const nextProcess = spawn('tsx', [serverPath], { 
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down Next.js server...');
  nextProcess.kill('SIGINT');
  process.exit(0);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js server exited with code ${code}`);
  process.exit(code);
});