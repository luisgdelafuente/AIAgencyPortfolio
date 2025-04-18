import { Metadata } from 'next';
import { getPageContent, getAllBlogPosts, getFeaturedProjects } from './lib/api';
import NextHead from './components/next-head';

// Generate dynamic metadata for the home page
export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent('home');
  
  // Use metadata helper to extract and combine with defaults
  const { extractMetadataFromContent } = await import('./lib/metadata');
  return extractMetadataFromContent(pageContent);
}

// Import types from shared schema
import { Project, BlogPost } from '../shared/schema';

// Define feature interface for TypeScript
interface Feature {
  title: string;
  description: string;
}

// Home page component
export default async function Home() {
  // Fetch all the data in parallel
  const [pageContent, featuredProjects, blogPosts] = await Promise.all([
    getPageContent('home'),
    getFeaturedProjects(),
    getAllBlogPosts()
  ]);
  
  if (!pageContent) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-3xl font-bold">Welcome to HAL149</h1>
        <p className="mt-4">Content is currently unavailable. Please check back later.</p>
      </div>
    );
  }
  
  // Parse content from database
  let content;
  try {
    content = JSON.parse(pageContent.content);
  } catch (error) {
    console.error('Error parsing home page content:', error);
    content = {};
  }
  
  // Extract metadata for the page
  let metadata = content.metadata || {};
  
  return (
    <>
      {/* Add NextHead with dynamic metadata from database */}
      <NextHead
        title={metadata.title || 'HAL149 | Unlocking Your Business Potential with AI'}
        description={metadata.description || 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs'}
        keywords={metadata.keywords || 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs'}
        canonical={metadata.canonical || 'https://hal149.com'}
        ogTitle={metadata.ogTitle}
        ogDescription={metadata.ogDescription}
        ogImage={metadata.ogImage || 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'}
      />
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center px-4 py-1 mb-6 rounded-full bg-gray-100 text-gray-900">
              <span className="text-sm font-medium">Coming Soon!</span>
            </div>
            
            {content.heroTitle && (
              <h1 className="text-4xl sm:text-7xl font-bold text-gray-900 tracking-tight max-w-[85%] mx-auto sm:leading-[1.2]">
                {content.heroTitle.split(' ').length > 2 
                  ? <>
                      {content.heroTitle.split(' ').slice(0, -2).join(' ')} <span className="text-gray-900">{content.heroTitle.split(' ').slice(-2).join(' ')}</span>
                    </>
                  : content.heroTitle
                }
              </h1>
            )}
            
            {content.heroSubtitle && (
              <p className="mt-6 text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
                {content.heroSubtitle}
              </p>
            )}
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/blog" className="px-6 py-3 bg-black text-white rounded-md font-medium inline-flex items-center justify-center">
                {content.blogCta || 'Read Our Blog'}
              </a>
              {content.heroCta && (
                <a href="#waitlist" className="px-6 py-3 rounded-md border border-gray-300 text-gray-700 hover:border-gray-400 inline-flex items-center justify-center">
                  {content.heroCta}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {content.features && content.features.map((feature: Feature, index: number) => (
              <div key={index} className="p-8 bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {index === 0 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    {index === 1 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />}
                    {index === 2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />}
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Projects Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {content.projectsTitle || 'Featured Projects'}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {content.projectsSubtitle || 'What we are working on'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {featuredProjects && featuredProjects.length > 0 ? (
              // Map through actual featured projects
              featuredProjects.map((project) => (
                <div key={project.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  {project.imageUrl ? (
                    <div className="h-64 bg-gray-100 relative overflow-hidden">
                      <img 
                        src={project.imageUrl} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">{project.category}</p>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <a href={`/projects/${project.slug}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">Learn more →</a>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to placeholder project if no data is available
              <div className="col-span-2 text-center py-12">
                <p className="text-gray-500">No featured projects available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center">
            <a href="/projects" className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-900 rounded-lg bg-white inline-block">
              {content.projectsCta || 'View All Projects'}
            </a>
          </div>
        </div>
      </section>
      
      {/* Blog Section */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {content.blogTitle || 'Latest from Our Blog'}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {content.blogSubtitle || 'Stay updated with the latest insights in AI and technology'}
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts && blogPosts.length > 0 ? (
              // Display up to 3 most recent blog posts
              blogPosts.slice(0, 3).map((post) => (
                <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                  {post.imageUrl && (
                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title} 
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <p className="text-sm text-gray-500 mb-2">
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }) : 'Published recently'}
                    </p>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt || post.title}
                    </p>
                    <a href={`/blog/${post.slug}`} className="text-sm font-medium text-primary-600 hover:text-primary-700">Read more →</a>
                  </div>
                </div>
              ))
            ) : (
              // Fallback if no blog posts are available
              <div className="col-span-3 text-center py-12">
                <p className="text-gray-500">No blog posts available at the moment.</p>
              </div>
            )}
          </div>
          
          <div className="mt-10 text-center">
            <a href="/blog" className="px-6 py-3 border border-gray-300 hover:border-gray-400 text-gray-900 rounded-lg bg-white inline-block">
              {content.blogCta || 'View All Posts'}
            </a>
          </div>
        </div>
      </section>
      
      {/* Waitlist Section */}
      <section id="waitlist" className="py-12 md:py-16 bg-white">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Join the Waitlist
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Be the first to experience the future of AI. Sign up for early access.
            </p>
            
            <form action="#" method="post" className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent flex-grow max-w-md"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                  Join Waitlist
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                By signing up, you agree to our <a href="/legal" className="underline hover:text-gray-700">Privacy Policy</a>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}