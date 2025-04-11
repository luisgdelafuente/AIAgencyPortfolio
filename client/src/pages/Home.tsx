import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import BlogSection from '@/components/BlogSection';
import ProjectsSection from '@/components/ProjectsSection';
import Waitlist from '@/components/Waitlist';
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>HAL149 - Next-Generation AI Solutions</title>
        <meta name="description" content="Industry-specific AI applications to transform data into insights, automate workflows, and stay ahead of the competition." />
        <meta name="keywords" content="AI, machine learning, data insights, automation" />
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
