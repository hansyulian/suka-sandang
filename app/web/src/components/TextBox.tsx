import { TextInput, TextInputProps } from "@mantine/core";
import { getHotkeyHandler, HotkeyItem } from "@mantine/hooks";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Icon, IconNames } from "~/components/Icon";

export type TextBoxProps = {
  onChangeText?: (value: string) => void;
  onEnterKey?: () => void;
  icon?: IconNames;
} & TextInputProps;

export function TextBox(props: TextBoxProps) {
  const { onChangeText, onChange, onEnterKey, icon, leftSection, ...rest } =
    props;
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

  return (
    <TextInput
      {...rest}
      leftSection={leftSection || (icon ? <Icon name={icon} /> : undefined)}
      onChange={onChangeExtended}
      onKeyDown={getHotkeyHandler(hotkeyItems)}
    />
  );
}
