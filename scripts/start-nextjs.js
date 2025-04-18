import { spawn } from 'child_process';
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

// Initialize Next.js app
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// Start Express API server
function startApiServer() {
  console.log('Starting Express API server...');
  const apiServer = spawn('node', ['--loader=tsx', 'server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: '5000' }
  });
  
  apiServer.on('close', (code) => {
    console.log(`API server process exited with code ${code}`);
    process.exit(code);
  });
  
  return apiServer;
}

// Start Next.js
async function startNextJs() {
  try {
    // Prepare Next.js
    await app.prepare();
    
    // Create HTTP server for Next.js
    const server = createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    });
    
    // Start listening on port 3000 (different from Express API)
    server.listen(3000, () => {
      console.log('> Next.js ready on http://localhost:3000');
    });
    
    return server;
  } catch (err) {
    console.error('Error starting Next.js server:', err);
    process.exit(1);
  }
}

// Start both servers
console.log('Starting HAL149 with Next.js frontend and Express API...');
const apiServer = startApiServer();
startNextJs();

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down servers...');
  process.exit(0);
});