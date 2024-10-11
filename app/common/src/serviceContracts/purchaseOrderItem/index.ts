import { CreatePurchaseOrderItemContract } from "./CreatePurchaseOrderItem";
import { DeletePurchaseOrderItemContract } from "./DeletePurchaseOrderItem";
import { GetPurchaseOrderItemContract } from "./GetPurchaseOrderItem";
import { ListPurchaseOrderItemsContract } from "./ListPurchaseOrderItems";
import { UpdatePurchaseOrderItemContract } from "./UpdatePurchaseOrderItem";

export * from "./CreatePurchaseOrderItem";
export * from "./DeletePurchaseOrderItem";
export * from "./GetPurchaseOrderItem";
export * from "./ListPurchaseOrderItems";
export * from "./UpdatePurchaseOrderItem";

export namespace PurchaseOrderItemContracts {
  export type CreatePurchaseOrderItem = CreatePurchaseOrderItemContract;
  export type DeletePurchaseOrderItem = DeletePurchaseOrderItemContract;
  export type GetPurchaseOrderItem = GetPurchaseOrderItemContract;
  export type ListPurchaseOrderItems = ListPurchaseOrderItemsContract;
  export type UpdatePurchaseOrderItem = UpdatePurchaseOrderItemContract;
}
