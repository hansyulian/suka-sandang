import { Table, Text, TextInput, Stack } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { memo, useEffect, useMemo } from "react";
import { IconButton } from "~/components/IconButton";
import { NumberInputE } from "~/components/NumberInputE";
import { SelectE } from "~/components/SelectE";
import { inventoryFlowActivityLabels } from "~/config/constants";
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
        {!isEditableActivity ? (
          <Text>
            {
              inventoryFlowActivityLabels[
                initialData?.activity || "procurement"
              ]
            }
          </Text>
        ) : (
          <SelectE
            searchable
            disabled={disabled}
            data={inventoryFlowActivityOptions}
            {...form.getInputProps("activity")}
          />
        )}
      </Table.Td>
      <Table.Td valign="top">
        <TextInput disabled={disabled} {...form.getInputProps("remarks")} />
      </Table.Td>
      <Table.Td ta="right">
        {isEditableActivity ? (
          <NumberInputE
            disabled={disabled}
            rightAlign
            {...form.getInputProps("quantity")}
          />
        ) : (
          <Text>{initialData?.quantity}</Text>
        )}
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
