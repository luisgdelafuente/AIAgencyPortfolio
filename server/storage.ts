import { 
  users, type User, type InsertUser,
  blogPosts, type BlogPost, type InsertBlogPost,
  projects, type Project, type InsertProject,
  waitlist, type WaitlistEntry, type InsertWaitlistEntry
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Blog methods
  getAllBlogPosts(): Promise<BlogPost[]>;
  getBlogPostById(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  // Project methods
  getAllProjects(): Promise<Project[]>;
  getFeaturedProjects(): Promise<Project[]>;
  getProjectById(id: number): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: InsertProject): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
  
  // Waitlist methods
  addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private blogs: Map<number, BlogPost>;
  private projects: Map<number, Project>;
  private waitlistEntries: Map<number, WaitlistEntry>;
  private userIdCounter: number;
  private blogIdCounter: number;
  private projectIdCounter: number;
  private waitlistIdCounter: number;

  constructor() {
    this.users = new Map();
    this.blogs = new Map();
    this.projects = new Map();
    this.waitlistEntries = new Map();
    this.userIdCounter = 1;
    this.blogIdCounter = 1;
    this.projectIdCounter = 1;
    this.waitlistIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogs.values())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.blogs.get(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return Array.from(this.blogs.values()).find(
      (post) => post.slug === slug
    );
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogIdCounter++;
    const blogPost: BlogPost = { ...post, id };
    this.blogs.set(id, blogPost);
    return blogPost;
  }

  async updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost | undefined> {
    if (!this.blogs.has(id)) {
      return undefined;
    }
    
    const updatedPost: BlogPost = { ...post, id };
    this.blogs.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    if (!this.blogs.has(id)) {
      return false;
    }
    
    return this.blogs.delete(id);
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.isFeatured
    );
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    return Array.from(this.projects.values()).find(
      (project) => project.slug === slug
    );
  }

  async createProject(project: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const newProject: Project = { ...project, id };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: InsertProject): Promise<Project | undefined> {
    if (!this.projects.has(id)) {
      return undefined;
    }
    
    const updatedProject: Project = { ...project, id };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    if (!this.projects.has(id)) {
      return false;
    }
    
    return this.projects.delete(id);
  }

  // Waitlist methods
  async addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    // Check if email already exists
    const existingEntry = Array.from(this.waitlistEntries.values()).find(
      (e) => e.email === entry.email
    );
    
    if (existingEntry) {
      return existingEntry; // Return existing entry if email already on waitlist
    }
    
    const id = this.waitlistIdCounter++;
    const submittedAt = new Date();
    const waitlistEntry: WaitlistEntry = { ...entry, id, submittedAt };
    this.waitlistEntries.set(id, waitlistEntry);
    return waitlistEntry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlistEntries.values())
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }
}

export const storage = new MemStorage();
