import express from 'express';
import next from 'next';
import cors from 'cors';
import compression from 'compression';
import { createTables } from './server/createTables.js';
import { db } from './server/db.js';

// Initialize Next.js
const port = process.env.PORT || 5000; // Use port 5000 to match previous setup
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

// Database initialization
async function checkSupabaseTables() {
  console.log('Checking if Supabase tables exist...');
  await createTables();
  console.log('Table check completed. Tables need to be created manually in Supabase dashboard if they don\'t exist.');
  console.log(`Table structure:
- users: id, username, password
- blog_posts: id, title, slug, excerpt, content, image_url, published_at
- projects: id, title, slug, description, content, category, image_url, is_featured
- waitlist: id, email, submitted_at
- page_contents: id, page, content, updated_at
- contact_messages: id, name, email, subject, message, submitted_at, read`);
}

// Prepare and start the server
nextApp.prepare().then(async () => {
  const server = express();
  
  // Check database tables
  await checkSupabaseTables();
  
  // Enable compression for all responses
  server.use(compression({
    level: 6,
    threshold: 0,
    filter: () => true
  }));
  
  // Redirect Replit domain to custom domain
  server.use((req, res, next) => {
    const host = req.header('host');
    
    // Check if it's a Replit domain
    if (host && host.includes('replit.app')) {
      // Get the path including query string
      const fullPath = req.url;
      const customDomain = 'hal149.com';
      
      // Redirect to the same path on the custom domain
      return res.redirect(301, `https://${customDomain}${fullPath}`);
    }
    
    next();
  });
  
  // Configure CORS
  server.use(cors({
    origin: true,
    credentials: true
  }));
  
  // Add additional headers for CORS and security
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });
  
  server.use(express.json());
  server.use(express.urlencoded({ extended: false }));
  
  // Logging middleware for API routes
  server.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse;
      
      const originalResJson = res.json;
      res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };
      
      res.on("finish", () => {
        const duration = Date.now() - start;
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        
        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }
        
        console.log(logLine);
      });
    }
    next();
  });
  
  // Import existing API routes
  // We'll migrate these properly in Phase 2
  server.use('/api', (req, res, next) => {
    // For now, this is a placeholder for our API routes
    // Will be replaced with actual route handlers
    next();
  });
  
  // Let Next.js handle everything else
  server.all('*', (req, res) => {
    return handle(req, res);
  });
  
  // Start the server
  server.listen(port, '0.0.0.0', () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});