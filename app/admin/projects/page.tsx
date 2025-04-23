'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/providers/toast-provider';
import Link from 'next/link';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui';
import { Button } from '@/components/ui';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle 
} from '@/components/ui';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle 
} from '@/components/ui';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui';
import { 
  Input,
  Textarea,
  Label,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Skeleton,
  Switch
} from '@/components/ui';
import { 
  Edit, 
  Plus, 
  Trash, 
  LayoutGrid,
  Eye 
} from 'lucide-react';
import { formatDate, slugify } from '@/shared/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema for project form
const projectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  category: z.string().min(2, 'Category must be at least 2 characters'),
  imageUrl: z.string().url('Must be a valid URL'),
  isFeatured: z.boolean().default(false),
  githubUrl: z.string().url('Must be a valid URL').optional().nullable(),
  demoUrl: z.string().url('Must be a valid URL').optional().nullable()
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type Project = {
  id: number;
  title: string;
  slug: string;
  description: string;
  content: string;
  category: string;
  imageUrl: string;
  isFeatured: boolean | null;
  githubUrl: string | null;
  demoUrl: string | null;
};

export default function AdminProjects() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('editor');
  
  // Query to fetch projects
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });
  
  // Form setup
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      slug: '',
      description: '',
      content: '',
      category: '',
      imageUrl: '',
      isFeatured: false,
      githubUrl: null,
      demoUrl: null
    }
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormValues) => {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create project');
      }
      
      return response.json();
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
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create project",
        variant: "destructive"
      });
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete project');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project deleted",
        description: "The project has been deleted successfully"
      });
      setIsDeleteDialogOpen(false);
      setCurrentProjectId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete project",
        variant: "destructive"
      });
    }
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: ProjectFormValues }) => {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update project');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project updated",
        description: "The project has been updated successfully"
      });
      resetForm();
      setIsDialogOpen(false);
      setCurrentProjectId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update project",
        variant: "destructive"
      });
    }
  });
  
  // Reset form
  const resetForm = () => {
    form.reset({
      title: '',
      slug: '',
      description: '',
      content: '',
      category: '',
      imageUrl: '',
      isFeatured: false,
      githubUrl: null,
      demoUrl: null
    });
    setActiveTab('editor');
  };
  
  // Open dialog to create a new project
  const openCreateDialog = () => {
    resetForm();
    setCurrentProjectId(null);
    setIsDialogOpen(true);
  };
  
  // Open dialog to edit an existing project
  const openEditDialog = (project: Project) => {
    form.reset({
      title: project.title,
      slug: project.slug,
      description: project.description,
      content: project.content,
      category: project.category,
      imageUrl: project.imageUrl,
      isFeatured: project.isFeatured || false,
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl
    });
    setCurrentProjectId(project.id);
    setIsDialogOpen(true);
  };
  
  // Open dialog to confirm deletion
  const openDeleteDialog = (id: number) => {
    setCurrentProjectId(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const onSubmit = (values: ProjectFormValues) => {
    if (currentProjectId) {
      updateMutation.mutate({ id: currentProjectId, data: values });
    } else {
      createMutation.mutate(values);
    }
  };
  
  // Handle title change to auto-generate slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    
    // Only auto-generate slug if it's empty or matches previous slug pattern
    const currentSlug = form.getValues('slug');
    const previousTitle = form.getValues('title');
    
    if (!currentSlug || currentSlug === slugify(previousTitle)) {
      form.setValue('slug', slugify(title));
    }
  };
  
  // Preview formatted content
  const previewContent = () => {
    const content = form.getValues('content');
    return { __html: content.replace(/\n/g, '<br />') };
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : projects && projects.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-gray-500">{project.slug}</div>
                    </TableCell>
                    <TableCell>{project.category}</TableCell>
                    <TableCell>
                      {project.isFeatured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Not Featured
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link href={`/projects/${project.slug}/`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDeleteDialog(project.id)}
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <LayoutGrid className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No Projects Yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first project to get started.
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {currentProjectId ? 'Edit Project' : 'Create New Project'}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for your project. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="editor">Editor</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter project title" 
                              {...field}
                              onChange={handleTitleChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="url-friendly-slug" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Project category" 
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isFeatured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Project</FormLabel>
                            <FormDescription>
                              Featured projects will be displayed prominently on the home page
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Brief description of the project (will appear in previews)" 
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Featured Image URL</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://example.com/image.jpg" 
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="githubUrl"
                      render={({ field: { value, onChange, ...rest } }) => (
                        <FormItem>
                          <FormLabel>GitHub URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://github.com/username/repo" 
                              {...rest}
                              value={value || ''}
                              onChange={(e) => onChange(e.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="demoUrl"
                      render={({ field: { value, onChange, ...rest } }) => (
                        <FormItem>
                          <FormLabel>Demo URL (Optional)</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://demo-url.com" 
                              {...rest}
                              value={value || ''}
                              onChange={(e) => onChange(e.target.value || null)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your project content here..." 
                            rows={15}
                            className="font-mono"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        'Saving...'
                      ) : (
                        currentProjectId ? 'Update Project' : 'Create Project'
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="border rounded-md p-4">
                <h1 className="text-2xl font-bold mb-2">{form.getValues('title')}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {form.getValues('category') || 'Category'}
                  </span>
                  {form.getValues('isFeatured') && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Featured
                    </span>
                  )}
                </div>
                {form.getValues('imageUrl') && (
                  <div className="mb-4">
                    <img 
                      src={form.getValues('imageUrl')} 
                      alt={form.getValues('title')}
                      className="rounded-md max-h-[300px] object-cover w-full"
                    />
                  </div>
                )}
                <div className="text-lg font-medium mb-4">
                  {form.getValues('description')}
                </div>
                
                <div className="mb-6 flex flex-wrap gap-2">
                  {form.getValues('githubUrl') && (
                    <a 
                      href={form.getValues('githubUrl') || '#'} 
                      className="text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on GitHub
                    </a>
                  )}
                  {form.getValues('demoUrl') && (
                    <a 
                      href={form.getValues('demoUrl') || '#'} 
                      className="text-sm text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Demo
                    </a>
                  )}
                </div>
                
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={previewContent()}
                />
              </div>
              
              <DialogFooter className="mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setActiveTab('editor');
                    form.handleSubmit(onSubmit)();
                  }}
                  disabled={createMutation.isPending || updateMutation.isPending}
                >
                  {createMutation.isPending || updateMutation.isPending ? (
                    'Saving...'
                  ) : (
                    currentProjectId ? 'Update Project' : 'Create Project'
                  )}
                </Button>
              </DialogFooter>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              project and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentProjectId && deleteMutation.mutate(currentProjectId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}