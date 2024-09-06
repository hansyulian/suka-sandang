import {
  BooleanSpec,
  EnumSpec,
  NumberSpec,
  SchemaType,
  StringSpec,
} from "../../schema";

export type ApiContractParamsSpec =
  | NumberSpec
  | StringSpec
  | EnumSpec
  | BooleanSpec;
export type ApiContractParamsSchema = Record<string, ApiContractParamsSpec>;
export type ApiContractPathFn<Params extends ApiContractParamsSchema> = (
  params: SchemaType<Params>
) => string;
