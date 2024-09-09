import "@mantine/core/styles.css";
import "./App.css";

import { router } from "~/config/router";
import { theme } from "~/config/theme";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
        </AuthProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

function InnerApp() {
  const { isLoading } = useAuth();
  console.log(isLoading);
  if (isLoading) {
    return null;
  }
  return <RouterProvider router={router} />;
}

export default App;
