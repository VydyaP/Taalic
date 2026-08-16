import { useState } from "react";
import { HardDrive, LogOut, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@/auth/AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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

export function AccountPanel() {
  const { signOutUser, user, loading } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [usageLoading, setUsageLoading] = useState(false);
  const [usage, setUsage] = useState<{ bytes: number; fileCount: number } | null>(null);
  const [usageError, setUsageError] = useState(false);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next && !usage && !usageLoading) {
      setUsageLoading(true);
      setUsageError(false);
      getStorageUsage()
        .then(setUsage)
        .catch((err) => {
          console.error('Error fetching storage usage:', err);
          setUsageError(true);
        })
        .finally(() => setUsageLoading(false));
    }
  };

  const percent = usage ? Math.min(100, (usage.bytes / FREE_TIER_BYTES) * 100) : 0;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button
          aria-label="Account"
          className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {loading ? (
            <Skeleton className="h-9 w-9 rounded-full" />
          ) : (
            <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? "User"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {user ? initials(user) : "?"}
              </AvatarFallback>
            </Avatar>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80 flex flex-col">
        <SheetHeader>
          <SheetTitle className="sr-only">Account</SheetTitle>
        </SheetHeader>

        <div className="flex items-center gap-3 pb-4 border-b border-border">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.photoURL ?? undefined} alt={user?.displayName ?? "User"} />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {user ? initials(user) : "?"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{user?.displayName || "Signed in"}</p>
            <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>

        <div className="flex-1 space-y-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              Dark Mode
            </div>
            <Switch
              checked={resolvedTheme === "dark"}
              onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
              aria-label="Toggle dark mode"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <HardDrive className="h-4 w-4" />
              Notation File Storage
            </div>
            {usageLoading ? (
              <p className="text-sm text-muted-foreground">Calculating...</p>
            ) : usageError ? (
              <p className="text-sm text-muted-foreground">Couldn't load storage usage.</p>
            ) : usage ? (
              <>
                <Progress value={percent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  {formatBytes(usage.bytes)} used of 5 GB free tier &middot; {usage.fileCount} file{usage.fileCount === 1 ? "" : "s"}
                </p>
              </>
            ) : null}
          </div>
        </div>

        <Button variant="outline" onClick={signOutUser} className="w-full">
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </SheetContent>
    </Sheet>
  );
}
