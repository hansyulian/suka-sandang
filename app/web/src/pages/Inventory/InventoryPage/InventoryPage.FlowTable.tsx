import { sum } from "@hyulian/common";
import { Button, Table, Text } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { memo, useCallback, useEffect, useState } from "react";
import { Icon } from "~/components/Icon";
import { InventoryFlowTableRow } from "~/pages/Inventory/InventoryPage/InventoryPage.FlowTableRow";
import { InventoryFlowForm } from "~/types";

export type InventoryFlowTableProps = {
  initialData: InventoryFlowForm[];
  disabled?: boolean;
  onFormsChange: (values: UseFormReturnType<InventoryFlowForm>[]) => void;
};

export const InventoryFlowTable = memo(function (
  props: InventoryFlowTableProps
) {
  const { initialData, disabled, onFormsChange } = props;
  const [records, setRecords] = useState<InventoryFlowForm[]>(initialData);
  const [forms, setForms] = useState<UseFormReturnType<InventoryFlowForm>[]>(
    []
  );
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setRecords(initialData);
  }, [initialData]);

  useEffect(() => {
    setTotal(sum(records, (form) => form.quantity));
  }, [records]);

  const addRow = () => {
    setRecords([
      ...records,
      {
        activity: "adjustment",
        quantity: 0,
      },
    ]);
  };

  const handleFormChange = useCallback(
    (index: number, form: UseFormReturnType<InventoryFlowForm>) => {
      setForms((prevState) => {
        const newState = [...prevState];
        newState[index] = form;
        setTotal(
          sum(newState, (record) => {
            const parsed = parseFloat(record.values.quantity as never);
            if (isNaN(parsed)) {
              return 0;
            }
            return parsed;
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
      <Table striped withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th ta="center" w="150">
              Activity
            </Table.Th>
            <Table.Th ta="center">Remarks</Table.Th>
            <Table.Th ta="center" w="200">
              Quantity
            </Table.Th>
            <Table.Th w="50"></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {records.map((record, index) => (
            <InventoryFlowTableRow
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
            <Table.Td colSpan={2} />
            <Table.Td colSpan={1} ta="right">
              <Text fw="bold">{total}</Text>
            </Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
});
