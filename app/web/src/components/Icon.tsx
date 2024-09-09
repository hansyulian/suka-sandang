import { IconLogout } from "@tabler/icons-react";

const iconMap = {
  logout: IconLogout,
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
