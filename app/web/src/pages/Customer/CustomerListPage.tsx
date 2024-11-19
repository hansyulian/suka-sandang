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
import { useNavigate } from "~/hooks/useNavigate";
import { usePaginationManager } from "~/hooks/usePaginationManager";
import { useParams } from "~/hooks/useParams";
import { useReactiveState } from "~/hooks/useReactiveState";
import { useSearchQuery } from "~/hooks/useSearchQuery";
import { useSortManager } from "~/hooks/useSortManager";
import { useUpdateSearchQuery } from "~/hooks/useUpdateSearchQuery";
import { CustomerListFormModal } from "~/pages/Customer/CustomerListPage/CustomerListFormModal";

export default function Page() {
  const query = useSearchQuery("customer");
  const { param } = useParams("customer");
  const [searchText, setSearchText] = useReactiveState(query.search || "");
  const updateSearchQuery = useUpdateSearchQuery("customer", {}, query);
  const confirmationDialog = useConfirmationDialog();
  const invalidateQuery = useInvalidateQuery();
  const navigate = useNavigate();
  const paginationManager = usePaginationManager(query, {
    onChange: updateSearchQuery,
  });
  const sortManager = useSortManager(query, {
    onChange: updateSearchQuery,
  });
  const isFormModalVisible = !!param;

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
  const closeFormModal = () => {
    navigate("customer", {}, query);
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
        <LinkButton
          iconName="add"
          target="customer"
          params={{ param: "add" }}
          query={query}
        >
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
            <SortableTableHeader
              sortManager={sortManager}
              column="status"
              justify="center"
              w="150"
            >
              Status
            </SortableTableHeader>
            <Table.Th w="100"></Table.Th>
          </>
        }
        renderRow={(record) => (
          <>
            <Table.Td>{record.name}</Table.Td>
            <Table.Td>{record.identity}</Table.Td>
            <Table.Td>{record.email}</Table.Td>
            <Table.Td>{record.phone}</Table.Td>
            <Table.Td>{record.address}</Table.Td>
            <Table.Td ta="center">
              <StatusBadge w="100%" status={record.status} />
            </Table.Td>
            <Table.Td>
              <Group justify="center">
                <AppLinkIcon
                  target="customer"
                  params={{ param: record.id }}
                  query={query}
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
      <CustomerListFormModal
        isVisible={isFormModalVisible}
        onClose={closeFormModal}
      />
    </Stack>
  );
}
