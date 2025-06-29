import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const VerifyEmail = () => {
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token and role from URL
  useEffect(() => {
    // URL: /verify-email/:token/:role
    const pathParts = location.pathname.split('/');
    // ['', 'verify-email', 'token', 'role']
    if (pathParts.length >= 4) {
      setToken(pathParts[2]);
      setRole(pathParts[3]);
    }
  }, [location.pathname]);

  console.log('From Verification Page')
  console.log(role)
  console.log(token)

  const handleVerify = async () => {
    if (!token || !role) {
      toast({
        title: "Invalid Link",
        description: "Verification link is invalid.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/auth/verify-Email/${token}/${role}`,
        {
          method: 'POST',
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Email Verified",
          description: data.message || "Your email has been verified.",
        });
        navigate('/login');
      } else {
        toast({
          title: "Verification Failed",
          description: data.message || "Could not verify email.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to connect to server.",
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
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h1>
            <p className="text-gray-600">Do you want to verify your email?</p>
          </div>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleVerify}
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;