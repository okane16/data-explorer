"use client";

import { useState, useCallback } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import SearchParameter from "./search-parameter";
import MultiSelectParameter from "./multiselect-parameter";
import { Loader2 } from "lucide-react";
import useTableSearchFilter from "../lib/hooks/useMoose";

const queryClient = new QueryClient();

interface TableSearch {
  tableName: string;
  searchTerms: Record<string, string>;
  filters: Record<string, string[]>;
}

const fetchResults = async ({
  tableName,
  searchTerms,
  filters,
}: {
  tableName: string;
  searchTerms: Record<string, string>;
  filters: Record<string, string[]>;
}) => {
  const searchQueryParams =
    Object.keys(searchTerms).length > 0
      ? Object.entries(searchTerms).map(([searchTerm, value]) => {
          return `search=${encodeURIComponent(searchTerm)}:${encodeURIComponent(
            value
          )}`;
        })
      : [];

  const filterQueryParams =
    Object.keys(filters).length > 0
      ? Object.entries(filters).map(([filter, selectedItems]) => {
          return `filter=${encodeURIComponent(filter)}:${encodeURIComponent(
            selectedItems.join(",")
          )}`;
        })
      : [];

  const queryParams = [...searchQueryParams, ...filterQueryParams].join("&");
  console.log(queryParams);
  const response = await fetch(
    `/consumption/queryTable?table=${tableName}&${queryParams}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch results");
  }
  return response.json();
};

function SearchAndFilterComponent({ tableName }: { tableName: string }) {
  const {
    searchTerms,
    filters,
    tableProperties,
    filterOptions,
    updateSearchTerms,
    updateFilters,
  } = useTableSearchFilter(tableName);

  const {
    data: results = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", { searchTerms, filters }],
    queryFn: () =>
      fetchResults({ tableName, searchTerms, filters } as TableSearch),
    enabled:
      Object.keys(searchTerms).length > 0 || Object.keys(filters).length > 0,
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Product Search and Filter</h1>
      <div className="space-y-4 mb-6">
        <SearchParameter
          label="Search products"
          property="name"
          placeholder="Enter product name..."
          searchTerm={searchTerms.name ? searchTerms.name : ""}
          onSearchChange={updateSearchTerms}
        />
        <MultiSelectParameter
          options={filterOptions["stargazerName"]}
          label="Filter by category"
          property="stargazerName"
          placeholder="Select categories..."
          onSelectionChange={updateFilters}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Loading results...</span>
        </div>
      )}

      {error instanceof Error && (
        <p className="text-sm text-red-500" role="alert">
          {error.message}
        </p>
      )}

      {results.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Search Results:</h2>
          <ul className="list-disc pl-5">
            {results.map((result, index) => (
              <li key={index}>{JSON.stringify(result)}</li>
            ))}
          </ul>
        </div>
      )}

      {!isLoading && !error && results && results.length === 0 && (
        <p>No results found. Try adjusting your search or filters.</p>
      )}
    </div>
  );
}

export default function ParentComponent() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchAndFilterComponent tableName="HistoricalStarEvent_0_0" />
    </QueryClientProvider>
  );
}
