export interface TableProperty {
  name: string;
  type: string;
  isCategorical: boolean;
}
export interface PropertyOption {
  value: string;
}

export async function getTableProperties(
  table: string
): Promise<TableProperty[]> {
  const response = await fetch(
    `http://localhost:4000/consumption/tableProperties?table=${encodeURIComponent(
      table
    )}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch table filter properties");
  }
  return response.json();
}

export async function getPropertyOptions(
  table: string,
  property: string
): Promise<PropertyOption[]> {
  const response = await fetch(
    `http://localhost:4000/consumption/propertyOptions?table=${encodeURIComponent(
      table
    )}&property=${encodeURIComponent(property)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch options");
  }

  const data = await response.json();
  console.log("data", data);
  return data;
}

export interface TableSearch {
  tableName: string;
  searchTerms: Record<string, string>;
  filters: Record<string, string[]>;
}

export async function fetchResults({
  tableName,
  searchTerms,
  filters,
}: {
  tableName: string;
  searchTerms: Record<string, string>;
  filters: Record<string, string[]>;
}) {
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
}
