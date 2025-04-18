import { Metadata } from 'next';
import { getAllBlogPosts, getPageContent } from '../lib/api';

// Generate dynamic metadata for the blog page
export async function generateMetadata(): Promise<Metadata> {
  const pageContent = await getPageContent('blog');
  
  if (!pageContent) {
    return {
      title: 'Blog | HAL149',
      description: 'Read the latest articles from HAL149',
    };
  }
  
  try {
    const content = JSON.parse(pageContent.content);
    
    return {
      title: content.metaTitle || 'Blog | HAL149',
      description: content.metaDescription || 'Read the latest articles from HAL149',
      keywords: content.metaKeywords || 'ai blog, artificial intelligence, HAL149',
      openGraph: {
        title: content.ogTitle || content.metaTitle || 'Blog | HAL149',
        description: content.ogDescription || content.metaDescription || 'Read the latest articles from HAL149',
        images: content.ogImage ? [{ url: content.ogImage }] : [],
      },
    };
  } catch (error) {
    console.error('Error parsing blog page content:', error);
    return {
      title: 'Blog | HAL149',
      description: 'Read the latest articles from HAL149',
    };
  }
}

// Blog page component
export default async function BlogPage() {
  const blogPosts = await getAllBlogPosts();
  const pageContent = await getPageContent('blog');
  
  let content = {
    title: 'Blog',
    subtitle: 'Our latest thoughts and insights',
  };
  
  if (pageContent) {
    try {
      content = JSON.parse(pageContent.content);
    } catch (error) {
      console.error('Error parsing blog page content:', error);
    }
  }
  
  return (
    <main>
      <h1>{content.title}</h1>
      <p>{content.subtitle}</p>
      
      <div>
        {blogPosts.length > 0 ? (
          <ul>
            {blogPosts.map((post) => (
              <li key={post.id}>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
                <p>{post.excerpt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No blog posts found.</p>
        )}
      </div>
    </main>
  );
}