'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/components/providers/toast-provider';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
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
  TabsTrigger,
  Badge,
  Checkbox,
  Skeleton,
  Input,
  Label
} from '@/components/ui';
import { 
  Trash, 
  Mail,
  MailOpen,
  Eye,
  Search,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { formatDate } from '@/shared/utils';

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
};

export default function AdminMessages() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<ContactMessage | null>(null);
  const [currentTab, setCurrentTab] = useState<'all' | 'unread' | 'read'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMessages, setSelectedMessages] = useState<number[]>([]);
  
  // Query to fetch contact messages
  const { data: contactMessages, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete message');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: "Message deleted",
        description: "The message has been deleted successfully"
      });
      setIsDeleteDialogOpen(false);
      setCurrentMessage(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete message",
        variant: "destructive"
      });
    }
  });
  
  // Bulk delete mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      // For now, let's delete them one by one
      for (const id of ids) {
        const response = await fetch(`/api/contact/${id}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to delete message');
        }
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: "Messages deleted",
        description: `${selectedMessages.length} messages have been deleted successfully`
      });
      setSelectedMessages([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete messages",
        variant: "destructive"
      });
    }
  });
  
  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/contact/${id}/read`, {
        method: 'PATCH'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to mark message as read');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      
      // Only show toast if not in view dialog
      if (!isViewDialogOpen) {
        toast({
          title: "Message marked as read",
          description: "The message has been marked as read"
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark message as read",
        variant: "destructive"
      });
    }
  });
  
  // Bulk mark as read mutation
  const bulkMarkAsReadMutation = useMutation({
    mutationFn: async (ids: number[]) => {
      // For now, let's mark them as read one by one
      for (const id of ids) {
        const response = await fetch(`/api/contact/${id}/read`, {
          method: 'PATCH'
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Failed to mark message as read');
        }
      }
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: "Messages marked as read",
        description: `${selectedMessages.length} messages have been marked as read`
      });
      setSelectedMessages([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to mark messages as read",
        variant: "destructive"
      });
    }
  });
  
  // Open dialog to view a message
  const openViewDialog = (message: ContactMessage) => {
    setCurrentMessage(message);
    setIsViewDialogOpen(true);
    
    // If message is unread, mark it as read
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };
  
  // Open dialog to confirm deletion
  const openDeleteDialog = (message: ContactMessage) => {
    setCurrentMessage(message);
    setIsDeleteDialogOpen(true);
  };
  
  // Filter messages based on tab and search term
  const getFilteredMessages = () => {
    if (!contactMessages) return [];
    
    let filtered = [...contactMessages];
    
    // Filter by tab
    if (currentTab === 'unread') {
      filtered = filtered.filter(message => !message.read);
    } else if (currentTab === 'read') {
      filtered = filtered.filter(message => message.read);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(message => 
        message.name.toLowerCase().includes(term) ||
        message.email.toLowerCase().includes(term) ||
        message.subject.toLowerCase().includes(term) ||
        message.message.toLowerCase().includes(term)
      );
    }
    
    // Sort by date (newest first)
    return filtered.sort((a, b) => 
      new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  };
  
  const filteredMessages = getFilteredMessages();
  
  // Handle checkbox selection
  const handleSelectMessage = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedMessages([...selectedMessages, id]);
    } else {
      setSelectedMessages(selectedMessages.filter(messageId => messageId !== id));
    }
  };
  
  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedMessages(filteredMessages.map(message => message.id));
    } else {
      setSelectedMessages([]);
    }
  };
  
  // Get counts for tabs
  const getCounts = () => {
    if (!contactMessages) return { all: 0, unread: 0, read: 0 };
    
    const all = contactMessages.length;
    const unread = contactMessages.filter(message => !message.read).length;
    const read = contactMessages.filter(message => message.read).length;
    
    return { all, unread, read };
  };
  
  const counts = getCounts();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        
        {selectedMessages.length > 0 && (
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => bulkMarkAsReadMutation.mutate(selectedMessages)}
              disabled={bulkMarkAsReadMutation.isPending}
            >
              <MailOpen className="w-4 h-4 mr-2" />
              Mark as Read
            </Button>
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => bulkDeleteMutation.mutate(selectedMessages)}
              disabled={bulkDeleteMutation.isPending}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Messages</CardTitle>
          <CardDescription>
            Manage contact form submissions from your website visitors.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={currentTab} onValueChange={(v: string) => setCurrentTab(v as any)}>
            <div className="flex justify-between items-center mb-6">
              <TabsList>
                <TabsTrigger value="all">
                  All
                  <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
                </TabsTrigger>
                <TabsTrigger value="unread">
                  Unread
                  <Badge variant="secondary" className="ml-2">{counts.unread}</Badge>
                </TabsTrigger>
                <TabsTrigger value="read">
                  Read
                  <Badge variant="secondary" className="ml-2">{counts.read}</Badge>
                </TabsTrigger>
              </TabsList>
              
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="all">
              {renderMessageTable(filteredMessages)}
            </TabsContent>
            <TabsContent value="unread">
              {renderMessageTable(filteredMessages)}
            </TabsContent>
            <TabsContent value="read">
              {renderMessageTable(filteredMessages)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* View Message Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{currentMessage?.subject || 'Message'}</DialogTitle>
            <DialogDescription>
              From {currentMessage?.name} ({currentMessage?.email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm text-gray-500">
              <div>
                Received on {currentMessage && formatDate(currentMessage.submittedAt)}
              </div>
              <div>
                {currentMessage?.read ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Read
                  </span>
                ) : (
                  <span className="flex items-center text-blue-600">
                    <Mail className="w-4 h-4 mr-1" />
                    Unread
                  </span>
                )}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="whitespace-pre-wrap">
                {currentMessage?.message}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                if (currentMessage?.email) {
                  window.open(`mailto:${currentMessage.email}?subject=Re: ${currentMessage.subject}`);
                }
              }}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Reply via Email
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => {
                setIsViewDialogOpen(false);
                if (currentMessage) {
                  openDeleteDialog(currentMessage);
                }
              }}
            >
              <Trash className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
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
              message from your inbox.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentMessage && deleteMutation.mutate(currentMessage.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
  
  // Helper function to render the message table
  function renderMessageTable(messages: ContactMessage[]) {
    if (isLoading) {
      return (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      );
    }
    
    if (!messages || messages.length === 0) {
      return (
        <div className="text-center py-6">
          <Mail className="w-12 h-12 mx-auto text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">No Messages Found</h3>
          <p className="text-gray-500">
            {searchTerm ? 'No messages match your search criteria.' : 'There are no messages in this category.'}
          </p>
        </div>
      );
    }
    
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={selectedMessages.length > 0 && selectedMessages.length === messages.length} 
                onCheckedChange={handleSelectAll}
              />
            </TableHead>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.id} className={!message.read ? 'font-medium bg-gray-50' : ''}>
              <TableCell>
                <Checkbox 
                  checked={selectedMessages.includes(message.id)} 
                  onCheckedChange={(checked) => handleSelectMessage(message.id, !!checked)}
                />
              </TableCell>
              <TableCell className="font-medium">
                <div>{message.name}</div>
                <div className="text-sm text-gray-500">{message.email}</div>
              </TableCell>
              <TableCell>
                {!message.read && (
                  <Badge variant="default" className="mr-2">New</Badge>
                )}
                {message.subject || '(No Subject)'}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatDate(message.submittedAt)}
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openViewDialog(message)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {!message.read && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => markAsReadMutation.mutate(message.id)}
                      disabled={markAsReadMutation.isPending}
                    >
                      <MailOpen className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openDeleteDialog(message)}
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
}