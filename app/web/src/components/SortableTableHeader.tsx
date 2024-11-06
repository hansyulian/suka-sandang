import { Group, GroupProps, Table } from "@mantine/core";
import { PropsWithChildren } from "react";
import { IconButton } from "~/components/IconButton";
import { useSortManager } from "~/hooks/useSortManager";

export type SortableTableHeaderProps = PropsWithChildren<{
  column: string;
  sortManager: ReturnType<typeof useSortManager>;
  justify?: GroupProps["justify"];
}>;

export function SortableTableHeader(props: SortableTableHeaderProps) {
  const { column, children, sortManager, justify } = props;
  const { orderBy, orderDirection } = sortManager.value;

  const toggle = () => {
    if (orderBy !== column) {
      sortManager.set.orderBy(column);
      sortManager.set.orderDirection("asc");
    } else {
      sortManager.set.orderDirection(orderDirection === "asc" ? "desc" : "asc");
    }
  };

  return (
    <Table.Th>
      <Group gap="xs" justify={justify}>
        {children}
        {orderBy === column ? (
          <IconButton
            name={orderDirection === "asc" ? "sortAscending" : "sortDescending"}
            variant="white"
            onClick={toggle}
          />
        ) : (
          <IconButton
            variant="white"
            onClick={toggle}
            name="sortable"
            color="gray"
          />
        )}
      </Group>
    </Table.Th>
  );
}
