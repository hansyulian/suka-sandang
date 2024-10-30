import { CustomerStatus, MaterialStatus, SupplierStatus } from "@app/common";

export const materialStatusLabels: Record<MaterialStatus, string> = {
  active: "Active",
  deleted: "Deleted",
  draft: "Draft",
};

export const customerStatusLabels: Record<CustomerStatus, string> = {
  active: "Active",
  blocked: "Blocked",
  deleted: "Deleted",
  draft: "Draft",
};

export const supplierStatusLabels: Record<SupplierStatus, string> = {
  active: "Active",
  blocked: "Blocked",
  deleted: "Deleted",
  draft: "Draft",
};
