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
import { Pencil, RefreshCw } from 'lucide-react';
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
  const prettyPrintContent = (content: string) => {
    try {
      return JSON.stringify(JSON.parse(content), null, 2);
    } catch (e) {
      return content;
    }
  };

  // Handle opening the edit dialog
  const handleEditClick = (page: PageContent) => {
    setSelectedPage(page.page);
    setEditContent(prettyPrintContent(page.content));
    setDialogOpen(true);
  };

  // Handle saving the content
  const handleSaveContent = () => {
    if (!selectedPage) return;
    
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
  const getContentPreview = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      
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
      return content.substring(0, 100) + (content.length > 100 ? '...' : '');
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
            <div className="text-center py-10 border rounded-lg bg-neutral-50">
              <p className="text-neutral-500">No page contents found.</p>
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
                              {getContentPreview(page.content)}
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
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="capitalize">
              Edit {selectedPage} Page Content
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-neutral-500 mb-2">
              Edit the JSON content below. This defines the structure and content of the page.
            </p>
            <div className="border rounded-lg overflow-hidden">
              <ContentEditor 
                value={editContent} 
                onChange={setEditContent}
              />
            </div>
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