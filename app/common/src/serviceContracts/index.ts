import { GetServerInfoContract } from "./GetServerInfo";
import { SessionContracts } from "./session";
import { MaterialContracts } from "./material";
import { SupplierContracts } from "./supplier";
import { EnumContracts } from "./enum";

export * from "./session";
export * from "./GetServerInfo";
export * from "./material";
export * from "./enum";
export * from "./supplier";

export namespace ServiceContracts {
  export import Session = SessionContracts;
  export import Material = MaterialContracts;
  export import Enum = EnumContracts;
  export import Supplier = SupplierContracts;
  export type GetServerInfo = GetServerInfoContract;
}
