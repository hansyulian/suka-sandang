import { PurchaseOrderItemAttributes } from "@app/common";
import { Button, Table, Text } from "@mantine/core";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Icon } from "~/components/Icon";
import {
  PurchaseOrderItemTableRow,
  PurchaseOrderItemTableRowHandler,
} from "~/pages/PurchaseOrder/PurchaseOrderPage/PurchaseOrderPage.ItemTableRow";
import { PurchaseOrderItemForm } from "~/types";

export type PurchaseOrderItemTableProps = {
  initialData: PurchaseOrderItemAttributes[];
  disabled?: boolean;
};

export type PurchaseOrderItemTableHandler = {
  validate: () => boolean;
  getValues: () => PurchaseOrderItemForm[];
};

export const PurchaseOrderItemTable = forwardRef<
  PurchaseOrderItemTableHandler,
  PurchaseOrderItemTableProps
>(function (props, ref) {
  const { initialData, disabled } = props;
  const [records, setRecords] = useState<PurchaseOrderItemForm[]>(initialData);
  const rowRefs = useRef<PurchaseOrderItemTableRowHandler[]>([]);

  useEffect(() => {
    setRecords(initialData);
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

  const setRowRef = (
    index: number,
    ref: PurchaseOrderItemTableRowHandler | null
  ) => {
    if (ref) {
      rowRefs.current[index] = ref;
    }
  };

  useImperativeHandle(
    ref,
    () => {
      return {
        validate: () => {
          for (const ref of rowRefs.current) {
            const { hasErrors } = ref.validate();
            if (hasErrors) {
              return false;
            }
          }
          return true;
        },
        getValues: () => {
          return rowRefs.current.map((ref) => ref.getValues());
        },
      };
    },
    []
  );

  return (
    <Table.ScrollContainer minWidth="100%">
      <Table striped>
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
              initialData={record}
              disabled={disabled}
              ref={(ref) => setRowRef(index, ref)}
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
            <Table.Td colSpan={8} align="right">
              <Text fw="bold"></Text>
            </Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
});
