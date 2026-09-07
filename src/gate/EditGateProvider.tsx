import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { PasswordModal } from "@/components/PasswordModal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type GateAction = "add" | "edit" | "delete";

interface EditGateContextValue {
  requireCode: (action: GateAction, callback: () => void) => void;
}

const EditGateContext = createContext<EditGateContextValue | undefined>(undefined);

/**
 * Gates add/edit/delete actions behind a shared security code, prompting
 * every time with no persistence across actions or app sessions. This is
 * friction against accidental/unwanted edits, not a real security boundary —
 * actual access control is Firebase Auth (Firestore/Storage rules require a
 * signed-in account).
 */
export function EditGateProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [action, setAction] = useState<GateAction>("add");
  const [loading, setLoading] = useState(false);
  const pendingRef = useRef<(() => void) | null>(null);
  const modalOpenRef = useRef(showModal);
  useEffect(() => {
    modalOpenRef.current = showModal;
  }, [showModal]);

  const SECURITY_CODE = import.meta.env.VITE_SECURITY_CODE || "1234";

  const requireCode = (nextAction: GateAction, callback: () => void) => {
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
    <EditGateContext.Provider value={{ requireCode }}>
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
 * Wraps a route that should never be reachable without entering the code
 * first (e.g. a direct link/bookmark to /add). Verification is local to
 * this mount — navigating away and back re-prompts, same as every other
 * gated action.
 */
export function GateRoute({ action, children }: GateRouteProps) {
  const { requireCode } = useEditGate();
  const navigate = useNavigate();
  const [verified, setVerified] = useState(false);
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (!verified && !attemptedRef.current) {
      attemptedRef.current = true;
      requireCode(action, () => setVerified(true));
    }
  }, [verified, action, requireCode]);

  if (!verified) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <p className="text-lg text-foreground">Unlock to continue</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate("/")}>Back to collection</Button>
          <Button onClick={() => requireCode(action, () => setVerified(true))}>Try again</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
