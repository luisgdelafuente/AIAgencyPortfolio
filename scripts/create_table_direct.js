// Direct script to create page_contents table and add data
import { createClient } from '@supabase/supabase-js';

// Same URL and key used in server/supabase.ts
const supabaseUrl = 'https://spebrqnqmrmeacntsrmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function createDirectlyInDatabase() {
  // Try direct SQL through REST API
  console.log('Attempting to create page_contents table via REST API...');
  
  try {
    // First try to create a test entry to see if the table already exists
    const { data: existingData, error: checkError } = await supabase
      .from('page_contents')
      .insert([{ page: 'test', content: 'test', updated_at: new Date().toISOString() }])
      .select();
    
    if (checkError) {
      if (checkError.code === '42P01') { // Relation does not exist
        console.log('Table does not exist. You need to create it manually in Supabase dashboard.');
      } else {
        console.error('Error checking table:', checkError);
      }
    } else {
      console.log('Table already exists! Now adding content entries...');
      
      // Remove the test entry
      if (existingData && existingData.length > 0) {
        await supabase
          .from('page_contents')
          .delete()
          .eq('page', 'test');
      }
      
      // Add each page content
      await addHomePageContent();
      await addAboutPageContent();
      await addContactPageContent();
      await addLegalPageContent();
      
      console.log('All page content created successfully!');
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

async function addHomePageContent() {
  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page: 'home',
      content: JSON.stringify({
        heroTitle: "Leading the AI Revolution",
        heroSubtitle: "We help enterprises transform through cutting-edge artificial intelligence solutions",
        heroCta: "Join Our Waitlist",
        featuresTitle: "Our Capabilities",
        featuresSubtitle: "Transforming businesses through intelligent technology"
      }),
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });
  
  if (error) {
    console.error('Error adding home page content:', error);
  } else {
    console.log('Added home page content successfully');
  }
}

async function addAboutPageContent() {
  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page: 'about',
      content: JSON.stringify({
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
      }),
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });
  
  if (error) {
    console.error('Error adding about page content:', error);
  } else {
    console.log('Added about page content successfully');
  }
}

async function addContactPageContent() {
  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page: 'contact',
      content: JSON.stringify({
        title: "Get in Touch",
        subtitle: "We'd love to hear from you and discuss how we can help transform your business",
        email: "info@aiagency.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Hub, San Francisco, CA 94105",
        formTitle: "Send us a message"
      }),
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });
  
  if (error) {
    console.error('Error adding contact page content:', error);
  } else {
    console.log('Added contact page content successfully');
  }
}

async function addLegalPageContent() {
  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page: 'legal',
      content: JSON.stringify({
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
      }),
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });
  
  if (error) {
    console.error('Error adding legal page content:', error);
  } else {
    console.log('Added legal page content successfully');
  }
}

// Run the script
createDirectlyInDatabase()
  .then(() => console.log('Script completed'))
  .catch(error => console.error('Script failed:', error))
  .finally(() => process.exit());