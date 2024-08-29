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

export class ReactApiContractClient extends ApiContractClient {
  public constructor(options: ApiContractClientOptions) {
    super(options);
  }

  public registerMutationContract<
    TApiContractSchema extends MutationContractSchema
  >(contract: TApiContractSchema, options: Partial<UseMutationOptions> = {}) {
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
        params: params,
        body,
        ...config,
        method: contract.method,
      });
    };

    const useRequest = (params: Params, query: Body) => {
      return useMutation({
        mutationFn: () => {
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

  public registerQueryContract<
    TQueryContractSchema extends QueryContractSchema
  >(
    contract: TQueryContractSchema,
    queryKey: string[],
    options: Partial<UseQueryOptions> = {}
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
      return useQuery({
        queryKey,
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
