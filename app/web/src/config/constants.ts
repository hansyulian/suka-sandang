import {
  CustomerStatus,
  MaterialStatus,
  PurchaseOrderStatus,
  SupplierStatus,
} from "@app/common";

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

export const purchaseOrderStatusLabels: Record<PurchaseOrderStatus, string> = {
  draft: "Draft",
  deleted: "Deleted",
  cancelled: "Cancelled",
  completed: "Completed",
  processing: "Processing",
};
