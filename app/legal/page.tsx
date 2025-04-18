import { Metadata } from 'next';
import { getPageContent } from '../lib/api';

// Generate dynamic metadata for the legal page
export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent('legal');
  
  if (!pageContent) {
    return {
      title: 'Legal | HAL149',
      description: 'Legal information, privacy policy, and terms of service for HAL149',
    };
  }
  
  try {
    const content = JSON.parse(pageContent.content);
    
    return {
      title: content.metaTitle || 'Legal | HAL149',
      description: content.metaDescription || 'Legal information, privacy policy, and terms of service for HAL149',
      keywords: content.metaKeywords || 'legal, privacy policy, terms of service, HAL149',
      openGraph: {
        title: content.ogTitle || content.metaTitle || 'Legal | HAL149',
        description: content.ogDescription || content.metaDescription || 'Legal information, privacy policy, and terms of service for HAL149',
        images: content.ogImage ? [{ url: content.ogImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error parsing legal page content:', error);
    return {
      title: 'Legal | HAL149',
      description: 'Legal information, privacy policy, and terms of service for HAL149',
    };
  }
}

// Legal page component
export default async function LegalPage() {
  const pageContent = await getPageContent('legal');
  
  let content = {
    title: 'Legal Information',
    privacyTitle: 'Privacy Policy',
    privacyContent: '<p>Our privacy policy content...</p>',
    termsTitle: 'Terms of Service',
    termsContent: '<p>Our terms of service content...</p>',
  };
  
  if (pageContent) {
    try {
      content = JSON.parse(pageContent.content);
    } catch (error) {
      console.error('Error parsing legal page content:', error);
    }
  }
  
  return (
    <main>
      <h1>{content.title}</h1>
      
      <section>
        <h2>{content.privacyTitle}</h2>
        <div dangerouslySetInnerHTML={{ __html: content.privacyContent }} />
      </section>
      
      <section>
        <h2>{content.termsTitle}</h2>
        <div dangerouslySetInnerHTML={{ __html: content.termsContent }} />
      </section>
    </main>
  );
}