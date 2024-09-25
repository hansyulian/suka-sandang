import { Title, TitleProps } from "@mantine/core";

export type PageTitleProps = TitleProps;

export function PageTitle(props: PageTitleProps) {
  return <Title order={1} {...props} />;
}
