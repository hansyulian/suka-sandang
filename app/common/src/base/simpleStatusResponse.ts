import {
  ApiContractModelSchema,
  ApiContractResponseType,
  SchemaType,
} from "@hyulian/api-contract";

export const simpleStatusResponse = {
  responseType: "object" as ApiContractResponseType,
  model: {
    status: {
      type: "string",
    },
  } as ApiContractModelSchema,
};
export type SimpleStatusResponse = SchemaType<
  (typeof simpleStatusResponse)["model"]
>;
export const simpleSuccessResponse: SimpleStatusResponse = {
  status: "success",
};
