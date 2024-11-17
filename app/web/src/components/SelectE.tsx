/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComboboxItem, Select, SelectProps, Text } from "@mantine/core";
import { ReadOnly } from "~/components/ReadOnly";

export type SelectEProps = SelectProps & {
  onSelectOption?: (option: ComboboxItem | null) => void;
  plainDisabled?: boolean;
};

export function SelectE(props: SelectEProps) {
  const { onChange, plainDisabled, onSelectOption, ...rest } = props;

  const onChangeProxy = (value: string | null, option: ComboboxItem) => {
    onChange?.(value as any, option);
    onSelectOption?.(option);
  };

  if (plainDisabled && props.disabled) {
    return (
      <ReadOnly label={props.label}>
        <Text c="gray">{props.value}</Text>
      </ReadOnly>
    );
  }

  return <Select {...rest} onChange={onChangeProxy} />;
}
