/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComboboxItem, Select, SelectProps } from "@mantine/core";

export type SelectEProps = SelectProps & {
  onSelectOption?: (option: ComboboxItem | null) => void;
};

export function SelectE(props: SelectEProps) {
  const { onChange, onSelectOption, ...rest } = props;

  const onChangeProxy = (value: string | null, option: ComboboxItem) => {
    onChange?.(value as any, option);
    onSelectOption?.(option);
  };

  return <Select {...rest} onChange={onChangeProxy} />;
}
