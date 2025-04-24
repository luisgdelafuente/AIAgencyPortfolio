import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Mail, Phone } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { PageContent } from '@shared/schema';
import { extractMetadata } from '@/lib/metadata';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactContent {
  title?: string;
  subtitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  formTitle?: string;
  [key: string]: any; // Allow for metadata and other fields
}

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch page content including metadata
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/contact'],
  });
  
  // Extract metadata with inheritance
  const metadata = extractMetadata(pageContent);
  
  // Parse the JSON content
  let content: ContactContent = {};
  if (pageContent?.content) {
    try {
      content = typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
    } catch (error) {
      console.error('Error parsing contact content JSON:', error);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        toast({
          title: 'Message sent',
          description: 'We\'ve received your message and will get back to you soon!',
        });
        
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error instanceof Error 
          ? error.message 
          : 'There was a problem sending your message. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MetaTags 
        metadata={metadata}
        url="https://hal149.com/contact/"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-grow pt-28">
          <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-12 bg-gray-200 rounded mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-12"></div>
              </div>
            ) : (
              <div className="mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-6">
                  {content.title || ''}
                </h1>
                <p className="text-lg text-gray-600">
                  {content.subtitle || ''}
                </p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="md:col-span-1">
                <div className="space-y-8">
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <MapPin className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Address</h3>
                          <p className="text-gray-600 text-sm">
                            {isLoading ? (
                              <Skeleton className="h-12 w-full" />
                            ) : content.address ? (
                              content.address.split('\n').map((line: string, i: number) => (
                                <React.Fragment key={i}>
                                  {line}
                                  <br />
                                </React.Fragment>
                              ))
                            ) : (
                              ''
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Mail className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Email</h3>
                          <p className="text-gray-600 text-sm">
                            {isLoading ? (
                              <Skeleton className="h-4 w-32" />
                            ) : (
                              content.email || ''
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="bg-gray-100 p-2 rounded-full">
                          <Phone className="h-5 w-5 text-gray-700" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">Phone</h3>
                          <p className="text-gray-600 text-sm">
                            {isLoading ? (
                              <Skeleton className="h-4 w-32" />
                            ) : (
                              content.phone || ''
                            )}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-gray-900">
                      {isLoading ? (
                        <Skeleton className="h-6 w-40" />
                      ) : (
                        content.formTitle || 'Send us a message'
                      )}
                    </CardTitle>
                    <CardDescription className="text-gray-600">
                      Fill out the form below and we'll get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-gray-700">Name</Label>
                          <Input 
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-gray-700">Email</Label>
                          <Input 
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                        <Input 
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-gray-700">Message</Label>
                        <Textarea 
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          className="border-gray-300 focus:border-gray-400 focus:ring-gray-400"
                          rows={6}
                          required
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-black hover:bg-gray-900 text-white py-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}