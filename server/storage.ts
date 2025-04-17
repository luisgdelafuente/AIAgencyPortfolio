import { 
  users, type User, type InsertUser,
  blogPosts, type BlogPost, type InsertBlogPost,
  projects, type Project, type InsertProject,
  waitlist, type WaitlistEntry, type InsertWaitlistEntry,
  pageContents, type PageContent, type InsertPageContent,
  contactMessages, type ContactMessage, type InsertContactMessage
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

  // Page content methods
  getPageContent(page: string): Promise<PageContent | undefined>;
  getAllPageContents(): Promise<PageContent[]>;
  upsertPageContent(page: string, content: string): Promise<PageContent>;

  // Contact message methods
  addContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(): Promise<ContactMessage[]>;
  markMessageAsRead(id: number): Promise<ContactMessage | undefined>;
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
    const newProject: Project = { 
      ...project, 
      id, 
      isFeatured: project.isFeatured === undefined ? false : project.isFeatured 
    };
    this.projects.set(id, newProject);
    return newProject;
  }

  async updateProject(id: number, project: InsertProject): Promise<Project | undefined> {
    if (!this.projects.has(id)) {
      return undefined;
    }

    const updatedProject: Project = { 
      ...project, 
      id, 
      isFeatured: project.isFeatured === undefined ? false : project.isFeatured 
    };
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

  // Page content methods
  private pageContents: Map<string, PageContent> = new Map();

  async getPageContent(page: string): Promise<PageContent | undefined> {
    return Array.from(this.pageContents.values()).find(
      (content) => content.page === page
    );
  }

  async getAllPageContents(): Promise<PageContent[]> {
    return Array.from(this.pageContents.values())
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async upsertPageContent(page: string, content: string): Promise<PageContent> {
    const existingContent = await this.getPageContent(page);

    if (existingContent) {
      // Update existing content
      const updatedContent: PageContent = {
        ...existingContent,
        content,
        updatedAt: new Date()
      };
      this.pageContents.set(existingContent.id.toString(), updatedContent);
      return updatedContent;
    } else {
      // Create new content
      const id = this.pageContents.size + 1;
      const newContent: PageContent = {
        id,
        page,
        content,
        updatedAt: new Date()
      };
      this.pageContents.set(id.toString(), newContent);
      return newContent;
    }
  }

  // Contact message methods
  private contactMessages: Map<number, ContactMessage> = new Map();
  private contactMessageIdCounter: number = 1;

  async addContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const id = this.contactMessageIdCounter++;
    const submittedAt = new Date();
    const read = false;
    const contactMessage: ContactMessage = { ...message, id, submittedAt, read };
    this.contactMessages.set(id, contactMessage);
    return contactMessage;
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return Array.from(this.contactMessages.values())
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  async markMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    const message = this.contactMessages.get(id);
    if (!message) {
      return undefined;
    }

    const updatedMessage: ContactMessage = {
      ...message,
      read: true
    };
    this.contactMessages.set(id, updatedMessage);
    return updatedMessage;
  }
}

import { supabase } from './supabase';
import { createTables } from './createTables';

// Initialize Supabase tables
createTables().catch(err => {
  console.error('Error checking Supabase tables:', err);
});

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !data) return undefined;
    return data as User;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(insertUser)
      .select()
      .single();

    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  // Blog methods
  async getAllBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch blog posts: ${error.message}`);

    // Map snake_case to camelCase
    return data.map(post => ({
      ...post,
      imageUrl: post.image_url,
      publishedAt: post.published_at
    })) as BlogPost[];
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;

    // Map snake_case to camelCase
    return {
      ...data,
      imageUrl: data.image_url,
      publishedAt: data.published_at
    } as BlogPost;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return undefined;

    // Map snake_case to camelCase
    return {
      ...data,
      imageUrl: data.image_url,
      publishedAt: data.published_at
    } as BlogPost;
  }

  async createBlogPost(post: any): Promise<BlogPost> {
    // Handle camelCase to snake_case conversion
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw new Error(`Failed to create blog post: ${error.message}`);

    // Map the response back to camelCase for the application
    return {
      ...data,
      imageUrl: data.image_url,
      publishedAt: data.published_at
    } as BlogPost;
  }

  async updateBlogPost(id: number, post: any): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(post)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;

    // Map the response back to camelCase for the application
    return {
      ...data,
      imageUrl: data.image_url,
      publishedAt: data.published_at
    } as BlogPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) throw new Error(`Failed to fetch projects: ${error.message}`);

    // Map snake_case to camelCase
    return data.map(project => ({
      ...project,
      imageUrl: project.image_url,
      isFeatured: project.is_featured
    })) as Project[];
  }

  async getFeaturedProjects(): Promise<Project[]> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('is_featured', true);

    if (error) throw new Error(`Failed to fetch featured projects: ${error.message}`);

    // Map snake_case to camelCase
    return data.map(project => ({
      ...project,
      imageUrl: project.image_url,
      isFeatured: project.is_featured
    })) as Project[];
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;

    // Map snake_case to camelCase
    return {
      ...data,
      imageUrl: data.image_url,
      isFeatured: data.is_featured
    } as Project;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) return undefined;

    // Map snake_case to camelCase
    return {
      ...data,
      imageUrl: data.image_url,
      isFeatured: data.is_featured
    } as Project;
  }

  async createProject(project: InsertProject): Promise<Project> {
    // Convert camelCase to snake_case for database and ensure isFeatured is set
    const projectData = {
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      category: project.category,
      image_url: project.imageUrl,
      github_url: project.githubUrl,
      demo_url: project.demoUrl,
      is_featured: project.isFeatured === undefined ? false : project.isFeatured
    };

    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (error) throw new Error(`Failed to create project: ${error.message}`);

    // Map snake_case back to camelCase
    return {
      ...data,
      imageUrl: data.image_url,
      githubUrl: data.github_url,
      demoUrl: data.demo_url,
      isFeatured: data.is_featured
    } as Project;
  }

  async updateProject(id: number, project: InsertProject): Promise<Project | undefined> {
    // Convert camelCase to snake_case for database and ensure isFeatured is set
    const projectData = {
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      category: project.category,
      image_url: project.imageUrl,
      github_url: project.githubUrl,
      demo_url: project.demoUrl,
      is_featured: project.isFeatured === undefined ? false : project.isFeatured
    };

    const { data, error } = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;

    // Map snake_case back to camelCase
    return {
      ...data,
      imageUrl: data.image_url,
      githubUrl: data.github_url,
      demoUrl: data.demo_url,
      isFeatured: data.is_featured
    } as Project;
  }

  async deleteProject(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    return !error;
  }

  // Waitlist methods
  async addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    // Check if email already exists
    const { data: existingEntry } = await supabase
      .from('waitlist')
      .select('*')
      .eq('email', entry.email)
      .single();

    if (existingEntry) return existingEntry as WaitlistEntry;

    // Insert new entry
    const { data, error } = await supabase
      .from('waitlist')
      .insert(entry)
      .select()
      .single();

    if (error) throw new Error(`Failed to add to waitlist: ${error.message}`);
    return data as WaitlistEntry;
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch waitlist entries: ${error.message}`);
    return data as WaitlistEntry[];
  }

  // Page content methods
  private inMemoryPageContents: Map<string, PageContent> = new Map();

  async getPageContent(page: string): Promise<PageContent | undefined> {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .eq('page', page)
        .single();

      if (error) {
        console.log(`Error fetching page content from DB: ${error.message}`);
        console.log(`Using in-memory content for ${page}`);
        return this.inMemoryPageContents.get(page);
      }

      // Map snake_case to camelCase
      return {
        ...data,
        updatedAt: data.updated_at
      } as PageContent;
    } catch (error) {
      console.log(`Error in getPageContent: ${error}`);
      return this.inMemoryPageContents.get(page);
    }
  }

  async getAllPageContents(): Promise<PageContent[]> {
    try {
      const { data, error } = await supabase
        .from('page_contents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.log(`Error fetching all page contents: ${error.message}`);
        console.log('Using in-memory page contents');
        return Array.from(this.inMemoryPageContents.values());
      }

      // Map snake_case to camelCase
      return data.map(content => ({
        ...content,
        updatedAt: content.updated_at
      })) as PageContent[];
    } catch (error) {
      console.log(`Error in getAllPageContents: ${error}`);
      return Array.from(this.inMemoryPageContents.values());
    }
  }

  async upsertPageContent(page: string, content: string): Promise<PageContent> {
    try {
      // Check if the page content already exists
      const existingContent = await this.getPageContent(page);

      if (existingContent && !this.inMemoryPageContents.has(page)) {
        // Update existing content in DB
        const contentData = {
          content,
          updated_at: new Date().toISOString()
        };

        const { data, error } = await supabase
          .from('page_contents')
          .update(contentData)
          .eq('id', existingContent.id)
          .select()
          .single();

        if (error || !data) {
          throw new Error(`Failed to update page content: ${error?.message}`);
        }

        // Map snake_case to camelCase
        const updatedContent = {
          ...data,
          updatedAt: data.updated_at
        } as PageContent;

        return updatedContent;
      } else {
        try {
          // Try to create new content in DB
          const contentData = {
            page,
            content,
            updated_at: new Date().toISOString()
          };

          const { data, error } = await supabase
            .from('page_contents')
            .insert(contentData)
            .select()
            .single();

          if (error) {
            throw new Error(`Failed to create page content in DB: ${error.message}`);
          }

          // Map snake_case to camelCase
          const newContent = {
            ...data,
            updatedAt: data.updated_at
          } as PageContent;

          return newContent;
        } catch (error) {
          console.log(`Error creating page content in DB: ${error}`);
          console.log(`Storing page content for "${page}" in memory`);

          // Fallback to in-memory storage
          const id = this.inMemoryPageContents.size + 1;
          const updatedAt = new Date();
          const newContent: PageContent = { id, page, content, updatedAt };

          this.inMemoryPageContents.set(page, newContent);
          return newContent;
        }
      }
    } catch (error) {
      console.log(`Error in upsertPageContent: ${error}`);

      // Fallback to in-memory storage
      const id = this.inMemoryPageContents.size + 1;
      const updatedAt = new Date();
      const newContent: PageContent = { id, page, content, updatedAt };

      this.inMemoryPageContents.set(page, newContent);
      return newContent;
    }
  }

  // Contact message methods
  async addContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    try {
      // Convert camelCase to snake_case for Supabase
      const messageData = {
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        submitted_at: new Date().toISOString(),
        read: false
      };

      const { data, error } = await supabase
        .from('contact_messages')
        .insert(messageData)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to add contact message: ${error.message}`);
      }

      // Map snake_case to camelCase
      return {
        ...data,
        submittedAt: data.submitted_at
      } as ContactMessage;
    } catch (error) {
      console.log(`Error in addContactMessage: ${error}`);

      // Fallback to an in-memory contact message object
      return {
        id: -1, // Use negative ID to indicate it's temporary and not stored in DB
        name: message.name,
        email: message.email,
        subject: message.subject,
        message: message.message,
        submittedAt: new Date(),
        read: false
      };
    }
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        throw new Error(`Failed to fetch contact messages: ${error.message}`);
      }

      // Map snake_case to camelCase
      return data.map(message => ({
        ...message,
        submittedAt: message.submitted_at
      })) as ContactMessage[];
    } catch (error) {
      console.log(`Error in getContactMessages: ${error}`);
      return []; // Return empty array on error
    }
  }

  async markMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Failed to mark message as read: ${error?.message}`);
      }

      // Map snake_case to camelCase
      return {
        ...data,
        submittedAt: data.submitted_at
      } as ContactMessage;
    } catch (error) {
      console.log(`Error in markMessageAsRead: ${error}`);
      return undefined;
    }
  }
}

// Initial implementation using Supabase with fallback to MemStorage
class HybridStorage implements IStorage {
  private supabaseStorage: SupabaseStorage;
  private memStorage: MemStorage;
  private useSupabase: boolean = true;

  constructor() {
    this.supabaseStorage = new SupabaseStorage();
    this.memStorage = new MemStorage();

    // Check if Supabase tables exist and switch to memory storage if not
    this.checkSupabaseTables();
  }

  private async checkSupabaseTables() {
    try {
      // Try to access users table to check if Supabase is configured
      await this.supabaseStorage.getUser(1);
      console.log('✅ Supabase connection successful - using Supabase storage');
    } catch (error) {
      console.log('⚠️ Supabase tables not available - falling back to memory storage');
      console.log('ℹ️ To complete Supabase integration, see instructions in SUPABASE_SETUP.md');
      this.useSupabase = false;
    }
  }

  // Implement all IStorage methods with conditional routing
  async getUser(id: number): Promise<User | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.getUser(id) 
      : this.memStorage.getUser(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.getUserByUsername(username) 
      : this.memStorage.getUserByUsername(username);
  }

  async createUser(user: InsertUser): Promise<User> {
    return this.useSupabase 
      ? this.supabaseStorage.createUser(user) 
      : this.memStorage.createUser(user);
  }

  async getAllBlogPosts(): Promise<BlogPost[]> {
    return this.useSupabase 
      ? this.supabaseStorage.getAllBlogPosts() 
      : this.memStorage.getAllBlogPosts();
  }

  async getBlogPostById(id: number): Promise<BlogPost | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.getBlogPostById(id) 
      : this.memStorage.getBlogPostById(id);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.getBlogPostBySlug(slug) 
      : this.memStorage.getBlogPostBySlug(slug);
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    return this.useSupabase 
      ? this.supabaseStorage.createBlogPost(post) 
      : this.memStorage.createBlogPost(post);
  }

  async updateBlogPost(id: number, post: InsertBlogPost): Promise<BlogPost | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.updateBlogPost(id, post) 
      : this.memStorage.updateBlogPost(id, post);
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.useSupabase 
      ? this.supabaseStorage.deleteBlogPost(id) 
      : this.memStorage.deleteBlogPost(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return this.useSupabase 
      ? this.supabaseStorage.getAllProjects() 
      : this.memStorage.getAllProjects();
  }

  async getFeaturedProjects(): Promise<Project[]> {
    return this.useSupabase 
      ? this.supabaseStorage.getFeaturedProjects() 
      : this.memStorage.getFeaturedProjects();
  }

  async getProjectById(id: number): Promise<Project | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.getProjectById(id) 
      : this.memStorage.getProjectById(id);
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.getProjectBySlug(slug) 
      : this.memStorage.getProjectBySlug(slug);
  }

  async createProject(project: InsertProject): Promise<Project> {
    return this.useSupabase 
      ? this.supabaseStorage.createProject(project) 
      : this.memStorage.createProject(project);
  }

  async updateProject(id: number, project: InsertProject): Promise<Project | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.updateProject(id, project) 
      : this.memStorage.updateProject(id, project);
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.useSupabase 
      ? this.supabaseStorage.deleteProject(id) 
      : this.memStorage.deleteProject(id);
  }

  async addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    return this.useSupabase 
      ? this.supabaseStorage.addToWaitlist(entry) 
      : this.memStorage.addToWaitlist(entry);
  }

  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return this.useSupabase 
      ? this.supabaseStorage.getWaitlistEntries() 
      : this.memStorage.getWaitlistEntries();
  }

  // Page content methods
  async getPageContent(page: string): Promise<PageContent | undefined> {
    return this.useSupabase 
      ? this.supabaseStorage.getPageContent(page) 
      : this.memStorage.getPageContent(page);
  }

  async getAllPageContents(): Promise<PageContent[]> {
    return this.useSupabase 
      ? this.supabaseStorage.getAllPageContents() 
      : this.memStorage.getAllPageContents();
  }

  async upsertPageContent(page: string, content: string): Promise<PageContent> {
    return this.useSupabase 
      ? this.supabaseStorage.upsertPageContent(page, content) 
      : this.memStorage.upsertPageContent(page, content);
  }

  // Contact message methods
  async addContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    return this.useSupabase
      ? this.supabaseStorage.addContactMessage(message)
      : this.memStorage.addContactMessage(message);
  }

  async getContactMessages(): Promise<ContactMessage[]> {
    return this.useSupabase
      ? this.supabaseStorage.getContactMessages()
      : this.memStorage.getContactMessages();
  }

  asyncmarkMessageAsRead(id: number): Promise<ContactMessage | undefined> {
    return this.useSupabase
      ? this.supabaseStorage.markMessageAsRead(id)
      : this.memStorage.markMessageAsRead(id);
  }
}

// Use Supabase storage now that tables are created
export const storage = new SupabaseStorage();