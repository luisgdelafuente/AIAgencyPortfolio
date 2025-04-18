"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

interface User {
  id: number;
  username: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{success: boolean, message: string}>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(initialState);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/check", {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      setState({
        isAuthenticated: data.authenticated,
        user: data.user || null,
        isLoading: false
      });
      
      return data.authenticated;
    } catch (error) {
      console.error("Error checking authentication:", error);
      setState({
        ...state,
        isLoading: false
      });
      return false;
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{success: boolean, message: string}> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        setState({
          isAuthenticated: true,
          user: data.user,
          isLoading: false
        });
        return { success: true, message: "Login successful" };
      } else {
        return { success: false, message: data.message || "Login failed" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "An error occurred during login" };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      setState({
        isAuthenticated: false,
        user: null,
        isLoading: false
      });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}