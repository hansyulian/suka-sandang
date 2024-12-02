import { TextInput, TextInputProps } from "@mantine/core";
import {
  PlainDisabledView,
  PlainDisabledViewProps,
} from "~/components/PlainDisabledView";
import { RouteNames } from "~/config/routes";

export type TextInputEProps<RouteName extends RouteNames> = TextInputProps &
  PlainDisabledViewProps<RouteName> & {};

export function TextInputE<RouteName extends RouteNames = any>(
  props: TextInputEProps<RouteName>
) {
  return (
    <PlainDisabledView {...props}>
      <TextInput {...props} />
    </PlainDisabledView>
  );
}
