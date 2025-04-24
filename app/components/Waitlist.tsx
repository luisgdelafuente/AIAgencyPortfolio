'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useCustomToast as useToast } from './Providers';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { apiPost } from '@/lib/api';

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email address")
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export default function Waitlist() {
  const { toast } = useToast();
  
  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: ''
    }
  });

  const waitlistMutation = useMutation({
    mutationFn: async (data: WaitlistFormValues) => {
      return apiPost("/api/waitlist", data);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have been added to our waitlist.",
        variant: "default"
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Something went wrong.",
        description: error instanceof Error ? error.message : "Failed to join waitlist. Please try again.",
        variant: "destructive"
      });
    }
  });

  function onSubmit(data: WaitlistFormValues) {
    waitlistMutation.mutate(data);
  }

  return (
    <section id="waitlist" className="py-12 md:py-16 bg-white">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Join the Waitlist
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Be the first to experience the future of AI. Sign up for early access.
          </p>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-grow max-w-md">
                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-left text-red-500 text-xs mt-1" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  disabled={waitlistMutation.isPending}
                >
                  {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                By signing up, you agree to our <Link href="/legal" className="underline hover:text-gray-700">Privacy Policy</Link>
              </p>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}