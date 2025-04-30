import { fetchPageContent, fetchBlogPosts, fetchFeaturedProjects } from '@/lib/api';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ProjectsSection from '@/components/ProjectsSection';
import BlogSection from '@/components/BlogSection';
import Waitlist from '@/components/Waitlist';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HAL149 | Unlocking Your Business Potential with AI',
  description: 'HAL149 is your partner for AI-powered apps, automations, strategic training and transformation programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  openGraph: {
    title: 'HAL149 | Unlocking Your Business Potential with AI',
    description: 'HAL149 is your partner for AI-powered apps, automations, strategic training and transformation programs',
    url: 'https://hal149.com/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAL149 | Unlocking Your Business Potential with AI',
    description: 'HAL149 is your partner for AI-powered apps, automations, strategic training and transformation programs',
  },
  alternates: {
    canonical: 'https://hal149.com/',
  }
};

// Parse content from string to JSON
const parseContent = (content: string | undefined) => {
  if (!content) return {};
  try {
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    return {};
  }
};

export default async function Home() {
  // Fetch data using server components
  const pageContentData = await fetchPageContent('home');
  const featuredProjects = await fetchFeaturedProjects();
  const blogPosts = await fetchBlogPosts();
  
  // Parse the page content
  const pageContent = parseContent(pageContentData?.content);

  return (
    <div className="bg-white">
      {/* Hero section */}
      <Hero content={pageContent} isLoading={!pageContentData} />
      
      {/* Features section */}
      <Features content={pageContent} isLoading={!pageContentData} />
      
      {/* Projects section */}
      <ProjectsSection projects={featuredProjects || []} isLoading={!featuredProjects} />
      
      {/* Blog section */}
      <BlogSection posts={blogPosts || []} isLoading={!blogPosts} />
      
      {/* Waitlist section */}
      <Waitlist />
      
      {/* Informational section about the migration */}
      <section className="py-8 bg-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold mb-4">Next.js Migration in Progress</h2>
            <p className="mb-4">
              We're migrating the HAL149 website to Next.js for improved performance and features.
              Some sections may be under construction while we complete the migration.
            </p>
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-medium mb-2">Migration Status</h3>
              <ul className="list-disc pl-5 space-y-1">
                <li>✓ Next.js setup complete</li>
                <li>✓ App Router structure implemented</li>
                <li>✓ Basic layout and navigation integrated</li>
                <li>✓ Translation system migrated</li>
                <li>✓ Core components migrated</li>
                <li>✓ Data fetching integration</li>
                <li>→ Content page migrations in progress</li>
                <li>→ Admin pages migration in progress</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}