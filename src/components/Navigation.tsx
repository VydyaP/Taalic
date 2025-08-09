import { Button } from "@/components/ui/button";
import { Music, Users, Clock, Sparkles, Library, Plus, Search, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export type ClassificationFilter = "all" | "raga" | "tala" | "composer" | "deity";

interface NavigationProps {
  activeFilter: ClassificationFilter;
  onFilterChange: (filter: ClassificationFilter) => void;
  onAddNew: () => void;
  totalCount: number;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  filterType?: string;
  onFilterTypeChange?: (v: string) => void;
}

const navigationItems = [
  { key: "all" as const, label: "All Keerthanas", icon: Library, color: "text-foreground" },
  { key: "raga" as const, label: "By Raga", icon: Music, color: "text-raga-primary" },
  { key: "tala" as const, label: "By Tala", icon: Clock, color: "text-tala-primary" },
  { key: "composer" as const, label: "By Composer", icon: Users, color: "text-composer-primary" },
  { key: "deity" as const, label: "By Deity", icon: Sparkles, color: "text-deity-primary" },
];

export const Navigation = ({ activeFilter, onFilterChange, onAddNew, totalCount, searchValue = "", onSearchChange, filterType = "raga", onFilterTypeChange }: NavigationProps) => {
  const { signOutUser } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const searchInputRef = useRef(null);
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-6">
          {/* Top bar: centered title, actions on right */}
          <div className="grid grid-cols-3 items-center">
            <div />
            <div className="justify-self-center text-center">
              <h1 className="text-3xl font-bold text-foreground">Keerthana Collection</h1>
              <p className="text-muted-foreground mt-1">{totalCount} keerthanas in your collection</p>
            </div>
            <div className="justify-self-end flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button
                onClick={onAddNew}
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                style={{ transition: 'var(--transition-smooth)', boxShadow: 'var(--shadow-elegant)' }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Kruthi
              </Button>
              <Button variant="outline" onClick={signOutUser}>Log out</Button>
            </div>
          </div>

          {/* Spread-out rectangular filter buttons (wrapped row) */}
          <div className="mt-2">
            <div className="flex flex-wrap items-center gap-3">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeFilter === item.key;
                return (
                  <Button
                    key={item.key}
                    variant={isActive ? "default" : "outline"}
                    onClick={() => onFilterChange(item.key)}
                    className={cn(
                      "flex items-center justify-center gap-2 h-10 px-4 transition-all duration-200",
                      isActive ? "bg-primary text-primary-foreground shadow-md" : "border-border hover:bg-secondary/50",
                      !isActive && item.color
                    )}
                    style={{ transition: 'var(--transition-smooth)' }}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Search and filter controls aligned right, separate row */}
          <div className="flex justify-end">
            <div className="relative">
              {!showSearch ? (
                <button
                  aria-label="Open search"
                  className="p-2 rounded-full hover:bg-muted focus:outline-none"
                  onClick={() => {
                    setShowSearch(true);
                    setTimeout(() => (searchInputRef.current as any)?.focus(), 100);
                  }}
                >
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              ) : (
                <div
                  className="flex items-center border rounded-md bg-background px-2 py-1 shadow transition-all w-64"
                  tabIndex={-1}
                  onBlur={e => {
                    if (!e.currentTarget.contains(e.relatedTarget as any)) setShowSearch(false);
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={e => onSearchChange?.(e.target.value)}
                    placeholder="Search Keerthanas..."
                    className="flex-1 bg-transparent outline-none px-2 py-1 text-base"
                  />
                  <button
                    aria-label="Show filters"
                    className="ml-2 p-1 rounded hover:bg-muted"
                    onClick={() => setShowFilter(f => !f)}
                  >
                    <Triangle className="h-4 w-4 rotate-180 text-muted-foreground" />
                  </button>
                  {showFilter && (
                    <div className="absolute right-0 top-10 z-10 bg-background border rounded shadow-md min-w-[140px]">
                      {[
                        { key: "raga", label: "By Raga" },
                        { key: "tala", label: "By Tala" },
                        { key: "composer", label: "By Composer" },
                        { key: "deity", label: "By Deity" },
                      ].map(opt => (
                        <button
                          key={opt.key}
                          className={`block w-full text-left px-4 py-2 hover:bg-muted ${filterType === opt.key ? "font-bold" : ""}`}
                          onClick={() => { onFilterTypeChange?.(opt.key); setShowFilter(false); }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};