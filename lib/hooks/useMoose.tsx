import { useEffect, useState, useCallback } from "react";

const useTableSearchFilter = (tableName: string) => {
  const [searchTerms, setSearchTerm] = useState<Record<string, string>>({});
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [tableProperties, setTableProperties] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<Record<string, string[]>>(
    {}
  );
  const updateSearchTerms = (property: string, value: string) => {
    setSearchTerm((prev) => ({ ...prev, [property]: value }));
  };

  const updateFilters = (property: string, value: string[]) => {
    setFilters((prev) => ({ ...prev, [property]: value })); // value array is passed from the filter component
  };

  useEffect(() => {
    if (tableName) {
      const fetchTableProperties = async () => {
        const response = await fetch(
          `http://localhost:4000/consumption/tableProperties?table=${tableName}`
        ).then((res) => res.json());

        setTableProperties(
          response.map((item: { property: string }) => item.property)
        );
      };

      fetchTableProperties();
    }
  }, [tableName]);

  const fetchFilterOptions = useCallback(
    async (property: string) => {
      try {
        const response = await fetch(
          `http://localhost:4000/consumption/propertyOptions?table=${tableName}&property=${property}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        return JSON.parse(text).map((item: { option: string }) => item.option);
      } catch (error) {
        console.error("Error fetching filter options:", error);
        return null;
      }
    },
    [tableName]
  );

  useEffect(() => {
    const fetchAllFilterOptions = async () => {
      const optionsEntries = await Promise.all(
        tableProperties.map(async (property) => {
          const options = await fetchFilterOptions(property);
          return [property, options];
        })
      );
      const optionsMap = Object.fromEntries(optionsEntries);
      setFilterOptions(optionsMap);
    };

    fetchAllFilterOptions();
  }, [tableProperties, tableName, fetchFilterOptions]);

  return {
    searchTerms,
    filters,
    filterOptions,
    tableProperties,
    updateSearchTerms,
    updateFilters,
    fetchFilterOptions,
  };
};

export default useTableSearchFilter;
