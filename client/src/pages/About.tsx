import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from "react-helmet";

interface AboutContent {
  title?: string;
  subtitle?: string;
  content?: string;
  [key: string]: any;
}

export default function About() {
  const [content, setContent] = useState<AboutContent>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/page-contents/about');
        if (response.ok) {
          const data = await response.json();
          console.log('About page data:', data);
          
          if (data && data.content) {
            try {
              // Parse the JSON content 
              const parsedContent = JSON.parse(data.content);
              console.log('Parsed content:', parsedContent);
              setContent(parsedContent);
            } catch (parseError) {
              console.error('Error parsing content JSON:', parseError);
              // If it's not JSON, assume it's HTML content
              setContent({
                content: data.content
              });
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
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded mb-6"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-12"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        {content.metadata?.title ? (
          <title>{content.metadata.title}</title>
        ) : (
          <title>About | HAL149</title>
        )}
        {content.metadata?.description ? (
          <meta name="description" content={content.metadata.description} />
        ) : (
          <meta name="description" content="Learn about HAL149, our mission, vision, and the team behind our industry-specific AI applications." />
        )}
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            {content.title && (
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {content.title}
                </h1>
                {content.subtitle && (
                  <p className="text-lg text-gray-600">
                    {content.subtitle}
                  </p>
                )}
              </div>
            )}
            
            <div className="prose prose-gray max-w-none">
              {/* If there's a specific content field that contains HTML, render it */}
              {content.content && (
                <div dangerouslySetInnerHTML={{ __html: content.content }} />
              )}
              
              {/* Render any other JSON fields that might be useful */}
              {content.vision && (
                <div className="mb-10">
                  <p className="text-gray-600 leading-relaxed">
                    {content.vision}
                  </p>
                </div>
              )}
              
              {content.mission && (
                <div className="mb-10">
                  <p className="text-gray-600 leading-relaxed">
                    {content.mission}
                  </p>
                </div>
              )}
              
              {content.history && (
                <div className="mb-10">
                  <p className="text-gray-600 leading-relaxed">
                    {content.history}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}