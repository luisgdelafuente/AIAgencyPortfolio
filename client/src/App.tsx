import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Projects from "@/pages/Projects";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import ProjectDetail from "@/pages/ProjectDetail";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Legal from "@/pages/Legal";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProjects from "@/pages/AdminProjects";
import AdminBlog from "@/pages/AdminBlog";
import AdminWaitlist from "@/pages/AdminWaitlist";
import React, { useEffect, useState } from "react";
import { apiRequest } from "./lib/queryClient";

type User = {
  id: number;
  username: string;
};

export type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  checkAuth: () => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = React.createContext<AuthContextType | null>(null);

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const res = await apiRequest("GET", "/api/auth/check", undefined);
      const data = await res.json();
      if (data.authenticated) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const res = await apiRequest("POST", "/api/login", { username, password });
    const data = await res.json();
    setUser(data.user);
  };

  const logout = async () => {
    await apiRequest("POST", "/api/logout", undefined);
    setUser(null);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const authContext = {
    user,
    isLoading,
    checkAuth,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContext}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/projects" component={Projects} />
        <Route path="/projects/:slug" component={ProjectDetail} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/legal" component={Legal} />
        <Route path="/admin" component={AdminLogin} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/projects" component={AdminProjects} />
        <Route path="/admin/blog" component={AdminBlog} />
        <Route path="/admin/waitlist" component={AdminWaitlist} />
        <Route component={NotFound} />
      </Switch>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
