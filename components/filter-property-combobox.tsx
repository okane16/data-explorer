"use client";
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
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem } from "@/components/ui/form";
import { ControllerRenderProps } from "react-hook-form";
import { TableSearchParams } from "./table-search-form";
import { TableProperty } from "@/lib/actions";

interface MultiSelectProps {
  field: ControllerRenderProps<TableSearchParams, any>;
  index: number;
  properties: TableProperty[];
  onChange: (val: string) => void;
}

export default function PropertySearchCombobox({
  field,
  properties,
  index,
  onChange,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Status</p>
      <Popover open={open} onOpenChange={setOpen}>
        <FormControl>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start">
              {field.value ? <>{field.value}</> : <>+ Set Property</>}
            </Button>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Search Property..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {properties.map((property) => (
                  <CommandItem
                    key={property.name}
                    value={property.name}
                    onSelect={() => {
                      setOpen(false);
                      onChange(property.name);
                    }}
                  >
                    {property.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </FormItem>
  );
}
