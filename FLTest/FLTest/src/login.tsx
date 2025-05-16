"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { initializeSession } = useSession();
  const serverOrigin = import.meta.env.VITE_SERVER_ORIGIN;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${serverOrigin}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      initializeSession({ email, role: data.role, token: data.token });
    } catch (err: any) {
      setError(err.message);
    }
  };
  
  const handleGoogleLogin = async (credentialResponse: any) => {
    setError("");
    try {
      console.log('Google response:', credentialResponse);
      // Send the ID token to your backend
      const res = await fetch(`${serverOrigin}/auth/google/verify`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        credentials: 'include',
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      
      console.log('Backend response status:', res.status);
      const data = await res.json();
      console.log('Backend response data:', data);
      
      if (!res.ok) throw new Error(data.message || "Google login failed");
      
      // Initialize session with Google login data
      initializeSession({ 
        email: data.user.email, 
        role: data.role, 
        token: data.token
      });
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message);
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className={cn("w-full max-w-md shadow-lg", className)} {...props}>
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  Fleet Ledger
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sign in to manage your fleet
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 dark:bg-red-900/20 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center">
                    {error}
                  </p>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full py-2"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  Sign in
                </Button>
                
                {/* Google Login Button */}
                <div className="mt-4 flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => {
                      console.error('Google login error occurred');
                      setError("Google login failed. Please try again.");
                    }}
                    useOneTap
                  />
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <a 
                      href="/signup" 
                      className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Create one
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </GoogleOAuthProvider>
  );
}
