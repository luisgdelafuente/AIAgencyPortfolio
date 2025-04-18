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
    return defaultMetadata;
  }

  try {
    const content = JSON.parse(pageContent.content);
    
    // If there's no metadata in the content, return default
    if (!content.metadata) {
      return defaultMetadata;
    }
    
    // Extract metadata from content
    const metadata = content.metadata;
    
    // Combine with default metadata, favoring the content's values
    return {
      title: metadata.title || defaultMetadata.title,
      description: metadata.description || defaultMetadata.description,
      keywords: metadata.keywords || defaultMetadata.keywords,
      openGraph: {
        ...defaultMetadata.openGraph,
        title: metadata.ogTitle || metadata.title || defaultMetadata.openGraph?.title,
        description: metadata.ogDescription || metadata.description || defaultMetadata.openGraph?.description,
        images: metadata.ogImage 
          ? [
              {
                url: metadata.ogImage,
                width: 1200,
                height: 630,
                alt: metadata.title || 'HAL149',
              },
            ]
          : defaultMetadata.openGraph?.images,
      },
      twitter: {
        ...defaultMetadata.twitter,
        title: metadata.title || defaultMetadata.twitter?.title,
        description: metadata.description || defaultMetadata.twitter?.description,
        images: metadata.ogImage 
          ? [metadata.ogImage]
          : defaultMetadata.twitter?.images,
      },
      robots: metadata.robots || defaultMetadata.robots,
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
      ...defaultMetadata.openGraph,
      title: pageTitle || undefined,
      description: pageDescription || undefined,
      url: pageUrl || undefined,
      type: (pageType === 'blog' || pageType === 'projects' ? 'article' : 'website') as any,
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
      ...defaultMetadata.twitter,
      title: pageTitle || undefined,
      description: pageDescription || undefined,
      images: data.image 
        ? [data.image]
        : defaultMetadata.twitter?.images,
    },
    alternates: {
      canonical: canonical,
    },
  };
}