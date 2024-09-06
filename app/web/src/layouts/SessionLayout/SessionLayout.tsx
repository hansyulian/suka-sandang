import { Center, Container, Paper } from "@mantine/core";
import { Outlet } from "@tanstack/react-router";
import { PropsWithChildren } from "react";

export type SessionLayoutProps = PropsWithChildren;

export function SessionLayout(props: SessionLayoutProps) {
  return (
    <Container size="sm">
      <Center mih="100vh" p="sm">
        <Paper w="100%">
        {props.children || <Outlet />}
        </Paper>
      </Center>
    </Container>
  );
}
