import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const SetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [role, setRole] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Extract token, role, and name from URL query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setToken(params.get("token") || "");
    setRole(params.get("role") || "");
    setName(params.get("name") || "");
  }, [location.search]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.REACT_APP_API_URL}/auth/set-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, role, password }),
        }
      );
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        toast({
          title: "Password Set",
          description: data.message,
        });
        navigate("/login");
      } else if (response.status === 410) {
        toast({
          title: "Link Expired",
          description: data.message || "This link has already been used. Please login.",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: data.message || "Could not set password.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordsMatch = password && confirmPassword && password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Dear {name || "User"}, your email is successfully verified.
            </h1>
            <p className="text-gray-600">Set up your password to continue.</p>
          </div>
          <form onSubmit={handleSetPassword} className="space-y-6">
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={!passwordsMatch || loading}
            >
              {loading ? "Setting..." : "Set Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SetPassword;