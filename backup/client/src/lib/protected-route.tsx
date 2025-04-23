import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";

// Make the component type more flexible to handle null returns
type ComponentType = React.ComponentType<any>;

export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: ComponentType;
}) {
  const { user, isLoading } = useAuth();

  return (
    <Route path={path}>
      {() => {
        if (isLoading) {
          return (
            <div className="flex items-center justify-center min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-border" />
            </div>
          );
        }

        if (!user) {
          return <Redirect to="/admin" />;
        }

        return <Component />;
      }}
    </Route>
  );
}