/* eslint-disable @typescript-eslint/no-explicit-any */
import { Text } from "@mantine/core";
import { DatePickerInputProps, DatePickerInput } from "@mantine/dates";
import { ReadOnly } from "~/components/ReadOnly";
import { formatDate } from "~/utils/formatDate";

export type DatePickerInputEProps = DatePickerInputProps & {
  plainDisabled?: boolean;
};

export function DatePickerInputE(props: DatePickerInputEProps) {
  const { plainDisabled, ...rest } = props;

  if (plainDisabled && props.disabled) {
    return (
      <ReadOnly label={props.label}>
        <Text c="gray">{props.value ? formatDate(props.value) : "-"}</Text>
      </ReadOnly>
    );
  }

  return <DatePickerInput {...(rest as any)} />;
}
