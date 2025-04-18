import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import type { BlogPost } from '@shared/schema';

interface BlogPostPageProps {
  blogPost: BlogPost;
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

export default function BlogPostPage({ blogPost, metadata }: BlogPostPageProps) {
  const router = useRouter();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (blogPost?.content) {
      setContent(blogPost.content);
    }
  }, [blogPost]);

  // Show a loading state when fallback is true and the post is not yet generated
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

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
        <meta property="og:type" content="article" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={metadata.ogTitle || metadata.title} />
        <meta name="twitter:description" content={metadata.ogDescription || metadata.description} />
        <meta name="twitter:image" content={metadata.ogImage} />
        
        {/* Canonical */}
        <link rel="canonical" href={metadata.canonical} />
      </Head>

      <main>
        {blogPost ? (
          <article>
            <h1>{blogPost.title}</h1>
            <div className="published-date">
              {new Date(blogPost.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            {blogPost.image_url && (
              <img 
                src={blogPost.image_url} 
                alt={blogPost.title} 
                className="featured-image" 
              />
            )}
            <div 
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </article>
        ) : (
          <div>Blog post not found</div>
        )}
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const slug = params?.slug;
    if (!slug) {
      return { notFound: true };
    }

    // Fetch blog post details from API
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const blogPostRes = await fetch(`${apiUrl}/api/blog/${slug}`);
    
    if (!blogPostRes.ok) {
      return { notFound: true };
    }
    
    const blogPost: BlogPost = await blogPostRes.json();
    
    // Create metadata specifically for this blog post
    const metadata = {
      title: `${blogPost.title} | HAL149`,
      description: blogPost.excerpt || '',
      keywords: 'ai blog, artificial intelligence, machine learning, HAL149',
      canonical: `https://hal149.com/blog/${blogPost.slug}`,
      ogTitle: `${blogPost.title} | HAL149`,
      ogDescription: blogPost.excerpt || '',
      ogImage: blogPost.image_url || 'https://spebrqnqmrmeacntsrmp.supabase.co/storage/v1/object/public/assets//hallogoblack480.webp'
    };

    return {
      props: {
        blogPost,
        metadata
      }
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return { notFound: true };
  }
};