import { LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

function initials(user: { displayName?: string | null; email?: string | null }) {
  const source = user.displayName || user.email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase() || "?";
}

export default function AccountPage() {
  const { signOutUser, user } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div className="max-w-lg space-y-8">
      <div>
        <p className="label-caps">Your space</p>
        <h1 className="font-display text-4xl font-bold text-foreground mt-1">Settings</h1>
      </div>

      <div className="space-y-3">
        <p className="label-caps">Account</p>
        <div className="flex items-center gap-4 p-5 rounded-lg border-2 border-border bg-card shadow-card">
          <Avatar className="h-14 w-14">
            <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg">
              {user ? initials(user) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{user?.displayName || "Signed in"}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="label-caps">Preferences</p>
        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            {resolvedTheme === "dark" ? (
              <Moon className="h-4 w-4 text-primary" />
            ) : (
              <Sun className="h-4 w-4 text-primary" />
            )}
            <span className="text-sm font-medium text-foreground">Dark Mode</span>
          </div>
          <Switch
            checked={resolvedTheme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Toggle dark mode"
          />
        </div>
      </div>

      <Button variant="outline" onClick={signOutUser} className="w-full sm:w-auto">
        <LogOut className="h-4 w-4 mr-2" />
        Log out
      </Button>
    </div>
  );
}
