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
import { deleteCustomerApi, listCustomerApi } from "~/config/api/customerApi";
import { useConfirmationDialog } from "~/hooks/useConfirmationDialog";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { usePaginationManager } from "~/hooks/usePaginationManager";
import { useReactiveState } from "~/hooks/useReactiveState";
import { useSearchQuery } from "~/hooks/useSearchQuery";
import { useSortManager } from "~/hooks/useSortManager";
import { useUpdateSearchQuery } from "~/hooks/useUpdateSearchQuery";

export default function CustomerListPage() {
  const query = useSearchQuery("customerList");
  const [searchText, setSearchText] = useReactiveState(query.search || "");
  const updateSearchQuery = useUpdateSearchQuery("customerList", {}, query);
  const confirmationDialog = useConfirmationDialog();
  const invalidateQuery = useInvalidateQuery();
  const paginationManager = usePaginationManager(query, {
    onChange: updateSearchQuery,
  });
  const sortManager = useSortManager(query, {
    onChange: updateSearchQuery,
  });

  const { data } = listCustomerApi.useRequest({}, query);
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
    record: ContractResponseModel<typeof listCustomerApi>
  ) => {
    confirmationDialog({
      title: "Confirm Deletion?",
      children: `Are you sure want to delete ${record.name}`,
      highlight: [record.name],
      variant: "danger",
      onConfirm: async () => {
        await deleteCustomerApi.request({ id: record.id }, {});
        await invalidateQuery("customer");
      },
    });
  };

  return (
    <Stack>
      <PageHeader title="Customers">
        <TextBox
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          icon="search"
          onEnterKey={updateSearch}
          onClear={onClear}
          clearable
        />
        <LinkButton iconName="add" target="customerAdd" params={{}}>
          Add
        </LinkButton>
      </PageHeader>

      <DataTable
        data={data}
        headers={
          <>
            <SortableTableHeader sortManager={sortManager} column="name">
              Name
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="identity">
              Identity
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="email">
              Email
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="phone">
              Phone
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="address">
              Address
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="status">
              Status
            </SortableTableHeader>
            <Table.Th></Table.Th>
          </>
        }
        renderRow={(record) => (
          <>
            <Table.Td>{record.name}</Table.Td>
            <Table.Td>{record.identity}</Table.Td>
            <Table.Td>{record.email}</Table.Td>
            <Table.Td>{record.phone}</Table.Td>
            <Table.Td>{record.address}</Table.Td>
            <Table.Td>
              <StatusBadge status={record.status} />
            </Table.Td>
            <Table.Td>
              <Group>
                <AppLinkIcon
                  target="customerEdit"
                  params={{ id: record.id }}
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
