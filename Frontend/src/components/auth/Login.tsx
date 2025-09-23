import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from "@/context/ProfileContext";
import { useNotifications } from "@/context/NotificationContext";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setProfile } = useProfile(); // <-- add this
  const { addNotification } = useNotifications();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.REACT_APP_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Object.entries(data.user).forEach(([key, value]) => {
          localStorage.setItem(key, String(value));
        });
        localStorage.setItem('token', data.token);
        
        toast({
          title: "Login Successful",
          description: `Welcome back, ${data.user.name}!`,
        });

        // Add notification for successful login
        addNotification({
          title: 'Welcome Back!',
          message: `Successfully logged in as ${data.user.name}`,
          type: 'success'
        });
        
        setProfile(null); // <-- Reset context after login

        // Optionally, fetch profile here or let ProfilePage/Header do it
        navigate('/home/dashboard');
      } else if (response.status === 401) {
        toast({
          title: "Unauthorized",
          description: data.msg || "Please verify your email before logging in.",
          variant: "destructive",
        });

        // Add notification for unauthorized access
        addNotification({
          title: 'Login Failed',
          message: 'Email verification required. Please check your email.',
          type: 'warning'
        });
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });

        // Add notification for login failure
        addNotification({
          title: 'Authentication Error',
          message: 'Invalid email or password. Please try again.',
          type: 'error'
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing App</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="mt-1"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
