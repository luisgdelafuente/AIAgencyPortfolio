// switch-to-next.js - A script to switch the workflow to use Next.js
import { execSync } from 'child_process';
import { writeFileSync, renameSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('Switching Replit to use Next.js...');

try {
  // Create a temporary backup of server/index.ts
  if (existsSync('./server/index.ts')) {
    console.log('Creating backup of server/index.ts...');
    renameSync('./server/index.ts', './server/index.ts.bak');
  }

  // Create a simple script that will redirect to our Next.js server
  console.log('Creating redirection script...');
  const redirectScript = `
// This is an automatic redirector to the Next.js server
import { execSync } from 'child_process';
import { join } from 'path';

console.log('Redirecting to Next.js server...');
try {
  // Make sure the script is executable
  execSync('chmod +x ./start-next.sh', { stdio: 'inherit' });
  
  // Run the Next.js server using our start script
  execSync('bash ./start-next.sh', { stdio: 'inherit' });
} catch (error) {
  console.error('Failed to start Next.js server:', error);
  process.exit(1);
}
`;

  writeFileSync('./server/index.ts', redirectScript, 'utf8');
  console.log('Successfully switched to Next.js!');
  console.log('To revert back, delete server/index.ts and rename server/index.ts.bak to server/index.ts');
} catch (error) {
  console.error('Error switching to Next.js:', error);
  process.exit(1);
}