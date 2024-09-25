import {
  ActionIcon,
  ActionIconProps,
  createPolymorphicComponent,
} from "@mantine/core";
import { Icon, IconNames } from "~/components/Icon";

export type IconButtonProps = {
  name: IconNames;
} & ActionIconProps;

export const IconButton = createPolymorphicComponent<"span", IconButtonProps>(
  (props: IconButtonProps) => {
    const { name, ...rest } = props;
    return (
      <ActionIcon {...rest}>
        <Icon name={name} width="70%" />
      </ActionIcon>
    );
  }
);
