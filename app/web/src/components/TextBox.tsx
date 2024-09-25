import {
  Box,
  Center,
  TextInput,
  TextInputProps,
  UnstyledButton,
} from "@mantine/core";
import { getHotkeyHandler, HotkeyItem } from "@mantine/hooks";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Icon, IconNames } from "~/components/Icon";

export type TextBoxProps = {
  onChangeText?: (value: string) => void;
  onEnterKey?: () => void;
  icon?: IconNames;
  clearable?: boolean;
  onClear?: () => void;
} & TextInputProps;

export function TextBox(props: TextBoxProps) {
  const {
    onChangeText,
    onChange,
    onEnterKey,
    icon,
    leftSection,
    clearable = false,
    rightSection,
    onClear,
    ...rest
  } = props;
  const [hotkeyItems, setHotkeyItems] = useState<HotkeyItem[]>([]);

  useEffect(() => {
    const result: HotkeyItem[] = [];
    if (onEnterKey) {
      result.push(["Enter", onEnterKey]);
    }
    setHotkeyItems(result);
  }, [onEnterKey]);

  const onChangeExtended: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChangeText?.(event.target.value);
    onChange?.(event);
  };
  const clear = () => {
    onChangeText?.("");
    onChange?.({
      target: {
        value: "",
      },
    } as never);
    onClear?.();
  };

  return (
    <TextInput
      {...rest}
      leftSection={leftSection || (icon ? <Icon name={icon} /> : undefined)}
      rightSection={
        rightSection ||
        (clearable && rest.value ? (
          <UnstyledButton onClick={clear}>
            <Center>
              <Icon name="close" />
            </Center>
          </UnstyledButton>
        ) : (
          <Box />
        ))
      }
      onChange={onChangeExtended}
      onKeyDown={getHotkeyHandler(hotkeyItems)}
    />
  );
}
