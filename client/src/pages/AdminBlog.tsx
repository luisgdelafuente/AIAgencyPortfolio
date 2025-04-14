import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Edit, 
  Plus, 
  Trash, 
  FileText,
  Eye 
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { FormField, ContentEditor } from '@/components/AdminEditor';
import { extractItemMetadata } from '@/lib/metadata';
import type { BlogPost, InsertBlogPost } from '@shared/schema';
import { formatDate, slugify } from '@shared/utils';

export default function AdminBlog() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPostId, setCurrentPostId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  
  const [formData, setFormData] = useState<Partial<InsertBlogPost & { metadata?: Record<string, string> }>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    publishedAt: new Date().toISOString(),
    metadata: {
      // SEO metadata fields
      title: '',
      description: '',
      keywords: '',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: ''
    }
  });
  
  const { data: blogPosts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
    enabled: !!user
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: InsertBlogPost) => {
      const res = await apiRequest("POST", "/api/blog", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({
        title: "Blog post created",
        description: "The blog post has been created successfully"
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create blog post",
        variant: "destructive"
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: InsertBlogPost }) => {
      const res = await apiRequest("PUT", `/api/blog/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({
        title: "Blog post updated",
        description: "The blog post has been updated successfully"
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update blog post",
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/blog/${id}`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog'] });
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully"
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete blog post",
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (field: string, value: string | Date) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title if not manually edited
    if (field === 'title' && !formData.slug && typeof value === 'string') {
      setFormData((prev) => ({ ...prev, slug: slugify(value) }));
    }
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      publishedAt: new Date().toISOString(),
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
    setCurrentPostId(null);
    setEditMode(false);
    setActiveTab('editor');
  };
  
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (post: BlogPost) => {
    setCurrentPostId(post.id);
    
    // Default metadata from the blog post itself
    const postMetadata = extractItemMetadata({
      ...post,
      type: 'blog'  // Add type to help with canonical URL formation
    });
    
    // Try to parse metadata from content if present
    let existingMetadata = {
      title: postMetadata.title || '',
      description: postMetadata.description || '',
      keywords: postMetadata.keywords || '',
      canonical: postMetadata.canonical || '',
      ogTitle: postMetadata.ogTitle || '',
      ogDescription: postMetadata.ogDescription || '',
      ogImage: postMetadata.ogImage || ''
    };
    
    try {
      const contentObj = typeof post.content === 'string' && post.content.trim().startsWith('{') 
        ? JSON.parse(post.content)
        : { content: post.content };
        
      if (contentObj.metadata) {
        // Override defaults with any existing metadata from content
        existingMetadata = {
          ...existingMetadata,
          ...contentObj.metadata
        };
      }
    } catch (e) {
      console.error('Error parsing metadata from blog post:', e);
    }
    
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      imageUrl: post.imageUrl,
      publishedAt: post.publishedAt,
      metadata: existingMetadata
    });
    
    setEditMode(true);
    setIsDialogOpen(true);
  };
  
  const openDeleteDialog = (id: number) => {
    setCurrentPostId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (!formData.title || !formData.excerpt || !formData.content || !formData.imageUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    // Prepare the raw content or a JSON object with content + metadata
    let finalContent = formData.content;
    
    // If we have metadata, store it as a JSON object with the content
    if (formData.metadata && Object.values(formData.metadata).some(value => value && typeof value === 'string' && value.trim() !== '')) {
      try {
        // If content is already a JSON string with metadata
        let contentObj = {};
        try {
          if (typeof formData.content === 'string' && formData.content.trim().startsWith('{')) {
            contentObj = JSON.parse(formData.content);
          } else {
            contentObj = { content: formData.content };
          }
        } catch (e) {
          contentObj = { content: formData.content };
        }
        
        // Update with new metadata
        finalContent = JSON.stringify({
          ...contentObj,
          metadata: formData.metadata
        });
      } catch (e) {
        console.error('Error parsing or stringifying content with metadata:', e);
        // Fall back to just the content without metadata
        finalContent = formData.content;
      }
    }
    
    const postData = {
      title: formData.title!,
      slug: formData.slug || slugify(formData.title!),
      excerpt: formData.excerpt!,
      content: finalContent,
      imageUrl: formData.imageUrl!,
      publishedAt: typeof formData.publishedAt === 'string'
        ? formData.publishedAt
        : new Date().toISOString()
    };
    
    if (editMode && currentPostId) {
      updateMutation.mutate({ id: currentPostId, data: postData });
    } else {
      createMutation.mutate(postData);
    }
  };
  
  const handleDelete = () => {
    if (currentPostId) {
      deleteMutation.mutate(currentPostId);
    }
  };
  
  if (authLoading) {
    return <p>Loading...</p>;
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <>
      <Helmet>
        <title>Manage Blog Posts | HAL149 Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-neutral-50">
        <AdminNav />
        
        <div className="lg:ml-64 h-full">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">Blog Posts</h1>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" /> Add New Post
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Blog Posts</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : blogPosts && blogPosts.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blogPosts.map((post) => (
                        <TableRow key={post.id}>
                          <TableCell className="font-medium">{post.title}</TableCell>
                          <TableCell>{formatDate(post.publishedAt)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon" asChild>
                                <a href={`/blog/${post.slug}/`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </a>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => openEditDialog(post)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => openDeleteDialog(post.id)}>
                                <Trash className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <h3 className="text-lg font-medium mb-2">No blog posts yet</h3>
                    <p className="text-neutral-500 mb-4">Get started by creating your first blog post.</p>
                    <Button onClick={openCreateDialog}>
                      <Plus className="h-4 w-4 mr-2" /> Add New Post
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editMode ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
                  <DialogDescription>
                    {editMode 
                      ? 'Edit the details of your blog post below.'
                      : 'Fill out the information below to create a new blog post.'}
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="seo">SEO Metadata</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="editor" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Title"
                        name="title"
                        value={formData.title || ''}
                        onChange={(value) => handleInputChange('title', value)}
                        required
                      />
                      <FormField
                        label="Slug"
                        name="slug"
                        value={formData.slug || ''}
                        onChange={(value) => handleInputChange('slug', value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        label="Image URL"
                        name="imageUrl"
                        value={formData.imageUrl || ''}
                        onChange={(value) => handleInputChange('imageUrl', value)}
                        required
                      />
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Published Date <span className="text-red-500">*</span>
                        </label>
                        <input 
                          type="date" 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" 
                          value={typeof formData.publishedAt === 'string'
                            ? new Date(formData.publishedAt).toISOString().split('T')[0]
                            : new Date().toISOString().split('T')[0]
                          }
                          onChange={(e) => {
                            // Convert string to Date directly in the form data
                            setFormData(prev => ({
                              ...prev,
                              publishedAt: new Date(e.target.value).toISOString()
                            }));
                          }}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <FormField
                        label="Excerpt"
                        name="excerpt"
                        value={formData.excerpt || ''}
                        onChange={(value) => handleInputChange('excerpt', value)}
                        required
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        A brief summary that appears on the blog listing page
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Content <span className="text-red-500">*</span>
                      </label>
                      <ContentEditor
                        value={formData.content || ''}
                        onChange={(value) => handleInputChange('content', value)}
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="seo" className="space-y-6">
                    <div className="border-b pb-4 mb-4">
                      <h3 className="text-lg font-medium mb-2">SEO Metadata</h3>
                      <p className="text-sm text-neutral-500">
                        This information is used for search engines and social media sharing. 
                        If left empty, values will be inherited from the main blog page settings.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5">
                      <FormField
                        label="Meta Title"
                        name="metadata.title"
                        value={formData.metadata?.title || ''}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            metadata: { 
                              ...prev.metadata,
                              title: value 
                            }
                          }));
                        }}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Appears in search results and browser tabs. If empty, the post title will be used.
                      </p>
                      
                      <FormField
                        label="Meta Description"
                        name="metadata.description"
                        value={formData.metadata?.description || ''}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            metadata: { 
                              ...prev.metadata,
                              description: value 
                            }
                          }));
                        }}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Appears in search results. If empty, the post excerpt will be used.
                      </p>
                      
                      <FormField
                        label="Keywords"
                        name="metadata.keywords"
                        value={formData.metadata?.keywords || ''}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            metadata: { 
                              ...prev.metadata, 
                              keywords: value 
                            }
                          }));
                        }}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Comma-separated list of keywords related to this post.
                      </p>
                      
                      <FormField
                        label="Canonical URL"
                        name="metadata.canonical"
                        value={formData.metadata?.canonical || ''}
                        onChange={(value) => {
                          setFormData(prev => ({
                            ...prev,
                            metadata: { 
                              ...prev.metadata, 
                              canonical: value 
                            }
                          }));
                        }}
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        The official URL for this content if it exists elsewhere.
                      </p>
                    </div>
                    
                    <div className="border-t pt-4 mt-6">
                      <h4 className="text-md font-medium mb-3">Social Media Sharing</h4>
                      
                      <div className="grid grid-cols-1 gap-5">
                        <FormField
                          label="Social Title"
                          name="metadata.ogTitle"
                          value={formData.metadata?.ogTitle || ''}
                          onChange={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              metadata: { 
                                ...prev.metadata, 
                                ogTitle: value 
                              }
                            }));
                          }}
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          Title used when sharing on social media. If empty, the meta title will be used.
                        </p>
                        
                        <FormField
                          label="Social Description"
                          name="metadata.ogDescription"
                          value={formData.metadata?.ogDescription || ''}
                          onChange={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              metadata: { 
                                ...prev.metadata, 
                                ogDescription: value 
                              }
                            }));
                          }}
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          Description used when sharing on social media. If empty, the meta description will be used.
                        </p>
                        
                        <FormField
                          label="Social Image URL"
                          name="metadata.ogImage"
                          value={formData.metadata?.ogImage || ''}
                          onChange={(value) => {
                            setFormData(prev => ({
                              ...prev,
                              metadata: { 
                                ...prev.metadata, 
                                ogImage: value 
                              }
                            }));
                          }}
                        />
                        <p className="text-xs text-neutral-500 mt-1">
                          Image displayed when sharing on social media. If empty, the post image will be used.
                        </p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    {formData.title && (
                      <>
                        <div className="bg-neutral-50 p-6 rounded-lg mb-6">
                          <h2 className="text-3xl font-bold mb-2">{formData.title}</h2>
                          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
                            <span>Published: {typeof formData.publishedAt === 'string'
                              ? new Date(formData.publishedAt).toLocaleDateString()
                              : new Date().toLocaleDateString()
                            }</span>
                          </div>
                          {formData.excerpt && <p className="text-neutral-600">{formData.excerpt}</p>}
                        </div>
                        
                        {formData.imageUrl && (
                          <img 
                            src={formData.imageUrl} 
                            alt={formData.title} 
                            className="w-full h-auto rounded-lg mb-6"
                          />
                        )}
                        
                        {formData.content && (
                          <ContentEditor
                            value={formData.content}
                            onChange={() => {}}
                            preview
                          />
                        )}
                      </>
                    )}
                  </TabsContent>
                </Tabs>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Post'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Delete Confirmation Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the blog post.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </>
  );
}
