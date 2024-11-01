import { Center, Container, Paper } from "@mantine/core";
import { PropsWithChildren } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingSuspense } from "~/components/LoadingSuspense";
import { useAuth } from "~/hooks/useAuth";
import { useRoute } from "~/hooks/useRoute";
import { useSearchQuery } from "~/hooks/useSearchQuery";

export type SessionLayoutProps = PropsWithChildren;

export function SessionLayout(props: SessionLayoutProps) {
  const { authenticatedUser } = useAuth();
  const { redirect } = useSearchQuery("login");
  const landingRoute = useRoute("landing");
  if (authenticatedUser) {
    return <Navigate to={redirect || landingRoute.path({}, {})} />;
  }
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
