'use client';

import Link from 'next/link';

interface HomeContent {
  // Home page specific fields
  heroTitle?: string;
  heroSubtitle?: string;
  [key: string]: any; // For metadata and other fields
}

export default function Home() {
  // Fetch page content including metadata
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/home'],
  });

  // Extract metadata with inheritance
  const metadata = extractMetadata(pageContent);
  console.log('Home page metadata:', metadata);
  
  // Parse the JSON content
  const content = useMemo<HomeContent>(() => {
    if (!pageContent?.content) return {};
    
    try {
      return typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
    } catch (error) {
      console.error('Error parsing home page content JSON:', error);
      return {};
    }
  }, [pageContent]);

  return (
    <>
      <MetaTags 
        metadata={metadata} 
        url="https://hal149.com/"
      />
      
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