import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import "./App.css";

import { router } from "~/config/router";
import { theme } from "~/config/theme";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";

import { RouterProvider } from "react-router-dom";
import "~/config/api";
import { AuthProvider } from "~/contexts";
import { useAuth } from "~/hooks/useAuth";

const queryClient = new QueryClient();

function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <InnerApp />
          <Notifications />
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

function InnerApp() {
  const { isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  return <RouterProvider router={router} />;
}

export default App;
