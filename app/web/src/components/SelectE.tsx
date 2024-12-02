/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComboboxItem, Select, SelectProps } from "@mantine/core";
import { useMemo } from "react";
import {
  PlainDisabledView,
  PlainDisabledViewProps,
} from "~/components/PlainDisabledView";
import { RouteNames } from "~/config/routes";

export type SelectEProps<RouteName extends RouteNames> = SelectProps &
  PlainDisabledViewProps<RouteName> & {
    onSelectOption?: (option: ComboboxItem | null) => void;
  };

export function SelectE<RouteName extends RouteNames = any>(
  props: SelectEProps<RouteName>
) {
  const { onChange, onSelectOption, ...rest } = props;

  const onChangeProxy = (value: string | null, option: ComboboxItem) => {
    onChange?.(value as any, option);
    onSelectOption?.(option);
  };

  const selectedOption = useMemo(() => {
    return (
      props.data?.find((record) => (record as any)?.value === props.value) ||
      props.value
    );
  }, [props.data, props.value]);

  const selectedLabel = useMemo(() => {
    return (selectedOption as any)?.label || props.value;
  }, [props.value, selectedOption]);

  return (
    <PlainDisabledView {...props} value={selectedLabel}>
      <Select {...rest} onChange={onChangeProxy} />
    </PlainDisabledView>
  );
}
