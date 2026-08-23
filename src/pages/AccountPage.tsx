import { useEffect, useState } from "react";
import { HardDrive, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { getStorageUsage } from "@/utils/storage";

// Firebase Storage's no-cost tier is 5 GB of stored files.
const FREE_TIER_BYTES = 5 * 1024 * 1024 * 1024;

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function initials(user: { displayName?: string | null; email?: string | null }) {
  const source = user.displayName || user.email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase() || "?";
}

export default function AccountPage() {
  const { signOutUser, user } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [usageLoading, setUsageLoading] = useState(true);
  const [usage, setUsage] = useState<{ bytes: number; fileCount: number } | null>(null);
  const [usageError, setUsageError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setUsageLoading(true);
    getStorageUsage()
      .then((u) => {
        if (!cancelled) setUsage(u);
      })
      .catch((err) => {
        console.error('Error fetching storage usage:', err);
        if (!cancelled) setUsageError(true);
      })
      .finally(() => {
        if (!cancelled) setUsageLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const percent = usage ? Math.min(100, (usage.bytes / FREE_TIER_BYTES) * 100) : 0;

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

      <div className="space-y-3">
        <p className="label-caps">Notation File Storage</p>
        <div className="p-4 rounded-lg border border-border space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            <HardDrive className="h-4 w-4 text-primary" />
            {usageLoading
              ? "Calculating..."
              : usageError
              ? "Couldn't load storage usage."
              : usage
              ? `${formatBytes(usage.bytes)} of 5 GB`
              : null}
          </div>
          {!usageLoading && !usageError && usage && (
            <>
              <Progress value={percent} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {usage.fileCount} file{usage.fileCount === 1 ? "" : "s"}
              </p>
            </>
          )}
        </div>
      </div>

      <Button variant="outline" onClick={signOutUser} className="w-full sm:w-auto">
        <LogOut className="h-4 w-4 mr-2" />
        Log out
      </Button>
    </div>
  );
}
