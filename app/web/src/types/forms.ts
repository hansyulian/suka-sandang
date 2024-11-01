import {
  CustomerStatus,
  MaterialStatus,
  PurchaseOrderStatus,
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
