import { fetchPageContent } from '../lib/api';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | HAL149',
  description: 'Learn about our mission and vision at HAL149, your partner in AI solutions and digital transformation.',
  keywords: 'about HAL149, AI company, AI consultancy, AI solutions team',
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

export default async function About() {
  // Fetch data using server components
  const pageContentData = await fetchPageContent('about');
  
  // Parse the page content
  const pageContent = parseContent(pageContentData?.content);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              {pageContent.title || "About HAL149"}
            </h1>
            <p className="text-xl text-gray-300">
              {pageContent.subtitle || "Your partner for AI-powered solutions"}
            </p>
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg mx-auto">
              <p className="mb-4">
                HAL149 is a cutting-edge AI agency focused on delivering exceptional AI-powered solutions 
                to clients across various industries. Our team of experienced AI engineers, data scientists, 
                and business strategists work collaboratively to unlock the full potential of artificial 
                intelligence for your business.
              </p>
              <p className="mb-4">
                From custom AI applications and workflow automations to strategic training programs, 
                HAL149 helps businesses harness the transformative power of AI technology to achieve 
                competitive advantages in their markets.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Approach Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Approach</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <ul className="list-disc pl-5 space-y-3">
                <li>Human-centered AI development that puts people first</li>
                <li>Transparent and explainable AI systems</li>
                <li>Ethical considerations at every stage</li>
                <li>Continuous learning and adaptation</li>
                <li>Measurable business outcomes</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team and Mission */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-4">Our Team</h3>
              <p className="text-gray-700">
                Our multidisciplinary team brings together expertise in machine learning, 
                natural language processing, computer vision, and business transformation.
                We combine technical excellence with deep industry knowledge to create solutions
                that address real business challenges.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700">
                To democratize AI technology and make it accessible, understandable, 
                and valuable for businesses of all sizes. We believe that artificial intelligence
                can transform industries and create new opportunities when implemented thoughtfully
                and responsibly.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Innovation</h3>
              <p className="text-gray-700">
                We constantly push the boundaries of what's possible with AI, seeking new solutions to complex problems.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Responsibility</h3>
              <p className="text-gray-700">
                We develop AI with ethical considerations at the forefront, ensuring our solutions benefit society.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-3">Accessibility</h3>
              <p className="text-gray-700">
                We believe powerful AI should be accessible to all businesses, not just tech giants with massive resources.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}