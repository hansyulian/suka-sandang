import { Container } from "@mantine/core";
import { PaginationController } from "~/components/PaginationController";
import { usePaginationManager } from "~/hooks/usePaginationManager";

export default function MaterialListPage() {
  // const {} = useSearchQuery('materialList');
  // const {} = Api.material.listMaterial.useRequest({}, {});
  const paginationManager = usePaginationManager();
  return (
    <Container>
      <PaginationController
        paginationManager={paginationManager}
        info={{ count: 100 }}
      />
    </Container>
  );
}
