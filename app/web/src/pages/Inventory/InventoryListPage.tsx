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
  deleteInventoryApi,
  listInventoryApi,
} from "~/config/api/inventoryApi";
import { useConfirmationDialog } from "~/hooks/useConfirmationDialog";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { usePaginationManager } from "~/hooks/usePaginationManager";
import { useReactiveState } from "~/hooks/useReactiveState";
import { useSearchQuery } from "~/hooks/useSearchQuery";
import { useSortManager } from "~/hooks/useSortManager";
import { useUpdateSearchQuery } from "~/hooks/useUpdateSearchQuery";
import { formatCurrency } from "~/utils/formatCurrency";

export default function Page() {
  const query = useSearchQuery("inventoryList");
  const [searchText, setSearchText] = useReactiveState(query.search || "");
  const updateSearchQuery = useUpdateSearchQuery("inventoryList", {}, query);
  const confirmationDialog = useConfirmationDialog();
  const invalidateQuery = useInvalidateQuery();
  const paginationManager = usePaginationManager(query, {
    onChange: updateSearchQuery,
  });
  const sortManager = useSortManager(query, {
    onChange: updateSearchQuery,
  });

  const { data } = listInventoryApi.useRequest({}, query);
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
    record: ContractResponseModel<typeof listInventoryApi>
  ) => {
    confirmationDialog({
      title: "Confirm Deletion?",
      children: `Are you sure want to delete ${record.code}`,
      highlight: [record.code],
      variant: "danger",
      onConfirm: async () => {
        await deleteInventoryApi.request({ id: record.id }, {});
        await invalidateQuery("inventory");
      },
    });
  };

  return (
    <Stack>
      <PageHeader title="Inventories">
        <TextBox
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          icon="search"
          onEnterKey={updateSearch}
          onClear={onClear}
          clearable
        />
        <LinkButton iconName="add" target="inventoryAdd" params={{}}>
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
            <SortableTableHeader
              sortManager={sortManager}
              column="materialName"
            >
              Material
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
                  target="materialEdit"
                  params={{ idOrCode: record.material.code }}
                  name="openLink"
                  variant="light"
                />
                {record.material.name} ({record.material.code})
              </Group>
            </Table.Td>
            <Table.Td ta="center">
              <StatusBadge status={record.status} w="100%" />
            </Table.Td>
            <Table.Td align="right">{formatCurrency(record.total)}</Table.Td>
            <Table.Td>
              <Group justify="center">
                <AppLinkIcon
                  target="inventoryEdit"
                  params={{ idOrCode: record.code }}
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
