import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import "./App.css";

import { router } from "~/config/router";
import { theme } from "~/config/theme";

import { MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Notifications } from "@mantine/notifications";
import { ModalsProvider } from "@mantine/modals";

import { RouterProvider } from "react-router-dom";
import "~/config/api";
import { AuthProvider } from "~/contexts";
import { useAuth } from "~/hooks/useAuth";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useEffect } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retryOnMount: true,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ModalsProvider>
            <InnerApp />
          </ModalsProvider>
          <Notifications />
          <DevTools />
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

const ReactQueryDevtoolsProduction = React.lazy(() =>
  import("@tanstack/react-query-devtools/build/modern/production.js").then(
    (d) => ({
      default: d.ReactQueryDevtools,
    })
  )
);

function DevTools() {
  const [showDevtools, setShowDevtools] = React.useState(false);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).toggleDevtools = () => setShowDevtools((old) => !old);
  }, []);

  return (
    <>
      <ReactQueryDevtools initialIsOpen />
      {showDevtools && (
        <React.Suspense fallback={null}>
          <ReactQueryDevtoolsProduction />
        </React.Suspense>
      )}
    </>
  );
}

export default App;
