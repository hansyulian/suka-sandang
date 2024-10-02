import { ApiContractModel } from "~/modules/apiContract/types/Contract";
import { Specs } from "../../schema";

export type ApiContractModelSpec = Specs;
export type ApiContractModelSchema = Record<string, ApiContractModelSpec>;
export function apiContractModelSchema<TModel extends ApiContractModelSchema>(
  modelSchema: TModel
) {
  return modelSchema;
}
