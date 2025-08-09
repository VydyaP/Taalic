import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/auth/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Triangle } from "lucide-react";

export default function Login() {
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 flex items-center justify-center p-6">
      <Card className="w-full max-w-md shadow-xl border-border/60">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Triangle className="h-6 w-6 text-primary rotate-180" />
          </div>
          <CardTitle className="text-2xl">Raga Rhythm</CardTitle>
          <p className="text-sm text-muted-foreground">Sign in to continue</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={signInWithGoogle} className="w-full flex items-center justify-center gap-2" variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.6 32.5 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c10.4 0 19-8.4 19-19 0-1.3-.1-2.2-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.8 16 19 14 24 14c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16 4 9 8.6 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 36.5 26.8 37.5 24 37.5c-5.3 0-9.6-3.5-11.2-8.3l-6.5 5C9 39.9 16 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.3 3.7-4.7 6.5-8.6 6.5-5.3 0-9.6-3.5-11.2-8.3l-6.5 5C9 39.9 16 44 24 44c10.4 0 19-8.4 19-19 0-1.3-.1-2.2-.4-3.5z"/>
            </svg>
            Continue with Google
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our terms and acknowledge our privacy policy.
          </p>
        </CardContent>
      </Card>
    </div>
  );
} 