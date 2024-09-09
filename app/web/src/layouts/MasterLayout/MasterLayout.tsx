import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import { PropsWithChildren, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Icon } from "~/components/Icon";
import { LoadingSuspense } from "~/components/LoadingSuspense";
import { Api, queryKeys } from "~/config/api";
import { useAuth } from "~/hooks/useAuth";
import { useNavigate } from "~/hooks/useNavigate";

export type MasterLayoutProps = PropsWithChildren;

export function MasterLayout(props: MasterLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const { authenticatedUser, isLoading } = useAuth();
  const { mutateAsync: logout } = Api.session.logout.useRequest();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout({});
    await queryClient.invalidateQueries({
      queryKey: queryKeys.userInfo(),
    });
  };

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!authenticatedUser) {
      navigate("login", {});
    }
  }, [authenticatedUser, isLoading, navigate]);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm", collapsed: { mobile: !opened } }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger
              opened={opened}
              onClick={toggle}
              hiddenFrom="sm"
              size="sm"
            />
          </Group>
          <Group>
            <Menu>
              <Menu.Target>
                <UnstyledButton>
                  <Avatar name={authenticatedUser?.name || ""} />
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<Icon name="logout" />}
                  onClick={handleLogout}
                >
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md"></AppShell.Navbar>
      <AppShell.Main>
        <LoadingSuspense>{props.children || <Outlet />}</LoadingSuspense>
      </AppShell.Main>
    </AppShell>
  );
}
