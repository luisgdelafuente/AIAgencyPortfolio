import { AdminMetadata } from "@/components/AdminMetadata";
import { Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function AuthPage() {
  const { user, loginMutation } = useAuth();
  const { toast } = useToast();

  // Login form setup
  const loginForm = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onLoginSubmit = (values: LoginValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => {
        toast({
          title: "Login successful",
          description: "Welcome to the admin dashboard",
        });
      },
    });
  };

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/admin/dashboard" />;
  }

  return (
    <>
      <AdminMetadata
        title="Admin Login | HAL149 AI Agency" 
        description="Admin login page for HAL149 AI Agency"
        noIndex={true}
      />

      <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <a href="/" className="inline-block">
              <img src="/hallogoblack480.webp" alt="HAL149" className="h-10 sm:h-12 w-auto mx-auto" />
            </a>
          </div>
          <Card className="shadow-md w-full">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Admin Login</h2>
            </CardHeader>
            <CardContent>
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="admin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}