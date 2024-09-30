import { MaterialStatus, SupplierStatus } from "@app/common";

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
  remarks: string;
  status: SupplierStatus;
};
