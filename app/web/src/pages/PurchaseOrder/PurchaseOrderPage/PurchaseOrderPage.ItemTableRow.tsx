import { ContractResponseModel } from "@hyulian/react-api-contract";
import { Table, TextInput, Text } from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { memo, useCallback, useEffect } from "react";
import { IconButton } from "~/components/IconButton";
import { NumberInputE } from "~/components/NumberInputE";
import { SelectColor } from "~/components/SelectColor";
import {
  getMaterialApi,
  getMaterialOptionsApi,
} from "~/config/api/materialApi";
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
  const materialSelectOptions = useMaterialSelectOptions("name-code");

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
  const { setValues, values, getInputProps } = form;

  const { data: selectedMaterial } = getMaterialApi.useRequest(
    { idOrCode: values.materialId },
    {},
    {
      enabled: !!values.materialId,
    }
  );

  const optionColorExtractor = useCallback(
    (
      record: SelectionOption<
        string,
        ContractResponseModel<typeof getMaterialOptionsApi>
      >
    ) => record.data?.color,
    []
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
        <SelectColor
          flex={1}
          color={selectedMaterial?.color}
          disabled={disabled}
          data={materialSelectOptions}
          searchable
          optionColorExtractor={optionColorExtractor}
          {...getInputProps("materialId")}
        />
      </Table.Td>
      <Table.Td valign="top">
        <TextInput disabled={disabled} {...form.getInputProps("remarks")} />
      </Table.Td>
      <Table.Td valign="top">
        <NumberInputE
          rightAlign
          disabled={disabled}
          {...form.getInputProps("quantity")}
        />
      </Table.Td>
      <Table.Td valign="top">
        <NumberInputE
          rightAlign
          disabled={disabled}
          {...form.getInputProps("unitPrice")}
        />
      </Table.Td>
      <Table.Td valign="middle" ta="right">
        <Text>{formatCurrency(values.quantity * values.unitPrice)}</Text>
      </Table.Td>
      <Table.Td ta="center">
        <IconButton name="delete" color="red" onClick={() => onDelete(index)} />
      </Table.Td>
    </Table.Tr>
  );
});
