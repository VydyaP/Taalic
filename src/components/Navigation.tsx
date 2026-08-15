import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput } from "@/components/ui/command";
import {
  Music, Users, Clock, Sparkles, Library, Plus, Search,
  Trash2, Edit, CheckSquare, Square, Moon, Sun, MoreVertical, LogOut, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { useTheme } from "next-themes";

export type ClassificationFilter = "all" | "raga" | "tala" | "composer" | "deity";

interface NavigationProps {
  activeFilter: ClassificationFilter;
  onFilterChange: (filter: ClassificationFilter) => void;
  onAddNew: () => void;
  totalCount: number;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
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

function initials(user: { displayName?: string | null; email?: string | null }) {
  const source = user.displayName || user.email || "";
  const parts = source.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return source.slice(0, 2).toUpperCase() || "?";
}

export const Navigation = ({
  activeFilter,
  onFilterChange,
  onAddNew,
  searchValue = "",
  onSearchChange,
  isSelectionMode = false,
  selectedCount = 0,
  onToggleSelectionMode,
  onBulkDelete,
  onBulkEdit,
}: NavigationProps) => {
  const { signOutUser, user, loading } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  const activeItem = navigationItems.find((i) => i.key === activeFilter) ?? navigationItems[0];
  const ActiveIcon = activeItem.icon;

  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4 px-4 sm:py-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="font-display text-xl sm:text-3xl font-bold text-foreground truncate">
            Keerthana Collection
          </h1>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Search */}
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Search">
                  <Search className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-72 p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search keerthanas..."
                    value={searchValue}
                    onValueChange={(v) => onSearchChange?.(v)}
                  />
                </Command>
              </PopoverContent>
            </Popover>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-3">
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
                  <Button onClick={onAddNew} className="shadow-elegant transition-smooth">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Kruthi
                  </Button>
                  <Button variant="outline" onClick={onToggleSelectionMode}>
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Select
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="destructive" onClick={onBulkDelete} disabled={selectedCount === 0}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete ({selectedCount})
                  </Button>
                  <Button variant="outline" onClick={onBulkEdit} disabled={selectedCount === 0}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit ({selectedCount})
                  </Button>
                  <Button variant="outline" onClick={onToggleSelectionMode}>
                    <Square className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
              <Button variant="outline" onClick={signOutUser}>Log out</Button>
            </div>

            {/* Mobile actions */}
            <div className="flex md:hidden items-center gap-2">
              {!isSelectionMode ? (
                <Button size="icon" onClick={onAddNew} aria-label="Add Kruthi" className="shadow-elegant">
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  size="icon"
                  variant="destructive"
                  onClick={onBulkDelete}
                  disabled={selectedCount === 0}
                  aria-label={`Delete ${selectedCount} selected`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" aria-label="More actions">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
                    {resolvedTheme === "dark" ? (
                      <Sun className="h-4 w-4 mr-2" />
                    ) : (
                      <Moon className="h-4 w-4 mr-2" />
                    )}
                    Toggle theme
                  </DropdownMenuItem>
                  {!isSelectionMode ? (
                    <DropdownMenuItem onClick={onToggleSelectionMode}>
                      <CheckSquare className="h-4 w-4 mr-2" />
                      Select
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={onBulkEdit} disabled={selectedCount === 0}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit ({selectedCount})
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onToggleSelectionMode}>
                        <Square className="h-4 w-4 mr-2" />
                        Cancel selection
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOutUser}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* User avatar */}
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
          </div>
        </div>

        {/* Filter row */}
        <div>
          {/* Desktop: pill buttons, wrap instead of overflow */}
          <div className="hidden md:flex flex-wrap gap-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.key;
              return (
                <Button
                  key={item.key}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => onFilterChange(item.key)}
                  className={cn("flex items-center gap-2 h-10 px-4 transition-smooth", !isActive && item.color)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
          </div>

          {/* Mobile: single trigger opening a bottom sheet */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full md:hidden justify-between">
                <span className="flex items-center gap-2">
                  <ActiveIcon className={cn("h-4 w-4", activeItem.color)} />
                  {activeItem.label}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>Browse by</SheetTitle>
              </SheetHeader>
              <div className="grid grid-cols-1 gap-2 py-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeFilter === item.key;
                  return (
                    <SheetClose asChild key={item.key}>
                      <Button
                        variant={isActive ? "default" : "outline"}
                        onClick={() => onFilterChange(item.key)}
                        className="justify-start h-12 text-base"
                      >
                        <Icon className={cn("h-5 w-5 mr-3", !isActive && item.color)} />
                        {item.label}
                      </Button>
                    </SheetClose>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};
