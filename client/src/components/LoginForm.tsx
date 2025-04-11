import React, { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AuthContext, AuthContextType } from '@/App';
import { useLocation } from 'wouter';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const auth = useContext(AuthContext) as AuthContextType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast({
        title: "Missing fields",
        description: "Please enter both username and password",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoggingIn(true);
      await auth.login(username, password);
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard"
      });
      setLocation('/admin/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Invalid username or password",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input 
          id="username" 
          type="text" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoggingIn}>
        {isLoggingIn ? "Logging in..." : "Login"}
      </Button>
      <div className="text-center text-sm text-neutral-500">
        <p>Default credentials: admin / admin123</p>
      </div>
    </form>
  );
}
