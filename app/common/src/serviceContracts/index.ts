import { GetServerInfoContract } from "./GetServerInfo";
import { SessionContracts } from "./session";
import { MaterialContracts } from "./material";
import { SupplierContracts } from "./supplier";
import { CustomerContracts } from "./customer";
import { EnumContracts } from "./enum";
import { PurchaseOrderContracts } from "./purchaseOrder";
import { PurchaseOrderItemContracts } from "./purchaseOrderItem";

export * from "./session";
export * from "./GetServerInfo";
export * from "./material";
export * from "./enum";
export * from "./supplier";
export * from "./customer";
export * from "./purchaseOrder";
export * from "./purchaseOrderItem";

export namespace ServiceContracts {
  export import Session = SessionContracts;
  export import Material = MaterialContracts;
  export import Enum = EnumContracts;
  export import Supplier = SupplierContracts;
  export import Customer = CustomerContracts;
  export import PurchaseOrder = PurchaseOrderContracts;
  export import PurchaseOrderItem = PurchaseOrderItemContracts;
  export type GetServerInfo = GetServerInfoContract;
}
