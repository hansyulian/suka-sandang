import { PaginatedArrayResponse } from "@hyulian/api-contract";
import { Table } from "@mantine/core";
import { ReactNode } from "react";
import { usePersistable } from "~/hooks/usePersistable";

export type DataTableProps<T extends object> = {
  data: PaginatedArrayResponse<T> | undefined;
  headers: ReactNode;
  renderRow: (record: T, index: number) => ReactNode;
};

export function DataTable<T extends object>(props: DataTableProps<T>) {
  const { headers, data: d, renderRow } = props;
  const data = usePersistable(d);

  return (
    <Table.ScrollContainer minWidth="100%">
      <Table>
        <Table.Thead>
          <Table.Tr>{headers}</Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data?.records.map((record, index) => (
            <Table.Tr key={`data-table-row-${index}`}>
              {renderRow(record, index)}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}
