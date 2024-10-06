interface OptionItem {
  [key: string]: string;
}

export const fetchOptions = async (
  table: string,
  property: string
): Promise<OptionItem[]> => {
  const response = await fetch(
    `http://localhost:4000/consumption/propertyOptions?table=${encodeURIComponent(
      table
    )}&property=${encodeURIComponent(property)}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch options");
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    throw new Error("Invalid response format");
  }
  return data;
};
