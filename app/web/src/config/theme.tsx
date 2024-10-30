import { createTheme, NumberInput, Paper } from "@mantine/core";

export const theme = createTheme({
  components: {
    Paper: Paper.extend({
      defaultProps: {
        p: "sm",
      },
    }),
    NumberInput: NumberInput.extend({
      defaultProps: {
        thousandSeparator: ".",
        decimalSeparator: ",",
      },
    }),
  },
});
