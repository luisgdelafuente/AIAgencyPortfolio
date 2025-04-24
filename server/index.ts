
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
