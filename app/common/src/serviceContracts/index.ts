import { GetServerInfoContract } from "./GetServerInfo";
import { SessionContracts } from "./session";
import { MaterialContracts } from "./material";

export * from "./session";
export * from "./GetServerInfo";
export * from "./material";

export namespace ServiceContracts {
  export import Session = SessionContracts;
  export import Material = MaterialContracts;
  export type GetServerInfo = GetServerInfoContract;
}
