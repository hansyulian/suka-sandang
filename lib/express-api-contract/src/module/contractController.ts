import { ApiContractSchema } from "@hyulian/api-contract";

import { AtlasContractController, AtlasRouteContractController } from "./types";

export function contractController<
  TApiContractSchema extends ApiContractSchema
>(
  contract: TApiContractSchema,
  controller: AtlasRouteContractController<TApiContractSchema>
): AtlasContractController<TApiContractSchema> {
  return {
    contract,
    controller,
  };
}
