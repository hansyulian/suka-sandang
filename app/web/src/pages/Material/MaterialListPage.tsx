import { ContractResponseModel } from "@hyulian/react-api-contract";
import { Box, Center, Group, Stack, Table } from "@mantine/core";
import { AppLinkIcon } from "~/components/AppLinkIcon";
import { DataTable } from "~/components/DataTable";
import { IconButton } from "~/components/IconButton";
import { LinkButton } from "~/components/LinkButton";
import { PageHeader } from "~/components/PageHeader";
import { PaginationController } from "~/components/PaginationController";
import { SortableTableHeader } from "~/components/SortableTableHeader";
import { StatusBadge } from "~/components/StatusBadge";
import { TextBox } from "~/components/TextBox";
import { deleteMaterialApi, listMaterialApi } from "~/config/api/materialApi";
import { useConfirmationDialog } from "~/hooks/useConfirmationDialog";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { usePaginationManager } from "~/hooks/usePaginationManager";
import { useReactiveState } from "~/hooks/useReactiveState";
import { useSearchQuery } from "~/hooks/useSearchQuery";
import { useSortManager } from "~/hooks/useSortManager";
import { useUpdateSearchQuery } from "~/hooks/useUpdateSearchQuery";
import { formatCurrency } from "~/utils/formatCurrency";

export default function MaterialListPage() {
  const query = useSearchQuery("materialList");
  const [searchText, setSearchText] = useReactiveState(query.search || "");
  const updateSearchQuery = useUpdateSearchQuery("materialList", {}, query);
  const confirmationDialog = useConfirmationDialog();
  const invalidateQuery = useInvalidateQuery();
  const paginationManager = usePaginationManager(query, {
    onChange: updateSearchQuery,
  });
  const sortManager = useSortManager(query, {
    onChange: updateSearchQuery,
  });

  const { data } = listMaterialApi.useRequest({}, query);
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
    record: ContractResponseModel<typeof listMaterialApi>
  ) => {
    confirmationDialog({
      title: "Confirm Deletion?",
      children: `Are you sure want to delete ${record.name}`,
      highlight: [record.name],
      variant: "danger",
      onConfirm: async () => {
        await deleteMaterialApi.request({ id: record.id }, {});
        await invalidateQuery("material");
      },
    });
  };

  return (
    <Stack>
      <PageHeader title="Materials">
        <TextBox
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
          icon="search"
          onEnterKey={updateSearch}
          onClear={onClear}
          clearable
        />
        <LinkButton iconName="add" target="materialAdd" params={{}}>
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
            <SortableTableHeader sortManager={sortManager} column="code">
              Code
            </SortableTableHeader>
            <Table.Th>Color</Table.Th>
            <SortableTableHeader
              sortManager={sortManager}
              column="purchasePrice"
            >
              Purchase
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="retailPrice">
              Retail
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="status">
              Status
            </SortableTableHeader>
            <Table.Th w="100"></Table.Th>
          </>
        }
        renderRow={(record) => (
          <>
            <Table.Td>{record.name}</Table.Td>
            <Table.Td>{record.code}</Table.Td>
            <Table.Td>
              {record.color && <Box bg={record.color} h={20} w="100%" />}
            </Table.Td>
            <Table.Td>{formatCurrency(record.purchasePrice)}</Table.Td>
            <Table.Td>{formatCurrency(record.retailPrice)}</Table.Td>
            <Table.Td ta="center">
              <StatusBadge status={record.status} />
            </Table.Td>
            <Table.Td>
              <Group>
                <AppLinkIcon
                  target="materialEdit"
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
