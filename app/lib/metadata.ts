import { Metadata } from 'next';
import { PageContent } from '../../shared/schema';

// Default site metadata
export const defaultMetadata: Metadata = {
  title: 'HAL149 | AI Agency',
  description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hal149.com',
    siteName: 'HAL149',
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    images: [
      {
        url: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp',
        width: 480,
        height: 480,
        alt: 'HAL149 Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HAL149 | AI Agency',
    description: 'HAL149 is your partner for AI-powered apps, automations, and strategic training programs',
    images: [
      'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Function to extract metadata from page content
export function extractMetadataFromContent(pageContent: PageContent | null): Metadata {
  if (!pageContent) {
    console.error('No page content available for metadata extraction');
    return defaultMetadata;
  }

  try {
    const content = JSON.parse(pageContent.content);
    
    // If there's no metadata in the content, return default
    if (!content.metadata) {
      console.warn('No metadata found in page content, using defaults');
      return defaultMetadata;
    }
    
    // Extract metadata from content
    const metadata = content.metadata;
    console.log('Page metadata from database:', metadata);
    
    // For debugging purposes
    console.log(`Metadata URL: ${metadata.canonical || 'https://hal149.com'}`);
    
    // Construct OpenGraph images array
    const ogImages = metadata.ogImage 
      ? [{ url: metadata.ogImage, width: 1200, height: 630, alt: metadata.title || 'HAL149' }]
      : defaultMetadata.openGraph?.images;
    
    // Combine with default metadata, favoring the content's values
    return {
      title: metadata.title || defaultMetadata.title,
      description: metadata.description || defaultMetadata.description,
      keywords: metadata.keywords || defaultMetadata.keywords,
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: metadata.canonical || 'https://hal149.com',
        siteName: 'HAL149',
        title: metadata.ogTitle || metadata.title || defaultMetadata.title,
        description: metadata.ogDescription || metadata.description || defaultMetadata.description,
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title || defaultMetadata.title,
        description: metadata.description || defaultMetadata.description,
        images: metadata.ogImage ? [metadata.ogImage] : defaultMetadata.twitter?.images,
      },
      robots: {
        index: true,
        follow: true,
      },
      alternates: {
        canonical: metadata.canonical || 'https://hal149.com',
      },
    };
  } catch (error) {
    console.error('Error parsing page content:', error);
    return defaultMetadata;
  }
}

// Create metadata for specific page types
export function createMetadata(
  pageType: string, 
  data: { 
    title?: string;
    description?: string;
    image?: string;
    slug?: string;
    canonical?: string;
  } = {}
): Metadata {
  const baseUrl = 'https://hal149.com';
  const pageTitle = data.title ? `${data.title} | HAL149` : defaultMetadata.title;
  const pageDescription = data.description || defaultMetadata.description;
  const pageUrl = data.slug ? `${baseUrl}/${pageType}/${data.slug}` : `${baseUrl}/${pageType}`;
  const canonical = data.canonical || pageUrl;
  
  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: (pageType === 'blog' || pageType === 'projects' ? 'article' : 'website'),
      locale: 'en_US',
      url: pageUrl,
      siteName: 'HAL149',
      title: pageTitle || undefined,
      description: pageDescription || undefined,
      images: data.image 
        ? [
            {
              url: data.image,
              width: 1200,
              height: 630,
              alt: data.title || 'HAL149',
            },
          ]
        : defaultMetadata.openGraph?.images,
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle || undefined,
      description: pageDescription || undefined,
      images: data.image ? [data.image] : defaultMetadata.twitter?.images,
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: canonical,
    },
  };
}