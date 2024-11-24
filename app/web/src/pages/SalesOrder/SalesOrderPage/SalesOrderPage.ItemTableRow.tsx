import { ContractResponseModel } from "@hyulian/react-api-contract";
import { Table, Text } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { memo, useCallback, useEffect } from "react";
import { IconButton } from "~/components/IconButton";
import { NumberInputE } from "~/components/NumberInputE";
import { SelectColor } from "~/components/SelectColor";
import { TextInputE } from "~/components/TextInputE";
import {
  getInventoryApi,
  getInventoryOptionsApi,
} from "~/config/api/inventoryApi";
import { useInventorySelectOptions } from "~/hooks/useInventorySelectOptions";
import { SalesOrderItemForm } from "~/types";
import { formatCurrency } from "~/utils/formatCurrency";
import { formValidations } from "~/utils/formValidations";

export type SalesOrderItemTableRowProps = {
  initialData?: SalesOrderItemForm;
  disabled?: boolean;
  onDelete: (index: number) => void;
  onFormChange: (
    index: number,
    form: UseFormReturnType<SalesOrderItemForm>
  ) => void;
  index: number;
};

export const SalesOrderItemTableRow = memo(function (
  props: SalesOrderItemTableRowProps
) {
  const { initialData, disabled, onFormChange, index, onDelete } = props;
  const inventorySelectOptions = useInventorySelectOptions("name-code");

  const form = useForm<SalesOrderItemForm>({
    initialValues: {
      inventoryId: "",
      quantity: 0,
      unitPrice: 0,
      remarks: "",
      ...initialData,
    },
    validateInputOnBlur: true,
    validate: {
      inventoryId: formValidations({ required: true }),
      quantity: formValidations({ required: true }),
      unitPrice: formValidations({ required: true }),
    },
  });
  const { setValues, values, getInputProps } = form;
  const { data: selectedInventory } = getInventoryApi.useRequest(
    { idOrCode: form.values.inventoryId },
    {}
  );
  const selectedMaterial = selectedInventory?.material;
  const optionColorExtractor = useCallback(
    (
      record: SelectionOption<
        string,
        ContractResponseModel<typeof getInventoryOptionsApi>
      >
    ) => record.data?.material.color,
    []
  );

  useEffect(() => {
    if (!selectedMaterial) {
      return;
    }
    if (initialData?.inventoryId === selectedInventory?.id) {
      return;
    }
    setValues({
      unitPrice: selectedMaterial.retailPrice || 0,
    });
  }, [
    initialData?.inventoryId,
    selectedInventory,
    selectedMaterial,
    setValues,
  ]);

  useEffect(() => {
    if (initialData) {
      setValues(initialData);
    }
  }, [initialData, setValues]);

  useEffect(() => {
    onFormChange(index, form);
  }, [index, onFormChange, form]);

  return (
    <Table.Tr>
      <Table.Td valign="top">
        <SelectColor
          flex={1}
          color={selectedMaterial?.color}
          disabled={disabled}
          data={inventorySelectOptions}
          searchable
          plainDisabled
          optionColorExtractor={optionColorExtractor}
          {...getInputProps("inventoryId")}
        />
      </Table.Td>
      <Table.Td valign="top">
        <TextInputE
          plainDisabled
          disabled={disabled}
          {...form.getInputProps("remarks")}
        />
      </Table.Td>
      <Table.Td valign="top" ta="right">
        <NumberInputE
          rightAlign
          plainDisabled
          disabled={disabled}
          max={selectedInventory?.total || 0}
          {...form.getInputProps("quantity")}
        />
      </Table.Td>
      <Table.Td valign="top" ta="right">
        <NumberInputE
          rightAlign
          disabled={disabled}
          plainDisabled
          {...form.getInputProps("unitPrice")}
        />
      </Table.Td>
      <Table.Td valign="top" ta="right">
        <Text>{formatCurrency(values.quantity * values.unitPrice)}</Text>
      </Table.Td>
      <Table.Td ta="center">
        <IconButton name="delete" color="red" onClick={() => onDelete(index)} />
      </Table.Td>
    </Table.Tr>
  );
});
