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
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Edit, 
  Plus, 
  Trash, 
  FolderKanban,
  Eye,
  Star,
  StarOff
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { FormField, ContentEditor } from '@/components/AdminEditor';
import type { Project, InsertProject } from '@shared/schema';
import { slugify } from '@shared/utils';

export default function AdminProjects() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  
  const [formData, setFormData] = useState<Partial<InsertProject & { metadata?: Record<string, string> }>>({
    title: '',
    slug: '',
    description: '',
    content: '',
    category: '',
    imageUrl: '',
    isFeatured: false,
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
  
  const { data: projects, isLoading: isLoadingProjects } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
    enabled: !!user
  });
  
  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project created",
        description: "The project has been created successfully"
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create project",
        variant: "destructive"
      });
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: InsertProject }) => {
      const res = await apiRequest("PUT", `/api/projects/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects/featured'] });
      toast({
        title: "Project updated",
        description: "The project has been updated successfully"
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update project",
        variant: "destructive"
      });
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/projects/${id}`, undefined);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects/featured'] });
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully"
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete project",
        variant: "destructive"
      });
    }
  });
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title if not manually edited
    if (field === 'title' && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: slugify(value as string) }));
    }
  };
  
  // Handle changes to metadata fields
  const handleMetadataChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      metadata: {
        ...prev.metadata,
        [field]: value
      }
    }));
  };
  
  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      category: '',
      imageUrl: '',
      isFeatured: false,
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
    setCurrentProjectId(null);
    setEditMode(false);
    setActiveTab('editor');
  };
  
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  const openEditDialog = (project: Project) => {
    setCurrentProjectId(project.id);
    
    // Try to parse metadata from content if present
    let existingMetadata = {
      title: '',
      description: '',
      keywords: '',
      canonical: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: ''
    };
    
    try {
      const contentObj = typeof project.content === 'string' && project.content.trim().startsWith('{') 
        ? JSON.parse(project.content)
        : { content: project.content };
        
      if (contentObj.metadata) {
        existingMetadata = {
          ...existingMetadata,
          ...contentObj.metadata
        };
      }
    } catch (e) {
      console.error('Error parsing metadata from project:', e);
    }
    
    setFormData({
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      category: project.category,
      imageUrl: project.imageUrl,
      isFeatured: project.isFeatured,
      metadata: existingMetadata
    });
    
    setEditMode(true);
    setIsDialogOpen(true);
  };
  
  const openDeleteDialog = (id: number) => {
    setCurrentProjectId(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleSubmit = () => {
    if (!formData.title || !formData.description || !formData.content || !formData.category || !formData.imageUrl) {
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
    
    const projectData = {
      title: formData.title!,
      slug: formData.slug || slugify(formData.title!),
      description: formData.description!,
      content: finalContent,
      category: formData.category!,
      imageUrl: formData.imageUrl!,
      isFeatured: formData.isFeatured || false
    };
    
    if (editMode && currentProjectId) {
      updateMutation.mutate({ id: currentProjectId, data: projectData });
    } else {
      createMutation.mutate(projectData);
    }
  };
  
  const handleDelete = () => {
    if (currentProjectId) {
      deleteMutation.mutate(currentProjectId);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p>Loading projects...</p>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Manage Projects | HAL149 Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-neutral-50">
        <AdminNav />
        
        <div className="lg:ml-64 h-full">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">Projects</h1>
              <Button onClick={openCreateDialog}>
                <Plus className="h-4 w-4 mr-2" /> Add New Project
              </Button>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>All Projects</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingProjects ? (
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
                ) : projects && projects.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Featured</TableHead>
                        <TableHead className="w-[150px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects.map((project) => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">{project.title}</TableCell>
                          <TableCell>{project.category}</TableCell>
                          <TableCell>
                            {project.isFeatured ? (
                              <Star className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <StarOff className="h-4 w-4 text-neutral-300" />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="icon" asChild>
                                <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">View</span>
                                </a>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => openEditDialog(project)}>
                                <Edit className="h-4 w-4" />
                                <span className="sr-only">Edit</span>
                              </Button>
                              <Button variant="outline" size="icon" onClick={() => openDeleteDialog(project.id)}>
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
                    <FolderKanban className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                    <p className="text-neutral-500 mb-4">Get started by creating your first project.</p>
                    <Button onClick={openCreateDialog}>
                      <Plus className="h-4 w-4 mr-2" /> Add New Project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Create/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editMode ? 'Edit Project' : 'Create New Project'}</DialogTitle>
                  <DialogDescription>
                    {editMode 
                      ? 'Edit the details of your project below.'
                      : 'Fill out the information below to create a new project.'}
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
                        label="Category"
                        name="category"
                        value={formData.category || ''}
                        onChange={(value) => handleInputChange('category', value)}
                        required
                      />
                      <div className="flex items-center space-x-2 h-full pt-8">
                        <Checkbox 
                          id="isFeatured" 
                          checked={!!formData.isFeatured}
                          onCheckedChange={(checked) => {
                            if (checked !== 'indeterminate') {
                              handleInputChange('isFeatured', checked);
                            }
                          }}
                        />
                        <label
                          htmlFor="isFeatured"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Feature this project on homepage
                        </label>
                      </div>
                    </div>
                    
                    <FormField
                      label="Image URL"
                      name="imageUrl"
                      value={formData.imageUrl || ''}
                      onChange={(value) => handleInputChange('imageUrl', value)}
                      required
                    />
                    
                    <div>
                      <FormField
                        label="Description"
                        name="description"
                        value={formData.description || ''}
                        onChange={(value) => handleInputChange('description', value)}
                        required
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        A brief summary that appears on the project listing page
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
                        If left empty, values will be automatically generated from the project content.
                      </p>
                    </div>
                    
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          label="Meta Title"
                          name="metaTitle"
                          value={formData.metadata?.title || ''}
                          onChange={(value) => handleMetadataChange('title', value)}
                        />
                        <FormField
                          label="Meta Description"
                          name="metaDescription"
                          value={formData.metadata?.description || ''}
                          onChange={(value) => handleMetadataChange('description', value)}
                        />
                      </div>
                      
                      <FormField
                        label="Keywords"
                        name="keywords"
                        value={formData.metadata?.keywords || ''}
                        onChange={(value) => handleMetadataChange('keywords', value)}
                      />
                      
                      <FormField
                        label="Canonical URL"
                        name="canonical"
                        value={formData.metadata?.canonical || ''}
                        onChange={(value) => handleMetadataChange('canonical', value)}
                      />
                      
                      <div className="border-t pt-6 mt-8">
                        <h4 className="text-md font-medium mb-4">Social Media</h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <FormField
                            label="Open Graph Title"
                            name="ogTitle"
                            value={formData.metadata?.ogTitle || ''}
                            onChange={(value) => handleMetadataChange('ogTitle', value)}
                          />
                          <FormField
                            label="Open Graph Description"
                            name="ogDescription"
                            value={formData.metadata?.ogDescription || ''}
                            onChange={(value) => handleMetadataChange('ogDescription', value)}
                          />
                        </div>
                        
                        <FormField
                          label="Open Graph Image URL"
                          name="ogImage"
                          value={formData.metadata?.ogImage || ''}
                          onChange={(value) => handleMetadataChange('ogImage', value)}
                        />
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="preview">
                    {formData.title && (
                      <>
                        <div className="bg-neutral-50 p-6 rounded-lg mb-6">
                          {formData.category && (
                            <span className="inline-block px-3 py-1 text-xs font-medium bg-neutral-200 text-neutral-800 rounded-full mb-4">
                              {formData.category}
                            </span>
                          )}
                          <h2 className="text-3xl font-bold mb-2">{formData.title}</h2>
                          {formData.description && <p className="text-neutral-600">{formData.description}</p>}
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
                    {createMutation.isPending || updateMutation.isPending ? 'Saving...' : 'Save Project'}
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
                    This action cannot be undone. This will permanently delete the project.
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
