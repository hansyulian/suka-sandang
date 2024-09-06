import { createTheme, Paper } from "@mantine/core";

export const theme = createTheme({
  components: {
    Paper: Paper.extend({
      defaultProps: {
        p: "sm",
      },
    }),
  },
});
