import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import type { PageContent } from '@shared/schema';
import { extractMetadata } from '@/lib/metadata';

interface LegalSection {
  title: string;
  content: string;
}

interface LegalContent {
  title?: string;
  sections?: LegalSection[];
  [key: string]: any;
}

export default function Legal() {
  const [content, setContent] = useState<LegalContent>({
    title: "Legal Information",
    sections: []
  });
  
  // Fetch page content including metadata
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/legal']
  });
  
  // Extract metadata with inheritance
  const metadata = extractMetadata(pageContent);
  
  useEffect(() => {
    if (pageContent && pageContent.content) {
      try {
        const parsedContent = typeof pageContent.content === 'string' 
          ? JSON.parse(pageContent.content) 
          : pageContent.content;
        setContent(parsedContent);
      } catch (error) {
        console.error('Error parsing legal content:', error);
      }
    }
  }, [pageContent]);
  
  return (
    <>
      <MetaTags 
        metadata={metadata}
        url="https://hal149.com/legal/" 
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              {isLoading ? (
                <div className="text-4xl font-bold text-gray-900 mb-6">
                  <Skeleton className="h-10 w-48" />
                </div>
              ) : (
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {content.title || "Legal Documents"}
                </h1>
              )}
              {isLoading ? (
                <div className="text-lg text-gray-600">
                  <Skeleton className="h-6 w-full max-w-md" />
                </div>
              ) : (
                <p className="text-lg text-gray-600">
                  Our privacy policy, terms of service, and other legal information
                </p>
              )}
            </div>
            
            <div>
              {isLoading ? (
                <div className="space-y-6">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-64 w-full" />
                </div>
              ) : (
                <Tabs defaultValue="tab-0">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    {content.sections && content.sections.map((section, index) => (
                      <TabsTrigger key={index} value={`tab-${index}`}>
                        {section.title}
                      </TabsTrigger>
                    ))}
                    {(!content.sections || content.sections.length === 0) && (
                      <>
                        <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                        <TabsTrigger value="terms">Terms of Service</TabsTrigger>
                      </>
                    )}
                  </TabsList>
                  
                  {content.sections && content.sections.map((section, index) => (
                    <TabsContent 
                      key={index} 
                      value={`tab-${index}`} 
                      className="border rounded-lg p-6 bg-white"
                    >
                      <div className="prose max-w-none">
                        <h2>{section.title}</h2>
                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                      </div>
                    </TabsContent>
                  ))}
                  
                  {(!content.sections || content.sections.length === 0) && (
                    <>
                      <TabsContent value="privacy" className="border rounded-lg p-6 bg-white">
                        <div className="prose max-w-none">
                          <h2>Privacy Policy</h2>
                          <p>Last updated: April 5, 2024</p>
                          
                          <h3>1. Introduction</h3>
                          <p>HAL149 ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.</p>
                          
                          <h3>2. Information We Collect</h3>
                          <p>We may collect information about you in a variety of ways, including:</p>
                          <ul>
                            <li><strong>Personal Data:</strong> Name, email address, phone number, and other information you provide when contacting us or signing up for our services.</li>
                            <li><strong>Usage Data:</strong> Information about how you use our website and services, including IP address, browser type, pages visited, and time spent.</li>
                            <li><strong>Cookies:</strong> We use cookies and similar tracking technologies to enhance your experience on our website.</li>
                          </ul>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="terms" className="border rounded-lg p-6 bg-white">
                        <div className="prose max-w-none">
                          <h2>Terms of Service</h2>
                          <p>Last updated: April 5, 2024</p>
                          
                          <h3>1. Agreement to Terms</h3>
                          <p>By accessing or using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these Terms, you may not access or use our services.</p>
                          
                          <h3>2. Description of Services</h3>
                          <p>HAL149 provides industry-specific AI applications designed to transform data into insights, automate workflows, and help businesses stay ahead of the competition.</p>
                        </div>
                      </TabsContent>
                    </>
                  )}
                </Tabs>
              )}
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}