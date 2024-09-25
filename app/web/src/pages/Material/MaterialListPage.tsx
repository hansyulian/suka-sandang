import { Center, Group, Stack, Table } from "@mantine/core";
import { AppLink } from "~/components/AppLink";
import { DataTable } from "~/components/DataTable";
import { IconButton } from "~/components/IconButton";
import { LinkButton } from "~/components/LinkButton";
import { PageHeader } from "~/components/PageHeader";
import { PaginationController } from "~/components/PaginationController";
import { SortableTableHeader } from "~/components/SortableTableHeader";
import { TextBox } from "~/components/TextBox";
import { Api } from "~/config/api";
import { usePaginationManager } from "~/hooks/usePaginationManager";
import { useReactiveState } from "~/hooks/useReactiveState";
import { useSearchQuery } from "~/hooks/useSearchQuery";
import { useSortManager } from "~/hooks/useSortManager";
import { useUpdateSearchQuery } from "~/hooks/useUpdateSearchQuery";

export default function MaterialListPage() {
  const query = useSearchQuery("materialList");
  const [searchText, setSearchText] = useReactiveState(query.search || "");
  const updateSearchQuery = useUpdateSearchQuery("materialList", {}, query);
  const paginationManager = usePaginationManager(query, {
    onChange: updateSearchQuery,
  });
  const sortManager = useSortManager(query, {
    onChange: updateSearchQuery,
  });

  const { data } = Api.material.listMaterial.useRequest({}, query);
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
            <SortableTableHeader sortManager={sortManager} column="status">
              Status
            </SortableTableHeader>
            <SortableTableHeader
              sortManager={sortManager}
              column="purchasePrice"
            >
              Purchase
            </SortableTableHeader>
            <SortableTableHeader sortManager={sortManager} column="retailPrice">
              Retail
            </SortableTableHeader>
            <Table.Th></Table.Th>
          </>
        }
        renderRow={(record) => (
          <>
            <Table.Td>{record.name}</Table.Td>
            <Table.Td>{record.code}</Table.Td>
            <Table.Td>{record.color}</Table.Td>
            <Table.Td>{record.status}</Table.Td>
            <Table.Td>{record.purchasePrice}</Table.Td>
            <Table.Td>{record.retailPrice}</Table.Td>
            <Table.Td>
              <Group>
                <IconButton
                  component={AppLink}
                  target="materialEdit"
                  params={{ idOrCode: record.code }}
                  name="edit"
                ></IconButton>
                <IconButton color="red" name="delete"></IconButton>
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
