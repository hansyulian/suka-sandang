import {
  IconDatabase,
  IconDeviceFloppy,
  IconFilter,
  IconFilterFilled,
  IconLogout,
  IconMinus,
  IconPackage,
  IconPlus,
  IconSortAscending,
  IconSortDescending,
  IconX,
  IconProps as BaseIconProps,
  IconEdit,
  IconTrash,
  IconCheck,
  IconCross,
  IconSearch,
  IconArrowsSort,
  IconCurrencyDollar,
  IconTruck,
  IconUsers,
} from "@tabler/icons-react";

const iconMap = {
  logout: IconLogout,
  masterData: IconDatabase,
  material: IconPackage,
  add: IconPlus,
  save: IconDeviceFloppy,
  close: IconX,
  sortAscending: IconSortAscending,
  sortDescending: IconSortDescending,
  minus: IconMinus,
  filterInactive: IconFilter,
  filterActive: IconFilterFilled,
  edit: IconEdit,
  delete: IconTrash,
  notificationSuccess: IconCheck,
  notificationError: IconCross,
  search: IconSearch,
  sortable: IconArrowsSort,
  price: IconCurrencyDollar,
  supplier: IconTruck,
  customer: IconUsers,
};

export type IconNames = keyof typeof iconMap;

export type IconProps = BaseIconProps & {
  name: IconNames;
};

export const Icon = (props: IconProps) => {
  const { name, ...rest } = props;
  const IconComponent = iconMap[name];
  return <IconComponent {...rest} />;
};
