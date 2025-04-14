import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import BlogSection from '@/components/BlogSection';
import ProjectsSection from '@/components/ProjectsSection';
import Waitlist from '@/components/Waitlist';
import { Helmet } from "react-helmet";
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  // Fetch page content including metadata
  const { data: pageContent } = useQuery({
    queryKey: ['/api/page-contents/home'],
  });

  // Extract metadata from pageContent if available
  let metadata = {
    title: 'HAL149 - Next-Generation AI Solutions',
    description: 'Industry-specific AI applications to transform data into insights, automate workflows, and stay ahead of the competition.',
    keywords: 'AI, machine learning, data insights, automation',
    canonical: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: ''
  };
  
  try {
    if (pageContent && pageContent.content) {
      const content = typeof pageContent.content === 'string' 
        ? JSON.parse(pageContent.content) 
        : pageContent.content;
      
      if (content.metadata) {
        metadata = {
          ...metadata,
          ...content.metadata
        };
      }
    }
  } catch (e) {
    console.error('Error parsing page content metadata:', e);
  }

  return (
    <>
      <Helmet>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords} />
        {metadata.canonical && <link rel="canonical" href={metadata.canonical} />}
        
        {/* Open Graph / Social Media Meta Tags */}
        {metadata.ogTitle && <meta property="og:title" content={metadata.ogTitle} />}
        {metadata.ogDescription && <meta property="og:description" content={metadata.ogDescription} />}
        {metadata.ogImage && <meta property="og:image" content={metadata.ogImage} />}
        <meta property="og:type" content="website" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <Hero />
          <Features />
          <ProjectsSection />
          <BlogSection />
          <Waitlist />
        </main>
        
        <Footer />
      </div>
    </>
  );
}
