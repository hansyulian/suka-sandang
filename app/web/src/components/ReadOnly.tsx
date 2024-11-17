import { Stack, InputLabel } from "@mantine/core";
import { PropsWithChildren, ReactNode } from "react";

export type ReadOnlyProps = PropsWithChildren<{
  label?: ReactNode;
}>;

export function ReadOnly(props: ReadOnlyProps) {
  const { label, children } = props;

  return (
    <Stack gap={0}>
      {label && <InputLabel>{label}</InputLabel>}
      {children}
    </Stack>
  );
}
