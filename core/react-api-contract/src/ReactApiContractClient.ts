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

export type ReactApiContractClientQueryOptions = Omit<
  UseQueryOptions,
  "queryKey"
>;
export type ReactApiContractClientMutationOptions = UseMutationOptions<
  any,
  any,
  any
>;

export type QueryKeyFn = (
  params: unknown,
  query: unknown
) => (string | object)[];
export type ApiContractClientOptions = {
  baseUrl: string;
  queryOptions?: ReactApiContractClientQueryOptions;
  mutationOptions?: ReactApiContractClientMutationOptions;
};

export class ReactApiContractClient extends ApiContractClient {
  public queryOptions: ReactApiContractClientQueryOptions;
  public mutationOptions: ReactApiContractClientMutationOptions;

  public constructor(options: ApiContractClientOptions) {
    super(options);
    const { queryOptions, mutationOptions } = options;
    this.queryOptions = queryOptions || {};
    this.mutationOptions = mutationOptions || {};
  }

  public registerMutationContract<
    TMutationContractSchema extends MutationContractSchema
  >(
    contract: TMutationContractSchema,
    baseOptions: Partial<
      UseMutationOptions<
        InferApiContract<TMutationContractSchema>["response"],
        Error, // Error type
        InferApiContract<TMutationContractSchema>["body"]
      >
    > = {}
  ) {
    type Schema = InferApiContract<TMutationContractSchema>;
    type Params = Schema["params"];
    type Body = Schema["body"];
    type Response = Schema["response"];

    const request = async (
      params: Params,
      body: Body,
      config: any = {}
    ): Promise<Response> => {
      return this.contractRequest(contract, {
        path: contract.path,
        params,
        body,
        ...config,
        method: contract.method,
      });
    };

    const useRequest = (
      params: Params = {},
      options: Partial<
        UseMutationOptions<
          InferApiContract<TMutationContractSchema>["response"],
          Error, // Error type
          InferApiContract<TMutationContractSchema>["body"]
        >
      > = {}
    ) => {
      return useMutation<Response, Error, Body, unknown>({
        mutationFn: (data) => request(params, data),

        ...baseOptions,
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
    queryKeyFn: QueryKeyFn,
    baseOptions: Partial<
      UseQueryOptions<
        InferApiContract<TQueryContractSchema>["response"] | undefined,
        unknown,
        InferApiContract<TQueryContractSchema>["response"] | undefined
      >
    > = {}
  ) {
    type Schema = InferApiContract<TQueryContractSchema>;
    type Params = Schema["params"];
    type Query = Partial<Schema["query"]>;
    type Response = Schema["response"] | undefined;
    const self = this;

    const request = async (
      params: Params,
      query: Query,
      config: any = {}
    ): Promise<Response> => {
      return this.contractRequest(contract, {
        path: contract.path,
        params: params,
        query,
        ...config,
        method: contract.method,
      });
    };

    const useRequest = (
      params: Params,
      query: Query,
      options: Partial<
        UseQueryOptions<
          InferApiContract<TQueryContractSchema>["response"],
          unknown,
          InferApiContract<TQueryContractSchema>["response"]
        >
      > = {}
    ) => {
      return useQuery<Response, unknown>({
        ...(self.queryOptions as any),
        queryKey: queryKeyFn(params, query),
        queryFn: () => {
          return request(params, query);
        },
        ...baseOptions,
        ...options,
      });
    };

    return {
      request,
      useRequest,
    };
  }
}
