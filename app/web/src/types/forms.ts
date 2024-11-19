import {
  CustomerStatus,
  InventoryFlowActivity,
  MaterialStatus,
  PurchaseOrderStatus,
  SalesOrderStatus,
  SupplierStatus,
} from "@app/common";

export type MaterialForm = {
  name: string;
  code: string;
  color: string;
  purchasePrice: number | undefined;
  retailPrice: number | undefined;
  status: MaterialStatus;
};

export type SupplierForm = {
  name: string;
  address: string;
  email: string;
  phone: string;
  identity: string;
  remarks: string;
  status: SupplierStatus;
};

export type CustomerForm = {
  name: string;
  address: string;
  email: string;
  phone: string;
  identity: string;
  remarks: string;
  status: CustomerStatus;
};

export type PurchaseOrderForm = {
  date: Date;
  supplierId: string;
  remarks?: string;
  code: string;
  status: PurchaseOrderStatus;
};

export type PurchaseOrderItemForm = {
  materialId: string;
  quantity: number;
  unitPrice: number;
  remarks?: string;
};

export type InventoryForm = {
  materialId: string;
  remarks?: string;
  code: string;
};

export type InventoryFlowForm = {
  quantity: number;
  remarks?: string;
  activity: InventoryFlowActivity;
};

export type SalesOrderForm = {
  date: Date;
  customerId: string;
  remarks?: string;
  code: string;
  status: SalesOrderStatus;
};

export type SalesOrderItemForm = {
  materialId: string;
  quantity: number;
  unitPrice: number;
  remarks?: string;
};
