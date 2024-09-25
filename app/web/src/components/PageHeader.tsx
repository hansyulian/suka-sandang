import { Group } from "@mantine/core";
import { PropsWithChildren } from "react";
import { PageTitle } from "~/components/PageTitle";

export type PageHeaderProps = PropsWithChildren<{
  title: string;
}>;

export function PageHeader(props: PageHeaderProps) {
  const { title, children } = props;
  return (
    <Group justify="space-between">
      <PageTitle>{title}</PageTitle>
      <Group>{children}</Group>
    </Group>
  );
}
