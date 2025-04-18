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
import AuthPage from "@/pages/auth-page";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProjects from "@/pages/AdminProjects";
import AdminBlog from "@/pages/AdminBlog";
import AdminWaitlist from "@/pages/AdminWaitlist";
import AdminContent from "@/pages/AdminContent";
import AdminMessages from "@/pages/AdminMessages";
import AdminSettings from "@/pages/AdminSettings";
import React, { useEffect } from "react";
import { AuthProvider } from "@/hooks/use-auth";
import { LanguageProvider } from "@/hooks/use-language";
import { TranslationProvider } from "@/hooks/use-translations";
import { ProtectedRoute } from "./lib/protected-route";
import { applyMetadata } from "./lib/direct-metadata";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/projects/" component={Projects} />
      <Route path="/projects/:slug/" component={ProjectDetail} />
      <Route path="/blog/" component={Blog} />
      <Route path="/blog/:slug/" component={BlogPost} />
      <Route path="/about/" component={About} />
      <Route path="/contact/" component={Contact} />
      <Route path="/legal/" component={Legal} />
      <Route path="/admin/" component={AuthPage} />
      <ProtectedRoute path="/admin/dashboard/" component={AdminDashboard} />
      <ProtectedRoute path="/admin/projects/" component={AdminProjects} />
      <ProtectedRoute path="/admin/blog/" component={AdminBlog} />
      <ProtectedRoute path="/admin/content/" component={AdminContent} />
      <ProtectedRoute path="/admin/waitlist/" component={AdminWaitlist} />
      <ProtectedRoute path="/admin/messages/" component={AdminMessages} />
      <ProtectedRoute path="/admin/settings/" component={AdminSettings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Apply metadata on page load and when URL changes
  useEffect(() => {
    // Apply metadata on initial load
    applyMetadata();
    
    // Create a new URL listener
    const handleURLChange = () => {
      console.log("URL changed, updating metadata");
      setTimeout(applyMetadata, 100); // Small delay to ensure everything is ready
    };
    
    // Add event listener
    window.addEventListener('popstate', handleURLChange);
    
    // Clean up
    return () => {
      window.removeEventListener('popstate', handleURLChange);
    };
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TranslationProvider>
          <AuthProvider>
            <Router />
            <Toaster />
          </AuthProvider>
        </TranslationProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
