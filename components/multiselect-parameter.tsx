"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface MultiSelectComboboxProps {
  label: string;
  options: string[];
  property: string;
  placeholder?: string;
  onSelectionChange: (property: string, selectedItems: string[]) => void;
}

export default function MultiSelectParameter({
  options = [],
  label,
  property,
  placeholder = "Select items...",
  onSelectionChange,
}: MultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const handleSelect = (property: string, value: string) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = new Set(prevSelectedItems);
      if (newSelectedItems.has(value)) {
        newSelectedItems.delete(value);
      } else {
        newSelectedItems.add(value);
      }
      onSelectionChange(property, Array.from(newSelectedItems));
      return newSelectedItems;
    });
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
        <Badge variant="secondary" className="text-xs">
          Filtering: {property}
        </Badge>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedItems.size > 0
              ? `${selectedItems.size} selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${property}...`} />
            <CommandEmpty>No {property} found.</CommandEmpty>
            <CommandGroup>
              {options.length > 0 ? (
                options.map((option) => {
                  return (
                    <CommandItem
                      key={option}
                      onSelect={() => handleSelect(property, option)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedItems.has(option)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {option}
                    </CommandItem>
                  );
                })
              ) : (
                <CommandItem>No options found</CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedItems.size > 0 && (
        <div className="flex flex-wrap gap-1">
          {Array.from(selectedItems).map((item) => (
            <Badge key={item} variant="secondary" className="text-xs">
              {item}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
