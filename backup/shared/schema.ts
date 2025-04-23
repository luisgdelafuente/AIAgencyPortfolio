import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema for admin access
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Blog post schema
export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url").notNull(),
  publishedAt: text("published_at").notNull(), // Change to text to avoid Date issues
});

export const insertBlogPostSchema = createInsertSchema(blogPosts)
  .omit({
    id: true,
  });

// Project schema
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  githubUrl: text("github_url"),
  demoUrl: text("demo_url"),
  isFeatured: boolean("is_featured").default(false),
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
});

// Waitlist schema
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  email: true,
});

// Page content schema for static pages
export const pageContents = pgTable("page_contents", {
  id: serial("id").primaryKey(),
  page: text("page").notNull().unique(), // home, about, legal, contact
  content: text("content").notNull(), // JSON stringified content
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export const insertPageContentSchema = createInsertSchema(pageContents).omit({
  id: true,
  updatedAt: true
});

// Contact form submissions
export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  read: boolean("read").default(false),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  submittedAt: true,
  read: true
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;

export type PageContent = typeof pageContents.$inferSelect;
export type InsertPageContent = z.infer<typeof insertPageContentSchema>;

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
