import {
  Box,
  DefaultMantineColor,
  Group,
  StyleProp,
  Text,
} from "@mantine/core";
import { useCallback, useMemo } from "react";
import { ReadOnly } from "~/components/ReadOnly";
import { SelectE, SelectEProps } from "~/components/SelectE";

export type SelectColorProps<Option extends SelectionOption> = SelectEProps & {
  color?: StyleProp<DefaultMantineColor>;
  optionColorExtractor?: (option: Option) => string | undefined;
  plainDisabled?: boolean;
};

type SelectColorRenderOption = {
  option: SelectionOption;
  checked?: boolean;
};

export function SelectColor<Option extends SelectionOption>(
  props: SelectColorProps<Option>
) {
  const { plainDisabled, color, optionColorExtractor, data, ...rest } = props;

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

  if (plainDisabled && props.disabled) {
    const option = data?.find(
      (record) => (record as SelectionOption).value === props.value
    ) as SelectionOption;
    return (
      <ReadOnly label={props.label}>
        <Group align="center">
          <Box w="20" h="20" bg={colorMap[option?.value]} />
          <Text c="gray">{option?.label}</Text>
        </Group>
      </ReadOnly>
    );
  }

  return (
    <SelectE
      renderOption={renderSelectOption}
      leftSection={<Box w="20" h="20" bg={color} />}
      data={data}
      {...rest}
    />
  );
}
