"use client";

import { useEffect } from "react";

import FilterForm from "./filter-form";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import TableSelect from "./table-select";
import { getTableProperties } from "../lib/actions";
import { Button } from "./ui/button";
import { useQuery } from "@tanstack/react-query";

export interface TableSearchParams {
  tableName: string;
  searchTerms: { property: string; value: string }[];
  filters: { property: string; values: string[] }[];
}

interface TableSearchProps {
  setTableSearchParams: (form: TableSearchParams) => void;
  tableOptions: string[];
}

export default function TableSearchForm({
  setTableSearchParams,
  tableOptions,
}: TableSearchProps) {
  const form = useForm<TableSearchParams>({
    mode: "onChange",
  });

  const { watch, handleSubmit } = form;

  useEffect(() => {
    const subscription = watch(() => {
      handleSubmit((data) => {
        if (data) {
          setTableSearchParams(data); // update the parent component's state
        }
      })(); // call the function immediately
    });
    return () => subscription.unsubscribe();
  }, [watch, handleSubmit, setTableSearchParams]);

  const tableName = form.watch("tableName");

  const {
    isLoading,
    isError,
    data: properties,
    error,
  } = useQuery({
    queryKey: ["getTableProperties", tableName],
    queryFn: () => getTableProperties(tableName),
    enabled: !!tableName,
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="tableName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Table: </FormLabel>
              <FormControl>
                <TableSelect
                  field={field}
                  tables={tableOptions}
                  onChange={(table) => {
                    form.setValue("tableName", table);
                    form.setValue("filters", []);
                    form.setValue("searchTerms", []);
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="button"
          variant="ghost"
          size="default"
          className="mt-2 rounded-xl  w-full justify-between"
          onClick={() => {
            form.setValue(`filters`, [
              ...form.getValues().filters,
              { property: "", values: [] },
            ]);
          }}
        >
          Add Filter
          <Plus />
        </Button>
        <FilterForm
          form={form}
          tableName={form.watch("tableName")}
          properties={properties ?? []}
        />
      </form>
    </Form>
  );
}
