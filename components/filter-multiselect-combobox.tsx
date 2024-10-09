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
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { UseFormReturn } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getPropertyOptions } from "../lib/actions";
import { TableSearchParams } from "./table-search-form";

interface FilterMultiSelectComboboxProps {
  form: UseFormReturn<TableSearchParams, any, undefined>;
  tableName: string;
  property: string;
  index: number;
  onSelectionChange: (selectedItems: string[]) => void;
}

export default function FilterMultiSelectCombobox({
  form,
  tableName,
  property,
  index,
  onSelectionChange,
}: FilterMultiSelectComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedValues = form.getValues().filters[index].values;

  const {
    data: options,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getPropertyOptions", property, tableName],
    queryFn: () => getPropertyOptions(tableName, property),
    enabled: !!property,
  });

  const handleSetValue = (val: string) => {
    if (selectedValues.includes(val)) {
      selectedValues.splice(selectedValues.indexOf(val), 1);
      onSelectionChange(selectedValues.filter((item) => item !== val));
    } else {
      onSelectionChange([...selectedValues, val]);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Select Values:
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
            {selectedValues?.length
              ? selectedValues.map((val, i) => <Badge key={i}>{val}</Badge>)
              : "Select Values"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={`Search ${property}...`} />
            <CommandEmpty>No options found.</CommandEmpty>
            <CommandGroup>
              <CommandList>
                {options && options.length > 0 ? (
                  options.map((option, index) => {
                    return (
                      <CommandItem
                        key={index}
                        onSelect={() => handleSetValue(option.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedValues.includes(option.value)
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {option.value}
                      </CommandItem>
                    );
                  })
                ) : (
                  <CommandItem>No options found</CommandItem>
                )}
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
