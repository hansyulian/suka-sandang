import { createExpressParamsMap } from "~/utils";

import { ApiContractSchema } from "@hyulian/api-contract";
import { stringRender, unslash } from "@hyulian/common";

export function getContractExpressPath(contract: ApiContractSchema) {
  const paramsMap = createExpressParamsMap(contract.params);
  return `/${unslash(stringRender(contract.path, paramsMap))}`;
}
