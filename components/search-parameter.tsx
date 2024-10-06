"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface SearchComponentProps {
  label: string;
  property: string;
  placeholder?: string;
  searchTerm: string;
  onSearchChange: (property: string, value: string) => void;
}

export default function SearchParameter({
  label,
  property,
  placeholder = "Search...",
  searchTerm,
  onSearchChange,
}: SearchComponentProps) {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between">
        <Label
          htmlFor="search"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </Label>
        <Badge variant="secondary" className="text-xs">
          Searching: {property}
        </Badge>
      </div>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          type="search"
          placeholder={placeholder}
          className="pl-8"
          value={searchTerm}
          onChange={(e) => onSearchChange(property, e.target.value)}
        />
      </div>
    </div>
  );
}
