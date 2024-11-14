import { sum } from "@hyulian/common";
import { Button, Table, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { memo, useCallback, useEffect, useState } from "react";
import { Icon } from "~/components/Icon";
import { PurchaseOrderItemTableRow } from "~/pages/PurchaseOrder/PurchaseOrderPage/PurchaseOrderPage.ItemTableRow";
import { PurchaseOrderItemForm } from "~/types";
import { formatCurrency } from "~/utils/formatCurrency";

export type PurchaseOrderItemTableProps = {
  initialData?: PurchaseOrderItemForm[];
  disabled?: boolean;
  onFormsChange: (values: UseFormReturnType<PurchaseOrderItemForm>[]) => void;
};

export const PurchaseOrderItemTable = memo(function (
  props: PurchaseOrderItemTableProps
) {
  const { initialData, disabled, onFormsChange } = props;
  const [records, setRecords] = useState<PurchaseOrderItemForm[]>(
    initialData || []
  );
  const [forms, setForms] = useState<
    UseFormReturnType<PurchaseOrderItemForm>[]
  >([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (initialData) {
      setRecords(initialData);
      setTotal(
        sum(initialData, (record) => record.quantity * record.unitPrice)
      );
    }
  }, [initialData]);

  const addRow = () => {
    setRecords([
      ...records,
      {
        materialId: "",
        quantity: 0,
        unitPrice: 0,
      },
    ]);
  };

  const handleFormChange = useCallback(
    (index: number, form: UseFormReturnType<PurchaseOrderItemForm>) => {
      setForms((prevState) => {
        const newState = [...prevState];
        newState[index] = form;
        setTotal(
          sum(newState, (form) => {
            const quantity = parseFloat(form.values.quantity as never);
            if (isNaN(quantity)) {
              return 0;
            }
            const unitPrice = parseFloat(form.values.unitPrice as never);
            if (isNaN(unitPrice)) {
              return 0;
            }
            return quantity * unitPrice;
          })
        );
        return newState;
      });
    },
    []
  );

  const handleRecordDelete = useCallback((index: number) => {
    setRecords((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
    setForms((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  }, []);

  useEffect(() => {
    onFormsChange(forms);
  }, [forms, onFormsChange]);

  return (
    <Table.ScrollContainer minWidth="100%">
      <Table striped withColumnBorders withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta="center">Code</Table.Th>
            <Table.Th ta="center">Name</Table.Th>
            <Table.Th ta="center">Color</Table.Th>
            <Table.Th ta="center">Remarks</Table.Th>
            <Table.Th ta="center">Quantity</Table.Th>
            <Table.Th ta="center">Price</Table.Th>
            <Table.Th ta="center">Total</Table.Th>
            <Table.Th></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {records.map((record, index) => (
            <PurchaseOrderItemTableRow
              key={`item-${index}`}
              initialData={record}
              disabled={disabled}
              index={index}
              onFormChange={handleFormChange}
              onDelete={handleRecordDelete}
            />
          ))}
          {!disabled && (
            <Table.Tr>
              <Table.Td colSpan={8} align="center">
                <Button leftSection={<Icon name="add"></Icon>} onClick={addRow}>
                  Add
                </Button>
              </Table.Td>
            </Table.Tr>
          )}
          <Table.Tr>
            <Table.Td colSpan={7} align="right">
              <Text fw="bold">{formatCurrency(total)}</Text>
            </Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
});
