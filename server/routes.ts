import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { slugify } from "../shared/utils";
import { insertBlogPostSchema, insertProjectSchema, insertWaitlistSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);

  // Auth check endpoint
  app.get("/api/auth/check", (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ authenticated: true, user: req.user });
    } else {
      res.json({ authenticated: false });
    }
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({ message: "Unauthorized" });
  };

  // Blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog posts", error });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blog post", error });
    }
  });

  app.post("/api/blog", isAuthenticated, async (req, res) => {
    try {
      const bodyWithDefaults = {
        ...req.body,
        // Set default publishedAt if not provided
        publishedAt: req.body.publishedAt || new Date()
      };
      
      const postData = insertBlogPostSchema.parse({
        ...bodyWithDefaults,
        slug: slugify(bodyWithDefaults.title)
      });
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", error: fromZodError(error) });
      }
      res.status(500).json({ message: "Failed to create blog post", error });
    }
  });

  app.put("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const postData = insertBlogPostSchema.parse({
        ...req.body,
        slug: req.body.slug || slugify(req.body.title)
      });
      
      const post = await storage.updateBlogPost(id, postData);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", error: fromZodError(error) });
      }
      res.status(500).json({ message: "Failed to update blog post", error });
    }
  });

  app.delete("/api/blog/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteBlogPost(id);
      if (!success) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json({ message: "Blog post deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete blog post", error });
    }
  });

  // Project routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getAllProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects", error });
    }
  });

  app.get("/api/projects/featured", async (req, res) => {
    try {
      const projects = await storage.getFeaturedProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured projects", error });
    }
  });

  app.get("/api/projects/:slug", async (req, res) => {
    try {
      const project = await storage.getProjectBySlug(req.params.slug);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project", error });
    }
  });

  app.post("/api/projects", isAuthenticated, async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        slug: slugify(req.body.title)
      });
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", error: fromZodError(error) });
      }
      res.status(500).json({ message: "Failed to create project", error });
    }
  });

  app.put("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const projectData = insertProjectSchema.parse({
        ...req.body,
        slug: req.body.slug || slugify(req.body.title)
      });
      
      const project = await storage.updateProject(id, projectData);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", error: fromZodError(error) });
      }
      res.status(500).json({ message: "Failed to update project", error });
    }
  });

  app.delete("/api/projects/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete project", error });
    }
  });

  // Waitlist routes
  app.post("/api/waitlist", async (req, res) => {
    try {
      const entryData = insertWaitlistSchema.parse(req.body);
      const entry = await storage.addToWaitlist(entryData);
      res.status(201).json({ message: "Successfully joined the waitlist", entry });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ message: "Validation error", error: fromZodError(error) });
      }
      res.status(500).json({ message: "Failed to join waitlist", error });
    }
  });

  app.get("/api/waitlist", isAuthenticated, async (req, res) => {
    try {
      const entries = await storage.getWaitlistEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch waitlist entries", error });
    }
  });

  // Initialize default admin user if it doesn't exist
  const setupDefaultAdmin = async () => {
    try {
      const adminExists = await storage.getUserByUsername("admin");
      if (!adminExists) {
        await storage.createUser({
          username: "admin",
          password: "admin123"
        });
        console.log("Default admin user created");
        
        // Add initial seed data
        await seedInitialData();
      }
    } catch (error) {
      console.error("Failed to create default admin user:", error);
    }
  };

  // Seed initial data for demonstration
  const seedInitialData = async () => {
    try {
      // Seed blog posts
      const blogPosts = [
        {
          title: "The Future of AI in Enterprise",
          slug: "future-of-ai-in-enterprise",
          excerpt: "Exploring how artificial intelligence is reshaping business operations and strategy.",
          content: "Artificial intelligence is rapidly transforming how businesses operate across all sectors. From automating routine tasks to providing deep insights from data analysis, AI technologies are helping enterprises become more efficient and competitive. This post explores the current state of AI adoption in enterprise settings and looks ahead to future developments that could further revolutionize business operations.",
          imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
          publishedAt: new Date("2024-03-10")
        },
        {
          title: "Understanding Neural Networks",
          slug: "understanding-neural-networks",
          excerpt: "A deep dive into the architecture of modern neural networks and their applications.",
          content: "Neural networks form the backbone of many modern AI systems, enabling complex pattern recognition and decision-making capabilities. This post provides an accessible introduction to how neural networks function, explaining key concepts like layers, neurons, activation functions, and training processes. We'll also explore different types of neural networks and their specific applications in various domains.",
          imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
          publishedAt: new Date("2024-03-08")
        },
        {
          title: "AI Ethics and Responsibility",
          slug: "ai-ethics-and-responsibility",
          excerpt: "Discussing the importance of ethical considerations in AI development and deployment.",
          content: "As AI systems become more powerful and pervasive, ethical considerations surrounding their development and use grow increasingly important. This post examines key ethical issues in AI, including bias in algorithms, privacy concerns, transparency in decision-making, and the broader societal impacts of automation. We also explore frameworks and best practices for responsible AI development that balances innovation with ethical considerations.",
          imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
          publishedAt: new Date("2024-03-05")
        }
      ];
      
      for (const post of blogPosts) {
        await storage.createBlogPost(post);
      }
      
      // Seed projects
      const projects = [
        {
          title: "AI-Powered Diagnostic Tool",
          slug: "ai-diagnostic-tool",
          description: "Machine learning algorithms to assist in early detection of diseases from medical imagery.",
          content: "Our AI-powered diagnostic tool leverages deep learning algorithms to analyze medical images and assist healthcare professionals in detecting early signs of disease. The system was trained on a diverse dataset of medical scans and can identify patterns that might be missed by the human eye. This technology is particularly valuable for remote healthcare settings where specialist expertise may be limited. The project has been implemented in several major hospitals with promising results in improving early diagnosis rates.",
          category: "Healthcare",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          isFeatured: true
        },
        {
          title: "Predictive Financial Analytics",
          slug: "predictive-financial-analytics",
          description: "Advanced algorithms that analyze market trends and predict investment opportunities.",
          content: "Our predictive financial analytics platform combines traditional financial modeling with advanced machine learning techniques to identify market trends and potential investment opportunities. The system analyzes vast amounts of market data, news sentiment, and economic indicators to generate insights that help investors make more informed decisions. It features customizable risk profiles, real-time alerts, and detailed visualization tools that make complex financial data more accessible and actionable for both individual and institutional investors.",
          category: "Finance",
          imageUrl: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          isFeatured: true
        },
        {
          title: "Automated Supply Chain Optimization",
          slug: "supply-chain-optimization",
          description: "AI system that dynamically adjusts supply chain operations based on real-time conditions.",
          content: "Our supply chain optimization solution uses machine learning to create adaptive logistics networks that respond dynamically to changing conditions. The system monitors inventory levels, transportation routes, demand forecasts, and external factors like weather and traffic to continuously optimize the entire supply chain. This results in reduced costs, improved delivery times, and enhanced resilience to disruptions. The solution has been particularly valuable for companies with complex global supply chains seeking to improve efficiency while reducing their environmental impact.",
          category: "Logistics",
          imageUrl: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
          isFeatured: false
        }
      ];
      
      for (const project of projects) {
        await storage.createProject(project);
      }
      
      console.log("Initial data seeded successfully");
    } catch (error) {
      console.error("Failed to seed initial data:", error);
    }
  };

  // Call the setup function
  await setupDefaultAdmin();

  const httpServer = createServer(app);
  return httpServer;
}
