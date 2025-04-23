'use client';

import React, { useState } from 'react';
import { Button, Input } from '../components/ui';
import { useToast } from '@/components/providers/toast-provider';

export default function Waitlist() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive'
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
      
      if (!response.ok) {
        throw new Error('Failed to join waitlist');
      }
      
      setSubmitted(true);
      setEmail('');
      toast({
        title: 'Success!',
        description: 'You have been added to our waitlist. We\'ll notify you when we launch!',
      });
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Failed to join waitlist. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <section id="waitlist" className="py-20 bg-gray-900">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            Join Our Waitlist
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Be the first to get access to our AI-powered solutions when we launch.
          </p>
          
          {submitted ? (
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-2">Thank you for joining!</h3>
              <p className="text-gray-300">
                We've added you to our waitlist and will notify you when we launch.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-white text-gray-900 hover:bg-gray-100"
              >
                {isSubmitting ? 'Joining...' : 'Join Waitlist'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}