import { Center, Container, Paper } from "@mantine/core";
import { PropsWithChildren, Suspense } from "react";
import { Outlet } from "react-router-dom";

export type SessionLayoutProps = PropsWithChildren;

export function SessionLayout(props: SessionLayoutProps) {
  return (
    <Container size="sm">
      <Center mih="100vh" p="sm">
        <Paper w="100%">
          <Suspense fallback={<div>loading...</div>}>
            {props.children || <Outlet />}
          </Suspense>
        </Paper>
      </Center>
    </Container>
  );
}
