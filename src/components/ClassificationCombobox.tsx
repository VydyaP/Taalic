import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Category } from "./CategoryBadge";

const categoryTextColor: Record<Category, string> = {
  raga: "text-raga-primary",
  tala: "text-tala-primary",
  composer: "text-composer-primary",
  deity: "text-deity-primary",
};

interface ClassificationComboboxProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  category?: Category;
  placeholder?: string;
}

export function ClassificationCombobox({ label, options, value, onChange, category, placeholder }: ClassificationComboboxProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const trimmed = inputValue.trim();
  const showCreate = trimmed.length > 0 && !options.some((o) => o.toLowerCase() === trimmed.toLowerCase());

  const select = (next: string) => {
    onChange(next);
    setInputValue("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between border-border font-normal", !value && "text-muted-foreground")}
        >
          <span className="truncate">{value || placeholder || `Select ${label.toLowerCase()}`}</span>
          <ChevronsUpDown
            className={cn("ml-2 h-4 w-4 shrink-0 opacity-50", category && categoryTextColor[category])}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput
            placeholder={`Search or type a ${label.toLowerCase()}...`}
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>No {label.toLowerCase()} found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem key={option} value={option} onSelect={() => select(option)}>
                  <Check className={cn("mr-2 h-4 w-4", value === option ? "opacity-100" : "opacity-0")} />
                  {option}
                </CommandItem>
              ))}
              {showCreate && (
                <CommandItem value={trimmed} onSelect={() => select(trimmed)}>
                  Use "{trimmed}"
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
