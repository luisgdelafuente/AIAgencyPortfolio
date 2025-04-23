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
  Input,
  Label,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Skeleton
} from '@/components/ui';
import { 
  Edit, 
  Plus, 
  FileText,
  Eye,
  Save
} from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

type PageContent = {
  id: number;
  page: string;
  content: string;
  updatedAt: string;
};

// Define schema for page content form
const pageContentSchema = z.object({
  page: z.string().min(2, 'Page name must be at least 2 characters'),
  content: z.string().min(2, 'Content is required')
});

type PageContentFormValues = z.infer<typeof pageContentSchema>;

export default function AdminContent() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPageId, setCurrentPageId] = useState<number | null>(null);
  const [currentPageName, setCurrentPageName] = useState<string>('');
  const [isCreating, setIsCreating] = useState(false);
  
  // Format page name for display
  const formatPageName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format JSON content for display
  const formatContent = (content: string) => {
    try {
      return JSON.stringify(JSON.parse(content), null, 2);
    } catch (error) {
      return content;
    }
  };
  
  // Query to fetch page contents
  const { data: pageContents, isLoading } = useQuery<PageContent[]>({
    queryKey: ['/api/page-contents'],
  });
  
  // Form setup
  const form = useForm<PageContentFormValues>({
    resolver: zodResolver(pageContentSchema),
    defaultValues: {
      page: '',
      content: '{}'
    }
  });
  
  // Upsert mutation (handles both create and update)
  const upsertMutation = useMutation({
    mutationFn: async (data: PageContentFormValues) => {
      const response = await fetch('/api/page-contents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save page content');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-contents'] });
      toast({
        title: isCreating ? "Page content created" : "Page content updated",
        description: `The page content has been ${isCreating ? 'created' : 'updated'} successfully`
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save page content",
        variant: "destructive"
      });
    }
  });
  
  // Reset form
  const resetForm = () => {
    form.reset({
      page: '',
      content: '{}'
    });
    setCurrentPageId(null);
    setCurrentPageName('');
    setIsCreating(false);
  };
  
  // Open dialog to create a new page content
  const openCreateDialog = () => {
    resetForm();
    setIsCreating(true);
    setIsDialogOpen(true);
  };
  
  // Open dialog to edit an existing page content
  const openEditDialog = (pageContent: PageContent) => {
    form.reset({
      page: pageContent.page,
      content: formatContent(pageContent.content)
    });
    setCurrentPageId(pageContent.id);
    setCurrentPageName(pageContent.page);
    setIsCreating(false);
    setIsDialogOpen(true);
  };
  
  // Handle form submission
  const onSubmit = (values: PageContentFormValues) => {
    // Validate JSON before submitting
    try {
      JSON.parse(values.content);
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The content must be valid JSON",
        variant: "destructive"
      });
      return;
    }
    
    upsertMutation.mutate(values);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Page Contents</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="w-4 h-4 mr-2" />
          New Page Content
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Page Contents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : pageContents && pageContents.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageContents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell className="font-medium">
                      {formatPageName(content.page)}
                    </TableCell>
                    <TableCell>
                      {new Date(content.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openEditDialog(content)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          asChild
                        >
                          <Link href={`/${content.page}`} target="_blank">
                            <Eye className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <FileText className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No Page Contents Yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first page content to get started.
              </p>
              <Button onClick={openCreateDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Create Page Content
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
              {isCreating ? 'Create New Page Content' : `Edit Page Content: ${formatPageName(currentPageName)}`}
            </DialogTitle>
            <DialogDescription>
              {isCreating 
                ? 'Create content for a new page. Content must be valid JSON.'
                : 'Edit the content for this page. Content must be valid JSON.'
              }
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="page"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Page Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="home, about, etc." 
                        {...field}
                        disabled={!isCreating} // Can't change page name when editing
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content (JSON)</FormLabel>
                    <FormControl>
                      <textarea 
                        className="w-full min-h-[400px] p-4 border border-gray-300 rounded-md font-mono text-sm"
                        placeholder='{"key": "value"}'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-sm text-gray-500">
                      Enter valid JSON content for the page. This content will be used to populate dynamic content on the page.
                    </p>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={upsertMutation.isPending}
                >
                  {upsertMutation.isPending ? (
                    'Saving...'
                  ) : (
                    <span className="flex items-center">
                      <Save className="w-4 h-4 mr-2" />
                      Save Content
                    </span>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}