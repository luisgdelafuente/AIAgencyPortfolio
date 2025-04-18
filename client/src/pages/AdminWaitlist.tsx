import React from 'react';
import { Helmet } from "react-helmet";
import AdminNav from '@/components/AdminNav';
import { useAuth } from '@/hooks/use-auth';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
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
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Download, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '@shared/utils';
import type { WaitlistEntry } from '@shared/schema';

export default function AdminWaitlist() {
  const { user, isLoading: authLoading } = useAuth();

  const { data: waitlistEntries, isLoading } = useQuery<WaitlistEntry[]>({
    queryKey: ['/api/waitlist'],
    enabled: !!user
  });
  
  const exportToCSV = () => {
    if (!waitlistEntries || waitlistEntries.length === 0) return;
    
    // Create CSV content
    const headers = ['Email', 'Date Joined'];
    const csvContent = [
      headers.join(','),
      ...waitlistEntries.map(entry => 
        [
          entry.email,
          new Date(entry.submittedAt).toLocaleDateString()
        ].join(',')
      )
    ].join('\n');
    
    // Create and download CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `hal149-waitlist-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
        <title>Waitlist Subscribers | HAL149 Admin</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-neutral-50">
        <AdminNav />
        
        <div className="lg:ml-64 h-full">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold">Waitlist Subscribers</h1>
              {waitlistEntries && waitlistEntries.length > 0 && (
                <Button onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" /> Export to CSV
                </Button>
              )}
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  People who have signed up for your waitlist.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {isLoading ? <Skeleton className="h-8 w-20 inline-block" /> : waitlistEntries?.length || 0}
                </div>
                <p className="text-neutral-500">Total subscribers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Subscribers</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-4 w-[300px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    ))}
                  </div>
                ) : waitlistEntries && waitlistEntries.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Date Joined</TableHead>
                        <TableHead className="w-[100px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {waitlistEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.email}</TableCell>
                          <TableCell>{formatDate(entry.submittedAt)}</TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              asChild
                            >
                              <a 
                                href={`mailto:${entry.email}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Mail className="h-4 w-4" />
                                <span className="sr-only">Email</span>
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 mx-auto mb-4 text-neutral-400" />
                    <h3 className="text-lg font-medium mb-2">No subscribers yet</h3>
                    <p className="text-neutral-500">
                      Once people start joining your waitlist, they will appear here.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
