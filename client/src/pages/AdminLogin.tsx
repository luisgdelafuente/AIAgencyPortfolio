import React, { useContext, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/LoginForm';
import { AuthContext, AuthContextType } from '@/App';
import { useLocation } from 'wouter';

export default function AdminLogin() {
  const auth = useContext(AuthContext) as AuthContextType;
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (auth.user) {
      setLocation('/admin/dashboard');
    }
  }, [auth.user, setLocation]);

  if (auth.isLoading) {
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
              <svg className="h-10 w-auto mx-auto" viewBox="0 0 120 40" fill="currentColor">
                <path d="M30,10 L30,30 M10,10 L10,30 M10,20 L30,20 M40,10 Q50,10 50,20 Q50,30 40,30" stroke="currentColor" strokeWidth="4" fill="none" />
                <text x="60" y="25" fontFamily="Arial" fontSize="15" fontWeight="bold">HAL149</text>
              </svg>
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
