import express from "express";
import next from "next";
import cors from "cors";
import compression from "compression";
import { createTables } from "./createTables";
import { log } from "./vite";

// Initialize Next.js
const port = 5000; // Keep the original port
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev, dir: '.' }); // Set the correct directory for Next.js
const handle = nextApp.getRequestHandler();

// Bootstrapping function to start the server
async function bootstrap() {
  try {
    // Prepare Next.js
    await nextApp.prepare();
    const server = express();
    
    // Check database tables
    console.log('Checking if Supabase tables exist...');
    await createTables();
    console.log('Table check completed. Tables need to be created manually in Supabase dashboard if they don\'t exist.');
    
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
        let capturedJsonResponse: Record<string, any> | undefined = undefined;
        
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
          
          log(logLine);
        });
      }
      next();
    });
    
    // Let Next.js handle all requests
    server.all('*', (req, res) => {
      return handle(req, res);
    });
    
    // Start the server on port 5000
    server.listen(port, '0.0.0.0', () => {
      log(`> Ready on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

// Start the server
bootstrap();
