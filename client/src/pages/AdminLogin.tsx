import React, { useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

export default function AdminLogin() {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation('/admin/dashboard');
    }
  }, [user, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Login | HAL149</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="w-full max-w-md px-4">
          <div className="mb-8 text-center">
            <a href="/" className="inline-block">
              <img src="/hallogoblack480.webp" alt="HAL149" className="h-10 w-auto mx-auto" />
            </a>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>
                Sign in to access the admin dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
