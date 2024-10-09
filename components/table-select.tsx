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
import { ChevronDown } from "lucide-react";

interface TableSelectProps {
  field: ControllerRenderProps<TableSearchParams, any>;
  tables: string[];
  onChange: (val: string) => void;
}

export default function TableSelect({
  field,
  tables,
  onChange,
}: TableSelectProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Table:</p>
      <Popover open={open} onOpenChange={setOpen}>
        <FormControl>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[150px] justify-start">
              {field.value ? <>{field.value}</> : <>Select a Table</>}
              <ChevronDown />
            </Button>
          </PopoverTrigger>
        </FormControl>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Search Table..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {tables.map((table) => (
                  <CommandItem
                    key={table}
                    value={table}
                    onSelect={() => {
                      setOpen(false);
                      onChange(table);
                    }}
                  >
                    {table}
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
