import { Table, TextInput, NumberInput, Text, Box, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormValidationResult } from "node_modules/@mantine/form/lib/types";
import { forwardRef, useEffect, useImperativeHandle } from "react";
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
};

export type PurchaseOrderItemTableRowHandler = {
  validate: () => FormValidationResult;
  getValues: () => PurchaseOrderItemForm;
};

export const PurchaseOrderItemTableRow = forwardRef<
  PurchaseOrderItemTableRowHandler,
  PurchaseOrderItemTableRowProps
>(function (props, ref) {
  const { initialData, disabled } = props;
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

  const promptDelete = () => {};

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

  useImperativeHandle(
    ref,
    () => {
      return {
        validate: form.validate,
        getValues: () => form.values,
      };
    },
    [form.validate, form.values]
  );

  useEffect(() => {
    if (initialData) {
      setValues(initialData);
    }
  }, [initialData, setValues]);

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
          <IconButton name="delete" color="red" onClick={promptDelete} />
        </Group>
      </Table.Td>
    </Table.Tr>
  );
});
