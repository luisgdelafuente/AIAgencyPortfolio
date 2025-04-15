import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";

export default function About() {
  const [content, setContent] = useState<string>('');
  const [pageTitle, setPageTitle] = useState<string>('About | HAL149');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/page-contents/about');
        if (response.ok) {
          const data = await response.json();
          
          // Use the content directly as HTML without parsing as JSON
          if (data.content) {
            setContent(data.content);
            
            // Try to extract page title from first h1 tag if it exists
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data.content;
            const h1 = tempDiv.querySelector('h1');
            if (h1 && h1.textContent) {
              setPageTitle(`${h1.textContent} | HAL149`);
            }
          }
        }
      } catch (error) {
        console.log('Error fetching about content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Learn about HAL149, our mission, vision, and the team behind our industry-specific AI applications." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            {loading ? (
              <p>Loading content...</p>
            ) : (
              <div className="prose prose-gray max-w-none mb-12">
                {/* Render the HTML content directly */}
                <div dangerouslySetInnerHTML={{ __html: content }} />
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}