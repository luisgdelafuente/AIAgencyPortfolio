import { Metadata } from 'next';
import { getPageContent } from '../lib/api';

// Generate dynamic metadata for the about page
export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent('about');
  
  if (!pageContent) {
    return {
      title: 'About | HAL149',
      description: 'Learn about HAL149, your AI solutions partner',
    };
  }
  
  try {
    const content = JSON.parse(pageContent.content);
    
    return {
      title: content.metaTitle || 'About | HAL149',
      description: content.metaDescription || 'Learn about HAL149, your AI solutions partner',
      keywords: content.metaKeywords || 'about HAL149, AI agency, team',
      openGraph: {
        title: content.ogTitle || content.metaTitle || 'About | HAL149',
        description: content.ogDescription || content.metaDescription || 'Learn about HAL149, your AI solutions partner',
        images: content.ogImage ? [{ url: content.ogImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error parsing about page content:', error);
    return {
      title: 'About | HAL149',
      description: 'Learn about HAL149, your AI solutions partner',
    };
  }
}

// About page component
export default async function AboutPage() {
  const pageContent = await getPageContent('about');
  
  let content = {
    title: 'About Us',
    content: '<p>Information about HAL149</p>',
  };
  
  if (pageContent) {
    try {
      content = JSON.parse(pageContent.content);
    } catch (error) {
      console.error('Error parsing about page content:', error);
    }
  }
  
  return (
    <main>
      <h1>{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    </main>
  );
}