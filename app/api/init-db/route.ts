import { NextResponse } from 'next/server';
import { db } from '../../../server/db';
import * as schema from '../../../shared/schema'; 
import { drizzle } from 'drizzle-orm/neon-serverless';
import { migrate } from 'drizzle-orm/neon-serverless/migrator';

export async function GET() {
  try {
    // Push the schema to the database
    console.log('Pushing schema to database...');
    
    // Create tables if they don't exist
    const query = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        excerpt TEXT,
        content TEXT,
        image_url TEXT,
        published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        description TEXT,
        content TEXT,
        category TEXT,
        image_url TEXT,
        is_featured BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS waitlist (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS page_contents (
        id SERIAL PRIMARY KEY,
        page TEXT NOT NULL UNIQUE,
        content TEXT,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS contact_messages (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        read BOOLEAN DEFAULT false
      );
    `;
    
    // Execute the SQL query to create tables
    await db.execute(query);
    
    // Insert initial demo content for page_contents if it doesn't exist
    const homePageContent = await db.execute(`
      INSERT INTO page_contents (page, content)
      VALUES ('home', '{"hero":{"title":"Next-Generation AI Solutions","subtitle":"Expert AI solutions for businesses seeking innovation and transformation","cta":"Explore Solutions"},"features":{"title":"Our Services","subtitle":"Cutting-edge AI solutions for your business","items":[{"title":"Predictive Analytics","description":"Forecast trends and make data-driven decisions with our advanced predictive modeling."},{"title":"Natural Language Processing","description":"Understand and analyze text with our sophisticated NLP algorithms."},{"title":"Custom AI Development","description":"Tailored AI solutions designed specifically for your business needs."},{"title":"AI Consulting","description":"Expert guidance on implementing AI strategies in your organization."}]}}')
      ON CONFLICT (page) DO NOTHING;
      
      INSERT INTO page_contents (page, content)
      VALUES ('about', '{"title":"About HAL149","subtitle":"AI Innovation Partner","content":"HAL149 is a pioneering AI solutions provider dedicated to transforming businesses through cutting-edge artificial intelligence technologies. Our team of experts combines deep technical knowledge with industry expertise to deliver solutions that drive real business value.","team":[{"name":"Alex Chen","role":"Founder & CEO","bio":"Former AI researcher with 15+ years of industry experience."},{"name":"Dr. Sarah Johnson","role":"Chief AI Scientist","bio":"PhD in Machine Learning with multiple published papers."},{"name":"Michael Rodriguez","role":"Head of Engineering","bio":"Led development at multiple tech unicorns."},{"name":"Lisa Wong","role":"Client Success Director","bio":"Specializes in AI implementation strategies for enterprises."}]}')
      ON CONFLICT (page) DO NOTHING;
      
      INSERT INTO page_contents (page, content)
      VALUES ('contact', '{"title":"Contact Us","subtitle":"Get in touch with our team","address":"123 AI Boulevard, San Francisco, CA 94103","email":"info@hal149.ai","phone":"+1 (555) 123-4567"}')
      ON CONFLICT (page) DO NOTHING;
      
      INSERT INTO page_contents (page, content)
      VALUES ('legal', '{"privacy":{"title":"Privacy Policy","content":"This privacy policy outlines how HAL149 collects and processes your personal data..."},"terms":{"title":"Terms of Service","content":"By using the HAL149 website and services, you agree to the following terms and conditions..."}}')
      ON CONFLICT (page) DO NOTHING;
    `);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}