#!/usr/bin/env node
// start.js - Smart startup script that can launch either Next.js or Express
import { spawn } from 'child_process';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { env } from 'process';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine which server to use
const useNextJS = env.USE_NEXTJS === 'true' || env.USE_NEXTJS === '1';

// Set the server script path
const serverScript = useNextJS 
  ? join(__dirname, 'server-next.js')
  : join(__dirname, 'server', 'index.ts');

// Make sure the file exists
if (!existsSync(serverScript)) {
  console.error(`Error: Server script not found at ${serverScript}`);
  process.exit(1);
}

console.log(`Starting server in ${env.NODE_ENV || 'development'} mode`);
console.log(`Using ${useNextJS ? 'Next.js' : 'Express'} server: ${serverScript}`);

// Set runtime depending on file extension
const runtime = serverScript.endsWith('.ts') ? 'tsx' : 'node';

// Run the server
const serverProcess = spawn(runtime, [serverScript], { 
  stdio: 'inherit',
  env: process.env
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down server...');
  serverProcess.kill('SIGINT');
  process.exit(0);
});

serverProcess.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});