import { Metadata } from 'next';
import { getPageContent } from '../lib/api';

// Generate dynamic metadata for the contact page
export async function generateMetadata(): Promise<Metadata> {
  // Get any custom metadata from the page content
  const pageContent = await getPageContent('contact');
  
  // Use metadata helper to extract and combine with defaults
  const { extractMetadataFromContent, createMetadata } = await import('../lib/metadata');
  
  // First get any custom metadata from the page content
  const contentMetadata = extractMetadataFromContent(pageContent);
  
  // Then create contact-specific metadata
  return createMetadata('contact', {
    title: contentMetadata.title as string,
    description: contentMetadata.description as string
  });
}

// Contact page component
export default async function ContactPage() {
  const pageContent = await getPageContent('contact');
  
  // Parse any custom content for the page
  let content = {
    title: 'Contact Us',
    subtitle: 'We\'d love to hear from you',
    formTitle: 'Send us a message',
    officeTitle: 'Our Office',
    officeAddress: '123 AI Street, Suite 149',
    officeCity: 'Innovation District',
    officeZip: '94000',
    officeCountry: 'United States',
    contactTitle: 'Contact Information',
    contactEmail: 'info@hal149.com',
    contactPhone: '+1 (555) 123-4567',
    socialTitle: 'Follow Us',
    socialLinks: [
      { name: 'Twitter', url: 'https://twitter.com/hal149ai' },
      { name: 'LinkedIn', url: 'https://linkedin.com/company/hal149' },
      { name: 'GitHub', url: 'https://github.com/hal149' }
    ]
  };
  
  if (pageContent) {
    try {
      const parsed = JSON.parse(pageContent.content);
      content = {
        ...content,
        ...parsed,
      };
    } catch (error) {
      console.error('Error parsing contact page content:', error);
    }
  }
  
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {content.subtitle}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">{content.formTitle}</h2>
            
            <form action="#" method="post" className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                  required
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
          
          {/* Contact Information */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{content.officeTitle}</h3>
                <address className="not-italic text-gray-600">
                  {content.officeAddress}<br />
                  {content.officeCity}, {content.officeZip}<br />
                  {content.officeCountry}
                </address>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{content.contactTitle}</h3>
                <p className="text-gray-600">
                  Email: <a href={`mailto:${content.contactEmail}`} className="text-primary-600 hover:text-primary-700">{content.contactEmail}</a>
                </p>
                <p className="text-gray-600">
                  Phone: <a href={`tel:${content.contactPhone.replace(/\D/g, '')}`} className="text-primary-600 hover:text-primary-700">{content.contactPhone}</a>
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{content.socialTitle}</h3>
                <div className="flex space-x-4">
                  {content.socialLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-500 hover:text-primary-600"
                    >
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}