import { ContractResponseModel } from "@hyulian/react-api-contract";
import { Center, Group, Stack, Table } from "@mantine/core";
import { AppLink } from "~/components/AppLink";
import { AppLinkIcon } from "~/components/AppLinkIcon";
import { DataTable } from "~/components/DataTable";
import { IconButton } from "~/components/IconButton";
import { LinkButton } from "~/components/LinkButton";
import { PageHeader } from "~/components/PageHeader";
import { PaginationController } from "~/components/PaginationController";
import { SortableTableHeader } from "~/components/SortableTableHeader";
import { TextBox } from "~/components/TextBox";
import { Api } from "~/config/api";
import { useConfirmationDialog } from "~/hooks/useConfirmationDialog";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { usePaginationManager } from "~/hooks/usePaginationManager";
import { useReactiveState } from "~/hooks/useReactiveState";
import { useSearchQuery } from "~/hooks/useSearchQuery";
import { useSortManager } from "~/hooks/useSortManager";
import { useUpdateSearchQuery } from "~/hooks/useUpdateSearchQuery";
import { formatCurrency } from "~/utils/formatCurrency";
import { formatDate } from "~/utils/formatDate";

export default function PurchaseOrderListPage() {
  const query = useSearchQuery("purchaseOrderList");
  const [searchText, setSearchText] = useReactiveState(query.search || "");
  const updateSearchQuery = useUpdateSearchQuery(
    "purchaseOrderList",
    {},
    query
  );
  const confirmationDialog = useConfirmationDialog();
  const invalidateQuery = useInvalidateQuery();
  const paginationManager = usePaginationManager(query, {
    onChange: updateSearchQuery,
  });
  const sortManager = useSortManager(query, {
    onChange: updateSearchQuery,
  });

  const { data } = Api.purchaseOrder.listPurchaseOrder.useRequest({}, query);
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
    record: ContractResponseModel<typeof Api.purchaseOrder.listPurchaseOrder>
  ) => {
    confirmationDialog({
      title: "Confirm Deletion?",
      children: `Are you sure want to delete ${record.code}`,
      highlight: [record.code],
      variant: "danger",
      onConfirm: async () => {
        await Api.purchaseOrder.deletePurchaseOrder.request(
          { id: record.id },
          {}
        );
        await invalidateQuery("purchaseOrder");
      },
    });
  };

  return (
    <Stack>
      <PageHeader title="Purchase Orders">
        <TextBox
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          icon="search"
          onEnterKey={updateSearch}
          onClear={onClear}
          clearable
        />
        <LinkButton iconName="add" target="purchaseOrderAdd" params={{}}>
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
            <SortableTableHeader sortManager={sortManager} column="supplier">
              Supplier
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="date">
              Date
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="status">
              Status
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="total">
              Total
            </SortableTableHeader>
            <Table.Th></Table.Th>
          </>
        }
        renderRow={(record) => (
          <>
            <Table.Td>{record.code}</Table.Td>
            <Table.Td>
              <AppLink
                target="supplierEdit"
                params={{ id: record.supplier.id }}
              >
                {record.supplier.name}
              </AppLink>
            </Table.Td>
            <Table.Td ta="center">{formatDate(record.date)}</Table.Td>
            <Table.Td ta="center">{record.status}</Table.Td>
            <Table.Td align="right">{formatCurrency(record.total)}</Table.Td>
            <Table.Td>
              <Group>
                <AppLinkIcon
                  target="purchaseOrderEdit"
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
