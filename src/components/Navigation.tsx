import { Button } from "@/components/ui/button";
import { Music, Users, Clock, Sparkles, Library, Plus, Search, Triangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export type ClassificationFilter = "all" | "raga" | "tala" | "composer" | "deity";

interface NavigationProps {
  activeFilter: ClassificationFilter;
  onFilterChange: (filter: ClassificationFilter) => void;
  onAddNew: () => void;
  totalCount: number;
}

const navigationItems = [
  { key: "all" as const, label: "All Keerthanas", icon: Library, color: "text-foreground" },
  { key: "raga" as const, label: "By Raga", icon: Music, color: "text-raga-primary" },
  { key: "tala" as const, label: "By Tala", icon: Clock, color: "text-tala-primary" },
  { key: "composer" as const, label: "By Composer", icon: Users, color: "text-composer-primary" },
  { key: "deity" as const, label: "By Deity", icon: Sparkles, color: "text-deity-primary" },
];

export const Navigation = ({ activeFilter, onFilterChange, onAddNew, totalCount }: NavigationProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [filterType, setFilterType] = useState("raga");
  const searchInputRef = useRef(null);
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border/50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Keerthana Collection
              </h1>
              <p className="text-muted-foreground mt-1">
                {totalCount} keerthanas in your collection
              </p>
            </div>
            <Button 
              onClick={onAddNew}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              style={{ 
                transition: 'var(--transition-smooth)',
                boxShadow: 'var(--shadow-elegant)'
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Kruthi
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 items-center mt-4">
            {navigationItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeFilter === item.key;
              return (
                <Button
                  key={item.key}
                  variant={isActive ? "default" : "outline"}
                  onClick={() => onFilterChange(item.key)}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-200",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-md" 
                      : "border-border hover:bg-secondary/50",
                    !isActive && item.color
                  )}
                  style={{ transition: 'var(--transition-smooth)' }}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              );
            })}
            {/* Place search after the last nav button */}
            <div className="relative">
              {!showSearch ? (
                <button
                  aria-label="Open search"
                  className="p-2 rounded-full hover:bg-muted focus:outline-none"
                  onClick={() => {
                    setShowSearch(true);
                    setTimeout(() => searchInputRef.current?.focus(), 100);
                  }}
                >
                  <Search className="h-5 w-5 text-muted-foreground" />
                </button>
              ) : (
                <div
                  className="flex items-center border rounded-md bg-background px-2 py-1 shadow transition-all w-64 ml-2"
                  tabIndex={-1}
                  onBlur={e => {
                    // Only contract if focus moves outside the search bar and filter dropdown
                    if (!e.currentTarget.contains(e.relatedTarget)) setShowSearch(false);
                  }}
                >
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
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
                          onClick={() => { setFilterType(opt.key); setShowFilter(false); }}
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