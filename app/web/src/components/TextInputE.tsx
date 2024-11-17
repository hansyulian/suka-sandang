import { TextInput, TextInputProps, Text } from "@mantine/core";
import { ReadOnly } from "~/components/ReadOnly";

export type TextInputEProps = TextInputProps & {
  plainDisabled?: boolean;
};

export function TextInputE(props: TextInputEProps) {
  const { plainDisabled, ...rest } = props;

  if (plainDisabled && props.disabled) {
    return (
      <ReadOnly label={props.label}>
        <Text c="gray">{props.value}</Text>
      </ReadOnly>
    );
  }

  return <TextInput {...rest} />;
}
