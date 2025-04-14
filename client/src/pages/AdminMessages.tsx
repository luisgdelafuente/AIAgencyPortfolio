import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Loader2, CheckCircle } from 'lucide-react';
import AdminNav from '@/components/AdminNav';
import { apiRequest } from '@/lib/queryClient';
interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
  read: boolean;
}

function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export default function AdminMessages() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const queryClient = useQueryClient();

  const { data: messages = [] as ContactMessage[], isLoading, error } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact'],
    enabled: true,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/contact/${id}/read`, 'POST');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact'] });
      toast({
        title: 'Message updated',
        description: 'Message marked as read',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to update message status',
        variant: 'destructive',
      });
    },
  });

  const handleMarkAsRead = (id: number) => {
    markAsReadMutation.mutate(id);
  };

  const handleViewDetails = (message: ContactMessage) => {
    setSelectedMessage(message);
  };

  return (
    <div className="min-h-screen bg-neutral-50/50 flex">
      <AdminNav />
      <div className="flex-1 p-6 lg:pl-72">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Contact Messages</h1>
              <p className="text-neutral-500">Manage and respond to contact form submissions</p>
            </div>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  All Messages
                </div>
              </CardTitle>
              <CardDescription>
                {messages.length} {messages.length === 1 ? 'message' : 'messages'} received from the contact form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-neutral-400" />
                </div>
              ) : error ? (
                <div className="text-center py-8 text-neutral-500">
                  Error loading messages. Please try again.
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  No messages received yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Status</TableHead>
                      <TableHead>From</TableHead>
                      <TableHead>Subject</TableHead>
                      <TableHead className="w-36">Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {messages.map((message: ContactMessage) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          {message.read ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Badge variant="default">New</Badge>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          <div>{message.name}</div>
                          <div className="text-sm text-neutral-500">{message.email}</div>
                        </TableCell>
                        <TableCell>{message.subject}</TableCell>
                        <TableCell className="text-neutral-500 text-sm">
                          {formatDate(message.submittedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewDetails(message)}
                          >
                            View
                          </Button>
                          {!message.read && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="ml-2"
                              onClick={() => handleMarkAsRead(message.id)}
                              disabled={markAsReadMutation.isPending}
                            >
                              {markAsReadMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                'Mark as Read'
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Message detail dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedMessage?.subject}</DialogTitle>
            <DialogDescription className="flex justify-between text-sm">
              <span>From: {selectedMessage?.name} ({selectedMessage?.email})</span>
              <span>{selectedMessage && formatDate(selectedMessage.submittedAt)}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-80 overflow-y-auto">
            <div className="whitespace-pre-wrap bg-neutral-50 p-4 rounded-md">
              {selectedMessage?.message}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => setSelectedMessage(null)}
            >
              Close
            </Button>
            {selectedMessage && !selectedMessage.read && (
              <Button
                onClick={() => {
                  if (selectedMessage) {
                    handleMarkAsRead(selectedMessage.id);
                    setSelectedMessage(null);
                  }
                }}
                disabled={markAsReadMutation.isPending}
              >
                {markAsReadMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Mark as Read
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}