import {
  IconArrowsSort,
  IconBuildingWarehouse,
  IconCheck,
  IconCurrencyDollar,
  IconDatabase,
  IconDeviceFloppy,
  IconEdit,
  IconExternalLink,
  IconFilter,
  IconFilterFilled,
  IconLink,
  IconLogout,
  IconMinus,
  IconNotebook,
  IconPackage,
  IconPlus,
  IconProps as BaseIconProps,
  IconReportMoney,
  IconSearch,
  IconShoppingCart,
  IconSortAscending,
  IconSortDescending,
  IconTrash,
  IconTruck,
  IconUsers,
  IconX,
} from "@tabler/icons-react";

const iconMap = {
  add: IconPlus,
  close: IconX,
  customer: IconUsers,
  delete: IconTrash,
  edit: IconEdit,
  filterActive: IconFilterFilled,
  filterInactive: IconFilter,
  inventory: IconBuildingWarehouse,
  link: IconLink,
  logout: IconLogout,
  masterData: IconDatabase,
  material: IconPackage,
  minus: IconMinus,
  notificationError: IconX,
  notificationSuccess: IconCheck,
  openLink: IconExternalLink,
  price: IconCurrencyDollar,
  purchaseOrder: IconShoppingCart,
  salesOrder: IconReportMoney,
  save: IconDeviceFloppy,
  search: IconSearch,
  sortable: IconArrowsSort,
  sortAscending: IconSortAscending,
  sortDescending: IconSortDescending,
  supplier: IconTruck,
  transaction: IconNotebook,
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
