import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  title: string;
  description: string;
  action: "add" | "edit" | "delete";
  isLoading?: boolean;
}

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

  const getActionConfig = () => {
    switch (action) {
      case "add":
        return {
          icon: "➕",
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-950/20",
          borderColor: "border-green-200 dark:border-green-800"
        };
      case "edit":
        return {
          icon: "✏️",
          color: "text-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-950/20",
          borderColor: "border-blue-200 dark:border-blue-800"
        };
      case "delete":
        return {
          icon: "🗑️",
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-950/20",
          borderColor: "border-red-200 dark:border-red-800"
        };
    }
  };

  const config = getActionConfig();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <div className="flex flex-col items-center space-y-4">
          {/* Header with icon */}
          <div className={cn(
            "flex items-center justify-center w-16 h-16 rounded-full border-2",
            config.bgColor,
            config.borderColor
          )}>
            <span className="text-2xl">{config.icon}</span>
          </div>

          <div className="text-center space-y-2">
            <DialogTitle className={cn("text-xl font-semibold", config.color)}>
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
                    error && "border-red-500 focus:border-red-500"
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
                <div className="flex items-center gap-2 text-sm text-red-600">
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
                className={cn(
                  "flex-1",
                  action === "add" && "bg-green-600 hover:bg-green-700",
                  action === "edit" && "bg-blue-600 hover:bg-blue-700",
                  action === "delete" && "bg-red-600 hover:bg-red-700"
                )}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
