import { UseFormReturn, useFieldArray } from "react-hook-form";
import { FormField } from "@/components/ui/form";
import PropertySearchCombobox from "./filter-property-combobox";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import FilterMultiSelectCombobox from "./filter-multiselect-combobox";
import { TableProperty } from "@/lib/actions";
import { TableSearchParams } from "./table-search-form";

interface FilterFormProps {
  form: UseFormReturn<TableSearchParams, any, undefined>;
  tableName: string;
  properties: TableProperty[];
}

export default function FilterForm({
  form,
  tableName,
  properties,
}: FilterFormProps) {
  const { fields, remove } = useFieldArray({
    name: `filters`,
    control: form.control,
  });

  if (!tableName) return <div>Please select a table first</div>;

  return (
    <div className="p-2">
      {fields.map((field, index) => {
        return (
          <div
            className="grid grid-cols-4 gap-4 items-center"
            key={`filters.${index}`}
          >
            <FormField
              control={form.control}
              name={`filters.${index}.property`}
              render={({ field }) => (
                <PropertySearchCombobox
                  index={index}
                  field={field}
                  properties={properties}
                  onChange={(property) => {
                    form.setValue(`filters.${index}.property`, property);
                    form.setValue(`filters.${index}.values`, []);
                  }}
                />
              )}
            />
            <FilterMultiSelectCombobox
              form={form}
              tableName={tableName}
              property={form.getValues().filters[index].property}
              index={index}
              onSelectionChange={(selectedItems) => {
                form.setValue(`filters.${index}.values`, selectedItems);
              }}
            />
            <Button
              className="max-w-fit px-0 p-1 rounded-lg ml-auto h-fit"
              size={"sm"}
              variant={"ghost"}
              onClick={() => remove(index)}
            >
              <XIcon className="h-6 w-6" />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
