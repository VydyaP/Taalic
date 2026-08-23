import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/auth/AuthProvider";
import { PasswordModal } from "@/components/PasswordModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type GateAction = "add" | "edit" | "delete";

interface EditGateContextValue {
  unlocked: boolean;
  requireCode: (action: GateAction, callback: () => void) => void;
}

const EditGateContext = createContext<EditGateContextValue | undefined>(undefined);

/**
 * Gates add/edit/delete actions behind a shared security code. Unlocks once
 * per app-open session (not re-prompted per action) and resets if the signed
 * -in account changes. This is friction against accidental taps, not a real
 * security boundary — actual access control is Firebase Auth (Firestore/
 * Storage rules require a signed-in account).
 */
export function EditGateProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<GateAction>("add");
  const [loading, setLoading] = useState(false);
  const pendingRef = useRef<(() => void) | null>(null);
  const modalOpenRef = useRef(showModal);
  useEffect(() => {
    modalOpenRef.current = showModal;
  }, [showModal]);

  const uidRef = useRef(user?.uid);
  useEffect(() => {
    if (uidRef.current !== user?.uid) {
      uidRef.current = user?.uid;
      setUnlocked(false);
    }
  }, [user?.uid]);

  const SECURITY_CODE = import.meta.env.VITE_SECURITY_CODE || "1234";

  const requireCode = (nextAction: GateAction, callback: () => void) => {
    if (unlocked) {
      callback();
      return;
    }
    setAction(nextAction);
    pendingRef.current = callback;
    setShowModal(true);
  };

  const handleConfirm = async (password: string) => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    // The modal may have been dismissed (e.g. phone back button) while this
    // delay was in flight — don't run the pending action for a cancelled prompt.
    if (!modalOpenRef.current) {
      setLoading(false);
      return;
    }

    if (password === SECURITY_CODE) {
      setLoading(false);
      setUnlocked(true);
      setShowModal(false);
      const callback = pendingRef.current;
      pendingRef.current = null;
      callback?.();
    } else {
      setLoading(false);
      toast({
        title: "Access Denied",
        description: "Incorrect security code. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <EditGateContext.Provider value={{ unlocked, requireCode }}>
      {children}
      <PasswordModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          pendingRef.current = null;
        }}
        onConfirm={handleConfirm}
        title={
          action === "add" ? "Add New Keerthana" :
          action === "edit" ? "Edit Keerthana" :
          "Delete Keerthana"
        }
        description={
          action === "add" ? "Enter security code to add a new keerthana to your collection." :
          action === "edit" ? "Enter security code to edit keerthana details." :
          "Enter security code to permanently delete this keerthana. This action cannot be undone."
        }
        action={action}
        isLoading={loading}
      />
    </EditGateContext.Provider>
  );
}

export function useEditGate() {
  const ctx = useContext(EditGateContext);
  if (!ctx) throw new Error("useEditGate must be used within EditGateProvider");
  return ctx;
}

interface GateRouteProps {
  action: GateAction;
  children: ReactNode;
}

/**
 * Wraps a route that should never be reachable without unlocking first
 * (e.g. a direct link/bookmark to /add). Uses the same requireCode()
 * mechanism as button-click gating, so there's one gate, not two.
 */
export function GateRoute({ action, children }: GateRouteProps) {
  const { unlocked, requireCode } = useEditGate();
  const navigate = useNavigate();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!unlocked && !attemptedRef.current) {
      attemptedRef.current = true;
      requireCode(action, () => {});
    }
  }, [unlocked, action, requireCode]);

  if (!unlocked) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-lg text-foreground">Unlock to continue</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>Back to collection</Button>
          <Button onClick={() => requireCode(action, () => {})}>Try again</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
