import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import type { BlogPost, PageContent } from '@shared/schema';

interface BlogIndexProps {
  pageContent: PageContent;
  blogPosts: BlogPost[];
  metadata: {
    title: string;
    description: string;
    keywords: string;
    canonical: string;
    ogTitle: string;
    ogDescription: string;
    ogImage: string;
  };
}

export default function BlogIndex({ pageContent, blogPosts, metadata }: BlogIndexProps) {
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // Parse page content
    if (pageContent?.content) {
      try {
        const parsedContent = typeof pageContent.content === 'string' 
          ? JSON.parse(pageContent.content) 
          : pageContent.content;
        setContent(parsedContent);
      } catch (e) {
        console.error('Error parsing page content:', e);
      }
    }
  }, [pageContent]);

  return (
    <>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        
        {/* Open Graph */}
        <meta property="og:title" content={metadata.ogTitle || metadata.title} />
        <meta property="og:description" content={metadata.ogDescription || metadata.description} />
        <meta property="og:image" content={metadata.ogImage} />
        <meta property="og:url" content={metadata.canonical} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.ogTitle || metadata.title} />
        <meta name="twitter:description" content={metadata.ogDescription || metadata.description} />
        <meta name="twitter:image" content={metadata.ogImage} />
        
        {/* Canonical */}
        <link rel="canonical" href={metadata.canonical} />
      </Head>

      <main>
        {/* Header */}
        <header>
          <h1>AI Blog - Next-Generation Insights</h1>
          {content?.header?.description && (
            <p>{content.header.description}</p>
          )}
        </header>

        {/* Blog posts list */}
        <section className="blog-posts">
          {blogPosts && blogPosts.length > 0 ? (
            <div className="blog-grid">
              {blogPosts.map((post) => (
                <article key={post.id} className="blog-card">
                  <Link href={`/blog/${post.slug}`}>
                    {post.image_url && (
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="blog-thumbnail" 
                      />
                    )}
                    <h2>{post.title}</h2>
                  </Link>
                  <p className="post-date">
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="read-more">
                    Read More
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p>No blog posts available at the moment.</p>
          )}
        </section>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    // Fetch the page content and blog posts from your API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    
    const [pageContentRes, blogPostsRes] = await Promise.all([
      fetch(`${apiUrl}/api/page-contents/blog`),
      fetch(`${apiUrl}/api/blog`)
    ]);
    
    const pageContent = await pageContentRes.json();
    const blogPosts = await blogPostsRes.json();
    
    // Default metadata for blog index
    let metadata = {
      title: 'AI Blog - Next-Generation Insights | HAL149',
      description: 'Explore the latest advances in artificial intelligence, machine learning, and data insights from HAL149\'s research team.',
      keywords: 'AI blog, machine learning blog, artificial intelligence insights, HAL149 research',
      canonical: 'https://hal149.com/blog/',
      ogTitle: 'HAL149 AI Blog - Next-Generation Insights',
      ogDescription: 'Cutting-edge insights on AI, machine learning, and automation from industry experts.',
      ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
    };
    
    // Override with page content metadata if available
    if (pageContent?.content) {
      try {
        const parsedContent = typeof pageContent.content === 'string' 
          ? JSON.parse(pageContent.content) 
          : pageContent.content;
          
        if (parsedContent.metadata) {
          metadata = { ...metadata, ...parsedContent.metadata };
        }
      } catch (e) {
        console.error('Error parsing content:', e);
      }
    }

    return {
      props: {
        pageContent,
        blogPosts,
        metadata
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        pageContent: null,
        blogPosts: [],
        metadata: {
          title: 'AI Blog - Next-Generation Insights | HAL149',
          description: 'Explore the latest advances in artificial intelligence, machine learning, and data insights from HAL149\'s research team.',
          keywords: 'AI blog, machine learning blog, artificial intelligence insights, HAL149 research',
          canonical: 'https://hal149.com/blog/',
          ogTitle: 'HAL149 AI Blog - Next-Generation Insights',
          ogDescription: 'Cutting-edge insights on AI, machine learning, and automation from industry experts.',
          ogImage: 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
        }
      }
    };
  }
};