'use client';

import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
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
  Input,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Skeleton
} from '@/components/ui';
import { 
  Plus, 
  Trash, 
  UserPlus,
  DownloadCloud,
  Search
} from 'lucide-react';
import { formatDate } from '@/shared/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Define schema for waitlist form
const waitlistSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

type WaitlistEntry = {
  id: number;
  email: string;
  submittedAt: string;
};

export default function AdminWaitlist() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentEntryId, setCurrentEntryId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Query to fetch waitlist entries
  const { data: waitlistEntries, isLoading } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
  });
  
  // Form setup
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: ''
    }
  });
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add to waitlist');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
      toast({
        title: "Added to waitlist",
        description: "The email has been added to the waitlist successfully"
      });
      resetForm();
      setIsDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add to waitlist",
        variant: "destructive"
      });
    }
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/waitlist/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to remove from waitlist');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waitlist'] });
      toast({
        title: "Removed from waitlist",
        description: "The email has been removed from the waitlist successfully"
      });
      setIsDeleteDialogOpen(false);
      setCurrentEntryId(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove from waitlist",
        variant: "destructive"
      });
    }
  });
  
  // Reset form
  const resetForm = () => {
    form.reset({
      email: ''
    });
  };
  
  // Open dialog to add a new entry
  const openAddDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };
  
  // Open dialog to confirm deletion
  const openDeleteDialog = (id: number) => {
    setCurrentEntryId(id);
    setIsDeleteDialogOpen(true);
  };
  
  // Handle form submission
  const onSubmit = (values: WaitlistFormValues) => {
    createMutation.mutate(values);
  };
  
  // Export waitlist as CSV
  const exportToCSV = () => {
    if (!waitlistEntries || waitlistEntries.length === 0) {
      toast({
        title: "No data to export",
        description: "The waitlist is empty",
        variant: "destructive"
      });
      return;
    }
    
    // Create CSV content
    const headers = ['Email', 'Submitted At'];
    const csvContent = [
      headers.join(','),
      ...waitlistEntries.map(entry => 
        `${entry.email},${new Date(entry.submittedAt).toISOString()}`
      )
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `waitlist_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export successful",
      description: "Waitlist has been exported as CSV"
    });
  };
  
  // Filter entries based on search term
  const filteredEntries = waitlistEntries?.filter(entry => 
    entry.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Waitlist</h1>
        <div className="flex gap-2">
          <Button onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Email
          </Button>
          <Button variant="outline" onClick={exportToCSV}>
            <DownloadCloud className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Waitlist Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search emails..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ml-4 text-sm text-gray-500">
              {filteredEntries?.length || 0} entries
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : filteredEntries && filteredEntries.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Submitted At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">
                      {entry.email}
                    </TableCell>
                    <TableCell>
                      {formatDate(entry.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openDeleteDialog(entry.id)}
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6">
              <UserPlus className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <h3 className="text-lg font-medium">No Waitlist Entries</h3>
              <p className="text-gray-500 mb-4">
                There are no entries in the waitlist yet.
              </p>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Email
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to Waitlist</DialogTitle>
            <DialogDescription>
              Add a new email to the waitlist.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="user@example.com" 
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
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Adding...' : 'Add to Waitlist'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
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
              This action cannot be undone. This will permanently remove the
              email from the waitlist.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => currentEntryId && deleteMutation.mutate(currentEntryId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Removing...' : 'Remove'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}