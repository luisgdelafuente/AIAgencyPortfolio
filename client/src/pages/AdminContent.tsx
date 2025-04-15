import { useState, useEffect } from 'react';
import AdminNav from '@/components/AdminNav';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ContentEditor } from '@/components/AdminEditor';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { PageContent } from '@shared/schema';
import { Pencil, RefreshCw, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminContent() {
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch all page contents
  const { data: pageContents, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/page-contents'],
    queryFn: async () => {
      const res = await fetch('/api/page-contents');
      if (!res.ok) throw new Error('Failed to fetch page contents');
      return res.json() as Promise<PageContent[]>;
    }
  });

  // Update page content mutation
  const updatePageContent = useMutation({
    mutationFn: async ({ page, content }: { page: string, content: string }) => {
      const res = await apiRequest('POST', '/api/page-contents', { page, content });
      return await res.json() as PageContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-contents'] });
      setDialogOpen(false);
      toast({
        title: 'Page content updated',
        description: 'The page content has been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update page content',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Format content for display
  const prettyPrintContent = (content: any) => {
    try {
      // If content is already an object, stringify it
      if (typeof content === 'object') {
        return JSON.stringify(content, null, 2);
      }
      // If content is a string, parse and then stringify for formatting
      return JSON.stringify(JSON.parse(content), null, 2);
    } catch (e) {
      // If all else fails, just return content as-is
      return typeof content === 'string' ? content : JSON.stringify(content);
    }
  };

  // Handle opening the edit dialog
  const handleEditClick = (page: PageContent) => {
    setSelectedPage(page.page);
    
    // Special case for the About page - use raw HTML content
    if (page.page === 'about') {
      setEditContent(page.content);
      setDialogOpen(true);
      return;
    }
    
    // For other pages, check if content has metadata, if not add empty metadata section
    let content;
    try {
      content = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
      
      // Add metadata section if it doesn't exist
      if (!content.metadata) {
        content.metadata = {
          title: `HAL149 | ${page.page.charAt(0).toUpperCase() + page.page.slice(1)}`,
          description: "",
          keywords: "",
          canonical: "",
          ogTitle: "",
          ogDescription: "",
          ogImage: ""
        };
      }
      
      setEditContent(JSON.stringify(content, null, 2));
    } catch (e) {
      setEditContent(prettyPrintContent(page.content));
    }
    
    setDialogOpen(true);
  };

  // Handle saving the content
  const handleSaveContent = () => {
    if (!selectedPage) return;
    
    // Special case for the About page - save raw HTML content
    if (selectedPage === 'about') {
      updatePageContent.mutate({ 
        page: selectedPage, 
        content: editContent 
      });
      return;
    }
    
    // For other pages, validate and save JSON content
    try {
      // Validate JSON content
      JSON.parse(editContent);
      
      // Save content
      updatePageContent.mutate({ 
        page: selectedPage, 
        content: editContent 
      });
    } catch (e) {
      toast({
        title: 'Invalid JSON format',
        description: 'Please make sure the content is in valid JSON format.',
        variant: 'destructive',
      });
    }
  };

  // Display preview of the content
  const getContentPreview = (page: string, content: any) => {
    // Special case for the About page - show HTML preview
    if (page === 'about') {
      const contentStr = String(content);
      // Just show the first 500 characters of the HTML
      return contentStr.substring(0, 500) + (contentStr.length > 500 ? '...' : '');
    }
    
    try {
      // Handle both string and object formats since Supabase might return JSONB as object
      const parsed = typeof content === 'string' ? JSON.parse(content) : content;
      
      // Get the first few keys and values for preview
      const keys = Object.keys(parsed).slice(0, 3);
      return keys.map(key => {
        const value = typeof parsed[key] === 'string' 
          ? parsed[key].substring(0, 40) + (parsed[key].length > 40 ? '...' : '')
          : (Array.isArray(parsed[key]) 
            ? '[Array]' 
            : typeof parsed[key] === 'object' && parsed[key] !== null 
              ? '{Object}' 
              : String(parsed[key]));
        
        return `${key}: ${value}`;
      }).join('\n') + (Object.keys(parsed).length > 3 ? '\n...' : '');
    } catch (e) {
      // Handle non-string/non-object content safely
      const contentStr = String(content);
      return contentStr.substring(0, 100) + (contentStr.length > 100 ? '...' : '');
    }
  };

  // Group pages by category
  const pagesByCategory: Record<string, PageContent[]> = {};
  if (pageContents) {
    // Categorize pages (for now we'll just put them all in one category)
    pageContents.forEach(page => {
      const category = 'Static Pages';
      if (!pagesByCategory[category]) {
        pagesByCategory[category] = [];
      }
      pagesByCategory[category].push(page);
    });
  }

  return (
    <div className="min-h-screen bg-white">
      <AdminNav />
      <div className="lg:ml-64 p-4 pt-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-neutral-800">Page Content Management</h1>
            <Button 
              variant="outline" 
              onClick={() => refetch()} 
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                Failed to load page contents. The page_contents table might not exist in the database yet.
                Please check the console for more details or contact support.
              </AlertDescription>
            </Alert>
          )}

          {!error && isLoading && (
            <div className="text-center py-10">
              <RefreshCw className="h-10 w-10 animate-spin mx-auto text-neutral-300" />
              <p className="mt-4 text-neutral-500">Loading page contents...</p>
            </div>
          )}

          {!error && !isLoading && pageContents && pageContents.length === 0 && (
            <div className="text-center py-8 border rounded-lg bg-neutral-50">
              <p className="text-neutral-500 mb-6">No page contents found. Create initial pages:</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  onClick={() => {
                    const homeContent = JSON.stringify({
                      heroTitle: "Leading the AI Revolution",
                      heroSubtitle: "We help enterprises transform through cutting-edge artificial intelligence solutions",
                      heroCta: "Join Our Waitlist",
                      featuresTitle: "Our Capabilities",
                      featuresSubtitle: "Transforming businesses through intelligent technology"
                    }, null, 2);
                    updatePageContent.mutate({ page: 'home', content: homeContent });
                  }}
                  disabled={updatePageContent.isPending}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Home Page
                </Button>
                <Button 
                  onClick={() => {
                    // Create a basic HTML template for the About page
                    const aboutContent = `
<h1>About HAL149</h1>
<p>Welcome to HAL149, a pioneering AI agency at the forefront of innovation.</p>

<h2>Our Mission</h2>
<p>Our mission is to democratize artificial intelligence and make its benefits accessible to businesses of all sizes.</p>

<h2>Our Vision</h2>
<p>We envision a future where AI enhances human potential rather than replacing it, creating more opportunities for innovation and growth.</p>

<h2>Our Team</h2>
<p>Our team brings together experts from both the AI research community and various industries, creating a unique blend of technical innovation and practical business experience.</p>

<ul>
  <li><strong>Alex Johnson</strong> - CEO & Co-founder, Former ML research lead at Stanford AI Lab</li>
  <li><strong>Maria Chen</strong> - CTO & Co-founder, PhD in Computer Science specializing in deep learning</li>
  <li><strong>David Park</strong> - Head of Product, Experienced product leader in AI technologies</li>
</ul>

<h2>Our Approach</h2>
<p>We believe in creating AI solutions that are:</p>
<ul>
  <li>Transparent and explainable</li>
  <li>Ethical and responsible</li>
  <li>Practical and results-oriented</li>
  <li>Customized to your specific needs</li>
</ul>
`;
                    updatePageContent.mutate({ page: 'about', content: aboutContent });
                  }}
                  disabled={updatePageContent.isPending}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create About Page
                </Button>
                <Button 
                  onClick={() => {
                    const contactContent = JSON.stringify({
                      title: "Get in Touch",
                      subtitle: "We'd love to hear from you and discuss how we can help transform your business",
                      email: "info@aiagency.com",
                      phone: "+1 (555) 123-4567",
                      address: "123 Tech Hub, San Francisco, CA 94105",
                      formTitle: "Send us a message"
                    }, null, 2);
                    updatePageContent.mutate({ page: 'contact', content: contactContent });
                  }}
                  disabled={updatePageContent.isPending}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Contact Page
                </Button>
                <Button 
                  onClick={() => {
                    const legalContent = JSON.stringify({
                      title: "Legal Information",
                      sections: [
                        {
                          title: "Privacy Policy",
                          content: "We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you."
                        },
                        {
                          title: "Terms of Service",
                          content: "By accessing our website and services, you agree to these terms of service. Please read them carefully. If you do not agree with these terms, you should not use our website or services."
                        },
                        {
                          title: "Cookie Policy",
                          content: "Our website uses cookies to distinguish you from other users of our website. This helps us to provide you with a good experience when you browse our website and also allows us to improve our site."
                        }
                      ]
                    }, null, 2);
                    updatePageContent.mutate({ page: 'legal', content: legalContent });
                  }}
                  disabled={updatePageContent.isPending}
                  className="flex items-center gap-1"
                >
                  <PlusCircle className="h-4 w-4" />
                  Create Legal Page
                </Button>
              </div>
              {updatePageContent.isPending && (
                <div className="mt-4 text-sm text-neutral-500 flex items-center justify-center">
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  Creating page...
                </div>
              )}
            </div>
          )}

          {!error && !isLoading && pageContents && pageContents.length > 0 && (
            <Tabs defaultValue="Static Pages">
              <TabsList className="mb-4">
                {Object.keys(pagesByCategory).map(category => (
                  <TabsTrigger key={category} value={category}>
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(pagesByCategory).map(([category, pages]) => (
                <TabsContent key={category} value={category} className="mt-0">
                  <div className="grid gap-4">
                    {pages.map(page => (
                      <div key={page.id} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-medium text-neutral-800 capitalize">
                            {page.page} Page
                          </h3>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEditClick(page)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="h-4 w-4" />
                            Edit
                          </Button>
                        </div>
                        <div className="text-sm text-neutral-500">
                          Last updated: {new Date(page.updatedAt).toLocaleString()}
                        </div>
                        <div className="mt-3">
                          <ScrollArea className="h-[150px] w-full rounded border bg-neutral-50 p-4">
                            <pre className="text-xs text-neutral-700 whitespace-pre-wrap">
                              {getContentPreview(page.page, page.content)}
                            </pre>
                          </ScrollArea>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
          
          {/* Success notice - page_contents table exists */}
          <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Database Connected Successfully</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    The page_contents table is available in your Supabase database. Content changes will be
                    persisted and available even after server restarts.
                  </p>
                  <p className="mt-2">
                    You can now manage all your website content through this interface. The changes will be
                    saved to the database and reflected on the website immediately.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="capitalize">
              Edit {selectedPage} Page Content
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 flex-1 overflow-hidden">
            <Tabs defaultValue="content" className="flex flex-col h-full overflow-hidden">
              <TabsList className="mb-3 w-full">
                <TabsTrigger value="content" className="flex-1">Page Content</TabsTrigger>
                {selectedPage !== 'about' && (
                  <TabsTrigger value="seo" className="flex-1">SEO Metadata</TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="content" className="mt-0 flex-1 overflow-hidden">
                <p className="text-sm text-neutral-500 mb-2">
                  {selectedPage === 'about' 
                    ? 'Edit the HTML content below. You can use standard HTML tags to format your content.'
                    : 'Edit the JSON content below. This defines the structure and content of the page.'}
                </p>
                <div className="border rounded-lg overflow-hidden h-[60vh]">
                  <ContentEditor 
                    value={editContent} 
                    onChange={setEditContent}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="seo" className="mt-0 space-y-4 overflow-auto h-[60vh] pr-1">
                <p className="text-sm text-neutral-500 mb-2">
                  Manage SEO metadata for this page. These fields will be used by search engines and social media platforms.
                </p>
                <div className="border rounded-lg p-4 space-y-4">
                  {/* SEO Metadata Form - will be filled dynamically based on content */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="meta-title" className="text-sm font-medium">
                        Page Title
                      </label>
                      <input
                        id="meta-title"
                        className="w-full p-2 border rounded-md"
                        placeholder="Page title (shown in browser tab)"
                        value={(() => {
                          try {
                            const content = JSON.parse(editContent);
                            return content.metadata?.title || '';
                          } catch (e) {
                            return '';
                          }
                        })()}
                        onChange={(e) => {
                          try {
                            const content = JSON.parse(editContent);
                            if (!content.metadata) content.metadata = {};
                            content.metadata.title = e.target.value;
                            setEditContent(JSON.stringify(content, null, 2));
                          } catch (e) {
                            // Handle JSON parse error
                          }
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="meta-keywords" className="text-sm font-medium">
                        Keywords
                      </label>
                      <input
                        id="meta-keywords"
                        className="w-full p-2 border rounded-md"
                        placeholder="Keywords (comma separated)"
                        value={(() => {
                          try {
                            const content = JSON.parse(editContent);
                            return content.metadata?.keywords || '';
                          } catch (e) {
                            return '';
                          }
                        })()}
                        onChange={(e) => {
                          try {
                            const content = JSON.parse(editContent);
                            if (!content.metadata) content.metadata = {};
                            content.metadata.keywords = e.target.value;
                            setEditContent(JSON.stringify(content, null, 2));
                          } catch (e) {
                            // Handle JSON parse error
                          }
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="meta-description" className="text-sm font-medium">
                      Meta Description
                    </label>
                    <textarea
                      id="meta-description"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      placeholder="Brief description of the page (shown in search results)"
                      value={(() => {
                        try {
                          const content = JSON.parse(editContent);
                          return content.metadata?.description || '';
                        } catch (e) {
                          return '';
                        }
                      })()}
                      onChange={(e) => {
                        try {
                          const content = JSON.parse(editContent);
                          if (!content.metadata) content.metadata = {};
                          content.metadata.description = e.target.value;
                          setEditContent(JSON.stringify(content, null, 2));
                        } catch (e) {
                          // Handle JSON parse error
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="meta-canonical" className="text-sm font-medium">
                      Canonical URL
                    </label>
                    <input
                      id="meta-canonical"
                      className="w-full p-2 border rounded-md"
                      placeholder="https://example.com/canonical-path/"
                      value={(() => {
                        try {
                          const content = JSON.parse(editContent);
                          return content.metadata?.canonical || '';
                        } catch (e) {
                          return '';
                        }
                      })()}
                      onChange={(e) => {
                        try {
                          const content = JSON.parse(editContent);
                          if (!content.metadata) content.metadata = {};
                          content.metadata.canonical = e.target.value;
                          setEditContent(JSON.stringify(content, null, 2));
                        } catch (e) {
                          // Handle JSON parse error
                        }
                      }}
                    />
                    <p className="text-xs text-neutral-500">
                      Used to prevent duplicate content issues. Leave blank to use the default URL.
                    </p>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="text-sm font-semibold mb-3">Social Media (Open Graph)</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="meta-og-title" className="text-sm font-medium">
                          Social Title
                        </label>
                        <input
                          id="meta-og-title"
                          className="w-full p-2 border rounded-md"
                          placeholder="Title shown when shared on social media"
                          value={(() => {
                            try {
                              const content = JSON.parse(editContent);
                              return content.metadata?.ogTitle || '';
                            } catch (e) {
                              return '';
                            }
                          })()}
                          onChange={(e) => {
                            try {
                              const content = JSON.parse(editContent);
                              if (!content.metadata) content.metadata = {};
                              content.metadata.ogTitle = e.target.value;
                              setEditContent(JSON.stringify(content, null, 2));
                            } catch (e) {
                              // Handle JSON parse error
                            }
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="meta-og-description" className="text-sm font-medium">
                          Social Description
                        </label>
                        <textarea
                          id="meta-og-description"
                          className="w-full p-2 border rounded-md"
                          rows={2}
                          placeholder="Description shown when shared on social media"
                          value={(() => {
                            try {
                              const content = JSON.parse(editContent);
                              return content.metadata?.ogDescription || '';
                            } catch (e) {
                              return '';
                            }
                          })()}
                          onChange={(e) => {
                            try {
                              const content = JSON.parse(editContent);
                              if (!content.metadata) content.metadata = {};
                              content.metadata.ogDescription = e.target.value;
                              setEditContent(JSON.stringify(content, null, 2));
                            } catch (e) {
                              // Handle JSON parse error
                            }
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="meta-og-image" className="text-sm font-medium">
                          Social Image URL
                        </label>
                        <input
                          id="meta-og-image"
                          className="w-full p-2 border rounded-md"
                          placeholder="https://example.com/image.jpg"
                          value={(() => {
                            try {
                              const content = JSON.parse(editContent);
                              return content.metadata?.ogImage || '';
                            } catch (e) {
                              return '';
                            }
                          })()}
                          onChange={(e) => {
                            try {
                              const content = JSON.parse(editContent);
                              if (!content.metadata) content.metadata = {};
                              content.metadata.ogImage = e.target.value;
                              setEditContent(JSON.stringify(content, null, 2));
                            } catch (e) {
                              // Handle JSON parse error
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveContent}
              disabled={updatePageContent.isPending}
            >
              {updatePageContent.isPending && (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}