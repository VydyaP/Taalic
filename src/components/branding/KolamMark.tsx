import { cn } from "@/lib/utils";

/**
 * App logo mark: a six-petal kolam (South Indian dot-art) flower,
 * echoing the `.kolam-dots` background pattern used across the app.
 * Single-color (currentColor) so it drops into any foreground context.
 */
export function KolamMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      className={cn("text-current", className)}
      aria-hidden="true"
    >
      <circle cx="26" cy="16" r="2" fill="currentColor" opacity="0.55" />
      <circle cx="21" cy="24.66" r="2" fill="currentColor" opacity="0.55" />
      <circle cx="11" cy="24.66" r="2" fill="currentColor" opacity="0.55" />
      <circle cx="6" cy="16" r="2" fill="currentColor" opacity="0.55" />
      <circle cx="11" cy="7.34" r="2" fill="currentColor" opacity="0.55" />
      <circle cx="21" cy="7.34" r="2" fill="currentColor" opacity="0.55" />
      <circle cx="16" cy="16" r="2.6" fill="currentColor" />
    </svg>
  );
}
