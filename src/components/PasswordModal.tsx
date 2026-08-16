import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBackCloseable } from "@/hooks/use-back-closeable";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
  description: string;
  action: "add" | "edit" | "delete";
  isLoading?: boolean;
}

const actionConfig = {
  add: {
    icon: Plus,
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/20",
    button: "bg-primary hover:bg-primary/90 text-primary-foreground",
  },
  edit: {
    icon: Pencil,
    text: "text-tala-primary",
    bg: "bg-tala-primary/10",
    border: "border-tala-primary/20",
    button: "bg-tala-primary hover:bg-tala-primary/90 text-tala-foreground",
  },
  delete: {
    icon: Trash2,
    text: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    button: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
  },
} as const;

export const PasswordModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  action,
  isLoading = false
}: PasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError("Please enter the security code");
      return;
    }
    setError("");
    onConfirm(password);
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    setShowPassword(false);
    onClose();
  };

  useBackCloseable(isOpen, handleClose);

  const config = actionConfig[action];
  const ActionIcon = config.icon;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center space-y-4">
          {/* Header with icon */}
          <div className={cn(
            "flex items-center justify-center w-16 h-16 rounded-full border-2",
            config.bg,
            config.border
          )}>
            <ActionIcon className={cn("h-7 w-7", config.text)} />
          </div>

          <div className="text-center space-y-2">
            <DialogTitle className={cn("font-display text-xl font-semibold", config.text)}>
              {title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {description}
            </DialogDescription>
          </div>

          {/* Password form */}
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Security Code
              </Label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <Lock className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  placeholder="Enter security code"
                  className={cn(
                    "pl-10 pr-10",
                    error && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className={cn("flex-1", config.button)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Confirm
                  </div>
                )}
              </Button>
            </div>
          </form>

          {/* Security note */}
          <div className="text-xs text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
            <Lock className="h-3 w-3 inline mr-1" />
            This action requires a security code for protection
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
