import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Save } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { FormField } from '@/components/AdminEditor';
import type { PageContent } from '@shared/schema';
import { defaultMetadata } from '@/lib/metadata';

export default function AdminSettings() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('site');
  
  // Site-wide defaults form data
  const [siteDefaults, setSiteDefaults] = useState({
    title: defaultMetadata.title,
    description: defaultMetadata.description,
    keywords: defaultMetadata.keywords,
    ogImage: '',
    ogTitle: '',
    ogDescription: ''
  });
  
  // Blog page content form data
  const [blogPageData, setBlogPageData] = useState({
    pageTitle: 'Blog',
    pageDescription: 'Our latest articles and insights',
    metadata: {
      title: '',
      description: '',
      keywords: '',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: ''
    }
  });
  
  // Projects page content form data
  const [projectsPageData, setProjectsPageData] = useState({
    pageTitle: 'Projects',
    pageDescription: 'Our latest projects and case studies',
    metadata: {
      title: '',
      description: '',
      keywords: '',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: ''
    }
  });
  
  // Fetch home page content
  const { data: homePageContent, isLoading: isLoadingHome } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/home'],
    enabled: !!user
  });
  
  // Fetch blog page content
  const { data: blogPageContent, isLoading: isLoadingBlog } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/blog'],
    enabled: !!user
  });
  
  // Fetch projects page content
  const { data: projectsPageContent, isLoading: isLoadingProjects } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/projects'],
    enabled: !!user
  });
  
  // Mutation for updating page content
  const updatePageContentMutation = useMutation({
    mutationFn: async ({ page, content }: { page: string, content: string }) => {
      const res = await apiRequest("POST", "/api/page-contents", { page, content });
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`/api/page-contents/${variables.page}`] });
      queryClient.invalidateQueries({ queryKey: ['/api/page-contents'] });
      toast({
        title: "Settings updated",
        description: `The ${variables.page} page settings have been updated successfully`
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update settings",
        variant: "destructive"
      });
    }
  });
  
  // Load default values for blog and projects if they exist in the database
  // We're not creating them automatically anymore to avoid duplication issues
  useEffect(() => {
    // Removed auto-creation logic to resolve duplicate key constraint violation
    if (blogPageContent && !blogPageData.metadata.title) {
      try {
        const content = JSON.parse(blogPageContent.content);
        if (content.metadata) {
          setBlogPageData(prev => ({
            ...prev,
            metadata: { ...prev.metadata, ...content.metadata }
          }));
        }
      } catch (e) {
        console.error('Error parsing blog page content:', e);
      }
    }
    
    if (projectsPageContent && !projectsPageData.metadata.title) {
      try {
        const content = JSON.parse(projectsPageContent.content);
        if (content.metadata) {
          setProjectsPageData(prev => ({
            ...prev,
            metadata: { ...prev.metadata, ...content.metadata }
          }));
        }
      } catch (e) {
        console.error('Error parsing projects page content:', e);
      }
    }
  }, [blogPageContent, projectsPageContent, blogPageData.metadata.title, projectsPageData.metadata.title]);

  // Initialize form data from fetched content
  useEffect(() => {
    if (homePageContent?.content) {
      try {
        const content = JSON.parse(homePageContent.content);
        if (content.metadata) {
          setSiteDefaults(prev => ({
            ...prev,
            ...content.metadata
          }));
        }
      } catch (e) {
        console.error('Error parsing home page content:', e);
      }
    }
  }, [homePageContent]);
  
  useEffect(() => {
    if (blogPageContent?.content) {
      try {
        const content = JSON.parse(blogPageContent.content);
        setBlogPageData(prev => ({
          pageTitle: content.blogTitle || prev.pageTitle,
          pageDescription: content.blogSubtitle || prev.pageDescription,
          metadata: { 
            ...prev.metadata,
            ...(content.metadata || {})
          }
        }));
      } catch (e) {
        console.error('Error parsing blog page content:', e);
      }
    }
  }, [blogPageContent]);
  
  useEffect(() => {
    if (projectsPageContent?.content) {
      try {
        const content = JSON.parse(projectsPageContent.content);
        setProjectsPageData(prev => ({
          pageTitle: content.projectsTitle || prev.pageTitle,
          pageDescription: content.projectsSubtitle || prev.pageDescription,
          metadata: { 
            ...prev.metadata,
            ...(content.metadata || {})
          }
        }));
      } catch (e) {
        console.error('Error parsing projects page content:', e);
      }
    }
  }, [projectsPageContent]);
  
  // Handle site defaults update
  const handleSiteDefaultsUpdate = () => {
    if (homePageContent) {
      try {
        let contentObj;
        try {
          contentObj = JSON.parse(homePageContent.content);
        } catch(e) {
          contentObj = {};
        }
        
        // Update metadata in content object
        const updatedContent = JSON.stringify({
          ...contentObj,
          metadata: siteDefaults
        });
        
        updatePageContentMutation.mutate({
          page: 'home',
          content: updatedContent
        });
      } catch (e) {
        console.error('Error updating site defaults:', e);
        toast({
          title: "Error",
          description: "Failed to save site defaults",
          variant: "destructive"
        });
      }
    }
  };
  
  // Handle blog page update
  const handleBlogPageUpdate = () => {
    if (blogPageContent) {
      try {
        let contentObj;
        try {
          contentObj = JSON.parse(blogPageContent.content);
        } catch(e) {
          contentObj = {};
        }
        
        // Update metadata and page content
        const updatedContent = JSON.stringify({
          ...contentObj,
          blogTitle: blogPageData.pageTitle,
          blogSubtitle: blogPageData.pageDescription,
          metadata: blogPageData.metadata
        });
        
        updatePageContentMutation.mutate({
          page: 'blog',
          content: updatedContent
        });
      } catch (e) {
        console.error('Error updating blog page:', e);
        toast({
          title: "Error",
          description: "Failed to save blog page settings",
          variant: "destructive"
        });
      }
    } else {
      // Create new blog page content
      const newContent = JSON.stringify({
        blogTitle: blogPageData.pageTitle,
        blogSubtitle: blogPageData.pageDescription,
        metadata: blogPageData.metadata
      });
      
      updatePageContentMutation.mutate({
        page: 'blog',
        content: newContent
      });
    }
  };
  
  // Handle projects page update
  const handleProjectsPageUpdate = () => {
    if (projectsPageContent) {
      try {
        let contentObj;
        try {
          contentObj = JSON.parse(projectsPageContent.content);
        } catch(e) {
          contentObj = {};
        }
        
        // Update metadata and page content
        const updatedContent = JSON.stringify({
          ...contentObj,
          projectsTitle: projectsPageData.pageTitle,
          projectsSubtitle: projectsPageData.pageDescription,
          metadata: projectsPageData.metadata
        });
        
        updatePageContentMutation.mutate({
          page: 'projects',
          content: updatedContent
        });
      } catch (e) {
        console.error('Error updating projects page:', e);
        toast({
          title: "Error",
          description: "Failed to save projects page settings",
          variant: "destructive"
        });
      }
    } else {
      // Create new projects page content
      const newContent = JSON.stringify({
        projectsTitle: projectsPageData.pageTitle,
        projectsSubtitle: projectsPageData.pageDescription,
        metadata: projectsPageData.metadata
      });
      
      updatePageContentMutation.mutate({
        page: 'projects',
        content: newContent
      });
    }
  };
  
  // Handle site defaults form changes
  const handleSiteDefaultsChange = (field: string, value: string) => {
    setSiteDefaults(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle blog page form changes
  const handleBlogPageChange = (field: string, value: string) => {
    if (field.startsWith('metadata.')) {
      const metadataField = field.replace('metadata.', '');
      setBlogPageData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
        }
      }));
    } else {
      setBlogPageData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  // Handle projects page form changes
  const handleProjectsPageChange = (field: string, value: string) => {
    if (field.startsWith('metadata.')) {
      const metadataField = field.replace('metadata.', '');
      setProjectsPageData(prev => ({
        ...prev,
        metadata: {
          ...prev.metadata,
          [metadataField]: value
        }
      }));
    } else {
      setProjectsPageData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };
  
  if (authLoading || isLoadingHome) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p>Loading settings...</p>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Site Settings | HAL149 Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-neutral-50">
        <AdminNav />
        
        <div className="lg:ml-64 h-full">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <h1 className="text-xl sm:text-2xl font-bold mb-6">Site Settings</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="site">Site Defaults</TabsTrigger>
                <TabsTrigger value="blog">Blog Page</TabsTrigger>
                <TabsTrigger value="projects">Projects Page</TabsTrigger>
              </TabsList>
              
              {/* Site Defaults Tab */}
              <TabsContent value="site">
                <Card>
                  <CardHeader>
                    <CardTitle>Site-wide Default Settings</CardTitle>
                    <CardDescription>
                      These settings provide default values for all pages and content when no specific values are provided.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      <FormField
                        label="Site Title"
                        name="title"
                        value={siteDefaults.title}
                        onChange={(value) => handleSiteDefaultsChange('title', value)}
                      />
                      
                      <FormField
                        label="Site Description"
                        name="description"
                        value={siteDefaults.description}
                        onChange={(value) => handleSiteDefaultsChange('description', value)}
                      />
                      
                      <FormField
                        label="Default Keywords"
                        name="keywords"
                        value={siteDefaults.keywords}
                        onChange={(value) => handleSiteDefaultsChange('keywords', value)}
                      />
                      
                      <div className="border-t pt-6 mt-2">
                        <h4 className="text-md font-medium mb-4">Social Media Defaults</h4>
                        
                        <div className="space-y-6">
                          <FormField
                            label="Default Open Graph Title"
                            name="ogTitle"
                            value={siteDefaults.ogTitle}
                            onChange={(value) => handleSiteDefaultsChange('ogTitle', value)}
                          />
                          
                          <FormField
                            label="Default Open Graph Description"
                            name="ogDescription"
                            value={siteDefaults.ogDescription}
                            onChange={(value) => handleSiteDefaultsChange('ogDescription', value)}
                          />
                          
                          <FormField
                            label="Default Open Graph Image URL"
                            name="ogImage"
                            value={siteDefaults.ogImage}
                            onChange={(value) => handleSiteDefaultsChange('ogImage', value)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button 
                          onClick={handleSiteDefaultsUpdate}
                          disabled={updatePageContentMutation.isPending}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save Site Defaults
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Blog Page Tab */}
              <TabsContent value="blog">
                <Card>
                  <CardHeader>
                    <CardTitle>Blog Page Settings</CardTitle>
                    <CardDescription>
                      These settings control the content and SEO for the main blog listing page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isLoadingBlog ? (
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            label="Page Title"
                            name="pageTitle"
                            value={blogPageData.pageTitle}
                            onChange={(value) => handleBlogPageChange('pageTitle', value)}
                          />
                          
                          <FormField
                            label="Page Description"
                            name="pageDescription"
                            value={blogPageData.pageDescription}
                            onChange={(value) => handleBlogPageChange('pageDescription', value)}
                          />
                        </div>
                        
                        <div className="border-t pt-6 mt-2">
                          <h4 className="text-md font-medium mb-4">SEO Metadata</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              label="Meta Title"
                              name="metadata.title"
                              value={blogPageData.metadata.title}
                              onChange={(value) => handleBlogPageChange('metadata.title', value)}
                            />
                            
                            <FormField
                              label="Meta Description"
                              name="metadata.description"
                              value={blogPageData.metadata.description}
                              onChange={(value) => handleBlogPageChange('metadata.description', value)}
                            />
                            
                            <FormField
                              label="Meta Keywords"
                              name="metadata.keywords"
                              value={blogPageData.metadata.keywords}
                              onChange={(value) => handleBlogPageChange('metadata.keywords', value)}
                            />
                            
                            <FormField
                              label="Canonical URL"
                              name="metadata.canonical"
                              value={blogPageData.metadata.canonical}
                              onChange={(value) => handleBlogPageChange('metadata.canonical', value)}
                            />
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="text-md font-medium mb-4">Social Media Metadata</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                label="Open Graph Title"
                                name="metadata.ogTitle"
                                value={blogPageData.metadata.ogTitle}
                                onChange={(value) => handleBlogPageChange('metadata.ogTitle', value)}
                              />
                              
                              <FormField
                                label="Open Graph Description"
                                name="metadata.ogDescription"
                                value={blogPageData.metadata.ogDescription}
                                onChange={(value) => handleBlogPageChange('metadata.ogDescription', value)}
                              />
                              
                              <FormField
                                label="Open Graph Image URL"
                                name="metadata.ogImage"
                                value={blogPageData.metadata.ogImage}
                                onChange={(value) => handleBlogPageChange('metadata.ogImage', value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleBlogPageUpdate}
                            disabled={updatePageContentMutation.isPending}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Blog Page Settings
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Projects Page Tab */}
              <TabsContent value="projects">
                <Card>
                  <CardHeader>
                    <CardTitle>Projects Page Settings</CardTitle>
                    <CardDescription>
                      These settings control the content and SEO for the main projects listing page.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {isLoadingProjects ? (
                      <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            label="Page Title"
                            name="pageTitle"
                            value={projectsPageData.pageTitle}
                            onChange={(value) => handleProjectsPageChange('pageTitle', value)}
                          />
                          
                          <FormField
                            label="Page Description"
                            name="pageDescription"
                            value={projectsPageData.pageDescription}
                            onChange={(value) => handleProjectsPageChange('pageDescription', value)}
                          />
                        </div>
                        
                        <div className="border-t pt-6 mt-2">
                          <h4 className="text-md font-medium mb-4">SEO Metadata</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              label="Meta Title"
                              name="metadata.title"
                              value={projectsPageData.metadata.title}
                              onChange={(value) => handleProjectsPageChange('metadata.title', value)}
                            />
                            
                            <FormField
                              label="Meta Description"
                              name="metadata.description"
                              value={projectsPageData.metadata.description}
                              onChange={(value) => handleProjectsPageChange('metadata.description', value)}
                            />
                            
                            <FormField
                              label="Meta Keywords"
                              name="metadata.keywords"
                              value={projectsPageData.metadata.keywords}
                              onChange={(value) => handleProjectsPageChange('metadata.keywords', value)}
                            />
                            
                            <FormField
                              label="Canonical URL"
                              name="metadata.canonical"
                              value={projectsPageData.metadata.canonical}
                              onChange={(value) => handleProjectsPageChange('metadata.canonical', value)}
                            />
                          </div>
                          
                          <div className="mt-6">
                            <h4 className="text-md font-medium mb-4">Social Media Metadata</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                label="Open Graph Title"
                                name="metadata.ogTitle"
                                value={projectsPageData.metadata.ogTitle}
                                onChange={(value) => handleProjectsPageChange('metadata.ogTitle', value)}
                              />
                              
                              <FormField
                                label="Open Graph Description"
                                name="metadata.ogDescription"
                                value={projectsPageData.metadata.ogDescription}
                                onChange={(value) => handleProjectsPageChange('metadata.ogDescription', value)}
                              />
                              
                              <FormField
                                label="Open Graph Image URL"
                                name="metadata.ogImage"
                                value={projectsPageData.metadata.ogImage}
                                onChange={(value) => handleProjectsPageChange('metadata.ogImage', value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button 
                            onClick={handleProjectsPageUpdate}
                            disabled={updatePageContentMutation.isPending}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            Save Projects Page Settings
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
}