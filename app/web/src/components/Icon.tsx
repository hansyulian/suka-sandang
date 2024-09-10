import {
  IconDatabase,
  IconDeviceFloppy,
  IconLogout,
  IconPackage,
  IconPlus,
  IconX,
} from "@tabler/icons-react";

const iconMap = {
  logout: IconLogout,
  masterData: IconDatabase,
  material: IconPackage,
  add: IconPlus,
  save: IconDeviceFloppy,
  close: IconX,
};

export type IconNames = keyof typeof iconMap;

export type IconProps = {
  name: IconNames;
};

export const Icon = (props: IconProps) => {
  const { name, ...rest } = props;
  const IconComponent = iconMap[name];
  return <IconComponent {...rest} />;
};
