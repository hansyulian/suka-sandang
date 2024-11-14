import {
  CustomerStatus,
  InventoryFlowActivity,
  InventoryStatus,
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

export const inventoryFlowActivityLabels: Record<
  InventoryFlowActivity,
  string
> = {
  adjustment: "Adjustment",
  allocation: "Allocation",
  procurement: "Procurement",
  return: "Return",
  sales: "Sales",
  scrap: "Scrap",
  transfer: "Transfer",
};

export const inventoryStatusLabels: Record<InventoryStatus, string> = {
  active: "Active",
  deleted: "Deleted",
  finished: "Finished",
};
