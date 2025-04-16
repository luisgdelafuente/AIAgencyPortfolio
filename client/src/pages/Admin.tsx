import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';
import LoginForm from '@/components/LoginForm';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';

/**
 * Admin page component
 * Serves as the entry point for the admin area
 * Redirects to dashboard if authenticated or shows login form if not
 */
export default function Admin() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (user) {
      setLocation('/admin/dashboard');
    }
  }, [user, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-center text-neutral-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin | HAL149</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="Admin area for HAL149 - AI solutions" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-full max-w-md px-4">
          <div className="mb-8 text-center">
            <a href="/" className="inline-block">
              <svg className="h-10 w-auto mx-auto" viewBox="0 0 120 40" fill="currentColor">
                <path d="M30,10 L30,30 M10,10 L10,30 M10,20 L30,20 M40,10 Q50,10 50,20 Q50,30 40,30" stroke="currentColor" strokeWidth="4" fill="none" />
                <text x="60" y="25" fontFamily="Arial" fontSize="15" fontWeight="bold">HAL149</text>
              </svg>
            </a>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Admin Login</CardTitle>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
          
          <p className="mt-4 text-center text-sm text-neutral-500">
            <a href="/" className="underline hover:text-neutral-800">Return to website</a>
          </p>
        </div>
      </div>
    </>
  );
}
