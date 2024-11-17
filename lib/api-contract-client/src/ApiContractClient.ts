import axios from "axios";

import {
  ApiContractMethod,
  ApiContractSchema,
  MutationContractSchema,
  PaginatedArrayResponse,
  QueryContractSchema,
  validateSchema,
} from "@hyulian/api-contract";
import { stringRender } from "@hyulian/common";

export type ApiContractClientOptions = {
  baseUrl: string;
  headers?: Record<string, string>;
};

type RequestOptions = {
  path: string;
  params: Record<string, string | number>;
  method: ApiContractMethod;
  query?: Record<string, string | number>;
  headers?: Record<string, string>;
  body?: any;
};

export type ContractRequestOptions<
  TApiContractSchema extends ApiContractSchema
> = {
  params: TApiContractSchema["params"];
  headers?: Record<string, string>;
  query?: TApiContractSchema extends QueryContractSchema
    ? TApiContractSchema["query"]
    : never;
  body?: TApiContractSchema extends MutationContractSchema
    ? TApiContractSchema["body"]
    : never;
};

export class ApiContractClient {
  public options: ApiContractClientOptions;

  public constructor(options: ApiContractClientOptions) {
    this.options = {
      ...options,
      headers: {
        "content-type": "application/json",
        ...options.headers,
      },
    };
  }

  public async request<Response = any>(options: RequestOptions) {
    const { baseUrl, headers: baseHeaders } = this.options;
    const { path, params, method, body, query, headers, ...rest } = options;
    const url = stringRender(path, params);
    const axiosRequestConfig = {
      url,
      ...rest,
      baseURL: baseUrl,
      method,
      data: body,
      params: query,
      headers: {
        ...baseHeaders,
        ...headers,
      },
    };
    const result = await axios.request<Response>(axiosRequestConfig);
    return result.data;
  }

  public async contractRequest<TApiContractSchema extends ApiContractSchema>(
    contract: TApiContractSchema,
    contractOptions: ContractRequestOptions<TApiContractSchema>
  ) {
    const { path, method, model, responseType } = contract;
    const mutationContract = contract as MutationContractSchema;
    const queryContract = contract as QueryContractSchema;
    const { params, headers, body, query } = contractOptions;
    const validatedParams = validateSchema(params, contract.params).value;
    let validatedBody: any = undefined;
    if (method === "post" || method === "put") {
      if (mutationContract.bodyType === "array") {
        validatedBody = [];
        for (const record of body as any) {
          validatedBody.push(
            validateSchema(record, mutationContract.body).value
          );
        }
      } else {
        validatedBody = validateSchema(
          body as any,
          mutationContract.body
        ).value;
      }
    }
    const validatedQuery =
      contract.method === "get"
        ? validateSchema(query || {}, queryContract.query).value
        : undefined;
    const options = {
      path,
      method,
      headers,
      body: validatedBody,
      params: validatedParams,
      query: validatedQuery,
    };
    const result = await this.request(options);
    switch (responseType) {
      case "object":
        const validatedData = validateSchema(result as any, model).value;
        return validatedData;
      case "array":
      case "paginatedArray":
        const transformedData: any = {};
        transformedData.records = [];
        for (const record of (result as any).records) {
          transformedData.records.push(validateSchema(record, model).value);
        }
        if (responseType === "paginatedArray") {
          transformedData.info = (
            result as PaginatedArrayResponse<TApiContractSchema["model"]>
          ).info;
        }
        return transformedData;
    }
    // shouldn't be the case here
    return result as Response;
  }
}
