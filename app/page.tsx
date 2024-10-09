"use client";
import { useState } from "react";
import TableSearchForm, {
  TableSearchParams,
} from "@/components/table-search-form";

export default function Home() {
  const [formState, setFormState] = useState<TableSearchParams>();
  return (
    <div>
      <h1>Data Explorer</h1>
      <TableSearchForm
        tableOptions={[
          "HistoricalStarEvent_0_0",
          "RepoLanguages_0_0",
          "StargazerProjectInfo_0_0",
        ]}
        setTableSearchParams={setFormState}
      />
      <h3>Selected Table: {formState?.tableName}</h3>
      {formState?.filters.map((filter, index) => (
        <div key={index} className="mt-2 p-2 border rounded">
          <p>
            <strong>Property:</strong> {filter.property}
          </p>
          <p>
            <strong>Values:</strong> {filter.values.join(", ")}
          </p>
        </div>
      ))}
    </div>
  );
}
