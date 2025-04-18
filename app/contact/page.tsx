import { fetchPageContent } from '../lib/api';
import { Metadata } from 'next';
import { getPageMetadata } from '../lib/metadataUtils';
import ContactForm from './ContactForm';
import { marked } from 'marked';

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata('contact');
}

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

export default async function Contact() {
  // Fetch data using server components
  const pageContentData = await fetchPageContent('contact');
  
  // Parse the page content
  const pageContent = parseContent(pageContentData?.content);

  // Default contact information
  const defaultContactInfo = `
## Email
info@hal149.com

## Phone
+1 (555) 123-4567

## Address
123 AI Innovation Center  
Tech District  
San Francisco, CA 94103
  `;

  // Default office hours
  const defaultOfficeHours = `
Monday - Friday: 9:00 AM - 6:00 PM  
Saturday: By appointment  
Sunday: Closed
  `;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold sm:text-5xl mb-4">
              {pageContent.contactTitle || 'Contact Us'}
            </h1>
            <p className="text-xl text-gray-300">
              {pageContent.contactSubtitle || 'Have questions or want to work with us? Get in touch!'}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <ContactForm />
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: marked.parse(pageContent.contactInfo || defaultContactInfo)
                    }}
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Office Hours</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: marked.parse(pageContent.officeHours || defaultOfficeHours)
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section - Placeholder */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Visit Our Office</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're located in the heart of San Francisco's tech district
            </p>
          </div>
          
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Interactive map will be implemented here</p>
          </div>
        </div>
      </section>
    </div>
  );
}