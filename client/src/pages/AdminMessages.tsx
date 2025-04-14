import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import AdminNav from '@/components/AdminNav';
import { Helmet } from 'react-helmet';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Eye, Calendar } from 'lucide-react';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

export default function AdminMessages() {
  const { toast } = useToast();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const queryClient = useQueryClient();

  // Fetch contact messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/contact'],
    queryFn: async () => {
      const response = await fetch('/api/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch contact messages');
      }
      return response.json() as Promise<ContactMessage[]>;
    },
  });

  // Mark message as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/contact/${id}/read`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Failed to mark message as read');
      }
      return response.json();
    },
    onSuccess: () => {
      // Invalidate cache to refetch messages
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: 'Success',
        description: 'Message marked as read',
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to mark message as read',
      });
    },
  });

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    
    // If message is unread, mark it as read
    if (!message.read) {
      markAsReadMutation.mutate(message.id);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Contact Messages | Admin</title>
      </Helmet>
      
      <AdminNav />
      
      <main className="container mx-auto px-4 py-10 pt-32">
        <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>View and manage contact form submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="py-8 text-center">No messages received yet.</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {messages.map((message) => (
                    <TableRow key={message.id}>
                      <TableCell>
                        {message.read ? (
                          <Badge variant="outline">Read</Badge>
                        ) : (
                          <Badge>New</Badge>
                        )}
                      </TableCell>
                      <TableCell>{message.name}</TableCell>
                      <TableCell>{message.subject}</TableCell>
                      <TableCell>{formatDate(message.submittedAt)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleViewMessage(message)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
        
        {/* Message detail dialog */}
        <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
          {selectedMessage && (
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  From {selectedMessage.name} ({selectedMessage.email})
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedMessage.submittedAt)}</span>
              </div>
              
              <div className="mt-4 border p-4 rounded-md bg-gray-50">
                <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
              </div>
              
              <DialogFooter className="mt-6">
                <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                  Close
                </Button>
                <Button onClick={() => window.location.href = `mailto:${selectedMessage.email}`}>
                  <Mail className="h-4 w-4 mr-2" />
                  Reply by Email
                </Button>
              </DialogFooter>
            </DialogContent>
          )}
        </Dialog>
      </main>
    </div>
  );
}