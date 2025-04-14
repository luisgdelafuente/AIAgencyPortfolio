export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url?: string;
  published_at: string;
}

export interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  image_url?: string;
  is_featured: boolean;
}

export interface WaitlistEntry {
  id: number;
  email: string;
  submittedAt: string;
}

export interface PageContent {
  id: number;
  page: string;
  content: string;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
}