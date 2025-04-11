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
  publishedAt: timestamp("published_at").notNull(),
});

export const insertBlogPostSchema = createInsertSchema(blogPosts)
  .omit({
    id: true,
  })
  .transform((data) => {
    return {
      ...data,
      // Ensure publishedAt is always a Date object
      publishedAt: data.publishedAt instanceof Date 
        ? data.publishedAt 
        : new Date(data.publishedAt)
    };
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

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;

export type WaitlistEntry = typeof waitlist.$inferSelect;
export type InsertWaitlistEntry = z.infer<typeof insertWaitlistSchema>;
