import { createTheme, MantineProvider } from "@mantine/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient();

export function renderApp(component: ReactNode) {
  return (
    <MantineProvider theme={createTheme({})}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </MantineProvider>
  );
}
