import { Metadata } from 'next';
import { getPageContent } from '../lib/api';

// Generate dynamic metadata for the contact page
export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent('contact');
  
  if (!pageContent) {
    return {
      title: 'Contact | HAL149',
      description: 'Get in touch with HAL149',
    };
  }
  
  try {
    const content = JSON.parse(pageContent.content);
    
    return {
      title: content.metaTitle || 'Contact | HAL149',
      description: content.metaDescription || 'Get in touch with HAL149',
      keywords: content.metaKeywords || 'contact HAL149, reach out, get in touch',
      openGraph: {
        title: content.ogTitle || content.metaTitle || 'Contact | HAL149',
        description: content.ogDescription || content.metaDescription || 'Get in touch with HAL149',
        images: content.ogImage ? [{ url: content.ogImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error parsing contact page content:', error);
    return {
      title: 'Contact | HAL149',
      description: 'Get in touch with HAL149',
    };
  }
}

// Contact page component
export default async function ContactPage() {
  const pageContent = await getPageContent('contact');
  
  let content = {
    title: 'Contact Us',
    subtitle: 'Get in touch with our team',
    email: 'contact@hal149.com',
    phone: '+1 (555) 123-4567',
    address: '123 AI Street, Tech City, TC 12345',
  };
  
  if (pageContent) {
    try {
      content = JSON.parse(pageContent.content);
    } catch (error) {
      console.error('Error parsing contact page content:', error);
    }
  }
  
  return (
    <main>
      <h1>{content.title}</h1>
      <p>{content.subtitle}</p>
      
      <div>
        <p>Email: {content.email}</p>
        <p>Phone: {content.phone}</p>
        <p>Address: {content.address}</p>
      </div>
      
      {/* Contact form will be added here */}
      <div>
        <h2>Send us a message</h2>
        <p>Contact form placeholder</p>
      </div>
    </main>
  );
}