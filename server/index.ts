import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import cors from "cors";
import compression from "compression";
import { staticMetaTags } from "./staticMetaTags";

const app = express();

// Enable compression for all responses
app.use(compression({
  // Compression level (1-9, where 9 is maximum compression but slower)
  level: 6,
  // Minimum size in bytes to apply compression
  threshold: 0,
  // Compress all responses
  filter: () => true
}));

// Redirect Replit domain to custom domain
app.use((req, res, next) => {
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
app.use(cors({
  origin: true, // Allow any origin in development
  credentials: true
}));

// Add additional headers for CORS and security
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// We'll register the SEO middleware later after Vite is set up

app.use((req, res, next) => {
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
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Do not apply SEO middleware again (already applied above)
  
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });
  
  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
