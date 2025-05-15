"use client";
import { useState } from "react";
import flLogo from "./assets/fl.png";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "@/hooks/use-session";
// import ChartIllustration from "@/assets/chart-illustration.png"; // <-- place your generated image here

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { initializeSession } = useSession();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const serverOrigin = import.meta.env.VITE_SERVER_ORIGIN;
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

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: the login form */}
          <form className="p-6 md:p-8 flex flex-col gap-6" onSubmit={handleLogin}>
            <div className="text-center">
              <h1 className="text-2xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground">Login to your account</p>
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full">
              Login
            </Button>

            <p className="text-center text-sm">
              Don’t have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:underline">
                Sign up
              </a>
            </p>
          </form>

          {/* RIGHT: the illustration */}
          <div className="hidden md:block bg-[#111111] p-8 relative h-full">
            <img
              src={flLogo}
              alt="Fleet Ledger"
              className="w-full h-full object-contain"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
