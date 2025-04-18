import { Metadata } from 'next';
import { fetchPageContent, fetchBlogPostBySlug, fetchProjectBySlug } from './api';

// Enhanced default metadata with branded HAL149 info
const defaultMetadata: Metadata = {
  title: 'HAL149 | Unlocking Your Business Potential with AI',
  description: 'HAL149 is your partner From AI-powered apps and automations to strategic training and transformation programs',
  keywords: 'ai applications, ai solutions, ai automations, industry ai, ai consulting, ai training programs',
};

// Parse content from string to JSON safely
const parseContent = (content: string | any) => {
  if (!content) return {};
  try {
    return typeof content === 'string' ? JSON.parse(content) : content;
  } catch (error) {
    console.error('Error parsing JSON content:', error);
    return {};
  }
};

/**
 * Get metadata from database for a specific page
 * This function is critical for SEO and directly outputs metadata for Next.js App Router
 */
export async function getPageMetadata(page: string): Promise<Metadata> {
  console.log(`[Metadata] Fetching metadata for page: ${page}`);
  
  // Fetch page content from database with no-cache policy
  const pageContent = await fetchPageContent(page);
  
  if (!pageContent || !pageContent.content) {
    console.warn(`[Metadata] No content found for ${page}, using default metadata`);
    return defaultMetadata;
  }
  
  // Parse the content
  const parsedContent = parseContent(pageContent.content);
  
  // Extract metadata from content
  const metadata = parsedContent.metadata || {};
  console.log(`[Metadata] Extracted metadata for ${page}:`, JSON.stringify(metadata));
  
  // Prepare explicit metadata object with only string values
  // This follows Next.js recommendations for static metadata values
  const result: Metadata = {
    title: metadata.title || defaultMetadata.title,
    description: metadata.description || defaultMetadata.description,
    keywords: metadata.keywords || defaultMetadata.keywords,
    
    // Apply explicit openGraph properties
    openGraph: {
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [{ url: metadata.ogImage }] : undefined,
      url: metadata.canonical || `https://hal149.com/${page === 'home' ? '' : page}`,
      siteName: 'HAL149',
      locale: 'en_US',
      type: 'website',
    },
    
    // Apply explicit Twitter Card properties
    twitter: {
      card: 'summary_large_image',
      title: metadata.ogTitle || metadata.title || defaultMetadata.title,
      description: metadata.ogDescription || metadata.description || defaultMetadata.description,
      images: metadata.ogImage ? [metadata.ogImage] : undefined,
      creator: '@hal149',
    },
  };
  
  // Add canonical URL if available
  if (metadata.canonical) {
    result.alternates = { 
      canonical: metadata.canonical 
    };
  }
  
  // Ensure robots metadata is present for indexing
  result.robots = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    }
  };
  
  console.log(`[Metadata] Final metadata for ${page}:`, JSON.stringify(result));
  return result;
}

/**
 * Generate metadata for a specific blog post using its slug
 */
export async function getBlogPostMetadata(slug: string): Promise<Metadata> {
  console.log(`[Metadata] Fetching metadata for blog post: ${slug}`);
  
  try {
    // First, get the post content
    const post = await fetchBlogPostBySlug(slug);
    
    if (!post) {
      console.warn(`[Metadata] Blog post not found: ${slug}`);
      return {
        ...defaultMetadata,
        title: 'Blog Post Not Found | HAL149',
        description: 'The requested blog post could not be found.',
      };
    }
    
    // Get blog page metadata for defaults
    const blogPageContent = await fetchPageContent('blog');
    const blogPageParsed = parseContent(blogPageContent?.content);
    const blogMetadata = blogPageParsed.metadata || {};

    // Create metadata specific to this post
    const result: Metadata = {
      title: `${post.title} | HAL149`,
      description: post.excerpt || defaultMetadata.description,
      keywords: blogMetadata.keywords || defaultMetadata.keywords,
      
      openGraph: {
        title: `${post.title} | HAL149`,
        description: post.excerpt || defaultMetadata.description,
        type: 'article',
        url: `https://hal149.com/blog/${slug}`,
        images: post.image_url ? [{ url: post.image_url }] : undefined,
        siteName: 'HAL149',
        locale: 'en_US',
        publishedTime: post.published_at,
      },
      
      twitter: {
        card: 'summary_large_image',
        title: `${post.title} | HAL149`,
        description: post.excerpt || defaultMetadata.description,
        images: post.image_url ? [post.image_url] : undefined,
      },
      
      alternates: {
        canonical: `https://hal149.com/blog/${slug}`
      },
    };
    
    console.log(`[Metadata] Generated blog post metadata: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`[Metadata] Error generating blog post metadata: ${error}`);
    return defaultMetadata;
  }
}

/**
 * Generate metadata for a specific project using its slug
 */
export async function getProjectMetadata(slug: string): Promise<Metadata> {
  console.log(`[Metadata] Fetching metadata for project: ${slug}`);
  
  try {
    // First, get the project content
    const project = await fetchProjectBySlug(slug);
    
    if (!project) {
      console.warn(`[Metadata] Project not found: ${slug}`);
      return {
        ...defaultMetadata,
        title: 'Project Not Found | HAL149',
        description: 'The requested project could not be found.',
      };
    }
    
    // Get projects page metadata for defaults
    const projectsPageContent = await fetchPageContent('projects');
    const projectsPageParsed = parseContent(projectsPageContent?.content);
    const projectsMetadata = projectsPageParsed.metadata || {};

    // Create metadata specific to this project
    const result: Metadata = {
      title: `${project.title} | HAL149 Projects`,
      description: project.description || defaultMetadata.description,
      keywords: projectsMetadata.keywords || defaultMetadata.keywords,
      
      openGraph: {
        title: `${project.title} | HAL149 Projects`,
        description: project.description || defaultMetadata.description,
        type: 'article',
        url: `https://hal149.com/projects/${slug}`,
        images: project.image_url ? [{ url: project.image_url }] : undefined,
        siteName: 'HAL149',
        locale: 'en_US',
      },
      
      twitter: {
        card: 'summary_large_image',
        title: `${project.title} | HAL149 Projects`,
        description: project.description || defaultMetadata.description,
        images: project.image_url ? [project.image_url] : undefined,
      },
      
      alternates: {
        canonical: `https://hal149.com/projects/${slug}`
      },
    };
    
    console.log(`[Metadata] Generated project metadata: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`[Metadata] Error generating project metadata: ${error}`);
    return defaultMetadata;
  }
}