// This script creates the page_contents table directly in Supabase
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and key from environment variables or hardcode for testing
const supabaseUrl = process.env.SUPABASE_URL || 'https://spebrqnqmrmeacntsrmp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createPageContentsTable() {
  console.log('Creating page_contents table in Supabase...');
  
  try {
    // Create table using SQL directly
    const { error } = await supabase.rpc('execute_sql', { 
      sql: `
      CREATE TABLE IF NOT EXISTS page_contents (
        id SERIAL PRIMARY KEY,
        page TEXT NOT NULL UNIQUE,
        content TEXT NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
      `
    });
    
    if (error) {
      console.error('Error creating table with RPC:', error);
      
      // Alternative approach using Supabase's REST API
      console.log('Trying alternative approach...');
      const { error: restError } = await supabase.from('page_contents').select('count(*)').limit(1);
      
      if (restError && restError.code === '42P01') { // Relation doesn't exist error
        console.log('Confirming that page_contents table does not exist. Please create it manually in the Supabase dashboard.');
        console.log('\nFollow these steps:');
        console.log('1. Log into your Supabase dashboard');
        console.log('2. Go to the SQL Editor');
        console.log('3. Run the following SQL:');
        console.log(`
CREATE TABLE IF NOT EXISTS page_contents (
  id SERIAL PRIMARY KEY,
  page TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Insert initial content for static pages
INSERT INTO page_contents (page, content, updated_at)
VALUES
  ('home', 
   '{"heroTitle":"Leading the AI Revolution","heroSubtitle":"We help enterprises transform through cutting-edge artificial intelligence solutions","heroCta":"Join Our Waitlist","featuresTitle":"Our Capabilities","featuresSubtitle":"Transforming businesses through intelligent technology"}',
   CURRENT_TIMESTAMP),
  ('about', 
   '{"title":"About Us","mission":"Our mission is to democratize artificial intelligence and make its benefits accessible to businesses of all sizes.","vision":"We envision a future where AI enhances human potential rather than replacing it, creating more opportunities for innovation and growth.","history":"Founded in 2020, our team of AI specialists and industry experts has been at the forefront of developing practical applications of machine learning that solve real business problems.","team":[{"name":"Alex Johnson","role":"CEO & Co-founder","bio":"Former ML research lead at Stanford AI Lab with 15+ years of experience in the field."},{"name":"Maria Chen","role":"CTO & Co-founder","bio":"PhD in Computer Science, specializing in deep learning architectures and their applications."},{"name":"David Park","role":"Head of Product","bio":"Experienced product leader who previously scaled AI products at major tech companies."}]}',
   CURRENT_TIMESTAMP),
  ('contact', 
   '{"title":"Get in Touch","subtitle":"We''d love to hear from you and discuss how we can help transform your business","email":"info@aiagency.com","phone":"+1 (555) 123-4567","address":"123 Tech Hub, San Francisco, CA 94105","formTitle":"Send us a message"}',
   CURRENT_TIMESTAMP),
  ('legal', 
   '{"title":"Legal Information","sections":[{"title":"Privacy Policy","content":"We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."},{"title":"Terms of Service","content":"By accessing our website and services, you agree to these terms of service. Please read them carefully. If you do not agree with these terms, you should not use our website or services."},{"title":"Cookie Policy","content":"Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site."}]}',
   CURRENT_TIMESTAMP)
ON CONFLICT (page) DO NOTHING;
        `);
      } else {
        console.error('Unexpected error when checking table existence:', restError);
      }
    } else {
      console.log('Successfully created page_contents table');
      
      // Insert sample data
      await insertSampleData();
    }
  } catch (error) {
    console.error('Unhandled error:', error);
  }
}

async function insertSampleData() {
  try {
    console.log('Inserting sample data...');
    
    // Home page
    await insertPageContent('home', {
      heroTitle: "Leading the AI Revolution",
      heroSubtitle: "We help enterprises transform through cutting-edge artificial intelligence solutions",
      heroCta: "Join Our Waitlist",
      featuresTitle: "Our Capabilities",
      featuresSubtitle: "Transforming businesses through intelligent technology"
    });
    
    // About page
    await insertPageContent('about', {
      title: "About Us",
      mission: "Our mission is to democratize artificial intelligence and make its benefits accessible to businesses of all sizes.",
      vision: "We envision a future where AI enhances human potential rather than replacing it, creating more opportunities for innovation and growth.",
      history: "Founded in 2020, our team of AI specialists and industry experts has been at the forefront of developing practical applications of machine learning that solve real business problems.",
      team: [
        {
          name: "Alex Johnson",
          role: "CEO & Co-founder",
          bio: "Former ML research lead at Stanford AI Lab with 15+ years of experience in the field."
        },
        {
          name: "Maria Chen",
          role: "CTO & Co-founder",
          bio: "PhD in Computer Science, specializing in deep learning architectures and their applications."
        },
        {
          name: "David Park",
          role: "Head of Product",
          bio: "Experienced product leader who previously scaled AI products at major tech companies."
        }
      ]
    });
    
    // Contact page
    await insertPageContent('contact', {
      title: "Get in Touch",
      subtitle: "We'd love to hear from you and discuss how we can help transform your business",
      email: "info@aiagency.com",
      phone: "+1 (555) 123-4567",
      address: "123 Tech Hub, San Francisco, CA 94105",
      formTitle: "Send us a message"
    });
    
    // Legal page
    await insertPageContent('legal', {
      title: "Legal Information",
      sections: [
        {
          title: "Privacy Policy",
          content: "We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."
        },
        {
          title: "Terms of Service",
          content: "By accessing our website and services, you agree to these terms of service. Please read them carefully. If you do not agree with these terms, you should not use our website or services."
        },
        {
          title: "Cookie Policy",
          content: "Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site."
        }
      ]
    });
    
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
  }
}

async function insertPageContent(page, contentObj) {
  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page,
      content: JSON.stringify(contentObj),
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });
  
  if (error) {
    console.error(`Error inserting ${page} content:`, error);
  } else {
    console.log(`Successfully inserted ${page} content`);
  }
}

// Run the script
createPageContentsTable()
  .then(() => console.log('Script completed'))
  .catch(error => console.error('Script failed:', error))
  .finally(() => process.exit());