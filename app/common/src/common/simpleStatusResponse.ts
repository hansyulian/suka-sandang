import {
  ApiContractModelSpec,
  ApiContractResponseType,
} from "@hyulian/api-contract";

export const simpleStatusResponse = {
  responseType: "object" as ApiContractResponseType,
  model: {
    status: {
      type: "string",
    } as ApiContractModelSpec,
  },
};
