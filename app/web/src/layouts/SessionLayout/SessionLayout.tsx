import { Center, Container, Paper } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import { LoadingSuspense } from "~/components/LoadingSuspense";

export type SessionLayoutProps = PropsWithChildren;

export function SessionLayout(props: SessionLayoutProps) {
  return (
    <Container size="sm">
      <Center mih="100vh" p="sm">
        <Paper w="100%">
          <LoadingSuspense>{props.children || <Outlet />}</LoadingSuspense>
        </Paper>
      </Center>
    </Container>
  );
}
