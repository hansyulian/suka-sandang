import { Card, CardProps, Title } from "@mantine/core";
import { PropsWithChildren } from "react";

export type CardFormProps = CardProps &
  PropsWithChildren<{
    title: string;
  }>;

export function CardForm(props: CardFormProps) {
  const { title, children, ...rest } = props;
  return (
    <Card p="sm" {...rest}>
      <Card.Section withBorder inheritPadding>
        <Title order={4}>{title}</Title>
      </Card.Section>
      {children}
    </Card>
  );
}
