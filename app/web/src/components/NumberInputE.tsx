import { NumberInput, NumberInputProps, Text } from "@mantine/core";
import classes from "./NumberInputE.module.scss";
import { ReadOnly } from "~/components/ReadOnly";
import { formatCurrency } from "~/utils/formatCurrency";

export type NumberInputEProps = {
  rightAlign?: boolean;
  plainDisabled?: boolean;
} & NumberInputProps;

export const NumberInputE = (props: NumberInputEProps) => {
  const { rightAlign, className, plainDisabled, ...rest } = props;

  if (plainDisabled && props.disabled) {
    return (
      <ReadOnly label={props.label}>
        <Text c="gray">
          {props.value !== "" && props.value
            ? formatCurrency(props.value as number)
            : ""}
        </Text>
      </ReadOnly>
    );
  }
  return (
    <NumberInput
      hideControls
      {...rest}
      className={`${className || ""} ${rightAlign ? classes.rightAlign : ""}`}
    />
  );
};
