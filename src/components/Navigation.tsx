import { Button } from "@/components/ui/button";
import { Music, Users, Clock, Sparkles, Library, Plus, Search, Triangle, User, Sparkles as SparklesIcon, Trash2, Edit, CheckSquare, Square } from "lucide-react";
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
  isSelectionMode?: boolean;
  selectedCount?: number;
  onToggleSelectionMode?: () => void;
  onBulkDelete?: () => void;
  onBulkEdit?: () => void;
}

const navigationItems = [
  { key: "all" as const, label: "All Keerthanas", icon: Library, color: "text-foreground" },
  { key: "raga" as const, label: "By Raga", icon: Music, color: "text-raga-primary" },
  { key: "tala" as const, label: "By Tala", icon: Clock, color: "text-tala-primary" },
  { key: "composer" as const, label: "By Composer", icon: Users, color: "text-composer-primary" },
  { key: "deity" as const, label: "By Deity", icon: Sparkles, color: "text-deity-primary" },
];

export const Navigation = ({ 
  activeFilter, 
  onFilterChange, 
  onAddNew, 
  totalCount, 
  searchValue = "", 
  onSearchChange, 
  filterType = "raga", 
  onFilterTypeChange,
  isSelectionMode = false,
  selectedCount = 0,
  onToggleSelectionMode,
  onBulkDelete,
  onBulkEdit
}: NavigationProps) => {
  const { signOutUser, user } = useAuth();
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
            <div className="flex items-center">
              <div className="text-left">
                {user ? (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-3 border border-blue-200/50 shadow-sm">
                    <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-md">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Welcome back</p>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        {user.displayName || user.email?.split('@')[0] || 'User'}
                      </p>
                    </div>
                    <SparklesIcon className="h-4 w-4 text-blue-500/60 animate-pulse" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-400 rounded-full">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
                      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">User</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="justify-self-center text-center">
              <h1 className="text-3xl font-bold text-foreground">Keerthana Collection</h1>
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
              {!isSelectionMode ? (
                <>
                  <Button
                    onClick={onAddNew}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
                    style={{ transition: 'var(--transition-smooth)', boxShadow: 'var(--shadow-elegant)' }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Kruthi
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onToggleSelectionMode}
                    className="flex items-center gap-2"
                  >
                    <CheckSquare className="h-4 w-4" />
                    Select
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="destructive"
                    onClick={onBulkDelete}
                    disabled={selectedCount === 0}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete ({selectedCount})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onBulkEdit}
                    disabled={selectedCount === 0}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit ({selectedCount})
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={onToggleSelectionMode}
                    className="flex items-center gap-2"
                  >
                    <Square className="h-4 w-4" />
                    Cancel
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={signOutUser}>Log out</Button>
            </div>
          </div>

          {/* Spread-out rectangular filter buttons with search in the empty space */}
          <div className="mt-2">
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Filter buttons spread across the first 8 columns */}
              <div className="col-span-8 flex items-center gap-3">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeFilter === item.key;
                  return (
                    <Button
                      key={item.key}
                      variant={isActive ? "default" : "outline"}
                      onClick={() => onFilterChange(item.key)}
                      className={cn(
                        "flex items-center justify-center gap-2 h-10 px-4 transition-all duration-200 flex-1",
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
              
              {/* Search controls in the empty space (last 4 columns) */}
              <div className="col-span-4 flex justify-end">
                <div className="relative w-full max-w-md">
                  {!showSearch ? (
                    <button
                      aria-label="Open search"
                      className="w-full flex items-center justify-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 transition-all"
                      onClick={() => {
                        setShowSearch(true);
                        setTimeout(() => (searchInputRef.current as any)?.focus(), 100);
                      }}
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Search Keerthanas...</span>
                    </button>
                  ) : (
                    <div
                      className="flex items-center border rounded-lg bg-background px-3 py-2 shadow-sm transition-all w-full"
                      tabIndex={-1}
                      onBlur={e => {
                        if (!e.currentTarget.contains(e.relatedTarget as any)) setShowSearch(false);
                      }}
                    >
                      <Search className="h-4 w-4 text-muted-foreground mr-2" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchValue}
                        onChange={e => onSearchChange?.(e.target.value)}
                        placeholder="Search Keerthanas..."
                        className="flex-1 bg-transparent outline-none text-sm"
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
      </div>
    </div>
  );
};