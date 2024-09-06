import {
  InferApiContract,
  MutationContractSchema,
  QueryContractSchema,
} from "@hyulian/api-contract";
import { ApiContractClient } from "@hyulian/api-contract-client";

import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export type ApiContractClientOptions = {
  baseUrl: string;
};
export type QueryKeyFn<Query = any, Params = any> = (context: {
  query: Query;
  params: Params;
}) => string[];
export class ReactApiContractClient extends ApiContractClient {
  public constructor(options: ApiContractClientOptions) {
    super(options);
  }

  public registerMutationContract<
    TApiContractSchema extends MutationContractSchema
  >(
    contract: TApiContractSchema,
    options: Partial<
      UseMutationOptions<
        InferApiContract<TApiContractSchema>["response"],
        unknown, // Error type
        InferApiContract<TApiContractSchema>["body"]
      >
    > = {}
  ) {
    type Schema = InferApiContract<TApiContractSchema>;
    type Params = Schema["params"];
    type Body = Schema["body"];
    type Response = Schema["response"];

    const request = async (
      params: Params,
      body: Body,
      config: any = {}
    ): Promise<Response> => {
      return this.request<Response>({
        path: contract.path,
        params,
        body,
        ...config,
        method: contract.method,
      });
    };

    const useRequest = (params: Params = {}) => {
      return useMutation<Response, unknown, Body, unknown>({
        mutationFn: (data) => request(params, data),
        ...options,
      });
    };

    return {
      request,
      useRequest,
    };
  }

  public registerQueryContract<
    TQueryContractSchema extends QueryContractSchema
  >(
    contract: TQueryContractSchema,
    queryKeyFn: QueryKeyFn<any, any>, // Fixed type to accommodate query key which may include strings and other types
    options: Partial<
      UseQueryOptions<
        InferApiContract<TQueryContractSchema>["response"], // Success type
        unknown, // Error type
        InferApiContract<TQueryContractSchema>["response"] // Data type
      >
    > = {}
  ) {
    type Schema = InferApiContract<TQueryContractSchema>;
    type Params = Schema["params"];
    type Query = Schema["query"];
    type Response = Schema["response"];

    const request = async (
      params: Params,
      query: Query,
      config: any = {}
    ): Promise<Response> => {
      return this.request<Response>({
        path: contract.path,
        params: params,
        query,
        ...config,
        method: contract.method,
      });
    };

    const useRequest = (params: Params, query: Query) => {
      return useQuery<Response, unknown>({
        queryKey: queryKeyFn({ params, query }),
        queryFn: () => {
          return request(params, query);
        },
        ...options,
      });
    };

    return {
      request,
      useRequest,
    };
  }
}
