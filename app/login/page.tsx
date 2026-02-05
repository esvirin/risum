"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Chrome, Facebook, Apple } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSocialLogin = (provider: string) => {
    setLoading(provider);
    signIn(provider, { callbackUrl: "/cabinet" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-muted/20">
      <Card className="w-full max-w-md shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-3xl font-extrabold tracking-tight">Fitness Space</CardTitle>
          <CardDescription className="text-base">
            Sign in to access your personal cabinet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 py-6 text-base font-medium transition-all hover:bg-muted"
            onClick={() => handleSocialLogin("google")}
            disabled={!!loading}
          >
            <Chrome className="w-5 h-5 text-[#4285F4]" />
            {loading === "google" ? "Connecting..." : "Continue with Google"}
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 py-6 text-base font-medium transition-all hover:bg-muted"
            onClick={() => handleSocialLogin("facebook")}
            disabled={!!loading}
          >
            <Facebook className="w-5 h-5 text-[#1877F2]" />
            {loading === "facebook" ? "Connecting..." : "Continue with Facebook"}
          </Button>

          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-3 py-6 text-base font-medium transition-all hover:bg-muted"
            onClick={() => handleSocialLogin("apple")}
            disabled={!!loading}
          >
            <Apple className="w-5 h-5" />
            {loading === "apple" ? "Connecting..." : "Continue with Apple"}
          </Button>

          <div className="pt-6 text-center">
            <p className="text-xs text-muted-foreground px-8">
              By continuing, you agree to our Terms of Service and Privacy Policy.
              Your account will be automatically linked to your studio membership.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

