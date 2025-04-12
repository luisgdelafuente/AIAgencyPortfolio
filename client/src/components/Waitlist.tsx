import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Link } from 'wouter';

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
      const res = await apiRequest("POST", "/api/waitlist", data);
      return res.json();
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
    <section id="waitlist" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Join the Waitlist</h2>
        <p className="text-gray-600 text-sm max-w-xl mx-auto mb-8">
          Be the first to experience the future of AI. Sign up for early access.
        </p>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input
                        placeholder="Enter your email"
                        className="px-3 py-2 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-black"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-left text-red-500 text-xs mt-1" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 rounded"
                disabled={waitlistMutation.isPending}
              >
                {waitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              By signing up, you agree to our <Link href="/legal" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link>.
            </p>
          </form>
        </Form>
      </div>
    </section>
  );
}
