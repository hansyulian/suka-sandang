import { CreatePurchaseOrderContract } from "./CreatePurchaseOrder";
import { DeletePurchaseOrderContract } from "./DeletePurchaseOrder";
import { GetPurchaseOrderContract } from "./GetPurchaseOrder";
import { ListPurchaseOrdersContract } from "./ListPurchaseOrders";
import { UpdatePurchaseOrderContract } from "./UpdatePurchaseOrder";
import { SyncPurchaseOrderItemContract } from "./SyncPurchaseOrderItems";

export * from "./CreatePurchaseOrder";
export * from "./DeletePurchaseOrder";
export * from "./GetPurchaseOrder";
export * from "./ListPurchaseOrders";
export * from "./UpdatePurchaseOrder";
export * from "./SyncPurchaseOrderItems";

export namespace PurchaseOrderContracts {
  export type CreatePurchaseOrder = CreatePurchaseOrderContract;
  export type DeletePurchaseOrder = DeletePurchaseOrderContract;
  export type GetPurchaseOrder = GetPurchaseOrderContract;
  export type ListPurchaseOrders = ListPurchaseOrdersContract;
  export type UpdatePurchaseOrder = UpdatePurchaseOrderContract;
  export type SyncPurchaseOrderItems = SyncPurchaseOrderItemContract;
}
