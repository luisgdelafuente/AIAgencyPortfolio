import { Metadata } from 'next';
import { getPageContent } from '../lib/api';

// Generate dynamic metadata for the about page
export async function generateMetadata(): Promise<Metadata> {
  // Get any custom metadata from the page content
  const pageContent = await getPageContent('about');
  
  let metadata = {
    title: 'About | HAL149',
    description: 'Learn about HAL149, our mission, and how we empower businesses with AI solutions',
    keywords: 'ai agency, about hal149, ai solution provider, artificial intelligence company',
  };
  
  if (pageContent) {
    try {
      const content = JSON.parse(pageContent.content);
      if (content.metadata) {
        metadata = {
          ...metadata,
          title: content.metadata.title || metadata.title,
          description: content.metadata.description || metadata.description,
          keywords: content.metadata.keywords || metadata.keywords,
        };
      }
    } catch (error) {
      console.error('Error parsing about page content:', error);
    }
  }
  
  return {
    ...metadata,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      url: 'https://hal149.com/about',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
    },
  };
}

// About page component
export default async function AboutPage() {
  const pageContent = await getPageContent('about');
  
  // Parse any custom content for the page
  let content = {
    title: 'About HAL149',
    subtitle: 'Your partner in AI-powered solutions',
    mission: {
      title: 'Our Mission',
      content: 'HAL149 is dedicated to making AI accessible and useful for businesses of all sizes. We build practical solutions that solve real problems and create tangible value.',
    },
    vision: {
      title: 'Our Vision',
      content: 'We envision a future where businesses harness the power of AI to work smarter, not harder. Our goal is to demystify artificial intelligence and help organizations implement practical solutions that drive meaningful results.',
    },
    team: {
      title: 'Our Team',
      content: 'Our team consists of AI specialists, software engineers, and industry consultants who bring a wealth of experience in developing and implementing AI solutions across various sectors.',
    },
    approach: {
      title: 'Our Approach',
      content: 'We take a human-centered approach to AI. Technology should serve people, not the other way around. We focus on understanding your specific needs and delivering solutions that integrate seamlessly with your existing workflows.',
    }
  };
  
  if (pageContent) {
    try {
      const parsed = JSON.parse(pageContent.content);
      content = {
        ...content,
        title: parsed.title || content.title,
        subtitle: parsed.subtitle || content.subtitle,
        mission: {
          ...content.mission,
          ...parsed.mission,
        },
        vision: {
          ...content.vision,
          ...parsed.vision,
        },
        team: {
          ...content.team,
          ...parsed.team,
        },
        approach: {
          ...content.approach,
          ...parsed.approach,
        },
      };
    } catch (error) {
      console.error('Error parsing about page content:', error);
    }
  }
  
  return (
    <>
      {/* Hero Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            {content.title}
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
      </section>
      
      {/* Mission and Vision */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {content.mission.title}
              </h2>
              <p className="text-gray-600">
                {content.mission.content}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {content.vision.title}
              </h2>
              <p className="text-gray-600">
                {content.vision.content}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team and Approach */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {content.team.title}
              </h2>
              <p className="text-gray-600">
                {content.team.content}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {content.approach.title}
              </h2>
              <p className="text-gray-600">
                {content.approach.content}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to transform your business with AI?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Let's discuss how we can help you implement AI solutions that drive real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 inline-block"
            >
              Contact Us
            </a>
            <a 
              href="/projects" 
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 inline-block"
            >
              View Our Projects
            </a>
          </div>
        </div>
      </section>
    </>
  );
}