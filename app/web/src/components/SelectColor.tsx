/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, DefaultMantineColor, Group, StyleProp } from "@mantine/core";
import { useCallback, useMemo } from "react";
import {
  PlainDisabledView,
  PlainDisabledViewProps,
} from "~/components/PlainDisabledView";
import { SelectE, SelectEProps } from "~/components/SelectE";
import { RouteNames } from "~/config/routes";

export type SelectColorProps<
  Option extends SelectionOption,
  RouteName extends RouteNames
> = SelectEProps<RouteName> &
  PlainDisabledViewProps<RouteName> & {
    color?: StyleProp<DefaultMantineColor>;
    optionColorExtractor?: (option: Option) => string | undefined;
  };

type SelectColorRenderOption = {
  option: SelectionOption;
  checked?: boolean;
};

export function SelectColor<
  Option extends SelectionOption,
  RouteName extends RouteNames = any
>(props: SelectColorProps<Option, RouteName>) {
  const { color, optionColorExtractor, data, ...rest } = props;

  const colorMap = useMemo(() => {
    if (!data || !optionColorExtractor) {
      return {};
    }
    const result: Record<string, string | undefined> = {};
    for (const item of data) {
      const comboItem = item as Option;
      result[comboItem.value] = optionColorExtractor(comboItem);
    }
    return result;
  }, [data, optionColorExtractor]);

  const renderSelectOption = useCallback(
    ({ option }: SelectColorRenderOption) => {
      const color = colorMap[option.value];
      return (
        <Group flex="1" gap="xs">
          <Box w="20" h="20" bg={color} />
          {option.label}
        </Group>
      );
    },
    [colorMap]
  );

  const selectedOption = useMemo(() => {
    const option = data?.find(
      (record) => (record as SelectionOption).value === props.value
    ) as SelectionOption;
    return option;
  }, [data, props.value]);

  return (
    <PlainDisabledView
      {...props}
      value={selectedOption?.label || props.value}
      leftSection={<Box w="20" h="20" bg={colorMap[selectedOption?.value]} />}
    >
      <SelectE
        renderOption={renderSelectOption}
        leftSection={<Box w="20" h="20" bg={color} />}
        data={data}
        {...rest}
      />
    </PlainDisabledView>
  );
}
