'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';

// User type based on your existing schema
interface User {
  id: number;
  username: string;
}

// Auth context type
interface AuthContextType {
  user: User | null;
  authenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

// Default context
const defaultContext: AuthContextType = {
  user: null,
  authenticated: false,
  loading: true,
  login: async () => false,
  logout: async () => {},
};

// Create context
export const AuthContext = createContext<AuthContextType>(defaultContext);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        
        if (data.authenticated) {
          setUser(data.user);
          setAuthenticated(true);
        } else {
          setUser(null);
          setAuthenticated(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
        setAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        setAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      setUser(null);
      setAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    authenticated,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};