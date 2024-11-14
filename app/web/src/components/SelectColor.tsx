import {
  Box,
  ComboboxItem,
  DefaultMantineColor,
  Group,
  StyleProp,
} from "@mantine/core";
import { useCallback, useMemo } from "react";
import { SelectE, SelectEProps } from "~/components/SelectE";

export type SelectColorProps<Option extends SelectionOption> = SelectEProps & {
  color?: StyleProp<DefaultMantineColor>;
  optionColorExtractor?: (option: Option) => string | undefined;
};

type SelectColorRenderOption = {
  option: ComboboxItem;
  checked?: boolean;
};

export function SelectColor<Option extends SelectionOption>(
  props: SelectColorProps<Option>
) {
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

  return (
    <SelectE
      renderOption={renderSelectOption}
      leftSection={<Box w="20" h="20" bg={color} />}
      data={data}
      {...rest}
    />
  );
}
