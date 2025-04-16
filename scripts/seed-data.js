import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://spebrqnqmrmeacntsrmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNwZWJycW5xbXJtZWFjbnRzcm1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzNjQ4ODYsImV4cCI6MjA1OTk0MDg4Nn0.TIihY4A0vhBQBG4sBJ7Y6yLvQJULVTxLFrDNU2mCjxU';

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedData() {
  console.log('Seeding initial data...');

  try {
    // Insert admin user
    console.log('Creating admin user...');
    const { data: adminData, error: adminError } = await supabase
      .from('users')
      .insert([{ username: 'admin', password: 'admin123' }])
      .select();

    if (adminError) {
      console.error('Error creating admin user:', adminError.message);
    } else {
      console.log('Admin user created or already exists');
    }

    // Seed blog posts
    console.log('\nCreating sample blog posts...');
    const blogPosts = [
      {
        title: "The Future of AI in Enterprise",
        slug: "future-of-ai-in-enterprise",
        excerpt: "Exploring how artificial intelligence is reshaping business operations and strategy.",
        content: "Artificial intelligence is rapidly transforming how businesses operate across all sectors. From automating routine tasks to providing deep insights from data analysis, AI technologies are helping enterprises become more efficient and competitive. This post explores the current state of AI adoption in enterprise settings and looks ahead to future developments that could further revolutionize business operations.",
        image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        published_at: new Date("2024-03-10").toISOString()
      },
      {
        title: "Understanding Neural Networks",
        slug: "understanding-neural-networks",
        excerpt: "A deep dive into the architecture of modern neural networks and their applications.",
        content: "Neural networks form the backbone of many modern AI systems, enabling complex pattern recognition and decision-making capabilities. This post provides an accessible introduction to how neural networks function, explaining key concepts like layers, neurons, activation functions, and training processes. We'll also explore different types of neural networks and their specific applications in various domains.",
        image_url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        published_at: new Date("2024-03-08").toISOString()
      },
      {
        title: "AI Ethics and Responsibility",
        slug: "ai-ethics-and-responsibility",
        excerpt: "Discussing the importance of ethical considerations in AI development and deployment.",
        content: "As AI systems become more powerful and pervasive, ethical considerations surrounding their development and use grow increasingly important. This post examines key ethical issues in AI, including bias in algorithms, privacy concerns, transparency in decision-making, and the broader societal impacts of automation. We also explore frameworks and best practices for responsible AI development that balances innovation with ethical considerations.",
        image_url: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
        published_at: new Date("2024-03-05").toISOString()
      }
    ];
    
    for (const post of blogPosts) {
      const { error } = await supabase
        .from('blog_posts')
        .insert([post]);
      
      if (error && error.code !== '23505') { // Skip if duplicate key error
        console.error(`Error creating blog post ${post.title}:`, error.message);
      } else {
        console.log(`Created blog post: ${post.title}`);
      }
    }
    
    // Seed projects
    console.log('\nCreating sample projects...');
    const projects = [
      {
        title: "AI-Powered Diagnostic Tool",
        slug: "ai-diagnostic-tool",
        description: "Machine learning algorithms to assist in early detection of diseases from medical imagery.",
        content: "Our AI-powered diagnostic tool leverages deep learning algorithms to analyze medical images and assist healthcare professionals in detecting early signs of disease. The system was trained on a diverse dataset of medical scans and can identify patterns that might be missed by the human eye. This technology is particularly valuable for remote healthcare settings where specialist expertise may be limited. The project has been implemented in several major hospitals with promising results in improving early diagnosis rates.",
        category: "Healthcare",
        image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        is_featured: true
      },
      {
        title: "Predictive Financial Analytics",
        slug: "predictive-financial-analytics",
        description: "Advanced algorithms that analyze market trends and predict investment opportunities.",
        content: "Our predictive financial analytics platform combines traditional financial modeling with advanced machine learning techniques to identify market trends and potential investment opportunities. The system analyzes vast amounts of market data, news sentiment, and economic indicators to generate insights that help investors make more informed decisions. It features customizable risk profiles, real-time alerts, and detailed visualization tools that make complex financial data more accessible and actionable for both individual and institutional investors.",
        category: "Finance",
        image_url: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        is_featured: true
      },
      {
        title: "Automated Supply Chain Optimization",
        slug: "supply-chain-optimization",
        description: "AI system that dynamically adjusts supply chain operations based on real-time conditions.",
        content: "Our supply chain optimization solution uses machine learning to create adaptive logistics networks that respond dynamically to changing conditions. The system monitors inventory levels, transportation routes, demand forecasts, and external factors like weather and traffic to continuously optimize the entire supply chain. This results in reduced costs, improved delivery times, and enhanced resilience to disruptions. The solution has been particularly valuable for companies with complex global supply chains seeking to improve efficiency while reducing their environmental impact.",
        category: "Logistics",
        image_url: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        is_featured: false
      }
    ];
    
    for (const project of projects) {
      const { error } = await supabase
        .from('projects')
        .insert([project]);
      
      if (error && error.code !== '23505') { // Skip if duplicate key error
        console.error(`Error creating project ${project.title}:`, error.message);
      } else {
        console.log(`Created project: ${project.title}`);
      }
    }
    
    console.log('\nSeed data process completed.');
    
  } catch (error) {
    console.error('Unexpected error during seeding:', error);
  }
}

seedData();