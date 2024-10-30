import {
  InputLabel,
  SegmentedControl,
  SegmentedControlProps,
  Stack,
} from "@mantine/core";

export type SegmentedControlInputProps = {
  label: string;
} & SegmentedControlProps;

export function SegmentedControlInput(props: SegmentedControlInputProps) {
  const { label, ...rest } = props;
  return (
    <Stack gap={0} align="flex-start">
      <InputLabel>{label}</InputLabel>
      <SegmentedControl {...rest} />
    </Stack>
  );
}
