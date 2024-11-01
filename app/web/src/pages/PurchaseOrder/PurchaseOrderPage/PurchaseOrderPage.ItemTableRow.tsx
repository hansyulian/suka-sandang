import { Table, TextInput, NumberInput, Text, Box, Group } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { memo, useEffect } from "react";
import { IconButton } from "~/components/IconButton";
import { SelectE } from "~/components/SelectE";
import { Api } from "~/config/api";
import { useMaterialSelectOptions } from "~/hooks/useMaterialSelectOptions";
import { PurchaseOrderItemForm } from "~/types";
import { formatCurrency } from "~/utils/formatCurrency";
import { formValidations } from "~/utils/formValidations";

export type PurchaseOrderItemTableRowProps = {
  initialData?: PurchaseOrderItemForm;
  disabled?: boolean;
  onDelete: (index: number) => void;
  onFormChange: (
    index: number,
    form: UseFormReturnType<PurchaseOrderItemForm>
  ) => void;
  index: number;
};

export const PurchaseOrderItemTableRow = memo(function (
  props: PurchaseOrderItemTableRowProps
) {
  const { initialData, disabled, onFormChange, index, onDelete } = props;
  const materialNameOptions = useMaterialSelectOptions("name");
  const materialCodeOptions = useMaterialSelectOptions("code");

  const form = useForm<PurchaseOrderItemForm>({
    initialValues: {
      materialId: "",
      quantity: 0,
      unitPrice: 0,
      remarks: "",
      ...initialData,
    },
    validateInputOnBlur: true,
    validate: {
      materialId: formValidations({ required: true }),
      quantity: formValidations({ required: true }),
      unitPrice: formValidations({ required: true }),
    },
  });
  const { setValues, values } = form;

  const { data: selectedMaterial } = Api.material.getMaterial.useRequest(
    { idOrCode: values.materialId },
    {},
    {
      enabled: !!values.materialId,
    }
  );

  useEffect(() => {
    if (!selectedMaterial) {
      return;
    }
    if (initialData?.materialId === selectedMaterial?.id) {
      return;
    }
    setValues({
      unitPrice: selectedMaterial.purchasePrice || 0,
    });
  }, [initialData?.materialId, selectedMaterial, setValues]);

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
        <SelectE
          searchable
          disabled={disabled}
          data={materialCodeOptions}
          {...form.getInputProps("materialId")}
        />
      </Table.Td>
      <Table.Td valign="top">
        <SelectE
          searchable
          disabled={disabled}
          data={materialNameOptions}
          {...form.getInputProps("materialId")}
        />
      </Table.Td>
      <Table.Td valign="middle" ta="center">
        {selectedMaterial?.color && (
          <Box bg={selectedMaterial.color} h="20" w="100%" />
        )}
      </Table.Td>
      <Table.Td valign="top">
        <TextInput disabled={disabled} {...form.getInputProps("remarks")} />
      </Table.Td>
      <Table.Td valign="top">
        <NumberInput disabled={disabled} {...form.getInputProps("quantity")} />
      </Table.Td>
      <Table.Td valign="top">
        <NumberInput disabled={disabled} {...form.getInputProps("unitPrice")} />
      </Table.Td>
      <Table.Td valign="middle" ta="right">
        <Text>{formatCurrency(values.quantity * values.unitPrice)}</Text>
      </Table.Td>
      <Table.Td valign="middle">
        <Group>
          <IconButton
            name="delete"
            color="red"
            onClick={() => onDelete(index)}
          />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
});
