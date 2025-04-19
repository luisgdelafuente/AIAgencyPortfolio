'use client';

import React, { useMemo, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useQuery } from '@tanstack/react-query';
import { PageContent, InsertContactMessage } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';
import MetaTags from '@/components/MetaTags';
import { extractMetadata } from '@/lib/metadata';
import { marked } from 'marked';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { insertContactMessageSchema } from '@shared/schema';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Extend the schema with additional validation
const contactFormSchema = insertContactMessageSchema.extend({
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Fetch page content including metadata
  const { data: pageContent, isLoading } = useQuery<PageContent>({
    queryKey: ['/api/page-contents/contact'],
  });

  // Extract metadata with inheritance
  const metadata = extractMetadata(pageContent);
  
  // Parse the JSON content
  const content = useMemo(() => {
    if (!pageContent?.content) return {};
    
    try {
      return typeof pageContent.content === 'string'
        ? JSON.parse(pageContent.content)
        : pageContent.content;
    } catch (error) {
      console.error('Error parsing contact page content JSON:', error);
      return {};
    }
  }, [pageContent]);

  // Define form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
  });

  // Handle form submission
  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      await apiRequest('/api/contact', 'POST', values);
      toast({
        title: 'Message Sent',
        description: 'Thank you for your message. We\'ll get back to you soon.',
      });
      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: 'Error',
        description: 'There was a problem sending your message. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state with skeletons
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <Skeleton className="h-12 w-1/3 mx-auto" />
              <Skeleton className="h-6 w-2/3 mx-auto mt-4" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              <Card>
                <CardHeader>
                  <Skeleton className="h-7 w-1/2" />
                  <Skeleton className="h-5 w-3/4" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/4" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-1/4" />
                      <Skeleton className="h-24 w-full" />
                    </div>
                    <Skeleton className="h-10 w-1/4" />
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Skeleton className="h-7 w-1/2" />
                <div className="space-y-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-7 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <MetaTags 
        metadata={metadata} 
        url="https://hal149.com/contact/"
      />
      
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10 text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                {content.contactTitle || 'Contact Us'}
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {content.contactSubtitle || 'Have questions or want to work with us? Get in touch!'}
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-10">
              {/* Contact Form */}
              <Card>
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!isSubmitted ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Your name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="your.email@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject</FormLabel>
                              <FormControl>
                                <Input placeholder="What is this regarding?" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Message</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Tell us how we can help..." 
                                  className="h-32 resize-none"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button 
                          type="submit" 
                          className="w-full sm:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? 'Sending...' : 'Send Message'}
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <div className="text-center py-10">
                      <h3 className="text-xl font-medium text-gray-900 mb-2">Thank you!</h3>
                      <p className="text-gray-600">
                        Your message has been sent. We'll get back to you as soon as possible.
                      </p>
                      <Button 
                        className="mt-6"
                        onClick={() => setIsSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Contact Info */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Contact Information</h2>
                
                {content.contactInfo && (
                  <div 
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ 
                      __html: marked.parse(content.contactInfo)
                    }}
                  />
                )}
                
                {/* Office Hours */}
                {content.officeHours && (
                  <div>
                    <h3 className="text-xl font-medium mb-2">Office Hours</h3>
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: marked.parse(content.officeHours)
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}