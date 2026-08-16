import { useEffect, useRef } from "react";

/**
 * Makes a Dialog/Sheet/Popover closeable via the phone's back button/gesture
 * instead of exiting the installed PWA. While any overlay is open, exactly
 * one history entry is reserved; the back button pops it (closing whichever
 * overlay is currently open) instead of leaving the app.
 *
 * Uses a shared module-level stack rather than one history entry per hook
 * instance: when one overlay closes and another opens in the same render
 * (e.g. a password prompt confirming into an add form), the reservation is
 * debounced via a macrotask so the transition nets to zero history churn
 * instead of a `history.back()` racing an immediately-following
 * `history.pushState()`.
 */
type CloseFn = () => void;

let overlayStack: CloseFn[] = [];
let reserved = false;
let syncTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleSync() {
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(() => {
    syncTimer = null;
    if (overlayStack.length > 0 && !reserved) {
      window.history.pushState({ overlay: true }, "");
      reserved = true;
    } else if (overlayStack.length === 0 && reserved) {
      reserved = false;
      window.history.back();
    }
  }, 0);
}

function handlePopState() {
  if (reserved && overlayStack.length > 0) {
    reserved = false;
    const top = overlayStack[overlayStack.length - 1];
    top();
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", handlePopState);
}

export function useBackCloseable(open: boolean, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const entryRef = useRef<CloseFn | null>(null);

  useEffect(() => {
    if (open) {
      const fn: CloseFn = () => onCloseRef.current();
      entryRef.current = fn;
      overlayStack.push(fn);
      scheduleSync();
    } else if (entryRef.current) {
      overlayStack = overlayStack.filter((f) => f !== entryRef.current);
      entryRef.current = null;
      scheduleSync();
    }

    return () => {
      if (entryRef.current) {
        overlayStack = overlayStack.filter((f) => f !== entryRef.current);
        entryRef.current = null;
        scheduleSync();
      }
    };
  }, [open]);
}
