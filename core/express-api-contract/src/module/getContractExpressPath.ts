import { ApiContractSchema } from "@hyulian/api-contract";
import { stringRender, unslash } from "@hyulian/common";
import { createExpressParamsMap } from "~/module";

export function getContractExpressPath(contract: ApiContractSchema) {
  const paramsMap = createExpressParamsMap(contract.params);
  return `/${unslash(stringRender(contract.path, paramsMap))}`;
}
