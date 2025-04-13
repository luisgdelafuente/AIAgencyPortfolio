import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import AdminNav from '@/components/AdminNav';
import { ContentEditor } from '@/components/AdminEditor';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageContent } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function AdminContent() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('home');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>('');
  const [editContent, setEditContent] = useState<string>('');

  // Fetch all page contents
  const { data: pageContents, isLoading } = useQuery({
    queryKey: ['/api/page-contents'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/page-contents');
      return await res.json() as PageContent[];
    },
  });

  // Save page content mutation
  const saveContentMutation = useMutation({
    mutationFn: async ({ page, content }: { page: string, content: string }) => {
      const res = await apiRequest('POST', '/api/page-contents', { page, content });
      return await res.json() as PageContent;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/page-contents'] });
      setIsEditDialogOpen(false);
      toast({
        title: 'Content Saved',
        description: `Page content for '${currentPage}' has been updated successfully.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to save content: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Handle edit dialog open
  const openEditDialog = (page: string, content: string) => {
    setCurrentPage(page);
    setEditContent(content);
    setIsEditDialogOpen(true);
  };

  // Determine if the content is valid JSON
  const isValidJson = (content: string): boolean => {
    try {
      JSON.parse(content);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle edit submit
  const handleEditSubmit = () => {
    if (!isValidJson(editContent)) {
      toast({
        title: 'Invalid JSON',
        description: 'The content must be valid JSON. Please check your formatting.',
        variant: 'destructive',
      });
      return;
    }
    
    saveContentMutation.mutate({ page: currentPage, content: editContent });
  };

  // Helper to get content by page name
  const getContentByPage = (pageName: string): string => {
    if (!pageContents) return '{}';
    const pageContent = pageContents.find(p => p.page === pageName);
    return pageContent?.content || '{}';
  };

  // Helper to format JSON for display
  const formatJson = (json: string): string => {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch (e) {
      return json;
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <AdminNav />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <AdminNav />
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Manage Page Content</h1>
        <p className="text-muted-foreground mt-2">
          Edit the content of static pages. All content is stored as JSON.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>

        {['home', 'about', 'contact', 'legal'].map((page) => (
          <TabsContent key={page} value={page}>
            <Card>
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="capitalize">{page} Page Content</span>
                  <Button 
                    onClick={() => openEditDialog(page, getContentByPage(page))}
                  >
                    Edit Content
                  </Button>
                </CardTitle>
                <CardDescription>
                  Content is stored as JSON and rendered dynamically on the {page} page.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                  <code>{formatJson(getContentByPage(page))}</code>
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Content Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Edit {currentPage} Page Content</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="content">Content (JSON format)</Label>
              <ContentEditor
                value={editContent}
                onChange={setEditContent}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Content must be valid JSON. Use the editor above to modify page content.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleEditSubmit}
              disabled={saveContentMutation.isPending}
            >
              {saveContentMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}