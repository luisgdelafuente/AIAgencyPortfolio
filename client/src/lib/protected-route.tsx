import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

type ComponentType = () => JSX.Element;

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: ComponentType;
}) {
  const { user, isLoading } = useAuth();

  // Wrapper component for loading state
  const LoadingWrapper = () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-border" />
    </div>
  );

  // Wrapper component for redirect
  const RedirectWrapper = () => <Redirect to="/admin" />;

  if (isLoading) {
    return <Route path={path} component={LoadingWrapper} />;
  }

  if (!user) {
    return <Route path={path} component={RedirectWrapper} />;
  }

  return <Route path={path} component={Component} />;
}