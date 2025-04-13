// This is a build script for Netlify deployment

const fs = require('fs');
const path = require('path');

// Make sure the _redirects file gets copied to the public directory
try {
  const redirectsPath = path.join(__dirname, '_redirects');
  const redirectsDistPath = path.join(__dirname, 'dist', 'public', '_redirects');
  
  if (fs.existsSync(redirectsPath)) {
    // Make sure the directory exists
    const distDir = path.join(__dirname, 'dist', 'public');
    if (!fs.existsSync(distDir)) {
      fs.mkdirSync(distDir, { recursive: true });
    }
    
    // Copy the file
    fs.copyFileSync(redirectsPath, redirectsDistPath);
    console.log('Successfully copied _redirects file to dist/public');
  } else {
    console.error('_redirects file not found');
  }
} catch (error) {
  console.error('Error copying _redirects file:', error);
}

console.log('Netlify build script completed');