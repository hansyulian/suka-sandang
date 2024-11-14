import { NumberInput, NumberInputProps } from "@mantine/core";
import classes from "./NumberInputE.module.scss";

export type NumberInputEProps = {
  rightAlign?: boolean;
} & NumberInputProps;

export const NumberInputE = (props: NumberInputEProps) => {
  const { rightAlign, className, ...rest } = props;
  return (
    <NumberInput
      {...rest}
      className={`${className || ""} ${rightAlign ? classes.rightAlign : ""}`}
    />
  );
};
