import { Metadata } from 'next';
import { getPageContent } from './lib/api';

// Generate dynamic metadata for the home page
export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent('home');
  
  if (!pageContent) {
    return {}; // Return empty object if no content found
  }
  
  try {
    const content = JSON.parse(pageContent.content);
    
    return {
      title: content.metaTitle || 'HAL149 | AI Agency',
      description: content.metaDescription || 'HAL149 is your partner for AI solutions',
      keywords: content.metaKeywords || 'ai, artificial intelligence, agency',
      openGraph: {
        title: content.ogTitle || content.metaTitle || 'HAL149 | AI Agency',
        description: content.ogDescription || content.metaDescription || 'HAL149 is your partner for AI solutions',
        images: content.ogImage ? [{ url: content.ogImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error parsing home page content:', error);
    return {};
  }
}

// Home page component
export default async function Home() {
  const pageContent = await getPageContent('home');
  
  // This is a placeholder - we'll replace this with actual content from the current homepage
  return (
    <main>
      <h1>HAL149 AI Agency</h1>
      <p>This is the home page</p>
      <pre>{JSON.stringify(pageContent, null, 2)}</pre>
    </main>
  );
}