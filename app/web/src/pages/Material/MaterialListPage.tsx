import { Icon } from "~/components/Icon";
import { LinkButton } from "~/components/LinkButton";
// import { PaginationController } from "~/components/PaginationController";
// import { usePaginationManager } from "~/hooks/usePaginationManager";

export default function MaterialListPage() {
  // const {} = useSearchQuery('materialList');
  // const {} = Api.material.listMaterial.useRequest({}, {});
  // const paginationManager = usePaginationManager();

  return (
    <LinkButton
      leftSection={<Icon name="add" />}
      target="materialAdd"
      params={{}}
    >
      Add
    </LinkButton>
  );
}
