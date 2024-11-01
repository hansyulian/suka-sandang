import {
  AppShell,
  Avatar,
  Burger,
  Group,
  Menu,
  NavLink,
  ThemeIcon,
  ThemeIconProps,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PropsWithChildren, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Icon, IconNames } from "~/components/Icon";
import { LoadingSuspense } from "~/components/LoadingSuspense";
import { Api } from "~/config/api";
import { useAuth } from "~/hooks/useAuth";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useNavigate } from "~/hooks/useNavigate";
import { NavMenu } from "~/layouts/MasterLayout/NavMenu";

export type MasterLayoutProps = PropsWithChildren;

export function MasterLayout(props: MasterLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  const { authenticatedUser, isLoading } = useAuth();
  const { mutateAsync: logout } = Api.session.logout.useRequest();
  const invalidateQuery = useInvalidateQuery();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout({});
    await invalidateQuery("userInfo");
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
      <AppShell.Navbar>
        <NavLink
          label="Transaction"
          leftSection={<NavIcon name="transaction" variant="gradient" />}
          defaultOpened
        >
          <NavMenu
            leftSection={<NavIcon name="purchaseOrder" />}
            target="purchaseOrderList"
            params={{}}
            label="Purchase Order"
          />
        </NavLink>
        <NavLink
          label="Master Data"
          leftSection={<NavIcon name="masterData" variant="gradient" />}
          defaultOpened
        >
          <NavMenu
            leftSection={<NavIcon name="material" />}
            target="materialList"
            params={{}}
            label="Materials"
          />
          <NavMenu
            leftSection={<NavIcon name="supplier" />}
            target="supplierList"
            params={{}}
            label="Suppliers"
          />
          <NavMenu
            leftSection={<NavIcon name="customer" />}
            target="customerList"
            params={{}}
            label="Customers"
          />
        </NavLink>
      </AppShell.Navbar>
      <AppShell.Main>
        <LoadingSuspense>{props.children || <Outlet />}</LoadingSuspense>
      </AppShell.Main>
    </AppShell>
  );
}

type NavIconProps = {
  name: IconNames;
  variant?: ThemeIconProps["variant"];
};

function NavIcon(props: NavIconProps) {
  return (
    <ThemeIcon variant={props.variant || "white"}>
      <Icon name={props.name} />
    </ThemeIcon>
  );
}
