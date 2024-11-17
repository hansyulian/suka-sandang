import { Table, TextInput, Stack } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { memo, useEffect, useMemo } from "react";
import { IconButton } from "~/components/IconButton";
import { NumberInputE } from "~/components/NumberInputE";
import { SelectE } from "~/components/SelectE";
import { useInventoryFlowActivityOptions } from "~/hooks/useInventoryFlowActivityOptions";
import { InventoryFlowForm } from "~/types";
import { formValidations } from "~/utils/formValidations";

export type InventoryFlowTableRowProps = {
  initialData?: InventoryFlowForm;
  disabled?: boolean;
  onDelete: (index: number) => void;
  onFormChange: (
    index: number,
    form: UseFormReturnType<InventoryFlowForm>
  ) => void;
  index: number;
};

export const InventoryFlowTableRow = memo(function (
  props: InventoryFlowTableRowProps
) {
  const { initialData, disabled, onFormChange, index, onDelete } = props;
  const inventoryFlowActivityOptions = useInventoryFlowActivityOptions();

  const form = useForm<InventoryFlowForm>({
    initialValues: {
      activity: "adjustment",
      quantity: 0,
      remarks: "",
      ...initialData,
    },
    validateInputOnBlur: true,
    validate: {
      activity: formValidations({ required: true }),
      quantity: formValidations({ required: true }),
    },
  });
  const { setValues } = form;

  useEffect(() => {
    if (initialData) {
      setValues(initialData);
    }
  }, [initialData, setValues]);

  useEffect(() => {
    onFormChange(index, form);
  }, [index, onFormChange, form]);

  const isEditableActivity = useMemo(() => {
    return !["sales", "procurement"].includes(initialData?.activity || "");
  }, [initialData?.activity]);

  return (
    <Table.Tr>
      <Table.Td>
        <SelectE
          searchable
          plainDisabled
          disabled={disabled || !isEditableActivity}
          data={inventoryFlowActivityOptions}
          {...form.getInputProps("activity")}
        />
      </Table.Td>
      <Table.Td valign="top">
        <TextInput disabled={disabled} {...form.getInputProps("remarks")} />
      </Table.Td>
      <Table.Td ta="right">
        <NumberInputE
          disabled={disabled || !isEditableActivity}
          rightAlign
          plainDisabled
          {...form.getInputProps("quantity")}
        />
      </Table.Td>
      <Table.Td>
        <Stack align="center">
          <IconButton
            name="delete"
            color="red"
            onClick={() => onDelete(index)}
          />
        </Stack>
      </Table.Td>
    </Table.Tr>
  );
});
