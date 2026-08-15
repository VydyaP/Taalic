import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Music, Loader2 } from "lucide-react";

export default function Login() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-warm opacity-20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-mystical opacity-20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-divine opacity-10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full shadow-2xl border-0 bg-card/80 backdrop-blur-xl">
          <CardHeader className="space-y-6 text-center pb-8">
            {/* Logo and branding */}
            <div className="space-y-4">
              <div className="mx-auto h-20 w-20 rounded-full bg-gradient-warm flex items-center justify-center shadow-elegant">
                <Music className="h-10 w-10 text-primary-foreground" />
              </div>
              <div className="space-y-2">
                <CardTitle className="font-display text-3xl font-bold text-foreground">
                  Keerthana Collection
                </CardTitle>
                <p className="text-lg text-muted-foreground font-medium">Your personal Carnatic music archive</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-8 pb-8">
            {/* Sign in button */}
            <Button
              onClick={handleSignIn}
              disabled={isSigningIn}
              className="w-full h-12 font-semibold shadow-elegant transition-smooth hover:-translate-y-0.5"
              variant="default"
            >
              {isSigningIn ? (
                <Loader2 className="h-5 w-5 mr-3 animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5 mr-3">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19-8.4 19-19 0-1.3-.1-2.2-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16 19 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16 4 9 8.6 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 36.5 26.8 37.5 24 37.5c-5.3 0-9.6-3.5-11.2-8.3l-6.5 5C9 39.9 16 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.7-4.7 6.5-8.6 6.5-5.3 0-9.6-3.5-11.2-8.3l-6.5 5C9 39.9 16 44 24 44c10.4 0 19-8.4 19-19 0-1.3-.1-2.2-.4-3.5z" />
                </svg>
              )}
              {isSigningIn ? "Signing in..." : "Continue with Google"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
