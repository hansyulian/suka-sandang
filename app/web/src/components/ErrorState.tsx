import { Stack, Text, Title } from "@mantine/core";
import { useMemo } from "react";
import { parseException } from "~/utils/parseException";

export type ErrorStateProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any;
};

export function ErrorState(props: ErrorStateProps) {
  const { error } = props;
  const exception = useMemo(() => parseException(error), [error]);

  const title = exception?.name || "";
  const message = exception
    ? JSON.stringify(exception.details, null, 4)
    : error.message;
  const stack = exception?.stack || [];
  const hasStack = stack.length > 0;
  return (
    <Stack>
      <Title>Error: {title}</Title>
      <Title order={4}>Details:</Title>
      <Text component="pre">{message}</Text>
      {hasStack ? (
        <>
          <Title order={4}>Stack:</Title>
          <Text component="pre">{stack.join("\n")}</Text>
        </>
      ) : (
        <></>
      )}
    </Stack>
  );
}
