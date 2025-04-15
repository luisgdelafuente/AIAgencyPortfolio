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
  const [content, setContent] = useState<AboutContent>({
    title: "",
    subtitle: "",
    content: ""
  });
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/page-contents/about');
        if (response.ok) {
          const data = await response.json();
          const parsedContent = JSON.parse(data.content);
          setContent(parsedContent);
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
        <title>About | HAL149</title>
        <meta name="description" content="Learn about HAL149, our mission, vision, and the team behind our industry-specific AI applications." />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                {content.title}
              </h1>
              <p className="text-lg text-gray-600">
                {content.subtitle}
              </p>
            </div>
            
            <div>
              <div 
                className="prose prose-gray max-w-none"
                dangerouslySetInnerHTML={{ __html: content.content || "" }}
              />
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}