// Script to update page contents in the database with the web content
import { createClient } from '@supabase/supabase-js';

// Supabase credentials - same ones used in the application
const supabaseUrl = 'https://spebrqnqmrmeacntsrmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function updatePageContents() {
  console.log('Updating page contents with web content...');

  // Update home page content
  await updateHomePageContent();
  
  // Update about page content
  await updateAboutPageContent();
  
  // Update contact page content
  await updateContactPageContent();
  
  // Update legal page content
  await updateLegalPageContent();
  
  console.log('All page contents updated successfully!');
}

async function updateHomePageContent() {
  // Comprehensive home page content that includes all the sections from the website
  const homeContent = {
    // Hero section
    heroTitle: "Industry-Specific AI Applications",
    heroSubtitle: "Transform data into insights, automate workflows, and stay ahead of the competition.",
    heroCta: "Join Waitlist",
    
    // Features section
    featuresTitle: "Why Choose Our Agency",
    featuresSubtitle: "We offer cutting-edge AI solutions tailored to your industry needs",
    
    // Features list (from Features.tsx)
    features: [
      {
        title: "Smart AI Models",
        description: "State-of-the-art machine learning models tailored for your specific needs."
      },
      {
        title: "Instant Inference",
        description: "Lightning-fast processing with optimized inference pipelines."
      },
      {
        title: "Data-Driven Insights",
        description: "Transform raw data into actionable business intelligence."
      }
    ],
    
    // Projects section
    projectsTitle: "Featured Projects", 
    projectsSubtitle: "See how our AI solutions are transforming industries",
    projectsCta: "View All Projects",
    
    // Blog section
    blogTitle: "Latest from Our Blog",
    blogSubtitle: "Stay updated with the latest insights in AI and technology",
    blogCta: "View All Posts"
  };

  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page: 'home',
      content: homeContent,
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });

  if (error) {
    console.error('Error updating home page content:', error);
  } else {
    console.log('Updated home page content successfully');
  }
}

async function updateAboutPageContent() {
  const aboutContent = {
    title: "About Our Agency",
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
  };

  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page: 'about',
      content: aboutContent,
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });

  if (error) {
    console.error('Error updating about page content:', error);
  } else {
    console.log('Updated about page content successfully');
  }
}

async function updateContactPageContent() {
  const contactContent = {
    title: "Get in Touch",
    subtitle: "We'd love to hear from you and discuss how we can help transform your business",
    email: "info@aiagency.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Hub, San Francisco, CA 94105",
    formTitle: "Send us a message"
  };

  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page: 'contact',
      content: contactContent,
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });

  if (error) {
    console.error('Error updating contact page content:', error);
  } else {
    console.log('Updated contact page content successfully');
  }
}

async function updateLegalPageContent() {
  const legalContent = {
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
  };

  const { error } = await supabase
    .from('page_contents')
    .upsert({
      page: 'legal',
      content: legalContent,
      updated_at: new Date().toISOString()
    }, { onConflict: 'page' });

  if (error) {
    console.error('Error updating legal page content:', error);
  } else {
    console.log('Updated legal page content successfully');
  }
}

// Run the script
updatePageContents()
  .then(() => console.log('Script completed'))
  .catch(error => console.error('Script failed:', error))
  .finally(() => process.exit());