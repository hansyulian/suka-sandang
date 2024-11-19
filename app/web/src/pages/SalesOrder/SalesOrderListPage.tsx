import { ContractResponseModel } from "@hyulian/react-api-contract";
import { Center, Group, Stack, Table } from "@mantine/core";
import { AppLinkIcon } from "~/components/AppLinkIcon";
import { DataTable } from "~/components/DataTable";
import { IconButton } from "~/components/IconButton";
import { LinkButton } from "~/components/LinkButton";
import { PageHeader } from "~/components/PageHeader";
import { PaginationController } from "~/components/PaginationController";
import { SortableTableHeader } from "~/components/SortableTableHeader";
import { StatusBadge } from "~/components/StatusBadge";
import { TextBox } from "~/components/TextBox";
import {
  deleteSalesOrderApi,
  listSalesOrderApi,
} from "~/config/api/salesOrderApi";
import { useConfirmationDialog } from "~/hooks/useConfirmationDialog";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { usePaginationManager } from "~/hooks/usePaginationManager";
import { useReactiveState } from "~/hooks/useReactiveState";
import { useSearchQuery } from "~/hooks/useSearchQuery";
import { useSortManager } from "~/hooks/useSortManager";
import { useUpdateSearchQuery } from "~/hooks/useUpdateSearchQuery";
import { formatCurrency } from "~/utils/formatCurrency";
import { formatDate } from "~/utils/formatDate";

export default function Page() {
  const query = useSearchQuery("salesOrderList");
  const [searchText, setSearchText] = useReactiveState(query.search || "");
  const updateSearchQuery = useUpdateSearchQuery("salesOrderList", {}, query);
  const confirmationDialog = useConfirmationDialog();
  const invalidateQuery = useInvalidateQuery();
  const paginationManager = usePaginationManager(query, {
    onChange: updateSearchQuery,
  });
  const sortManager = useSortManager(query, {
    onChange: updateSearchQuery,
  });

  const { data } = listSalesOrderApi.useRequest({}, query);
  const updateSearch = () => {
    updateSearchQuery({
      search: searchText,
    });
  };
  const onClear = () => {
    updateSearchQuery({
      search: "",
    });
  };
  const promptDelete = (
    record: ContractResponseModel<typeof listSalesOrderApi>
  ) => {
    confirmationDialog({
      title: "Confirm Deletion?",
      children: `Are you sure want to delete ${record.code}`,
      highlight: [record.code],
      variant: "danger",
      onConfirm: async () => {
        await deleteSalesOrderApi.request({ id: record.id }, {});
        await invalidateQuery("salesOrder");
      },
    });
  };

  return (
    <Stack>
      <PageHeader title="Sales Orders">
        <TextBox
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          icon="search"
          onEnterKey={updateSearch}
          onClear={onClear}
          clearable
        />
        <LinkButton iconName="add" target="salesOrderAdd" params={{}}>
          Add
        </LinkButton>
      </PageHeader>

      <DataTable
        data={data}
        headers={
          <>
            <SortableTableHeader sortManager={sortManager} column="code">
              Code
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="customer">
              Customer
            </SortableTableHeader>
            <SortableTableHeader
              sortManager={sortManager}
              column="date"
              justify="center"
              w="150"
            >
              Date
            </SortableTableHeader>
            <SortableTableHeader
              sortManager={sortManager}
              column="status"
              justify="center"
              w="150"
            >
              Status
            </SortableTableHeader>
            <SortableTableHeader
              sortManager={sortManager}
              column="total"
              justify="flex-end"
              w="150"
            >
              Total
            </SortableTableHeader>
            <Table.Th w="100"></Table.Th>
          </>
        }
        renderRow={(record) => (
          <>
            <Table.Td>{record.code}</Table.Td>
            <Table.Td>
              <Group gap="xs">
                <AppLinkIcon
                  target="customerEdit"
                  params={{ id: record.customer.id }}
                  name="openLink"
                  variant="light"
                />
                {record.customer.name}
              </Group>
            </Table.Td>
            <Table.Td ta="center">{formatDate(record.date)}</Table.Td>
            <Table.Td ta="center">
              <StatusBadge w="100%" status={record.status} />
            </Table.Td>
            <Table.Td align="right">{formatCurrency(record.total)}</Table.Td>
            <Table.Td>
              <Group justify="center">
                <AppLinkIcon
                  target="salesOrderEdit"
                  params={{ idOrCode: record.id }}
                  name="edit"
                ></AppLinkIcon>
                <IconButton
                  color="red"
                  name="delete"
                  onClick={() => promptDelete(record)}
                ></IconButton>
              </Group>
            </Table.Td>
          </>
        )}
      />
      <Center>
        <PaginationController
          info={data?.info}
          paginationManager={paginationManager}
        ></PaginationController>
      </Center>
    </Stack>
  );
}
