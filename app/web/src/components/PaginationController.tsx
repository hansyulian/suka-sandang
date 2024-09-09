import { ListInfo } from "@hyulian/api-contract";
import { Group, Pagination, PaginationProps } from "@mantine/core";
import { usePaginationManager } from "~/hooks/usePaginationManager";

export type PaginationControllerProps = {
  paginationManager: ReturnType<typeof usePaginationManager>;
  info?: ListInfo;
} & Omit<PaginationProps, "total">;

export const PaginationController = (props: PaginationControllerProps) => {
  const { info, paginationManager } = props;
  const total = Math.ceil((info?.count || 0) / paginationManager.value.limit);

  const currentPage =
    Math.floor(paginationManager.value.offset / paginationManager.value.limit) +
    1;
  const onChange = (page: number) => {
    paginationManager.set.offset((page - 1) * paginationManager.value.limit);
  };

  const previous = () => {
    if (currentPage <= 1) {
      return;
    }
    onChange(currentPage - 1);
  };
  const next = () => {
    if (currentPage >= total) {
      return;
    }
    onChange(currentPage + 1);
  };

  if (total < 2) {
    return null;
  }

  return (
    <Group>
      <Pagination
        total={total}
        siblings={2}
        value={currentPage}
        onChange={onChange}
        onPreviousPage={previous}
        onNextPage={next}
      />
    </Group>
  );
};
